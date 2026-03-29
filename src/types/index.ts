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
// User Preferences (Paramètres)
// ============================================================

export interface UserPreferences {
  id: string;
  user_id: string;
  // Profil
  first_name: string | null;
  last_name: string | null;
  job_title: string | null;
  school_name: string | null;
  school_network: string | null;
  school_level: string | null;
  // Préférences IA
  default_tone: string;
  default_mode: string;
  default_length: string;
  // Génération
  signature: string | null;
  closing_formula: string | null;
  // Apparence
  theme: string;
  updated_at: string;
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
  source_title: string | null;
  source_short_title: string | null;
  article_number: string | null;
  paragraph: string | null;
  citation_display: string | null;
  topics: string[] | null;
  education_level: string | null;
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
// Document Generator
// ============================================================

export type DocGenCategory = "parents" | "discipline" | "interne" | "formel";
export type DocGenTone = "neutre" | "ferme" | "apaisant" | "formel";
export type DocGenFormat = "email" | "courrier" | "note";

export const DOC_GEN_CATEGORY_LABELS: Record<DocGenCategory, string> = {
  parents: "Parents",
  discipline: "Discipline / Élèves",
  interne: "Interne école",
  formel: "Administration / Formel",
};

export const DOC_GEN_TEMPLATES: Record<string, { label: string; category: DocGenCategory; description: string }> = {
  convocation_parent: { label: "Convocation parent", category: "parents", description: "Inviter un parent à un entretien." },
  reponse_contestation: { label: "Réponse à contestation", category: "parents", description: "Répondre à un parent qui conteste une décision." },
  courrier_incident: { label: "Suite à incident", category: "parents", description: "Informer les parents d'un incident." },
  rappel_cadre: { label: "Rappel de cadre", category: "parents", description: "Rappeler une règle ou une procédure." },
  notification_discipline: { label: "Notification disciplinaire", category: "discipline", description: "Notifier une sanction ou mesure." },
  convocation_discipline: { label: "Convocation disciplinaire", category: "discipline", description: "Convoquer dans un cadre disciplinaire." },
  note_interne: { label: "Note interne", category: "interne", description: "Communiquer une information à l'équipe." },
  mail_enseignant: { label: "Email à un enseignant", category: "interne", description: "Écrire à un membre du personnel." },
  reponse_recours: { label: "Réponse à recours", category: "formel", description: "Répondre formellement à un recours." },
  resume_decision: { label: "Résumé de décision", category: "formel", description: "Résumer une décision pour transmission." },
};

export const DOC_GEN_TONE_LABELS: Record<DocGenTone, string> = {
  neutre: "Neutre",
  ferme: "Ferme",
  apaisant: "Apaisant",
  formel: "Formel",
};

export const DOC_GEN_FORMAT_LABELS: Record<DocGenFormat, string> = {
  email: "Email",
  courrier: "Courrier structuré",
  note: "Note interne",
};

// ============================================================
// Verification
// ============================================================

export type VerifyType = "document" | "courrier" | "decision" | "formulation";
export type VerifyDepth = "rapide" | "standard" | "approfondi";

export const VERIFY_TYPE_CONFIG: Record<VerifyType, { label: string; description: string; placeholder: string }> = {
  document: {
    label: "Document interne",
    description: "ROI, règlement, procédure, note",
    placeholder: "Collez ici un extrait de votre ROI, règlement des études ou procédure interne...",
  },
  courrier: {
    label: "Courrier / Réponse",
    description: "Courrier parent, réponse, mail",
    placeholder: "Collez ici le courrier, email ou la réponse que vous souhaitez vérifier...",
  },
  decision: {
    label: "Décision",
    description: "Exclusion, refus, mesure disciplinaire",
    placeholder: "Décrivez la décision que vous envisagez de prendre...",
  },
  formulation: {
    label: "Formulation",
    description: "Phrase, ton, tournure à vérifier",
    placeholder: "Collez la phrase ou la formulation que vous souhaitez faire vérifier...",
  },
};

export const VERIFY_DEPTH_CONFIG: Record<VerifyDepth, { label: string; description: string }> = {
  rapide: { label: "Rapide", description: "Diagnostic en quelques lignes" },
  standard: { label: "Standard", description: "Analyse détaillée" },
  approfondi: { label: "Approfondi", description: "Analyse complète avec recommandations" },
};

// ============================================================
// Decision Engine
// ============================================================

// ============================================================
// Saved Templates (Équipe / Partage)
// ============================================================

export type TemplateSource = "assistant" | "decision" | "generateur" | "verification" | "manuel";
export type TemplateCategory = "courrier" | "reponse" | "convocation" | "note" | "procedure" | "formulation" | "autre";

export const TEMPLATE_SOURCE_LABELS: Record<TemplateSource, string> = {
  assistant: "Assistant",
  decision: "Décision",
  generateur: "Générateur",
  verification: "Vérification",
  manuel: "Manuel",
};

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  courrier: "Courrier",
  reponse: "Réponse",
  convocation: "Convocation",
  note: "Note interne",
  procedure: "Procédure",
  formulation: "Formulation",
  autre: "Autre",
};

export interface SavedTemplate {
  id: string;
  user_id: string;
  title: string;
  content: string;
  source: TemplateSource;
  category: TemplateCategory;
  tags: string[] | null;
  created_at: string;
}

export type DecisionCategory =
  | "recours"
  | "discipline"
  | "personnel"
  | "inspection"
  | "parents"
  | "autre";

export type DecisionUrgency = "immediat" | "semaine" | "planifier";
export type DecisionStatus = "open" | "in_progress" | "resolved";

export const DECISION_CATEGORY_LABELS: Record<DecisionCategory, string> = {
  recours: "Recours / Contestation",
  discipline: "Discipline / Exclusion",
  personnel: "Personnel / GRH",
  inspection: "Inspection / Pilotage",
  parents: "Relations parents",
  autre: "Autre situation",
};

export const DECISION_URGENCY_LABELS: Record<DecisionUrgency, { label: string; icon: string }> = {
  immediat: { label: "Immédiat", icon: "⏰" },
  semaine: { label: "Cette semaine", icon: "📅" },
  planifier: { label: "À planifier", icon: "📋" },
};

export interface Decision {
  id: string;
  user_id: string;
  title: string;
  situation: string;
  category: DecisionCategory | null;
  urgency: DecisionUrgency | null;
  analysis: string;
  status: DecisionStatus;
  resolved_at: string | null;
  created_at: string;
}

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
