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

export interface CDAInfo {
  title: string;
  shortTitle: string;
  /** Type de texte juridique */
  textType: "code" | "loi" | "décret" | "arrêté royal" | "AGCF";
  /** Pourquoi chercher dans ce texte plutôt qu'un autre (pédagogie FID) */
  rationale: string;
}

export const CDA_REGISTRY: Record<string, CDAInfo> = {
  "4329": { title: "Loi du 30 juillet 1963 concernant le régime linguistique dans l'enseignement", shortTitle: "Loi régime linguistique", textType: "loi", rationale: "Le régime linguistique relève d'une loi fédérale de 1963, antérieure au Code. Ne pas chercher dans le Code de l'enseignement." },
  "5108": { title: "Loi du 29 mai 1959 — Pacte scolaire", shortTitle: "Pacte scolaire", textType: "loi", rationale: "Le Pacte scolaire régit les principes fondamentaux : subventions, neutralité, liberté d'enseignement. C'est le texte de référence pour les conditions de financement." },
  "5556": { title: "Arrêté royal fixant les barèmes", shortTitle: "Barèmes", textType: "arrêté royal", rationale: "Les barèmes de rémunération sont dans un AR spécifique, pas dans le Code." },
  "9226": { title: "Loi du 24 février 1978 — Contrat sportif rémunéré", shortTitle: "Sportif rémunéré", textType: "loi", rationale: "Le statut du sportif rémunéré est régi par une loi fédérale spécifique, en lien avec l'obligation scolaire." },
  "9547": { title: "Loi du 29 juin 1983 — Obligation scolaire", shortTitle: "Obligation scolaire", textType: "loi", rationale: "L'obligation scolaire à temps plein est dans cette loi fédérale, pas dans le Code de l'enseignement." },
  "10450": { title: "Arrêté royal du 29 juin 1984 — Organisation de l'enseignement secondaire", shortTitle: "AR organisation secondaire", textType: "arrêté royal", rationale: "L'organisation pratique du secondaire (horaires, orientation, attestations) est dans cet AR, pas dans le Code." },
  "16421": { title: "Décret du 3 juillet 1991 — Enseignement en alternance", shortTitle: "Alternance", textType: "décret", rationale: "L'alternance (CEFA) a son propre décret. Ne pas chercher dans le Code ou le Décret Missions." },
  "17144": { title: "Arrêté royal — Organisation de l'enseignement secondaire de plein exercice", shortTitle: "AR secondaire plein exercice", textType: "arrêté royal", rationale: "Complète l'AR 10450 pour le plein exercice." },
  "21557": { title: "Décret du 24 juillet 1997 — Missions prioritaires (Décret Missions)", shortTitle: "Décret Missions", textType: "décret", rationale: "Les missions générales de l'enseignement et les recours sont dans le Décret Missions. Attention : ne pas l'utiliser quand le Code a un article spécifique." },
  "27861": { title: "Décret relatif au transport scolaire", shortTitle: "Transport scolaire", textType: "décret", rationale: "Transport et indemnités vélo dans un décret spécifique." },
  "28737": { title: "Décret du 3 mars 2004 — Enseignement spécialisé", shortTitle: "Enseignement spécialisé", textType: "décret", rationale: "Tout ce qui concerne l'enseignement spécialisé (types, intégration, PIA) est dans ce décret." },
  "30998": { title: "Décret — Organisation du 1er degré du secondaire", shortTitle: "1er degré secondaire", textType: "décret", rationale: "Le 1er degré a son propre décret (1C, 1D, 2C, 2S, CE1D, PIA)." },
  "31723": { title: "Décret du 12 janvier 2007 — Citoyenneté à l'école", shortTitle: "Citoyenneté", textType: "décret", rationale: "Éducation à la citoyenneté dans un décret spécifique." },
  "31886": { title: "Décret du 2 février 2007 — Statut des directeurs", shortTitle: "Statut directeurs", textType: "décret", rationale: "Le statut, la lettre de mission et le profil de fonction du directeur sont dans ce décret spécifique." },
  "32365": { title: "Décret du 11 mai 2007 — Immersion linguistique / CLIL", shortTitle: "Immersion linguistique", textType: "décret", rationale: "L'immersion linguistique a son propre décret. Ne pas confondre avec la loi sur le régime linguistique." },
  "34295": { title: "Décret du 30 avril 2009 — Encadrement différencié", shortTitle: "Encadrement différencié", textType: "décret", rationale: "L'encadrement différencié (ISE, classes, moyens) est dans ce décret, pas dans le Code de l'enseignement." },
  "40701": { title: "Décret du 11 avril 2014 — Titres et fonctions", shortTitle: "Titres et fonctions", textType: "décret", rationale: "Les titres requis et suffisants pour enseigner sont dans ce décret." },
  "45031": { title: "Loi du 4 août 1996 — Bien-être au travail", shortTitle: "Bien-être travail", textType: "loi", rationale: "Le bien-être au travail (harcèlement, personne de confiance, risques psychosociaux) est dans une loi fédérale." },
  "45593": { title: "Décret du 13 septembre 2018 — Contrats d'objectifs / Pilotage", shortTitle: "Contrats d'objectifs", textType: "décret", rationale: "Les contrats d'objectifs et le pilotage sont dans ce décret, en complément du Code." },
  "45721": { title: "AGCF du 6 novembre 2018 — Répertoire des options de base", shortTitle: "Répertoire options", textType: "AGCF", rationale: "Le répertoire officiel des OBG est dans cet arrêté du Gouvernement." },
  "46239": { title: "Décret — Inspection et pilotage", shortTitle: "Inspection", textType: "décret", rationale: "Le rôle de l'inspection et le pilotage sont dans ce décret." },
  "46275": { title: "Décret du 7 février 2019 — DASPA et FLA", shortTitle: "DASPA / FLA", textType: "décret", rationale: "Le DASPA (primo-arrivants) a son propre décret. Les définitions, conditions et normes d'encadrement y sont." },
  "46287": { title: "Décret du 14 mars 2019 — Organisation du travail", shortTitle: "Organisation travail", textType: "décret", rationale: "Le travail collaboratif et le référent numérique sont dans ce décret." },
  "47114": { title: "Arrêté du 3 juillet 2019 — Fonction d'éducateur", shortTitle: "Éducateur", textType: "AGCF", rationale: "La fonction d'éducateur est définie dans cet arrêté spécifique." },
  "47165": { title: "Décret — Socles de compétences / Gouvernance", shortTitle: "Socles / Gouvernance", textType: "décret", rationale: "Les socles de compétences et la gouvernance sont dans ce décret." },
  "47237": { title: "Décret du 10 janvier 2019 — Inspection", shortTitle: "Inspection", textType: "décret", rationale: "Le contrôle de l'inspection (manquement, aptitude) est dans ce décret." },
  "49466": { title: "Code de l'enseignement fondamental et secondaire", shortTitle: "Code enseignement", textType: "code", rationale: "Le Code est le texte central. Mais attention : beaucoup de matières sont dans des textes spécifiques (AR, lois fédérales, décrets). Le Code n'est pas toujours le bon point d'entrée." },
  "51683": { title: "Décret relatif à l'évaluation des membres du personnel", shortTitle: "Évaluation personnels", textType: "décret", rationale: "L'évaluation des membres du personnel est dans ce décret spécifique." },
  "51784": { title: "Décret — Normes d'encadrement / Conditions d'admission", shortTitle: "Normes encadrement", textType: "décret", rationale: "Les normes d'encadrement et conditions d'admission sont dans ce décret." },
  "25174": { title: "Décret du 5 juillet 2000 — Régime des congés, disponibilités et mises en disponibilité", shortTitle: "Régime des congés", textType: "décret", rationale: "Les congés et disponibilités du personnel sont dans ce décret spécifique." },
  "23189": { title: "Décret relatif à la formation en cours de carrière dans l'enseignement — ESAHR", shortTitle: "Formation carrière ESAHR", textType: "décret", rationale: "La formation en cours de carrière (ESAHR) est dans ce décret." },
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
  "conseil d'intégration": ["46275"],

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
  "contrat d'objectifs": ["49466", "21557", "45593", "47237", "34295", "46239"],
  "plan de pilotage": ["49466", "21557", "45593", "47237", "34295", "46239"],
  "pilotage": ["49466", "21557", "45593", "47237", "34295", "46239"],
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
  "violence": ["49466", "45031"],
  "agression": ["49466"],
  "insulte": ["49466"],
  "gifle": ["49466"],
  "complicité": ["49466"],
  "instigation": ["49466"],
  "personne étrangère": ["49466"],
  "faits graves": ["49466"],

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
  "classe ISE": ["34295"],

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
  "évaluation externe": ["49466", "47237"],
  "passation": ["49466"],

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

  // Personnel
  "personnel": ["31886", "40701", "5556", "46287", "25174"],
  "titres": ["5108", "31886", "40701", "45721", "32365"],
  "barèmes": ["40701", "5556"],
  "ancienneté": ["31886", "40701", "5556"],
  "nomination": ["31886", "40701"],
  "désignation": ["31886", "40701"],
  "travail collaboratif": ["46287"],
  "référent numérique": ["46287"],
  "éducateur": ["47114"],
  "congé": ["25174"],
  "disponibilité": ["25174"],
  "maladie": ["25174"],
  "mise en disponibilité": ["25174"],
  "traitement attente": ["25174"],

  // Projet d'école
  "projet d'école": ["49466", "21557"],
  "projet école": ["49466", "21557"],

  // Relations école-parents
  "parents": ["5108", "31886", "21557", "49466"],
  "relations école-parents": ["5108", "31886"],
  "frais scolaires": ["49466"],
  "gratuité": ["49466"],
  "règlement études": ["49466", "10450"],
  "règlement des études": ["49466", "10450"],

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
  "formation continue": ["49466", "46287", "23189"],
  "formation collective": ["49466"],
  "journée pédagogique": ["49466"],
  "formation professionnelle": ["49466", "46287", "23189"],
  "plan de formation": ["45593", "46287"],
  "ESAHR": ["23189"],
  "formation carrière": ["23189"],

  // Évaluation des personnels
  "évaluation personnel": ["51683"],
  "évaluation membres du personnel": ["51683"],
  "rapport évaluation": ["51683"],
  "bulletin de signalement": ["51683"],

  // Orientation des études
  "orientation études": ["10450", "17144", "45721"],
  "orientation d'études": ["10450", "17144", "45721"],
  "OBG": ["10450", "17144", "45721"],
  "option de base groupée": ["10450", "17144", "45721"],
  "répertoire des options": ["45721", "10450"],

  // Structures
  "premier degré": ["30998", "10450"],
  "deuxième degré": ["10450", "17144"],
  "D2": ["10450", "17144"],
  "troisième degré": ["10450", "17144"],
  "qualification": ["10450", "17144"],
  "transition": ["10450", "17144"],
  "technique de transition": ["10450", "17144"],
  "CES": ["5108"],

  // Recours / AOB
  "AOB": ["21557", "10450"],
  "recours interne": ["21557"],
  "recours externe": ["21557"],

  // 7e professionnelle
  "7P": ["10450"],
  "septième professionnelle": ["10450"],
  "septième année": ["10450"],

  // Changement forme
  "changement forme": ["10450", "30998"],

  // Passage spécialisé → ordinaire
  "passage spécialisé": ["28737"],

  // Fait grave / non-réinscription
  "fait grave": ["49466"],
  "non-réinscription": ["49466"],

  // Accès à l'école
  "accès école": ["49466"],

  // Indemnité vélo
  "indemnité vélo": ["27861"],
  "bicyclette": ["27861"],

  // Sanction disciplinaire enseignant
  "sanction disciplinaire": ["5108", "45031"],
  "chambre de recours": ["5108"],

  // Aptitude pédagogique
  "aptitude pédagogique": ["47237", "46239"],

  // Transport
  "transport": ["27861"],

  // Sportif
  "sportif": ["9226", "9547"],
  "sportif rémunéré": ["9226", "9547"],
};

