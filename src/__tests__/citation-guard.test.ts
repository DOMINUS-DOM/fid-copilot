/**
 * Tests for the Citation Guard — post-LLM validation of article references.
 *
 * Run: npm test -- citation-guard
 */

import { describe, it, expect } from "vitest";
import {
  extractArticleCitations,
  guardCitations,
} from "@/lib/ai/citation-guard";

// ============================================================
// 1. Article citation extraction
// ============================================================

describe("extractArticleCitations", () => {
  it("extracts simple article numbers", () => {
    const text = "Selon l'article 6 du Décret Missions, les objectifs sont...";
    expect(extractArticleCitations(text)).toContain("6");
  });

  it("extracts dotted article numbers (Code enseignement)", () => {
    const text = "L'article 1.7.9-4 prévoit l'exclusion définitive.";
    expect(extractArticleCitations(text)).toContain("1.7.9-4");
  });

  it("extracts Art. abbreviation", () => {
    const text = "Art. 73 du Pacte scolaire dispose que...";
    expect(extractArticleCitations(text)).toContain("73");
  });

  it("extracts article with §", () => {
    const text = "L'article 73 §2bis de la loi du 29/05/1959...";
    const citations = extractArticleCitations(text);
    expect(citations.some((c) => c.startsWith("73"))).toBe(true);
  });

  it("extracts articles with latin suffixes (bis, ter, sexies)", () => {
    const text = "L'article 32sexies prévoit la personne de confiance.";
    expect(extractArticleCitations(text)).toContain("32sexies");
  });

  it("extracts article 1er", () => {
    const text = "L'article 1er de la loi du 29 juin 1983...";
    expect(extractArticleCitations(text)).toContain("1er");
  });

  it("extracts multiple articles from compound references", () => {
    const text = "Les articles 1.7.9-4, 1.7.9-5 et 1.7.9-6 encadrent la procédure.";
    const citations = extractArticleCitations(text);
    expect(citations).toContain("1.7.9-4");
    expect(citations).toContain("1.7.9-5");
    expect(citations).toContain("1.7.9-6");
  });

  it("extracts from l'article with apostrophe", () => {
    const text = "l'article 1.10.2-2 prévoit les volets du DAccE.";
    expect(extractArticleCitations(text)).toContain("1.10.2-2");
  });

  it("deduplicates repeated references", () => {
    const text =
      "L'article 73 dispose que... (voir article 73 du Pacte scolaire).";
    const citations = extractArticleCitations(text);
    const count73 = citations.filter((c) => c === "73").length;
    expect(count73).toBe(1);
  });

  it("does not extract 'article' used as a common noun", () => {
    const text = "Ce article de journal ne contient pas de référence.";
    // "article" without a number should not match
    const citations = extractArticleCitations(text);
    expect(citations.length).toBe(0);
  });

  it("handles mixed case (Article, article, ARTICLE)", () => {
    const text = "Article 6 et article 73 sont essentiels.";
    const citations = extractArticleCitations(text);
    expect(citations).toContain("6");
    expect(citations).toContain("73");
  });
});

// ============================================================
// 2. Citation guard — verified citations
// ============================================================

