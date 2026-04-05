/**
 * Gallilex Search Strategy — generates a "how to search Gallilex yourself"
 * guide from question data (keywords, pivots, routing).
 *
 * This is NOT about verifying the assistant's answer.
 * This IS about teaching the user how a FID candidate would
 * find the answer manually in Gallilex.
 *
 * 100% programmatic — no LLM involved.
 */

import { CDA_REGISTRY, findPivotArticles } from "./gallilex";
import type { PivotArticle } from "./gallilex";

const GALLILEX_BASE = "https://www.gallilex.cfwb.be/document/pdf";

// ============================================================
// Question type detection
// ============================================================

type QuestionType = "seuil" | "procédure" | "définition" | "condition" | "droit" | "cas pratique";

const QUESTION_TYPE_PATTERNS: Array<{ keywords: string[]; type: QuestionType }> = [
  { keywords: ["combien", "seuil", "nombre", "minimum", "maximum", "limite", "délai"], type: "seuil" },
  { keywords: ["procédure", "étapes", "comment faire", "marche à suivre", "démarche"], type: "procédure" },
  { keywords: ["définition", "qu'est-ce", "signifie", "désigne", "entend par"], type: "définition" },
  { keywords: ["condition", "conditions", "critères", "peut-on", "autorisé", "permis", "droit de"], type: "condition" },
  { keywords: ["droit", "obligatoire", "obligation", "interdit", "légal", "illégal"], type: "droit" },
];

function detectQuestionType(keywords: string[], question: string): QuestionType {
  const qLower = question.toLowerCase();
  for (const pattern of QUESTION_TYPE_PATTERNS) {
    for (const kw of pattern.keywords) {
      if (qLower.includes(kw)) return pattern.type;
    }
  }
  // Check keywords too
  const kwJoined = keywords.join(" ").toLowerCase();
  for (const pattern of QUESTION_TYPE_PATTERNS) {
    for (const kw of pattern.keywords) {
      if (kwJoined.includes(kw)) return pattern.type;
    }
  }
  return "cas pratique";
}

// ============================================================
// Legal matter detection (from THEME_CDA_MAP keys)
// ============================================================

const MATTER_LABELS: Record<string, string> = {
  "4329": "Régime linguistique dans l'enseignement",
  "5108": "Pacte scolaire (subventions, neutralité, financement)",
  "9226": "Contrat de sportif rémunéré",
  "9547": "Obligation scolaire",
  "10450": "Organisation de l'enseignement secondaire",
  "16421": "Enseignement en alternance (CEFA)",
  "21557": "Missions prioritaires de l'enseignement",
  "28737": "Enseignement spécialisé",
  "30998": "Premier degré du secondaire",
  "31886": "Statut et fonction de direction",
  "32365": "Immersion linguistique",
  "34295": "Encadrement différencié (ISE)",
  "40701": "Titres et fonctions du personnel",
  "45031": "Bien-être au travail (harcèlement, prévention)",
  "45593": "Contrats d'objectifs et pilotage",
  "46275": "DASPA et FLA (primo-arrivants)",
  "46287": "Organisation du travail (collaboratif, numérique)",
  "49466": "Enseignement fondamental et secondaire (Code)",
  "25174": "Congés et disponibilités du personnel",
};

// ============================================================
// Known traps — enriched with confirmation signals
// ============================================================

interface SearchTrap {
  /** CDA + article that triggers the warning */
  trigger: string;
  /** What to avoid / common mistake */
  trap: string;
  /** How to confirm you're on the right article */
  confirmation: string;
}

