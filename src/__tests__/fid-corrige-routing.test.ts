/**
 * FID Corrigé — Routing & Pivot tests (Bloc 1)
 *
 * Verifies that questions from the official FID correction corpus
 * are correctly routed to the right CDA codes and pivot articles.
 *
 * Run: npm test -- fid-corrige-routing
 */

import { describe, it, expect } from "vitest";
import { searchGallilex, findPivotArticles } from "@/lib/ai/gallilex";
import { extractKeywords } from "@/lib/ai/shared-pipeline";
import { FID_CORRIGE_BLOC1, FID_CORRIGE_BLOC2, FID_CORRIGE_BLOC3, FID_CORRIGE_BLOC4, FID_CORRIGE_BLOC5 } from "./fid-corrige-dataset";

// ============================================================
// 1. CDA Routing — each corrigé case routes to expected CDA
// ============================================================

describe("Corrigé Bloc 1 — CDA routing", () => {
  const routingCases = [
    { id: "b1-ex01", keywords: ["missions", "prioritaires", "émancipation"], expectedCda: "49466" },
    { id: "b1-ex02", keywords: ["plan", "pilotage", "contrat", "objectifs", "missions"], expectedCda: "49466" },
    { id: "b1-ex03", keywords: ["délégué", "contrat", "objectifs", "formation"], expectedCda: "45593" },
    { id: "b1-ex04", keywords: ["suivi", "rapproché", "contrat", "objectifs", "missions", "pilotage"], expectedCda: "49466" },
    { id: "b1-ex05", keywords: ["projet", "école", "plan", "pilotage"], expectedCda: "49466" },
    { id: "b1-ex06", keywords: ["CES", "centre", "enseignement", "secondaire"], expectedCda: "5108" },
    { id: "b1-ex08", keywords: ["périodes", "45", "minutes", "horaire"], expectedCda: "10450" },
    { id: "b1-ex11", keywords: ["orientation", "études", "D2", "technique", "transition"], expectedCda: "10450" },
    { id: "b1-ex12", keywords: ["répertoire", "options", "R2", "création"], expectedCda: "45721" },
    { id: "b1-ex13", keywords: ["immersion", "linguistique", "anglais", "néerlandais"], expectedCda: "32365" },
    { id: "b1-ex16", keywords: ["indice", "socio-économique", "encadrement", "différencié"], expectedCda: "34295" },
    { id: "b1-ex19", keywords: ["encadrement", "différencié", "moyens", "humains"], expectedCda: "34295" },
    { id: "b1-ex22", keywords: ["DASPA", "primo-arrivant", "encadrement"], expectedCda: "46275" },
    { id: "b1-ex23", keywords: ["subventions", "exclusion", "15", "janvier"], expectedCda: "5108" },
    { id: "b1-ex51", keywords: ["DASPA", "conseil", "intégration", "primo-arrivant"], expectedCda: "46275" },
  ];

  for (const { id, keywords, expectedCda } of routingCases) {
    it(`${id} routes to CDA ${expectedCda}`, () => {
      const results = searchGallilex(keywords, []);
      const cdaCodes = results.map((r) => r.cdaCode);
      expect(cdaCodes).toContain(expectedCda);
    });
  }
});

// ============================================================
// 2. Pivot injection — expected articles are detected
// ============================================================

describe("Corrigé Bloc 1 — Pivot injection", () => {
  const pivotCases = [
    {
      id: "b1-ex04",
      name: "Suivi rapproché → 1.5.2-10",
      keywords: ["contrat", "objectifs", "suivi", "rapproché"],
      expectedCda: "49466",
      expectedArticle: "1.5.2-10",
    },
    {
      id: "b1-ex11",
      name: "Orientation D2 → art. 5",
      keywords: ["orientation", "études", "D2", "technique", "transition"],
      expectedCda: "10450",
      expectedArticle: "5",
    },
    {
      id: "b1-ex08",
      name: "45 minutes → art. 1er (NOT art. 2)",
      keywords: ["45", "minutes", "périodes"],
      expectedCda: "10450",
      expectedArticle: "1er",
    },
  ];

  for (const { id, name, keywords, expectedCda, expectedArticle } of pivotCases) {
    it(`${id}: ${name}`, () => {
      const pivots = findPivotArticles(keywords);
      const found = pivots.find(
        (p) => p.cdaCode === expectedCda && p.articleNumber === expectedArticle
      );
      expect(found).toBeDefined();
    });
  }
});

