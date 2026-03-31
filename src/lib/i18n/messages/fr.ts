import { type Messages } from "../locales";

const messages: Messages = {
  header: {
    guide: "Guide",
    pricing: "Tarifs",
    vision: "Vision",
    login: "Connexion",
    signup: "Inscription",
    openApp: "Ouvrir l'application",
  },
  hero: {
    badge: "Accès gratuit pour tous les directeurs",
    title: "Votre assistant juridique IA, ",
    titleHighlight: "pensé pour les directions d'école",
    subtitle:
      "FID Copilot vous aide à prendre des décisions fondées sur les textes légaux en vigueur en Fédération Wallonie-Bruxelles. Droit scolaire, aide à la décision, préparation FID, portfolio — tout est centralisé, sourcé et vérifiable.",
    cta: "Tester gratuitement",
    ctaAuth: "Ouvrir l'application",
    ctaSecondary: "Voir les tarifs",
    trustLine: "Gratuit pendant toute la phase bêta — Aucune carte bancaire — Accès immédiat",
    betaMessage:
      "Nous construisons FID Copilot avec vous. En tant que testeur bêta, partagez vos remarques et vos besoins directement depuis l'application. Chaque retour nous aide à développer un outil sur mesure pour les directeurs.",
    pills: [
      "Assistant juridique",
      "Aide à la décision",
      "Préparation FID",
      "Portfolio",
      "Documents école",
    ],
  },
  features: {
    label: "Plateforme complète",
    title: "Un seul outil pour tout ce qui compte",
    subtitle: "Juridique, décisionnel, FID et pilotage — toujours aligné sur les derniers textes.",
    modules: [
      {
        title: "Assistant juridique",
        description:
          "Posez votre question, recevez une analyse structurée avec citations exactes des textes en vigueur.",
        tag: "Examen · Terrain · Portfolio",
      },
      {
        title: "Aide à la décision",
        description:
          "Décrivez une situation. Recevez les options, une analyse des risques et une recommandation tranchée.",
        tag: "Options · Risques · Plan d'action",
      },
      {
        title: "Préparation FID",
        description:
          "Format aligné sur l'évaluation certificative. Auto-évaluation calibrée sur les barèmes réels.",
        tag: "Objectif 16-18/20",
      },
      {
        title: "Portfolio professionnel",
        description:
          "Structurez votre réflexion sans que l'IA n'écrive à votre place. Guidage, pas substitution.",
        tag: "Structurer · Améliorer · Challenger",
      },
      {
        title: "Contexte de votre école",
        description:
          "Uploadez votre ROI et vos documents internes. L'assistant les croise avec le cadre légal.",
        tag: "Loi > document interne",
      },
    ],
  },
  trust: {
    label: "Pourquoi FID Copilot",
    title: "La fiabilité juridique avant tout",
    points: [
      {
        title: "Citations vérifiables",
        description: "Chaque référence provient du texte officiel avec lien CDA.",
      },
      {
        title: "Zéro hallucination",
        description: "Si la référence exacte manque, l'assistant le signale.",
      },
      {
        title: "Toujours à jour",
        description: "Base juridique enrichie en continu avec les derniers décrets.",
      },
      {
        title: "Votre école intégrée",
        description: "Uploadez votre ROI, croisé automatiquement avec la loi.",
      },
    ],
  },
  cta: {
    badge: "Gratuit pour les testeurs",
    title: "Testez, utilisez, donnez votre avis",
    subtitle:
      "Inscrivez-vous gratuitement et aidez-nous à construire l'outil idéal pour les directions d'école. Vos retours façonnent chaque prochaine version.",
    button: "Créer mon compte gratuit",
    note: "Gratuit pendant toute la phase bêta — Aucune carte bancaire",
  },
  footer: {
    tagline: "Assistant juridique pour directions d'école",
    federation: "Fédération Wallonie-Bruxelles",
    navTitle: "Navigation",
    contactTitle: "Contact",
  },
  pricing: {
    badge: "Tarifs",
    title: "Gratuit pendant la bêta",
    subtitle:
      "Pendant toute la phase de développement, FID Copilot est entièrement gratuit. Profitez de toutes les fonctionnalités sans aucune limite, et aidez-nous à construire l'outil idéal pour vous.",
    betaNoticeTitle: "Accès complet et gratuit pour les testeurs bêta",
    betaNoticeText:
      "Vous êtes directeur ? Inscrivez-vous et utilisez FID Copilot sans aucun frais pendant toute la durée du développement. Vos retours nous aident à créer un outil sur mesure pour les directions d'école en Fédération Wallonie-Bruxelles.",
    freeTitle: "Bêta — Gratuit",
    freeSubtitle: "Toutes les fonctionnalités, sans limite",
    freePrice: "0€",
    freePeriod: "pendant toute la bêta",
    freeCta: "Créer mon compte gratuit",
    freeCtaAuth: "Ouvrir l'application",
    freeNote: "Aucune carte bancaire requise — Accès immédiat",
    proTitle: "Pro",
    proSubtitle: "Pour les équipes de direction",
    proBadge: "Après la bêta",
    proPrice: "—",
    proCta: "Disponible après la bêta",
    proNote: "Les testeurs bêta seront informés en priorité",
    faqTitle: "Questions fréquentes",
    freeFeatures: [
      "Assistant juridique illimité (3 modes)",
      "Moteur d'aide à la décision",
      "Générateur de documents",
      "Vérification de conformité",
      "Citations exactes et vérifiables",
      "Upload de vos documents d'école",
      "Portfolio FID avec guidage IA",
      "Auto-évaluation calibrée /20",
      "Sources CDA avec liens Gallilex",
      "Base juridique mise à jour en continu",
      "Système de feedback intégré",
    ],
    proFeatures: [
      "Tout du plan Gratuit",
      "Partage en équipe",
      "Historique illimité",
      "Modèles personnalisés",
      "Export PDF des analyses",
      "Support prioritaire",
      "Tableaux de bord équipe",
      "Intégration agenda scolaire",
    ],
    faqs: [
      {
        q: "Combien de temps dure la phase bêta ?",
        a: "La bêta dure pendant toute la phase de développement. Vous serez prévenu avant tout changement de tarification, et les testeurs bêta bénéficieront d'un accès privilégié.",
      },
      {
        q: "Mes données sont-elles sécurisées ?",
        a: "Absolument. Vos documents et conversations sont chiffrés et accessibles uniquement par vous.",
      },
      {
        q: "Comment donner mon avis sur l'outil ?",
        a: "Depuis l'application, cliquez sur « Feedback » dans le menu. Vos remarques et suggestions sont envoyées directement à notre équipe.",
      },
      {
        q: "Y a-t-il des limites pendant la bêta ?",
        a: "Non. Toutes les fonctionnalités sont accessibles sans aucune restriction. Utilisez l'outil autant que vous le souhaitez.",
      },
    ],
  },
  guide: {
    badge: "Guide de prise en main",
    title: "Bien démarrer avec FID Copilot",
    subtitle:
      "Un assistant conçu pour accompagner les directions d'école dans leurs décisions juridiques et administratives. Prenez-le en main en 2 minutes.",
    cta: "Commencer maintenant",
    stepsTitle: "4 étapes pour commencer",
    steps: [
      {
        title: "Créez votre compte",
        desc: "Inscription gratuite en 30 secondes. Aucune carte bancaire requise.",
      },
      {
        title: "Choisissez un module",
        desc: "Assistant, Décision, Générateur, Vérification — selon votre besoin du moment.",
      },
      {
        title: "Décrivez votre situation",
        desc: "Posez votre question en langage naturel ou collez un document à analyser.",
      },
      {
        title: "Exploitez la réponse",
        desc: "Analyse structurée, citations sourcées, recommandation claire — prêt à agir.",
      },
    ],
    modulesTitle: "Les modules à votre disposition",
    modulesSubtitle: "Chaque module répond à un besoin précis. Cliquez pour y accéder directement.",
    modules: [
      { title: "Assistant", desc: "Analyse juridique structurée avec citations exactes" },
      { title: "Décision", desc: "Options, risques et recommandation pour chaque situation" },
      { title: "Situations", desc: "Cas concrets prêts à analyser" },
      { title: "Générateur", desc: "Courriers et documents sur base légale" },
      { title: "Vérification", desc: "Conformité de vos documents et décisions" },
      { title: "Mon école", desc: "Uploadez ROI et documents internes" },
      { title: "Portfolio", desc: "Structurez votre réflexion FID" },
    ],
    betaTitle: "FID Copilot est en phase de test",
    betaText:
      "Vos retours sont essentiels pour améliorer l'outil. Chaque remarque, chaque suggestion nous aide à construire la solution idéale pour les directions d'école. Les testeurs actifs bénéficieront d'avantages exclusifs sur les futures versions.",
    feedbackCta: "Donner mon avis",
  },
  europe: {
    heroBadge: "AI-powered decision system",
    heroTitle: "FID Copilot",
    heroSubtitle: "AI-powered decision system for public administrations",
    visionLines: [
      "Transformer la prise de décision dans les écoles et administrations publiques",
      "Réduire les risques juridiques et améliorer la qualité des décisions",
      "Rendre les services publics plus efficaces, transparents et fiables",
    ],
    heroCta: "Découvrir la vision",
    heroCtaSecondary: "Voir la plateforme",
    problemLabel: "Le constat",
    problemTitle: "Le défi des administrations locales",
    challenges: [
      { title: "Complexité juridique", desc: "Des centaines de textes légaux en constante évolution" },
      { title: "Décisions à risque", desc: "Des conséquences juridiques majeures en cas d'erreur" },
      { title: "Manque d'outils", desc: "Aucune plateforme structurée pour accompagner la décision" },
      { title: "Temps perdu", desc: "Des heures à chercher et interpréter la réglementation" },
    ],
    consequences: ["Incohérences", "Erreurs juridiques", "Surcharge mentale"],
    solutionLabel: "La solution",
    solutionTitle: "Une plateforme IA intégrée pour tout le cycle décisionnel",
    solutionModules: [
      "Analyse juridique",
      "Aide à la décision",
      "Génération de documents",
      "Vérification de conformité",
      "Contextualisation locale",
    ],
    solutionFlow: ["Analyse", "Décision", "Rédaction", "Vérification", "Contexte"],
    solutionPhrase: "Une même logique, de l'analyse à la décision finale.",
    innovationLabel: "Innovation",
    innovationTitle: "Ce qui rend FID Copilot différent",
    genericLabel: "IA générique",
    copilotLabel: "FID Copilot",
    comparisons: [
      { generic: "Réponse conversationnelle", copilot: "Réponse structurée et traçable" },
      { generic: "Sources peu vérifiables", copilot: "Base légale sourcée avec liens CDA" },
      { generic: "Pas de contexte local", copilot: "Documents d'école intégrés" },
      { generic: "Usage unique : chat", copilot: "Cycle complet : analyse → décision → rédaction → vérification" },
      { generic: "Mode unique", copilot: "Modes dédiés : examen, terrain, portfolio" },
    ],
    alignmentLabel: "Alignement européen",
    alignmentTitle: "Aligné avec la transformation numérique des administrations",
    pillars: [
      { title: "Digitalisation", desc: "Accélérer la transformation numérique des administrations publiques" },
      { title: "IA fiable et traçable", desc: "Des réponses explicables, sourcées et auditables" },
      { title: "Qualité des décisions", desc: "Améliorer la cohérence et réduire les erreurs dans les services publics" },
      { title: "Interopérabilité", desc: "Une architecture adaptable à plusieurs cadres institutionnels européens" },
    ],
    alignmentPhrase: "Moderniser la décision publique, pas seulement automatiser du texte.",
    impactLabel: "Impact",
    impactTitle: "Impact attendu",
    impacts: [
      { value: 40, suffix: "%", prefix: "Jusqu'à -", label: "Réduction potentielle du temps de traitement" },
      { value: 60, suffix: "%", prefix: "Jusqu'à -", label: "Diminution du risque d'erreur juridique" },
      { value: 100, suffix: "%", prefix: "", label: "Des citations sourcées et vérifiables" },
      { value: 5, suffix: "x", prefix: "", label: "Plus rapide qu'une recherche manuelle" },
    ],
    useCasesLabel: "Cas concrets",
    useCasesTitle: "Cas d'usage déjà intégrés",
    useCases: [
      { title: "Contestation parent", desc: "Recours contre une décision de refus, analyse des droits et procédures applicables" },
      { title: "Discipline élève", desc: "Exclusion définitive, mesures conservatoires, respect de la procédure légale" },
      { title: "Gestion RH", desc: "Droits du personnel, absence, évaluation, obligations statutaires" },
      { title: "Décisions de direction", desc: "Inscription, organisation scolaire, pilotage d'établissement" },
    ],
    useCasesPhrase: "Des situations réelles, déjà modélisées dans la plateforme.",
    deployLabel: "Déploiement",
    deployTitle: "Déploiement progressif",
    deployCountries: [
      { country: "Belgique", status: "active", statusLabel: "Phase pilote" },
      { country: "France", status: "planned", statusLabel: "Extension prévue" },
      { country: "Italie", status: "planned", statusLabel: "Extension prévue" },
      { country: "Espagne", status: "planned", statusLabel: "Extension prévue" },
    ],
    deployPhrase: "Une architecture pensée pour être adaptée à plusieurs cadres institutionnels.",
    visionLabel: "Vision long terme",
    visionTitle: "Créer un standard européen d'aide à la décision publique",
    visionText:
      "FID Copilot a vocation à devenir une infrastructure fiable, explicable et réplicable pour accompagner les administrations locales dans leurs décisions sensibles.",
    visionCta: "Parler du projet",
    visionCtaSecondary: "Voir la plateforme",
  },
};

export default messages;
