import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiChat } from "@/lib/ai/gemini";
import { buildVerifySystemPrompt, buildVerifyUserMessage } from "@/lib/ai/verify-prompt";
import { type VerifyType, type VerifyDepth } from "@/types";

const VALID_TYPES: VerifyType[] = ["document", "courrier", "decision", "formulation"];
const VALID_DEPTHS: VerifyDepth[] = ["rapide", "standard", "approfondi"];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await request.json();
    const content = body.content?.trim();
    const type: VerifyType = VALID_TYPES.includes(body.type) ? body.type : "document";
    const depth: VerifyDepth = VALID_DEPTHS.includes(body.depth) ? body.depth : "standard";
    const context = body.context?.trim() || undefined;

    if (!content || content.length < 20) {
      return NextResponse.json(
        { error: "Le contenu à vérifier doit faire au moins quelques phrases." },
        { status: 400 }
      );
    }

    const { data: logRow } = await supabase
      .from("assistant_logs")
      .insert({ user_id: user.id, question: `[verify:${type}:${depth}] ${content.slice(0, 200)}` })
      .select("id")
      .single();

    const maxTokens = depth === "rapide" ? 1500 : depth === "standard" ? 2500 : 3500;

    const aiResult = await geminiChat({
      systemPrompt: buildVerifySystemPrompt(),
      userMessage: buildVerifyUserMessage({ type, content, context, depth }),
      temperature: 0.2,
      maxTokens,
    });

    if (logRow?.id) {
      await supabase.from("assistant_logs").update({ response: aiResult.text }).eq("id", logRow.id);
    }

    return NextResponse.json({ analysis: aiResult.text, type, depth });
  } catch (error) {
    console.error("[API /verify]", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
