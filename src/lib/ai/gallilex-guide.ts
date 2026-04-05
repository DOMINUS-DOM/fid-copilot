/**
 * Gallilex Guide — generates a structured "how to find this in Gallilex"
 * block from the actual pipeline data (no LLM involved).
 *
 * The guide is strictly anchored in:
 * - legalRefs (articles the LLM actually cited)
 * - pivot articles injected for this question
 * - CDA codes used in routing
 * - CDA_REGISTRY metadata (titles, short titles)
 */

import { CDA_REGISTRY } from "./gallilex";
import type { PivotArticle } from "./gallilex";

const GALLILEX_BASE = "https://www.gallilex.cfwb.be/document/pdf";

// ============================================================
// Known traps — common confusions to warn about
// ============================================================

interface Trap {
  /** CDA + article that triggers the warning */
  trigger: string;
  /** Warning message */
  message: string;
}

const KNOWN_TRAPS: Trap[] = [
  {
    trigger: "49466:1.10.3-1",
    message:
      "Ne pas confondre art. 1.10.2-2 (volets du DAccE) avec art. 1.10.3-1 (accès). L'accès des parents est au Chapitre 3, pas au Chapitre 2.",
  },
  {
    trigger: "49466:1.5.2-2",
    message:
      "Ne pas citer l'art. 6 du Décret Missions (CDA 21557) comme base principale. L'art. 1.5.2-2 du Code est la base spécifique des plans de pilotage.",
  },
  {
    trigger: "49466:1.7.2-2",
    message:
      "Ne pas confondre art. 1.7.2-1 (interdiction du minerval) avec art. 1.7.2-2 (liste des frais autorisés).",
  },
  {
    trigger: "10450:5",
    message:
      "L'orientation au D2 se trouve dans l'AR du 29/06/1984 (CDA 10450), pas dans le Code de l'enseignement.",
  },
  {
    trigger: "10450:1er",
    message:
      "La dérogation 45 minutes est au §2 de l'art. 1er. Le §1 fixe la règle générale (50 min). Ne pas conclure à l'illégalité sur la base du seul §1.",
  },
  {
    trigger: "49466:1.7.9-4",
    message:
      "Les motifs d'exclusion (art. 1.7.9-4) et la procédure (art. 1.7.9-6) sont dans des articles séparés.",
  },
  {
    trigger: "5108:73",
    message:
      "Le cours FID cite parfois l'art. 43 §2bis du Pacte scolaire — c'est incorrect. La bonne référence est l'art. 73 §2bis (CDA 5108).",
  },
  {
    trigger: "34295:3",
    message:
      "L'encadrement différencié se base sur l'art. 3 du décret du 30/04/2009 (CDA 34295) et non sur le Code de l'enseignement. Les 20 classes ISE sont définies dans ce texte spécifique.",
  },
  {
    trigger: "46275:6",
    message:
      "Les normes d'encadrement DASPA (seuil de 10 primo-arrivants) sont à l'art. 6 du décret du 07/02/2019 (CDA 46275), pas dans le Code de l'enseignement.",
  },
];

// ============================================================
// Guide structure
// ============================================================

export interface GallilexGuideEntry {
  /** CDA code */
  cdaCode: string;
  /** Short title of the legal text */
  textTitle: string;
  /** Full Gallilex URL */
  url: string;
  /** Article number to verify */
  articleNumber: string;
  /** Paragraph if known */
  paragraph: string | null;
  /** Whether this article was a pivot (directly injected) */
  isPivot: boolean;
}

export interface GallilexGuide {
  /** Ordered list of articles to check (most important first) */
  entries: GallilexGuideEntry[];
  /** Search keywords for Ctrl+F in Gallilex */
  searchKeywords: string[];
  /** Step-by-step strategy (max 3 steps) */
  steps: string[];
  /** Known trap/pitfall if any */
  trap: string | null;
}

// ============================================================
// Build the guide
// ============================================================

interface BuildGuideInput {
  /** Legal refs (articles cited by LLM, verified by citation guard) */
  verifiedArticles: Array<{
    articleNumber: string;
    cdaCode: string;
    paragraph?: string | null;
  }>;
  /** Pivot articles injected for this question */
  pivotArticles: PivotArticle[];
  /** Keywords extracted from the question */
  keywords: string[];
}

