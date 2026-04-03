/**
 * FID-Copilot — Integration tests for the API pipeline.
 *
 * These tests replicate the real /api/assistant and /api/decision pipelines:
 *   ✅ Real Supabase queries (documents, legal_chunks)
 *   ✅ Real Gallilex routing + pivot injection
 *   ✅ Real prompt building
 *   🔶 LLM is NOT called — we verify the context sent to it
 *
 * What's mocked:
 *   - Auth (no cookies/user session)
 *   - LLM call (geminiChat) — we capture the prompt instead
 *   - assistant_logs / decisions writes (no user_id)
 *
 * What's real:
 *   - Supabase REST queries to documents, legal_chunks
 *   - Gallilex CDA routing + pivot article injection
 *   - Prompt building (buildSystemPrompt, buildUserMessage)
 *   - Keyword extraction, intent detection, document scoring
 *
 * Run: npm test -- api-integration
 */

import { describe, it, expect } from "vitest";
import {
  searchGallilex,
  formatGallilexContext,
  findPivotArticles,
  CDA_REGISTRY,
} from "@/lib/ai/gallilex";
import { buildSystemPrompt, buildUserMessage } from "@/lib/ai/prompt";
import { type Document, type LegalChunk, type AssistantMode } from "@/types";

// ============================================================
// Supabase REST client (same as the real app, minus auth)
// ============================================================

const SUPABASE_URL = "https://lxkmufsfehpkudpxkzxr.supabase.co";
const SUPABASE_KEY = "sb_publishable_9iToG5wloKgjpEWD2-8Plw_E72IoRLW";

async function supabaseGet<T>(endpoint: string): Promise<T[]> {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!resp.ok) return [];
  return resp.json();
}

// ============================================================
// Replicate extractKeywords from route.ts
// ============================================================

