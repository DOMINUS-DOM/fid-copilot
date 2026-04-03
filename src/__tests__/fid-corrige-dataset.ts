/**
 * FID Corrigé Dataset — Blocs 1, 2, 3, 4 & 5
 * Bloc 1: Missions, pilotage, structures, organisation, orientation
 * Bloc 2: Frais scolaires, obligation scolaire, fréquentation, alternance, inscription
 * Bloc 3: Admission, 1er degré, orientation, sanction des études, recours, évaluations
 * Bloc 4: DAccE, PIA, besoins spécifiques, vivre ensemble, discipline
 * Bloc 5: Personnel, titres, formation, direction, bien-être au travail
 *
 * Parsed from the official FID exam correction corpus.
 * Each case preserves the EXACT references from the corrigé.
 * Divergences with the current system are flagged in notes.
 *
 * Generated: 2026-04-03
 */

export type QuestionType = "qcm" | "ouverte" | "cas-pratique";
export type Priority = "critical" | "important" | "nice_to_have";
export type SourceType = "corrige" | "base" | "to_review";

export interface LegalReference {
  textTitle: string;
  cda?: string;
  article: string;
  paragraph?: string;
  excerpt?: string;
  sourceType: SourceType;
}

export interface ExpectedPivot {
  cda: string;
  article: string;
}

export interface FidCorrigeCase {
  id: string;
  section?: string;
  theme: string;
  level?: string;
  question: string;
  questionType: QuestionType;
  expectedAnswer: {
    qcmIndex?: number;
    shortAnswer?: string;
  };
  legalReferences: LegalReference[];
  expectedPivots: ExpectedPivot[];
  keywords: string[];
  pivotTriggers: string[];
  priority: Priority;
  notes?: string;
}

// ============================================================
// Bloc 1 — Missions, pilotage, structures, organisation, orientation
// ============================================================

