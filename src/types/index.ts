// ============================================================
// Users
// ============================================================

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  created_at: string;
}

// ============================================================
// Documents
// ============================================================

export type DocumentCategory =
  | "incontournable_commun"
  | "incontournable_secondaire_specialise"
  | "synthese"
  | "organisation"
  | "fonction_direction"
  | "portfolio";

export type DocumentType =
  | "texte_legal"
  | "synthese"
  | "guide"
  | "portfolio"
  | "methodologie"
  | "organisation";

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  type: DocumentType;
  cda_code: string | null;
  is_core: boolean;
  summary: string | null;
  source_url: string | null;
  tags: string[] | null;
  created_at: string;
}

/** Labels lisibles pour DocumentType */
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  texte_legal: "Texte légal",
  synthese: "Synthèse",
  guide: "Guide pratique",
  portfolio: "Portfolio",
  methodologie: "Méthodologie",
  organisation: "Organisation FID",
};

// ============================================================
// Assistant
// ============================================================

/** Mode de réponse de l'assistant */
export type AssistantMode = "examen" | "terrain" | "portfolio";

/** Action portfolio */
export type PortfolioAction = "structurer" | "ameliorer" | "challenger";

export const PORTFOLIO_ACTION_CONFIG: Record<
  PortfolioAction,
  { label: string; description: string }
> = {
  structurer: {
    label: "Structurer ma réflexion",
    description: "Organiser les idées en plan clair",
  },
  ameliorer: {
    label: "Améliorer mon texte",
    description: "Clarifier et renforcer sans changer le fond",
  },
  challenger: {
    label: "Me challenger",
    description: "Questions réflexives pour approfondir",
  },
};

/** Contexte de travail portfolio */
export type PortfolioContext =
  | "posture"
  | "module"
  | "situation"
  | "autoevaluation"
  | "ecrit";

export const PORTFOLIO_CONTEXT_CONFIG: Record<
  PortfolioContext,
  { label: string; short: string }
> = {
  posture: {
    label: "Réflexion sur ma posture",
    short: "Posture",
  },
  module: {
    label: "Retour sur un module",
    short: "Module",
  },
  situation: {
    label: "Analyse d'une situation vécue",
    short: "Situation",
  },
  autoevaluation: {
    label: "Autoévaluation",
    short: "Autoéval.",
  },
  ecrit: {
    label: "Préparation d'un écrit portfolio",
    short: "Écrit",
  },
};

export const ASSISTANT_MODE_CONFIG: Record<
  AssistantMode,
  { label: string; description: string; icon: string }
> = {
  examen: {
    label: "Examen",
    description: "Justification juridique précise, format évaluation certificative",
    icon: "graduation",
  },
  terrain: {
    label: "Terrain",
    description: "Actions concrètes, erreurs à éviter, phrase prête à dire",
    icon: "briefcase",
  },
  portfolio: {
    label: "Portfolio",
    description: "Structuration réflexive, sans écrire à votre place",
    icon: "notebook",
  },
};

/** Chunk de texte légal extrait d'un PDF */
export interface LegalChunk {
  id: string;
  cda_code: string;
  chunk_index: number;
  chunk_title: string;
  content: string;
  tags: string[] | null;
}

/** Source renvoyée par l'API assistant */
export interface AssistantSource {
  title: string;
  cda_code: string | null;
  category: DocumentCategory;
  source_url: string | null;
}

/** Suggestion Gallilex pour vérification */
export interface GallilexHint {
  text: string;
  cda_code: string | null;
  keywords: string[];
}

/** Niveau de confiance de la réponse */
export type ConfidenceLevel = "high" | "medium" | "low";

export const CONFIDENCE_CONFIG: Record<
  ConfidenceLevel,
  { label: string; color: string; bg: string }
> = {
  high: {
    label: "Élevée",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  medium: {
    label: "Moyenne",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
  },
  low: {
    label: "Faible",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/20",
  },
};

// ============================================================
// School Documents (documents d'école uploadés par l'utilisateur)
// ============================================================

export type SchoolDocType =
  | "roi"
  | "reglement_etudes"
  | "projet_etablissement"
  | "plan_pilotage"
  | "note_interne"
  | "autre";

export const SCHOOL_DOC_TYPE_LABELS: Record<SchoolDocType, string> = {
  roi: "ROI",
  reglement_etudes: "Règlement des études",
  projet_etablissement: "Projet d'établissement",
  plan_pilotage: "Plan de pilotage",
  note_interne: "Note interne",
  autre: "Autre document",
};

export interface SchoolDocument {
  id: string;
  user_id: string;
  title: string;
  doc_type: SchoolDocType;
  file_path: string;
  file_size: number;
  page_count: number | null;
  chunk_count: number;
  created_at: string;
}

export interface SchoolChunk {
  id: string;
  school_doc_id: string;
  user_id: string;
  chunk_index: number;
  chunk_title: string | null;
  content: string;
}

// ============================================================
// Assistant Logs
// ============================================================

export interface AssistantLog {
  id: string;
  user_id: string;
  question: string;
  created_at: string;
}

// ============================================================
// Labels lisibles pour l'UI
// ============================================================

export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  incontournable_commun: "Incontournable commun",
  incontournable_secondaire_specialise: "Incontournable secondaire spécialisé",
  synthese: "Synthèse",
  organisation: "Organisation",
  fonction_direction: "Fonction de direction",
  portfolio: "Portfolio",
};
