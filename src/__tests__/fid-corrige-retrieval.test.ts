/**
 * FID Corrigé — Retrieval tests (Bloc 1)
 *
 * Verifies that articles referenced in the FID correction corpus
 * are actually present and correctly indexed in legal_chunks.
 *
 * Run: npm test -- fid-corrige-retrieval
 */

import { describe, it, expect } from "vitest";

const SUPABASE_URL = "https://lxkmufsfehpkudpxkzxr.supabase.co";
const SUPABASE_KEY = "sb_publishable_9iToG5wloKgjpEWD2-8Plw_E72IoRLW";

interface ChunkRow {
  id: string;
  cda_code: string;
  article_number: string;
  chunk_title: string;
  content: string;
  paragraph: string | null;
}

async function fetchChunks(cdaCode: string, articleNumber: string, limit = 5): Promise<ChunkRow[]> {
  const url = `${SUPABASE_URL}/rest/v1/legal_chunks?cda_code=eq.${cdaCode}&article_number=eq.${encodeURIComponent(articleNumber)}&select=id,cda_code,article_number,chunk_title,content,paragraph&limit=${limit}&order=chunk_index.asc`;
  const resp = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!resp.ok) throw new Error(`Supabase error ${resp.status}`);
  return resp.json();
}

// ============================================================
// 1. Article presence — all expected articles exist
// ============================================================

describe("Corrigé Bloc 1 — Article presence in legal_chunks", () => {
  const presenceCases = [
    { cda: "49466", article: "1.4.1-1", label: "Ex1: Missions prioritaires" },
    { cda: "49466", article: "1.5.2-2", label: "Ex2: Plans de pilotage" },
    { cda: "45593", article: "7", label: "Ex3: Délégués contrat" },
    { cda: "49466", article: "1.5.2-10", label: "Ex4: Suivi rapproché" },
    { cda: "49466", article: "1.5.1-5", label: "Ex5: Projet d'école" },
    { cda: "5108", article: "3", label: "Ex6: CES" },
    { cda: "10450", article: "1er", label: "Ex8: Périodes 45 min" },
    { cda: "10450", article: "5", label: "Ex11: Orientation D2" },
    { cda: "45721", article: "5", label: "Ex12: Option R2" },
    { cda: "32365", article: "12", label: "Ex13: Immersion" },
    { cda: "34295", article: "3", label: "Ex16: ISE" },
    { cda: "34295", article: "10", label: "Ex19: Encadrement diff" },
    { cda: "46275", article: "6", label: "Ex22: DASPA encadrement" },
    { cda: "5108", article: "73", label: "Ex23: Subventions" },
    { cda: "46275", article: "16", label: "Ex51: Conseil intégration" },
  ];

  for (const { cda, article, label } of presenceCases) {
    it(`[CDA ${cda}] ${label} — art. ${article} exists`, async () => {
      const chunks = await fetchChunks(cda, article);
      expect(chunks.length).toBeGreaterThan(0);
    });
  }

  // Articles KNOWN to be missing (should fail until inserted)
  it.skip("[CDA 49466] Ex10: Tronc commun — art. 2.2.2-1 EXISTS (currently missing)", async () => {
    const chunks = await fetchChunks("49466", "2.2.2-1");
    expect(chunks.length).toBeGreaterThan(0);
  });
});

// ============================================================
// 2. Content coherence — key phrases present in chunks
// ============================================================