describe("guardCitations — verified citations", () => {
  it("accepts citations present in context", () => {
    const answer =
      "Selon l'article 1.7.9-4, l'exclusion définitive est possible.";
    const context = ["1.7.9-4", "1.7.9-5", "1.7.9-6"];

    const result = guardCitations(answer, context);
    expect(result.hadUnverifiedCitations).toBe(false);
    expect(result.citationsVerified).toContain("1.7.9-4");
    expect(result.citationsUnverified).toHaveLength(0);
    expect(result.sanitizedAnswer).toBe(answer); // No change
  });

  it("accepts multiple verified citations", () => {
    const answer =
      "Les articles 1.7.9-4 et 1.7.9-5 encadrent la procédure. L'Art. 32sexies concerne la personne de confiance.";
    const context = ["1.7.9-4", "1.7.9-5", "32sexies"];

    const result = guardCitations(answer, context);
    expect(result.hadUnverifiedCitations).toBe(false);
    expect(result.citationsVerified).toHaveLength(3);
  });

  it("matches article with § against base article in context", () => {
    // LLM cites "article 73 §2bis" but context has "73"
    const answer = "L'article 73 §2bis du Pacte scolaire...";
    const context = ["73"];

    const result = guardCitations(answer, context);
    expect(result.hadUnverifiedCitations).toBe(false);
  });

  it("handles empty response", () => {
    const result = guardCitations("", ["1.7.9-4"]);
    expect(result.hadUnverifiedCitations).toBe(false);
    expect(result.citationsFound).toHaveLength(0);
  });

  it("handles response with no article citations", () => {
    const answer = "Le directeur doit consulter le pouvoir organisateur.";
    const result = guardCitations(answer, ["1.7.9-4"]);
    expect(result.hadUnverifiedCitations).toBe(false);
    expect(result.citationsFound).toHaveLength(0);
  });
});

// ============================================================
// 3. Citation guard — unverified citations (hallucinations)
// ============================================================

describe("guardCitations — unverified citations (hallucination detection)", () => {
  it("flags a completely invented article", () => {
    const answer =
      "L'article 1.7.9-12 prévoit une procédure spéciale d'appel.";
    const context = ["1.7.9-4", "1.7.9-5"];

    const result = guardCitations(answer, context);
    expect(result.hadUnverifiedCitations).toBe(true);
    expect(result.citationsUnverified).toContain("1.7.9-12");
    expect(result.sanitizedAnswer).toContain("[réf. non vérifiée]");
  });

  it("flags an article not in context even if it exists in the DB", () => {
    // Art. 6 exists in DB (Décret Missions) but was NOT in the context for this question
    const answer =
      "L'article 6 du Décret Missions définit les objectifs prioritaires.";
    const context = ["1.7.9-4"]; // Only exclusion articles in context

    const result = guardCitations(answer, context);
    expect(result.hadUnverifiedCitations).toBe(true);
    expect(result.citationsUnverified).toContain("6");
  });

  it("flags only the unverified citation, not the verified ones", () => {
    const answer =
      "L'article 1.7.9-4 permet l'exclusion. L'article 999 précise les délais.";
    const context = ["1.7.9-4", "1.7.9-5"];

    const result = guardCitations(answer, context);
    expect(result.hadUnverifiedCitations).toBe(true);
    expect(result.citationsVerified).toContain("1.7.9-4");
    expect(result.citationsUnverified).toContain("999");

    // Only the invented article is flagged
    expect(result.sanitizedAnswer).toContain("article 999 [réf. non vérifiée]");
    expect(result.sanitizedAnswer).not.toContain("1.7.9-4 [réf.");
  });

  it("flags multiple hallucinated articles", () => {
    const answer =
      "Les articles 42bis et 88ter encadrent cette situation.";
    const context = ["73"];

    const result = guardCitations(answer, context);
    expect(result.citationsUnverified.length).toBeGreaterThanOrEqual(2);
    expect(result.hadUnverifiedCitations).toBe(true);
  });

  it("handles the worst case: all citations are hallucinated", () => {
    const answer =
      "Selon l'article 150 et l'article 200, la direction doit agir.";
    const context = ["1.7.9-4"];

    const result = guardCitations(answer, context);
    expect(result.citationsUnverified).toHaveLength(2);
    expect(result.citationsVerified).toHaveLength(0);
    expect(result.sanitizedAnswer).toContain("150 [réf. non vérifiée]");
    expect(result.sanitizedAnswer).toContain("200 [réf. non vérifiée]");
  });
});

// ============================================================
// 4. Sanitization — warning format
// ============================================================

