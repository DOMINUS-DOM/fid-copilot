/**
 * Gallilex Search Strategy tests — verifies the search strategy
 * is correctly generated from question data (keywords, pivots, routing).
 *
 * 5 FID cases + edge cases:
 * 1. Voeren / régime linguistique
 * 2. DAccE / accès parents
 * 3. Encadrement différencié / ISE
 * 4. DASPA / 10 primo-arrivants
 * 5. Subventions après exclusion 15 janvier
 */

import { describe, it, expect } from "vitest";
import { buildGallilexSearch } from "@/lib/ai/gallilex-search";
import { findPivotArticles, searchGallilex } from "@/lib/ai/gallilex";

// Helper: build standard input from keywords
function buildInput(question: string, keywords: string[]) {
  const pivots = findPivotArticles(keywords);
  const routed = searchGallilex(keywords, []);
  return {
    question,
    keywords,
    routedCDAs: routed.map((r) => r.cdaCode),
    pivotArticles: pivots,
  };
}

// ============================================================
// 1. Voeren / régime linguistique
// ============================================================

describe("Gallilex Search — Voeren / régime linguistique", () => {
  const input = buildInput(
    "Les grands-parents d'un élève de Voeren veulent l'inscrire en français. Est-ce possible ?",
    ["Voeren", "régime", "linguistique", "grands-parents", "inscription"],
  );

  const strategy = buildGallilexSearch(input);

  it("generates a non-null strategy", () => {
    expect(strategy).not.toBeNull();
  });

  it("identifies CDA 4329 as primary text", () => {
    expect(strategy!.primaryText.cdaCode).toBe("4329");
  });

  it("primary text is a loi (not Code)", () => {
    expect(strategy!.primaryText.textType).toBe("loi");
  });

  it("rationale mentions loi fédérale", () => {
    expect(strategy!.primaryText.rationale).toContain("fédérale");
  });

  it("search keywords include 'Article 6'", () => {
    expect(strategy!.searchKeywords).toContain("Article 6");
  });

  it("trap warns about Code de l'enseignement", () => {
    expect(strategy!.trap).toBeTruthy();
    expect(strategy!.trap).toContain("4329");
  });

  it("confirmation mentions 'chef de famille'", () => {
    expect(strategy!.confirmation).toBeTruthy();
    expect(strategy!.confirmation).toContain("chef de famille");
  });

  it("steps start with opening CDA 4329", () => {
    expect(strategy!.steps[0]).toContain("4329");
  });

  it("has max 4 steps", () => {
    expect(strategy!.steps.length).toBeLessThanOrEqual(4);
  });
});

// ============================================================
// 2. DAccE — accès parents
// ============================================================

describe("Gallilex Search — DAccE accès parents", () => {
  const input = buildInput(
    "Les parents d'un élève mineur peuvent-ils consulter le DAccE ?",
    ["DAccE", "dossier", "accompagnement", "parents", "accès"],
  );

  const strategy = buildGallilexSearch(input);

  it("identifies CDA 49466 as primary text", () => {
    expect(strategy).not.toBeNull();
    expect(strategy!.primaryText.cdaCode).toBe("49466");
  });

  it("primary text is the Code", () => {
    expect(strategy!.primaryText.textType).toBe("code");
  });

  it("search keywords include article numbers", () => {
    // Should include at least one DAccE article reference
    const hasArticle = strategy!.searchKeywords.some(
      (kw) => kw.includes("1.10") || kw.includes("DAccE"),
    );
    expect(hasArticle).toBe(true);
  });

  it("trap warns about Chapitre 2 vs 3 confusion", () => {
    expect(strategy!.trap).toBeTruthy();
    expect(strategy!.trap).toContain("Chapitre");
  });

  it("confirmation mentions 'personnes autorisées'", () => {
    expect(strategy!.confirmation).toBeTruthy();
    expect(strategy!.confirmation).toContain("personnes autorisées");
  });
});

// ============================================================
// 3. Encadrement différencié / ISE
// ============================================================