export function buildGallilexGuide(input: BuildGuideInput): GallilexGuide | null {
  const { verifiedArticles, pivotArticles, keywords } = input;

  if (verifiedArticles.length === 0 && pivotArticles.length === 0) {
    return null;
  }

  // Build entries from verified articles (cited by LLM) + pivots
  const seen = new Set<string>();
  const entries: GallilexGuideEntry[] = [];
  const pivotSet = new Set(
    pivotArticles.map((p) => `${p.cdaCode}:${p.articleNumber}`)
  );

  // Verified articles first (these are the ones the LLM actually used)
  for (const art of verifiedArticles) {
    const key = `${art.cdaCode}:${art.articleNumber}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const info = CDA_REGISTRY[art.cdaCode];
    if (!info) continue;

    entries.push({
      cdaCode: art.cdaCode,
      textTitle: info.shortTitle,
      url: `${GALLILEX_BASE}/${art.cdaCode}`,
      articleNumber: art.articleNumber,
      paragraph: art.paragraph ?? null,
      isPivot: pivotSet.has(key),
    });
  }

  // Add pivots not already in verified — but ONLY from CDAs already
  // present in verified articles (prevents cross-CDA pollution).
  // If there are no verified articles, allow all pivots.
  const verifiedCDAs = new Set(verifiedArticles.map((a) => a.cdaCode));
  const hasVerified = verifiedCDAs.size > 0;

  for (const pivot of pivotArticles) {
    const key = `${pivot.cdaCode}:${pivot.articleNumber}`;
    if (seen.has(key)) continue;

    // Filter: if we have verified articles, only include pivots from same CDAs
    if (hasVerified && !verifiedCDAs.has(pivot.cdaCode)) continue;

    seen.add(key);

    const info = CDA_REGISTRY[pivot.cdaCode];
    if (!info) continue;

    entries.push({
      cdaCode: pivot.cdaCode,
      textTitle: info.shortTitle,
      url: `${GALLILEX_BASE}/${pivot.cdaCode}`,
      articleNumber: pivot.articleNumber,
      paragraph: null,
      isPivot: true,
    });
  }

  // Limit to max 3 entries to keep the guide focused
  entries.splice(3);

  if (entries.length === 0) return null;

  // Search keywords: article numbers + top question keywords (max 3)
  const searchKeywords: string[] = [];
  // Article numbers are the most reliable Ctrl+F targets
  for (const e of entries.slice(0, 2)) {
    searchKeywords.push(e.articleNumber);
  }
  // Add 1-2 question keywords that are > 4 chars and distinctive
  const distinctiveKw = keywords
    .filter((k) => k.length > 4)
    .slice(0, 2);
  for (const kw of distinctiveKw) {
    if (!searchKeywords.includes(kw)) searchKeywords.push(kw);
  }

  // Steps (max 3)
  const primary = entries[0];
  const steps: string[] = [];
  steps.push(`Ouvrir ${primary.textTitle} (CDA ${primary.cdaCode}) dans Gallilex`);
  const ctrlFTarget = primary.articleNumber.includes(".")
    ? primary.articleNumber
    : `Article ${primary.articleNumber}`;
  steps.push(`Ctrl+F "${ctrlFTarget}"${primary.paragraph ? ` puis lire le §${primary.paragraph}` : ""}`);
  if (entries.length > 1) {
    const secondary = entries[1];
    if (secondary.cdaCode === primary.cdaCode) {
      steps.push(`Vérifier aussi l'art. ${secondary.articleNumber} dans le même texte`);
    } else {
      steps.push(`Consulter aussi ${secondary.textTitle} (CDA ${secondary.cdaCode}), art. ${secondary.articleNumber}`);
    }
  }

  // Trap detection
  let trap: string | null = null;
  for (const e of entries) {
    const key = `${e.cdaCode}:${e.articleNumber}`;
    const known = KNOWN_TRAPS.find((t) => t.trigger === key);
    if (known) {
      trap = known.message;
      break;
    }
  }

  return { entries, searchKeywords, steps, trap };
}
