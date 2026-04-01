/**
 * Non-regression tests for legal_chunks retrieval from Supabase.
 * These tests verify that critical FID articles are actually present
 * in the database and retrievable by article_number.
 *
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_KEY env vars OR
 * uses the anon key for read-only checks.
 *
 * Run: npm test -- legal-chunks-retrieval
 */

import { describe, it, expect, beforeAll } from "vitest";
import { FID_TEST_CASES, type FidTestCase } from "./fid-exam-fixtures";

// ============================================================
// Lightweight Supabase REST client (no SDK needed for tests)
// ============================================================

const SUPABASE_URL = "https://lxkmufsfehpkudpxkzxr.supabase.co";
const SUPABASE_KEY = "sb_publishable_9iToG5wloKgjpEWD2-8Plw_E72IoRLW";

interface ChunkRow {
  id: string;
  cda_code: string;
  article_number: string;
  chunk_title: string;
  content: string;
  citation_display: string;
  paragraph: string | null;
}

async function fetchChunks(
  cdaCode: string,
  articleNumber: string
): Promise<ChunkRow[]> {
  const url = `${SUPABASE_URL}/rest/v1/legal_chunks?cda_code=eq.${cdaCode}&article_number=eq.${encodeURIComponent(articleNumber)}&select=id,cda_code,article_number,chunk_title,content,citation_display,paragraph&limit=5&order=chunk_index.asc`;

  const resp = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!resp.ok) {
    throw new Error(`Supabase error ${resp.status}: ${await resp.text()}`);
  }

  return resp.json();
}

async function ftsSearch(
  cdaCodes: string[],
  query: string,
  limit = 8
): Promise<ChunkRow[]> {
  const cdaFilter = cdaCodes.map((c) => `"${c}"`).join(",");
  const encoded = encodeURIComponent(query);
  const url = `${SUPABASE_URL}/rest/v1/legal_chunks?cda_code=in.(${cdaFilter})&content=wfts(french).${encoded}&select=id,cda_code,article_number,chunk_title,content,citation_display,paragraph&limit=${limit}`;

  const resp = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!resp.ok) return [];
  return resp.json();
}

// ============================================================
// 1. Pivot articles exist in legal_chunks
// ============================================================

describe("Legal chunks — pivot article presence", () => {
  const pivotArticleCases: { cda: string; article: string; label: string }[] = [
    { cda: "4329", article: "6", label: "Régime linguistique art. 6" },
    { cda: "34295", article: "3", label: "Encadrement différencié art. 3" },
    { cda: "5108", article: "73", label: "Pacte scolaire art. 73" },
    { cda: "49466", article: "1.7.1-8", label: "Fréquentation 1.7.1-8" },
    { cda: "49466", article: "1.7.1-9", label: "Registre absences 1.7.1-9" },
    { cda: "49466", article: "1.7.2-2", label: "Frais scolaires 1.7.2-2" },
    { cda: "49466", article: "1.7.8-1", label: "Aménagements raisonnables 1.7.8-1" },
    { cda: "49466", article: "1.7.9-4", label: "Exclusion définitive 1.7.9-4" },
    { cda: "49466", article: "1.7.9-5", label: "Écartement provisoire 1.7.9-5" },
    { cda: "49466", article: "1.7.9-6", label: "Procédure exclusion 1.7.9-6" },
    { cda: "49466", article: "1.5.1-8", label: "Règlement des études 1.5.1-8" },
    { cda: "49466", article: "1.6.3-10", label: "Évaluations externes 1.6.3-10" },
    { cda: "49466", article: "1.10.2-2", label: "DAccE volets 1.10.2-2" },
    { cda: "49466", article: "1.10.2-3", label: "DAccE données disciplinaires 1.10.2-3" },
    { cda: "49466", article: "1.10.3-1", label: "DAccE accès 1.10.3-1" },
    { cda: "45031", article: "32sexies", label: "Personne de confiance 32sexies" },
    // 4 cas partiels + missions prioritaires
    { cda: "10450", article: "12", label: "Changement option art. 12" },
    { cda: "10450", article: "19", label: "Délais changement art. 19" },
    { cda: "10450", article: "2", label: "Définitions périodes art. 2" },
    { cda: "46275", article: "2", label: "DASPA définitions art. 2" },
    { cda: "46275", article: "3", label: "DASPA objectifs art. 3" },
    { cda: "9547", article: "1er", label: "Obligation scolaire art. 1er" },
    { cda: "21557", article: "6", label: "Missions prioritaires art. 6" },
  ];

  for (const { cda, article, label } of pivotArticleCases) {
    it(`[CDA ${cda}] ${label} exists`, async () => {
      const chunks = await fetchChunks(cda, article);
      expect(chunks.length).toBeGreaterThan(0);
    });
  }
});

// ============================================================
// 2. Content coherence — first chunk starts with the right article
// ============================================================

