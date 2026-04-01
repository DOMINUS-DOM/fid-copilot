/**
 * Gallilex integration — comprehensive CDA mapping for FID exam accuracy.
 *
 * This module maps every FID theme to its exact CDA codes, enabling
 * precise legal text retrieval. The mapping is based on the official
 * FID exam corpus provided by the training program.
 */

const GALLILEX_BASE = "https://gallilex.cfwb.be/textes-normatifs";

// ============================================================
// COMPLETE CDA REGISTRY — all texts referenced in FID exams
// ============================================================

export const CDA_REGISTRY: Record<string, { title: string; shortTitle: string }> = {
  "4329": { title: "Loi du 30 juillet 1963 concernant le régime linguistique dans l'enseignement", shortTitle: "Loi régime linguistique" },
  "5108": { title: "Loi du 29 mai 1959 — Pacte scolaire", shortTitle: "Pacte scolaire" },
  "5556": { title: "Arrêté royal fixant les barèmes", shortTitle: "Barèmes" },
  "9226": { title: "Loi du 24 février 1978 — Contrat sportif rémunéré", shortTitle: "Sportif rémunéré" },
  "9547": { title: "Loi du 29 juin 1983 — Obligation scolaire", shortTitle: "Obligation scolaire" },
  "10450": { title: "Arrêté royal du 29 juin 1984 — Organisation de l'enseignement secondaire", shortTitle: "AR organisation secondaire" },
  "16421": { title: "Décret du 3 juillet 1991 — Enseignement en alternance", shortTitle: "Alternance" },
  "17144": { title: "Arrêté royal — Organisation de l'enseignement secondaire de plein exercice", shortTitle: "AR secondaire plein exercice" },
  "21557": { title: "Décret du 24 juillet 1997 — Missions prioritaires (Décret Missions)", shortTitle: "Décret Missions" },
  "27861": { title: "Décret relatif au transport scolaire", shortTitle: "Transport scolaire" },
  "28737": { title: "Décret du 3 mars 2004 — Enseignement spécialisé", shortTitle: "Enseignement spécialisé" },
  "30998": { title: "Décret — Organisation du 1er degré du secondaire", shortTitle: "1er degré secondaire" },
  "31723": { title: "Décret du 12 janvier 2007 — Citoyenneté à l'école", shortTitle: "Citoyenneté" },
  "31886": { title: "Décret du 2 février 2007 — Statut des directeurs", shortTitle: "Statut directeurs" },
  "32365": { title: "Décret du 11 mai 2007 — Immersion linguistique / CLIL", shortTitle: "Immersion linguistique" },
  "34295": { title: "Décret du 30 avril 2009 — Encadrement différencié", shortTitle: "Encadrement différencié" },
  "40701": { title: "Décret du 11 avril 2014 — Titres et fonctions", shortTitle: "Titres et fonctions" },
  "45031": { title: "Loi du 4 août 1996 — Bien-être au travail", shortTitle: "Bien-être travail" },
  "45593": { title: "Décret du 13 septembre 2018 — Contrats d'objectifs / Pilotage", shortTitle: "Contrats d'objectifs" },
  "45721": { title: "AGCF du 6 novembre 2018 — Répertoire des options de base", shortTitle: "Répertoire options" },
  "46239": { title: "Décret — Inspection et pilotage", shortTitle: "Inspection" },
  "46275": { title: "Décret du 7 février 2019 — DASPA et FLA", shortTitle: "DASPA / FLA" },
  "46287": { title: "Décret du 14 mars 2019 — Organisation du travail", shortTitle: "Organisation travail" },
  "47114": { title: "Arrêté du 3 juillet 2019 — Fonction d'éducateur", shortTitle: "Éducateur" },
  "47165": { title: "Décret — Socles de compétences / Gouvernance", shortTitle: "Socles / Gouvernance" },
  "47237": { title: "Décret du 10 janvier 2019 — Inspection", shortTitle: "Inspection" },
  "49466": { title: "Code de l'enseignement fondamental et secondaire", shortTitle: "Code enseignement" },
  "51784": { title: "Décret — Normes d'encadrement / Conditions d'admission", shortTitle: "Normes encadrement" },
};

// ============================================================
// THEME → CDA MAPPING — exact FID exam corpus
// ============================================================