describe("Gallilex Search — Encadrement différencié / ISE", () => {
  const input = buildInput(
    "Quelles sont les classes d'indice socio-économique pour l'encadrement différencié ?",
    ["encadrement", "différencié", "ISE", "indice", "socio-économique", "classe"],
  );

  const strategy = buildGallilexSearch(input);

  it("identifies CDA 34295 as primary text", () => {
    expect(strategy).not.toBeNull();
    expect(strategy!.primaryText.cdaCode).toBe("34295");
  });

  it("primary text is a décret (not Code)", () => {
    expect(strategy!.primaryText.textType).toBe("décret");
  });

  it("rationale explains why not the Code", () => {
    expect(strategy!.primaryText.rationale).toContain("Code");
  });

  it("search keywords include 'Article 3'", () => {
    expect(strategy!.searchKeywords).toContain("Article 3");
  });

  it("trap warns about Code vs décret", () => {
    expect(strategy!.trap).toBeTruthy();
    expect(strategy!.trap).toContain("34295");
  });

  it("confirmation mentions ISE classes", () => {
    expect(strategy!.confirmation).toBeTruthy();
    expect(strategy!.confirmation).toContain("indice socio-économique");
  });

  it("legal matter is about encadrement différencié", () => {
    expect(strategy!.legalMatter).toContain("Encadrement différencié");
  });
});

// ============================================================
// 4. DASPA / 10 primo-arrivants
// ============================================================

describe("Gallilex Search — DASPA / 10 primo-arrivants", () => {
  const input = buildInput(
    "Combien de primo-arrivants faut-il pour ouvrir un DASPA ?",
    ["DASPA", "primo-arrivant", "encadrement", "nombre", "ouvrir"],
  );

  const strategy = buildGallilexSearch(input);

  it("identifies CDA 46275 as primary text", () => {
    expect(strategy).not.toBeNull();
    expect(strategy!.primaryText.cdaCode).toBe("46275");
  });

  it("is classified as a seuil question", () => {
    expect(strategy!.questionType).toBe("seuil");
  });

  it("primary text is a décret", () => {
    expect(strategy!.primaryText.textType).toBe("décret");
  });

  it("trap warns about art. 2 vs art. 6", () => {
    expect(strategy!.trap).toBeTruthy();
    expect(strategy!.trap).toContain("art. 6");
  });

  it("confirmation mentions 10 élèves", () => {
    expect(strategy!.confirmation).toBeTruthy();
    expect(strategy!.confirmation).toContain("10");
  });

  it("legal matter is about DASPA", () => {
    expect(strategy!.legalMatter).toContain("DASPA");
  });
});

// ============================================================
// 5. Subventions après exclusion 15 janvier
// ============================================================

describe("Gallilex Search — Subventions 15 janvier", () => {
  const input = buildInput(
    "L'école perd-elle ses subventions si elle exclut un élève après le 15 janvier ?",
    ["subventions", "perte", "subvention", "15 janvier"],
  );

  const strategy = buildGallilexSearch(input);

  it("identifies CDA 5108 as primary text", () => {
    expect(strategy).not.toBeNull();
    expect(strategy!.primaryText.cdaCode).toBe("5108");
  });

  it("primary text is the Pacte scolaire", () => {
    expect(strategy!.primaryText.shortTitle).toContain("Pacte");
  });

  it("search keywords include 'Article 73'", () => {
    expect(strategy!.searchKeywords).toContain("Article 73");
  });

  it("trap warns about art. 43 vs 73 confusion", () => {
    expect(strategy!.trap).toBeTruthy();
    expect(strategy!.trap).toContain("43");
    expect(strategy!.trap).toContain("73");
  });

  it("confirmation mentions 15 janvier", () => {
    expect(strategy!.confirmation).toBeTruthy();
    expect(strategy!.confirmation).toContain("15 janvier");
  });

  it("rationale explains Pacte = subventions", () => {
    expect(strategy!.primaryText.rationale).toContain("subventions");
  });
});

// ============================================================
// 6. Accompagnement directeur — 31886:11
// ============================================================

describe("Gallilex Search — Accompagnement directeur / 31886:11", () => {
  const input = buildInput(
    "Dès son entrée en fonction, un directeur suit 15h d'accompagnement assurées par un membre du PO. Est-ce problématique ?",
    ["entrée", "fonction", "directeur", "accompagnement", "assurées", "membre"],
  );
  const strategy = buildGallilexSearch(input);

  it("generates a non-null strategy", () => {
    expect(strategy).not.toBeNull();
  });

  it("identifies CDA 31886 as primary text", () => {
    expect(strategy!.primaryText.cdaCode).toBe("31886");
  });

  it("primary text is a décret", () => {
    expect(strategy!.primaryText.textType).toBe("décret");
  });

  it("search keywords include 'Article 11'", () => {
    expect(strategy!.searchKeywords.some((k) => k.includes("11"))).toBe(true);
  });

  it("trap warns about §4 conditions and NOT 28737", () => {
    expect(strategy!.trap).toBeTruthy();
    expect(strategy!.trap).toContain("30 heures");
    expect(strategy!.trap).toContain("hiérarchique");
  });

  it("confirmation mentions lien hiérarchique", () => {
    expect(strategy!.confirmation).toBeTruthy();
    expect(strategy!.confirmation).toContain("hiérarchique");
  });

  it("does NOT point to 28737 (enseignement spécialisé)", () => {
    expect(strategy!.primaryText.cdaCode).not.toBe("28737");
    if (strategy!.secondaryText) {
      expect(strategy!.secondaryText.cdaCode).not.toBe("28737");
    }
  });
});

