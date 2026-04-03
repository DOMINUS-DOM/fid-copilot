/**
 * Shared pipeline utilities — used by both /api/assistant and /api/decision
 *
 * Eliminates duplication between the two routes:
 * - extractKeywords (unified stopwords)
 * - fetchLegalChunks (FTS + pivot injection + merge + budget)
 * - fetchSchoolChunks (school document FTS)
 * - formatLegalExtracts (chunk → text for LLM context)
 * - buildPipelineMetadata (audit trail)
 * - buildLegalRefs (for frontend legal references badges)
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { searchGallilex, formatGallilexContext, findPivotArticles } from "@/lib/ai/gallilex";
import { guardCitations, type CitationGuardResult } from "@/lib/ai/citation-guard";
import { scoreChunks } from "@/lib/ai/chunk-scorer";
import { type LegalChunk } from "@/types";

// ============================================================
// Constants
// ============================================================

export const MAX_LEGAL_CHUNKS = 5;
export const MAX_CHUNK_CHARS = 8000;
export const MAX_SCHOOL_CHUNKS = 3;
export const MAX_SCHOOL_CHARS = 4000;

const LEGAL_CHUNK_SELECT =
  "cda_code, chunk_title, content, citation_display, article_number, paragraph" as const;

// ============================================================
// Keyword extraction (unified)
// ============================================================

const STOP_WORDS = new Set([
  "le", "la", "les", "un", "une", "des", "de", "du", "au", "aux",
  "et", "ou", "en", "dans", "par", "pour", "sur", "avec", "qui",
  "que", "est", "sont", "son", "ses", "ce", "cette", "ces", "mon",
  "ma", "mes", "il", "elle", "je", "nous", "vous", "ils", "elles",
  "ne", "pas", "plus", "peut", "faire", "fait", "être", "avoir",
  "quels", "quel", "quelle", "quelles", "comment", "quoi",
  "tant", "comme", "entre", "vers", "chez", "sans", "sous",
  "doit", "dois", "doivent", "faut", "pourquoi",
]);

export function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/['']/g, " ")
    .replace(/[^a-zàâäéèêëïîôùûüÿç\s-]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

// ============================================================
// Legal chunks: FTS + pivot injection + merge + budget
// ============================================================

export interface FetchLegalResult {
  /** All chunks kept (within budget), sorted by specificity score */
  chunks: LegalChunk[];
  /** Formatted text for LLM context */
  legalExtracts: string;
  /** All CDA codes routed */
  allCdaCodes: string[];
  /** Gallilex context string (for appending to user message) */
  gallilexContext: string;
  /** Article numbers sent to LLM */
  contextArticleNumbers: string[];
  /** Article numbers of pivot (specific) articles in context */
  pivotArticleNumbers: string[];
}

