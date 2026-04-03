import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiChat } from "@/lib/ai/gemini";
import {
  buildDecisionSystemPrompt,
  buildDecisionUserMessage,
} from "@/lib/ai/decision-prompt";
import {
  extractKeywords,
  fetchLegalChunks,
  fetchSchoolChunks,
  runCitationGuard,
  buildPipelineMetadata,
  appendContextToMessage,
} from "@/lib/ai/shared-pipeline";
import {
  type Document,
  type DecisionCategory,
  type DecisionUrgency,
} from "@/types";

const MAX_CONTEXT_DOCS = 7;

const VALID_CATEGORIES: DecisionCategory[] = [
  "recours", "discipline", "personnel", "inspection", "parents", "autre",
];
const VALID_URGENCIES: DecisionUrgency[] = ["immediat", "semaine", "planifier"];

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

    // 6. Legal chunks (shared pipeline)
    const docCdaCodes = selectedDocs.map((d) => d.cda_code).filter(Boolean) as string[];
    const legalResult = await fetchLegalChunks(supabase, keywords, docCdaCodes);

    // 7. School chunks (shared pipeline)
    const schoolResult = await fetchSchoolChunks(supabase, user.id, keywords);

    // 8. Gemini
    const baseUserMsg = buildDecisionUserMessage(situation, category ?? undefined, urgency ?? undefined);
    const userMsg = appendContextToMessage(
      baseUserMsg,
      legalResult.legalExtracts,
      schoolResult.schoolExtracts,
      legalResult.gallilexContext,
    );

    const t0 = Date.now();
    const aiResult = await geminiChat({
      systemPrompt: buildDecisionSystemPrompt(selectedDocs),
      userMessage: userMsg,
      temperature: 0.2,
      maxTokens: 3000,
    });
    const latencyMs = Date.now() - t0;

    const analysis = aiResult.text;

    // 8b. Citation guard (shared pipeline)
    const { sanitizedAnswer: sanitizedAnalysis, guardResult } = runCitationGuard(
      analysis ?? "",
      legalResult.contextArticleNumbers,
      "/decision",
    );

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
        analysis: sanitizedAnalysis,
        status: "open",
      })
      .select("id")
      .single();

    if (dbError) {
      console.error("[DB decision]", dbError);
    }

    // 11. Sources
    const sources = selectedDocs.map((doc) => ({
      title: doc.title,
      cda_code: doc.cda_code,
      category: doc.category,
      source_url: doc.source_url,
    }));

    // Pipeline metadata (shared pipeline)
    const pipelineMetadata = buildPipelineMetadata(
      legalResult.allCdaCodes,
      keywords,
      legalResult.contextArticleNumbers,
      aiResult.model,
      latencyMs,
      guardResult,
      { category, urgency },
    );

    if (logRow?.id) {
      await supabase
        .from("assistant_logs")
        .update({ response: sanitizedAnalysis, metadata: pipelineMetadata })
        .eq("id", logRow.id);
    }

    return NextResponse.json({
      id: decision?.id ?? null,
      analysis: sanitizedAnalysis,
      sources,
      schoolContextUsed: schoolResult.hasSchoolContext,
    });
  } catch (error) {
    console.error("[API /decision]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
