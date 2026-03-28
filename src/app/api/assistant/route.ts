import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { buildSystemPrompt, buildUserMessage } from "@/lib/ai/prompt";
import { type Document, type ConfidenceLevel } from "@/types";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

const MAX_CONTEXT_DOCS = 7;

/**
 * Score un document selon sa pertinence par rapport à la question.
 * Plus le score est élevé, plus le document est pertinent.
 */
function scoreDocument(doc: Document, keywords: string[]): number {
  let score = 0;

  // Priorité aux textes incontournables
  if (doc.is_core) score += 3;

  const titleLower = doc.title.toLowerCase();
  const summaryLower = (doc.summary ?? "").toLowerCase();

  for (const keyword of keywords) {
    if (titleLower.includes(keyword)) score += 5;
    if (summaryLower.includes(keyword)) score += 2;
  }

  return score;
}

/**
 * Extrait des mots-clés significatifs de la question.
 * Retire les mots vides courants en français.
 */
function extractKeywords(question: string): string[] {
  const stopWords = new Set([
    "le", "la", "les", "un", "une", "des", "de", "du", "au", "aux",
    "et", "ou", "en", "dans", "par", "pour", "sur", "avec", "qui",
    "que", "est", "sont", "son", "ses", "ce", "cette", "ces", "mon",
    "ma", "mes", "il", "elle", "je", "nous", "vous", "ils", "elles",
    "ne", "pas", "plus", "peut", "faire", "fait", "être", "avoir",
    "quels", "quel", "quelle", "quelles", "comment", "quoi",
    "tant", "comme", "entre", "vers", "chez", "sans", "sous",
  ]);

  return question
    .toLowerCase()
    .replace(/['']/g, " ")
    .replace(/[^a-zàâäéèêëïîôùûüÿç\s-]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
}

export async function POST(request: Request) {
  try {
    // 1. Vérifier l'authentification
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // 2. Extraire la question
    const body = await request.json();
    const question = body.question?.trim();

    if (!question) {
      return NextResponse.json({ error: "Question manquante" }, { status: 400 });
    }

    // 2b. Enregistrer la question dans l'historique
    await supabase
      .from("assistant_logs")
      .insert({ user_id: user.id, question });

    // 3. Récupérer TOUS les documents depuis Supabase
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

    // 4. Filtrer et scorer les documents selon la question
    const keywords = extractKeywords(question);

    const scored = allDocuments
      .map((doc) => ({ doc, score: scoreDocument(doc, keywords) }))
      .sort((a, b) => b.score - a.score);

    // Prendre les docs avec score > 0, ou fallback sur les 5 premiers (is_core en tête)
    const relevant = scored.filter((s) => s.score > 0);
    const selectedDocs =
      relevant.length > 0
        ? relevant.slice(0, MAX_CONTEXT_DOCS).map((s) => s.doc)
        : allDocuments.slice(0, 5);

    // 5. Appeler OpenAI
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildSystemPrompt(selectedDocs) },
        { role: "user", content: buildUserMessage(question) },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const answer = completion.choices[0]?.message?.content;

    if (!answer) {
      return NextResponse.json(
        { error: "Réponse vide du modèle" },
        { status: 500 }
      );
    }

    // 6. Construire les sources utilisées
    const sources = selectedDocs.map((doc) => ({
      title: doc.title,
      cda_code: doc.cda_code,
      category: doc.category,
      source_url: doc.source_url,
    }));

    // 7. Calculer le score de confiance
    const coreCount = selectedDocs.filter((d) => d.is_core).length;
    const topScore = relevant.length > 0 ? relevant[0].score : 0;

    let confidence: ConfidenceLevel;
    if (relevant.length >= 3 || (relevant.length >= 2 && coreCount >= 1 && topScore >= 8)) {
      confidence = "high";
    } else if (relevant.length >= 1 && topScore >= 3) {
      confidence = "medium";
    } else {
      confidence = "low";
    }

    return NextResponse.json({ answer, sources, confidence });
  } catch (error) {
    console.error("[API /assistant]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