const SEARCH_TRAPS: SearchTrap[] = [
  {
    trigger: "49466:1.10.3-1",
    trap: "Ne pas confondre Chapitre 2 (contenu du DAccE, art. 1.10.2-x) et Chapitre 3 (accès au DAccE, art. 1.10.3-x). Si la question porte sur « qui peut consulter », c'est le Chapitre 3.",
    confirmation: "L'article mentionne les catégories de personnes autorisées à consulter le dossier.",
  },
  {
    trigger: "49466:1.5.2-2",
    trap: "Ne pas citer l'art. 6 du Décret Missions (CDA 21557) comme base principale. L'art. 1.5.2-2 du Code est la base spécifique des plans de pilotage.",
    confirmation: "L'article mentionne les « objectifs d'amélioration » et le « plan de pilotage ».",
  },
  {
    trigger: "49466:1.7.2-2",
    trap: "Ne pas confondre art. 1.7.2-1 (interdiction du minerval) avec art. 1.7.2-2 (liste des frais autorisés). Ce sont deux articles différents avec des portées opposées.",
    confirmation: "L'article contient une liste énumérative de frais que l'école peut réclamer.",
  },
  {
    trigger: "10450:5",
    trap: "L'orientation au D2 se trouve dans l'AR du 29/06/1984 (CDA 10450), pas dans le Code de l'enseignement.",
    confirmation: "L'article mentionne les formes d'enseignement (général, technique, professionnel) et les conditions de passage entre sections.",
  },
  {
    trigger: "10450:1er",
    trap: "Le §1 fixe la règle générale (50 min). La dérogation 45 minutes est au §2. Ne pas conclure à l'illégalité sur la base du seul §1.",
    confirmation: "Le §2 mentionne explicitement les « périodes de 45 minutes » et les conditions de la dérogation.",
  },
  {
    trigger: "49466:1.7.9-4",
    trap: "Les motifs d'exclusion (art. 1.7.9-4) et la procédure (art. 1.7.9-6) sont dans des articles séparés. Ne pas les confondre. Le §2 traite de la complicité avec une personne étrangère à l'école — mais l'alinéa 2 exclut le cas où le fait est commis par les parents de l'élève mineur.",
    confirmation: "L'art. 1.7.9-4 §1 liste les faits graves. Le §2 mentionne « personne étrangère à l'école », « instigation ou complicité » et l'exception parentale.",
  },
  {
    trigger: "5108:73",
    trap: "Le cours FID cite parfois l'art. 43 §2bis — c'est INCORRECT. La bonne référence est l'art. 73 §2bis (conditions de subventionnement).",
    confirmation: "L'article mentionne les conditions de subventionnement et la date du 15 janvier.",
  },
  {
    trigger: "34295:3",
    trap: "L'encadrement différencié se base sur le décret du 30/04/2009 (CDA 34295), pas sur le Code de l'enseignement.",
    confirmation: "L'article définit les classes d'indice socio-économique (ISE) et les moyens supplémentaires.",
  },
  {
    trigger: "46275:6",
    trap: "Les normes d'encadrement DASPA (seuil de 10 primo-arrivants) sont à l'art. 6, pas à l'art. 2 (qui ne donne que les définitions).",
    confirmation: "L'article mentionne le seuil de 10 élèves primo-arrivants et les normes d'encadrement.",
  },
  {
    trigger: "4329:6",
    trap: "Le régime linguistique est dans une loi fédérale de 1963 (CDA 4329), pas dans le Code de l'enseignement. Le terme « chef de famille » est archaïque mais c'est le terme légal.",
    confirmation: "L'article mentionne les communes de la frontière linguistique et la « déclaration sur l'honneur du chef de famille ».",
  },
  {
    trigger: "9547:1er",
    trap: "L'obligation scolaire à temps plein est dans la loi de 1983 (CDA 9547), pas dans le Code. Ne pas confondre avec l'art. 1.7.1-2 du Code qui y fait simplement référence.",
    confirmation: "L'article définit l'âge de l'obligation scolaire (6 à 18 ans) et la distinction temps plein / temps partiel.",
  },
  {
    trigger: "31886:11",
    trap: "Ne pas confondre les §1-§3 (formation réseau 60h) avec le §4 (accompagnement d'intégration 30h). Les conditions du §4 sont cumulatives : 30 heures, formateurs sans lien hiérarchique, sur 3 ans. Ne pas chercher dans le Code de l'enseignement (28737 ou 49466).",
    confirmation: "Le §4 mentionne « 30 heures », « entrée en fonction » et « sans lien hiérarchique avec les directeurs concernés ».",
  },
];

// ============================================================
// Output structure — the 8 sections of the search strategy
// ============================================================

export interface GallilexSearchStrategy {
  /** 1. Type de question */
  questionType: QuestionType;
  /** 2. Matière juridique identifiée */
  legalMatter: string;
  /** 3. Texte à viser en priorité */
  primaryText: {
    cdaCode: string;
    title: string;
    shortTitle: string;
    textType: string;
    rationale: string;
    url: string;
  };
  /** Secondary text if relevant (different CDA) */
  secondaryText: {
    cdaCode: string;
    title: string;
    shortTitle: string;
    url: string;
  } | null;
  /** 4. Point d'entrée dans Gallilex */
  entryPoint: string;
  /** 5. Mots-clés efficaces (Ctrl+F) — 2 to 5 */
  searchKeywords: string[];
  /** 6. Stratégie de recherche (max 4 étapes) */
  steps: string[];
  /** 7. Piège à éviter */
  trap: string | null;
  /** 8. Signe que vous êtes au bon endroit */
  confirmation: string | null;
}