// ============================================================
// 3. Real question keyword extraction
// ============================================================

describe("Corrigé Bloc 1 — Keyword extraction from real questions", () => {
  it("Ex1: missions prioritaires question extracts relevant keywords", () => {
    const kw = extractKeywords(
      "Choisissez l'item correct concernant les missions prioritaires de l'enseignement"
    );
    expect(kw).toEqual(expect.arrayContaining(["missions", "prioritaires"]));
  });

  it("Ex11: orientation D2 question extracts key terms", () => {
    const kw = extractKeywords(
      "Au D2, qu'est-ce qui détermine l'orientation des études dans l'enseignement technique de transition"
    );
    expect(kw).toEqual(
      expect.arrayContaining(["détermine", "orientation", "études", "technique", "transition"])
    );
  });

  it("Ex8: 45 minutes question extracts relevant keywords", () => {
    const kw = extractKeywords(
      "Une direction souhaite aménager l'horaire des cours pour organiser des périodes de 45 minutes"
    );
    expect(kw).toEqual(expect.arrayContaining(["périodes", "minutes"]));
  });
});

// ============================================================
// 4. Bloc 2 — CDA routing
// ============================================================

describe("Corrigé Bloc 2 — CDA routing", () => {
  const routingCases = [
    { id: "b2-ex24", keywords: ["frais", "scolaires", "piscine", "photocopies"], expectedCda: "49466" },
    { id: "b2-ex26", keywords: ["obligation", "scolaire", "travail", "mineur"], expectedCda: "9547" },
    { id: "b2-ex27", keywords: ["sportif", "rémunéré", "contrat", "14 ans"], expectedCda: "9547" },
    { id: "b2-ex28", keywords: ["absence", "justifiée", "tournoi", "compétition"], expectedCda: "49466" },
    { id: "b2-ex29", keywords: ["registre", "fréquentation", "absences"], expectedCda: "49466" },
    { id: "b2-ex30", keywords: ["élève", "libre", "sanction", "études"], expectedCda: "10450" },
    { id: "b2-ex14", keywords: ["alternance", "CEFA", "module", "formation"], expectedCda: "16421" },
    { id: "b2-ex36", keywords: ["obligation", "scolaire", "alternance", "CEFA"], expectedCda: "16421" },
    { id: "b2-ex15", keywords: ["Voeren", "Fourons", "inscription", "langue"], expectedCda: "4329" },
  ];

  for (const { id, keywords, expectedCda } of routingCases) {
    it(`${id} routes to CDA ${expectedCda}`, () => {
      const results = searchGallilex(keywords, []);
      const cdaCodes = results.map((r) => r.cdaCode);
      expect(cdaCodes).toContain(expectedCda);
    });
  }
});

// ============================================================
// 5. Bloc 2 — Pivot injection
// ============================================================

describe("Corrigé Bloc 2 — Pivot injection", () => {
  const pivotCases = [
    {
      id: "b2-ex24",
      name: "Frais scolaires → 1.7.2-2",
      keywords: ["frais", "scolaires"],
      expectedCda: "49466",
      expectedArticle: "1.7.2-2",
    },
    {
      id: "b2-ex26",
      name: "Travail mineur → art. 10",
      keywords: ["travail", "mineur", "obligation"],
      expectedCda: "9547",
      expectedArticle: "10",
    },
    {
      id: "b2-ex27",
      name: "Sportif rémunéré → art. 11",
      keywords: ["sportif", "rémunéré"],
      expectedCda: "9547",
      expectedArticle: "11",
    },
    {
      id: "b2-ex28",
      name: "Absences → 1.7.1-8",
      keywords: ["absence", "tournoi"],
      expectedCda: "49466",
      expectedArticle: "1.7.1-8",
    },
    {
      id: "b2-ex29",
      name: "Registre → 1.7.1-9",
      keywords: ["registre", "fréquentation"],
      expectedCda: "49466",
      expectedArticle: "1.7.1-9",
    },
    {
      id: "b2-ex30",
      name: "Élève libre → art. 2",
      keywords: ["élève", "libre"],
      expectedCda: "10450",
      expectedArticle: "2",
    },
    {
      id: "b2-ex14",
      name: "Alternance MFI → 2bis",
      keywords: ["alternance", "CEFA", "module"],
      expectedCda: "16421",
      expectedArticle: "2bis",
    },
    {
      id: "b2-ex15",
      name: "Voeren → art. 6",
      keywords: ["Voeren", "Fourons"],
      expectedCda: "4329",
      expectedArticle: "6",
    },
  ];

  for (const { id, name, keywords, expectedCda, expectedArticle } of pivotCases) {
    it(`${id}: ${name}`, () => {
      const pivots = findPivotArticles(keywords);
      const found = pivots.find(
        (p) => p.cdaCode === expectedCda && p.articleNumber === expectedArticle
      );
      expect(found).toBeDefined();
    });
  }
});