describe("Legal chunks — content coherence", () => {
  const coherenceCases = [
    { cda: "49466", article: "1.10.2-2", pattern: /Article\s+1\.10\.2\s*[–\-]\s*2/i },
    { cda: "49466", article: "1.10.2-3", pattern: /Article\s+1\.10\.2\s*[–\-]\s*3/i },
    { cda: "49466", article: "1.10.3-1", pattern: /Article\s+1\.10\.3\s*[–\-]\s*1/i },
    { cda: "49466", article: "1.7.8-1", pattern: /Article\s+1\.7\.8[\s\-]*1/i },
    { cda: "49466", article: "1.7.9-4", pattern: /1\.7\.9[\s\-]*4/i },
    { cda: "49466", article: "1.7.9-5", pattern: /Article\s+1\.7\.9[\s\-]*5/i },
    { cda: "49466", article: "1.6.3-10", pattern: /Article\s+1\.6\.3[\s\-]*10/i },
    { cda: "49466", article: "1.5.1-8", pattern: /Article\s+1\.5\.1[\s\-]*8/i },
    { cda: "45031", article: "32sexies", pattern: /Article\s+32sexies/i },
    { cda: "10450", article: "12", pattern: /12/i },
    { cda: "46275", article: "2", pattern: /Article\s+2/i },
    { cda: "46275", article: "3", pattern: /Article\s+3/i },
    { cda: "21557", article: "6", pattern: /Article\s+6/i },
  ];

  for (const { cda, article, pattern } of coherenceCases) {
    it(`[CDA ${cda}] art. ${article} content matches`, async () => {
      const chunks = await fetchChunks(cda, article);
      expect(chunks.length).toBeGreaterThan(0);

      // At least one chunk should match the pattern in its content
      const anyMatch = chunks.some((c) => pattern.test(c.content));
      expect(anyMatch).toBe(true);
    });
  }
});

// ============================================================
// 3. Required keywords present in pivot article content
// ============================================================

describe("Legal chunks — keyword coverage", () => {
  const keywordCases = [
    {
      cda: "49466",
      article: "1.7.8-1",
      keywords: ["aménagements raisonnables", "besoins spécifiques"],
    },
    {
      cda: "49466",
      article: "1.7.9-4",
      keywords: ["exclusion définitive"],
    },
    {
      cda: "49466",
      article: "1.7.9-5",
      keywords: ["écarter provisoirement"],
    },
    {
      cda: "49466",
      article: "1.6.3-10",
      keywords: ["passation", "confidentialité", "directeur"],
    },
    {
      cda: "45031",
      article: "32sexies",
      keywords: ["personne de confiance", "délégué syndical"],
    },
    {
      cda: "49466",
      article: "1.10.2-2",
      keywords: ["DAccE", "volet"],
    },
    {
      cda: "49466",
      article: "1.10.2-3",
      keywords: ["disciplinaire"],
    },
    // 4 cas partiels + missions prioritaires
    {
      cda: "46275",
      article: "2",
      keywords: ["primo-arrivant"],
    },
    {
      cda: "46275",
      article: "3",
      keywords: ["accueil", "orientation"],
    },
    {
      cda: "9547",
      article: "1er",
      keywords: ["obligation scolaire"],
    },
    {
      cda: "21557",
      article: "6",
      keywords: ["objectifs", "émancipation"],
    },
  ];

  for (const { cda, article, keywords } of keywordCases) {
    for (const keyword of keywords) {
      it(`[CDA ${cda}] art. ${article} contains "${keyword}"`, async () => {
        const chunks = await fetchChunks(cda, article);
        const allContent = chunks.map((c) => c.content).join(" ").toLowerCase();
        expect(allContent).toContain(keyword.toLowerCase());
      });
    }
  }
});

// ============================================================
// 4. DAccE specific — no cross-contamination
// ============================================================

describe("DAccE — no cross-contamination", () => {
  it("art. 1.10.2-2 first chunk is NOT about art. 1.10.4-1", async () => {
    const chunks = await fetchChunks("49466", "1.10.2-2");
    expect(chunks.length).toBeGreaterThan(0);
    // The first chunk should NOT start with "Article 1.10.4"
    const firstContent = chunks[0].content.substring(0, 200);
    expect(firstContent).not.toMatch(/^Article\s+1\.10\.4/i);
  });

  it("art. 1.10.2-3 content mentions disciplinaire", async () => {
    const chunks = await fetchChunks("49466", "1.10.2-3");
    const allContent = chunks.map((c) => c.content).join(" ").toLowerCase();
    expect(allContent).toContain("disciplinaire");
  });

  it("art. 1.10.3-1 content mentions accès/profil", async () => {
    const chunks = await fetchChunks("49466", "1.10.3-1");
    const allContent = chunks.map((c) => c.content).join(" ").toLowerCase();
    expect(allContent).toMatch(/acc[èe]s|profil/);
  });
});

// ============================================================
// 5. CDA 49466 — zero simple-numbered article_numbers remain
// ============================================================

describe("CDA 49466 — indexation quality", () => {
  it("has no chunks with article_number = '1'", async () => {
    const url = `${SUPABASE_URL}/rest/v1/legal_chunks?cda_code=eq.49466&article_number=eq.1&select=id&limit=1`;
    const resp = await fetch(url, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    const data = await resp.json();
    expect(data.length).toBe(0);
  });
});