export const FID_CORRIGE_BLOC1: FidCorrigeCase[] = [
  // ─── Missions, pilotage et contrats d'objectifs ───

  {
    id: "b1-ex01",
    section: "Missions et pilotage",
    theme: "Missions prioritaires",
    level: "P",
    question:
      "Choisissez l'item correct : (1) Une des missions prioritaires est d'assurer à tous les élèves des chances égales d'émancipation sociale. (2) Quatre missions prioritaires et hiérarchisées ont été définies. (3) L'enseignement a pour principal objectif d'amener tous les élèves à s'approprier des savoirs...",
    questionType: "qcm",
    expectedAnswer: { qcmIndex: 1 },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement fondamental et secondaire",
        cda: "49466",
        article: "1.4.1-1",
        excerpt:
          "La Communauté française, les pouvoirs organisateurs et les équipes éducatives remplissent simultanément et sans hiérarchie les missions prioritaires suivantes : 1° promouvoir la confiance en soi... 2° amener tous les élèves à s'approprier des savoirs... 3° préparer tous les élèves à être des citoyens responsables... 4° assurer à tous les élèves des chances égales d'émancipation sociale.",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.4.1-1" }],
    keywords: [
      "missions prioritaires",
      "émancipation sociale",
      "confiance en soi",
      "savoirs",
      "compétences",
      "citoyens responsables",
    ],
    pivotTriggers: ["missions prioritaires", "missions", "émancipation"],
    priority: "critical",
    notes:
      "Le piège est que les 3 items sont partiellement vrais, mais seul le 1 est « correct » car l'item 2 dit « hiérarchisées » (faux : elles sont sans hiérarchie) et l'item 3 omet une mission. Le pivot existant pointe vers art. 6 du Décret Missions (CDA 21557), pas vers art. 1.4.1-1 du Code (CDA 49466). Les deux textes coexistent mais le Code est la référence actuelle.",
  },

  {
    id: "b1-ex02",
    section: "Missions et pilotage",
    theme: "Plans de pilotage / contrats d'objectifs",
    level: "P",
    question:
      "Les plans de pilotage / contrats d'objectifs poursuivent des objectifs d'amélioration au niveau du système éducatif. Identifiez deux de ces objectifs.",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Parmi les 7 objectifs de l'art. 1.5.2-2 : améliorer les savoirs, augmenter les diplômés du secondaire supérieur, réduire les différences socio-économiques, réduire le redoublement et le décrochage, réduire les changements d'école dans le tronc commun, augmenter l'inclusion, améliorer le bien-être.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement fondamental et secondaire",
        cda: "49466",
        article: "1.5.2-2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.5.2-2" }],
    keywords: [
      "plan de pilotage",
      "contrat d'objectifs",
      "objectifs d'amélioration",
      "système éducatif",
      "redoublement",
      "décrochage",
      "bien-être",
    ],
    pivotTriggers: [
      "plan de pilotage",
      "contrat d'objectifs",
      "objectifs amélioration",
    ],
    priority: "important",
  },

  {
    id: "b1-ex03",
    section: "Missions et pilotage",
    theme: "Délégués au contrat d'objectifs",
    level: "D",
    question:
      "Quel est le rôle des délégués au contrat d'objectifs en matière de formation professionnelle ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Réaliser à partir des plans de formation la collecte des besoins en matière de formations professionnelles continues (art. 7 §1, 3°/1).",
    },
    legalReferences: [
      {
        textTitle: "Décret du 13 septembre 2018 — Contrats d'objectifs / Pilotage",
        cda: "45593",
        article: "7",
        paragraph: "1",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "45593", article: "7" }],
    keywords: [
      "délégué",
      "contrat d'objectifs",
      "formation professionnelle",
      "collecte",
      "besoins",
    ],
    pivotTriggers: ["délégué contrat", "formation professionnelle continue"],
    priority: "nice_to_have",
  },

  {
    id: "b1-ex04",
    section: "Missions et pilotage",
    theme: "Suivi rapproché",
    level: "D",
    question:
      "Dans quelle(s) circonstance(s) un processus de suivi rapproché serait-il mis en place en matière de contrats d'objectifs ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Quand l'évaluation intermédiaire révèle une mauvaise volonté manifeste, une incapacité manifeste à atteindre les objectifs, ou un refus/incapacité de modifier le contrat d'objectifs.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement fondamental et secondaire",
        cda: "49466",
        article: "1.5.2-10",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.5.2-10" }],
    keywords: [
      "suivi rapproché",
      "contrat d'objectifs",
      "évaluation intermédiaire",
      "mauvaise volonté",
      "incapacité",
    ],
    pivotTriggers: ["suivi rapproché", "évaluation intermédiaire"],
    priority: "important",
    notes:
      "Le pivot existant pointe vers 1.5.2-10 via 'contrat d'objectifs'. OK.",
  },

  {
    id: "b1-ex05",
    section: "Missions et pilotage",
    theme: "Projet d'école",
    level: "D",
    question:
      "Une nouvelle équipe de direction doit rédiger le projet d'école. Que doit-il contenir ? Est-il identique au plan de pilotage ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Le projet d'école définit les priorités éducatives/pédagogiques et actions concrètes pour réaliser les projets éducatif et pédagogique du PO. Il est distinct du plan de pilotage mais doit être cohérent avec celui-ci.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement fondamental et secondaire",
        cda: "49466",
        article: "1.5.1-5",
        paragraph: "1",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.5.1-5" }],
    keywords: [
      "projet d'école",
      "plan de pilotage",
      "priorités éducatives",
      "pédagogiques",
      "pouvoir organisateur",
      "conseil de participation",
    ],
    pivotTriggers: ["projet d'école", "projet école"],
    priority: "important",
  },

  // ─── Structures et encadrement ───

  {
    id: "b1-ex06",
    section: "Structures et encadrement",
    theme: "Centres d'enseignement secondaire (CES)",
    level: "D",
    question:
      "a) Quelle est la définition d'un CES ? b) Que signifie l'organisation par « caractère » ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Un CES est une entité formée par un groupe d'établissements de même caractère, répondant aux besoins d'une zone déterminée. Le « caractère » = appartenance à non confessionnel, confessionnel ou pluraliste.",
    },
    legalReferences: [
      {
        textTitle: "Loi du 29 mai 1959 — Pacte scolaire",
        cda: "5108",
        article: "3",
        paragraph: "2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "5108", article: "3" }],
    keywords: [
      "centre enseignement secondaire",
      "CES",
      "caractère",
      "confessionnel",
      "pluraliste",
      "zone",
    ],
    pivotTriggers: ["CES", "centre enseignement"],
    priority: "nice_to_have",
  },

  {
    id: "b1-ex07",
    section: "Structures et encadrement",
    theme: "Formes et sections d'enseignement",
    level: "D",
    question:
      "Un directeur prépare la présentation des options aux 2e et 3e degrés. Quelles sont les formes et sections ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "4 formes : général, technique, professionnel, artistique. 2 sections : transition (Humanités générales et technologiques), qualification (Humanités professionnelles et techniques).",
    },
    legalReferences: [
      {
        textTitle: "Loi du 19 juillet 1971 — Structure générale de l'enseignement secondaire",
        article: "1",
        paragraph: "2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [],
    keywords: [
      "formes enseignement",
      "sections",
      "général",
      "technique",
      "professionnel",
      "artistique",
      "transition",
      "qualification",
    ],
    pivotTriggers: ["formes enseignement", "sections enseignement"],
    priority: "important",
    notes:
      "VIGILANCE : La Loi du 19 juillet 1971 n'est PAS dans le CDA_REGISTRY. Aucun CDA connu. Les articles de cette loi ne sont probablement pas dans legal_chunks. Le contenu est partiellement couvert par le CDA 10450 (AR 29/06/1984) qui organise le même enseignement.",
  },

  {
    id: "b1-ex08",
    section: "Structures et encadrement",
    theme: "Périodes de 45 minutes",
    level: "P",
    question:
      "Une direction souhaite organiser des périodes de 45 minutes : a) Qui consulter ? b) Quelles finalités ? c) Impact sur l'horaire des professeurs ?",
    questionType: "cas-pratique",
    expectedAnswer: {
      shortAnswer:
        "a) Travail collectif de l'équipe éducative + avis favorable du comité de concertation/commission paritaire/conseil d'entreprise ou délégations syndicales. b) Remédiation, dépassement, développement personnel, orientation, missions prioritaires. c) Charge = nombre de périodes × 50 minutes.",
    },
    legalReferences: [
      {
        textTitle: "Arrêté royal du 29 juin 1984 — Organisation de l'enseignement secondaire",
        cda: "10450",
        article: "1er",
        paragraph: "2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "10450", article: "1er" }],
    keywords: [
      "45 minutes",
      "périodes",
      "90 minutes",
      "remédiation",
      "dépassement",
      "charge hebdomadaire",
      "50 minutes",
    ],
    pivotTriggers: ["45 minutes", "périodes 45", "période cours"],
    priority: "critical",
    notes:
      "DIVERGENCE : Le corrigé cite art. 1er §2. Le pivot existant pointe vers art. 2 (définitions). L'art. 1er contient bien le §2 sur les 45 minutes (vérifié en base : chunk 27825311). Le pivot actuel est INCORRECT pour cette question — il faudrait un pivot vers art. 1er, pas art. 2.",
  },

  {
    id: "b1-ex09",
    section: "Structures et encadrement",
    theme: "Grille Bruxelles — langue moderne",
    level: "D",
    question:
      "Un directeur de Bruxelles-Capitale impose 2 périodes de langue moderne I au D2 général, sans langue moderne II. La grille est-elle conforme ?",
    questionType: "cas-pratique",
    expectedAnswer: {
      shortAnswer:
        "Non. Si le cours de langue moderne I ne comporte que 2 périodes (possible à Bruxelles), l'élève est tenu de suivre aussi un cours de langue moderne II à 4 périodes hebdomadaires.",
    },
    legalReferences: [
      {
        textTitle: "Loi du 19 juillet 1971 — Structure générale de l'enseignement secondaire",
        article: "4bis",
        paragraph: "3",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [],
    keywords: [
      "Bruxelles-Capitale",
      "langue moderne",
      "grille horaire",
      "4 périodes",
      "2 périodes",
    ],
    pivotTriggers: ["langue moderne Bruxelles", "4bis"],
    priority: "important",
    notes:
      "VIGILANCE : Même problème que Ex7 — Loi 19/07/1971 absente du CDA_REGISTRY. Article non indexé. Risque élevé de mauvaise réponse.",
  },

  {
    id: "b1-ex10",
    section: "Structures et encadrement",
    theme: "Tronc commun — grille horaire",
    level: "D",
    question:
      "Combien de périodes peut-on consacrer aux langues anciennes et aux mathématiques dans le tronc commun ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Langues anciennes : 2 périodes en 2e et 3e années. Mathématiques : 5 périodes en 1re année, 4 périodes en 2e et 3e années.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement fondamental et secondaire",
        cda: "49466",
        article: "2.2.2-1",
        paragraph: "1",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "2.2.2-1" }],
    keywords: [
      "tronc commun",
      "grille horaire",
      "langues anciennes",
      "mathématiques",
      "périodes",
      "32 périodes",
    ],
    pivotTriggers: ["tronc commun grille", "grille horaire tronc"],
    priority: "critical",
    notes:
      "ARTICLE ABSENT : l'article 2.2.2-1 du CDA 49466 n'existe PAS dans legal_chunks (0 chunks). C'est un article du Livre 2 (tronc commun) qui n'a probablement pas été indexé. Risque élevé de hallucination.",
  },

  {
    id: "b1-ex11",
    section: "Structures et encadrement",
    theme: "Orientation des études D2",
    level: "P",
    question:
      "Au D2, qu'est-ce qui détermine l'orientation des études dans l'enseignement technique de transition ? (1) Grille complète (2) OBS (3) Intitulé OBG + grille OBG (4) Intitulé OBG au répertoire",
    questionType: "qcm",
    expectedAnswer: { qcmIndex: 4 },
    legalReferences: [
      {
        textTitle: "Arrêté royal du 29 juin 1984 — Organisation de l'enseignement secondaire",
        cda: "10450",
        article: "5",
        paragraph: "3",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "10450", article: "5" }],
    keywords: [
      "orientation études",
      "deuxième degré",
      "D2",
      "technique de transition",
      "option de base groupée",
      "OBG",
      "répertoire",
    ],
    pivotTriggers: [
      "orientation",
      "D2",
      "OBG",
      "technique de transition",
      "répertoire des options",
    ],
    priority: "critical",
    notes:
      "Cas corrigé dans cette session. Article 5 présent en base (chunk 540a6153). Pivots ajoutés. Le piège : l'option 3 ajoute 'la grille de l'OBG' qui n'est PAS un critère de détermination de l'orientation.",
  },

  {
    id: "b1-ex12",
    section: "Structures et encadrement",
    theme: "Répertoire des options — statut R2",
    level: "D",
    question:
      "Une option classée « R2 » au répertoire — qu'est-ce que cela signifie ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Une option R2 est une option strictement réservée dont la création est subordonnée à l'avis favorable du Conseil général de concertation pour l'enseignement secondaire.",
    },
    legalReferences: [
      {
        textTitle: "AGCF du 6 novembre 2018 — Répertoire des options de base",
        cda: "45721",
        article: "5",
        paragraph: "2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "45721", article: "5" }],
    keywords: [
      "R2",
      "répertoire des options",
      "option réservée",
      "Conseil général concertation",
      "programmation",
    ],
    pivotTriggers: ["R2", "répertoire options", "option réservée"],
    priority: "important",
  },

  {
    id: "b1-ex13",
    section: "Structures et encadrement",
    theme: "Immersion linguistique",
    level: "D",
    question:
      "Des parents demandent une filière d'immersion en anglais et néerlandais pour la totalité des cours. Est-ce possible ?",
    questionType: "cas-pratique",
    expectedAnswer: {
      shortAnswer:
        "Non. L'immersion couvre au moins 8 et au plus 13 périodes par langue, ou en cas de 2 langues : 8 à 12 par langue sans dépasser les deux tiers de la grille.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 11 mai 2007 — Immersion linguistique / CLIL",
        cda: "32365",
        article: "12",
        paragraph: "1",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "32365", article: "12" }],
    keywords: [
      "immersion linguistique",
      "anglais",
      "néerlandais",
      "8 périodes",
      "13 périodes",
      "deux tiers",
    ],
    pivotTriggers: ["immersion", "immersion linguistique", "CLIL"],
    priority: "important",
  },

  // ─── Encadrement différencié / DASPA / financement ───

  {
    id: "b1-ex16",
    section: "Encadrement différencié / DASPA",
    theme: "Indice socio-économique",
    level: "P",
    question:
      "Sur base de quels critères le Gouvernement établit-il l'indice socio-économique ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "4 critères : revenu par habitant, niveau des diplômes, taux de chômage / activité / aide sociale, activités professionnelles.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 30 avril 2009 — Encadrement différencié",
        cda: "34295",
        article: "3",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "34295", article: "3" }],
    keywords: [
      "indice socio-économique",
      "ISE",
      "revenu",
      "diplôme",
      "chômage",
      "activités professionnelles",
      "encadrement différencié",
    ],
    pivotTriggers: [
      "indice socio-économique",
      "ISE",
      "encadrement différencié",
    ],
    priority: "important",
    notes: "Cas déjà sécurisé dans la matrice FID existante (id: ise).",
  },

  {
    id: "b1-ex19",
    section: "Encadrement différencié / DASPA",
    theme: "Encadrement différencié — moyens humains",
    level: "D",
    question:
      "Une école en encadrement différencié veut mobiliser les moyens humains pour organiser une étude dirigée. Est-ce possible ?",
    questionType: "cas-pratique",
    expectedAnswer: {
      shortAnswer:
        "Oui. L'art. 10 §1 autorise explicitement l'utilisation des moyens humains complémentaires pour l'étude dirigée, la remédiation, l'apprentissage du français, le soutien, etc.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 30 avril 2009 — Encadrement différencié",
        cda: "34295",
        article: "10",
        paragraph: "1",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "34295", article: "10" }],
    keywords: [
      "encadrement différencié",
      "moyens humains",
      "étude dirigée",
      "remédiation",
      "périodes-professeurs",
    ],
    pivotTriggers: ["encadrement différencié moyens", "étude dirigée"],
    priority: "nice_to_have",
  },

  {
    id: "b1-ex22",
    section: "Encadrement différencié / DASPA",
    theme: "DASPA — encadrement",
    level: "P",
    question:
      "10 élèves primo-arrivants à la rentrée. Quel encadrement pour la classe DASPA ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "11 périodes-professeurs forfaitaires pour les 8 premiers primo-arrivants inscrits au 1er octobre. Complément de 11 périodes par tranche de 12 élèves supplémentaires. Pour 10 élèves : 11 périodes.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 7 février 2019 — DASPA et FLA",
        cda: "46275",
        article: "6",
        paragraph: "3",
        sourceType: "corrige",
      },
      {
        textTitle: "Décret du 7 février 2019 — DASPA et FLA",
        cda: "46275",
        article: "7",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [
      { cda: "46275", article: "6" },
      { cda: "46275", article: "7" },
    ],
    keywords: [
      "DASPA",
      "primo-arrivant",
      "encadrement",
      "11 périodes",
      "périodes-professeurs",
    ],
    pivotTriggers: ["DASPA encadrement", "primo-arrivant périodes"],
    priority: "important",
    notes:
      "Le chunk existant pour art. 6 (CDA 46275) ne contient que le §1 sur le calcul normal. Le §3 avec les 11 périodes forfaitaires pourrait ne pas être dans le même chunk. À vérifier si le contenu est suffisant.",
  },

  {
    id: "b1-ex23",
    section: "Encadrement différencié / DASPA",
    theme: "Subventions — exclusion après 15 janvier",
    level: "P",
    question:
      "Choisissez l'affirmation correcte : (1) Subventions calculées sur inscriptions au 15/01 y compris exclus (2) Exclu de A après 15/01 ne compte pas pour B (3) L'école d'accueil informe l'Administration au plus tard le 15 juillet.",
    questionType: "qcm",
    expectedAnswer: { qcmIndex: 3 },
    legalReferences: [
      {
        textTitle: "Loi du 29 mai 1959 — Pacte scolaire",
        cda: "5108",
        article: "73",
        paragraph: "2bis",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "5108", article: "73" }],
    keywords: [
      "subventions",
      "exclusion",
      "15 janvier",
      "15 juillet",
      "inscription",
      "fonctionnement",
    ],
    pivotTriggers: ["subventions exclusion", "15 janvier"],
    priority: "critical",
    notes:
      "VIGILANCE : Le corrigé mentionne « article 43/73 §2bis » — c'est le piège connu. La bonne référence est art. 73 §2bis (pas art. 43). Le §2bis est présent dans le chunk §2 (639ddc8b). Le prompt contient déjà la concordance 43→73. Cas déjà sécurisé dans la matrice (id: exclusion-15-janv).",
  },

  {
    id: "b1-ex51",
    section: "Encadrement différencié / DASPA",
    theme: "DASPA — conseil d'intégration",
    level: "D",
    question:
      "La direction d'un DASPA doit mettre en place un conseil d'intégration. Qui convoquer ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Chef d'établissement, membres de l'équipe éducative du DASPA, membre du centre PMS, éventuellement représentant du centre d'accueil, et en cas de partenariat : direction et enseignants des établissements partenaires.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 7 février 2019 — DASPA et FLA",
        cda: "46275",
        article: "16",
        paragraph: "2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "46275", article: "16" }],
    keywords: [
      "DASPA",
      "conseil d'intégration",
      "PMS",
      "centre d'accueil",
      "équipe éducative",
    ],
    pivotTriggers: ["conseil intégration", "DASPA intégration"],
    priority: "nice_to_have",
  },
];