// ============================================================
// Build the search strategy
// ============================================================

export interface BuildSearchInput {
  /** Original user question */
  question: string;
  /** Keywords extracted from the question */
  keywords: string[];
  /** CDA codes selected by routing */
  routedCDAs: string[];
  /** Pivot articles found for this question */
  pivotArticles: PivotArticle[];
}

export function buildGallilexSearch(input: BuildSearchInput): GallilexSearchStrategy | null {
  const { question, keywords, routedCDAs, pivotArticles } = input;

  if (routedCDAs.length === 0 && pivotArticles.length === 0) {
    return null;
  }

  // 1. Question type
  const questionType = detectQuestionType(keywords, question);

  // 2. Primary CDA — select the most thematically relevant CDA.
  //    Pivots are the strongest signal (they target specific articles).
  //    If a CDA has pivots, it's almost certainly the right text.
  //    Among CDAs with pivots, prefer specific texts over the Code (49466).
  const cdaPivotCount: Record<string, number> = {};
  for (const p of pivotArticles) {
    cdaPivotCount[p.cdaCode] = (cdaPivotCount[p.cdaCode] ?? 0) + 1;
  }
  // Count routing hits per CDA (how many theme keywords point to it)
  const cdaRouteCount: Record<string, number> = {};
  for (const cda of routedCDAs) {
    cdaRouteCount[cda] = (cdaRouteCount[cda] ?? 0) + 1;
  }
  // Score = (pivotCount * 3) + (routeCount * 2) + specificityBonus
  // This ensures a CDA with many pivots (like 49466 for DAccE with 3 articles)
  // outranks a CDA with only 1 incidental pivot, even with specificity bonus.
  const pivotsRanked = Object.entries(cdaPivotCount)
    .sort((a, b) => {
      const scoreA = a[1] * 3 + (cdaRouteCount[a[0]] ?? 0) * 2 + (a[0] !== "49466" ? 1 : 0);
      const scoreB = b[1] * 3 + (cdaRouteCount[b[0]] ?? 0) * 2 + (b[0] !== "49466" ? 1 : 0);
      return scoreB - scoreA;
    })
    .map(([cda]) => cda);
  // If we have pivot CDAs, use the best one. Otherwise fall back to routing.
  const primaryCdaCode = pivotsRanked[0] ?? routedCDAs[0];
  const rankedCDAs = [...new Set([...pivotsRanked, ...routedCDAs])];
  const primaryInfo = CDA_REGISTRY[primaryCdaCode];
  if (!primaryInfo) return null;

  // 3. Legal matter
  const legalMatter = MATTER_LABELS[primaryCdaCode] ?? primaryInfo.shortTitle;

  // 4. Primary text
  const primaryText = {
    cdaCode: primaryCdaCode,
    title: primaryInfo.title,
    shortTitle: primaryInfo.shortTitle,
    textType: primaryInfo.textType,
    rationale: primaryInfo.rationale,
    url: `${GALLILEX_BASE}/${primaryCdaCode}`,
  };

  // Secondary text: if pivots or routing reference a different CDA
  let secondaryText: GallilexSearchStrategy["secondaryText"] = null;
  const secondaryCda = rankedCDAs.find((c) => c !== primaryCdaCode);
  if (secondaryCda) {
    const secInfo = CDA_REGISTRY[secondaryCda];
    if (secInfo) {
      secondaryText = {
        cdaCode: secondaryCda,
        title: secInfo.title,
        shortTitle: secInfo.shortTitle,
        url: `${GALLILEX_BASE}/${secondaryCda}`,
      };
    }
  }

  // 5. Entry point
  const primaryPivot = pivotArticles.find((p) => p.cdaCode === primaryCdaCode);
  const entryPoint = primaryPivot
    ? `Ouvrir ${primaryInfo.shortTitle} (CDA ${primaryCdaCode}) et rechercher l'article ${formatArticleForSearch(primaryPivot.articleNumber)}`
    : `Ouvrir ${primaryInfo.shortTitle} (CDA ${primaryCdaCode}) via la recherche Gallilex`;

  // 6. Search keywords — article numbers + distinctive terms
  const searchKeywords = buildSearchKeywords(pivotArticles, keywords, primaryCdaCode);

  // 7. Strategy steps (max 4)
  const steps = buildSteps(primaryInfo, primaryCdaCode, pivotArticles, keywords, secondaryText);

  // 8. Trap + confirmation — prefer traps from the primary CDA
  let trap: string | null = null;
  let confirmation: string | null = null;
  // First pass: traps matching primary CDA
  for (const pivot of pivotArticles) {
    if (pivot.cdaCode !== primaryCdaCode) continue;
    const key = `${pivot.cdaCode}:${pivot.articleNumber}`;
    const known = SEARCH_TRAPS.find((t) => t.trigger === key);
    if (known) {
      trap = known.trap;
      confirmation = known.confirmation;
      break;
    }
  }
  // Second pass: traps from any CDA (fallback)
  if (!trap) {
    for (const pivot of pivotArticles) {
      const key = `${pivot.cdaCode}:${pivot.articleNumber}`;
      const known = SEARCH_TRAPS.find((t) => t.trigger === key);
      if (known) {
        trap = known.trap;
        confirmation = known.confirmation;
        break;
      }
    }
  }
  // Fallback confirmation if no trap matched but we have a pivot
  if (!confirmation && primaryPivot) {
    confirmation = `L'article ${formatArticleForSearch(primaryPivot.articleNumber)} doit traiter explicitement du sujet de votre question.`;
  }

  return {
    questionType,
    legalMatter,
    primaryText,
    secondaryText,
    entryPoint,
    searchKeywords,
    steps,
    trap,
    confirmation,
  };
}