describe("Corrigé Bloc 1 — Content keywords", () => {
  const keywordCases = [
    {
      cda: "49466",
      article: "1.4.1-1",
      keywords: ["émancipation sociale", "confiance en soi"],
      label: "Missions prioritaires",
    },
    {
      cda: "49466",
      article: "1.5.2-2",
      keywords: ["redoublement", "décrochage"],
      label: "Objectifs plans pilotage",
    },
    {
      cda: "49466",
      article: "1.5.2-10",
      keywords: ["suivi rapproché", "mauvaise volonté"],
      label: "Suivi rapproché",
    },
    {
      cda: "49466",
      article: "1.5.1-5",
      keywords: ["projet d'école", "priorités éducatives"],
      label: "Projet d'école",
    },
    {
      cda: "10450",
      article: "1er",
      keywords: ["45 minutes"],
      label: "Périodes 45 min",
    },
    {
      cda: "10450",
      article: "5",
      keywords: ["orientation d'études", "option de base groupée", "répertoire"],
      label: "Orientation D2",
    },
    {
      cda: "45721",
      article: "5",
      keywords: ["R2", "réservées"],
      label: "Option R2",
    },
    {
      cda: "32365",
      article: "12",
      keywords: ["immersion", "périodes"],
      label: "Immersion linguistique",
    },
    {
      cda: "34295",
      article: "3",
      keywords: ["revenu", "diplôme"],
      label: "ISE critères",
    },
    {
      cda: "34295",
      article: "10",
      keywords: ["remédiation", "étude dirigée"],
      label: "Encadrement diff moyens",
    },
    {
      cda: "5108",
      article: "73",
      keywords: ["subvention"],
      label: "Subventions",
    },
  ];

  for (const { cda, article, keywords, label } of keywordCases) {
    for (const keyword of keywords) {
      it(`[CDA ${cda}] ${label} — art. ${article} contains "${keyword}"`, async () => {
        const chunks = await fetchChunks(cda, article);
        const allContent = chunks.map((c) => c.content).join(" ").toLowerCase();
        expect(allContent).toContain(keyword.toLowerCase());
      });
    }
  }
});

// ============================================================
// 3. Bloc 2 — Article presence
// ============================================================

describe("Corrigé Bloc 2 — Article presence in legal_chunks", () => {
  const presenceCases = [
    { cda: "49466", article: "1.7.2-2", label: "Ex24/25: Frais scolaires" },
    { cda: "9547", article: "1er", label: "Ex26/27: Obligation scolaire" },
    { cda: "9547", article: "10", label: "Ex26: Travail mineur" },
    { cda: "9547", article: "11", label: "Ex27: Sportif rémunéré" },
    { cda: "49466", article: "1.7.1-8", label: "Ex28: Absences justifiées" },
    { cda: "49466", article: "1.7.1-9", label: "Ex29: Registre fréquentation" },
    { cda: "10450", article: "2", label: "Ex30: Définitions" },
    { cda: "16421", article: "2bis", label: "Ex14: MFI alternance" },
    { cda: "16421", article: "10", label: "Ex43: Réinsertion" },
    { cda: "16421", article: "9", label: "Ex49: Certificats" },
    { cda: "49466", article: "1.7.1-2", label: "Ex36/38: Obligation temps plein" },
    { cda: "4329", article: "6", label: "Ex15: Voeren" },
  ];

  for (const { cda, article, label } of presenceCases) {
    it(`[CDA ${cda}] ${label} — art. ${article} exists`, async () => {
      const chunks = await fetchChunks(cda, article);
      expect(chunks.length).toBeGreaterThan(0);
    });
  }
});

// ============================================================
// 4. Bloc 2 — Content keywords
// ============================================================

describe("Corrigé Bloc 2 — Content keywords", () => {
  const keywordCases = [
    { cda: "9547", article: "1er", keywords: ["obligation scolaire"], label: "Obligation scolaire" },
    { cda: "9547", article: "10", keywords: ["mineur", "travailler"], label: "Travail mineur" },
    { cda: "9547", article: "11", keywords: ["sportif"], label: "Sportif rémunéré" },
    { cda: "49466", article: "1.7.1-8", keywords: ["fréquentation"], label: "Absences" },
    { cda: "49466", article: "1.7.1-9", keywords: ["registre"], label: "Registre" },
    { cda: "16421", article: "10", keywords: ["réinsertion"], label: "Réinsertion" },
    { cda: "16421", article: "9", keywords: ["certificat"], label: "Certificats alternance" },
    { cda: "49466", article: "1.7.1-2", keywords: ["obligation scolaire"], label: "Obligation temps plein" },
    { cda: "4329", article: "6", keywords: ["chef de famille"], label: "Voeren" },
  ];

  for (const { cda, article, keywords, label } of keywordCases) {
    for (const keyword of keywords) {
      it(`[CDA ${cda}] ${label} — art. ${article} contains "${keyword}"`, async () => {
        const chunks = await fetchChunks(cda, article);
        const allContent = chunks.map((c) => c.content).join(" ").toLowerCase();
        expect(allContent).toContain(keyword.toLowerCase());
      });
    }
  }
});

