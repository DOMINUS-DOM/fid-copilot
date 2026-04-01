import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiChat } from "@/lib/ai/gemini";
import { searchGallilex, formatGallilexContext, findPivotArticles } from "@/lib/ai/gallilex";
import { buildSystemPrompt, buildUserMessage } from "@/lib/ai/prompt";
import { guardCitations } from "@/lib/ai/citation-guard";
import {
  type Document,
  type AssistantMode,
  type ConfidenceLevel,
  type GallilexHint,
  type LegalChunk,
} from "@/types";

const MAX_CONTEXT_DOCS = 7;
const MAX_LEGAL_CHUNKS = 5;
const MAX_CHUNK_CHARS = 8000; // budget total en chars pour les chunks
const VALID_MODES: AssistantMode[] = ["examen", "terrain", "portfolio"];

// ============================================================
// Détection de l'intention de la question
// ============================================================

type QuestionIntent = "juridique" | "portfolio" | "direction" | "organisation" | "general";

const INTENT_SIGNALS: Record<QuestionIntent, string[]> = {
  juridique: [
    "décret", "article", "loi", "code", "légal", "juridique", "droit",
    "obligation", "recours", "sanction", "discipline", "exclusion",
    "redoublement", "inscription", "renvoi", "absence", "congé",
    "nomination", "désignation", "statut", "barème", "ancienneté",
    "inspection", "audit", "contrôle", "plainte", "contestation",
    "pacte", "missions", "enseignement", "scolaire", "règlement",
    "circulaire", "arrêté", "royal", "gouvernement", "communauté",
  ],
  portfolio: [
    "portfolio", "réflexif", "réflexive", "posture", "identité",
    "professionnel", "développement", "bilan", "autoévaluation",
    "compétence", "acquis", "parcours", "progression", "trace",
  ],
  direction: [
    "directeur", "directrice", "direction", "chef", "pilotage",
    "leadership", "stratégique", "pédagogique", "managérial",
    "équipe", "personnel", "enseignant", "collaborateur",
    "communication", "sens", "vision", "projet", "établissement",
    "pouvoir organisateur",
  ],
  organisation: [
    "formation", "fid", "évaluation", "certificative", "examen",
    "épreuve", "module", "programme", "organisation", "calendrier",
    "méthodologie", "consigne", "critère", "grille",
  ],
  general: [],
};

