import { GoogleGenerativeAI } from "@google/generative-ai";

let client: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (client) return client;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
  client = new GoogleGenerativeAI(apiKey);
  return client;
}

/**
 * Appel simplifie a Gemini — remplace openai.chat.completions.create()
 */
export async function geminiChat(params: {
  systemPrompt: string;
  userMessage: string;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: params.systemPrompt,
    generationConfig: {
      temperature: params.temperature ?? 0.3,
      maxOutputTokens: params.maxTokens ?? 2000,
    },
  });

  const result = await model.generateContent(params.userMessage);
  const text = result.response.text();
  if (!text) throw new Error("Gemini: empty response");
  return text;
}
