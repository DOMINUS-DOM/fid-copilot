/**
 * Gallilex Guide tests — verifies the guide is correctly generated
 * from pipeline data (legalRefs, pivots, keywords).
 *
 * 5 non-regression cases:
 * 1. DAccE — accès parents
 * 2. Plans de pilotage
 * 3. Orientation D2
 * 4. Frais scolaires
 * 5. Exclusion définitive
 */

import { describe, it, expect } from "vitest";
import { buildGallilexGuide } from "@/lib/ai/gallilex-guide";
import { findPivotArticles } from "@/lib/ai/gallilex";

// ============================================================
// 1. DAccE — accès parents
// ============================================================

describe("Gallilex Guide — DAccE accès parents", () => {
  const keywords = ["dacce", "volets", "parents", "accès"];
  const pivots = findPivotArticles(keywords);

  const guide = buildGallilexGuide({
    verifiedArticles: [
      { articleNumber: "1.10.2-2", cdaCode: "49466" },
      { articleNumber: "1.10.3-1", cdaCode: "49466", paragraph: "2" },
    ],
    pivotArticles: pivots,
    keywords,
  });

  it("generates a non-null guide", () => {
    expect(guide).not.toBeNull();
  });

  it("includes both verified articles", () => {
    const articles = guide!.entries.map((e) => e.articleNumber);
    expect(articles).toContain("1.10.2-2");
    expect(articles).toContain("1.10.3-1");
  });

  it("includes article numbers in search keywords", () => {
    expect(guide!.searchKeywords).toContain("1.10.2-2");
  });

  it("generates max 3 steps", () => {
    expect(guide!.steps.length).toBeLessThanOrEqual(3);
    expect(guide!.steps.length).toBeGreaterThanOrEqual(1);
  });

  it("detects the DAccE trap (chapitre 2 vs 3)", () => {
    expect(guide!.trap).toBeTruthy();
    expect(guide!.trap).toContain("1.10.2-2");
    expect(guide!.trap).toContain("1.10.3-1");
  });

  it("links to Gallilex with correct CDA", () => {
    const entry = guide!.entries[0];
    expect(entry.url).toContain("49466");
    expect(entry.textTitle).toBe("Code enseignement");
  });
});

// ============================================================
// 2. Plans de pilotage
// ============================================================

describe("Gallilex Guide — Plans de pilotage", () => {
  const keywords = ["plan", "pilotage", "objectifs", "amélioration"];
  const pivots = findPivotArticles(keywords);

  const guide = buildGallilexGuide({
    verifiedArticles: [
      { articleNumber: "1.5.2-2", cdaCode: "49466" },
    ],
    pivotArticles: pivots,
    keywords,
  });

  it("generates a guide with 1.5.2-2 as primary", () => {
    expect(guide).not.toBeNull();
    expect(guide!.entries[0].articleNumber).toBe("1.5.2-2");
  });

  it("detects the Décret Missions trap", () => {
    expect(guide!.trap).toBeTruthy();
    expect(guide!.trap).toContain("Décret Missions");
  });

  it("first step opens Code enseignement", () => {
    expect(guide!.steps[0]).toContain("CDA 49466");
  });
});

// ============================================================
// 3. Orientation D2
// ============================================================

describe("Gallilex Guide — Orientation D2", () => {
  const keywords = ["orientation", "études", "deuxième", "degré", "transition"];
  const pivots = findPivotArticles(keywords);

  const guide = buildGallilexGuide({
    verifiedArticles: [
      { articleNumber: "5", cdaCode: "10450", paragraph: "3" },
    ],
    pivotArticles: pivots,
    keywords,
  });

  it("generates a guide pointing to AR 29/06/1984", () => {
    expect(guide).not.toBeNull();
    expect(guide!.entries[0].cdaCode).toBe("10450");
    expect(guide!.entries[0].articleNumber).toBe("5");
  });

  it("detects the AR vs Code trap", () => {
    expect(guide!.trap).toBeTruthy();
    expect(guide!.trap).toContain("10450");
  });

  it("mentions §3 in steps", () => {
    const allSteps = guide!.steps.join(" ");
    expect(allSteps).toContain("§3");
  });

  it("includes 'Article 5' in search keywords (not dotted notation)", () => {
    // Article 5 doesn't have dots, so Ctrl+F should use "Article 5"
    expect(guide!.searchKeywords).toContain("5");
  });
});

// ============================================================
// 4. Frais scolaires
// ============================================================