function detectIntent(questionLower: string): QuestionIntent {
  let bestIntent: QuestionIntent = "general";
  let bestScore = 0;

  for (const [intent, signals] of Object.entries(INTENT_SIGNALS) as [QuestionIntent, string[]][]) {
    if (intent === "general") continue;
    let score = 0;
    for (const signal of signals) {
      if (questionLower.includes(signal)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent;
    }
  }

  return bestIntent;
}

// ============================================================
// Scoring des documents — adapté au mode
// ============================================================

/** L'intent est influencé par le mode sélectionné */
function resolveIntent(
  detectedIntent: QuestionIntent,
  mode: AssistantMode
): QuestionIntent {
  // Le mode force l'intent dans certains cas
  if (mode === "portfolio") return "portfolio";
  if (mode === "examen" && detectedIntent === "general") return "juridique";
  return detectedIntent;
}

const CATEGORY_INTENT_BOOST: Record<QuestionIntent, Record<string, number>> = {
  juridique: {
    incontournable_commun: 8,
    incontournable_secondaire_specialise: 6,
    synthese: 4,
    fonction_direction: 1,
    organisation: 0,
    portfolio: 0,
  },
  portfolio: {
    portfolio: 10,
    fonction_direction: 4,
    synthese: 2,
    incontournable_commun: 0,
    incontournable_secondaire_specialise: 0,
    organisation: 0,
  },
  direction: {
    fonction_direction: 10,
    incontournable_commun: 3,
    synthese: 2,
    incontournable_secondaire_specialise: 2,
    organisation: 1,
    portfolio: 1,
  },
  organisation: {
    organisation: 10,
    synthese: 3,
    fonction_direction: 2,
    incontournable_commun: 1,
    incontournable_secondaire_specialise: 1,
    portfolio: 0,
  },
  general: {
    incontournable_commun: 4,
    synthese: 3,
    fonction_direction: 2,
    incontournable_secondaire_specialise: 2,
    organisation: 1,
    portfolio: 1,
  },
};

function scoreDocument(
  doc: Document,
  keywords: string[],
  intent: QuestionIntent
): number {
  let score = 0;

  // 1. Boost catégorie
  score += CATEGORY_INTENT_BOOST[intent]?.[doc.category] ?? 0;

  // 2. is_core
  if (doc.is_core) score += 4;

  // 3. Boost type selon intent
  const typeBoosts: Record<string, Record<string, number>> = {
    juridique: { texte_legal: 3 },
    portfolio: { portfolio: 3, guide: 1 },
    direction: { guide: 2, synthese: 1 },
    organisation: { methodologie: 3, organisation: 3, guide: 1 },
    general: { texte_legal: 1, synthese: 1 },
  };
  score += typeBoosts[intent]?.[doc.type] ?? 0;

  // 4. CDA bonus
  if (doc.cda_code && (intent === "juridique" || intent === "general")) score += 2;

  // 5. Keywords (title > tags > summary)
  const titleLower = doc.title.toLowerCase();
  const summaryLower = (doc.summary ?? "").toLowerCase();
  const docTags = (doc.tags ?? []).map((t) => t.toLowerCase());

  for (const keyword of keywords) {
    if (titleLower.includes(keyword)) score += 5;
    if (docTags.some((tag) => tag.includes(keyword))) score += 3;
    if (summaryLower.includes(keyword)) score += 2;
  }

  return score;
}

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
// Gallilex fallback
// ============================================================

function buildGallilexHints(
  selectedDocs: Document[],
  keywords: string[]
): GallilexHint[] {
  // Prendre les 2 docs les plus pertinents qui ont un CDA
  const docsWithCda = selectedDocs.filter((d) => d.cda_code);
  const topDocs = docsWithCda.slice(0, 2);

  // Si aucun doc avec CDA, proposer des mots-clés généraux
  if (topDocs.length === 0) {
    return [
      {
        text: "Recherche générale",
        cda_code: null,
        keywords: keywords.slice(0, 5),
      },
    ];
  }

  return topDocs.map((doc) => ({
    text: doc.title,
    cda_code: doc.cda_code,
    keywords: keywords.slice(0, 3),
  }));
}

// ============================================================
// Route handler
// ============================================================

export async function POST(request: Request) {
  try {
    // 1. Auth
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // 2. Body
    const body = await request.json();
    const question = body.question?.trim();
    const mode: AssistantMode = VALID_MODES.includes(body.mode) ? body.mode : "examen";

    if (!question) {
      return NextResponse.json({ error: "Question manquante" }, { status: 400 });
    }

    // 2b. Log (insert now, update response later)
    const { data: logRow } = await supabase
      .from("assistant_logs")
      .insert({ user_id: user.id, question })
      .select("id")
      .single();

    // 3. Documents
    const { data: allDocuments } = await supabase
      .from("documents")
      .select("*")
      .order("is_core", { ascending: false })
      .returns<Document[]>();

    if (!allDocuments || allDocuments.length === 0) {
      return NextResponse.json(
        { error: "Aucun document de référence disponible" },
        { status: 500 }
      );
    }

    // 4. Intent + scoring (influencé par le mode)
    const questionLower = question.toLowerCase();
    const rawIntent = detectIntent(questionLower);
    const intent = resolveIntent(rawIntent, mode);
    const keywords = extractKeywords(question);

    const scored = allDocuments
      .map((doc) => ({ doc, score: scoreDocument(doc, keywords, intent) }))
      .sort((a, b) => b.score - a.score);

    const relevant = scored.filter((s) => s.score > 0);
    const selectedDocs =
      relevant.length > 0
        ? relevant.slice(0, MAX_CONTEXT_DOCS).map((s) => s.doc)
        : allDocuments.slice(0, 5);

    // 5. Recherche de chunks légaux pertinents (full-text PostgreSQL)
    // Use BOTH document CDA codes AND Gallilex-identified CDA codes
    const docCdaCodes = selectedDocs
      .map((d) => d.cda_code)
      .filter(Boolean) as string[];

    // Gallilex mapping: find additional relevant CDA codes from the theme index
    const gallilexResults = searchGallilex(keywords, docCdaCodes);
    const gallilexCdaCodes = gallilexResults.map((r) => r.cdaCode);

    // Merge: document CDAs + Gallilex CDAs (deduplicated)
    const allCdaCodes = [...new Set([...docCdaCodes, ...gallilexCdaCodes])];

    let legalExtracts = "";
    const allChunks: LegalChunk[] = [];

    if (allCdaCodes.length > 0 && keywords.length > 0) {
      // Construire la requête full-text avec les mots-clés
      const tsQuery = keywords.slice(0, 5).join(" | ");

      const { data: chunks } = await supabase
        .from("legal_chunks")
        .select("cda_code, chunk_title, content, citation_display, article_number, paragraph")
        .in("cda_code", allCdaCodes)
        .textSearch("content", tsQuery, { config: "french" })
        .limit(MAX_LEGAL_CHUNKS + 3) // Allow more chunks since we search more CDAs
        .returns<LegalChunk[]>();

      // Pivot article injection: fetch known-critical articles by article_number
      // This ensures FID exam pivot articles appear even if FTS doesn't rank them
      const pivotArticles = findPivotArticles(keywords);
      let pivotChunks: LegalChunk[] = [];
      if (pivotArticles.length > 0) {
        const pivotQueries = pivotArticles.map((p) =>
          supabase
            .from("legal_chunks")
            .select("cda_code, chunk_title, content, citation_display, article_number, paragraph")
            .eq("cda_code", p.cdaCode)
            .eq("article_number", p.articleNumber)
            .limit(1)
            .returns<LegalChunk[]>()
        );
        const pivotResults = await Promise.all(pivotQueries);
        for (const { data } of pivotResults) {
          if (data && data.length > 0) {
            pivotChunks.push(data[0]);
          }
        }
      }

      // Merge: pivot chunks first (deduplicated), then FTS chunks
      const seenArticles = new Set<string>();

      // Add pivot chunks first (highest priority)
      for (const pc of pivotChunks) {
        const key = `${pc.cda_code}:${pc.article_number}`;
        if (!seenArticles.has(key)) {
          seenArticles.add(key);
          allChunks.push(pc);
        }
      }

      // Add FTS chunks (dedup against pivots)
      if (chunks) {
        for (const c of chunks) {
          const key = `${c.cda_code}:${c.article_number}`;
          if (!seenArticles.has(key)) {
            seenArticles.add(key);
            allChunks.push(c);
          }
        }
      }

      if (allChunks.length > 0) {
        let totalChars = 0;
        const kept: typeof allChunks = [];
        for (const chunk of allChunks) {
          if (totalChars + chunk.content.length > MAX_CHUNK_CHARS) break;
          kept.push(chunk);
          totalChars += chunk.content.length;
        }

        if (kept.length > 0) {
          legalExtracts = kept
            .map((c, idx) => {
              const lines: string[] = [`[LEGAL-${idx + 1}]`];
              if (c.citation_display) {
                lines.push(`Citation exacte : ${c.citation_display}`);
              }
              lines.push(`CDA : ${c.cda_code}`);
              if (c.article_number) {
                lines.push(`Article : ${c.article_number}${c.paragraph ? ` § ${c.paragraph}` : ""}`);
              }
              lines.push(`Extrait : ${c.content}`);
              return lines.join("\n");
            })
            .join("\n\n---\n\n");
        }
      }
    }

    // 5c. Recherche de documents d'école (contexte local de l'utilisateur)
    const MAX_SCHOOL_CHUNKS = 3;
    const MAX_SCHOOL_CHARS = 4000;
    let schoolExtracts = "";

    if (keywords.length > 0) {
      const schoolTsQuery = keywords.slice(0, 5).join(" | ");

      const { data: schoolChunks } = await supabase
        .from("school_chunks")
        .select("chunk_title, content, school_doc_id")
        .eq("user_id", user.id)
        .textSearch("content", schoolTsQuery, { config: "french" })
        .limit(MAX_SCHOOL_CHUNKS);

      if (schoolChunks && schoolChunks.length > 0) {
        let schoolTotalChars = 0;
        const keptSchool: typeof schoolChunks = [];
        for (const chunk of schoolChunks) {
          if (schoolTotalChars + chunk.content.length > MAX_SCHOOL_CHARS) break;
          keptSchool.push(chunk);
          schoolTotalChars += chunk.content.length;
        }

        if (keptSchool.length > 0) {
          // Fetch parent doc titles
          const docIds = [...new Set(keptSchool.map((c) => c.school_doc_id))];
          const { data: parentDocs } = await supabase
            .from("school_documents")
            .select("id, title, doc_type")
            .in("id", docIds);

          const docMap = new Map(
            parentDocs?.map((d: { id: string; title: string; doc_type: string }) => [d.id, d]) ?? []
          );

          schoolExtracts = keptSchool
            .map((c) => {
              const parent = docMap.get(c.school_doc_id);
              const label = parent
                ? `${parent.title} (${parent.doc_type})`
                : "Document école";
              return `[ÉCOLE — ${label}${c.chunk_title ? ` — ${c.chunk_title}` : ""}]\n${c.content}`;
            })
            .join("\n\n---\n\n");
        }
      }
    }

    // 6. Gemini (avec mode + extraits légaux + contexte école)
    const systemPrompt = buildSystemPrompt(selectedDocs, mode);
    let userMsg = buildUserMessage(question, mode);

    if (legalExtracts) {
      userMsg += `\n\n═══════════════════════════════════════\nEXTRAITS JURIDIQUES PERTINENTS (texte officiel)\n═══════════════════════════════════════\n${legalExtracts}`;
    }

    if (schoolExtracts) {
      userMsg += `\n\n═══════════════════════════════════════\nCONTEXTE LOCAL — DOCUMENTS DE L'ÉCOLE (informatif, NE REMPLACE PAS la loi)\n═══════════════════════════════════════\n${schoolExtracts}`;
    }

    // 6b. Gallilex — add reference context (already computed above)
    const gallilexContext = formatGallilexContext(gallilexResults, docCdaCodes);
    if (gallilexContext) {
      userMsg += gallilexContext;
    }

    const t0 = Date.now();
    const aiResult = await geminiChat({
      systemPrompt,
      userMessage: userMsg,
      temperature: 0.15,
      maxTokens: 3500,
    });
    const latencyMs = Date.now() - t0;

    const answer = aiResult.text;

    if (!answer) {
      return NextResponse.json(
        { error: "Réponse vide du modèle" },
        { status: 500 }
      );
    }

    // 6c. Citation guard — validate article references against injected context
    const contextArticleNumbers = allChunks
      .map((c: LegalChunk) => c.article_number)
      .filter(Boolean) as string[];
    const guardResult = guardCitations(answer, contextArticleNumbers);
    const sanitizedAnswer = guardResult.sanitizedAnswer;

    if (guardResult.hadUnverifiedCitations) {
      console.warn(
        "[Citation Guard] Unverified citations flagged:",
        guardResult.citationsUnverified,
        "| Verified:",
        guardResult.citationsVerified
      );
    }

    // 7. Sources
    const sources = selectedDocs.map((doc) => ({
      title: doc.title,
      cda_code: doc.cda_code,
      category: doc.category,
      source_url: doc.source_url,
    }));

    // 8. Confiance
    const coreCount = selectedDocs.filter((d) => d.is_core).length;
    const legalCount = selectedDocs.filter((d) => d.type === "texte_legal").length;
    const topScore = relevant.length > 0 ? relevant[0].score : 0;

    let confidence: ConfidenceLevel;
    if (
      (relevant.length >= 3 && coreCount >= 1) ||
      (relevant.length >= 2 && legalCount >= 2 && topScore >= 10)
    ) {
      confidence = "high";
    } else if (relevant.length >= 1 && topScore >= 5) {
      confidence = "medium";
    } else {
      confidence = "low";
    }

    // 9. Gallilex hints (si confiance faible ou moyenne)
    const gallilex: GallilexHint[] =
      confidence !== "high" ? buildGallilexHints(selectedDocs, keywords) : [];

    // 10. Build pipeline metadata for audit trail
    const pipelineMetadata = {
      cdaRouted: allCdaCodes,
      pivotArticles: findPivotArticles(keywords).map((p) => `${p.cdaCode}:${p.articleNumber}`),
      articlesSentToLlm: contextArticleNumbers,
      model: aiResult.model,
      confidence,
      latencyMs,
      citationGuard: {
        verified: guardResult.citationsVerified,
        unverified: guardResult.citationsUnverified,
      },
    };

    // Update log with response + metadata
    if (logRow?.id) {
      await supabase
        .from("assistant_logs")
        .update({ response: sanitizedAnswer, metadata: pipelineMetadata })
        .eq("id", logRow.id);
    }

    return NextResponse.json({
      answer: sanitizedAnswer,
      sources,
      confidence,
      gallilex,
      mode,
      schoolContextUsed: schoolExtracts.length > 0,
      citationGuard: guardResult.hadUnverifiedCitations
        ? {
            unverified: guardResult.citationsUnverified,
            verified: guardResult.citationsVerified,
          }
        : undefined,
    });
  } catch (error) {
    console.error("[API /assistant]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
