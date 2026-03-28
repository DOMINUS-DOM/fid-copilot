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

export type DocumentType = "texte_legal" | "synthese" | "guide" | "portfolio";

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  type: DocumentType;
  cda_code: string | null;
  is_core: boolean;
  summary: string | null;
  source_url: string | null;
  created_at: string;
}

// Source renvoyée par l'API assistant
export interface AssistantSource {
  title: string;
  cda_code: string | null;
  category: DocumentCategory;
  source_url: string | null;
}

// Niveau de confiance de la réponse
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
// Assistant Logs
// ============================================================

export interface AssistantLog {
  id: string;
  user_id: string;
  question: string;
  created_at: string;
}

// Labels lisibles pour l'UI
export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  incontournable_commun: "Incontournable commun",
  incontournable_secondaire_specialise: "Incontournable secondaire spécialisé",
  synthese: "Synthèse",
  organisation: "Organisation",
  fonction_direction: "Fonction de direction",
  portfolio: "Portfolio",
};