// ============================================================
// 7. Harcèlement moral — 45031:32nonies
// ============================================================

describe("Gallilex Search — Harcèlement moral / 45031:32nonies", () => {
  const input = buildInput(
    "Harcèlement moral à qui s'adresser ?",
    ["harcèlement", "moral", "adresser"],
  );
  const strategy = buildGallilexSearch(input);

  it("generates a non-null strategy", () => {
    expect(strategy).not.toBeNull();
  });

  it("identifies CDA 45031 as primary text", () => {
    expect(strategy!.primaryText.cdaCode).toBe("45031");
  });

  it("primary text is a loi", () => {
    expect(strategy!.primaryText.textType).toBe("loi");
  });

  it("search keywords include '32nonies'", () => {
    expect(strategy!.searchKeywords.some((k) => k.includes("32nonies"))).toBe(true);
  });

  it("trap warns about 32sexies vs 32nonies confusion", () => {
    expect(strategy!.trap).toBeTruthy();
    expect(strategy!.trap).toContain("32nonies");
  });

  it("confirmation mentions personne de confiance and fonctionnaire", () => {
    expect(strategy!.confirmation).toBeTruthy();
    expect(strategy!.confirmation).toContain("personne de confiance");
  });
});

// ============================================================
// Edge cases
// ============================================================

describe("Gallilex Search — edge cases", () => {
  it("returns null when no CDAs and no pivots", () => {
    const result = buildGallilexSearch({
      question: "question vague",
      keywords: ["rien"],
      routedCDAs: [],
      pivotArticles: [],
    });
    expect(result).toBeNull();
  });

  it("works with only routed CDAs (no pivots)", () => {
    const result = buildGallilexSearch({
      question: "question sur l'alternance",
      keywords: ["alternance"],
      routedCDAs: ["16421"],
      pivotArticles: [],
    });
    expect(result).not.toBeNull();
    expect(result!.primaryText.cdaCode).toBe("16421");
  });

  it("never generates more than 5 search keywords", () => {
    const input = buildInput(
      "Question très longue avec beaucoup de mots-clés sur l'encadrement différencié",
      ["encadrement", "différencié", "ISE", "indice", "classe", "moyens", "école", "implantation"],
    );
    const strategy = buildGallilexSearch(input);
    expect(strategy).not.toBeNull();
    expect(strategy!.searchKeywords.length).toBeLessThanOrEqual(5);
  });

  it("never generates more than 4 steps", () => {
    const input = buildInput(
      "Question avec beaucoup de pivots",
      ["exclusion", "DAccE", "aménagement", "frais"],
    );
    const strategy = buildGallilexSearch(input);
    expect(strategy).not.toBeNull();
    expect(strategy!.steps.length).toBeLessThanOrEqual(4);
  });

  it("detects question type: seuil", () => {
    const input = buildInput("Combien d'élèves pour ouvrir une DASPA ?", ["DASPA", "combien", "élèves"]);
    expect(buildGallilexSearch(input)!.questionType).toBe("seuil");
  });

  it("detects question type: procédure", () => {
    const input = buildInput("Quelle est la procédure d'exclusion ?", ["procédure", "exclusion"]);
    expect(buildGallilexSearch(input)!.questionType).toBe("procédure");
  });

  it("detects question type: condition", () => {
    const input = buildInput("Quelles conditions pour changer d'option ?", ["conditions", "changement", "option"]);
    expect(buildGallilexSearch(input)!.questionType).toBe("condition");
  });

  it("defaults to cas pratique when no pattern matches", () => {
    const result = buildGallilexSearch({
      question: "situation complexe",
      keywords: ["complexe"],
      routedCDAs: ["49466"],
      pivotArticles: [],
    });
    expect(result!.questionType).toBe("cas pratique");
  });
});