// ============================================================
// PIVOT ARTICLES — direct article injection for FID exam accuracy
// Maps question keywords to specific article_numbers that MUST
// be fetched, because FTS alone may not surface them reliably.
// ============================================================

export interface PivotArticle {
  cdaCode: string;
  articleNumber: string;
  label: string;
}

const PIVOT_ARTICLE_MAP: Record<string, PivotArticle[]> = {
  // Frais scolaires / gratuité
  "frais scolaires": [
    { cdaCode: "49466", articleNumber: "1.7.2-2", label: "Frais scolaires autorisés" },
    { cdaCode: "49466", articleNumber: "1.7.2-1", label: "Interdiction du minerval" },
  ],
  "minerval": [
    { cdaCode: "49466", articleNumber: "1.7.2-1", label: "Interdiction du minerval" },
    { cdaCode: "49466", articleNumber: "1.7.2-2", label: "Frais scolaires autorisés" },
  ],
  "gratuité": [
    { cdaCode: "49466", articleNumber: "1.7.2-1", label: "Gratuité d'accès" },
    { cdaCode: "49466", articleNumber: "1.7.2-2", label: "Frais scolaires autorisés" },
  ],

  // Absences / fréquentation
  "absence": [
    { cdaCode: "49466", articleNumber: "1.7.1-9", label: "Registre de fréquentation / absences injustifiées" },
    { cdaCode: "49466", articleNumber: "1.7.1-8", label: "Contrôle de la fréquentation" },
  ],
  "absence justifiée": [
    { cdaCode: "49466", articleNumber: "1.7.1-8", label: "Contrôle fréquentation / motifs d'absence" },
  ],
  "fréquentation": [
    { cdaCode: "49466", articleNumber: "1.7.1-9", label: "Registre de fréquentation" },
    { cdaCode: "49466", articleNumber: "1.7.1-8", label: "Contrôle de la fréquentation" },
  ],
  "registre": [
    { cdaCode: "49466", articleNumber: "1.7.1-9", label: "Registre de fréquentation" },
  ],

  // Aménagements raisonnables
  "aménagements raisonnables": [
    { cdaCode: "49466", articleNumber: "1.7.8-1", label: "Aménagements raisonnables" },
  ],
  "aménagement": [
    { cdaCode: "49466", articleNumber: "1.7.8-1", label: "Aménagements raisonnables" },
  ],
  "besoins spécifiques": [
    { cdaCode: "49466", articleNumber: "1.7.8-1", label: "Aménagements raisonnables" },
  ],

  // Exclusion / écartement
  "exclusion": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Exclusion définitive" },
    { cdaCode: "49466", articleNumber: "1.7.9-5", label: "Écartement provisoire" },
    { cdaCode: "49466", articleNumber: "1.7.9-6", label: "Procédure d'exclusion" },
  ],
  "exclusion définitive": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Exclusion définitive" },
    { cdaCode: "49466", articleNumber: "1.7.9-6", label: "Procédure d'exclusion" },
  ],
  "écartement": [
    { cdaCode: "49466", articleNumber: "1.7.9-5", label: "Écartement provisoire" },
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Exclusion définitive" },
  ],

  // Violence / complicité / personne étrangère à l'école
  "complicité": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Faits graves — complicité personne étrangère (§2)" },
  ],
  "instigation": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Faits graves — instigation personne étrangère (§2)" },
  ],
  "personne étrangère": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Faits graves — personne étrangère à l'école (§2)" },
  ],
  "violence": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Faits graves — exclusion définitive" },
    { cdaCode: "49466", articleNumber: "1.7.9-5", label: "Écartement provisoire" },
  ],
  "agression": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Faits graves — exclusion définitive" },
  ],
  "gifle": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Faits graves — coups et blessures" },
  ],
  "insulte": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Faits graves — exclusion définitive" },
  ],
  "frappé": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Faits graves — coups et blessures" },
  ],
  "coups": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Faits graves — coups et blessures" },
  ],
  "menace": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Faits graves — menaces" },
    { cdaCode: "49466", articleNumber: "1.7.9-5", label: "Écartement provisoire" },
  ],
  "faits graves": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Faits graves — exclusion définitive" },
    { cdaCode: "49466", articleNumber: "1.7.9-6", label: "Procédure d'exclusion" },
  ],

  // DAccE
  // DAccE — accès (1.10.3-1) en premier car c'est la question la plus fréquente à l'examen
  "DAccE": [
    { cdaCode: "49466", articleNumber: "1.10.3-1", label: "DAccE — accès (qui peut consulter)" },
    { cdaCode: "49466", articleNumber: "1.10.2-2", label: "DAccE — volets et contenu" },
    { cdaCode: "49466", articleNumber: "1.10.2-3", label: "DAccE — données disciplinaires interdites" },
  ],
  "dossier accompagnement": [
    { cdaCode: "49466", articleNumber: "1.10.2-2", label: "DAccE — volets et contenu" },
    { cdaCode: "49466", articleNumber: "1.10.3-1", label: "DAccE — accès" },
  ],

  // Évaluations externes
  "évaluation externe": [
    { cdaCode: "49466", articleNumber: "1.6.3-10", label: "Responsabilités évaluations externes" },
  ],
  "évaluations externes": [
    { cdaCode: "49466", articleNumber: "1.6.3-10", label: "Responsabilités évaluations externes" },
  ],
  "passation": [
    { cdaCode: "49466", articleNumber: "1.6.3-10", label: "Responsabilités évaluations externes" },
  ],

  // Règlement des études / implantations
  "règlement des études": [
    { cdaCode: "49466", articleNumber: "1.5.1-8", label: "Règlement des études" },
  ],
  "règlement études": [
    { cdaCode: "49466", articleNumber: "1.5.1-8", label: "Règlement des études" },
  ],
  "implantation": [
    { cdaCode: "49466", articleNumber: "1.5.1-8", label: "Règlement des études par implantation" },
  ],

  // Personne de confiance
  "personne de confiance": [
    { cdaCode: "45031", articleNumber: "32sexies", label: "Personne de confiance" },
  ],
  "harcèlement": [
    { cdaCode: "45031", articleNumber: "32sexies", label: "Personne de confiance" },
  ],

  // Obligation scolaire
  "obligation scolaire": [
    { cdaCode: "9547", articleNumber: "1er", label: "Obligation scolaire" },
    { cdaCode: "49466", articleNumber: "1.7.1-2", label: "Obligation scolaire — Code enseignement" },
  ],
  "travail mineur": [
    { cdaCode: "9547", articleNumber: "10", label: "Interdiction de travail des mineurs" },
    { cdaCode: "9547", articleNumber: "1er", label: "Obligation scolaire à temps plein" },
  ],
  "sportif rémunéré": [
    { cdaCode: "9547", articleNumber: "11", label: "Contrat sportif rémunéré — scolarité obligatoire" },
    { cdaCode: "9547", articleNumber: "1er", label: "Obligation scolaire à temps plein" },
  ],
  "élève libre": [
    { cdaCode: "10450", articleNumber: "2", label: "Définitions — élève libre / régulièrement inscrit" },
  ],

  // Orientation des études (D2, technique de transition, OBG)
  "orientation": [
    { cdaCode: "10450", articleNumber: "5", label: "Orientation d'études — D2 et D3" },
  ],
  "orientation études": [
    { cdaCode: "10450", articleNumber: "5", label: "Orientation d'études — D2 et D3" },
  ],
  "orientation d'études": [
    { cdaCode: "10450", articleNumber: "5", label: "Orientation d'études — D2 et D3" },
  ],
  "D2": [
    { cdaCode: "10450", articleNumber: "5", label: "Orientation d'études au D2" },
  ],
  "deuxième degré": [
    { cdaCode: "10450", articleNumber: "5", label: "Orientation d'études au D2" },
  ],
  "technique de transition": [
    { cdaCode: "10450", articleNumber: "5", label: "Orientation d'études — technique de transition" },
  ],
  "OBG": [
    { cdaCode: "10450", articleNumber: "5", label: "Orientation d'études — OBG au répertoire" },
  ],
  "répertoire des options": [
    { cdaCode: "10450", articleNumber: "5", label: "Orientation d'études et répertoire des options" },
    { cdaCode: "10450", articleNumber: "12", label: "Conditions de changement de forme/section/option" },
  ],

  // Changement d'option (secondaire)
  "changement option": [
    { cdaCode: "10450", articleNumber: "12", label: "Conditions de changement de forme/section/option" },
    { cdaCode: "10450", articleNumber: "19", label: "Délais changement d'option" },
  ],
  "option": [
    { cdaCode: "10450", articleNumber: "12", label: "Conditions de changement de forme/section/option" },
  ],

  // Périodes de cours / aménagement horaire
  "période": [
    { cdaCode: "10450", articleNumber: "2", label: "Définitions — période de 50 minutes" },
  ],
  "45 minutes": [
    { cdaCode: "10450", articleNumber: "1er", label: "Art. 1er §2 — dérogation périodes de 45 minutes" },
  ],
  "périodes de 45 minutes": [
    { cdaCode: "10450", articleNumber: "1er", label: "Art. 1er §2 — dérogation périodes de 45 minutes" },
  ],
  "plages de 90 minutes": [
    { cdaCode: "10450", articleNumber: "1er", label: "Art. 1er §2 — plages de 90 minutes" },
  ],
  "temps récupéré": [
    { cdaCode: "10450", articleNumber: "1er", label: "Art. 1er §2 — temps récupéré (5 min/période)" },
  ],
  "horaire des cours": [
    { cdaCode: "10450", articleNumber: "1er", label: "Art. 1er §1 et §2 — horaire hebdomadaire" },
  ],
  "horaire": [
    { cdaCode: "10450", articleNumber: "2", label: "Définitions — période de 50 minutes" },
  ],
  "aménagement horaire": [
    { cdaCode: "10450", articleNumber: "1er", label: "Art. 1er §2 — aménagement horaire 45/90 min" },
  ],

  // Alternance / CEFA
  "alternance": [
    { cdaCode: "16421", articleNumber: "2bis", label: "Organisation de l'alternance — MFI" },
  ],
  "CEFA": [
    { cdaCode: "16421", articleNumber: "2bis", label: "Organisation de l'alternance — CEFA" },
    { cdaCode: "49466", articleNumber: "1.7.1-2", label: "Obligation scolaire — conditions CEFA" },
  ],
  "réinsertion": [
    { cdaCode: "16421", articleNumber: "10", label: "Attestation de réinsertion" },
  ],

  // Régime linguistique — Voeren / Fourons
  "Voeren": [
    { cdaCode: "4329", articleNumber: "6", label: "Choix linguistique — communes de la frontière linguistique" },
  ],
  "Fourons": [
    { cdaCode: "4329", articleNumber: "6", label: "Choix linguistique — communes de la frontière linguistique" },
  ],

  // Immersion linguistique
  "immersion": [
    { cdaCode: "32365", articleNumber: "12", label: "Limites horaires de l'immersion linguistique" },
  ],
  "immersion linguistique": [
    { cdaCode: "32365", articleNumber: "12", label: "Limites horaires de l'immersion linguistique" },
  ],

  // Répertoire options — statut R2
  "R2": [
    { cdaCode: "45721", articleNumber: "5", label: "Options réservées R2 — avis Conseil général" },
  ],
  "option réservée": [
    { cdaCode: "45721", articleNumber: "5", label: "Options réservées R2 — avis Conseil général" },
  ],

  // DASPA / primo-arrivants — art. 6 (normes) en premier pour les questions de seuil
  "DASPA": [
    { cdaCode: "46275", articleNumber: "6", label: "Normes d'encadrement DASPA — seuil 10 primo-arrivants" },
    { cdaCode: "46275", articleNumber: "2", label: "Définitions DASPA / primo-arrivant" },
    { cdaCode: "46275", articleNumber: "3", label: "Objectifs du DASPA" },
  ],
  "primo-arrivant": [
    { cdaCode: "46275", articleNumber: "2", label: "Définitions — élève primo-arrivant" },
    { cdaCode: "46275", articleNumber: "6", label: "Normes d'encadrement DASPA — 10 primo-arrivants" },
  ],
  "encadrement DASPA": [
    { cdaCode: "46275", articleNumber: "6", label: "Normes d'encadrement DASPA — seuil 10 primo-arrivants" },
  ],

  // Missions prioritaires
  "missions prioritaires": [
    { cdaCode: "49466", articleNumber: "1.4.1-1", label: "Missions prioritaires — Code de l'enseignement" },
    { cdaCode: "21557", articleNumber: "6", label: "Missions prioritaires — Décret Missions" },
  ],
  "missions": [
    { cdaCode: "49466", articleNumber: "1.4.1-1", label: "Missions prioritaires — Code de l'enseignement" },
    { cdaCode: "21557", articleNumber: "6", label: "Missions prioritaires — Décret Missions" },
  ],
  "émancipation": [
    { cdaCode: "49466", articleNumber: "1.4.1-1", label: "Missions prioritaires — émancipation sociale" },
  ],

  // Contrats d'objectifs / plans de pilotage / projet d'école
  "contrat d'objectifs": [
    { cdaCode: "49466", articleNumber: "1.5.2-10", label: "Suivi rapproché" },
  ],
  "plan de pilotage": [
    { cdaCode: "49466", articleNumber: "1.5.2-2", label: "Objectifs d'amélioration des plans de pilotage" },
  ],
  "projet d'école": [
    { cdaCode: "49466", articleNumber: "1.5.1-5", label: "Contenu et finalité du projet d'école" },
  ],
  "projet école": [
    { cdaCode: "49466", articleNumber: "1.5.1-5", label: "Contenu et finalité du projet d'école" },
  ],

  // Formation continue
  "formation collective": [
    { cdaCode: "49466", articleNumber: "6.1.3-2", label: "Formation collective obligatoire" },
  ],
  "journée pédagogique": [
    { cdaCode: "49466", articleNumber: "6.1.3-2", label: "Formation collective obligatoire" },
  ],

  // Travail collaboratif
  "travail collaboratif": [
    { cdaCode: "46287", articleNumber: "15", label: "Volume travail collaboratif" },
  ],

  // Référent numérique
  "référent numérique": [
    { cdaCode: "46287", articleNumber: "9", label: "Référent numérique — conditions et procédure" },
  ],

  // Disponibilité maladie / traitement d'attente
  "disponibilité maladie": [
    { cdaCode: "25174", articleNumber: "14", label: "Traitement d'attente en disponibilité maladie" },
  ],
  "traitement d'attente": [
    { cdaCode: "25174", articleNumber: "14", label: "Traitement d'attente en disponibilité maladie" },
  ],

  // Indemnité vélo / bicyclette
  "indemnité vélo": [
    { cdaCode: "27861", articleNumber: "7", label: "Indemnité kilométrique vélo" },
  ],
  "bicyclette": [
    { cdaCode: "27861", articleNumber: "7", label: "Indemnité kilométrique vélo" },
  ],

  // Sanction disciplinaire / chambres de recours
  "sanction disciplinaire": [
    { cdaCode: "5108", articleNumber: "45", label: "Commissions paritaires — chambres de recours" },
  ],
  "chambre de recours": [
    { cdaCode: "5108", articleNumber: "45", label: "Commissions paritaires — chambres de recours" },
  ],

  // Inspection — manquement
  "manquement": [
    { cdaCode: "47237", articleNumber: "4", label: "Inspection — contrôle sur manquement" },
    { cdaCode: "46239", articleNumber: "4/1", label: "Inspection — manquement pôles territoriaux" },
  ],
  "aptitude pédagogique": [
    { cdaCode: "47237", articleNumber: "4", label: "Inspection — aptitude pédagogique" },
    { cdaCode: "46239", articleNumber: "4/1", label: "Inspection — aptitude pédagogique pôles" },
  ],

  // Direction — lettre de mission, accompagnement, profil
  "lettre de mission": [
    { cdaCode: "31886", articleNumber: "27", label: "Lettre de mission — durée et modification" },
  ],
  "accompagnement direction": [
    { cdaCode: "31886", articleNumber: "11", label: "Accompagnement d'intégration — 30 heures" },
  ],
  "accompagnement directeur": [
    { cdaCode: "31886", articleNumber: "11", label: "Accompagnement d'intégration — 30 heures" },
  ],
  "formation intégration": [
    { cdaCode: "31886", articleNumber: "11", label: "Accompagnement d'intégration — 30 heures" },
  ],
  "profil de fonction": [
    { cdaCode: "31886", articleNumber: "5", label: "Profil de fonction — 7 catégories de responsabilités" },
  ],
  "responsabilités direction": [
    { cdaCode: "31886", articleNumber: "5", label: "Profil de fonction — 7 catégories de responsabilités" },
  ],
  "responsabilités directeur": [
    { cdaCode: "31886", articleNumber: "5", label: "Profil de fonction — 7 catégories de responsabilités" },
  ],

  // Formation — demi-jours capitalisables
  "demi-jours": [
    { cdaCode: "49466", articleNumber: "6.1.3-8", label: "Demi-jours de formation — capitalisables sur 6 ans" },
  ],

  // Passage spécialisé → ordinaire
  "spécialisé ordinaire": [
    { cdaCode: "28737", articleNumber: "65", label: "Passage enseignement spécialisé vers ordinaire" },
  ],
  "passage spécialisé": [
    { cdaCode: "28737", articleNumber: "65", label: "Passage enseignement spécialisé vers ordinaire" },
  ],

  // Conditions d'âge — admission secondaire
  "condition d'âge": [
    { cdaCode: "10450", articleNumber: "6", label: "Conditions d'âge — 31 décembre" },
  ],
  "âge admission": [
    { cdaCode: "10450", articleNumber: "6", label: "Conditions d'âge — 31 décembre" },
  ],

  // Premier degré — orientation, durée, passages
  "1D": [
    { cdaCode: "30998", articleNumber: "6", label: "Admission au 1er degré — 1D/1C" },
  ],
  "1C": [
    { cdaCode: "30998", articleNumber: "6", label: "Admission au 1er degré — 1D/1C" },
  ],
  "durée premier degré": [
    { cdaCode: "30998", articleNumber: "6ter", label: "Durée maximale au 1er degré — 3 ans" },
  ],
  "3 ans": [
    { cdaCode: "30998", articleNumber: "6ter", label: "Durée maximale au 1er degré — 3 ans" },
  ],
  "CE1D": [
    { cdaCode: "30998", articleNumber: "26", label: "Orientation au terme de 2C — CE1D" },
    { cdaCode: "30998", articleNumber: "28bis", label: "Orientation au terme de 2S — sans CE1D" },
  ],
  "2S": [
    { cdaCode: "30998", articleNumber: "26", label: "Orientation vers 2S — année supplémentaire" },
    { cdaCode: "30998", articleNumber: "28bis", label: "Orientation au terme de 2S" },
  ],
  "année supplémentaire": [
    { cdaCode: "30998", articleNumber: "26", label: "Orientation vers année supplémentaire (2S)" },
  ],
  "2D": [
    { cdaCode: "30998", articleNumber: "28", label: "Orientation au terme de 2D" },
  ],

  // Changement de forme / option
  "changement forme": [
    { cdaCode: "10450", articleNumber: "19", label: "Passage entre formes d'enseignement" },
    { cdaCode: "10450", articleNumber: "12", label: "Conditions de changement de forme/section" },
  ],
  "16 novembre": [
    { cdaCode: "10450", articleNumber: "20", label: "Changement d'option — règle du 16 novembre" },
  ],

  // Recours
  "recours": [
    { cdaCode: "21557", articleNumber: "96", label: "Recours interne — procédure" },
    { cdaCode: "21557", articleNumber: "98", label: "Recours externe — délais" },
  ],
  "recours interne": [
    { cdaCode: "21557", articleNumber: "96", label: "Recours interne — procédure" },
  ],
  "AOB": [
    { cdaCode: "21557", articleNumber: "96", label: "Recours interne contre AOB" },
    { cdaCode: "21557", articleNumber: "98", label: "Recours externe contre AOB" },
  ],

  // PIA (plan individualisé d'apprentissage)
  "PIA": [
    { cdaCode: "30998", articleNumber: "7bis", label: "PIA — bases et élaboration au 1er degré" },
    { cdaCode: "28737", articleNumber: "132", label: "PIA — intégration permanente totale" },
  ],
  "plan individualisé": [
    { cdaCode: "30998", articleNumber: "7bis", label: "PIA — bases et élaboration au 1er degré" },
    { cdaCode: "28737", articleNumber: "132", label: "PIA — intégration permanente totale" },
  ],
  "PIA intégration": [
    { cdaCode: "28737", articleNumber: "132", label: "PIA — intégration permanente totale" },
  ],

  // ROI
  "ROI": [
    { cdaCode: "49466", articleNumber: "1.5.1-9", label: "Règlement d'ordre intérieur — adoption par le PO" },
  ],
  "règlement d'ordre intérieur": [
    { cdaCode: "49466", articleNumber: "1.5.1-9", label: "Règlement d'ordre intérieur — adoption par le PO" },
  ],

  // Accès à l'école / police
  "police": [
    { cdaCode: "49466", articleNumber: "1.5.1-11", label: "Accès des services de police à l'école" },
  ],
  "accès école": [
    { cdaCode: "49466", articleNumber: "1.5.1-10", label: "Accès des parents à l'école" },
    { cdaCode: "49466", articleNumber: "1.5.1-11", label: "Accès des tiers et de la police" },
  ],

  // Bien-être / climat scolaire
  "bien-être": [
    { cdaCode: "49466", articleNumber: "1.7.10-3", label: "Climat scolaire et bien-être" },
  ],
  "climat scolaire": [
    { cdaCode: "49466", articleNumber: "1.7.10-3", label: "Climat scolaire et bien-être" },
  ],

  // Non-réinscription
  "non-réinscription": [
    { cdaCode: "49466", articleNumber: "1.7.9-11", label: "Refus de réinscription = exclusion définitive" },
  ],
  "réinscription": [
    { cdaCode: "49466", articleNumber: "1.7.9-11", label: "Refus de réinscription = exclusion définitive" },
  ],

  // Fait grave
  "fait grave": [
    { cdaCode: "49466", articleNumber: "1.7.9-4", label: "Faits graves — exclusion définitive" },
  ],

  // Qualification spécialisé
  "qualification spécialisé": [
    { cdaCode: "28737", articleNumber: "59", label: "CQ enseignement spécialisé — stages obligatoires" },
  ],
  "CQ stages": [
    { cdaCode: "28737", articleNumber: "59", label: "CQ enseignement spécialisé — stages obligatoires" },
  ],

  // 7e professionnelle
  "7P": [
    { cdaCode: "10450", articleNumber: "17", label: "Admission en 7e professionnelle — conditions" },
  ],
  "septième professionnelle": [
    { cdaCode: "10450", articleNumber: "17", label: "Admission en 7e professionnelle — conditions" },
  ],

  // Encadrement différencié / ISE
  "encadrement différencié": [
    { cdaCode: "34295", articleNumber: "3", label: "Classes d'encadrement selon l'ISE" },
  ],
  "ISE": [
    { cdaCode: "34295", articleNumber: "3", label: "Classes ISE — encadrement différencié" },
  ],
  "indice socio-économique": [
    { cdaCode: "34295", articleNumber: "3", label: "Classes ISE — encadrement différencié" },
  ],
  "classe ISE": [
    { cdaCode: "34295", articleNumber: "3", label: "Classes ISE — encadrement différencié" },
  ],

  // Subventions / perte après 15 janvier
  "subvention": [
    { cdaCode: "5108", articleNumber: "73", label: "Art. 73 §2bis — conditions de subventionnement" },
  ],
  "subventions": [
    { cdaCode: "5108", articleNumber: "73", label: "Art. 73 §2bis — perte de subventions après le 15 janvier" },
  ],
  "15 janvier": [
    { cdaCode: "5108", articleNumber: "73", label: "Art. 73 §2bis — exclusion après le 15 janvier" },
  ],
  "perte subventions": [
    { cdaCode: "5108", articleNumber: "73", label: "Art. 73 §2bis — perte de subventions" },
  ],
};

