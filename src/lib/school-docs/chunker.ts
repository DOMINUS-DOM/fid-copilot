/**
 * Extraction et chunking de documents PDF scolaires.
 * Stratégie : découpage par page, puis par paragraphe si page trop longue.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");

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
  const pages: string[] = [];

  // pdf-parse avec callback par page pour capturer le texte page par page
  const result = await pdfParse(buffer, {
    pagerender: (pageData: { getTextContent: () => Promise<{ items: { str: string }[] }> }) => {
      return pageData.getTextContent().then((textContent: { items: { str: string }[] }) => {
        return textContent.items.map((item: { str: string }) => item.str).join(" ");
      });
    },
  });

  // Si le callback ne fonctionne pas comme prévu, fallback sur le texte brut
  if (result.text) {
    // Découper le texte brut par double saut de ligne (approximation de page)
    const rawPages = result.text.split(/\f|\n{3,}/);
    for (const page of rawPages) {
      const cleaned = cleanText(page);
      if (cleaned.length > 20) {
        pages.push(cleaned);
      }
    }
  }

  // Si aucune page détectée, traiter tout comme un seul bloc
  if (pages.length === 0 && result.text) {
    pages.push(cleanText(result.text));
  }

  // Générer les chunks
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
      // Découper par paragraphe (double saut de ligne)
      const paragraphs = pageText.split(/\n\n+/);
      let currentChunk = "";
      let partNum = 1;

      for (const para of paragraphs) {
        if (
          currentChunk.length + para.length > MAX_CHUNK_SIZE &&
          currentChunk.length > 0
        ) {
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
          chunk_title:
            partNum > 1 ? `Page ${i + 1} (partie ${partNum})` : `Page ${i + 1}`,
          content: currentChunk.trim(),
        });
      }
    }
  }

  return {
    text: result.text || "",
    pageCount: result.numpages || pages.length,
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