// ============================================================
// Helpers
// ============================================================

function formatArticleForSearch(articleNumber: string): string {
  // Dotted notation (1.5.2-2) → use as-is for Ctrl+F
  // Simple numbers (5, 73) → prefix with "Article "
  return articleNumber.includes(".") ? articleNumber : `Article ${articleNumber}`;
}

function buildSearchKeywords(
  pivotArticles: PivotArticle[],
  keywords: string[],
  primaryCdaCode: string,
): string[] {
  const result: string[] = [];

  // Article numbers from primary CDA pivots (most reliable Ctrl+F targets)
  for (const pivot of pivotArticles) {
    if (pivot.cdaCode !== primaryCdaCode) continue;
    const formatted = formatArticleForSearch(pivot.articleNumber);
    if (!result.includes(formatted)) result.push(formatted);
    if (result.length >= 2) break;
  }

  // Add 2-3 distinctive legal keywords (>4 chars, not generic)
  const GENERIC = new Set(["école", "élève", "enseignement", "article", "décret", "question"]);
  const distinctive = keywords
    .filter((k) => k.length > 4 && !GENERIC.has(k.toLowerCase()))
    .slice(0, 3);
  for (const kw of distinctive) {
    if (!result.includes(kw) && result.length < 5) result.push(kw);
  }

  return result;
}

function buildSteps(
  primaryInfo: { shortTitle: string; textType: string },
  primaryCdaCode: string,
  pivotArticles: PivotArticle[],
  keywords: string[],
  secondaryText: GallilexSearchStrategy["secondaryText"],
): string[] {
  const steps: string[] = [];
  const primaryPivots = pivotArticles.filter((p) => p.cdaCode === primaryCdaCode);

  // Step 1: Open the text
  steps.push(`Ouvrir ${primaryInfo.shortTitle} (CDA ${primaryCdaCode}) dans Gallilex`);

  // Step 2: Navigate to article
  if (primaryPivots.length > 0) {
    const pivot = primaryPivots[0];
    const target = formatArticleForSearch(pivot.articleNumber);
    steps.push(`Ctrl+F « ${target} » — ${pivot.label}`);
  } else {
    // No pivot — suggest keyword search
    const kw = keywords.find((k) => k.length > 4) ?? keywords[0];
    if (kw) steps.push(`Ctrl+F avec le terme « ${kw} » pour localiser la section pertinente`);
  }

  // Step 3: If paragraph or second pivot
  if (primaryPivots.length > 1) {
    const second = primaryPivots[1];
    const target = formatArticleForSearch(second.articleNumber);
    steps.push(`Vérifier aussi ${target} — ${second.label}`);
  }

  // Step 4: Secondary text if different CDA
  if (secondaryText && steps.length < 4) {
    steps.push(`Si nécessaire, consulter aussi ${secondaryText.shortTitle} (CDA ${secondaryText.cdaCode})`);
  }

  return steps.slice(0, 4);
}
