import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiChat } from "@/lib/ai/gemini";
import { buildSystemPrompt, buildUserMessage } from "@/lib/ai/prompt";
import {
  extractKeywords,
  fetchLegalChunks,
  fetchSchoolChunks,
  runCitationGuard,
  buildPipelineMetadata,
  buildLegalRefs,
  appendContextToMessage,
} from "@/lib/ai/shared-pipeline";
import {
  type Document,
  type AssistantMode,
  type ConfidenceLevel,
  type GallilexHint,
} from "@/types";
import { buildGallilexGuide } from "@/lib/ai/gallilex-guide";
import { buildGallilexSearch } from "@/lib/ai/gallilex-search";
import { findPivotArticles } from "@/lib/ai/gallilex";

const MAX_CONTEXT_DOCS = 7;
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

function resolveIntent(
  detectedIntent: QuestionIntent,
  mode: AssistantMode
): QuestionIntent {
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
  score += CATEGORY_INTENT_BOOST[intent]?.[doc.category] ?? 0;
  if (doc.is_core) score += 4;

  const typeBoosts: Record<string, Record<string, number>> = {
    juridique: { texte_legal: 3 },
    portfolio: { portfolio: 3, guide: 1 },
    direction: { guide: 2, synthese: 1 },
    organisation: { methodologie: 3, organisation: 3, guide: 1 },
    general: { texte_legal: 1, synthese: 1 },
  };
  score += typeBoosts[intent]?.[doc.type] ?? 0;

  if (doc.cda_code && (intent === "juridique" || intent === "general")) score += 2;

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

// ============================================================
// Gallilex fallback
// ============================================================

function buildGallilexHints(
  selectedDocs: Document[],
  keywords: string[]
): GallilexHint[] {
  const docsWithCda = selectedDocs.filter((d) => d.cda_code);
  const topDocs = docsWithCda.slice(0, 2);

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

    // 5. Legal chunks (shared pipeline)
    const docCdaCodes = selectedDocs
      .map((d) => d.cda_code)
      .filter(Boolean) as string[];

    const legalResult = await fetchLegalChunks(supabase, keywords, docCdaCodes);

    // 5b. School chunks (shared pipeline)
    const schoolResult = await fetchSchoolChunks(supabase, user.id, keywords);

    // 6. Gemini
    const systemPrompt = buildSystemPrompt(selectedDocs, mode);
    const baseUserMsg = buildUserMessage(question, mode);
    const userMsg = appendContextToMessage(
      baseUserMsg,
      legalResult.legalExtracts,
      schoolResult.schoolExtracts,
      legalResult.gallilexContext,
    );

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

    // 6b. Citation guard (shared pipeline)
    const { sanitizedAnswer, guardResult } = runCitationGuard(
      answer,
      legalResult.contextArticleNumbers,
      "/assistant",
    );

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

    // Degrade confidence when citation guard flags unverified citations.
    if (guardResult.hadUnverifiedCitations && confidence === "high") {
      confidence = "medium";
    }

    // Degrade confidence when specific pivot articles were injected but not cited.
    // If the LLM ignored a directly relevant article, the response is unreliable.
    if (confidence === "high" && legalResult.pivotArticleNumbers.length > 0) {
      const verifiedLower = new Set(
        guardResult.citationsVerified.map((a) => a.toLowerCase())
      );
      const pivotsCited = legalResult.pivotArticleNumbers.some((art) =>
        verifiedLower.has(art.toLowerCase())
      );
      if (!pivotsCited) {
        confidence = "medium";
      }
    }

    // 9. Gallilex hints (si confiance faible ou moyenne)
    const gallilex: GallilexHint[] =
      confidence !== "high" ? buildGallilexHints(selectedDocs, keywords) : [];

    // 10. Pipeline metadata (shared pipeline)
    const pipelineMetadata = buildPipelineMetadata(
      legalResult.allCdaCodes,
      keywords,
      legalResult.contextArticleNumbers,
      aiResult.model,
      latencyMs,
      guardResult,
      { confidence },
    );

    // Update log with response + metadata
    if (logRow?.id) {
      await supabase
        .from("assistant_logs")
        .update({ response: sanitizedAnswer, metadata: pipelineMetadata })
        .eq("id", logRow.id);
    }

    // 11. Legal references for frontend (shared pipeline)
    const legalRefs = buildLegalRefs(
      legalResult.chunks,
      guardResult.citationsVerified,
    );

    // 12. Gallilex guide (programmatic, anchored in actual sources)
    const verifiedArticles = legalRefs
      .filter((r) =>
        guardResult.citationsVerified.some(
          (v) => v.toLowerCase() === r.articleNumber.toLowerCase()
        )
      )
      .map((r) => ({
        articleNumber: r.articleNumber,
        cdaCode: r.cdaCode,
        paragraph: legalResult.chunks.find(
          (c) =>
            c.cda_code === r.cdaCode &&
            c.article_number === r.articleNumber
        )?.paragraph ?? null,
      }));

    const pivotArticles = findPivotArticles(keywords);

    const gallilexGuide = buildGallilexGuide({
      verifiedArticles,
      pivotArticles,
      keywords,
    });

    // 13. Gallilex Search Strategy (question-driven, independent of LLM answer)
    const gallilexSearch = buildGallilexSearch({
      question: question,
      keywords,
      routedCDAs: legalResult.allCdaCodes,
      pivotArticles,
    });

    return NextResponse.json({
      answer: sanitizedAnswer,
      sources,
      confidence,
      gallilex,
      mode,
      logId: logRow?.id ?? null,
      schoolContextUsed: schoolResult.hasSchoolContext,
      legalRefs,
      gallilexGuide,
      gallilexSearch,
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
