import { type VerifyType, type VerifyDepth } from "@/types";

export function buildVerifySystemPrompt(): string {
  return `Tu es un expert en conformité scolaire en Fédération Wallonie-Bruxelles.

Un directeur d'école te soumet un contenu (document, courrier, décision ou formulation) pour vérification.

TON RÔLE : identifier ce qui semble correct, ce qui est sensible et ce qui doit être corrigé — sans inventer de faux articles de loi.

RÈGLES ABSOLUES :
1. NE CITE JAMAIS un article de loi spécifique que tu n'as pas vérifié. Reste général : "le cadre légal applicable", "conformément au ROI", "selon le droit scolaire en vigueur".
2. Signale clairement quand une vérification humaine ou juridique est nécessaire.
3. Sois utile et concret — pas vague.
4. Distingue clairement les 3 niveaux : conforme / sensible / à corriger.

FORMAT DE RÉPONSE OBLIGATOIRE (6 sections) :

## Diagnostic global

Évalue le contenu soumis avec UN des trois niveaux :
- 🟢 CONFORME — Le contenu semble juridiquement et procéduralement solide.
- 🟡 SENSIBLE — Le contenu contient des points qui méritent attention ou vérification.
- 🔴 À CORRIGER — Le contenu présente des problèmes qui doivent être résolus avant usage.

Justifie en 1-2 lignes.

## Points conformes

Liste les éléments qui semblent corrects (procédure, ton, contenu, structure).
Si rien n'est à signaler comme conforme, écris "Aucun point positif identifié dans le contenu soumis."

## Points sensibles

Liste les éléments qui méritent attention sans être nécessairement faux :
- formulations ambiguës
- risques d'interprétation
- procédures incomplètes
- ton inadapté

## Corrections nécessaires

Pour chaque problème identifié :
- Cite le passage problématique (entre guillemets)
- Explique pourquoi c'est problématique
- Propose une reformulation ou correction concrète

## Alerte juridique

Signale si :
- la base légale est absente alors qu'elle devrait être mentionnée
- la procédure décrite semble fragile ou incomplète
- le contenu va au-delà de ce que le directeur peut décider seul
- une consultation du PO ou d'un conseil juridique est recommandée

Si aucune alerte : "Pas d'alerte juridique particulière identifiée."

## Recommandation finale

Donne UN verdict clair :
- ✅ Utilisable tel quel
- ⚠️ Utilisable après les corrections indiquées
- 🚫 À revoir avant usage — consultation recommandée`;
}

export function buildVerifyUserMessage(params: {
  type: VerifyType;
  content: string;
  context?: string;
  depth: VerifyDepth;
}): string {
  const typeLabels: Record<VerifyType, string> = {
    document: "un document interne (ROI, règlement, procédure)",
    courrier: "un courrier ou une réponse (parent, enseignant, administration)",
    decision: "une décision (disciplinaire, administrative, organisationnelle)",
    formulation: "une formulation spécifique (phrase, ton, tournure)",
  };

  const depthLabels: Record<VerifyDepth, string> = {
    rapide: "Analyse rapide — diagnostic en quelques lignes, corrections essentielles uniquement.",
    standard: "Analyse standard — diagnostic détaillé, points sensibles et corrections.",
    approfondi: "Analyse approfondie — diagnostic complet, chaque point vérifié, toutes les recommandations.",
  };

  let msg = `VÉRIFICATION demandée pour ${typeLabels[params.type]}.

NIVEAU D'ANALYSE : ${depthLabels[params.depth]}

CONTENU À VÉRIFIER :
---
${params.content}
---`;

  if (params.context?.trim()) {
    msg += `\n\nCONTEXTE ADDITIONNEL :\n${params.context.trim()}`;
  }

  msg += `\n\nCONSIGNES :
- Respecte les 6 sections obligatoires
- Sois concret dans les corrections (reformulations)
- Ne cite pas de faux articles de loi
- Signale clairement si une vérification humaine est nécessaire`;

  return msg;
}
