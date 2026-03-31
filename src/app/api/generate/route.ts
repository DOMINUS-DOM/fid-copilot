import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import {
  buildGenerateSystemPrompt,
  buildGenerateUserMessage,
} from "@/lib/ai/generate-prompt";
import { type DocGenTone, type DocGenFormat } from "@/types";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  return new OpenAI({ apiKey });
}

const VALID_TONES: DocGenTone[] = ["neutre", "ferme", "apaisant", "formel"];
const VALID_FORMATS: DocGenFormat[] = ["email", "courrier", "note"];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const {
      template,
      situation,
      recipient,
      subject,
      includePoints,
      avoidPoints,
    } = body;

    const tone: DocGenTone = VALID_TONES.includes(body.tone) ? body.tone : "neutre";
    const format: DocGenFormat = VALID_FORMATS.includes(body.format) ? body.format : "email";

    if (!situation?.trim() || situation.trim().length < 10) {
      return NextResponse.json(
        { error: "Décrivez la situation en quelques phrases." },
        { status: 400 }
      );
    }

    // Fetch user preferences server-side
    const { data: prefs } = await supabase
      .from("user_preferences")
      .select("first_name, last_name, job_title, school_name, signature, closing_formula")
      .eq("user_id", user.id)
      .maybeSingle();

    const userName = prefs?.first_name && prefs?.last_name
      ? `${prefs.first_name} ${prefs.last_name}`
      : undefined;

    // Log
    const { data: logRow } = await supabase
      .from("assistant_logs")
      .insert({ user_id: user.id, question: `[generate:${template}] ${situation.slice(0, 200)}` })
      .select("id")
      .single();

    // Generate
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: buildGenerateSystemPrompt() },
        {
          role: "user",
          content: buildGenerateUserMessage({
            template: template || "document libre",
            situation: situation.trim(),
            tone,
            format,
            recipient: recipient?.trim() || undefined,
            subject: subject?.trim() || undefined,
            includePoints: includePoints?.trim() || undefined,
            avoidPoints: avoidPoints?.trim() || undefined,
            userName,
            jobTitle: prefs?.job_title || undefined,
            schoolName: prefs?.school_name || undefined,
            signature: prefs?.signature || undefined,
            closingFormula: prefs?.closing_formula || undefined,
          }),
        },
      ],
      temperature: 0.4,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Réponse vide du modèle" }, { status: 500 });
    }

    if (logRow?.id) {
      await supabase.from("assistant_logs").update({ response: content }).eq("id", logRow.id);
    }

    return NextResponse.json({ content, template, tone, format });
  } catch (error) {
    console.error("[API /generate]", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