// ============================================================
// 6. Bloc 3 — CDA routing
// ============================================================

describe("Corrigé Bloc 3 — CDA routing", () => {
  const routingCases = [
    { id: "b3-ex31", keywords: ["spécialisé", "ordinaire", "passage", "admission"], expectedCda: "28737" },
    { id: "b3-ex33", keywords: ["primo-arrivant", "DASPA", "territoire", "conditions"], expectedCda: "46275" },
    { id: "b3-ex34", keywords: ["âge", "admission", "31 décembre", "secondaire"], expectedCda: "10450" },
    { id: "b3-ex35", keywords: ["premier degré", "1D", "1C", "passage", "admission"], expectedCda: "30998" },
    { id: "b3-ex39", keywords: ["premier degré", "trois ans", "durée", "dérogation"], expectedCda: "30998" },
    { id: "b3-ex40", keywords: ["CE1D", "2C", "orientation", "année supplémentaire"], expectedCda: "30998" },
    { id: "b3-ex41", keywords: ["2D", "CEB", "orientation", "premier degré"], expectedCda: "30998" },
    { id: "b3-ex42", keywords: ["2S", "CE1D", "formes", "sections", "conseil de classe"], expectedCda: "30998" },
    { id: "b3-ex44", keywords: ["admission", "forme", "changement", "4G", "technique"], expectedCda: "10450" },
    { id: "b3-ex45", keywords: ["changement", "option", "16 novembre", "directeur"], expectedCda: "10450" },
    { id: "b3-ex50", keywords: ["changement", "OBG", "professionnelle", "option"], expectedCda: "10450" },
    { id: "b3-ex47", keywords: ["recours", "AOB", "interne", "externe"], expectedCda: "21557" },
    { id: "b3-ex52", keywords: ["règlement", "études", "évaluation", "implantation"], expectedCda: "49466" },
    { id: "b3-ex53", keywords: ["évaluation externe", "directeur", "inspecteur", "passation"], expectedCda: "49466" },
    { id: "b3-ex48", keywords: ["qualification", "spécialisé", "stages", "CQ"], expectedCda: "28737" },
    { id: "b3-ex46", keywords: ["7P", "qualification", "CESS", "septième"], expectedCda: "10450" },
  ];

  for (const { id, keywords, expectedCda } of routingCases) {
    it(`${id} routes to CDA ${expectedCda}`, () => {
      const results = searchGallilex(keywords, []);
      const cdaCodes = results.map((r) => r.cdaCode);
      expect(cdaCodes).toContain(expectedCda);
    });
  }
});

// ============================================================
// 7. Bloc 3 — Pivot injection
// ============================================================

