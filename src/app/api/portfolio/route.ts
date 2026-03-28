import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import {
  buildPortfolioSystemPrompt,
  buildPortfolioUserMessage,
} from "@/lib/ai/portfolio-prompt";
import { type PortfolioAction, type PortfolioContext } from "@/types";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

const VALID_ACTIONS: PortfolioAction[] = ["structurer", "ameliorer", "challenger"];
const VALID_CONTEXTS: PortfolioContext[] = ["posture", "module", "situation", "autoevaluation", "ecrit"];

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
    const text = body.text?.trim();
    const action: PortfolioAction = VALID_ACTIONS.includes(body.action)
      ? body.action
      : "structurer";
    const context: PortfolioContext = VALID_CONTEXTS.includes(body.context)
      ? body.context
      : "situation";

    if (!text) {
      return NextResponse.json(
        { error: "Texte manquant" },
        { status: 400 }
      );
    }

    if (text.length < 20) {
      return NextResponse.json(
        { error: "Texte trop court. Écrivez au moins quelques phrases pour obtenir un retour utile." },
        { status: 400 }
      );
    }

    // 3. Log
    await supabase
      .from("assistant_logs")
      .insert({ user_id: user.id, question: `[portfolio:${context}:${action}] ${text.slice(0, 200)}` });

    // 4. OpenAI
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildPortfolioSystemPrompt(action, context) },
        { role: "user", content: buildPortfolioUserMessage(text, action, context) },
      ],
      temperature: 0.4,
      max_tokens: 2000,
    });

    const answer = completion.choices[0]?.message?.content;

    if (!answer) {
      return NextResponse.json(
        { error: "Réponse vide du modèle" },
        { status: 500 }
      );
    }

    return NextResponse.json({ answer, action, context });
  } catch (error) {
    console.error("[API /portfolio]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
