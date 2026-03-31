import { type UserPreferences } from "@/types";

/** Regex pour détecter les [PLACEHOLDERS] en majuscules dans le texte */
const PLACEHOLDER_REGEX = /\[([A-ZÀÉÈÊËÏÎÔÙÛÜÇ][A-ZÀÉÈÊËÏÎÔÙÛÜÇ\s''\/\-\.0-9]{1,})\]/g;

/** Map des placeholders connus vers les champs de préférences */
const AUTO_FILL_MAP: Record<string, (p: UserPreferences) => string | null> = {
  "NOM DE L'ÉCOLE": (p) => p.school_name,
  "NOM DE L'ETABLISSEMENT": (p) => p.school_name,
  "NOM DE L'ÉTABLISSEMENT": (p) => p.school_name,
  "ÉCOLE": (p) => p.school_name,
  "ADRESSE": (p) => p.school_address,
  "ADRESSE DE L'ÉCOLE": (p) => p.school_address,
  "TÉLÉPHONE": (p) => p.school_phone,
  "EMAIL": (p) => p.school_email,
  "NOM DU DIRECTEUR": (p) =>
    p.first_name && p.last_name ? `${p.first_name} ${p.last_name}` : null,
  "NOM DE LA DIRECTRICE": (p) =>
    p.first_name && p.last_name ? `${p.first_name} ${p.last_name}` : null,
  "NOM DU/DE LA DIRECTEUR/DIRECTRICE": (p) =>
    p.first_name && p.last_name ? `${p.first_name} ${p.last_name}` : null,
  "PRÉNOM NOM": (p) =>
    p.first_name && p.last_name ? `${p.first_name} ${p.last_name}` : null,
  "FONCTION": (p) => p.job_title,
  "DATE": () => new Date().toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" }),
  "LIEU ET DATE": (p) => {
    const date = new Date().toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" });
    // Essayer d'extraire la ville de l'adresse
    const city = p.school_address?.split(",").pop()?.replace(/\d/g, "").trim();
    return city ? `${city}, le ${date}` : date;
  },
};

/**
 * Extrait la liste unique de noms de placeholders dans un texte.
 */
export function extractPlaceholders(text: string): string[] {
  const matches = new Set<string>();
  let match;
  while ((match = PLACEHOLDER_REGEX.exec(text)) !== null) {
    matches.add(match[1].trim());
  }
  return Array.from(matches);
}

/**
 * Remplace automatiquement les placeholders connus depuis les préférences.
 * Retourne le texte modifié et la liste des placeholders restants.
 */
export function autoFillPlaceholders(
  text: string,
  prefs: UserPreferences | null
): { text: string; remaining: string[] } {
  if (!prefs) return { text, remaining: extractPlaceholders(text) };

  let result = text;
  const filled = new Set<string>();

  for (const [key, getter] of Object.entries(AUTO_FILL_MAP)) {
    const value = getter(prefs);
    if (value) {
      const regex = new RegExp(`\\[${escapeRegex(key)}\\]`, "gi");
      if (regex.test(result)) {
        result = result.replace(regex, value);
        filled.add(key);
      }
    }
  }

  const remaining = extractPlaceholders(result);
  return { text: result, remaining };
}

/**
 * Remplace un placeholder spécifique par une valeur.
 */
export function replacePlaceholder(
  text: string,
  placeholder: string,
  value: string
): string {
  const regex = new RegExp(`\\[${escapeRegex(placeholder)}\\]`, "gi");
  return text.replace(regex, value);
}

/**
 * Met en surbrillance les placeholders non remplis (pour l'aperçu HTML).
 */
export function highlightPlaceholders(text: string): string {
  return text.replace(
    PLACEHOLDER_REGEX,
    '<mark class="rounded bg-amber-100 px-1 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">[$1]</mark>'
  );
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
