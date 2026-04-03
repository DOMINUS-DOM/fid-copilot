/**
 * FID Exam Non-Regression Test Fixtures
 *
 * Each fixture represents a real FID exam question with:
 * - the question text
 * - expected CDA code(s)
 * - expected pivot article(s)
 * - required legal keywords in the answer
 * - optional expected QCM answer
 */

export interface FidTestCase {
  id: string;
  name: string;
  question: string;
  expectedCdas: string[];
  pivotArticles: string[];
  /** Keywords that MUST appear in the legal chunks or the AI answer */
  requiredKeywords: string[];
  /** If this is a QCM, the correct answer number or letter */
  expectedQcmAnswer?: string;
  /** Additional context for the test */
  notes?: string;
}

export const FID_TEST_CASES: FidTestCase[] = [
  // ─── 1. Communes à facilités / Voeren ───
  {
    id: "voeren-grands-parents",
    name: "Voeren / Fourons — grands-parents domiciliés",
    question:
      "Dans une école francophone de Fourons/Voeren, une inscription est demandée pour un enfant dont les grands-parents résident dans la commune, mais pas les parents. Quelle attitude adopter ?",
    expectedCdas: ["4329"],
    pivotArticles: ["6"],
    requiredKeywords: [
      "chef de famille",
      "résidence",
      "langue maternelle",
      "commune",
    ],
    notes:
      "L'inscription n'est pas possible car la condition de résidence du chef de famille (parents) n'est pas remplie. Le domicile des grands-parents ne suffit pas.",
  },

  // ─── 2. Indice socio-économique ───
  {
    id: "ise-criteres",
    name: "Critères de l'indice socio-économique",
    question:
      "Quels sont les critères pris en compte pour déterminer l'indice socio-économique d'un implantation scolaire ?",
    expectedCdas: ["34295"],
    pivotArticles: ["3"],
    requiredKeywords: [
      "revenu",
      "diplôme",
      "chômage",
      "profession",
    ],
    notes:
      "4 critères : revenus par habitant, niveau des diplômes, taux de chômage, activités professionnelles.",
  },

  // ─── 3. Exclusion après 15 janvier + subventions (Pacte scolaire) ───
  {
    id: "exclusion-15-janvier-subventions",
    name: "Exclusion après le 15 janvier et subventions",
    question:
      "Un élève est exclu définitivement après le 15 janvier. L'école perd-elle les subventions de fonctionnement pour cet élève ? (1) Oui, immédiatement (2) Non, jamais (3) Non, les subventions restent acquises pour l'année en cours (4) Seulement si l'élève n'est pas réinscrit ailleurs",
    expectedCdas: ["5108"],
    pivotArticles: ["73"],
    requiredKeywords: [
      "subvention",
      "fonctionnement",
    ],
    expectedQcmAnswer: "3",
    notes:
      "Article 73 §2bis du Pacte scolaire. Le cours FID cite erronément l'art. 43 §2bis — la bonne référence est l'art. 73 §2bis.",
  },

  // ─── 4. Relevé des absences ───
  {
    id: "releve-absences-heure",
    name: "Relevé des absences à chaque heure de cours",
    question:
      "La direction peut-elle exiger un relevé des absences à chaque heure de cours ?",
    expectedCdas: ["49466"],
    pivotArticles: ["1.7.1-9"],
    requiredKeywords: [
      "registre",
      "fréquentation",
    ],
  },

  // ─── 5. Aménagements raisonnables ───
  {
    id: "amenagements-raisonnables",
    name: "Types d'aménagements raisonnables",
    question:
      "Quels types d'aménagements raisonnables peuvent être accordés à un élève à besoins spécifiques ?",
    expectedCdas: ["49466"],
    pivotArticles: ["1.7.8-1"],
    requiredKeywords: [
      "matériel",
      "organisationnel",
      "pédagogique",
    ],
  },

  // ─── 6. Exclusion définitive / écartement provisoire ───
  {
    id: "exclusion-ecartement",
    name: "Exclusion définitive / écartement provisoire",
    question:
      "Une exclusion définitive ou un écartement immédiat est-il possible ? Décrivez la procédure.",
    expectedCdas: ["49466"],
    pivotArticles: ["1.7.9-4", "1.7.9-5", "1.7.9-6"],
    requiredKeywords: [
      "exclusion",
      "écartement",
      "pouvoir organisateur",
    ],
  },

  // ─── 7. Parents et DAccE ───
  {
    id: "parents-dacce",
    name: "Parents et accès au DAccE",
    question:
      "Les parents ont-ils accès au DAccE de leur enfant ? Quelles données y figurent ?",
    expectedCdas: ["49466"],
    pivotArticles: ["1.10.2-2", "1.10.2-3", "1.10.3-1"],
    requiredKeywords: [
      "DAccE",
      "volet",
    ],
    notes:
      "Article 1.10.3-1 pour l'accès, 1.10.2-2 pour les volets, 1.10.2-3 pour les données disciplinaires interdites.",
  },

  // ─── 8. Évaluations externes ───
  {
    id: "evaluations-externes",
    name: "Responsabilités évaluations externes",
    question:
      "Dans les évaluations externes, quelles sont les responsabilités de la direction et de l'inspection ?",
    expectedCdas: ["49466"],
    pivotArticles: ["1.6.3-10"],
    requiredKeywords: [
      "passation",
      "confidentialité",
      "direction",
      "inspection",
    ],
  },

  // ─── 9. Implantations / règlement des études ───
  {
    id: "implantations-reglement",
    name: "Deux implantations et règles d'évaluation",
    question:
      "Deux implantations d'un même établissement peuvent-elles avoir des règles d'évaluation différentes ?",
    expectedCdas: ["49466"],
    pivotArticles: ["1.5.1-8"],
    requiredKeywords: [
      "règlement des études",
      "implantation",
    ],
  },

  // ─── 10bis. Orientation des études D2 technique de transition ───
  {
    id: "orientation-etudes-d2",
    name: "Orientation des études au D2 — technique de transition",
    question:
      "Au D2, qu'est-ce qui détermine l'orientation des études dans l'enseignement technique de transition ?",
    expectedCdas: ["10450"],
    pivotArticles: ["5"],
    requiredKeywords: [
      "option de base groupée",
      "répertoire",
    ],
    expectedQcmAnswer: "4",
    notes:
      "Article 5 §3 de l'AR du 29/06/1984 : l'orientation est déterminée par l'OBG faisant partie du répertoire. Pas par l'OBG + sa grille.",
  },

  // ─── 10. Personne de confiance ───
  {
    id: "personne-confiance",
    name: "Personne de confiance / harcèlement",
    question:
      "Un délégué syndical peut-il être personne de confiance dans le cadre de la prévention du harcèlement ?",
    expectedCdas: ["45031"],
    pivotArticles: ["32sexies"],
    requiredKeywords: [
      "personne de confiance",
      "délégué syndical",
    ],
    notes:
      "Non. Article 32sexies §2 : la personne de confiance ne peut être ni délégué syndical, ni délégué de l'employeur.",
  },
];