describe("guardCitations — sanitization format", () => {
  it("appends [réf. non vérifiée] after the article number", () => {
    const answer = "L'article 999 est clair.";
    const result = guardCitations(answer, []);

    expect(result.sanitizedAnswer).toBe(
      "L'article 999 [réf. non vérifiée] est clair."
    );
  });

  it("preserves the surrounding text structure", () => {
    const answer =
      "En vertu de l'article 1.7.9-4, la procédure exige l'article 999.";
    const context = ["1.7.9-4"];

    const result = guardCitations(answer, context);
    // article 1.7.9-4 untouched, article 999 flagged
    expect(result.sanitizedAnswer).toContain("l'article 1.7.9-4, la procédure");
    expect(result.sanitizedAnswer).toContain("l'article 999 [réf. non vérifiée].");
  });

  it("does not double-flag an already flagged citation", () => {
    const answer = "L'article 999 [réf. non vérifiée] est mentionné deux fois: article 999.";
    const result = guardCitations(answer, []);

    // Count occurrences of the warning
    const matches = result.sanitizedAnswer.match(/\[réf\. non vérifiée\]/g);
    // Should have 2: the pre-existing one + the new one for the second occurrence
    expect(matches).toBeTruthy();
    // The first occurrence was already flagged, so it shouldn't be double-flagged
    expect(result.sanitizedAnswer).not.toContain("[réf. non vérifiée] [réf. non vérifiée]");
  });
});

// ============================================================
// 5. Edge cases — real FID scenarios
// ============================================================

describe("guardCitations — real FID scenarios", () => {
  it("Exclusion question: all 3 pivot articles verified", () => {
    const answer = `
      L'article 1.7.9-4 du Code de l'enseignement prévoit que le pouvoir organisateur
      peut prononcer l'exclusion définitive d'un élève. L'article 1.7.9-5 permet
      l'écartement provisoire en cas d'urgence. La procédure est détaillée à
      l'article 1.7.9-6.
    `;
    const context = ["1.7.9-4", "1.7.9-5", "1.7.9-6"];

    const result = guardCitations(answer, context);
    expect(result.hadUnverifiedCitations).toBe(false);
    expect(result.citationsVerified).toHaveLength(3);
  });

  it("DAccE question: detects hallucinated cross-reference", () => {
    const answer = `
      Le DAccE est défini à l'article 1.10.2-2. Les données disciplinaires ne
      peuvent y figurer (article 1.10.2-3). L'accès est régi par l'article 1.10.3-1.
      Voir aussi l'article 1.10.5-99 pour les exceptions.
    `;
    const context = ["1.10.2-2", "1.10.2-3", "1.10.3-1"];

    const result = guardCitations(answer, context);
    expect(result.hadUnverifiedCitations).toBe(true);
    expect(result.citationsUnverified).toContain("1.10.5-99");
    expect(result.citationsVerified).toHaveLength(3);
  });

  it("Pacte scolaire: art. 73 §2bis verified against context art. 73", () => {
    const answer = `
      L'article 73 §2bis de la loi du 29/05/1959 (Pacte scolaire) prévoit que
      les subventions de fonctionnement restent acquises pour l'année en cours.
    `;
    const context = ["73", "3", "30"];

    const result = guardCitations(answer, context);
    expect(result.hadUnverifiedCitations).toBe(false);
  });

  it("Mixed: some verified, some hallucinated", () => {
    const answer = `
      Selon l'article 32sexies de la loi Bien-être, la personne de confiance
      ne peut être délégué syndical. L'article 32septies précise les modalités
      de formation de cette personne.
    `;
    const context = ["32sexies"];

    const result = guardCitations(answer, context);
    expect(result.citationsVerified).toContain("32sexies");
    expect(result.citationsUnverified).toContain("32septies");
    expect(result.hadUnverifiedCitations).toBe(true);
    expect(result.sanitizedAnswer).toContain("32septies [réf. non vérifiée]");
    expect(result.sanitizedAnswer).not.toContain("32sexies [réf.");
  });

  it("No context at all: all citations are unverified", () => {
    const answer =
      "L'article 6 définit les missions. L'article 73 traite des subventions.";
    const result = guardCitations(answer, []);

    expect(result.citationsUnverified).toHaveLength(2);
    expect(result.hadUnverifiedCitations).toBe(true);
  });
});
