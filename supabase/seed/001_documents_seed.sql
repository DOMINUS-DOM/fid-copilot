-- ============================================================
-- Seed : documents FID de référence
-- ============================================================

insert into public.documents (title, category, type, cda_code, is_core, summary, source_url) values

-- Textes incontournables (communs)
(
  'Code de l''enseignement fondamental et de l''enseignement secondaire',
  'incontournable_commun',
  'texte_legal',
  '49466',
  true,
  'Texte consolidé régissant l''organisation de l''enseignement obligatoire en Fédération Wallonie-Bruxelles. Couvre la structure des établissements, les missions, le pilotage, les organes de concertation et les droits des élèves. Fait partie des textes incontournables sur lesquels portent 6 des 8 questions de l''évaluation certificative FID.',
  'https://www.gallilex.cfwb.be/document/pdf/49466_000.pdf'
),

(
  'Décret définissant les missions prioritaires de l''enseignement fondamental et de l''enseignement secondaire (Décret Missions)',
  'incontournable_commun',
  'texte_legal',
  '21557',
  true,
  'Décret du 24 juillet 1997 qui définit les quatre missions prioritaires de l''enseignement : promouvoir la confiance en soi, amener chacun à s''émanciper, préparer à la citoyenneté responsable et assurer l''égalité des chances. Texte fondateur repris dans l''évaluation certificative FID.',
  'https://www.gallilex.cfwb.be/document/pdf/21557_002.pdf'
),

(
  'Décret du 2 février 2007 fixant le statut des directeurs',
  'incontournable_commun',
  'texte_legal',
  '31886',
  true,
  'Définit les conditions de nomination, les missions, les compétences requises et le cadre statutaire des directeurs d''établissement. Précise les responsabilités en matière de pilotage pédagogique, de gestion des ressources humaines et de développement de l''établissement.',
  'https://www.gallilex.cfwb.be/document/pdf/31886_004.pdf'
),

-- Synthèses
(
  '01_Cadre_legal_FID – Synthèse structurée des textes fondamentaux',
  'synthese',
  'synthese',
  null,
  false,
  'Document de synthèse structurant les principaux textes légaux de la FID : Code de l''enseignement, Décret Missions, Pacte d''excellence, statut des directeurs, Pacte scolaire et textes incontournables. Outil de révision pour l''évaluation certificative.',
  null
),

-- Organisation FID
(
  '05_Organisation_FID',
  'organisation',
  'guide',
  null,
  false,
  'Guide pratique décrivant l''organisation de la formation initiale des directeurs : structure du programme, calendrier des modules, modalités d''évaluation certificative (8 questions sur cas concrets avec justification juridique), conditions de réussite et parcours de formation.',
  null
),

-- Fonction de direction
(
  '02_Fonction_direction – Profil de fonction-type du directeur',
  'fonction_direction',
  'guide',
  null,
  false,
  'Décrit les sept axes du profil de fonction-type du directeur : production de sens, pilotage stratégique, pilotage pédagogique, gestion des ressources humaines, communication interne et externe, gestion administrative et matérielle, et développement professionnel continu.',
  null
),

-- Portfolio
(
  '04_Portfolio_FID – Guide du portfolio de développement professionnel',
  'portfolio',
  'portfolio',
  null,
  false,
  'Guide de construction du portfolio FID. Outil de développement professionnel centré sur la posture réflexive et la construction de l''identité professionnelle du directeur. N''est pas un outil d''évaluation mais un support d''accompagnement et de progression tout au long de la formation.',
  null
);
