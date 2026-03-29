/**
 * Extraction et chunking de documents PDF scolaires.
 * Utilise `unpdf` — compatible serverless (Vercel), pas de dépendance DOM.
 */

import { extractText } from "unpdf";

const MAX_CHUNK_SIZE = 2000;
const MAX_CHUNKS = 200;

export interface ExtractedChunk {
  chunk_index: number;
  chunk_title: string;
  content: string;
}

export interface ExtractionResult {
  text: string;
  pageCount: number;
  chunks: ExtractedChunk[];
}

/**
 * Extrait le texte d'un buffer PDF et le découpe en chunks.
 */
export async function extractAndChunk(
  buffer: Buffer
): Promise<ExtractionResult> {
  const uint8 = new Uint8Array(buffer);
  const { text: fullText, totalPages } = await extractText(uint8, { mergePages: true });

  const text = typeof fullText === "string" ? fullText : (fullText as string[]).join("\n\n");

  if (!text || text.trim().length === 0) {
    return { text: "", pageCount: 0, chunks: [] };
  }

  // Split by form feed (page break) or large gaps
  const pages: string[] = [];
  const rawPages = text.split(/\f|\n{3,}/);
  for (const page of rawPages) {
    const cleaned = cleanText(page);
    if (cleaned.length > 20) {
      pages.push(cleaned);
    }
  }

  if (pages.length === 0) {
    pages.push(cleanText(text));
  }

  // Generate chunks
  const chunks: ExtractedChunk[] = [];
  let chunkIndex = 0;

  for (let i = 0; i < pages.length && chunkIndex < MAX_CHUNKS; i++) {
    const pageText = pages[i];

    if (pageText.length <= MAX_CHUNK_SIZE) {
      chunks.push({
        chunk_index: chunkIndex++,
        chunk_title: `Page ${i + 1}`,
        content: pageText,
      });
    } else {
      const paragraphs = pageText.split(/\n\n+/);
      let currentChunk = "";
      let partNum = 1;

      for (const para of paragraphs) {
        if (currentChunk.length + para.length > MAX_CHUNK_SIZE && currentChunk.length > 0) {
          chunks.push({
            chunk_index: chunkIndex++,
            chunk_title: `Page ${i + 1} (partie ${partNum})`,
            content: currentChunk.trim(),
          });
          partNum++;
          currentChunk = para;
          if (chunkIndex >= MAX_CHUNKS) break;
        } else {
          currentChunk += (currentChunk ? "\n\n" : "") + para;
        }
      }

      if (currentChunk.trim() && chunkIndex < MAX_CHUNKS) {
        chunks.push({
          chunk_index: chunkIndex++,
          chunk_title: partNum > 1 ? `Page ${i + 1} (partie ${partNum})` : `Page ${i + 1}`,
          content: currentChunk.trim(),
        });
      }
    }
  }

  return {
    text,
    pageCount: totalPages || pages.length,
    chunks,
  };
}

function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n /g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