function extractKeywords(question: string): string[] {
  const stopWords = new Set([
    "le", "la", "les", "un", "une", "des", "de", "du", "au", "aux",
    "et", "ou", "en", "dans", "par", "pour", "sur", "avec", "qui",
    "que", "est", "sont", "son", "ses", "ce", "cette", "ces", "mon",
    "ma", "mes", "il", "elle", "je", "nous", "vous", "ils", "elles",
    "ne", "pas", "plus", "peut", "faire", "fait", "être", "avoir",
    "quels", "quel", "quelle", "quelles", "comment", "quoi",
    "tant", "comme", "entre", "vers", "chez", "sans", "sous",
    "doit", "dois", "doivent", "faut", "pourquoi",
  ]);
  return question
    .toLowerCase()
    .replace(/['']/g, " ")
    .replace(/[^a-zàâäéèêëïîôùûüÿç\s-]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

// ============================================================
// Replicate the full pipeline (assistant route logic)
// ============================================================

interface PipelineResult {
  /** Keywords extracted from the question */
  keywords: string[];
  /** CDA codes identified (from docs + Gallilex) */
  cdaCodes: string[];
  /** Pivot articles injected */
  pivotArticles: { cdaCode: string; articleNumber: string }[];
  /** Legal chunks fetched (pivot + FTS merged) */
  legalChunks: LegalChunk[];
  /** The full system prompt */
  systemPrompt: string;
  /** The full user message (includes legal extracts) */
  userMessage: string;
  /** All article numbers present in the legal context */
  articleNumbers: string[];
}

async function runPipeline(
  question: string,
  mode: AssistantMode = "examen"
): Promise<PipelineResult> {
  const keywords = extractKeywords(question);

  // 1. Fetch documents (same as route)
  const allDocuments = await supabaseGet<Document>(
    "documents?select=*&order=is_core.desc"
  );

  // 2. Score documents (simplified — use keyword matching)
  const scored = allDocuments
    .map((doc) => {
      let score = doc.is_core ? 4 : 0;
      if (doc.cda_code) score += 2;
      const titleLower = doc.title.toLowerCase();
      const docTags = (doc.tags ?? []).map((t) => t.toLowerCase());
      for (const kw of keywords) {
        if (titleLower.includes(kw)) score += 5;
        if (docTags.some((tag) => tag.includes(kw))) score += 3;
      }
      return { doc, score };
    })
    .sort((a, b) => b.score - a.score);

  const selectedDocs = scored
    .filter((s) => s.score > 0)
    .slice(0, 7)
    .map((s) => s.doc);

  // 3. Gallilex routing
  const docCdaCodes = selectedDocs
    .map((d) => d.cda_code)
    .filter(Boolean) as string[];
  const gallilexResults = searchGallilex(keywords, docCdaCodes);
  const allCdaCodes = [
    ...new Set([...docCdaCodes, ...gallilexResults.map((r) => r.cdaCode)]),
  ];

  // 4. FTS search on legal_chunks
  let ftsChunks: LegalChunk[] = [];
  if (allCdaCodes.length > 0 && keywords.length > 0) {
    const tsQuery = keywords.slice(0, 5).join(" | ");
    const cdaFilter = allCdaCodes.join(",");
    ftsChunks = await supabaseGet<LegalChunk>(
      `legal_chunks?cda_code=in.(${cdaFilter})&content=wfts(french).${encodeURIComponent(tsQuery)}&select=id,cda_code,chunk_index,chunk_title,content,citation_display,article_number,paragraph,source_title,source_short_title,tags,topics,education_level&limit=8`
    );
  }

  // 5. Pivot article injection
  const pivots = findPivotArticles(keywords);
  const pivotChunks: LegalChunk[] = [];
  for (const p of pivots) {
    const chunks = await supabaseGet<LegalChunk>(
      `legal_chunks?cda_code=eq.${p.cdaCode}&article_number=eq.${encodeURIComponent(p.articleNumber)}&select=id,cda_code,chunk_index,chunk_title,content,citation_display,article_number,paragraph,source_title,source_short_title,tags,topics,education_level&limit=1&order=chunk_index.asc`
    );
    if (chunks.length > 0) pivotChunks.push(chunks[0]);
  }

  // 6. Merge: pivots first, then FTS (dedup)
  const merged: LegalChunk[] = [];
  const seen = new Set<string>();
  for (const c of pivotChunks) {
    const key = `${c.cda_code}:${c.article_number}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(c);
    }
  }
  for (const c of ftsChunks) {
    const key = `${c.cda_code}:${c.article_number}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(c);
    }
  }

  // 7. Build prompts
  const systemPrompt = buildSystemPrompt(selectedDocs, mode);
  let userMsg = buildUserMessage(question, mode);

  // Build legal extracts (same format as route.ts)
  if (merged.length > 0) {
    let totalChars = 0;
    const kept: LegalChunk[] = [];
    for (const chunk of merged) {
      if (totalChars + chunk.content.length > 8000) break;
      kept.push(chunk);
      totalChars += chunk.content.length;
    }

    if (kept.length > 0) {
      const legalExtracts = kept
        .map((c, idx) => {
          const lines: string[] = [`[LEGAL-${idx + 1}]`];
          if (c.citation_display) lines.push(`Citation exacte : ${c.citation_display}`);
          lines.push(`CDA : ${c.cda_code}`);
          if (c.article_number) {
            lines.push(`Article : ${c.article_number}${c.paragraph ? ` § ${c.paragraph}` : ""}`);
          }
          lines.push(`Extrait : ${c.content}`);
          return lines.join("\n");
        })
        .join("\n\n---\n\n");

      userMsg += `\n\n═══════════════════════════════════════\nEXTRAITS JURIDIQUES PERTINENTS (texte officiel)\n═══════════════════════════════════════\n${legalExtracts}`;
    }
  }

  const articleNumbers = merged.map((c) => c.article_number).filter(Boolean) as string[];

  return {
    keywords,
    cdaCodes: allCdaCodes,
    pivotArticles: pivots.map((p) => ({ cdaCode: p.cdaCode, articleNumber: p.articleNumber })),
    legalChunks: merged,
    systemPrompt,
    userMessage: userMsg,
    articleNumbers,
  };
}

// ============================================================
// TEST SUITE
// ============================================================

describe("API Integration — /api/assistant pipeline", () => {
  // ─── 1. Voeren / Fourons ───
  it("Q1: Voeren — routes to CDA 4329, art. 6", async () => {
    const result = await runPipeline(
      "Dans une école francophone de Fourons/Voeren, une inscription est demandée pour un enfant dont les grands-parents résident dans la commune, mais pas les parents. Quelle attitude adopter ?"
    );

    expect(result.cdaCodes).toContain("4329");
    // The concordance warning for Voeren is in the system prompt (pièges fréquents)
    expect(result.systemPrompt.toLowerCase()).toContain("chef de famille");
  });

  // ─── 2. Indice socio-économique ───
  it("Q2: ISE — routes to CDA 34295", async () => {
    const result = await runPipeline(
      "Quels sont les critères pris en compte pour déterminer l'indice socio-économique d'une implantation scolaire ?"
    );

    expect(result.cdaCodes).toContain("34295");
  });

  // ─── 3. Exclusion 15 janvier + subventions ───
  it("Q3: Exclusion 15 janvier — CDA 5108, concordance art. 73", async () => {
    const result = await runPipeline(
      "Un élève est exclu définitivement après le 15 janvier. L'école perd-elle les subventions de fonctionnement pour cet élève ?"
    );

    expect(result.cdaCodes).toContain("5108");
    // The prompt must contain the concordance warning about art. 73
    expect(result.systemPrompt).toContain("73 §2bis");
  });

  // ─── 4. Relevé des absences ───
  it("Q4: Absences — CDA 49466, art. 1.7.1-9 in context", async () => {
    const result = await runPipeline(
      "La direction peut-elle exiger un relevé des absences à chaque heure de cours ?"
    );

    expect(result.cdaCodes).toContain("49466");
    expect(result.articleNumbers).toContain("1.7.1-9");
    expect(result.userMessage).toContain("1.7.1-9");
  });

  // ─── 5. Aménagements raisonnables ───
  it("Q5: Aménagements raisonnables — CDA 49466, art. 1.7.8-1 in context", async () => {
    const result = await runPipeline(
      "Quels types d'aménagements raisonnables peuvent être accordés à un élève à besoins spécifiques ?"
    );

    expect(result.cdaCodes).toContain("49466");
    expect(result.articleNumbers).toContain("1.7.8-1");
    expect(result.userMessage.toLowerCase()).toContain("aménagements raisonnables");
  });

  // ─── 6. Exclusion / écartement ───
  it("Q6: Exclusion/écartement — CDA 49466, art. 1.7.9-4 + 1.7.9-5 in context", async () => {
    const result = await runPipeline(
      "Une exclusion définitive ou un écartement immédiat est-il possible ?"
    );

    expect(result.cdaCodes).toContain("49466");
    expect(result.articleNumbers).toContain("1.7.9-4");
    expect(result.articleNumbers).toContain("1.7.9-5");
    expect(result.userMessage).toContain("exclusion");
  });

  // ─── 7. Parents et DAccE ───
  it("Q7: DAccE parents — CDA 49466, art. 1.10.2-2 + 1.10.3-1 in context", async () => {
    const result = await runPipeline(
      "Les parents ont-ils accès au DAccE de leur enfant ? Quelles données y figurent ?"
    );

    expect(result.cdaCodes).toContain("49466");
    // At least the DAccE articles should be injected as pivots
    const daccArticles = result.articleNumbers.filter((a) =>
      a.startsWith("1.10.")
    );
    expect(daccArticles.length).toBeGreaterThanOrEqual(2);
    expect(result.userMessage.toLowerCase()).toContain("dacce");
  });
});

describe("API Integration — /api/decision pipeline", () => {
  // Decision uses the same Supabase + Gallilex pipeline
  // We test with discipline and personnel categories

  it("Discipline situation — routes to exclusion articles", async () => {
    const result = await runPipeline(
      "Un élève a frappé un enseignant dans la cour de récréation. Le PO me demande de procéder à une exclusion immédiate. Quelle procédure suivre ?"
    );

    expect(result.cdaCodes).toContain("49466");
    // Should have exclusion articles via pivot injection
    const hasExclusion = result.articleNumbers.some((a) =>
      a.startsWith("1.7.9-")
    );
    expect(hasExclusion).toBe(true);
  });

  it("Harcèlement situation — routes to CDA 45031", async () => {
    const result = await runPipeline(
      "Un enseignant se plaint de harcèlement moral de la part d'un collègue. Il demande à voir la personne de confiance. Que dois-je faire ?"
    );

    expect(result.cdaCodes).toContain("45031");
    expect(result.articleNumbers).toContain("32sexies");
  });
});

describe("API Integration — prompt quality", () => {
  it("system prompt contains anti-hallucination rule", async () => {
    const result = await runPipeline(
      "Un élève peut-il être exclu définitivement ?"
    );
    expect(result.systemPrompt).toContain("INTERDICTION ABSOLUE");
    expect(result.systemPrompt).toContain("0 à l'examen");
  });

  it("system prompt contains concordance warnings", async () => {
    const result = await runPipeline(
      "Quels frais scolaires peuvent être demandés ?"
    );
    expect(result.systemPrompt).toContain("CONCORDANCES LÉGALES");
    expect(result.systemPrompt).toContain("73 §2bis");
    expect(result.systemPrompt).toContain("AR du 29/06/1984");
  });

  it("legal extracts use [LEGAL-N] format", async () => {
    const result = await runPipeline(
      "Les parents ont-ils accès au DAccE ?"
    );
    expect(result.userMessage).toContain("[LEGAL-1]");
    expect(result.userMessage).toContain("Citation exacte");
    expect(result.userMessage).toContain("CDA : 49466");
  });

  it("legal extracts respect 8000 char budget", async () => {
    const result = await runPipeline(
      "Quels sont les droits et obligations du directeur en matière de discipline, d'exclusion, de DAccE, de frais scolaires et d'aménagements raisonnables ?"
    );
    // Extract the legal section
    const legalStart = result.userMessage.indexOf("EXTRAITS JURIDIQUES PERTINENTS");
    if (legalStart >= 0) {
      const legalSection = result.userMessage.substring(legalStart);
      expect(legalSection.length).toBeLessThan(12000); // Some overhead for headers
    }
  });
});

describe("API Integration — pivot injection effectiveness", () => {
  const pivotCases = [
    {
      question: "Quels frais scolaires peuvent être demandés ?",
      expectedPivot: "1.7.2-2",
    },
    {
      question: "La direction peut-elle exiger un relevé des absences ?",
      expectedPivot: "1.7.1-9",
    },
    {
      question: "Quels aménagements raisonnables existent ?",
      expectedPivot: "1.7.8-1",
    },
    {
      question: "Procédure d'exclusion définitive ?",
      expectedPivot: "1.7.9-4",
    },
    {
      question: "Qui a accès au DAccE ?",
      expectedPivot: "1.10.3-1",
    },
    {
      question: "Responsabilités pour les évaluations externes ?",
      expectedPivot: "1.6.3-10",
    },
    {
      question: "Règlement des études par implantation ?",
      expectedPivot: "1.5.1-8",
    },
  ];

  for (const { question, expectedPivot } of pivotCases) {
    it(`"${question.substring(0, 40)}..." → art. ${expectedPivot} injected`, async () => {
      const result = await runPipeline(question);
      // The pivot must be detected by findPivotArticles
      const pivotDetected = result.pivotArticles.some(
        (p) => p.articleNumber === expectedPivot
      );
      // Or appear in the article numbers sent to the LLM
      const inContext = result.articleNumbers.includes(expectedPivot);
      expect(pivotDetected || inContext).toBe(true);
    });
  }
});

// ============================================================
// 4 cas partiels + missions prioritaires — pipeline complet
// ============================================================

describe("API Integration — 5 nouveaux cas (partiels → sécurisés)", () => {
  it("Changement d'option après 15/11 — CDA 10450, art. 12 + 19", async () => {
    const result = await runPipeline(
      "Un élève de 4e secondaire souhaite changer d'option après le 15 novembre. Est-ce possible ?"
    );
    expect(result.cdaCodes).toContain("10450");
    const pivotDetected = result.pivotArticles.some(
      (p) => p.cdaCode === "10450" && (p.articleNumber === "12" || p.articleNumber === "19")
    );
    expect(pivotDetected).toBe(true);
  });

  it("Périodes de 45 minutes — CDA 10450, art. 1er §2", async () => {
    const result = await runPipeline(
      "Les périodes de cours doivent-elles durer 50 minutes ou peut-on les réduire à 45 minutes ?"
    );
    expect(result.cdaCodes).toContain("10450");
    const pivotDetected = result.pivotArticles.some(
      (p) => p.cdaCode === "10450" && p.articleNumber === "1er"
    );
    expect(pivotDetected).toBe(true);
  });

  it("DASPA / primo-arrivants — CDA 46275, art. 2 + 3", async () => {
    const result = await runPipeline(
      "Un élève primo-arrivant se présente à l'école. Quelles sont les conditions pour l'intégrer dans un DASPA ?"
    );
    expect(result.cdaCodes).toContain("46275");
    const pivotDetected = result.pivotArticles.some(
      (p) => p.cdaCode === "46275" && (p.articleNumber === "2" || p.articleNumber === "3")
    );
    expect(pivotDetected).toBe(true);
    expect(result.articleNumbers).toContain("2");
  });

  it("Obligation scolaire à temps plein — CDA 9547, art. 1er", async () => {
    const result = await runPipeline(
      "À partir de quel âge l'obligation scolaire à temps plein s'applique-t-elle ?"
    );
    expect(result.cdaCodes).toContain("9547");
    const pivotDetected = result.pivotArticles.some(
      (p) => p.cdaCode === "9547" && p.articleNumber === "1er"
    );
    expect(pivotDetected).toBe(true);
  });

  it("Missions prioritaires — CDA 21557, art. 6", async () => {
    const result = await runPipeline(
      "Quelles sont les missions prioritaires de l'enseignement définies par le décret ?"
    );
    expect(result.cdaCodes).toContain("21557");
    const pivotDetected = result.pivotArticles.some(
      (p) => p.cdaCode === "21557" && p.articleNumber === "6"
    );
    expect(pivotDetected).toBe(true);
    expect(result.articleNumbers).toContain("6");
    // Verify the article content is in the user message
    expect(result.userMessage.toLowerCase()).toContain("objectifs");
  });
});