const THEME_CDA_MAP: Record<string, string[]> = {
  // Absences et fréquentation
  "absence": ["9547", "49466"],
  "absences justifiées": ["9547", "49466"],
  "absences injustifiées": ["9547", "49466"],
  "fréquentation": ["9547", "49466"],
  "obligation scolaire": ["9547", "46275", "49466"],
  "signalement": ["45031", "9547"],

  // Accompagnement et soutien
  "accompagnement personnalisé": ["21557", "30998", "34295"],
  "remédiation": ["21557", "28737", "30998", "34295", "46275"],
  "PIA": ["28737", "30998", "49466"],
  "DAccE": ["49466"],
  "aménagements raisonnables": ["28737", "49466", "30998"],
  "adaptations pédagogiques": ["28737", "49466"],
  "accompagnement": ["21557", "30998"],

  // Admission et inscription
  "admission": ["10450", "17144", "28737", "51784", "46275"],
  "conditions d'admission": ["10450", "17144", "28737", "51784", "46275"],
  "inscription": ["10450", "17144", "49466", "9547"],
  "changement d'école": ["49466", "9547"],
  "changement d'option": ["10450", "17144", "30998"],
  "primo-arrivant": ["46275", "4329"],
  "DASPA": ["46275", "4329"],

  // Attestations et certifications
  "attestation": ["10450", "17144", "21557", "30998"],
  "attestations A B C": ["10450", "17144", "21557", "30998"],
  "CE1D": ["10450", "17144", "30998"],
  "CE2D": ["10450", "17144", "30998"],
  "CESS": ["10450", "17144"],
  "certificat de qualification": ["10450", "17144", "28737"],
  "évaluation": ["21557", "10450", "17144", "30998", "32365"],
  "recours": ["21557", "10450", "17144", "49466"],
  "conseil de classe": ["10450", "17144", "21557", "30998"],

  // Alternance
  "alternance": ["16421"],
  "CEFA": ["16421"],
  "contrat alternance": ["16421"],
  "accident travail": ["16421"],
  "assurance": ["16421"],

  // Cadre institutionnel
  "cadre institutionnel": ["5108"],
  "liberté enseignement": ["5108"],
  "financement": ["5108"],
  "neutralité": ["5108"],
  "pacte scolaire": ["5108"],
  "cours de religion": ["5108"],
  "réseau": ["5108"],
  "subvention": ["5108"],

  // Contrats d'objectifs et pilotage
  "contrat d'objectifs": ["21557", "45593", "47237", "34295", "46239"],
  "plan de pilotage": ["21557", "45593", "47237", "34295", "46239"],
  "pilotage": ["21557", "45593", "47237", "34295", "46239"],
  "missions prioritaires": ["21557", "49466"],
  "gouvernance": ["21557", "31886", "45593", "47165", "49466"],

  // Discipline
  "discipline": ["49466", "45031"],
  "exclusion": ["49466", "45031"],
  "exclusion définitive": ["49466"],
  "écartement": ["49466"],
  "sanction": ["49466", "45031"],
  "ROI": ["10450", "17144", "49466", "51784"],
  "vivre ensemble": ["47114", "45031", "49466"],

  // Direction
  "direction": ["31886", "10450", "17144", "21557", "46287", "45031", "46239"],
  "directeur": ["31886"],
  "lettre de mission": ["31886"],
  "stage directeur": ["31886"],
  "profil de fonction": ["31886"],

  // Encadrement différencié
  "encadrement différencié": ["34295"],
  "indice socio-économique": ["34295"],
  "ISE": ["34295"],

  // Harcèlement et bien-être
  "harcèlement": ["45031"],
  "bien-être": ["31886", "28737", "45031", "46239"],
  "personne de confiance": ["45031"],
  "conseiller en prévention": ["45031"],
  "risques psychosociaux": ["45031"],
  "mineur en danger": ["45031"],
  "médiation": ["31886", "45031", "47114"],
  "climat scolaire": ["31886", "45031", "49466"],

  // Immersion linguistique
  "immersion": ["32365"],
  "immersion linguistique": ["32365"],
  "CLIL": ["32365"],

  // Inspection
  "inspection": ["5108", "46239", "47237"],
  "manquement": ["47237", "46239"],
  "évaluation externe": ["47237", "49466"],

  // Langue et régime linguistique
  "langue": ["4329", "46275"],
  "linguistique": ["4329", "46275"],
  "régime linguistique": ["4329", "46275"],
  "communes à facilités": ["4329"],
  "Voeren": ["4329"],
  "Fourons": ["4329"],
  "Comines": ["4329"],
  "Mouscron": ["4329"],
  "chef de famille": ["4329"],

  // Normes et encadrement
  "normes d'encadrement": ["5108", "10450", "17144", "51784"],
  "NTPP": ["10450", "17144", "51784"],
  "capital-périodes": ["10450", "17144"],

  // Options
  "options": ["10450", "17144", "45721"],
  "option de base groupée": ["10450", "17144", "45721"],
  "répertoire des options": ["45721"],

  // Personnel
  "personnel": ["31886", "40701", "5556", "46287"],
  "titres": ["5108", "31886", "40701", "45721", "32365"],
  "barèmes": ["40701", "5556"],
  "ancienneté": ["31886", "40701", "5556"],
  "nomination": ["31886", "40701"],
  "désignation": ["31886", "40701"],
  "travail collaboratif": ["46287"],
  "référent numérique": ["46287"],
  "éducateur": ["47114"],

  // Relations école-parents
  "parents": ["5108", "31886", "21557", "49466"],
  "relations école-parents": ["5108", "31886"],
  "frais scolaires": ["49466"],
  "gratuité": ["49466"],

  // Sécurité
  "sécurité": ["31886", "28737", "45031", "46239"],
  "police": ["49466"],

  // Socles et compétences
  "socles de compétences": ["21557", "47165"],
  "tronc commun": ["49466", "21557"],

  // Spécialisé
  "enseignement spécialisé": ["28737"],
  "intégration": ["28737"],
  "pôle territorial": ["28737"],
  "type 1": ["28737"], "type 2": ["28737"], "type 3": ["28737"],
  "type 4": ["28737"], "type 5": ["28737"], "type 6": ["28737"],
  "type 7": ["28737"], "type 8": ["28737"],

  // Formation continue
  "formation continue": ["49466", "46287"],
  "formation collective": ["49466"],
  "journée pédagogique": ["49466"],
  "formation professionnelle": ["49466", "46287"],
  "plan de formation": ["45593", "46287"],

  // Structures
  "premier degré": ["30998", "10450"],
  "deuxième degré": ["10450", "17144"],
  "troisième degré": ["10450", "17144"],
  "qualification": ["10450", "17144"],
  "transition": ["10450", "17144"],
  "CES": ["5108"],

  // Transport
  "transport": ["27861"],

  // Sportif
  "sportif": ["9226"],
  "sportif rémunéré": ["9226"],
};