describe("Corrigé Bloc 3 — Pivot injection", () => {
  const pivotCases = [
    {
      id: "b3-ex31",
      name: "Passage spécialisé → art. 65",
      keywords: ["passage", "spécialisé", "ordinaire"],
      expectedCda: "28737",
      expectedArticle: "65",
    },
    {
      id: "b3-ex40",
      name: "CE1D → art. 26",
      keywords: ["CE1D", "orientation", "2C"],
      expectedCda: "30998",
      expectedArticle: "26",
    },
    {
      id: "b3-ex41",
      name: "2D orientation → art. 28",
      keywords: ["2D", "orientation"],
      expectedCda: "30998",
      expectedArticle: "28",
    },
    {
      id: "b3-ex45",
      name: "Changement option 16 nov → art. 20",
      keywords: ["changement", "option", "16 novembre"],
      expectedCda: "10450",
      expectedArticle: "20",
    },
    {
      id: "b3-ex47",
      name: "Recours AOB → art. 96",
      keywords: ["recours", "AOB"],
      expectedCda: "21557",
      expectedArticle: "96",
    },
    {
      id: "b3-ex47b",
      name: "Recours AOB → art. 98",
      keywords: ["recours", "AOB"],
      expectedCda: "21557",
      expectedArticle: "98",
    },
    {
      id: "b3-ex52",
      name: "Règlement études → 1.5.1-8",
      keywords: ["règlement des études", "implantation"],
      expectedCda: "49466",
      expectedArticle: "1.5.1-8",
    },
    {
      id: "b3-ex53",
      name: "Évaluation externe → 1.6.3-10",
      keywords: ["évaluation externe", "passation"],
      expectedCda: "49466",
      expectedArticle: "1.6.3-10",
    },
    {
      id: "b3-ex48",
      name: "CQ spécialisé → art. 59",
      keywords: ["qualification", "spécialisé", "stages"],
      expectedCda: "28737",
      expectedArticle: "59",
    },
    {
      id: "b3-ex46",
      name: "7P → art. 17",
      keywords: ["7P", "septième professionnelle"],
      expectedCda: "10450",
      expectedArticle: "17",
    },
  ];

  for (const { id, name, keywords, expectedCda, expectedArticle } of pivotCases) {
    it(`${id}: ${name}`, () => {
      const pivots = findPivotArticles(keywords);
      const found = pivots.find(
        (p) => p.cdaCode === expectedCda && p.articleNumber === expectedArticle
      );
      expect(found).toBeDefined();
    });
  }
});

// ============================================================
// 8. Bloc 4 — CDA routing
// ============================================================

describe("Corrigé Bloc 4 — CDA routing", () => {
  const routingCases = [
    { id: "b4-ex54", keywords: ["DAccE", "volets", "parents", "accès", "dossier"], expectedCda: "49466" },
    { id: "b4-ex56", keywords: ["PIA", "intégration", "pôle territorial", "spécialisé"], expectedCda: "28737" },
    { id: "b4-ex57", keywords: ["PIA", "2C", "observations", "compétences", "premier degré"], expectedCda: "30998" },
    { id: "b4-ex58", keywords: ["aménagement", "raisonnable", "besoins spécifiques", "pédagogique"], expectedCda: "49466" },
    { id: "b4-ex63", keywords: ["DAccE", "dossier", "accompagnement", "volets", "données"], expectedCda: "49466" },
    { id: "b4-ex65", keywords: ["PMS", "bien-être", "climat scolaire", "rencontre"], expectedCda: "49466" },
    { id: "b4-ex59", keywords: ["ROI", "règlement", "ordre intérieur", "pouvoir organisateur"], expectedCda: "49466" },
    { id: "b4-ex60", keywords: ["police", "accès", "mandat", "flagrant", "école"], expectedCda: "49466" },
    { id: "b4-ex61", keywords: ["exclusion", "fait grave", "complicité", "personne étrangère"], expectedCda: "49466" },
    { id: "b4-ex62", keywords: ["exclusion", "écartement", "réinscription", "procédure"], expectedCda: "49466" },
  ];

  for (const { id, keywords, expectedCda } of routingCases) {
    it(`${id} routes to CDA ${expectedCda}`, () => {
      const results = searchGallilex(keywords, []);
      const cdaCodes = results.map((r) => r.cdaCode);
      expect(cdaCodes).toContain(expectedCda);
    });
  }
});

// ============================================================
// 9. Bloc 4 — Pivot injection
// ============================================================

