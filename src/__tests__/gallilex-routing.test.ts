/**
 * Non-regression tests for Gallilex routing (CDA + pivot article detection).
 * These tests verify that the theme mapping and pivot injection work correctly
 * for all critical FID exam scenarios.
 *
 * Run: npm test -- gallilex-routing
 */

import { describe, it, expect } from "vitest";
import {
  searchGallilex,
  findPivotArticles,
  CDA_REGISTRY,
} from "@/lib/ai/gallilex";
import { FID_TEST_CASES } from "./fid-exam-fixtures";

// ============================================================
// 1. CDA Registry completeness
// ============================================================

describe("CDA Registry", () => {
  const requiredCdas = [
    "4329",   // Régime linguistique
    "5108",   // Pacte scolaire
    "9547",   // Obligation scolaire
    "10450",  // AR organisation secondaire
    "17144",  // AR secondaire plein exercice
    "21557",  // Décret Missions
    "25174",  // Régime des congés
    "23189",  // Formation carrière ESAHR
    "28737",  // Enseignement spécialisé
    "34295",  // Encadrement différencié
    "40701",  // Titres et fonctions
    "45031",  // Bien-être au travail
    "45593",  // Contrats d'objectifs
    "46275",  // DASPA / FLA
    "46287",  // Organisation du travail
    "47114",  // Éducateur
    "49466",  // Code de l'enseignement
    "51683",  // Évaluation personnels
    "51784",  // Normes encadrement
  ];

  for (const cda of requiredCdas) {
    it(`contains CDA ${cda}`, () => {
      expect(CDA_REGISTRY[cda]).toBeDefined();
      expect(CDA_REGISTRY[cda].title).toBeTruthy();
      expect(CDA_REGISTRY[cda].shortTitle).toBeTruthy();
    });
  }
});

// ============================================================
// 2. Theme → CDA routing for each test case
// ============================================================

describe("Gallilex CDA routing", () => {
  // Extract keywords from question text (simplified version of app's extractKeywords)
  function extractKeywords(question: string): string[] {
    const stopWords = new Set([
      "le", "la", "les", "un", "une", "des", "du", "de", "en", "et", "ou",
      "à", "au", "aux", "pour", "par", "dans", "sur", "est", "sont", "peut",
      "il", "elle", "ce", "cette", "qui", "que", "quoi", "quel", "quelle",
      "quels", "quelles", "comment", "pourquoi", "deux", "être", "avoir",
      "d", "l", "n", "s", "y", "se", "ne", "pas", "plus", "son", "sa", "ses",
    ]);
    return question
      .toLowerCase()
      .replace(/[?!.,;:()]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));
  }

  const cdaRoutingCases = [
    { keywords: ["Fourons", "Voeren", "commune"], expectedCda: "4329" },
    { keywords: ["encadrement", "différencié", "socio-économique"], expectedCda: "34295" },
    { keywords: ["pacte", "scolaire", "subvention"], expectedCda: "5108" },
    { keywords: ["exclusion", "définitive", "écartement"], expectedCda: "49466" },
    { keywords: ["aménagements", "raisonnables", "besoins"], expectedCda: "49466" },
    { keywords: ["DAccE", "dossier", "accompagnement"], expectedCda: "49466" },
    { keywords: ["évaluation", "externe", "passation"], expectedCda: "49466" },
    { keywords: ["règlement", "études", "implantation"], expectedCda: "49466" },
    { keywords: ["personne", "confiance", "harcèlement"], expectedCda: "45031" },
    { keywords: ["congé", "maladie", "disponibilité"], expectedCda: "25174" },
    { keywords: ["formation", "ESAHR"], expectedCda: "23189" },
    { keywords: ["évaluation", "personnel", "membres"], expectedCda: "51683" },
    { keywords: ["changement", "option", "novembre"], expectedCda: "10450" },
    { keywords: ["orientation", "études", "D2", "technique", "transition"], expectedCda: "10450" },
    { keywords: ["OBG", "répertoire", "options"], expectedCda: "10450" },
    { keywords: ["période", "45", "minutes", "horaire"], expectedCda: "10450" },
    { keywords: ["DASPA", "primo-arrivant"], expectedCda: "46275" },
    { keywords: ["obligation", "scolaire"], expectedCda: "9547" },
    { keywords: ["missions", "prioritaires"], expectedCda: "21557" },
    { keywords: ["violence", "gifle", "insulte"], expectedCda: "49466" },
    { keywords: ["complicité", "personne", "étrangère"], expectedCda: "49466" },
    { keywords: ["agression", "faits", "graves"], expectedCda: "49466" },
  ];

  for (const { keywords, expectedCda } of cdaRoutingCases) {
    it(`routes [${keywords.join(", ")}] → CDA ${expectedCda}`, () => {
      const results = searchGallilex(keywords, []);
      const cdaCodes = results.map((r) => r.cdaCode);
      expect(cdaCodes).toContain(expectedCda);
    });
  }
});