// ============================================================
// 5. Bloc 3 — Article presence
// ============================================================

describe("Corrigé Bloc 3 — Article presence in legal_chunks", () => {
  const presenceCases = [
    { cda: "28737", article: "65", label: "Ex31: Passage spécialisé → ordinaire" },
    { cda: "46275", article: "2", label: "Ex33: Primo-arrivant conditions" },
    { cda: "10450", article: "6", label: "Ex34: Condition d'âge admission" },
    { cda: "30998", article: "6", label: "Ex35: Passage 1D → 1C" },
    { cda: "30998", article: "6ter", label: "Ex39: Durée max 1er degré" },
    { cda: "30998", article: "26", label: "Ex40: 2C sans CE1D" },
    { cda: "30998", article: "28", label: "Ex41: 2D sans CEB orientation" },
    { cda: "30998", article: "28bis", label: "Ex42: 2S sans CE1D formes" },
    { cda: "10450", article: "12", label: "Ex44: Admission 4G" },
    { cda: "10450", article: "19", label: "Ex44: Changement de forme" },
    { cda: "10450", article: "20", label: "Ex45/50: Changement option" },
    { cda: "21557", article: "96", label: "Ex47: Recours interne" },
    { cda: "21557", article: "98", label: "Ex47: Recours externe" },
    { cda: "49466", article: "1.5.1-8", label: "Ex52: Règlement des études" },
    { cda: "49466", article: "1.6.3-10", label: "Ex53: Évaluations externes" },
    { cda: "28737", article: "59", label: "Ex48: CQ spécialisé stages" },
    { cda: "10450", article: "17", label: "Ex46: 7P admission" },
  ];

  for (const { cda, article, label } of presenceCases) {
    it(`[CDA ${cda}] ${label} — art. ${article} exists`, async () => {
      const chunks = await fetchChunks(cda, article);
      expect(chunks.length).toBeGreaterThan(0);
    });
  }
});

// ============================================================
// 6. Bloc 3 — Content keywords
// ============================================================

describe("Corrigé Bloc 3 — Content keywords", () => {
  const keywordCases = [
    { cda: "28737", article: "65", keywords: ["guidance", "admission", "parents"], label: "Passage spécialisé" },
    { cda: "46275", article: "2", keywords: ["primo-arrivant", "territoire"], label: "Primo-arrivant" },
    { cda: "10450", article: "6", keywords: ["31 décembre", "âge"], label: "Condition d'âge" },
    { cda: "30998", article: "6", keywords: ["primaire", "admission"], label: "1D → 1C" },
    { cda: "30998", article: "6ter", keywords: ["trois", "années"], label: "Durée 1er degré" },
    { cda: "30998", article: "26", keywords: ["supplémentaire", "orient"], label: "CE1D orientation" },
    { cda: "30998", article: "28", keywords: ["orient", "professionnel"], label: "2D orientation" },
    { cda: "30998", article: "28bis", keywords: ["formes", "sections"], label: "2S formes/sections" },
    { cda: "10450", article: "20", keywords: ["15 novembre", "16 novembre", "directeur"], label: "Changement option" },
    { cda: "21557", article: "98", keywords: ["jour", "ouvrable"], label: "Recours externe" },
    { cda: "49466", article: "1.5.1-8", keywords: ["règlement", "études", "évaluation"], label: "Règlement études" },
    { cda: "49466", article: "1.6.3-10", keywords: ["inspecteur", "correction", "consignes"], label: "Évaluations externes" },
    { cda: "28737", article: "59", keywords: ["qualification", "stages"], label: "CQ spécialisé" },
    { cda: "10450", article: "17", keywords: ["septième", "qualification"], label: "7P admission" },
  ];

  for (const { cda, article, keywords, label } of keywordCases) {
    for (const keyword of keywords) {
      it(`[CDA ${cda}] ${label} — art. ${article} contains "${keyword}"`, async () => {
        const chunks = await fetchChunks(cda, article);
        const allContent = chunks.map((c) => c.content).join(" ").toLowerCase();
        expect(allContent).toContain(keyword.toLowerCase());
      });
    }
  }
});

