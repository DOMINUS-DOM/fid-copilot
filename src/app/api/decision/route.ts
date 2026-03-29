import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import {
  buildDecisionSystemPrompt,
  buildDecisionUserMessage,
} from "@/lib/ai/decision-prompt";
import {
  type Document,
  type DecisionCategory,
  type DecisionUrgency,
  type LegalChunk,
} from "@/types";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  return new OpenAI({ apiKey });
}

const MAX_CONTEXT_DOCS = 7;
const MAX_LEGAL_CHUNKS = 5;
const MAX_CHUNK_CHARS = 8000;
const MAX_SCHOOL_CHUNKS = 3;
const MAX_SCHOOL_CHARS = 4000;

const VALID_CATEGORIES: DecisionCategory[] = [
  "recours", "discipline", "personnel", "inspection", "parents", "autre",
];
const VALID_URGENCIES: DecisionUrgency[] = ["immediat", "semaine", "planifier"];

// Simplified keyword extraction (reuse pattern from assistant)
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "le", "la", "les", "un", "une", "des", "de", "du", "au", "aux",
    "et", "ou", "en", "dans", "par", "pour", "sur", "avec", "qui",
    "que", "est", "sont", "son", "ses", "ce", "cette", "ces", "mon",
    "ma", "mes", "il", "elle", "je", "nous", "vous", "ils", "elles",
    "ne", "pas", "plus", "peut", "faire", "fait", "être", "avoir",
    "comment", "quoi", "doit", "faut", "pourquoi",
  ]);
  return text
    .toLowerCase()
    .replace(/['']/g, " ")
    .replace(/[^a-zàâäéèêëïîôùûüÿç\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

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
    const situation = body.situation?.trim();
    const category: DecisionCategory | null = VALID_CATEGORIES.includes(body.category)
      ? body.category
      : null;
    const urgency: DecisionUrgency | null = VALID_URGENCIES.includes(body.urgency)
      ? body.urgency
      : null;

    if (!situation || situation.length < 20) {
      return NextResponse.json(
        { error: "Décrivez votre situation en au moins quelques phrases." },
        { status: 400 }
      );
    }

    // 3. Log
    const { data: logRow } = await supabase
      .from("assistant_logs")
      .insert({ user_id: user.id, question: `[decision] ${situation.slice(0, 200)}` })
      .select("id")
      .single();

    // 4. Documents
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

    // 5. Keyword scoring + document selection
    const keywords = extractKeywords(situation);
    const scored = allDocuments
      .map((doc) => {
        let score = doc.is_core ? 4 : 0;
        const titleLower = doc.title.toLowerCase();
        const summaryLower = (doc.summary ?? "").toLowerCase();
        const docTags = (doc.tags ?? []).map((t) => t.toLowerCase());
        for (const kw of keywords) {
          if (titleLower.includes(kw)) score += 5;
          if (docTags.some((t) => t.includes(kw))) score += 3;
          if (summaryLower.includes(kw)) score += 2;
        }
        return { doc, score };
      })
      .sort((a, b) => b.score - a.score);

    const selectedDocs = scored
      .filter((s) => s.score > 0)
      .slice(0, MAX_CONTEXT_DOCS)
      .map((s) => s.doc);

    if (selectedDocs.length === 0) {
      selectedDocs.push(...allDocuments.slice(0, 5));
    }

    // 6. Legal chunks FTS
    const cdaCodes = selectedDocs.map((d) => d.cda_code).filter(Boolean) as string[];
    let legalExtracts = "";

    if (cdaCodes.length > 0 && keywords.length > 0) {
      const tsQuery = keywords.slice(0, 5).join(" | ");
      const { data: chunks } = await supabase
        .from("legal_chunks")
        .select("cda_code, chunk_title, content, citation_display")
        .in("cda_code", cdaCodes)
        .textSearch("content", tsQuery, { config: "french" })
        .limit(MAX_LEGAL_CHUNKS)
        .returns<LegalChunk[]>();

      if (chunks && chunks.length > 0) {
        let total = 0;
        const kept: typeof chunks = [];
        for (const c of chunks) {
          if (total + c.content.length > MAX_CHUNK_CHARS) break;
          kept.push(c);
          total += c.content.length;
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

    // 7. School chunks FTS
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
        let total = 0;
        const kept: typeof schoolChunks = [];
        for (const c of schoolChunks) {
          if (total + c.content.length > MAX_SCHOOL_CHARS) break;
          kept.push(c);
          total += c.content.length;
        }
        if (kept.length > 0) {
          const docIds = [...new Set(kept.map((c) => c.school_doc_id))];
          const { data: parentDocs } = await supabase
            .from("school_documents")
            .select("id, title, doc_type")
            .in("id", docIds);
          const docMap = new Map(
            parentDocs?.map((d: { id: string; title: string; doc_type: string }) => [d.id, d]) ?? []
          );
          schoolExtracts = kept
            .map((c) => {
              const p = docMap.get(c.school_doc_id);
              const label = p ? `${p.title} (${p.doc_type})` : "Document école";
              return `[ÉCOLE — ${label}]\n${c.content}`;
            })
            .join("\n\n---\n\n");
        }
      }
    }

    // 8. OpenAI
    const openai = getOpenAIClient();
    let userMsg = buildDecisionUserMessage(situation, category ?? undefined, urgency ?? undefined);

    if (legalExtracts) {
      userMsg += `\n\n═══════════════════════════════════════\nEXTRAITS JURIDIQUES\n═══════════════════════════════════════\n${legalExtracts}`;
    }
    if (schoolExtracts) {
      userMsg += `\n\n═══════════════════════════════════════\nCONTEXTE ÉCOLE (informatif)\n═══════════════════════════════════════\n${schoolExtracts}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildDecisionSystemPrompt(selectedDocs) },
        { role: "user", content: userMsg },
      ],
      temperature: 0.2,
      max_tokens: 3000,
    });

    const analysis = completion.choices[0]?.message?.content;
    if (!analysis) {
      return NextResponse.json({ error: "Réponse vide du modèle" }, { status: 500 });
    }

    // 9. Generate title from first line of situation
    const title = situation.length > 80
      ? situation.slice(0, 77) + "..."
      : situation;

    // 10. Save to DB
    const { data: decision, error: dbError } = await supabase
      .from("decisions")
      .insert({
        user_id: user.id,
        title,
        situation,
        category,
        urgency,
        analysis,
        status: "open",
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("[DB decision]", dbError);
      // Return analysis even if save fails
    }

    // 11. Sources
    const sources = selectedDocs.map((doc) => ({
      title: doc.title,
      cda_code: doc.cda_code,
      category: doc.category,
      source_url: doc.source_url,
    }));

    if (logRow?.id) {
      await supabase.from("assistant_logs").update({ response: analysis }).eq("id", logRow.id);
    }

    return NextResponse.json({
      id: decision?.id ?? null,
      analysis,
      sources,
      schoolContextUsed: schoolExtracts.length > 0,
    });
  } catch (error) {
    console.error("[API /decision]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
