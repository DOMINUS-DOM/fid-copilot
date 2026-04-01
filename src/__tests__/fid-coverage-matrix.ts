/**
 * FID Coverage Matrix — 15 critical exam cases
 *
 * This file tracks the end-to-end coverage status of each critical FID case:
 * - presence: pivot articles exist in legal_chunks
 * - routing: THEME_CDA_MAP routes keywords to the correct CDA
 * - retrieval: FTS or pivot injection surfaces the right article
 * - tested: covered by automated non-regression tests
 * - confidence: overall confidence level (secured / partial / fragile)
 *
 * Last audit: 2026-04-01 via scripts/coverage-matrix-audit.py
 */

export type Confidence = "secured" | "partial" | "fragile";

export interface CoverageCase {
  id: string;
  name: string;
  theme: string;
  cdaCode: string;
  pivotArticles: string[];
  /** All pivot articles present in legal_chunks */
  presence: boolean;
  /** THEME_CDA_MAP routes to the correct CDA */
  routing: boolean;
  /** FTS or pivot injection retrieves the pivot article */
  retrieval: boolean;
  /** Covered by automated tests (gallilex-routing + legal-chunks-retrieval + api-integration) */
  tested: boolean;
  /** Overall confidence */
  confidence: Confidence;
  /** Notes / known gaps */
  remarks: string;
}

export const FID_COVERAGE_MATRIX: CoverageCase[] = [
  // ──────────────────────────────────────────────
  // 10 original cases (P0–P1bis validated)
  // ──────────────────────────────────────────────
  {
    id: "voeren",
    name: "Voeren / Fourons / grands-parents",
    theme: "Régime linguistique",
    cdaCode: "4329",
    pivotArticles: ["6"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "FTS + pivot OK. Concordance piège 'chef de famille' dans prompt.",
  },
  {
    id: "ise",
    name: "Indice socio-économique",
    theme: "Encadrement différencié",
    cdaCode: "34295",
    pivotArticles: ["3"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "FTS retrouve art. 3 en rang 1.",
  },
  {
    id: "exclusion-15-janv",
    name: "Exclusion après 15 janvier / subventions",
    theme: "Pacte scolaire",
    cdaCode: "5108",
    pivotArticles: ["73"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "Concordance art. 43→73 §2bis corrigée dans prompt.",
  },
  {
    id: "absences-heure",
    name: "Relevé absences à chaque heure",
    theme: "Fréquentation",
    cdaCode: "49466",
    pivotArticles: ["1.7.1-9"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "FTS + pivot injection OK.",
  },
  {
    id: "amenagements",
    name: "Aménagements raisonnables",
    theme: "Besoins spécifiques",
    cdaCode: "49466",
    pivotArticles: ["1.7.8-1"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "FTS ne retrouve pas le pivot, mais injection pivot compense. Test pivot OK.",
  },
  {
    id: "exclusion-ecartement",
    name: "Exclusion définitive / écartement",
    theme: "Discipline",
    cdaCode: "49466",
    pivotArticles: ["1.7.9-4", "1.7.9-5", "1.7.9-6"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "3 articles pivot injectés. FTS retrouve 1.7.9-5.",
  },
  {
    id: "dacce-parents",
    name: "Parents et accès au DAccE",
    theme: "DAccE",
    cdaCode: "49466",
    pivotArticles: ["1.10.2-2", "1.10.2-3", "1.10.3-1"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "Cross-contamination corrigée P1bis. 3 articles DAccE injectés.",
  },
  {
    id: "evaluations-ext",
    name: "Évaluations externes",
    theme: "Évaluation",
    cdaCode: "49466",
    pivotArticles: ["1.6.3-10"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "FTS ne retrouve pas le pivot, mais injection pivot compense. Test pivot OK.",
  },
  {
    id: "implantations",
    name: "Deux implantations / règlement études",
    theme: "Organisation",
    cdaCode: "49466",
    pivotArticles: ["1.5.1-8"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "FTS + pivot OK.",
  },
  {
    id: "personne-confiance",
    name: "Personne de confiance / harcèlement",
    theme: "Bien-être",
    cdaCode: "45031",
    pivotArticles: ["32sexies"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "FTS retrouve 32sexies. Pivot OK.",
  },

  // ──────────────────────────────────────────────
  // 5 nouveaux cas
  // ──────────────────────────────────────────────
  {
    id: "changement-option",
    name: "Changement d'option après 15/11",
    theme: "Admission / inscription",
    cdaCode: "10450",
    pivotArticles: ["12", "19"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "Articles présents. FTS vide mais pivot injection compense. Routage + présence + pipeline testés.",
  },
  {
    id: "periodes-45min",
    name: "Périodes de 45 minutes",
    theme: "Organisation horaire",
    cdaCode: "10450",
    pivotArticles: ["2"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "Article 2 présent. Pivot injection compense FTS. Routage + présence + pipeline testés.",
  },
  {
    id: "daspa",
    name: "DASPA / primo-arrivants",
    theme: "DASPA / FLA",
    cdaCode: "46275",
    pivotArticles: ["2", "3"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "FTS + pivot OK. Routage + présence + keywords + pipeline testés.",
  },
  {
    id: "obligation-scolaire",
    name: "Obligation scolaire à temps plein",
    theme: "Obligation scolaire",
    cdaCode: "9547",
    pivotArticles: ["1er"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "Article stocké '1er'. Pivot corrigé. Routage + présence + keywords + pipeline testés.",
  },
  {
    id: "missions-prioritaires",
    name: "Missions prioritaires de l'enseignement",
    theme: "Missions",
    cdaCode: "21557",
    pivotArticles: ["6"],
    presence: true,
    routing: true,
    retrieval: true,
    tested: true,
    confidence: "secured",
    remarks: "Article 6 inséré (87e121e8). Pivot injection OK. Routage + présence + keywords + pipeline testés.",
  },
];

// ============================================================
// Summary helpers
// ============================================================

export function getCoverageSummary() {
  const total = FID_COVERAGE_MATRIX.length;
  const secured = FID_COVERAGE_MATRIX.filter((c) => c.confidence === "secured").length;
  const partial = FID_COVERAGE_MATRIX.filter((c) => c.confidence === "partial").length;
  const fragile = FID_COVERAGE_MATRIX.filter((c) => c.confidence === "fragile").length;
  const tested = FID_COVERAGE_MATRIX.filter((c) => c.tested).length;

  return { total, secured, partial, fragile, tested };
}