export async function fetchLegalChunks(
  supabase: SupabaseClient,
  keywords: string[],
  docCdaCodes: string[],
): Promise<FetchLegalResult> {
  const empty: FetchLegalResult = {
    chunks: [],
    legalExtracts: "",
    allCdaCodes: [],
    gallilexContext: "",
    contextArticleNumbers: [],
    pivotArticleNumbers: [],
  };

  if (keywords.length === 0) return empty;

  // Gallilex routing
  const gallilexResults = searchGallilex(keywords, docCdaCodes);
  const gallilexCdaCodes = gallilexResults.map((r) => r.cdaCode);
  const allCdaCodes = [...new Set([...docCdaCodes, ...gallilexCdaCodes])];

  if (allCdaCodes.length === 0) return { ...empty, allCdaCodes };

  // FTS query
  const tsQuery = keywords.slice(0, 5).join(" | ");

  const { data: ftsChunks } = await supabase
    .from("legal_chunks")
    .select(LEGAL_CHUNK_SELECT)
    .in("cda_code", allCdaCodes)
    .textSearch("content", tsQuery, { config: "french" })
    .limit(MAX_LEGAL_CHUNKS + 3)
    .returns<LegalChunk[]>();

  // Pivot article injection
  const pivotArticles = findPivotArticles(keywords);
  let pivotChunks: LegalChunk[] = [];
  if (pivotArticles.length > 0) {
    const pivotQueries = pivotArticles.map((p) =>
      supabase
        .from("legal_chunks")
        .select(LEGAL_CHUNK_SELECT)
        .eq("cda_code", p.cdaCode)
        .eq("article_number", p.articleNumber)
        .limit(3)
        .returns<LegalChunk[]>()
    );
    const pivotResults = await Promise.all(pivotQueries);
    for (const { data } of pivotResults) {
      if (data) {
        for (const chunk of data) {
          pivotChunks.push(chunk);
        }
      }
    }
  }

  // Merge: deduplicate pivots + FTS
  const allChunks: LegalChunk[] = [];
  const seenArticles = new Set<string>();

  for (const pc of pivotChunks) {
    const key = `${pc.cda_code}:${pc.article_number}`;
    if (!seenArticles.has(key)) {
      seenArticles.add(key);
      allChunks.push(pc);
    }
  }
  if (ftsChunks) {
    for (const c of ftsChunks) {
      const key = `${c.cda_code}:${c.article_number}`;
      if (!seenArticles.has(key)) {
        seenArticles.add(key);
        allChunks.push(c);
      }
    }
  }

  // Score & sort: specific articles first, general articles last
  const scored = scoreChunks(allChunks, pivotArticles, keywords);
  const sorted = scored.map((s) => s.chunk);

  // Budget: keep chunks within MAX_CHUNK_CHARS
  let totalChars = 0;
  const kept: LegalChunk[] = [];
  for (const chunk of sorted) {
    if (totalChars + chunk.content.length > MAX_CHUNK_CHARS) break;
    kept.push(chunk);
    totalChars += chunk.content.length;
  }

  // Format extracts for LLM
  const legalExtracts = formatLegalExtracts(kept);

  // Gallilex context string
  const gallilexContext = formatGallilexContext(gallilexResults, docCdaCodes) ?? "";

  // Article numbers for citation guard
  const contextArticleNumbers = kept
    .map((c) => c.article_number)
    .filter(Boolean) as string[];

  // Pivot article numbers that made it into the kept set
  const pivotSet = new Set(
    pivotArticles.map((p) => `${p.cdaCode}:${p.articleNumber}`)
  );
  const pivotArticleNumbers = kept
    .filter((c) => pivotSet.has(`${c.cda_code}:${c.article_number}`))
    .map((c) => c.article_number)
    .filter(Boolean) as string[];

  return {
    chunks: kept,
    legalExtracts,
    allCdaCodes,
    gallilexContext,
    contextArticleNumbers,
    pivotArticleNumbers,
  };
}

// ============================================================
// School chunks: FTS
// ============================================================

export interface FetchSchoolResult {
  schoolExtracts: string;
  hasSchoolContext: boolean;
}

export async function fetchSchoolChunks(
  supabase: SupabaseClient,
  userId: string,
  keywords: string[],
): Promise<FetchSchoolResult> {
  if (keywords.length === 0) return { schoolExtracts: "", hasSchoolContext: false };

  const schoolTsQuery = keywords.slice(0, 5).join(" | ");

  const { data: schoolChunks } = await supabase
    .from("school_chunks")
    .select("chunk_title, content, school_doc_id")
    .eq("user_id", userId)
    .textSearch("content", schoolTsQuery, { config: "french" })
    .limit(MAX_SCHOOL_CHUNKS);

  if (!schoolChunks || schoolChunks.length === 0) {
    return { schoolExtracts: "", hasSchoolContext: false };
  }

  let totalChars = 0;
  const kept: typeof schoolChunks = [];
  for (const chunk of schoolChunks) {
    if (totalChars + chunk.content.length > MAX_SCHOOL_CHARS) break;
    kept.push(chunk);
    totalChars += chunk.content.length;
  }

  if (kept.length === 0) return { schoolExtracts: "", hasSchoolContext: false };

  // Fetch parent doc titles
  const docIds = [...new Set(kept.map((c) => c.school_doc_id))];
  const { data: parentDocs } = await supabase
    .from("school_documents")
    .select("id, title, doc_type")
    .in("id", docIds);

  const docMap = new Map(
    parentDocs?.map((d: { id: string; title: string; doc_type: string }) => [d.id, d]) ?? []
  );

  const schoolExtracts = kept
    .map((c) => {
      const parent = docMap.get(c.school_doc_id);
      const label = parent
        ? `${parent.title} (${parent.doc_type})`
        : "Document école";
      return `[ÉCOLE — ${label}${c.chunk_title ? ` — ${c.chunk_title}` : ""}]\n${c.content}`;
    })
    .join("\n\n---\n\n");

  return { schoolExtracts, hasSchoolContext: true };
}

// ============================================================
// Format legal extracts for LLM context
// ============================================================

