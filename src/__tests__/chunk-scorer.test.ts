/**
 * Chunk scorer tests — verifies that specific articles rank above general ones.
 *
 * 4 non-regression cases:
 * 1. Plans de pilotage → 1.5.2-2 > art. 6 Décret Missions
 * 2. DAccE accès parents → 1.10.3-1 > 1.10.2-2 / 1.10.2-3
 * 3. Orientation D2 → art. 5 > general articles
 * 4. Frais scolaires → 1.7.2-2 > general articles
 */

import { describe, it, expect } from "vitest";
import { scoreChunks, type ChunkScore } from "@/lib/ai/chunk-scorer";
import { findPivotArticles, type PivotArticle } from "@/lib/ai/gallilex";
import type { LegalChunk } from "@/types";

// Helper to build a minimal LegalChunk for testing
function fakeChunk(
  cdaCode: string,
  articleNumber: string,
  content: string,
): LegalChunk {
  return {
    id: `${cdaCode}-${articleNumber}`,
    cda_code: cdaCode,
    chunk_index: 0,
    chunk_title: "",
    content,
    tags: null,
    source_title: null,
    source_short_title: null,
    article_number: articleNumber,
    paragraph: null,
    citation_display: null,
    topics: null,
    education_level: null,
  };
}

function findScore(scored: ChunkScore[], cdaCode: string, article: string): number {
  const entry = scored.find(
    (s) => s.chunk.cda_code === cdaCode && s.chunk.article_number === article,
  );
  return entry?.score ?? -Infinity;
}

// ============================================================
// 1. Plans de pilotage — 1.5.2-2 doit primer sur art. 6 Décret Missions
// ============================================================

describe("Chunk scorer — Plans de pilotage", () => {
  const keywords = ["plan", "pilotage", "contrat", "objectifs", "amélioration"];

  const chunks: LegalChunk[] = [
    fakeChunk(
      "49466",
      "1.5.2-2",
      "Le plan de pilotage comprend un ensemble d'objectifs d'amélioration spécifiques et mesurables portant sur les apprentissages des élèves, le climat scolaire, les stratégies de lutte contre le décrochage scolaire, et la réduction des inégalités.",
    ),
    fakeChunk(
      "21557",
      "6",
      "La Communauté française, pour l'enseignement qu'elle organise, et tout pouvoir organisateur, pour l'enseignement subventionné, poursuivent simultanément et sans hiérarchie les objectifs suivants : promouvoir la confiance en soi, le développement de la personne.",
    ),
  ];

  const pivots = findPivotArticles(keywords);

  it("art. 1.5.2-2 scores higher than art. 6 Décret Missions", () => {
    const scored = scoreChunks(chunks, pivots, keywords);
    const specific = findScore(scored, "49466", "1.5.2-2");
    const general = findScore(scored, "21557", "6");
    expect(specific).toBeGreaterThan(general);
  });

  it("art. 6 Décret Missions is flagged as general", () => {
    const scored = scoreChunks(chunks, pivots, keywords);
    const entry = scored.find(
      (s) => s.chunk.cda_code === "21557" && s.chunk.article_number === "6",
    );
    expect(entry?.isGeneral).toBe(true);
  });

  it("art. 1.5.2-2 appears first in sorted order", () => {
    const scored = scoreChunks(chunks, pivots, keywords);
    expect(scored[0].chunk.article_number).toBe("1.5.2-2");
  });
});

// ============================================================
// 2. DAccE — 1.10.3-1 (accès) doit être prioritaire
// ============================================================

describe("Chunk scorer — DAccE accès parents", () => {
  const keywords = ["dacce", "volets", "parents", "accès"];

  const chunks: LegalChunk[] = [
    fakeChunk(
      "49466",
      "1.10.2-2",
      "Le DAccE constitue un outil de soutien à la réussite de l'élève qui permet le suivi des apprentissages. Il comprend cinq volets : administratif, parcours scolaire, suivi de l'élève, fréquentation scolaire et procédures.",
    ),
    fakeChunk(
      "49466",
      "1.10.2-3",
      "Le DAccE est personnel, propre à chaque élève, ne concerne que l'élève et contient uniquement des informations utiles au suivi pédagogique. Les données disciplinaires ne peuvent y figurer.",
    ),
    fakeChunk(
      "49466",
      "1.10.3-1",
      "Chaque membre de l'équipe éducative dispose d'un accès au DAccE. Les parents d'un élève mineur disposent également d'un accès au DAccE de leur enfant.",
    ),
  ];

  const pivots = findPivotArticles(keywords);

  it("1.10.3-1 scores higher than 1.10.2-2 (contains 'accès' + 'parents')", () => {
    const scored = scoreChunks(chunks, pivots, keywords);
    const access = findScore(scored, "49466", "1.10.3-1");
    const volets = findScore(scored, "49466", "1.10.2-2");
    expect(access).toBeGreaterThan(volets);
  });

  it("all 3 DAccE articles are pivot articles", () => {
    const scored = scoreChunks(chunks, pivots, keywords);
    expect(scored.every((s) => s.isPivot)).toBe(true);
  });

  it("1.10.3-1 appears in top 2", () => {
    const scored = scoreChunks(chunks, pivots, keywords);
    const top2 = scored.slice(0, 2).map((s) => s.chunk.article_number);
    expect(top2).toContain("1.10.3-1");
  });
});