// ============================================================
// Bloc 2 — Frais scolaires, obligation scolaire, fréquentation, alternance, inscription
// ============================================================

export const FID_CORRIGE_BLOC2: FidCorrigeCase[] = [
  // ─── Frais scolaires ───

  {
    id: "b2-ex24",
    section: "Frais scolaires",
    theme: "Frais scolaires autorisés",
    level: "P",
    question:
      "Chassez l'intrus : (1) Droits d'accès à la piscine (2) Coût des photocopies sans plafond (3) Frais des séjours pédagogiques avec nuitée",
    questionType: "qcm",
    expectedAnswer: { qcmIndex: 2 },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement fondamental et secondaire",
        cda: "49466",
        article: "1.7.2-2",
        paragraph: "3",
        excerpt:
          "Ne sont pas considérés comme perception d'un minerval : 1° droits d'accès à la piscine ; 2° droits d'accès aux activités culturelles et sportives ; 3° les photocopies, avec montant maximum fixé par le Gouvernement ; 4° le prêt de livres scolaires ; 5° les frais liés aux séjours avec nuitée(s).",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.7.2-2" }],
    keywords: [
      "frais scolaires",
      "minerval",
      "piscine",
      "photocopies",
      "plafond",
      "maximum",
      "séjour",
      "nuitée",
    ],
    pivotTriggers: ["frais scolaires", "minerval", "photocopies"],
    priority: "critical",
    notes:
      "BAD_INDEXING : Le chunk actuel de l'art. 1.7.2-2 ne contient PAS les termes 'piscine' ni 'photocopie'. Le §3 du chunk actuel parle du droit d'inscription spécifique (étudiants étrangers), pas de la liste des frais autorisés. Le contenu FID-critique (§5 dans le texte réel, numéroté §3 dans le corrigé) est tronqué ou absent.",
  },

  {
    id: "b2-ex25",
    section: "Frais scolaires",
    theme: "Abonnements revues",
    level: "D",
    question:
      "Un professeur veut imposer un abonnement à une revue. Quelle réponse de la direction ?",
    questionType: "cas-pratique",
    expectedAnswer: {
      shortAnswer:
        "Les abonnements à des revues peuvent être proposés pour autant que leur caractère facultatif soit explicitement porté à la connaissance des parents.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement fondamental et secondaire",
        cda: "49466",
        article: "1.7.2-2",
        paragraph: "4",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.7.2-2" }],
    keywords: [
      "abonnement",
      "revue",
      "facultatif",
      "frais scolaires",
    ],
    pivotTriggers: ["frais scolaires", "abonnement"],
    priority: "important",
    notes:
      "Même problème d'indexation que Ex24 : le §4 sur les abonnements n'est pas dans le chunk actuel.",
  },

  // ─── Obligation et fréquentation scolaires ───

  {
    id: "b2-ex26",
    section: "Obligation scolaire",
    theme: "Obligation scolaire — travail mineur",
    level: "D",
    question:
      "Un élève de 14 ans et demi veut être engagé comme ouvrier sur chantier. Répond-il aux conditions de l'obligation scolaire ?",
    questionType: "cas-pratique",
    expectedAnswer: {
      shortAnswer:
        "Non. L'obligation scolaire est à temps plein jusqu'à 15 ans et comprend au moins les 2 premières années du secondaire. Il est interdit de faire travailler des mineurs encore soumis à l'obligation scolaire à temps plein.",
    },
    legalReferences: [
      {
        textTitle: "Loi du 29 juin 1983 — Obligation scolaire",
        cda: "9547",
        article: "1er",
        paragraph: "1",
        sourceType: "corrige",
      },
      {
        textTitle: "Loi du 29 juin 1983 — Obligation scolaire",
        cda: "9547",
        article: "10",
        paragraph: "1",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [
      { cda: "9547", article: "1er" },
      { cda: "9547", article: "10" },
    ],
    keywords: [
      "obligation scolaire",
      "temps plein",
      "15 ans",
      "mineur",
      "travail",
      "interdit",
    ],
    pivotTriggers: ["obligation scolaire", "travail mineur"],
    priority: "important",
    notes:
      "Le corrigé cite 'Loi du 26 juin 1983' mais le CDA_REGISTRY dit 'Loi du 29 juin 1983'. La date exacte est le 29 juin 1983. Divergence mineure dans le corrigé.",
  },

  {
    id: "b2-ex27",
    section: "Obligation scolaire",
    theme: "Contrat sportif rémunéré — mineur",
    level: "P",
    question:
      "Un élève de 14 ans se voit proposer un contrat de sportif rémunéré. Que répondre ?",
    questionType: "cas-pratique",
    expectedAnswer: {
      shortAnswer:
        "Impossible. Le contrat de sportif rémunéré ne peut être conclu qu'après accomplissement complet de la scolarité obligatoire à temps plein.",
    },
    legalReferences: [
      {
        textTitle: "Loi du 29 juin 1983 — Obligation scolaire",
        cda: "9547",
        article: "1er",
        paragraph: "1",
        sourceType: "corrige",
      },
      {
        textTitle: "Loi du 29 juin 1983 — Obligation scolaire",
        cda: "9547",
        article: "11",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [
      { cda: "9547", article: "1er" },
      { cda: "9547", article: "11" },
    ],
    keywords: [
      "sportif rémunéré",
      "contrat",
      "14 ans",
      "scolarité obligatoire",
    ],
    pivotTriggers: ["sportif rémunéré", "contrat sportif"],
    priority: "important",
  },

  {
    id: "b2-ex28",
    section: "Fréquentation scolaire",
    theme: "Absences justifiées — compétition",
    level: "P",
    question:
      "Une élève veut participer à un tournoi international de scrabble durant 3 jours. Que répondre ?",
    questionType: "cas-pratique",
    expectedAnswer: {
      shortAnswer:
        "L'absence pour compétition est justifiable uniquement pour les sportifs de haut niveau. Le scrabble n'en fait pas partie. Le directeur peut éventuellement considérer cela comme circonstance exceptionnelle (force majeure).",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement fondamental et secondaire",
        cda: "49466",
        article: "1.7.1-8",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.7.1-8" }],
    keywords: [
      "absence justifiée",
      "compétition",
      "sportif haut niveau",
      "force majeure",
      "circonstances exceptionnelles",
    ],
    pivotTriggers: ["absence justifiée", "absence", "compétition"],
    priority: "important",
    notes: "Cas déjà couvert par le pivot existant 'absence' → 1.7.1-8.",
  },

  {
    id: "b2-ex29",
    section: "Fréquentation scolaire",
    theme: "Registre de fréquentation",
    level: "P",
    question:
      "La direction peut-elle imposer aux enseignants de noter les absences à chaque heure de cours ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Oui. L'art. 1.7.1-9 §4 impose que les informations soient relevées à chaque période de cours dans le secondaire.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement fondamental et secondaire",
        cda: "49466",
        article: "1.7.1-9",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.7.1-9" }],
    keywords: [
      "registre fréquentation",
      "absences",
      "chaque heure",
      "chaque période",
    ],
    pivotTriggers: ["registre", "fréquentation", "absences"],
    priority: "important",
    notes: "Cas déjà sécurisé dans la matrice existante (id: absences-heure).",
  },

  {
    id: "b2-ex30",
    section: "Fréquentation scolaire",
    theme: "Élève libre",
    level: "D",
    question:
      "Des parents apprennent que leur enfant est devenu élève libre. Que leur répondre ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Un élève libre ne satisfait pas à une ou plusieurs exigences réglementaires. Il ne peut prétendre à la sanction des études (pas de certificat, pas d'attestation).",
    },
    legalReferences: [
      {
        textTitle: "Arrêté royal du 29 juin 1984 — Organisation de l'enseignement secondaire",
        cda: "10450",
        article: "2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "10450", article: "2" }],
    keywords: [
      "élève libre",
      "sanction des études",
      "régulièrement inscrit",
    ],
    pivotTriggers: ["élève libre"],
    priority: "critical",
    notes:
      "BAD_INDEXING : La définition 'élève libre' (11° de l'art. 2) n'est PAS dans les chunks actuels. Les chunks couvrent les définitions 1° à 2° puis sautent. Risque élevé de hallucination.",
  },

  // ─── Alternance / CEFA / réinsertion ───

  {
    id: "b2-ex14",
    section: "Alternance / CEFA",
    theme: "Module de Formation Individualisé (MFI)",
    level: "D",
    question:
      "Dans l'enseignement en alternance, que contient un MFI ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Le MFI comprend : élaboration du projet de vie, orientation vers un métier, éducation aux règles de vie en commun, mise à niveau des connaissances de base, acquisition de compétences minimales pour accéder à la formation par le travail.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 3 juillet 1991 — Enseignement en alternance",
        cda: "16421",
        article: "2bis",
        paragraph: "4",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "16421", article: "2bis" }],
    keywords: [
      "MFI",
      "module formation individualisé",
      "projet de vie",
      "mise à niveau",
      "alternance",
    ],
    pivotTriggers: ["MFI", "module formation", "alternance"],
    priority: "important",
    notes:
      "BAD_INDEXING : Le chunk 2bis §4 ne contient PAS le contenu MFI (projet de vie, mise à niveau). Il contient des cross-références au Code. Le contenu réel du MFI est probablement dans un chunk différent ou absent.",
  },

  {
    id: "b2-ex36",
    section: "Alternance / CEFA",
    theme: "Passage plein exercice → alternance",
    level: "P",
    question:
      "Un élève de 15 ans ayant fréquenté une 1D peut-il quitter le plein exercice pour l'alternance ?",
    questionType: "cas-pratique",
    expectedAnswer: {
      shortAnswer:
        "Non. L'obligation scolaire à temps plein comporte au moins les 2 premières années du secondaire. Avoir fréquenté uniquement une 1D ne suffit pas.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement fondamental et secondaire",
        cda: "49466",
        article: "1.7.1-2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.7.1-2" }],
    keywords: [
      "obligation scolaire",
      "temps plein",
      "15 ans",
      "1D",
      "alternance",
      "CEFA",
      "deux premières années",
    ],
    pivotTriggers: ["alternance obligation", "CEFA obligation"],
    priority: "critical",
  },

  {
    id: "b2-ex38",
    section: "Alternance / CEFA",
    theme: "Inscription CEFA après 1D + 2D",
    level: "D",
    question:
      "Magali (15 ans) a suivi 1D + 2D. Peut-elle s'inscrire au CEFA ?",
    questionType: "cas-pratique",
    expectedAnswer: {
      qcmIndex: 3,
      shortAnswer:
        "Oui. Elle a fréquenté les 2 premières années du secondaire et a 15 ans, donc elle satisfait à l'obligation scolaire à temps plein.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement fondamental et secondaire",
        cda: "49466",
        article: "1.7.1-2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.7.1-2" }],
    keywords: [
      "CEFA",
      "15 ans",
      "1D",
      "2D",
      "obligation scolaire",
      "deux premières années",
    ],
    pivotTriggers: ["CEFA inscription", "alternance"],
    priority: "important",
  },

  {
    id: "b2-ex43",
    section: "Alternance / CEFA",
    theme: "Attestation de réinsertion",
    level: "P",
    question:
      "Un élève de l'alternance peut-il rejoindre l'enseignement ordinaire de plein exercice ?",
    questionType: "ouverte",
    expectedAnswer: {
      qcmIndex: 3,
      shortAnswer:
        "Oui, via une attestation de réinsertion délivrée à l'élève ayant fréquenté le CEFA pendant au moins une année scolaire et jugé apte à poursuivre normalement ses études.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 3 juillet 1991 — Enseignement en alternance",
        cda: "16421",
        article: "10",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "16421", article: "10" }],
    keywords: [
      "attestation réinsertion",
      "CEFA",
      "plein exercice",
      "apte",
    ],
    pivotTriggers: ["réinsertion", "CEFA plein exercice"],
    priority: "nice_to_have",
  },

  {
    id: "b2-ex49",
    section: "Alternance / CEFA",
    theme: "Certificats alternance = plein exercice",
    level: "D",
    question:
      "Les certificats de l'alternance produisent-ils les mêmes effets que ceux du plein exercice ?",
    questionType: "qcm",
    expectedAnswer: {
      qcmIndex: 3,
      shortAnswer:
        "L'affirmation est FAUSSE au sens de la question. En réalité, les certificats de l'alternance art. 2bis §1 1° SONT identiques et produisent les mêmes effets de droit.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 3 juillet 1991 — Enseignement en alternance",
        cda: "16421",
        article: "9",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "16421", article: "9" }],
    keywords: [
      "certificats",
      "alternance",
      "plein exercice",
      "mêmes effets",
      "identiques",
    ],
    pivotTriggers: ["certificats alternance", "effets droit alternance"],
    priority: "nice_to_have",
  },

  // ─── Langue / régime linguistique / Voeren ───

  {
    id: "b2-ex15",
    section: "Régime linguistique",
    theme: "Voeren — inscription grands-parents",
    level: "P",
    question:
      "École francophone de Voeren : inscription demandée pour un enfant dont les grands-parents résident dans la commune mais les parents habitent Liège. Possible ?",
    questionType: "cas-pratique",
    expectedAnswer: {
      shortAnswer:
        "Non. L'enseignement peut être donné dans une autre langue que la langue régionale si le chef de famille (parents) réside dans la commune. Le domicile des grands-parents ne suffit pas.",
    },
    legalReferences: [
      {
        textTitle: "Loi du 30 juillet 1963 — Régime linguistique dans l'enseignement",
        cda: "4329",
        article: "6",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "4329", article: "6" }],
    keywords: [
      "Voeren",
      "Fourons",
      "chef de famille",
      "résidence",
      "langue maternelle",
      "commune",
    ],
    pivotTriggers: ["Voeren", "Fourons", "commune facilités"],
    priority: "important",
    notes: "Cas déjà sécurisé dans la matrice existante (id: voeren).",
  },
];

// ============================================================
// Bloc 3 — Admission, 1er degré, orientation, sanction, recours, évaluations
// ============================================================

export const FID_CORRIGE_BLOC3: FidCorrigeCase[] = [
  // ─── Admission / 1er degré / changement / orientation ───

  {
    id: "b3-ex31",
    section: "Admission et 1er degré",
    theme: "Passage spécialisé → ordinaire",
    level: "D",
    question:
      "Des parents veulent faire passer un élève du spécialisé vers l'ordinaire. À quelles conditions administratives ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Demande écrite des parents ou de l'élève majeur + avis motivé de l'organisme de guidance + avis favorable du conseil d'admission de l'école d'accueil.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 3 mars 2004 — Enseignement spécialisé",
        cda: "28737",
        article: "65",
        paragraph: "§1er",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "28737", article: "65" }],
    keywords: ["spécialisé", "ordinaire", "passage", "admission", "guidance"],
    pivotTriggers: ["spécialisé ordinaire", "passage spécialisé"],
    priority: "important",
  },
  {
    id: "b3-ex33",
    section: "Admission et 1er degré",
    theme: "Primo-arrivant — conditions",
    level: "D",
    question:
      "Un enfant syrien arrivé en Belgique en janvier 2024, contactant une école en septembre 2025, peut-il être considéré comme primo-arrivant ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Conditions cumulatives, dont notamment : être arrivé sur le territoire national depuis moins d'un an.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 7 février 2019 — DASPA",
        cda: "46275",
        article: "2",
        paragraph: "1°",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "46275", article: "2" }],
    keywords: ["primo-arrivant", "DASPA", "territoire", "un an", "conditions"],
    pivotTriggers: ["primo-arrivant", "DASPA"],
    priority: "important",
  },
  {
    id: "b3-ex34",
    section: "Admission et 1er degré",
    theme: "Condition d'âge — date limite",
    level: "D",
    question: "Lorsqu'une condition d'admission est liée à l'âge, quelle est la date limite ?",
    questionType: "qcm",
    expectedAnswer: {
      qcmIndex: 2,
      shortAnswer: "L'âge requis doit être atteint au 31 décembre qui suit le début de l'année scolaire.",
    },
    legalReferences: [
      {
        textTitle: "AR du 29 juin 1984 — Organisation secondaire",
        cda: "10450",
        article: "6",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "10450", article: "6" }],
    keywords: ["âge", "admission", "31 décembre", "condition"],
    pivotTriggers: ["condition d'âge", "âge admission"],
    priority: "important",
  },
  {
    id: "b3-ex35",
    section: "Admission et 1er degré",
    theme: "Passage 1D → 1C",
    level: "D",
    question: "Passage de 1D à 1C en novembre 2025 : que vérifier et qui consulter ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Conditions : âge, sixième primaire suivie, avis favorable du Conseil d'admission.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 30 juin 2006 — 1er degré",
        cda: "30998",
        article: "6",
        paragraph: "§2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "30998", article: "6" }],
    keywords: ["1D", "1C", "passage", "admission", "primaire", "conseil"],
    pivotTriggers: ["premier degré", "1D", "1C"],
    priority: "important",
  },
  {
    id: "b3-ex39",
    section: "Admission et 1er degré",
    theme: "Durée maximale 1er degré",
    level: "D",
    question: "Un élève ordinaire peut-il fréquenter le premier degré plus de 3 ans ?",
    questionType: "qcm",
    expectedAnswer: {
      qcmIndex: 3,
      shortAnswer:
        "L'élève ne peut pas fréquenter le premier degré pendant plus de trois années scolaires, sauf dérogation motivée de longue durée.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 30 juin 2006 — 1er degré",
        cda: "30998",
        article: "6ter",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "30998", article: "6ter" }],
    keywords: ["premier degré", "trois ans", "durée", "dérogation"],
    pivotTriggers: ["premier degré", "3 ans", "durée premier degré"],
    priority: "important",
  },
  {
    id: "b3-ex40",
    section: "Admission et 1er degré",
    theme: "2C sans CE1D → orientation",
    level: "D",
    question: "Un élève de 2C sans CE1D doit-il être orienté vers 2S ?",
    questionType: "qcm",
    expectedAnswer: {
      qcmIndex: 1,
      shortAnswer:
        "Le Conseil de Classe l'oriente vers l'année supplémentaire organisée au terme du premier degré (2S).",
    },
    legalReferences: [
      {
        textTitle: "Décret du 30 juin 2006 — 1er degré",
        cda: "30998",
        article: "26",
        paragraph: "§2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "30998", article: "26" }],
    keywords: ["2C", "CE1D", "2S", "orientation", "année supplémentaire"],
    pivotTriggers: ["CE1D", "2S", "année supplémentaire"],
    priority: "critical",
  },
  {
    id: "b3-ex41",
    section: "Admission et 1er degré",
    theme: "2D sans CEB 15 ans — orientation",
    level: "D",
    question: "Un élève termine une 2D sans CEB et a 15 ans. Quelle orientation ?",
    questionType: "qcm",
    expectedAnswer: {
      qcmIndex: 4,
      shortAnswer:
        "Le Conseil de Classe l'oriente vers 2S, 3S-DO, 3P ou alternance selon conditions ; les parents gardent la faculté de choisir entre certaines orientations.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 30 juin 2006 — 1er degré",
        cda: "30998",
        article: "28",
        paragraph: "§2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "30998", article: "28" }],
    keywords: ["2D", "CEB", "15 ans", "orientation", "3P", "alternance"],
    pivotTriggers: ["2D", "orientation premier degré"],
    priority: "critical",
  },
  {
    id: "b3-ex42",
    section: "Admission et 1er degré",
    theme: "2S sans CE1D — formes/sections",
    level: "D",
    question:
      "Un élève termine une 2S sans CE1D. Le Conseil de classe doit-il préciser les formes et sections autorisées ?",
    questionType: "qcm",
    expectedAnswer: {
      qcmIndex: 2,
      shortAnswer: "Oui, le Conseil de Classe définit les formes et sections que l'élève peut fréquenter.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 30 juin 2006 — 1er degré",
        cda: "30998",
        article: "28bis",
        paragraph: "§2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "30998", article: "28bis" }],
    keywords: ["2S", "CE1D", "formes", "sections", "conseil de classe"],
    pivotTriggers: ["28bis", "2S sans CE1D"],
    priority: "important",
  },
  {
    id: "b3-ex44",
    section: "Admission et 1er degré",
    theme: "3TQ → 4G admission",
    level: "D",
    question: "Un élève ayant réussi une 3TQ peut-il s'inscrire en 4G ?",
    questionType: "qcm",
    expectedAnswer: {
      qcmIndex: 2,
      shortAnswer:
        "Admission possible en 4e. Passage d'une forme d'enseignement à une autre soumis à l'avis favorable du Conseil d'admission.",
    },
    legalReferences: [
      {
        textTitle: "AR du 29 juin 1984 — Organisation secondaire",
        cda: "10450",
        article: "12",
        paragraph: "1°, a)",
        sourceType: "corrige",
      },
      {
        textTitle: "AR du 29 juin 1984 — Organisation secondaire",
        cda: "10450",
        article: "19",
        paragraph: "§1er a)",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [
      { cda: "10450", article: "12" },
      { cda: "10450", article: "19" },
    ],
    keywords: ["3TQ", "4G", "admission", "forme", "conseil d'admission"],
    pivotTriggers: ["changement forme", "admission 4e"],
    priority: "important",
  },
  {
    id: "b3-ex45",
    section: "Admission et 1er degré",
    theme: "Changement d'option après 15 novembre",
    level: "P",
    question:
      "Un élève de 5e générale veut changer d'option après le 15 novembre. Est-ce possible ?",
    questionType: "qcm",
    expectedAnswer: {
      qcmIndex: 3,
      shortAnswer:
        "À partir du 16 novembre, le changement est soumis à l'avis favorable du Directeur après avis du Conseil de classe.",
    },
    legalReferences: [
      {
        textTitle: "AR du 29 juin 1984 — Organisation secondaire",
        cda: "10450",
        article: "20",
        paragraph: "§3",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "10450", article: "20" }],
    keywords: ["changement", "option", "15 novembre", "16 novembre", "directeur", "5e"],
    pivotTriggers: ["changement option", "16 novembre"],
    priority: "critical",
  },
  {
    id: "b3-ex50",
    section: "Admission et 1er degré",
    theme: "Changement OBG 5P",
    level: "D",
    question: "Changement d'OBG en 5e professionnelle au 1er trimestre : possible ?",
    questionType: "qcm",
    expectedAnswer: {
      qcmIndex: 3,
      shortAnswer:
        "Même règle : changement possible sous condition après le 16 novembre.",
    },
    legalReferences: [
      {
        textTitle: "AR du 29 juin 1984 — Organisation secondaire",
        cda: "10450",
        article: "20",
        paragraph: "§3",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "10450", article: "20" }],
    keywords: ["changement", "OBG", "5P", "professionnelle", "trimestre"],
    pivotTriggers: ["changement option", "OBG"],
    priority: "important",
  },

  // ─── Sanction des études / recours / évaluation ───

  {
    id: "b3-ex47",
    section: "Sanction et recours",
    theme: "Recours AOB",
    level: "P",
    question:
      "Recours contre une AOB : qu'est-ce qui est problématique au regard des dispositions légales ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Procédure de recours interne (art. 96) puis recours externe possible après épuisement du recours interne, jusqu'au 10e jour ouvrable qui suit le dernier jour de l'année scolaire pour la première session.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 24 juillet 1997 — Missions",
        cda: "21557",
        article: "96",
        sourceType: "corrige",
      },
      {
        textTitle: "Décret du 24 juillet 1997 — Missions",
        cda: "21557",
        article: "98",
        paragraph: "§1er",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [
      { cda: "21557", article: "96" },
      { cda: "21557", article: "98" },
    ],
    keywords: ["recours", "AOB", "interne", "externe", "jour ouvrable", "session"],
    pivotTriggers: ["recours", "AOB", "recours interne"],
    priority: "critical",
  },
  {
    id: "b3-ex52",
    section: "Sanction et recours",
    theme: "Règlement des études — implantations",
    level: "P",
    question:
      "Deux implantations d'un même établissement peuvent-elles avoir des règles d'évaluation différentes et faut-il informer les parents de la communication des résultats ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Un PO peut prévoir un règlement des études distinct pour chaque implantation. Le règlement définit les procédures d'évaluation, de délibération et la communication des décisions.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.5.1-8",
        paragraph: "§1er",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.5.1-8" }],
    keywords: ["règlement", "études", "implantation", "évaluation", "PO"],
    pivotTriggers: ["règlement des études", "implantation"],
    priority: "important",
  },
  {
    id: "b3-ex53",
    section: "Sanction et recours",
    theme: "Direction / inspection — évaluations externes",
    level: "P",
    question:
      "Quelles sont les responsabilités respectives de la direction et de l'inspection dans les évaluations externes ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Le respect des consignes et modalités de passation relève du directeur. Le respect des consignes et modalités de correction relève de chaque inspecteur.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.6.3-10",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.6.3-10" }],
    keywords: ["évaluation externe", "directeur", "inspecteur", "passation", "correction"],
    pivotTriggers: ["évaluation externe", "passation", "correction"],
    priority: "important",
  },
  {
    id: "b3-ex48",
    section: "Sanction et recours",
    theme: "CQ spécialisé forme 3 — stages",
    level: "D",
    question:
      "Le jury de qualification de l'enseignement spécialisé de forme 3 peut-il délivrer le CQ à des élèves n'ayant pas effectué les stages ?",
    questionType: "qcm",
    expectedAnswer: {
      qcmIndex: 2,
      shortAnswer:
        "Il ne peut pas délivrer le CQ aux élèves qui n'ont pas effectué les stages visés et n'en ont pas été dispensés.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 3 mars 2004 — Enseignement spécialisé",
        cda: "28737",
        article: "59",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "28737", article: "59" }],
    keywords: ["qualification", "CQ", "spécialisé", "forme 3", "stages"],
    pivotTriggers: ["qualification spécialisé", "CQ stages"],
    priority: "important",
  },
  {
    id: "b3-ex46",
    section: "Sanction et recours",
    theme: "7P après 6P — conditions",
    level: "D",
    question: "Accès à une 7P après une 6P avec CE6P et CQ6 : à quelles conditions ?",
    questionType: "qcm",
    expectedAnswer: {
      qcmIndex: 4,
      shortAnswer:
        "Admission en 7e professionnelle si correspondance entre le CQ obtenu et la 7e année déterminée, et si l'élève n'est pas titulaire d'un CESS.",
    },
    legalReferences: [
      {
        textTitle: "AR du 29 juin 1984 — Organisation secondaire",
        cda: "10450",
        article: "17",
        paragraph: "§1er, 2°",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "10450", article: "17" }],
    keywords: ["7P", "6P", "CQ", "CESS", "qualification", "septième"],
    pivotTriggers: ["7P", "septième professionnelle"],
    priority: "important",
  },
];

// ============================================================
// Bloc 4 — DAccE, PIA, besoins spécifiques, vivre ensemble, discipline
// ============================================================

export const FID_CORRIGE_BLOC4: FidCorrigeCase[] = [
  // ─── Soutien aux élèves / DAccE / PIA / besoins spécifiques ───

  {
    id: "b4-ex54",
    section: "DAccE / PIA / Besoins spécifiques",
    theme: "DAccE — volets et accès parents",
    level: "P",
    question:
      "Une direction veut présenter le DAccE aux parents. Quels sont ses volets ? Les parents y ont-ils accès ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "5 volets : administratif, parcours scolaire, suivi de l'élève, fréquentation scolaire, procédures. Les parents d'un élève mineur disposent d'un accès au DAccE. L'élève majeur dispose d'un accès à son DAccE.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.10.2-2",
        paragraph: "§2",
        sourceType: "corrige",
      },
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.10.3-1",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [
      { cda: "49466", article: "1.10.2-2" },
      { cda: "49466", article: "1.10.3-1" },
    ],
    keywords: ["DAccE", "volets", "parents", "accès", "dossier"],
    pivotTriggers: ["DAccE", "dossier d'accompagnement"],
    priority: "critical",
  },
  {
    id: "b4-ex56",
    section: "DAccE / PIA / Besoins spécifiques",
    theme: "PIA — intégration permanente totale",
    level: "P",
    question:
      "Qui élabore le PIA d'un élève en intégration permanente totale dans le secondaire ordinaire ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Le PIA est élaboré et ajusté par le ou les membres du personnel du pôle territorial compétent en concertation avec le conseil de classe.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 3 mars 2004 — Enseignement spécialisé",
        cda: "28737",
        article: "132",
        paragraph: "§6",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "28737", article: "132" }],
    keywords: ["PIA", "intégration", "pôle territorial", "concertation", "conseil de classe"],
    pivotTriggers: ["PIA intégration", "pôle territorial"],
    priority: "important",
  },
  {
    id: "b4-ex57",
    section: "DAccE / PIA / Besoins spécifiques",
    theme: "PIA — bases en 2C",
    level: "D",
    question: "Sur quelles bases le Conseil de 2C peut-il établir un PIA ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Le PIA s'appuie sur : 1° observations du Conseil de Classe ; 2° bilan de compétences ou PIA antérieur ; 3° avis PMS ou PSE ; 4° informations transmises par l'école primaire d'origine ; 5° diagnostic d'un service médical ou psycho-médical spécialisé.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 30 juin 2006 — 1er degré",
        cda: "30998",
        article: "7bis",
        paragraph: "§2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "30998", article: "7bis" }],
    keywords: ["PIA", "2C", "observations", "compétences", "primaire", "psycho-médico-social"],
    pivotTriggers: ["PIA", "plan individualisé"],
    priority: "important",
  },
  {
    id: "b4-ex58",
    section: "DAccE / PIA / Besoins spécifiques",
    theme: "Aménagements raisonnables",
    level: "P",
    question:
      "De quels types d'aménagements raisonnables peut bénéficier un élève ? Le rez-de-chaussée peut-il être un AR ? Qui peut demander la mise en place d'un AR ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "AR matériels, organisationnels ou pédagogiques. Demande possible par parents, élève majeur, centre PMS ou membre de l'équipe éducative. Le caractère raisonnable est évalué au regard de l'impact financier, organisationnel, etc.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.7.8-1",
        paragraph: "§1er, §2, §5",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.7.8-1" }],
    keywords: ["aménagement", "raisonnable", "matériel", "organisationnel", "pédagogique", "PMS"],
    pivotTriggers: ["aménagement raisonnable", "besoins spécifiques"],
    priority: "critical",
  },
  {
    id: "b4-ex63",
    section: "DAccE / PIA / Besoins spécifiques",
    theme: "DAccE — faits disciplinaires",
    level: "D",
    question: "Les faits disciplinaires peuvent-ils apparaître dans le DAccE ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Non. Le DAccE ne comprend pas de données relatives aux décisions disciplinaires ni aux résultats d'épreuves sommatives ou certificatives, sauf mention des certificats obtenus.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.10.2-3",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.10.2-3" }],
    keywords: ["DAccE", "disciplinaire", "données", "sommatif", "certificat"],
    pivotTriggers: ["DAccE", "dossier d'accompagnement"],
    priority: "important",
  },
  {
    id: "b4-ex65",
    section: "DAccE / PIA / Besoins spécifiques",
    theme: "PMS / bien-être — rencontre annuelle",
    level: "D",
    question:
      "Une direction reçoit la visite d'un agent PMS qui demande une réunion avec toutes les parties prenantes sur le bien-être. Est-ce fondé légalement ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Oui. Le directeur et l'équipe éducative développent un climat scolaire favorable. Annuellement, le directeur organise une rencontre entre délégués de l'équipe éducative, du centre PMS et du service PSE.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.7.10-3",
        paragraph: "§1er et §4",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.7.10-3" }],
    keywords: ["PMS", "bien-être", "climat scolaire", "rencontre", "promotion de la santé"],
    pivotTriggers: ["bien-être", "PMS", "climat scolaire"],
    priority: "important",
  },

  // ─── Gestion du vivre ensemble / accès / discipline ───

  {
    id: "b4-ex59",
    section: "Vivre ensemble / Discipline",
    theme: "ROI — modification et consultation",
    level: "D",
    question:
      "Qui faut-il consulter pour modifier le ROI sur smartphone et tenue vestimentaire ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Le pouvoir organisateur fixe le ROI. Le conseil de participation débat et remet un avis sur le ROI.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.5.1-9",
        sourceType: "corrige",
      },
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.5.3-1",
        paragraph: "§2, 7°",
        sourceType: "corrige",
        excerpt: "Article absent en base — contenu couvert par 1.5.3-3",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.5.1-9" }],
    keywords: ["ROI", "règlement", "ordre intérieur", "pouvoir organisateur", "conseil de participation"],
    pivotTriggers: ["ROI", "règlement d'ordre intérieur"],
    priority: "important",
    notes: "Art. 1.5.3-1 du corrigé absent en base. Le contenu est partiellement dans 1.5.3-3.",
  },
  {
    id: "b4-ex60",
    section: "Vivre ensemble / Discipline",
    theme: "Accès police à l'école",
    level: "P",
    question:
      "Un policier en uniforme entre dans la cour avec son fils pour identifier un agresseur. Que faire ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Accès des parents selon modalités fixées. Les services de police ont accès s'ils sont munis d'un mandat ou en cas de flagrant crime ou délit.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.5.1-10",
        sourceType: "corrige",
      },
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.5.1-11",
        paragraph: "§1er, 7°",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [
      { cda: "49466", article: "1.5.1-10" },
      { cda: "49466", article: "1.5.1-11" },
    ],
    keywords: ["police", "accès", "mandat", "flagrant", "parents", "école"],
    pivotTriggers: ["police", "accès école"],
    priority: "critical",
  },
  {
    id: "b4-ex61",
    section: "Vivre ensemble / Discipline",
    theme: "Fait grave — complicité personne étrangère",
    level: "P",
    question:
      "Le grand frère d'un élève gifle un professeur. Que peut faire l'école à l'encontre de l'élève et du grand frère ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Lorsqu'une personne étrangère à l'école a commis un fait grave sur l'instigation ou avec la complicité d'un élève, cet élève est considéré comme ayant commis le fait. Exception : pas applicable à l'élève mineur pour un fait commis par ses parents.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.7.9-4",
        paragraph: "§2",
        sourceType: "corrige",
        excerpt: "§2 absent des chunks — BAD_INDEXING",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "1.7.9-4" }],
    keywords: ["complicité", "instigation", "personne étrangère", "exclusion", "fait grave"],
    pivotTriggers: ["exclusion définitive", "fait grave"],
    priority: "critical",
    notes: "BAD_INDEXING : art. 1.7.9-4 §2 (complicité/instigation/personne étrangère) absent des chunks. Seuls §1, §3, §4 indexés.",
  },
  {
    id: "b4-ex62",
    section: "Vivre ensemble / Discipline",
    theme: "Exclusion / écartement / non-réinscription",
    level: "P",
    question:
      "Spray antiseptique au visage d'un autre élève : exclusion définitive ou non-réinscription possible ? Écartement immédiat ? Qui décide ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Faits graves pouvant justifier l'exclusion définitive. Écartement provisoire possible durant 10 jours maximum. Procédure et décision par le PO ou son délégué. Le refus de réinscription est traité comme une exclusion définitive.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.7.9-4",
        paragraph: "§1er",
        sourceType: "corrige",
      },
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.7.9-5",
        sourceType: "corrige",
      },
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.7.9-6",
        sourceType: "corrige",
      },
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "1.7.9-11",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [
      { cda: "49466", article: "1.7.9-4" },
      { cda: "49466", article: "1.7.9-5" },
      { cda: "49466", article: "1.7.9-6" },
      { cda: "49466", article: "1.7.9-11" },
    ],
    keywords: ["exclusion", "écartement", "provisoire", "réinscription", "procédure", "PO"],
    pivotTriggers: ["exclusion définitive", "écartement", "non-réinscription"],
    priority: "critical",
  },
  {
    id: "b4-ex64",
    section: "Vivre ensemble / Discipline",
    theme: "Éducateur — rôle au conseil de classe",
    level: "P",
    question:
      "Lors d'un conseil de classe disciplinaire, l'éducateur est-il simple observateur ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Non. L'éducateur est membre de droit du conseil de classe avec voix consultative lors de la délibération de fin d'année et voix délibérative lors des procédures disciplinaires.",
    },
    legalReferences: [
      {
        textTitle: "AG du 3 juillet 2019 — Éducateur",
        cda: "47114",
        article: "Annexe",
        sourceType: "corrige",
        excerpt: "CDA 47114 vide en base — ARTICLE_MISSING",
      },
    ],
    expectedPivots: [],
    keywords: ["éducateur", "conseil de classe", "voix délibérative", "voix consultative", "disciplinaire"],
    pivotTriggers: ["éducateur"],
    priority: "important",
    notes: "ARTICLE_MISSING : CDA 47114 (AG éducateur) n'a aucun article indexé en base.",
  },
];