/**
 * Find pivot articles that should be directly fetched based on question keywords.
 * These articles are critical for FID exam accuracy and may not surface via FTS alone.
 */
export function findPivotArticles(keywords: string[]): PivotArticle[] {
  const questionLower = keywords.join(" ").toLowerCase();
  const kwsLower = keywords.map((k) => k.toLowerCase());
  const found: PivotArticle[] = [];
  const seen = new Set<string>();

  for (const [trigger, articles] of Object.entries(PIVOT_ARTICLE_MAP)) {
    const triggerLower = trigger.toLowerCase();
    const triggerWords = triggerLower.split(/\s+/);
    let matched = false;

    if (triggerWords.length > 1) {
      // Multi-word trigger: all substantive words must be present in keywords
      // (prevents "direction" alone from matching "accompagnement direction")
      // Skip numeric/short trigger words since extractKeywords strips digits
      const substantive = triggerWords.filter(
        (tw) => tw.length > 2 && /[a-zàâäéèêëïîôùûüÿç]/.test(tw),
      );
      matched =
        substantive.length > 0 &&
        substantive.every((tw) =>
          kwsLower.some((kw) => kw.includes(tw) || tw.includes(kw)),
        );
    } else {
      // Single-word trigger: substring match against any keyword
      for (const kw of kwsLower) {
        if (kw.includes(triggerLower) || triggerLower.includes(kw)) {
          matched = true;
          break;
        }
      }
    }

    // Also check full question text for multi-word triggers as a phrase
    if (!matched && triggerWords.length > 1 && questionLower.includes(triggerLower)) {
      matched = true;
    }

    if (matched) {
      for (const art of articles) {
        const key = `${art.cdaCode}:${art.articleNumber}`;
        if (!seen.has(key)) {
          seen.add(key);
          found.push(art);
        }
      }
    }
  }

  return found.slice(0, 5); // Max 5 pivot articles
}

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