// ============================================================
// 7. Bloc 4 — Article presence
// ============================================================

describe("Corrigé Bloc 4 — Article presence in legal_chunks", () => {
  const presenceCases = [
    { cda: "49466", article: "1.10.2-2", label: "Ex54: DAccE volets" },
    { cda: "49466", article: "1.10.3-1", label: "Ex54: DAccE accès parents" },
    { cda: "28737", article: "132", label: "Ex56: PIA intégration" },
    { cda: "30998", article: "7bis", label: "Ex57: PIA bases 2C" },
    { cda: "49466", article: "1.7.8-1", label: "Ex58: Aménagements raisonnables" },
    { cda: "49466", article: "1.10.2-3", label: "Ex63: DAccE données disciplinaires" },
    { cda: "49466", article: "1.7.10-3", label: "Ex65: Bien-être / PMS" },
    { cda: "49466", article: "1.5.1-9", label: "Ex59: ROI" },
    { cda: "49466", article: "1.5.1-10", label: "Ex60: Accès parents" },
    { cda: "49466", article: "1.5.1-11", label: "Ex60: Accès police" },
    { cda: "49466", article: "1.7.9-4", label: "Ex61/62: Exclusion définitive" },
    { cda: "49466", article: "1.7.9-5", label: "Ex62: Écartement provisoire" },
    { cda: "49466", article: "1.7.9-6", label: "Ex62: Procédure exclusion" },
    { cda: "49466", article: "1.7.9-11", label: "Ex62: Non-réinscription" },
  ];

  for (const { cda, article, label } of presenceCases) {
    it(`[CDA ${cda}] ${label} — art. ${article} exists`, async () => {
      const chunks = await fetchChunks(cda, article);
      expect(chunks.length).toBeGreaterThan(0);
    });
  }

  // Articles KNOWN to be missing
  it.skip("[CDA 49466] Ex59: Conseil de participation — art. 1.5.3-1 EXISTS (currently missing)", async () => {
    const chunks = await fetchChunks("49466", "1.5.3-1");
    expect(chunks.length).toBeGreaterThan(0);
  });
});

// ============================================================
// 8. Bloc 4 — Content keywords
// ============================================================

describe("Corrigé Bloc 4 — Content keywords", () => {
  const keywordCases = [
    { cda: "49466", article: "1.10.2-2", keywords: ["volet", "administratif", "parcours", "fréquentation"], label: "DAccE volets" },
    { cda: "49466", article: "1.10.3-1", keywords: ["parents", "accès", "majeur"], label: "DAccE accès" },
    { cda: "28737", article: "132", keywords: ["pôle territorial", "concertation"], label: "PIA intégration" },
    { cda: "30998", article: "7bis", keywords: ["observation", "compétence", "primaire"], label: "PIA bases" },
    { cda: "49466", article: "1.7.8-1", keywords: ["aménagement", "raisonnable", "matériel", "pédagogique"], label: "AR" },
    { cda: "49466", article: "1.10.2-3", keywords: ["disciplin", "certificat"], label: "DAccE disciplinaire" },
    { cda: "49466", article: "1.7.10-3", keywords: ["bien-être", "climat"], label: "Bien-être" },
    { cda: "49466", article: "1.5.1-9", keywords: ["règlement", "ordre", "pouvoir organisateur"], label: "ROI" },
    { cda: "49466", article: "1.5.1-11", keywords: ["police", "mandat", "flagrant"], label: "Accès police" },
    { cda: "49466", article: "1.7.9-5", keywords: ["écartement", "provisoire", "dix jours"], label: "Écartement" },
    { cda: "49466", article: "1.7.9-6", keywords: ["procédure", "pouvoir organisateur"], label: "Procédure exclusion" },
    { cda: "49466", article: "1.7.9-11", keywords: ["réinscription", "refus"], label: "Non-réinscription" },
  ];

  for (const { cda, article, keywords, label } of keywordCases) {
    for (const keyword of keywords) {
      it(`[CDA ${cda}] ${label} — art. ${article} contains "${keyword}"`, async () => {
        const chunks = await fetchChunks(cda, article);
        const allContent = chunks.map((c) => c.content).join(" ").toLowerCase();
        expect(allContent).toContain(keyword.toLowerCase());
      });
    }
  }
});

