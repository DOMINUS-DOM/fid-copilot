/**
 * Legal chunk scoring — prioritizes specific articles over general ones.
 *
 * Sorts legal chunks before they are sent to the LLM so that
 * specific, directly relevant articles appear first in the context.
 *
 * Scoring factors:
 * +30  pivot article (directly injected for this question)
 * +20  article matches a known specific-article pattern for the question theme
 * +10  article content contains question keywords (lexical overlap)
 *  -15 article is a known "general principle" article
 *  -5  article content is very short (< 200 chars, likely a header/preamble)
 */

import type { LegalChunk } from "@/types";
import type { PivotArticle } from "./gallilex";

// ============================================================
// Known general-principle articles (should rank LAST)
// ============================================================

const GENERAL_ARTICLES: Set<string> = new Set([
  // Décret Missions — missions générales
  "21557:6",
  "21557:9",
  "21557:10",
  // Code enseignement — missions prioritaires (general)
  "49466:1.4.1-1",
  "49466:1.4.1-2",
  // Pacte scolaire — principes généraux
  "5108:1er",
  "5108:2",
  "5108:3",
  "5108:4",
]);

// ============================================================
// Score a single chunk
// ============================================================

export interface ChunkScore {
  chunk: LegalChunk;
  score: number;
  isPivot: boolean;
  isGeneral: boolean;
}

export function scoreChunks(
  chunks: LegalChunk[],
  pivotArticles: PivotArticle[],
  keywords: string[],
): ChunkScore[] {
  const pivotSet = new Set(
    pivotArticles.map((p) => `${p.cdaCode}:${p.articleNumber}`)
  );

  const kwLower = keywords.map((k) => k.toLowerCase());

  return chunks
    .map((chunk) => {
      const key = `${chunk.cda_code}:${chunk.article_number}`;
      let score = 0;

      // Pivot bonus (strongest signal — this article was specifically injected)
      const isPivot = pivotSet.has(key);
      if (isPivot) score += 30;

      // Lexical overlap: what fraction of question keywords appear in the content?
      // Uses ratio (hits / total keywords) so shorter, focused articles
      // that match most keywords score higher than longer general texts.
      const contentLower = chunk.content.toLowerCase().replace(/\s+/g, " ");
      const eligibleKw = kwLower.filter((kw) => kw.length > 3);
      let kwHits = 0;
      for (const kw of eligibleKw) {
        if (contentLower.includes(kw)) kwHits++;
      }
      const ratio = eligibleKw.length > 0 ? kwHits / eligibleKw.length : 0;
      score += Math.round(ratio * 15); // max +15

      // General-article penalty
      const isGeneral = GENERAL_ARTICLES.has(key);
      if (isGeneral) score -= 15;

      // Short-content penalty (preambles, headers — but not pivots, which may be short and specific)
      if (!isPivot && chunk.content.length < 200) score -= 5;

      return { chunk, score, isPivot, isGeneral };
    })
    .sort((a, b) => b.score - a.score);
}