describe("Corrigé Bloc 4 — Pivot injection", () => {
  const pivotCases = [
    {
      id: "b4-ex54",
      name: "DAccE → 1.10.2-2",
      keywords: ["DAccE", "volets"],
      expectedCda: "49466",
      expectedArticle: "1.10.2-2",
    },
    {
      id: "b4-ex54b",
      name: "DAccE accès → 1.10.3-1",
      keywords: ["DAccE", "accès"],
      expectedCda: "49466",
      expectedArticle: "1.10.3-1",
    },
    {
      id: "b4-ex56",
      name: "PIA intégration → art. 132",
      keywords: ["PIA", "intégration"],
      expectedCda: "28737",
      expectedArticle: "132",
    },
    {
      id: "b4-ex57",
      name: "PIA 1er degré → 7bis",
      keywords: ["PIA", "premier degré"],
      expectedCda: "30998",
      expectedArticle: "7bis",
    },
    {
      id: "b4-ex58",
      name: "Aménagements raisonnables → 1.7.8-1",
      keywords: ["aménagement", "raisonnable"],
      expectedCda: "49466",
      expectedArticle: "1.7.8-1",
    },
    {
      id: "b4-ex63",
      name: "DAccE données disciplinaires → 1.10.2-3",
      keywords: ["DAccE", "disciplinaire"],
      expectedCda: "49466",
      expectedArticle: "1.10.2-3",
    },
    {
      id: "b4-ex65",
      name: "Bien-être → 1.7.10-3",
      keywords: ["bien-être", "climat scolaire"],
      expectedCda: "49466",
      expectedArticle: "1.7.10-3",
    },
    {
      id: "b4-ex59",
      name: "ROI → 1.5.1-9",
      keywords: ["ROI", "règlement d'ordre intérieur"],
      expectedCda: "49466",
      expectedArticle: "1.5.1-9",
    },
    {
      id: "b4-ex60",
      name: "Police accès → 1.5.1-11",
      keywords: ["police", "accès", "école"],
      expectedCda: "49466",
      expectedArticle: "1.5.1-11",
    },
    {
      id: "b4-ex62",
      name: "Exclusion → 1.7.9-4",
      keywords: ["exclusion", "définitive"],
      expectedCda: "49466",
      expectedArticle: "1.7.9-4",
    },
    {
      id: "b4-ex62b",
      name: "Écartement → 1.7.9-5",
      keywords: ["écartement", "provisoire"],
      expectedCda: "49466",
      expectedArticle: "1.7.9-5",
    },
    {
      id: "b4-ex62c",
      name: "Non-réinscription → 1.7.9-11",
      keywords: ["réinscription", "exclusion"],
      expectedCda: "49466",
      expectedArticle: "1.7.9-11",
    },
  ];

  for (const { id, name, keywords, expectedCda, expectedArticle } of pivotCases) {
    it(`${id}: ${name}`, () => {
      const pivots = findPivotArticles(keywords);
      const found = pivots.find(
        (p) => p.cdaCode === expectedCda && p.articleNumber === expectedArticle
      );
      expect(found).toBeDefined();
    });
  }
});

// ============================================================
// 10. Bloc 5 — CDA routing
// ============================================================

describe("Corrigé Bloc 5 — CDA routing", () => {
  const routingCases = [
    { id: "b5-ex67", keywords: ["référent", "numérique", "formation", "candidature"], expectedCda: "46287" },
    { id: "b5-ex68", keywords: ["travail collaboratif", "60 périodes", "temps plein"], expectedCda: "46287" },
    { id: "b5-ex69", keywords: ["sanction disciplinaire", "chambre de recours", "PO", "personnel"], expectedCda: "5108" },
    { id: "b5-ex70", keywords: ["disponibilité", "maladie", "traitement", "attente"], expectedCda: "25174" },
    { id: "b5-ex71", keywords: ["indemnité vélo", "bicyclette", "kilomètre", "transport"], expectedCda: "27861" },
    { id: "b5-ex73", keywords: ["inspection", "manquement", "aptitude pédagogique"], expectedCda: "47237" },
    { id: "b5-ex74", keywords: ["inspection", "manquement", "programme", "contrôle"], expectedCda: "47237" },
    { id: "b5-ex75", keywords: ["formation collective", "journée pédagogique", "obligatoire"], expectedCda: "49466" },
    { id: "b5-ex76", keywords: ["formation collective", "demi-jours", "capitalisable"], expectedCda: "49466" },
    { id: "b5-ex77", keywords: ["lettre de mission", "direction", "stagiaire", "six ans"], expectedCda: "31886" },
    { id: "b5-ex78", keywords: ["directeur", "stage directeur", "intégration", "30 heures"], expectedCda: "31886" },
    { id: "b5-ex79", keywords: ["profil de fonction", "directeur", "responsabilité", "pilotage"], expectedCda: "31886" },
    { id: "b5-ex80", keywords: ["harcèlement", "moral", "personne de confiance", "bien-être"], expectedCda: "45031" },
    { id: "b5-ex81", keywords: ["personne de confiance", "délégué syndical", "CPPT"], expectedCda: "45031" },
  ];

  for (const { id, keywords, expectedCda } of routingCases) {
    it(`${id} routes to CDA ${expectedCda}`, () => {
      const results = searchGallilex(keywords, []);
      const cdaCodes = results.map((r) => r.cdaCode);
      expect(cdaCodes).toContain(expectedCda);
    });
  }
});