// ============================================================
// 9. Bloc 5 — Article presence
// ============================================================

describe("Bloc 5 — Article presence in legal_chunks", () => {
  const presenceCases = [
    { cda: "46287", article: "9", label: "Référent numérique", expectPresent: true },
    { cda: "46287", article: "15", label: "Formation continuée obligation", expectPresent: true },
    { cda: "5108", article: "45", label: "Sanctions disciplinaires", expectPresent: true },
    { cda: "25174", article: "14", label: "Disponibilité maladie / traitement d'attente", expectPresent: true },
    { cda: "27861", article: "7", label: "Indemnité vélo / transport", expectPresent: true },
    { cda: "47237", article: "4", label: "Aptitude pédagogique inspection", expectPresent: true },
    { cda: "31886", article: "5", label: "Profil de fonction direction", expectPresent: true },
    { cda: "31886", article: "11", label: "Formation intégration direction", expectPresent: true },
    { cda: "31886", article: "27", label: "Lettre de mission", expectPresent: true },
    { cda: "45031", article: "32sexies", label: "Bien-être au travail — personne de confiance", expectPresent: true },
    { cda: "45031", article: "32nonies", label: "Harcèlement moral — intervention psychosociale", expectPresent: true },
    { cda: "46239", article: "4/1", label: "Inspection — aptitude pédagogique pôles", expectPresent: true },
    { cda: "49466", article: "6.1.3-2", label: "Personnel — formation professionnelle continue", expectPresent: true },
    { cda: "49466", article: "6.1.3-8", label: "Demi-jours / jours blancs", expectPresent: true },
  ];

  for (const { cda, article, label, expectPresent } of presenceCases) {
    it(`[CDA ${cda}] art. ${article} — ${label}${expectPresent ? "" : " (EXPECTED MISSING)"}`, async () => {
      const chunks = await fetchChunks(cda, article);
      if (expectPresent) {
        expect(chunks.length).toBeGreaterThan(0);
      } else {
        expect(chunks.length).toBe(0);
      }
    });
  }
});

// ============================================================
// 10. Bloc 5 — Content keyword verification
// ============================================================

describe("Bloc 5 — Content keyword verification", () => {
  const keywordCases: { cda: string; article: string; keywords: string[]; label: string; limit?: number }[] = [
    { cda: "46287", article: "9", keywords: ["référent", "numérique"], label: "Référent numérique" },
    { cda: "46287", article: "15", keywords: ["formation", "périodes"], label: "Formation continuée" },
    { cda: "5108", article: "45", keywords: ["commissions paritaires", "chambres de recours", "peines disciplinaires"], label: "Commissions paritaires / chambres de recours", limit: 20 },
    { cda: "25174", article: "14", keywords: ["disponibilité", "maladie"], label: "Disponibilité maladie" },
    { cda: "27861", article: "7", keywords: ["bicyclette", "kilomètre"], label: "Indemnité vélo/bicyclette" },
    { cda: "47237", article: "4", keywords: ["inspection", "pédagogique"], label: "Aptitude pédagogique" },
    { cda: "31886", article: "5", keywords: ["profil", "fonction"], label: "Profil de fonction direction" },
    { cda: "31886", article: "11", keywords: ["formation", "intégration"], label: "Formation intégration direction" },
    { cda: "31886", article: "27", keywords: ["lettre", "mission"], label: "Lettre de mission" },
    { cda: "45031", article: "32sexies", keywords: ["personne de confiance", "délégation"], label: "Personne de confiance" },
    { cda: "45031", article: "32nonies", keywords: ["harcèlement", "intervention", "confiance"], label: "Harcèlement moral — intervention psychosociale" },
    { cda: "46239", article: "4/1", keywords: ["aptitude", "inspection", "manquement"], label: "Inspection — aptitude pédagogique pôles" },
    { cda: "49466", article: "6.1.3-2", keywords: ["formation", "professionnelle"], label: "Formation professionnelle continue" },
    { cda: "49466", article: "6.1.3-8", keywords: ["demi-jour"], label: "Demi-jours" },
  ];

  for (const { cda, article, keywords, label, limit } of keywordCases) {
    for (const keyword of keywords) {
      it(`[CDA ${cda}] ${label} — art. ${article} contains "${keyword}"`, async () => {
        const chunks = await fetchChunks(cda, article, limit);
        const allContent = chunks.map((c) => c.content).join(" ").replace(/\s+/g, " ").toLowerCase();
        expect(allContent).toContain(keyword.toLowerCase());
      });
    }
  }
});