// ============================================================
// SEARCH FUNCTION — find CDA codes relevant to a question
// ============================================================

export interface GallilexResult {
  cdaCode: string;
  title: string;
  shortTitle: string;
  url: string;
  matchScore: number;
}

/**
 * Search for relevant CDA codes based on question keywords.
 * Returns ordered list of CDA codes with Gallilex URLs.
 */
export function searchGallilex(
  keywords: string[],
  existingCdaCodes: string[]
): GallilexResult[] {
  const cdaScores: Record<string, number> = {};
  const questionLower = keywords.join(" ").toLowerCase();

  // Score each CDA code based on theme keyword matches
  for (const [theme, cdas] of Object.entries(THEME_CDA_MAP)) {
    const themeLower = theme.toLowerCase();
    // Check if any keyword matches the theme
    let matched = false;
    for (const kw of keywords) {
      if (themeLower.includes(kw.toLowerCase()) || kw.toLowerCase().includes(themeLower)) {
        matched = true;
        break;
      }
    }
    // Also check full question text
    if (!matched && questionLower.includes(themeLower)) {
      matched = true;
    }

    if (matched) {
      for (const cda of cdas) {
        cdaScores[cda] = (cdaScores[cda] || 0) + 1;
      }
    }
  }

  // Build results, including BOTH existing and new CDA codes
  // (existing ones get a boost but new ones are also returned)
  const results: GallilexResult[] = [];

  for (const [cda, score] of Object.entries(cdaScores)) {
    const info = CDA_REGISTRY[cda];
    if (!info) continue;

    results.push({
      cdaCode: cda,
      title: info.title,
      shortTitle: info.shortTitle,
      url: `${GALLILEX_BASE}/${cda}`,
      matchScore: existingCdaCodes.includes(cda) ? score + 5 : score, // boost existing
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.matchScore - a.matchScore);

  return results.slice(0, 5); // Top 5 most relevant
}

/**
 * Format Gallilex results as context for the AI prompt.
 * Distinguishes between texts already in local chunks and additional references.
 */
export function formatGallilexContext(
  results: GallilexResult[],
  existingCdaCodes: string[]
): string {
  if (results.length === 0) return "";

  const inLocal = results.filter((r) => existingCdaCodes.includes(r.cdaCode));
  const additional = results.filter((r) => !existingCdaCodes.includes(r.cdaCode));

  let context = "";

  if (inLocal.length > 0) {
    context += `\n\n═══════════════════════════════════════
TEXTES JURIDIQUES PRIORITAIRES (identifiés dans la base)
═══════════════════════════════════════
${inLocal.map((r) => `• ${r.shortTitle} (CDA ${r.cdaCode}) — ${r.url}`).join("\n")}`;
  }

  if (additional.length > 0) {
    context += `\n\n═══════════════════════════════════════
TEXTES GALLILEX COMPLÉMENTAIRES (non indexés localement — à citer si pertinent)
═══════════════════════════════════════
${additional.map((r) => `• ${r.title} (CDA ${r.cdaCode}) — ${r.url}`).join("\n")}
CONSIGNE : Si ces textes sont pertinents, cite-les avec leur CDA et le lien Gallilex.`;
  }

  return context;
}