function formatLegalExtracts(chunks: LegalChunk[]): string {
  if (chunks.length === 0) return "";

  return chunks
    .map((c, idx) => {
      const lines: string[] = [`[LEGAL-${idx + 1}]`];
      if (c.citation_display) {
        lines.push(`Citation exacte : ${c.citation_display}`);
      }
      lines.push(`CDA : ${c.cda_code}`);
      if (c.article_number) {
        lines.push(`Article : ${c.article_number}${c.paragraph ? ` § ${c.paragraph}` : ""}`);
      }
      lines.push(`Extrait : ${c.content}`);
      return lines.join("\n");
    })
    .join("\n\n---\n\n");
}

// ============================================================
// Citation guard wrapper
// ============================================================

export interface GuardedResponse {
  sanitizedAnswer: string;
  guardResult: CitationGuardResult;
}

export function runCitationGuard(
  answer: string,
  contextArticleNumbers: string[],
  routeLabel: string,
): GuardedResponse {
  const guardResult = guardCitations(answer, contextArticleNumbers);

  if (guardResult.hadUnverifiedCitations) {
    console.warn(
      `[Citation Guard ${routeLabel}] Unverified:`,
      guardResult.citationsUnverified,
      "| Verified:",
      guardResult.citationsVerified,
    );
  }

  return { sanitizedAnswer: guardResult.sanitizedAnswer, guardResult };
}

// ============================================================
// Pipeline metadata for audit trail
// ============================================================

export interface PipelineMetadata {
  cdaRouted: string[];
  pivotArticles: string[];
  articlesSentToLlm: string[];
  model: string;
  latencyMs: number;
  citationGuard: {
    verified: string[];
    unverified: string[];
  };
  [key: string]: unknown;
}

export function buildPipelineMetadata(
  allCdaCodes: string[],
  keywords: string[],
  contextArticleNumbers: string[],
  model: string,
  latencyMs: number,
  guardResult: CitationGuardResult,
  extra?: Record<string, unknown>,
): PipelineMetadata {
  return {
    cdaRouted: allCdaCodes,
    pivotArticles: findPivotArticles(keywords).map(
      (p) => `${p.cdaCode}:${p.articleNumber}`
    ),
    articlesSentToLlm: contextArticleNumbers,
    model,
    latencyMs,
    citationGuard: {
      verified: guardResult.citationsVerified,
      unverified: guardResult.citationsUnverified,
    },
    ...extra,
  };
}

// ============================================================
// Legal references for frontend badges
// ============================================================

export interface LegalRef {
  articleNumber: string;
  cdaCode: string;
  citationDisplay: string | null;
}

export function buildLegalRefs(
  chunks: LegalChunk[],
  verifiedCitations: string[],
  maxRefs: number = 6,
): LegalRef[] {
  const verifiedSet = new Set(verifiedCitations.map((a) => a.toLowerCase()));
  const legalRefs: LegalRef[] = [];
  const seenRefs = new Set<string>();

  // Verified citations first (articles the LLM actually cited)
  for (const chunk of chunks) {
    if (!chunk.article_number) continue;
    const norm = chunk.article_number.toLowerCase();
    if (verifiedSet.has(norm) && !seenRefs.has(norm)) {
      seenRefs.add(norm);
      legalRefs.push({
        articleNumber: chunk.article_number,
        cdaCode: chunk.cda_code,
        citationDisplay: chunk.citation_display ?? null,
      });
    }
  }

  // Complement with context articles up to maxRefs
  for (const chunk of chunks) {
    if (legalRefs.length >= maxRefs) break;
    if (!chunk.article_number) continue;
    const norm = chunk.article_number.toLowerCase();
    if (!seenRefs.has(norm)) {
      seenRefs.add(norm);
      legalRefs.push({
        articleNumber: chunk.article_number,
        cdaCode: chunk.cda_code,
        citationDisplay: chunk.citation_display ?? null,
      });
    }
  }

  return legalRefs;
}

// ============================================================
// Append legal/school/gallilex context to user message
// ============================================================

export function appendContextToMessage(
  userMsg: string,
  legalExtracts: string,
  schoolExtracts: string,
  gallilexContext: string,
): string {
  let msg = userMsg;

  if (legalExtracts) {
    msg += `\n\n═══════════════════════════════════════\nEXTRAITS JURIDIQUES PERTINENTS (texte officiel)\n═══════════════════════════════════════\n${legalExtracts}`;
  }

  if (schoolExtracts) {
    msg += `\n\n═══════════════════════════════════════\nCONTEXTE LOCAL — DOCUMENTS DE L'ÉCOLE (informatif, NE REMPLACE PAS la loi)\n═══════════════════════════════════════\n${schoolExtracts}`;
  }

  if (gallilexContext) {
    msg += gallilexContext;
  }

  return msg;
}