// ============================================================
// 11. Bloc 5 — Deep content verification (multi-chunk articles)
// ============================================================

describe("Bloc 5 — Deep content verification", () => {
  it("[CDA 5108] art. 45 — all 19 chunks contain 'chambres de recours' (chunk 8)", async () => {
    const chunks = await fetchChunks("5108", "45", 20);
    expect(chunks.length).toBe(19);
    // Normalize whitespace (legal text contains line breaks mid-phrase)
    const allContent = chunks.map((c) => c.content).join(" ").replace(/\s+/g, " ").toLowerCase();
    expect(allContent).toContain("chambres de recours");
    expect(allContent).toContain("peines disciplinaires");
  });

  it("[CDA 5108] art. 45 chunk 8 (id d6ffe069) is the chambres de recours chunk", async () => {
    const chunks = await fetchChunks("5108", "45", 20);
    const chunk8 = chunks.find((c) => c.id === "d6ffe069-1f0e-4029-9fd5-a379b60882a1");
    expect(chunk8).toBeDefined();
    const normalized = chunk8!.content.replace(/\s+/g, " ").toLowerCase();
    expect(normalized).toContain("chambres de recours");
  });
});

// ============================================================
// 12. Known missing articles — SENTINEL TESTS
//     These tests PASS while articles are missing (expect 0 chunks).
//     When you fix an article, the test BREAKS — move it to the
//     "present" section above and add keyword verification.
// ============================================================

describe("Known missing articles (sentinel — break on fix)", () => {
  // Bloc 3
  it("CDA 49466 art. 2.2.2-1 (tronc commun grille) is MISSING", async () => {
    const chunks = await fetchChunks("49466", "2.2.2-1");
    expect(chunks.length).toBe(0);
  });

  // Bloc 4
  it("CDA 49466 art. 1.5.3-1 (conseil de participation ROI) is MISSING", async () => {
    const chunks = await fetchChunks("49466", "1.5.3-1");
    expect(chunks.length).toBe(0);
  });

  // Bloc 4+5 — 47114:Annexe — FIXED: article_number now set to 'Annexe'
  it("CDA 47114 art. Annexe (AG éducateur) — present with 3 chunks", async () => {
    const chunks = await fetchChunks("47114", "Annexe");
    expect(chunks.length).toBe(3);
  });

  it("CDA 47114 art. Annexe — contains 'profil' and 'éducateur'", async () => {
    const chunks = await fetchChunks("47114", "Annexe");
    const allContent = chunks.map((c) => c.content).join(" ").replace(/\s+/g, " ").toLowerCase();
    expect(allContent).toContain("profil");
    expect(allContent).toContain("éducateur");
  });

  // Bloc 5 — 45031:32nonies — FIXED: inserted
  it("CDA 45031 art. 32nonies (harcèlement moral) — present", async () => {
    const chunks = await fetchChunks("45031", "32nonies");
    expect(chunks.length).toBeGreaterThan(0);
  });

  // Bloc 5 — 46239:4/1 — FIXED: inserted (was wrongly attributed to 47237)
  it("CDA 46239 art. 4/1 (inspection aptitude pédagogique) — present", async () => {
    const chunks = await fetchChunks("46239", "4/1");
    expect(chunks.length).toBeGreaterThan(0);
  });

  // Bloc 5 — Décret 11/04/2024 — does NOT exist. It's actually Décret 11/04/2014 = CDA 40701.
  // The corrigé references a decree that doesn't exist under this date.
  // See sous-lot B analysis.
});