// ============================================================
// Combined dataset
// ============================================================

// ============================================================
// Bloc 5 — Personnel, titres, formation, direction, bien-être au travail
// ============================================================

export const FID_CORRIGE_BLOC5: FidCorrigeCase[] = [
  // ─── Du côté des membres du personnel ───

  {
    id: "b5-ex66",
    section: "Personnel — Titres et brevets",
    theme: "Titre requis vs titre suffisant",
    level: "D",
    question:
      "Chassez l'intrus : 1. Le titre requis suppose une compétence disciplinaire sanctionnée par un titre ; 2. Le titre requis inclut éventuellement une expérience utile ; 3. Le titre suffisant inclut une compétence disciplinaire et une compétence pédagogique.",
    questionType: "qcm",
    expectedAnswer: {
      qcmIndex: 3,
      shortAnswer:
        "§3 Titre requis : compétence disciplinaire + compétence pédagogique + éventuellement expérience utile. §4 Titre suffisant : compétence disciplinaire listée comme suffisante + compétence pédagogique + éventuellement expérience utile.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 11 avril 2024 — Titres et brevets",
        article: "16",
        paragraph: "§3 et §4",
        sourceType: "corrige",
        excerpt: "Décret non indexé — CDA absent de la base",
      },
    ],
    expectedPivots: [],
    keywords: ["titre requis", "titre suffisant", "compétence disciplinaire", "compétence pédagogique"],
    pivotTriggers: ["titre requis", "titre suffisant"],
    priority: "important",
    notes: "ARTICLE_MISSING : Décret du 11 avril 2024 non indexé. CDA 40701 contient 'titre requis' mais c'est un autre décret.",
  },
  {
    id: "b5-ex67",
    section: "Personnel — Missions",
    theme: "Référent numérique",
    level: "P",
    question: "Mission de référent numérique : conditions d'accès et procédure ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Formation spécifique requise. Attribution au terme d'un appel à candidatures lorsqu'y sont liées des périodes.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 14 mars 2019 — Organisation du travail",
        cda: "46287",
        article: "9",
        paragraph: "§2 et §3",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "46287", article: "9" }],
    keywords: ["référent", "numérique", "formation", "candidature", "appel"],
    pivotTriggers: ["référent numérique"],
    priority: "important",
  },
  {
    id: "b5-ex68",
    section: "Personnel — Travail collaboratif",
    theme: "Heures de travail collaboratif",
    level: "P",
    question: "Combien d'heures de travail collaboratif pour un enseignant engagé à temps plein ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Secondaire ordinaire = 60 périodes par année scolaire. Secondaire spécialisé = régime différent selon le volume de prestations.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 14 mars 2019 — Organisation du travail",
        cda: "46287",
        article: "15",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "46287", article: "15" }],
    keywords: ["travail collaboratif", "60 périodes", "temps plein", "année scolaire"],
    pivotTriggers: ["travail collaboratif"],
    priority: "important",
  },
  {
    id: "b5-ex69",
    section: "Personnel — Discipline",
    theme: "Recours disciplinaire enseignant",
    level: "D",
    question:
      "Lorsqu'un PO a décidé d'une sanction disciplinaire à l'égard d'un enseignant, auprès de quelle instance introduire un recours ? Qui en est membre ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Les peines disciplinaires sont prononcées en dernière instance par des chambres de recours où les groupements des PO et du personnel sont représentés en nombre égal.",
    },
    legalReferences: [
      {
        textTitle: "Loi du 25 mai 1959 — Pacte scolaire",
        cda: "5108",
        article: "45",
        paragraph: "§9",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "5108", article: "45" }],
    keywords: ["chambre de recours", "disciplinaire", "sanction", "PO", "personnel", "paritaire"],
    pivotTriggers: ["sanction disciplinaire", "chambre de recours"],
    priority: "important",
    notes: "BAD_INDEXING partiel : §9 présent mais le texte sur les 'chambres de recours disciplinaires' n'est pas explicitement dans le contenu indexé (commissions paritaires).",
  },
  {
    id: "b5-ex70",
    section: "Personnel — Congés",
    theme: "Disponibilité maladie — traitement d'attente",
    level: "D",
    question: "Un enseignant en disponibilité pour maladie depuis 15 mois : quel traitement d'attente ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "80% pendant les 12 premiers mois ; 70% pendant les 12 mois suivants ; 60% au-delà de 24 mois.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 5 juillet 2000 — Congés et disponibilités",
        cda: "25174",
        article: "14",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "25174", article: "14" }],
    keywords: ["disponibilité", "maladie", "traitement", "80%", "70%", "60%"],
    pivotTriggers: ["disponibilité maladie", "traitement d'attente"],
    priority: "important",
  },
  {
    id: "b5-ex71",
    section: "Personnel — Transport",
    theme: "Indemnité kilométrique vélo",
    level: "D",
    question: "Indemnité kilométrique vélo : qu'en est-il si la distance domicile-école est inférieure à 1 km ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Droit à une indemnité lorsque la distance à parcourir est d'un kilomètre au moins.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 17 juillet 2003 — Transport",
        cda: "27861",
        article: "7",
        paragraph: "§1er",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "27861", article: "7" }],
    keywords: ["indemnité", "bicyclette", "vélo", "kilomètre", "distance"],
    pivotTriggers: ["indemnité vélo", "bicyclette"],
    priority: "nice_to_have",
  },
  {
    id: "b5-ex72",
    section: "Personnel — Éducateur",
    theme: "Éducateur — éducation à la santé",
    level: "P",
    question:
      "Les éducateurs doivent-ils participer à des actions d'éducation à la santé et superviser le travail donné par les professeurs absents ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "L'éducateur accompagne, anime ou organise des activités d'éducation à la santé et encadre des séquences d'études avec documents fournis par les enseignants.",
    },
    legalReferences: [
      {
        textTitle: "AG du 3 juillet 2019 — Éducateur",
        cda: "47114",
        article: "Annexe",
        sourceType: "corrige",
        excerpt: "CDA 47114 — article_number=null pour les 3 chunks existants",
      },
    ],
    expectedPivots: [],
    keywords: ["éducateur", "santé", "études", "enseignants", "absents"],
    pivotTriggers: ["éducateur"],
    priority: "important",
    notes: "ARTICLE_MISSING : CDA 47114 Annexe non indexée proprement (article_number=null). Même problème que bloc 4.",
  },

  // ─── Contrôle et soutien de l'activité enseignante ───

  {
    id: "b5-ex73",
    section: "Inspection et accompagnement",
    theme: "Conseillers pédagogiques vs inspection",
    level: "P",
    question:
      "Une direction veut solliciter les conseillers pédagogiques pour contrôler l'aptitude pédagogique d'un enseignant. Est-ce pertinent ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Non. Les CSA accompagnent ou supervisent des groupes d'enseignants. L'appréciation de l'aptitude pédagogique ou professionnelle relève des Services de l'Inspection.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 28 mars 2019 — CSA",
        article: "4",
        paragraph: "12°",
        sourceType: "corrige",
        excerpt: "CDA du décret CSA non identifié en base",
      },
      {
        textTitle: "Décret du 10 janvier 2019 — Inspection",
        cda: "46239",
        article: "4/1",
        paragraph: "§4",
        sourceType: "corrige",
        excerpt: "Missions portant sur l'appréciation de l'aptitude pédagogique ou professionnelle d'un membre du personnel",
      },
    ],
    expectedPivots: [{ cda: "47237", article: "4" }, { cda: "46239", article: "4/1" }],
    keywords: ["conseiller pédagogique", "aptitude", "inspection", "CSA"],
    pivotTriggers: ["inspection", "aptitude pédagogique"],
    priority: "important",
    notes: "Art. 4/1 est dans CDA 46239 (pas 47237). §4 traite de l'aptitude pédagogique.",
  },
  {
    id: "b5-ex74",
    section: "Inspection et accompagnement",
    theme: "Inspection — manquement substantiel",
    level: "P",
    question:
      "Quels aspects peuvent être contrôlés lors d'une visite d'inspection fondée sur une présomption de manquement substantiel ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Contrôle du respect des articles du Code et du décret Missions, du niveau des études, des programmes, de la cohérence des pratiques d'évaluation, de la gratuité, de la neutralité, de la formation professionnelle continue, etc.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 10 janvier 2019 — Inspection",
        cda: "47237",
        article: "4",
        paragraph: "§3",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "47237", article: "4" }],
    keywords: ["inspection", "manquement", "programme", "niveau", "études", "gratuité"],
    pivotTriggers: ["manquement", "inspection"],
    priority: "important",
  },
  {
    id: "b5-ex75",
    section: "Inspection et accompagnement",
    theme: "Formation — journées pédagogiques obligatoires",
    level: "P",
    question:
      "Un enseignant peut-il préférer des formations personnelles aux journées pédagogiques obligatoires ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Les formations répondant à des besoins collectifs sont obligatoires ; celles répondant à des besoins personnalisés sont facultatives.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "6.1.3-2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "6.1.3-2" }],
    keywords: ["formation", "collectif", "obligatoire", "personnalisé", "facultatif"],
    pivotTriggers: ["formation collective", "journée pédagogique"],
    priority: "important",
  },
  {
    id: "b5-ex76",
    section: "Inspection et accompagnement",
    theme: "Formation — jours disponibles sur cycle",
    level: "P",
    question:
      "Combien de jours restent disponibles sur 3 ans si 12 jours ont déjà été utilisés sur un cycle de 6 ans ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "La formation collective comprend six demi-jours par année scolaire, capitalisables sur six années. Répartition : un tiers interréseaux, deux tiers réseau.",
    },
    legalReferences: [
      {
        textTitle: "Code de l'enseignement",
        cda: "49466",
        article: "6.1.3-8",
        paragraph: "§1er et §3",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "49466", article: "6.1.3-8" }],
    keywords: ["demi-jour", "six", "capitalisable", "interréseaux", "réseau"],
    pivotTriggers: ["formation collective", "demi-jours"],
    priority: "nice_to_have",
  },

  // ─── Du côté des directions ───

  {
    id: "b5-ex77",
    section: "Direction",
    theme: "Lettre de mission — modification",
    level: "D",
    question: "Une lettre de mission de direction stagiaire peut-elle être modifiée après quelques mois ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "La lettre de mission dure six ans. Pour les directeurs stagiaires, son contenu peut être modifié au plus tôt après six mois. Elle peut aussi être modifiée avant échéance de commun accord.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 2 février 2007 — Statut des directeurs",
        cda: "31886",
        article: "27",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "31886", article: "27" }],
    keywords: ["lettre de mission", "six ans", "modification", "stagiaire", "six mois"],
    pivotTriggers: ["lettre de mission"],
    priority: "important",
  },
  {
    id: "b5-ex78",
    section: "Direction",
    theme: "Accompagnement stagiaire — durée et conditions",
    level: "P",
    question:
      "Une direction stagiaire n'a suivi que 15h d'accompagnement sur 2 ans, assurées par un membre du PO. Est-ce problématique ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Oui. La formation/accompagnement d'intégration est obligatoire, d'une durée de 30 heures, assurée sans lien hiérarchique, et déployée autant que possible sur les trois années suivant l'entrée en fonction.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 2 février 2007 — Statut des directeurs",
        cda: "31886",
        article: "11",
        paragraph: "§4",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "31886", article: "11" }],
    keywords: ["accompagnement", "intégration", "30 heures", "hiérarchique", "trois années"],
    pivotTriggers: ["accompagnement direction", "formation intégration"],
    priority: "important",
  },
  {
    id: "b5-ex79",
    section: "Direction",
    theme: "Responsabilités du directeur",
    level: "D",
    question: "Quels sont les registres de responsabilité de la fonction de directeur ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "7 catégories : production de sens, pilotage stratégique et opérationnel, pilotage pédagogique, GRH, communication, gestion administrative/financière/matérielle, développement professionnel.",
    },
    legalReferences: [
      {
        textTitle: "Décret du 2 février 2007 — Statut des directeurs",
        cda: "31886",
        article: "5",
        paragraph: "§1er",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "31886", article: "5" }],
    keywords: ["responsabilité", "pilotage", "pédagogique", "communication", "développement professionnel"],
    pivotTriggers: ["profil de fonction", "responsabilités direction"],
    priority: "important",
  },

  // ─── Bien-être au travail ───

  {
    id: "b5-ex80",
    section: "Bien-être au travail",
    theme: "Harcèlement moral — interlocuteurs",
    level: "D",
    question:
      "Un membre du personnel estimant subir du harcèlement moral peut-il s'adresser à quelles personnes ou instances ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "Conseiller en prévention ou personne de confiance pour une intervention psychosociale informelle, ou conseiller en prévention pour une intervention formelle. Également le fonctionnaire chargé de la surveillance.",
    },
    legalReferences: [
      {
        textTitle: "Loi du 4 août 1996 — Bien-être au travail",
        cda: "45031",
        article: "32nonies",
        sourceType: "corrige",
        excerpt: "ARTICLE_MISSING — art. 32nonies absent de la base",
      },
    ],
    expectedPivots: [],
    keywords: ["harcèlement", "moral", "conseiller en prévention", "personne de confiance", "psychosocial"],
    pivotTriggers: ["harcèlement", "bien-être au travail"],
    priority: "critical",
    notes: "ARTICLE_MISSING : 45031:32nonies absent. Seuls art. 32 et 32sexies indexés dans CDA 45031.",
  },
  {
    id: "b5-ex81",
    section: "Bien-être au travail",
    theme: "Personne de confiance — incompatibilités",
    level: "P",
    question:
      "Trois candidats à la fonction de personne de confiance : direction adjointe, professeur d'éducation physique, délégué syndical. Leurs candidatures sont-elles recevables ?",
    questionType: "ouverte",
    expectedAnswer: {
      shortAnswer:
        "La personne de confiance ne peut être ni délégué de l'employeur, ni délégué du personnel au conseil d'entreprise ou au CPPT, ni faire partie de la délégation syndicale.",
    },
    legalReferences: [
      {
        textTitle: "Loi du 4 août 1996 — Bien-être au travail",
        cda: "45031",
        article: "32sexies",
        paragraph: "§2",
        sourceType: "corrige",
      },
    ],
    expectedPivots: [{ cda: "45031", article: "32sexies" }],
    keywords: ["personne de confiance", "délégué syndical", "CPPT", "incompatibilité"],
    pivotTriggers: ["personne de confiance"],
    priority: "important",
  },
];

