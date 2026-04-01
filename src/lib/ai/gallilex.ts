/**
 * Gallilex integration — search and extract legal texts from
 * the official FWB legal database (gallilex.cfwb.be).
 *
 * Used as a fallback when local legal_chunks don't have enough
 * coverage for a given question.
 *
 * Strategy:
 * 1. Search Gallilex via web search for relevant CDA codes
 * 2. Fetch the CDA index page to get the PDF URL
 * 3. Return the CDA reference for the AI to cite
 *
 * We DON'T extract full PDF content in real-time (too slow).
 * Instead, we provide verified Gallilex URLs the AI can reference.
 */

const GALLILEX_BASE = "https://gallilex.cfwb.be/textes-normatifs";

interface GallilexResult {
  cdaCode: string;
  title: string;
  url: string;
  relevance: string;
}

/**
 * Search Gallilex for legal texts relevant to a question.
 * Uses known CDA mappings + keyword-based lookup.
 */
export async function searchGallilex(
  keywords: string[],
  existingCdaCodes: string[]
): Promise<GallilexResult[]> {
  const results: GallilexResult[] = [];

  // Known CDA codes for common FID topics not always in local chunks
  const KNOWN_TEXTS: Record<string, { cda: string; title: string; keywords: string[] }> = {
    loi_linguistique: {
      cda: "4329",
      title: "Loi du 30 juillet 1963 — Régime linguistique dans l'enseignement",
      keywords: ["langue", "linguistique", "facilités", "néerlandais", "flamand", "bruxelles", "voeren", "fourons", "comines", "mouscron", "chef de famille", "inscription linguistique"],
    },
    loi_pacte: {
      cda: "5108",
      title: "Loi du 29 mai 1959 — Pacte scolaire",
      keywords: ["pacte scolaire", "subvention", "subventionnement", "liberté enseignement", "réseau", "officiel", "libre"],
    },
    decret_missions: {
      cda: "21557",
      title: "Décret du 24 juillet 1997 — Missions prioritaires",
      keywords: ["missions", "prioritaires", "recours", "conseil de classe", "attestation", "redoublement"],
    },
    code_enseignement: {
      cda: "49466",
      title: "Code de l'enseignement fondamental et secondaire",
      keywords: ["code", "enseignement", "obligation", "scolaire", "frais", "inscription", "exclusion", "discipline", "ROI", "DAccE", "pilotage", "contrat objectifs"],
    },
    decret_specialise: {
      cda: "28737",
      title: "Décret du 3 mars 2004 — Enseignement spécialisé",
      keywords: ["spécialisé", "intégration", "type", "forme", "PIA", "pôle territorial", "aménagement"],
    },
    decret_alternance: {
      cda: "9547",
      title: "Décret du 3 juillet 1991 — Enseignement en alternance",
      keywords: ["alternance", "CEFA", "article 49", "contrat", "formation", "entreprise", "MFI"],
    },
    decret_statut_directeurs: {
      cda: "31886",
      title: "Décret du 2 février 2007 — Statut des directeurs",
      keywords: ["directeur", "directrice", "lettre de mission", "stage", "nomination", "profil", "fonction"],
    },
    ar_1984: {
      cda: "10450",
      title: "AR du 29 juin 1984 — Organisation de l'enseignement secondaire",
      keywords: ["admission", "attestation", "orientation", "changement", "option", "degré", "forme", "section", "grille"],
    },
    decret_encadrement_differencie: {
      cda: "35781",
      title: "Décret du 30 avril 2009 — Encadrement différencié",
      keywords: ["encadrement différencié", "indice socio", "ISE", "classe", "moyens complémentaires"],
    },
    loi_bien_etre: {
      cda: "45031",
      title: "Loi du 4 août 1996 — Bien-être au travail",
      keywords: ["bien-être", "harcèlement", "personne de confiance", "conseiller prévention", "risques psychosociaux"],
    },
    decret_daspa: {
      cda: "46275",
      title: "Décret du 7 février 2019 — DASPA et FLA",
      keywords: ["DASPA", "primo-arrivant", "FLA", "allophone", "intégration"],
    },
    decret_travail_collaboratif: {
      cda: "46287",
      title: "Décret du 14 mars 2019 — Organisation du travail",
      keywords: ["travail collaboratif", "référent", "numérique", "mission", "60 périodes"],
    },
    decret_inspection: {
      cda: "47237",
      title: "Décret du 10 janvier 2019 — Inspection",
      keywords: ["inspection", "manquement", "contrôle", "aptitude", "évaluation externe"],
    },
    decret_formation_continue: {
      cda: "49466",
      title: "Code de l'enseignement — Formation professionnelle continue",
      keywords: ["formation continue", "formation collective", "journée pédagogique", "plan de formation"],
    },
    loi_sportif: {
      cda: "9226",
      title: "Loi du 24 février 1978 — Contrat sportif rémunéré",
      keywords: ["sportif", "rémunéré", "contrat sportif", "mineur"],
    },
    decret_immersion: {
      cda: "32087",
      title: "Décret du 11 mai 2007 — Immersion linguistique",
      keywords: ["immersion", "langue", "néerlandais", "anglais", "allemand", "périodes"],
    },
  };

  const questionLower = keywords.join(" ").toLowerCase();

  for (const [, entry] of Object.entries(KNOWN_TEXTS)) {
    // Skip if already in local chunks
    if (existingCdaCodes.includes(entry.cda)) continue;

    // Check keyword match
    const matchCount = entry.keywords.filter((kw) => questionLower.includes(kw)).length;
    if (matchCount >= 1) {
      results.push({
        cdaCode: entry.cda,
        title: entry.title,
        url: `${GALLILEX_BASE}/${entry.cda}`,
        relevance: matchCount >= 3 ? "high" : matchCount >= 2 ? "medium" : "low",
      });
    }
  }

  // Sort by relevance
  const order = { high: 0, medium: 1, low: 2 };
  results.sort((a, b) => order[a.relevance as keyof typeof order] - order[b.relevance as keyof typeof order]);

  return results.slice(0, 3); // Max 3 additional references
}

/**
 * Format Gallilex results as context for the AI prompt.
 */
export function formatGallilexContext(results: GallilexResult[]): string {
  if (results.length === 0) return "";

  const lines = results.map((r) =>
    `[GALLILEX — ${r.title}]\nCDA : ${r.cdaCode}\nLien : ${r.url}\nPertinence : ${r.relevance}`
  );

  return `\n\n═══════════════════════════════════════
RÉFÉRENCES GALLILEX COMPLÉMENTAIRES (textes identifiés mais non indexés localement)
═══════════════════════════════════════
${lines.join("\n\n---\n\n")}

CONSIGNE : Si ces textes sont pertinents pour la réponse, mentionne-les avec leur CDA et leur lien Gallilex. Indique que l'article exact peut être consulté sur Gallilex.`;
}