// ============================================================
// 3. Pivot article detection for each FID test case
// ============================================================

describe("Pivot article injection", () => {
  const pivotCases = [
    {
      name: "Frais scolaires → 1.7.2-2",
      keywords: ["frais", "scolaires"],
      expectedArticle: "1.7.2-2",
      expectedCda: "49466",
    },
    {
      name: "Absences → 1.7.1-9 + 1.7.1-8",
      keywords: ["absence", "fréquentation"],
      expectedArticle: "1.7.1-9",
      expectedCda: "49466",
    },
    {
      name: "Tournoi / sport → 1.7.1-8",
      keywords: ["absence", "tournoi", "sport"],
      expectedArticle: "1.7.1-8",
      expectedCda: "49466",
    },
    {
      name: "Aménagements raisonnables → 1.7.8-1",
      keywords: ["aménagements", "raisonnables"],
      expectedArticle: "1.7.8-1",
      expectedCda: "49466",
    },
    {
      name: "Exclusion → 1.7.9-4",
      keywords: ["exclusion", "définitive"],
      expectedArticle: "1.7.9-4",
      expectedCda: "49466",
    },
    {
      name: "Écartement → 1.7.9-5",
      keywords: ["écartement", "provisoire"],
      expectedArticle: "1.7.9-5",
      expectedCda: "49466",
    },
    {
      name: "DAccE → 1.10.2-2 + 1.10.2-3 + 1.10.3-1",
      keywords: ["DAccE", "parents"],
      expectedArticle: "1.10.3-1",
      expectedCda: "49466",
    },
    {
      name: "Évaluations externes → 1.6.3-10",
      keywords: ["évaluations", "externes"],
      expectedArticle: "1.6.3-10",
      expectedCda: "49466",
    },
    {
      name: "Implantation / règlement → 1.5.1-8",
      keywords: ["implantation", "règlement"],
      expectedArticle: "1.5.1-8",
      expectedCda: "49466",
    },
    {
      name: "Personne de confiance → 32sexies",
      keywords: ["personne", "confiance", "harcèlement"],
      expectedArticle: "32sexies",
      expectedCda: "45031",
    },
    {
      name: "Formation collective → 6.1.3-2",
      keywords: ["formation", "collective", "journée"],
      expectedArticle: "6.1.3-2",
      expectedCda: "49466",
    },
    {
      name: "Travail collaboratif → 15",
      keywords: ["travail", "collaboratif"],
      expectedArticle: "15",
      expectedCda: "46287",
    },
    {
      name: "Orientation études D2 → 5",
      keywords: ["orientation", "études", "D2", "technique", "transition"],
      expectedArticle: "5",
      expectedCda: "10450",
    },
    {
      name: "OBG répertoire → 5",
      keywords: ["OBG", "répertoire", "options"],
      expectedArticle: "5",
      expectedCda: "10450",
    },
    {
      name: "Deuxième degré → 5",
      keywords: ["deuxième", "degré", "orientation"],
      expectedArticle: "5",
      expectedCda: "10450",
    },
    {
      name: "Changement d'option → 12",
      keywords: ["changement", "option"],
      expectedArticle: "12",
      expectedCda: "10450",
    },
    {
      name: "Périodes 45 min → 1er",
      keywords: ["45 minutes"],
      expectedArticle: "1er",
      expectedCda: "10450",
    },
    {
      name: "DASPA → 2",
      keywords: ["DASPA", "primo-arrivant"],
      expectedArticle: "2",
      expectedCda: "46275",
    },
    {
      name: "Obligation scolaire → 1er",
      keywords: ["obligation", "scolaire"],
      expectedArticle: "1er",
      expectedCda: "9547",
    },
    {
      name: "Missions prioritaires → 6",
      keywords: ["missions", "prioritaires"],
      expectedArticle: "6",
      expectedCda: "21557",
    },
    {
      name: "Encadrement différencié / ISE → 3",
      keywords: ["encadrement", "différencié", "ISE"],
      expectedArticle: "3",
      expectedCda: "34295",
    },
    {
      name: "DASPA encadrement → 6",
      keywords: ["DASPA", "primo-arrivant", "encadrement"],
      expectedArticle: "6",
      expectedCda: "46275",
    },
    {
      name: "Subventions / 15 janvier → 73",
      keywords: ["subventions", "exclusion", "15 janvier"],
      expectedArticle: "73",
      expectedCda: "5108",
    },
    {
      name: "Complicité personne étrangère → 1.7.9-4",
      keywords: ["complicité", "personne", "étrangère", "violence"],
      expectedArticle: "1.7.9-4",
      expectedCda: "49466",
    },
    {
      name: "Violence / instigation → 1.7.9-4",
      keywords: ["instigation", "gifle", "insulte"],
      expectedArticle: "1.7.9-4",
      expectedCda: "49466",
    },
    {
      name: "Agression enseignant → 1.7.9-4",
      keywords: ["agression", "frère", "violence", "trottoir"],
      expectedArticle: "1.7.9-4",
      expectedCda: "49466",
    },
  ];

  for (const { name, keywords, expectedArticle, expectedCda } of pivotCases) {
    it(`detects ${name}`, () => {
      const pivots = findPivotArticles(keywords);
      const found = pivots.find(
        (p) => p.articleNumber === expectedArticle && p.cdaCode === expectedCda
      );
      expect(found).toBeDefined();
    });
  }

  it("returns at most 5 pivot articles", () => {
    // Use many keywords that trigger multiple pivots
    const pivots = findPivotArticles([
      "exclusion", "DAccE", "aménagement", "frais", "absence",
      "implantation", "évaluation", "personne", "confiance",
    ]);
    expect(pivots.length).toBeLessThanOrEqual(5);
  });

  it("deduplicates pivot articles", () => {
    // "exclusion" and "exclusion définitive" both map to 1.7.9-4
    const pivots = findPivotArticles(["exclusion", "définitive"]);
    const art194 = pivots.filter(
      (p) => p.cdaCode === "49466" && p.articleNumber === "1.7.9-4"
    );
    expect(art194.length).toBe(1);
  });

  it("anti-pollution: 'direction' alone does not trigger 31886 pivots", () => {
    // v4.3 bug: "direction" matched "accompagnement direction" → 31886:11 parasite
    // Keywords from "la direction impose de noter les absences à chaque heure"
    const pivots = findPivotArticles([
      "note", "affichée", "valves", "direction",
      "impose", "enseignants", "noter", "absences",
      "chaque", "heure",
    ]);
    const has31886 = pivots.some((p) => p.cdaCode === "31886");
    expect(has31886).toBe(false);
    // Must still detect absence pivots
    const has179 = pivots.some(
      (p) => p.cdaCode === "49466" && p.articleNumber === "1.7.1-9"
    );
    expect(has179).toBe(true);
  });

  it("multi-word trigger 'accompagnement direction' requires both words", () => {
    // Should match when both words present
    const pivots = findPivotArticles(["accompagnement", "direction"]);
    const has31886_11 = pivots.some(
      (p) => p.cdaCode === "31886" && p.articleNumber === "11"
    );
    expect(has31886_11).toBe(true);
  });
});

// ============================================================
// 4. Prompt concordance checks (art. 43 → 73, Décret → AR)
// ============================================================

describe("Prompt concordance — pièges fréquents", () => {
  // We import the prompt module to verify the concordance warnings are present
  // This is a structural test, not a Supabase test

  it("contains art. 73 §2bis correction for Pacte scolaire", async () => {
    // Read the prompt.ts file content via the exported function
    const { buildSystemPrompt } = await import("@/lib/ai/prompt");
    const prompt = buildSystemPrompt([], "examen");
    expect(prompt).toContain("73 §2bis");
    expect(prompt).toContain("43 §2bis");
    expect(prompt).toContain("INCORRECT");
  });

  it("contains Décret 29/07/1992 → AR correction", async () => {
    const { buildSystemPrompt } = await import("@/lib/ai/prompt");
    const prompt = buildSystemPrompt([], "examen");
    expect(prompt).toContain("29/07/1992");
    expect(prompt).toContain("AR du 29/06/1984");
  });
});