// ============================================================
// Combined dataset
// ============================================================

export const FID_CORRIGE_ALL = [...FID_CORRIGE_BLOC1, ...FID_CORRIGE_BLOC2, ...FID_CORRIGE_BLOC3, ...FID_CORRIGE_BLOC4, ...FID_CORRIGE_BLOC5];

// ============================================================
// Summary helpers
// ============================================================

function getBlocSummary(cases: FidCorrigeCase[]) {
  const total = cases.length;
  const critical = cases.filter((c) => c.priority === "critical").length;
  const important = cases.filter((c) => c.priority === "important").length;
  const qcm = cases.filter((c) => c.questionType === "qcm").length;
  const allPivots = cases.flatMap((c) => c.expectedPivots);
  const uniqueArticles = new Set(allPivots.map((p) => `${p.cda}:${p.article}`));
  return { total, critical, important, qcm, uniqueArticles: uniqueArticles.size };
}

export function getBloc1Summary() {
  return getBlocSummary(FID_CORRIGE_BLOC1);
}

export function getBloc2Summary() {
  return getBlocSummary(FID_CORRIGE_BLOC2);
}

export function getBloc3Summary() {
  return getBlocSummary(FID_CORRIGE_BLOC3);
}

export function getBloc4Summary() {
  return getBlocSummary(FID_CORRIGE_BLOC4);
}

export function getBloc5Summary() {
  return getBlocSummary(FID_CORRIGE_BLOC5);
}

export function getAllSummary() {
  return getBlocSummary(FID_CORRIGE_ALL);
}
