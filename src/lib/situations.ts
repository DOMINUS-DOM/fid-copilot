export interface Situation {
  id: string;
  title: string;
  description: string;
  question: string;
  tags: string[];
}

export const SITUATIONS: Situation[] = [
  {
    id: "enseignant-refus-decision",
    title: "Refus d'appliquer une décision",
    description:
      "Un enseignant refuse d'appliquer une décision prise en conseil de participation.",
    question:
      "Un enseignant refuse d'appliquer une décision prise en conseil de participation concernant l'organisation des études dirigées. En tant que directeur, quels sont mes leviers d'action et sur quelles bases légales puis-je m'appuyer ?",
    tags: ["RH", "Conseil de participation"],
  },
  {
    id: "parent-contestation-decision",
    title: "Contestation d'un parent",
    description:
      "Un parent conteste une décision du conseil de classe et menace de porter plainte.",
    question:
      "Un parent conteste la décision du conseil de classe de faire redoubler son enfant et menace de porter plainte. En tant que directeur, quelle est la procédure à suivre et quels textes encadrent cette situation ?",
    tags: ["Parents", "Conseil de classe"],
  },
  {
    id: "projet-etablissement-revision",
    title: "Révision du projet d'établissement",
    description:
      "Le projet d'établissement n'a pas été révisé depuis 5 ans et des enseignants demandent sa mise à jour.",
    question:
      "Le projet d'établissement de mon école n'a pas été révisé depuis 5 ans. Des enseignants demandent sa mise à jour. Quelles sont mes obligations légales concernant le projet d'établissement et quelle procédure dois-je suivre pour le réviser ?",
    tags: ["Pilotage", "Projet d'établissement"],
  },
  {
    id: "absence-enseignant-remplacement",
    title: "Absence prolongée et remplacement",
    description:
      "Un enseignant est en absence de longue durée et le PO tarde à désigner un remplaçant.",
    question:
      "Un enseignant est absent depuis 3 semaines pour maladie de longue durée. Le pouvoir organisateur tarde à désigner un remplaçant et les élèves n'ont plus cours dans cette matière. Quelles sont mes responsabilités en tant que directeur et quels textes puis-je invoquer pour accélérer la procédure ?",
    tags: ["RH", "Organisation"],
  },
  {
    id: "harcelement-eleve",
    title: "Signalement de harcèlement",
    description:
      "Des parents signalent une situation de harcèlement entre élèves.",
    question:
      "Des parents me signalent que leur enfant est victime de harcèlement par d'autres élèves de la classe. En tant que directeur, quelles sont mes obligations légales, quelles mesures dois-je prendre et quels textes encadrent la gestion du harcèlement scolaire ?",
    tags: ["Élèves", "Bien-être"],
  },
  {
    id: "inspection-pedagogique",
    title: "Visite d'inspection pédagogique",
    description:
      "Le service d'inspection annonce une visite et un enseignant refuse d'être observé.",
    question:
      "Le service général de l'inspection annonce une visite dans mon établissement. Un enseignant refuse catégoriquement d'être observé en classe. En tant que directeur, quelles sont mes obligations et celles de l'enseignant vis-à-vis de l'inspection ? Sur quels textes puis-je m'appuyer ?",
    tags: ["Inspection", "RH"],
  },
  {
    id: "budget-fonctionnement",
    title: "Gestion du budget de fonctionnement",
    description:
      "Le budget de fonctionnement est insuffisant pour couvrir les besoins essentiels de l'école.",
    question:
      "Le budget de fonctionnement de mon établissement est insuffisant pour couvrir les frais de chauffage et le matériel pédagogique de base. Quelles sont mes marges de manœuvre en tant que directeur, quelles instances dois-je solliciter et quels textes encadrent la gestion financière d'un établissement scolaire ?",
    tags: ["Gestion", "Budget"],
  },
  {
    id: "plan-pilotage",
    title: "Élaboration du plan de pilotage",
    description:
      "L'école doit élaborer son plan de pilotage dans le cadre du Pacte d'excellence.",
    question:
      "Mon école doit élaborer son plan de pilotage dans le cadre du Pacte d'excellence. Quelles sont les étapes obligatoires, qui doit être impliqué dans la démarche, et quels textes définissent le cadre et les objectifs du plan de pilotage ?",
    tags: ["Pilotage", "Pacte d'excellence"],
  },
];