// ============================================================
// 11. Bloc 5 — Pivot injection
// ============================================================

describe("Corrigé Bloc 5 — Pivot injection", () => {
  const pivotCases = [
    {
      id: "b5-ex67",
      name: "Référent numérique → art. 9",
      keywords: ["référent numérique"],
      expectedCda: "46287",
      expectedArticle: "9",
    },
    {
      id: "b5-ex68",
      name: "Travail collaboratif → art. 15",
      keywords: ["travail collaboratif"],
      expectedCda: "46287",
      expectedArticle: "15",
    },
    {
      id: "b5-ex69",
      name: "Sanction disciplinaire → art. 45",
      keywords: ["sanction disciplinaire", "chambre de recours"],
      expectedCda: "5108",
      expectedArticle: "45",
    },
    {
      id: "b5-ex70",
      name: "Disponibilité maladie → art. 14",
      keywords: ["disponibilité maladie"],
      expectedCda: "25174",
      expectedArticle: "14",
    },
    {
      id: "b5-ex71",
      name: "Indemnité vélo → art. 7",
      keywords: ["indemnité vélo", "bicyclette"],
      expectedCda: "27861",
      expectedArticle: "7",
    },
    {
      id: "b5-ex74",
      name: "Manquement inspection → art. 4",
      keywords: ["manquement", "inspection"],
      expectedCda: "47237",
      expectedArticle: "4",
    },
    {
      id: "b5-ex73",
      name: "Aptitude pédagogique → 46239:4/1",
      keywords: ["aptitude pédagogique"],
      expectedCda: "46239",
      expectedArticle: "4/1",
    },
    {
      id: "b5-ex75",
      name: "Formation collective → 6.1.3-2",
      keywords: ["formation collective", "journée pédagogique"],
      expectedCda: "49466",
      expectedArticle: "6.1.3-2",
    },
    {
      id: "b5-ex76",
      name: "Demi-jours → 6.1.3-8",
      keywords: ["demi-jours", "formation"],
      expectedCda: "49466",
      expectedArticle: "6.1.3-8",
    },
    {
      id: "b5-ex77",
      name: "Lettre de mission → art. 27",
      keywords: ["lettre de mission"],
      expectedCda: "31886",
      expectedArticle: "27",
    },
    {
      id: "b5-ex78",
      name: "Accompagnement direction → art. 11",
      keywords: ["accompagnement direction", "formation intégration"],
      expectedCda: "31886",
      expectedArticle: "11",
    },
    {
      id: "b5-ex79",
      name: "Profil de fonction → art. 5",
      keywords: ["profil de fonction", "responsabilités direction"],
      expectedCda: "31886",
      expectedArticle: "5",
    },
    {
      id: "b5-ex81",
      name: "Personne de confiance → 32sexies",
      keywords: ["personne de confiance"],
      expectedCda: "45031",
      expectedArticle: "32sexies",
    },
  ];

  for (const { id, name, keywords, expectedCda, expectedArticle } of pivotCases) {
    it(`${id}: ${name}`, () => {
      const pivots = findPivotArticles(keywords);
      const found = pivots.find(
        (p) => p.cdaCode === expectedCda && p.articleNumber === expectedArticle
      );
      expect(found).toBeDefined();
    });
  }
});
