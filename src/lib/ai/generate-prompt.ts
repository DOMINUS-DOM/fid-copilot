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
5. PLACEHOLDERS — Utilise [NOM DE L'ÉLÈVE], [DATE], [NOM DU PARENT], [NOM DE L'ÉCOLE] etc. pour les éléments à personnaliser.

STRUCTURE SELON LE FORMAT :

EMAIL :
- Objet : [pertinent]
- Corps court et direct
- Formule de politesse sobre

COURRIER STRUCTURÉ :
- En-tête : [Nom de l'école] / [Adresse] / [Date]
- Objet
- Corps structuré en paragraphes
- Formule de clôture formelle
- Signature : Le/La directeur/directrice

NOTE INTERNE :
- Date + Destinataire
- Objet
- Corps concis
- Pas de formule de politesse excessive

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
}): string {
  const toneLabels: Record<DocGenTone, string> = {
    neutre: "neutre et professionnel",
    ferme: "ferme mais respectueux",
    apaisant: "bienveillant et rassurant",
    formel: "très formel et institutionnel",
  };

  const formatLabels: Record<DocGenFormat, string> = {
    email: "un email professionnel",
    courrier: "un courrier structuré avec en-tête",
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

  msg += `\n\nCONSIGNES :
- Document directement utilisable
- Utilise des [PLACEHOLDERS] pour les données à personnaliser
- Ne cite pas d'article de loi spécifique sauf si tu es absolument certain
- Reste prudent juridiquement
- Adapte le ton au registre demandé`;

  return msg;
}