// ============================================================
// 3. Orientation D2 — art. 5 §3 doit primer
// ============================================================

describe("Chunk scorer — Orientation D2", () => {
  const keywords = ["orientation", "études", "deuxième", "degré", "technique", "transition"];

  const chunks: LegalChunk[] = [
    fakeChunk(
      "10450",
      "5",
      "Au deuxième degré de l'enseignement secondaire de type I, les études s'organisent en deux sections et quatre formes d'enseignement. L'orientation des études au deuxième degré de l'enseignement technique de transition est déterminée par le choix d'une option de base groupée.",
    ),
    fakeChunk(
      "21557",
      "6",
      "La Communauté française, pour l'enseignement qu'elle organise, et tout pouvoir organisateur, pour l'enseignement subventionné, poursuivent simultanément et sans hiérarchie les objectifs suivants.",
    ),
    fakeChunk(
      "49466",
      "1.4.1-1",
      "L'enseignement fondamental et l'enseignement secondaire poursuivent les missions prioritaires suivantes.",
    ),
  ];

  const pivots = findPivotArticles(keywords);

  it("art. 5 scores highest", () => {
    const scored = scoreChunks(chunks, pivots, keywords);
    expect(scored[0].chunk.article_number).toBe("5");
    expect(scored[0].chunk.cda_code).toBe("10450");
  });

  it("general articles (21557:6, 49466:1.4.1-1) are penalized", () => {
    const scored = scoreChunks(chunks, pivots, keywords);
    const art5 = findScore(scored, "10450", "5");
    const art6 = findScore(scored, "21557", "6");
    const missions = findScore(scored, "49466", "1.4.1-1");
    expect(art5).toBeGreaterThan(art6);
    expect(art5).toBeGreaterThan(missions);
  });
});

// ============================================================
// 4. Frais scolaires — art. 1.7.2-2 doit primer
// ============================================================

describe("Chunk scorer — Frais scolaires", () => {
  const keywords = ["frais", "scolaires", "intrus", "parents"];

  const chunks: LegalChunk[] = [
    fakeChunk(
      "49466",
      "1.7.2-2",
      "Dans l'enseignement secondaire, ne peuvent être portés à charge des parents que les frais suivants : les droits d'accès à la piscine et aux activités culturelles et sportives s'inscrivant dans le projet pédagogique, les photocopies, le prêt de livres.",
    ),
    fakeChunk(
      "49466",
      "1.7.2-1",
      "Aucun minerval direct ou indirect ne peut être perçu dans l'enseignement maternel, primaire et secondaire.",
    ),
    fakeChunk(
      "21557",
      "6",
      "La Communauté française, pour l'enseignement qu'elle organise, et tout pouvoir organisateur, pour l'enseignement subventionné, poursuivent simultanément et sans hiérarchie les objectifs suivants.",
    ),
  ];

  const pivots = findPivotArticles(keywords);

  it("art. 1.7.2-2 scores highest", () => {
    const scored = scoreChunks(chunks, pivots, keywords);
    expect(scored[0].chunk.article_number).toBe("1.7.2-2");
  });

  it("art. 1.7.2-2 is a pivot article", () => {
    const scored = scoreChunks(chunks, pivots, keywords);
    const entry = scored.find((s) => s.chunk.article_number === "1.7.2-2");
    expect(entry?.isPivot).toBe(true);
  });

  it("general article 21557:6 ranks last", () => {
    const scored = scoreChunks(chunks, pivots, keywords);
    const last = scored[scored.length - 1];
    expect(last.chunk.cda_code).toBe("21557");
    expect(last.chunk.article_number).toBe("6");
    expect(last.isGeneral).toBe(true);
  });
});

// ============================================================
// Edge case: all chunks are general → no crash, reasonable order
// ============================================================

describe("Chunk scorer — edge case: all general", () => {
  const keywords = ["missions"];

  const chunks: LegalChunk[] = [
    fakeChunk(
      "21557",
      "6",
      "La Communauté française poursuit les objectifs suivants.",
    ),
    fakeChunk(
      "49466",
      "1.4.1-1",
      "L'enseignement fondamental et l'enseignement secondaire poursuivent les missions prioritaires suivantes.",
    ),
  ];

  const pivots = findPivotArticles(keywords);

  it("returns all chunks even if all are general", () => {
    const scored = scoreChunks(chunks, pivots, keywords);
    expect(scored).toHaveLength(2);
  });

  it("both are flagged as general", () => {
    const scored = scoreChunks(chunks, pivots, keywords);
    expect(scored.every((s) => s.isGeneral)).toBe(true);
  });
});
