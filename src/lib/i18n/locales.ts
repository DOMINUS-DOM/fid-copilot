export const LOCALES = ["fr", "en", "it", "es", "el"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_LABELS: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  it: "Italiano",
  es: "Español",
  el: "Ελληνικά",
};

export function isValidLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

// ============================================================
// Message types
// ============================================================

export interface ModuleItem {
  title: string;
  description: string;
  tag: string;
}

export interface TrustPoint {
  title: string;
  description: string;
}

export interface Messages {
  header: {
    guide: string;
    pricing: string;
    vision: string;
    login: string;
    signup: string;
    openApp: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    cta: string;
    ctaAuth: string;
    ctaSecondary: string;
    trustLine: string;
    betaMessage: string;
    pills: string[];
  };
  features: {
    label: string;
    title: string;
    subtitle: string;
    modules: ModuleItem[];
  };
  trust: {
    label: string;
    title: string;
    points: TrustPoint[];
  };
  cta: {
    badge: string;
    title: string;
    subtitle: string;
    button: string;
    note: string;
  };
  footer: {
    tagline: string;
    federation: string;
    navTitle: string;
    contactTitle: string;
  };
  pricing: {
    badge: string;
    title: string;
    subtitle: string;
    betaNoticeTitle: string;
    betaNoticeText: string;
    freeTitle: string;
    freeSubtitle: string;
    freePrice: string;
    freePeriod: string;
    freeCta: string;
    freeCtaAuth: string;
    freeNote: string;
    proTitle: string;
    proSubtitle: string;
    proBadge: string;
    proPrice: string;
    proCta: string;
    proNote: string;
    faqTitle: string;
    freeFeatures: string[];
    proFeatures: string[];
    faqs: { q: string; a: string }[];
  };
  guide: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    stepsTitle: string;
    steps: { title: string; desc: string }[];
    modulesTitle: string;
    modulesSubtitle: string;
    modules: { title: string; desc: string }[];
    betaTitle: string;
    betaText: string;
    feedbackCta: string;
  };
  europe: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    visionLines: string[];
    heroCta: string;
    heroCtaSecondary: string;
    problemLabel: string;
    problemTitle: string;
    challenges: { title: string; desc: string }[];
    consequences: string[];
    solutionLabel: string;
    solutionTitle: string;
    solutionModules: string[];
    solutionFlow: string[];
    solutionPhrase: string;
    innovationLabel: string;
    innovationTitle: string;
    genericLabel: string;
    copilotLabel: string;
    comparisons: { generic: string; copilot: string }[];
    alignmentLabel: string;
    alignmentTitle: string;
    pillars: { title: string; desc: string }[];
    alignmentPhrase: string;
    impactLabel: string;
    impactTitle: string;
    impacts: { value: number; suffix: string; prefix: string; label: string }[];
    useCasesLabel: string;
    useCasesTitle: string;
    useCases: { title: string; desc: string }[];
    useCasesPhrase: string;
    deployLabel: string;
    deployTitle: string;
    deployCountries: { country: string; status: string; statusLabel: string }[];
    deployPhrase: string;
    visionLabel: string;
    visionTitle: string;
    visionText: string;
    visionCta: string;
    visionCtaSecondary: string;
  };
}

// ============================================================
// Loader
// ============================================================

export async function getMessages(locale: Locale): Promise<Messages> {
  switch (locale) {
    case "fr": return (await import("./messages/fr")).default;
    case "en": return (await import("./messages/en")).default;
    case "it": return (await import("./messages/it")).default;
    case "es": return (await import("./messages/es")).default;
    case "el": return (await import("./messages/el")).default;
    default: return (await import("./messages/fr")).default;
  }
}
