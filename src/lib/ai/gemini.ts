import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

let geminiClient: GoogleGenerativeAI | null = null;
let openaiClient: OpenAI | null = null;

/**
 * Appel IA avec fallback : Gemini d'abord, OpenAI si Gemini echoue.
 * Permet de basculer gratuitement sur Gemini quand le quota est actif.
 */
export async function geminiChat(params: {
  systemPrompt: string;
  userMessage: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  // Try Gemini first (free)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      if (!geminiClient) geminiClient = new GoogleGenerativeAI(geminiKey);
      const model = geminiClient.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: params.systemPrompt,
        generationConfig: {
          temperature: params.temperature ?? 0.3,
          maxOutputTokens: params.maxTokens ?? 2000,
        },
      });
      const result = await model.generateContent(params.userMessage);
      const text = result.response.text();
      if (text) return text;
    } catch (err) {
      console.warn("[AI] Gemini failed, falling back to OpenAI:", (err as Error).message?.slice(0, 100));
    }
  }

  // Fallback to OpenAI
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) throw new Error("No AI provider available (GEMINI_API_KEY and OPENAI_API_KEY both missing or failed)");

  if (!openaiClient) openaiClient = new OpenAI({ apiKey: openaiKey });

  const completion = await openaiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: params.systemPrompt },
      { role: "user", content: params.userMessage },
    ],
    temperature: params.temperature ?? 0.3,
    max_tokens: params.maxTokens ?? 2000,
  });

  const text = completion.choices[0]?.message?.content;
  if (!text) throw new Error("Empty response from OpenAI");
  return text;
}
