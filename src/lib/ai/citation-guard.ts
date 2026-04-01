/**
 * Citation Guard — post-LLM validation of legal article references.
 *
 * Parses article citations from the LLM response and compares them against
 * the articles actually provided in context. Unverified citations are flagged
 * with a warning so the user knows they weren't sourced.
 *
 * This is the last safety net before the response reaches the user.
 */

// ============================================================
// Types
// ============================================================

export interface CitationGuardResult {
  /** The sanitized response text */
  sanitizedAnswer: string;
  /** Citations found in the response */
  citationsFound: string[];
  /** Citations that were verified against context */
  citationsVerified: string[];
  /** Citations that could NOT be verified (potential hallucinations) */
  citationsUnverified: string[];
  /** Whether any unverified citations were found and flagged */
  hadUnverifiedCitations: boolean;
}

// ============================================================
// Article reference parser
// ============================================================

/**
 * Regex to match article references in French legal text.
 *
 * Matches patterns like:
 *   - Article 6
 *   - Art. 73
 *   - article 1.7.9-4
 *   - Art. 32sexies
 *   - Article 1er
 *   - article 1.10.2-2 § 3
 *   - articles 12 et 19
 *   - l'article 73 §2bis
 *
 * Does NOT match:
 *   - "article" used as a common noun without a number
 *   - numbers in other contexts (dates, page numbers)
 */
const ARTICLE_REF_REGEX =
  /(?:(?:l[''\u0027])?[Aa]rticles?|[Aa]rt\.)\s+(1er|[\d]+(?:\.[\d]+)*(?:-[\d]+)?(?:bis|ter|quater|quinquies|sexies|septies|octies|nonies|decies)?(?:\s*§\s*[\d]+(?:bis|ter|quater|quinquies|sexies)?)?(?:\s*(?:,|et)\s+[\d]+(?:\.[\d]+)*(?:-[\d]+)?(?:bis|ter|quater|quinquies|sexies)?)*)/gi;

/**
 * Extract individual article numbers from a matched reference string.
 * Handles compound references like "articles 12 et 19" or "articles 1.7.9-4, 1.7.9-5 et 1.7.9-6"
 */
function splitArticleNumbers(refString: string): string[] {
  return refString
    .split(/\s*(?:,|et)\s*/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Extract all article number references from a text.
 * Returns deduplicated, normalized article numbers.
 */
export function extractArticleCitations(text: string): string[] {
  const found = new Set<string>();
  let match: RegExpExecArray | null;

  // Reset regex state
  ARTICLE_REF_REGEX.lastIndex = 0;

  while ((match = ARTICLE_REF_REGEX.exec(text)) !== null) {
    const refGroup = match[1];
    if (!refGroup) continue;

    const numbers = splitArticleNumbers(refGroup);
    for (const num of numbers) {
      // Normalize: trim whitespace, collapse internal spaces around §
      const normalized = num
        .replace(/\s+/g, " ")
        .replace(/\s*§\s*/g, " §")
        .trim();
      if (normalized) found.add(normalized);
    }
  }

  return [...found];
}

// ============================================================
// Normalization for comparison
// ============================================================

/**
 * Normalize an article number for fuzzy comparison.
 * Strips spaces, lowercases, removes § suffixes for base article matching.
 *
 * "1.7.9-4 §3" → "1.7.9-4"
 * "32sexies" → "32sexies"
 * "1er" → "1er"
 */
function normalizeForComparison(articleNumber: string): string {
  return articleNumber
    .toLowerCase()
    .replace(/\s*§.*$/, "") // Remove paragraph suffixes
    .replace(/\s+/g, "")   // Remove spaces
    .trim();
}

/**
 * Check if a cited article number matches any article in the provided context.
 */
function isArticleInContext(
  citedArticle: string,
  contextArticles: string[]
): boolean {
  const normalizedCited = normalizeForComparison(citedArticle);

  for (const contextArt of contextArticles) {
    const normalizedCtx = normalizeForComparison(contextArt);

    // Exact match
    if (normalizedCited === normalizedCtx) return true;

    // Cited "73" matches context "73" (simple number)
    // Cited "1.7.9-4" matches context "1.7.9-4"
    // Cited "32sexies" matches context "32sexies"

    // Also handle: cited "73 §2bis" should match context "73"
    // (the § part was already stripped by normalizeForComparison)
  }

  return false;
}

// ============================================================
// Warning insertion
// ============================================================

const UNVERIFIED_WARNING = " [réf. non vérifiée]";

/**
 * Replace unverified article citations in the text with a flagged version.
 * Each unverified "Article X" becomes "Article X [réf. non vérifiée]".
 */
function flagUnverifiedCitations(
  text: string,
  unverifiedArticles: Set<string>
): string {
  if (unverifiedArticles.size === 0) return text;

  // Build a regex that matches each unverified article reference
  // We need to find the exact occurrence and append the warning
  let result = text;

  // Process each unverified article
  for (const artNum of unverifiedArticles) {
    // Escape special regex characters in the article number
    const escaped = artNum.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Match "Article X" or "Art. X" or "l'article X" followed by the specific number
    // Only flag if not already flagged
    const pattern = new RegExp(
      `((?:l['\u2018\u2019])?[Aa]rticles?|[Aa]rt\\.)\\s+(${escaped})(?!\\s*\\[réf\\.)`,
      "g"
    );

    result = result.replace(pattern, `$1 $2${UNVERIFIED_WARNING}`);
  }

  return result;
}

// ============================================================
// Main guard function
// ============================================================

/**
 * Validate and sanitize article citations in a LLM response.
 *
 * @param answer - The raw LLM response text
 * @param contextArticles - Article numbers that were provided in the context
 *   (from legal_chunks injected into the prompt)
 * @returns CitationGuardResult with sanitized text and audit data
 */
export function guardCitations(
  answer: string,
  contextArticles: string[]
): CitationGuardResult {
  // 1. Extract all article citations from the response
  const citationsFound = extractArticleCitations(answer);

  // 2. Classify each citation as verified or unverified
  const citationsVerified: string[] = [];
  const citationsUnverified: string[] = [];

  for (const citation of citationsFound) {
    if (isArticleInContext(citation, contextArticles)) {
      citationsVerified.push(citation);
    } else {
      citationsUnverified.push(citation);
    }
  }

  // 3. Flag unverified citations in the response text
  const unverifiedSet = new Set(citationsUnverified);
  const sanitizedAnswer = flagUnverifiedCitations(answer, unverifiedSet);

  return {
    sanitizedAnswer,
    citationsFound,
    citationsVerified,
    citationsUnverified,
    hadUnverifiedCitations: citationsUnverified.length > 0,
  };
}