describe("Gallilex Guide — Frais scolaires", () => {
  const keywords = ["frais", "scolaires", "parents", "secondaire"];
  const pivots = findPivotArticles(keywords);

  const guide = buildGallilexGuide({
    verifiedArticles: [
      { articleNumber: "1.7.2-2", cdaCode: "49466", paragraph: "4" },
    ],
    pivotArticles: pivots,
    keywords,
  });

  it("generates a guide with 1.7.2-2 as primary", () => {
    expect(guide).not.toBeNull();
    expect(guide!.entries[0].articleNumber).toBe("1.7.2-2");
  });

  it("detects the minerval vs frais trap", () => {
    expect(guide!.trap).toBeTruthy();
    expect(guide!.trap).toContain("1.7.2-1");
    expect(guide!.trap).toContain("1.7.2-2");
  });

  it("includes 1.7.2-2 in search keywords", () => {
    expect(guide!.searchKeywords).toContain("1.7.2-2");
  });
});

// ============================================================
// 5. Exclusion définitive
// ============================================================

describe("Gallilex Guide — Exclusion définitive", () => {
  const keywords = ["exclusion", "définitive", "procédure", "élève"];
  const pivots = findPivotArticles(keywords);

  const guide = buildGallilexGuide({
    verifiedArticles: [
      { articleNumber: "1.7.9-4", cdaCode: "49466" },
      { articleNumber: "1.7.9-6", cdaCode: "49466" },
    ],
    pivotArticles: pivots,
    keywords,
  });

  it("generates a guide with both articles", () => {
    expect(guide).not.toBeNull();
    const articles = guide!.entries.map((e) => e.articleNumber);
    expect(articles).toContain("1.7.9-4");
    expect(articles).toContain("1.7.9-6");
  });

  it("detects the motifs vs procédure trap", () => {
    expect(guide!.trap).toBeTruthy();
    expect(guide!.trap).toContain("1.7.9-4");
    expect(guide!.trap).toContain("1.7.9-6");
  });

  it("primary entries point to CDA 49466", () => {
    // Verified articles are from 49466; pivots may include other CDAs
    const verified = guide!.entries.filter((e) =>
      ["1.7.9-4", "1.7.9-6"].includes(e.articleNumber)
    );
    expect(verified.every((e) => e.cdaCode === "49466")).toBe(true);
  });

  it("third step mentions second article", () => {
    expect(guide!.steps.length).toBe(3);
    expect(guide!.steps[2]).toContain("1.7.9-6");
  });
});

// ============================================================
// Edge case: no articles → null
// ============================================================

describe("Gallilex Guide — edge cases", () => {
  it("returns null when no articles", () => {
    const guide = buildGallilexGuide({
      verifiedArticles: [],
      pivotArticles: [],
      keywords: ["test"],
    });
    expect(guide).toBeNull();
  });

  it("works with only pivots (no verified articles)", () => {
    const pivots = findPivotArticles(["frais", "scolaires"]);
    const guide = buildGallilexGuide({
      verifiedArticles: [],
      pivotArticles: pivots,
      keywords: ["frais", "scolaires"],
    });
    expect(guide).not.toBeNull();
    expect(guide!.entries.length).toBeGreaterThan(0);
    expect(guide!.entries.every((e) => e.isPivot)).toBe(true);
  });

  it("limits entries to max 3", () => {
    const pivots = findPivotArticles(["exclusion", "DAccE", "aménagement"]);
    const guide = buildGallilexGuide({
      verifiedArticles: [],
      pivotArticles: pivots,
      keywords: ["exclusion", "DAccE", "aménagement"],
    });
    expect(guide).not.toBeNull();
    expect(guide!.entries.length).toBeLessThanOrEqual(3);
  });
});

// ============================================================
// 6. Encadrement différencié / ISE
// ============================================================

describe("Gallilex Guide — Encadrement différencié / ISE", () => {
  const keywords = ["encadrement", "différencié", "ISE", "classe"];
  const pivots = findPivotArticles(keywords);

  const guide = buildGallilexGuide({
    verifiedArticles: [
      { articleNumber: "3", cdaCode: "34295" },
    ],
    pivotArticles: pivots,
    keywords,
  });

  it("generates a guide with art. 3 from CDA 34295", () => {
    expect(guide).not.toBeNull();
    expect(guide!.entries[0].articleNumber).toBe("3");
    expect(guide!.entries[0].cdaCode).toBe("34295");
  });

  it("detects the ISE trap", () => {
    expect(guide!.trap).toBeTruthy();
    expect(guide!.trap).toContain("34295");
  });

  it("first step opens Encadrement différencié", () => {
    expect(guide!.steps[0]).toContain("CDA 34295");
  });
});

