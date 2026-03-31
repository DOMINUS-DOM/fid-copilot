import { type DocGenTone, type DocGenFormat } from "@/types";

/**
 * Prompt pour le générateur de documents professionnels.
 * Produit des documents directement exploitables par un directeur d'école.
 */

export function buildGenerateSystemPrompt(): string {
  return `Tu es un rédacteur professionnel spécialisé dans la communication scolaire en Fédération Wallonie-Bruxelles.

Tu rédiges des documents pour des directeurs d'école : courriers, emails, notes internes, convocations, réponses formelles.

RÈGLES ABSOLUES :

1. CRÉDIBILITÉ — Le document doit pouvoir être envoyé tel quel. Ton professionnel, sobre, précis.
2. PRUDENCE JURIDIQUE — Ne cite JAMAIS un article de loi que tu ne connais pas avec certitude. Si tu mentionnes un cadre légal, reste général : "conformément au règlement d'ordre intérieur", "dans le respect du cadre légal applicable".
3. ZÉRO INVENTION — Pas de faux numéro d'article, pas de fausse référence.
4. ADAPTABILITÉ — Adapte le ton, la longueur et le format selon les instructions.
5. PLACEHOLDERS — Utilise [NOM DE L'ÉLÈVE], [DATE], [NOM DU PARENT], [NOM DE L'ÉCOLE] etc. pour les éléments à personnaliser. Utilise TOUJOURS des crochets et des MAJUSCULES pour les placeholders.
6. PAS DE SIGNATURE NI FORMULE DE CLÔTURE — NE génère JAMAIS de formule de politesse finale, ni de signature, ni de nom/fonction/école en fin de document. Le système ajoute automatiquement la signature et la formule de politesse configurées par l'utilisateur. Termine le document après le dernier paragraphe de contenu.

STRUCTURE SELON LE FORMAT :

EMAIL :
- Objet : [pertinent]
- Corps court et direct
- NE PAS ajouter de formule de politesse ni de signature à la fin

COURRIER STRUCTURÉ :
- Objet
- Corps structuré en paragraphes
- NE PAS ajouter d'en-tête (il est généré automatiquement)
- NE PAS ajouter de formule de clôture ni de signature (ajoutées automatiquement)

NOTE INTERNE :
- Date + Destinataire
- Objet
- Corps concis
- NE PAS ajouter de signature

QUALITÉ :
- Phrases courtes et claires
- Pas de jargon inutile
- Pas de ton condescendant
- Respecter le registre demandé (neutre, ferme, apaisant, formel)`;
}

export function buildGenerateUserMessage(params: {
  template: string;
  situation: string;
  tone: DocGenTone;
  format: DocGenFormat;
  recipient?: string;
  includePoints?: string;
  avoidPoints?: string;
  subject?: string;
  userName?: string;
  jobTitle?: string;
  schoolName?: string;
}): string {
  const toneLabels: Record<DocGenTone, string> = {
    neutre: "neutre et professionnel",
    ferme: "ferme mais respectueux",
    apaisant: "bienveillant et rassurant",
    formel: "très formel et institutionnel",
  };

  const formatLabels: Record<DocGenFormat, string> = {
    email: "un email professionnel",
    courrier: "un courrier structuré",
    note: "une note interne concise",
  };

  let msg = `Rédige ${formatLabels[params.format]} pour un directeur d'école.

TYPE : ${params.template}
TON : ${toneLabels[params.tone]}

SITUATION :
${params.situation}`;

  if (params.recipient) {
    msg += `\n\nDESTINATAIRE : ${params.recipient}`;
  }
  if (params.subject) {
    msg += `\nOBJET SOUHAITÉ : ${params.subject}`;
  }
  if (params.includePoints) {
    msg += `\n\nPOINTS À INCLURE :\n${params.includePoints}`;
  }
  if (params.avoidPoints) {
    msg += `\n\nPOINTS À ÉVITER :\n${params.avoidPoints}`;
  }

  msg += `\n\nCONSIGNES STRICTES :
- Document directement utilisable
- Utilise des [PLACEHOLDERS] en MAJUSCULES entre crochets pour les données à personnaliser
- Ne cite pas d'article de loi spécifique sauf si tu es absolument certain
- Reste prudent juridiquement
- Adapte le ton au registre demandé
- IMPORTANT : NE termine PAS le document avec une formule de politesse, une signature, un nom ou une fonction. L'en-tête, la formule de clôture et la signature sont ajoutés automatiquement par le système. Arrête-toi après le dernier paragraphe de contenu.`;

  return msg;
}
