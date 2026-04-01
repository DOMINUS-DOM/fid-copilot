import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiChat } from "@/lib/ai/gemini";
import {
  buildPortfolioSystemPrompt,
  buildPortfolioUserMessage,
} from "@/lib/ai/portfolio-prompt";
import { type PortfolioAction, type PortfolioContext } from "@/types";

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
    const { data: logRow } = await supabase
      .from("assistant_logs")
      .insert({ user_id: user.id, question: `[portfolio:${context}:${action}] ${text.slice(0, 200)}` })
      .select("id")
      .single();

    // 4. Gemini
    const aiResult = await geminiChat({
      systemPrompt: buildPortfolioSystemPrompt(action, context),
      userMessage: buildPortfolioUserMessage(text, action, context),
      temperature: 0.4,
      maxTokens: 2000,
    });

    if (logRow?.id) {
      await supabase.from("assistant_logs").update({ response: aiResult.text }).eq("id", logRow.id);
    }

    return NextResponse.json({ answer: aiResult.text, action, context });
  } catch (error) {
    console.error("[API /portfolio]", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