// ============================================================
// 7. DASPA / 10 primo-arrivants
// ============================================================

describe("Gallilex Guide — DASPA encadrement", () => {
  const keywords = ["DASPA", "primo-arrivant", "encadrement", "élèves"];
  const pivots = findPivotArticles(keywords);

  const guide = buildGallilexGuide({
    verifiedArticles: [
      { articleNumber: "6", cdaCode: "46275", paragraph: "3" },
    ],
    pivotArticles: pivots,
    keywords,
  });

  it("generates a guide with art. 6 from CDA 46275", () => {
    expect(guide).not.toBeNull();
    expect(guide!.entries[0].articleNumber).toBe("6");
    expect(guide!.entries[0].cdaCode).toBe("46275");
  });

  it("detects the DASPA encadrement trap", () => {
    expect(guide!.trap).toBeTruthy();
    expect(guide!.trap).toContain("46275");
  });

  it("only contains entries from CDA 46275", () => {
    expect(guide!.entries.every((e) => e.cdaCode === "46275")).toBe(true);
  });
});

// ============================================================
// 8. Subventions / exclusion après 15 janvier
// ============================================================

describe("Gallilex Guide — Subventions art. 73 §2bis", () => {
  const keywords = ["subventions", "exclusion", "15 janvier", "perte"];
  const pivots = findPivotArticles(keywords);

  const guide = buildGallilexGuide({
    verifiedArticles: [
      { articleNumber: "73", cdaCode: "5108", paragraph: "2bis" },
    ],
    pivotArticles: pivots,
    keywords,
  });

  it("generates a guide with art. 73 from CDA 5108", () => {
    expect(guide).not.toBeNull();
    expect(guide!.entries[0].articleNumber).toBe("73");
    expect(guide!.entries[0].cdaCode).toBe("5108");
  });

  it("detects the art. 43 vs 73 trap", () => {
    expect(guide!.trap).toBeTruthy();
    expect(guide!.trap).toContain("73");
    expect(guide!.trap).toContain("43");
  });

  it("mentions §2bis in steps", () => {
    const allSteps = guide!.steps.join(" ");
    expect(allSteps).toContain("§2bis");
  });
});

// ============================================================
// 9. Anti-pollution: sportif rémunéré (CDA 9547 only)
// ============================================================

describe("Gallilex Guide — anti-pollution sportif rémunéré", () => {
  const keywords = ["sportif", "rémunéré", "obligation", "scolaire"];
  const pivots = findPivotArticles(keywords);

  const guide = buildGallilexGuide({
    verifiedArticles: [
      { articleNumber: "11", cdaCode: "9547" },
    ],
    pivotArticles: pivots,
    keywords,
  });

  it("generates a guide with art. 11 from CDA 9547", () => {
    expect(guide).not.toBeNull();
    expect(guide!.entries[0].articleNumber).toBe("11");
    expect(guide!.entries[0].cdaCode).toBe("9547");
  });

  it("does NOT include frais scolaires articles (49466)", () => {
    const cdas = guide!.entries.map((e) => e.cdaCode);
    expect(cdas).not.toContain("49466");
  });

  it("only contains entries from CDA 9547", () => {
    expect(guide!.entries.every((e) => e.cdaCode === "9547")).toBe(true);
  });
});

// ============================================================
// 10. Anti-pollution: fréquentation (no frais scolaires)
// ============================================================

describe("Gallilex Guide — anti-pollution fréquentation", () => {
  const keywords = ["fréquentation", "tournoi", "scrabble", "absence"];
  const pivots = findPivotArticles(keywords);

  const guide = buildGallilexGuide({
    verifiedArticles: [
      { articleNumber: "1.7.1-8", cdaCode: "49466" },
    ],
    pivotArticles: pivots,
    keywords,
  });

  it("generates a guide with art. 1.7.1-8 from CDA 49466", () => {
    expect(guide).not.toBeNull();
    expect(guide!.entries[0].articleNumber).toBe("1.7.1-8");
  });

  it("does NOT include frais scolaires articles (1.7.2-1 or 1.7.2-2)", () => {
    const articles = guide!.entries.map((e) => e.articleNumber);
    expect(articles).not.toContain("1.7.2-1");
    expect(articles).not.toContain("1.7.2-2");
  });

  it("may include fréquentation pivot 1.7.1-9 (same CDA, relevant)", () => {
    // 1.7.1-9 is from 49466, same CDA as verified → allowed
    const articles = guide!.entries.map((e) => e.articleNumber);
    expect(articles).toContain("1.7.1-9");
  });
});
