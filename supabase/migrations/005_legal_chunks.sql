-- ============================================================
-- Migration 005 : Table legal_chunks + seed complet documents
-- ============================================================
-- Stratégie : les PDFs légaux sont trop gros (jusqu'à 1.2M chars)
-- pour être envoyés intégralement à GPT. On les découpe en chunks
-- par article/section. À query time, on cherche les chunks pertinents
-- par keywords et on les inclut dans le prompt.
-- ============================================================

-- ============================================================
-- ÉTAPE 1 : Table legal_chunks
-- ============================================================

CREATE TABLE IF NOT EXISTS public.legal_chunks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  cda_code text NOT NULL,
  chunk_index integer NOT NULL DEFAULT 0,
  chunk_title text NOT NULL DEFAULT '',
  content text NOT NULL,
  tags text[] DEFAULT NULL,
  created_at timestamptz DEFAULT now()
);

-- Index pour la recherche par CDA
CREATE INDEX IF NOT EXISTS idx_legal_chunks_cda ON public.legal_chunks (cda_code);

-- Index pour la recherche full-text (PostgreSQL built-in)
CREATE INDEX IF NOT EXISTS idx_legal_chunks_content_fts
  ON public.legal_chunks
  USING gin (to_tsvector('french', content));

-- RLS : lecture seule pour les utilisateurs authentifiés
ALTER TABLE public.legal_chunks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read chunks" ON public.legal_chunks;
CREATE POLICY "Authenticated users can read chunks"
  ON public.legal_chunks FOR SELECT
  TO authenticated
  USING (true);

COMMENT ON TABLE public.legal_chunks IS 'Chunks de textes légaux extraits des PDFs FID, découpés par article/section pour le retrieval';
COMMENT ON COLUMN public.legal_chunks.cda_code IS 'Code CDA du document source (clé de liaison avec documents.cda_code)';
COMMENT ON COLUMN public.legal_chunks.chunk_title IS 'Titre de la section/article (ex: "Article 15 - Inscription")';
COMMENT ON COLUMN public.legal_chunks.content IS 'Contenu textuel du chunk (500-3000 chars typiquement)';


-- ============================================================
-- ÉTAPE 2 : Seed complet des 30 textes légaux
-- ============================================================
-- On insère TOUS les textes avec leur métadonnée complète.
-- ON CONFLICT sur cda_code pour ne pas créer de doublons
-- avec les documents déjà existants.
-- ============================================================

-- D'abord, ajouter une contrainte unique sur cda_code si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'documents_cda_code_unique'
  ) THEN
    -- On ne peut pas mettre UNIQUE sur une colonne nullable avec des NULLs multiples
    -- mais ici on filtre les doublons non-null
    CREATE UNIQUE INDEX documents_cda_code_unique ON public.documents (cda_code) WHERE cda_code IS NOT NULL;
  END IF;
END$$;


-- ============================================================
-- COMMUNS INCONTOURNABLES (is_core = true)
-- ============================================================

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES (
  'Loi du 29 mai 1959 - Pacte scolaire',
  'incontournable_commun', 'texte_legal', '5108', true,
  'Loi modifiant certaines dispositions de la législation de l''enseignement. Texte fondateur du Pacte scolaire qui organise la coexistence des réseaux d''enseignement et garantit la liberté de choix.',
  'https://www.gallilex.cfwb.be/document/pdf/05108_000.pdf',
  ARRAY['pacte scolaire', 'réseaux', 'liberté enseignement', 'subventions', 'neutralité', 'inspection']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES (
  'Décret du 2 février 2007 fixant le statut des directeurs',
  'incontournable_commun', 'texte_legal', '31886', true,
  'Définit les conditions de nomination, missions, compétences et cadre statutaire des directeurs d''établissement. Modifié par le décret du 14 mars 2019. Couvre le pilotage pédagogique, la GRH et le développement de l''établissement.',
  'https://www.gallilex.cfwb.be/document/pdf/31886_004.pdf',
  ARRAY['directeur', 'statut', 'nomination', 'désignation', 'mandat', 'évaluation', 'barème', 'lettre de mission']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;


-- ============================================================
-- SECONDAIRE & SPÉCIALISÉ INCONTOURNABLES (is_core = true)
-- ============================================================

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES (
  'Arrêté Royal du 29 juin 1984 - Organisation de l''enseignement secondaire',
  'incontournable_secondaire_specialise', 'texte_legal', '10450', true,
  'Organisation de l''enseignement secondaire : structure des degrés, formes d''enseignement (général, technique, professionnel, artistique), grilles horaires et conditions d''admission.',
  'https://www.gallilex.cfwb.be/document/pdf/10450_000.pdf',
  ARRAY['secondaire', 'organisation', 'degrés', 'formes', 'grille horaire', 'admission', 'général', 'technique', 'professionnel']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES (
  'Décret du 3 juillet 1991 - Enseignement en alternance',
  'incontournable_secondaire_specialise', 'texte_legal', '16421', true,
  'Organisation de l''enseignement secondaire en alternance (CEFA). Conditions d''accès, conventions, statut des apprenants, liens entreprises-école.',
  'https://www.gallilex.cfwb.be/document/pdf/16421_000.pdf',
  ARRAY['alternance', 'CEFA', 'convention', 'entreprise', 'formation professionnelle', 'apprenant']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES (
  'Décret du 29 juillet 1992 - Organisation de l''enseignement secondaire de plein exercice',
  'incontournable_secondaire_specialise', 'texte_legal', '17144', true,
  'Organisation de l''enseignement secondaire de plein exercice : structure, sanction des études, conditions de passage, attestations, certificats.',
  'https://www.gallilex.cfwb.be/document/pdf/17144_000.pdf',
  ARRAY['secondaire', 'plein exercice', 'sanction études', 'attestation', 'certificat', 'passage', 'année complémentaire']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES (
  'Décret du 24 juillet 1997 - Missions prioritaires (Décret Missions)',
  'incontournable_secondaire_specialise', 'texte_legal', '21557', true,
  'Définit les quatre missions prioritaires de l''enseignement : confiance en soi, émancipation, citoyenneté responsable, égalité des chances. Organise les structures (conseil de participation, projet d''établissement).',
  'https://www.gallilex.cfwb.be/document/pdf/21557_002.pdf',
  ARRAY['missions', 'projet établissement', 'conseil participation', 'objectifs', 'émancipation', 'citoyenneté', 'recours', 'inscription']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES (
  'Décret du 3 mars 2004 - Enseignement spécialisé',
  'incontournable_secondaire_specialise', 'texte_legal', '28737', true,
  'Organisation de l''enseignement spécialisé : types et formes d''enseignement, intégration, aménagements raisonnables, protocole, orientation, pôles territoriaux.',
  'https://www.gallilex.cfwb.be/document/pdf/28737_000.pdf',
  ARRAY['spécialisé', 'intégration', 'types', 'aménagements raisonnables', 'pôle territorial', 'orientation', 'protocole']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES (
  'Décret du 11 avril 2014 - Titres et fonctions',
  'incontournable_secondaire_specialise', 'texte_legal', '40701', true,
  'Réglementation des titres et fonctions dans l''enseignement fondamental et secondaire. Titres requis, suffisants, de pénurie. Classement des candidats, priorités, dérogations.',
  'https://www.gallilex.cfwb.be/document/pdf/40701_000.pdf',
  ARRAY['titres', 'fonctions', 'titre requis', 'titre suffisant', 'pénurie', 'candidats', 'barème', 'primorecrutement']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES (
  'Décret du 14 mars 2019 - Organisation du travail des membres du personnel',
  'incontournable_secondaire_specialise', 'texte_legal', '46287', true,
  'Dispositions relatives à l''organisation du travail du personnel enseignant. Souplesse organisationnelle pour les PO : horaires, prestations, attributions.',
  'https://www.gallilex.cfwb.be/document/pdf/46287_000.pdf',
  ARRAY['organisation travail', 'personnel', 'horaire', 'prestation', 'souplesse', 'pouvoir organisateur', 'attribution']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES (
  'Décret du 3 mai 2019 - Code de l''enseignement (tronc commun)',
  'incontournable_secondaire_specialise', 'texte_legal', '47165', true,
  'Décret portant le Code de l''enseignement fondamental et secondaire. Met en place le tronc commun. Articulation avec le Code (CDA 49466).',
  'https://www.gallilex.cfwb.be/document/pdf/47165_000.pdf',
  ARRAY['code enseignement', 'tronc commun', 'référentiels', 'compétences', 'évaluation']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES (
  'Code de l''enseignement fondamental et de l''enseignement secondaire',
  'incontournable_secondaire_specialise', 'texte_legal', '49466', true,
  'Texte consolidé régissant l''organisation de l''enseignement obligatoire en FWB. Structure des établissements, missions, pilotage, organes de concertation, droits des élèves, plans de pilotage, contrats d''objectifs.',
  'https://www.gallilex.cfwb.be/document/pdf/49466_000.pdf',
  ARRAY['code enseignement', 'inscription', 'exclusion', 'recours', 'pilotage', 'contrat objectifs', 'plan pilotage', 'gratuité', 'obligation scolaire']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;


-- ============================================================
-- ESAHR INCONTOURNABLE
-- ============================================================

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES (
  'Décret du 2 juin 1998 - Organisation de l''ESAHR',
  'incontournable_secondaire_specialise', 'texte_legal', '51784', true,
  'Organisation de l''enseignement secondaire artistique à horaire réduit. Structure, domaines artistiques, conditions d''admission, subventionnement.',
  'https://www.gallilex.cfwb.be/document/pdf/51784_000.pdf',
  ARRAY['ESAHR', 'artistique', 'horaire réduit', 'domaines', 'musique', 'arts plastiques', 'danse', 'théâtre']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;


-- ============================================================
-- COMMUNS FACULTATIFS (is_core = false)
-- ============================================================

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES
(
  'Loi du 30 juillet 1963 - Régime linguistique dans l''enseignement',
  'incontournable_commun', 'texte_legal', '4329', false,
  'Régime linguistique applicable à l''enseignement. Langue de l''enseignement selon la région, dérogations, immersion.',
  'https://www.gallilex.cfwb.be/document/pdf/04329_000.pdf',
  ARRAY['langue', 'linguistique', 'immersion', 'région', 'français', 'néerlandais']
),
(
  'Arrêté royal du 15 avril 1958 - Statut pécuniaire du personnel enseignant',
  'incontournable_commun', 'texte_legal', '5556', false,
  'Statut pécuniaire du personnel enseignant, scientifique et assimilé. Barèmes, ancienneté, échelles de traitement.',
  'https://www.gallilex.cfwb.be/document/pdf/05556_000.pdf',
  ARRAY['barème', 'traitement', 'ancienneté', 'pécuniaire', 'échelle', 'rémunération']
),
(
  'Décret du 5 juillet 2000 - Régime des congés',
  'incontournable_commun', 'texte_legal', '25174', false,
  'Fixe le régime des congés et de disponibilité pour le personnel enseignant. Types de congés, conditions, durées.',
  'https://www.gallilex.cfwb.be/document/pdf/25174_000.pdf',
  ARRAY['congé', 'disponibilité', 'maladie', 'maternité', 'personnel', 'absence']
),
(
  'Décret du 17 juillet 2003 - Intervention transport en commun',
  'incontournable_commun', 'texte_legal', '27861', false,
  'Intervention de l''employeur dans les frais de transport en commun des membres du personnel.',
  'https://www.gallilex.cfwb.be/document/pdf/27861_000.pdf',
  ARRAY['transport', 'intervention', 'déplacement', 'personnel']
),
(
  'Décret du 10 janvier 2019 - Service général de l''inspection',
  'incontournable_commun', 'texte_legal', '46239', false,
  'Organisation du service général de l''inspection. Missions, compétences, procédures d''audit et d''évaluation des établissements.',
  'https://www.gallilex.cfwb.be/document/pdf/46239_000.pdf',
  ARRAY['inspection', 'audit', 'évaluation', 'contrôle', 'qualité', 'pilotage']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;


-- ============================================================
-- SECONDAIRE FACULTATIFS (is_core = false)
-- ============================================================

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES
(
  'Loi du 29 juin 1983 - Obligation scolaire',
  'incontournable_secondaire_specialise', 'texte_legal', '9547', false,
  'Fixe l''obligation scolaire : âge, durée, contrôle, sanctions en cas de non-respect.',
  'https://www.gallilex.cfwb.be/document/pdf/09547_000.pdf',
  ARRAY['obligation scolaire', 'fréquentation', 'absentéisme', 'contrôle', 'sanction']
),
(
  'Décret du 30 juin 2006 - Premier degré du secondaire',
  'incontournable_secondaire_specialise', 'texte_legal', '30998', false,
  'Organisation du premier degré de l''enseignement secondaire : observation, différenciation, année complémentaire, PIA.',
  'https://www.gallilex.cfwb.be/document/pdf/30998_000.pdf',
  ARRAY['premier degré', 'observation', 'différenciation', 'année complémentaire', 'PIA', 'orientation']
),
(
  'Décret du 12 janvier 2007 - Citoyenneté à l''école',
  'incontournable_secondaire_specialise', 'texte_legal', '31723', false,
  'Cadre pour le renforcement de l''éducation à la citoyenneté à l''école.',
  'https://www.gallilex.cfwb.be/document/pdf/31723_000.pdf',
  ARRAY['citoyenneté', 'démocratie', 'participation', 'vivre ensemble']
),
(
  'Décret du 11 mai 2007 - Immersion linguistique',
  'incontournable_secondaire_specialise', 'texte_legal', '32365', false,
  'Organisation de l''enseignement en immersion linguistique : conditions, langues, organisation, encadrement.',
  'https://www.gallilex.cfwb.be/document/pdf/32365_000.pdf',
  ARRAY['immersion', 'linguistique', 'langue', 'néerlandais', 'anglais', 'allemand']
),
(
  'Décret du 30 avril 2009 - Encadrement différencié',
  'incontournable_secondaire_specialise', 'texte_legal', '34295', false,
  'Dispositif d''encadrement différencié : classes d''implantation, ISE, moyens supplémentaires pour les écoles en milieu défavorisé.',
  'https://www.gallilex.cfwb.be/document/pdf/34295_000.pdf',
  ARRAY['encadrement différencié', 'ISE', 'milieu défavorisé', 'moyens', 'implantation']
),
(
  'Décret du 18 janvier 2018 - Code de la prévention et de l''aide à la jeunesse',
  'incontournable_secondaire_specialise', 'texte_legal', '45031', false,
  'Code de prévention, aide à la jeunesse et protection de la jeunesse. Signalement, procédures, acteurs, droits des mineurs.',
  'https://www.gallilex.cfwb.be/document/pdf/45031_000.pdf',
  ARRAY['jeunesse', 'aide', 'protection', 'signalement', 'mineur', 'SAJ', 'SPJ']
),
(
  'Décret du 13 septembre 2018 - Service général de pilotage des écoles et CPMS',
  'incontournable_secondaire_specialise', 'texte_legal', '45593', false,
  'Création du service général de pilotage. Statut des directeurs de zone et délégués au contrat d''objectifs. Plans de pilotage, contrats d''objectifs.',
  'https://www.gallilex.cfwb.be/document/pdf/45593_000.pdf',
  ARRAY['pilotage', 'contrat objectifs', 'plan pilotage', 'directeur zone', 'DCO', 'CPMS']
),
(
  'AGCF du 6 novembre 2018 - Répertoire des options de base',
  'incontournable_secondaire_specialise', 'texte_legal', '45721', false,
  'Répertoire des options de base dans l''enseignement secondaire ordinaire de plein exercice.',
  'https://www.gallilex.cfwb.be/document/pdf/45721_000.pdf',
  ARRAY['options', 'répertoire', 'grille horaire', 'secondaire', 'choix']
),
(
  'Décret du 7 février 2019 - Accueil des élèves allophones (DASPA/FLA)',
  'incontournable_secondaire_specialise', 'texte_legal', '46275', false,
  'Accueil, scolarisation et accompagnement des élèves qui ne maîtrisent pas la langue de l''enseignement. DASPA, FLA.',
  'https://www.gallilex.cfwb.be/document/pdf/46275_000.pdf',
  ARRAY['allophone', 'DASPA', 'FLA', 'primo-arrivant', 'langue', 'accueil', 'intégration']
),
(
  'Décret du 28 mars 2019 - Cellule de soutien et d''accompagnement',
  'incontournable_secondaire_specialise', 'texte_legal', '47237', false,
  'Organisation de la cellule de soutien et d''accompagnement pour les directions d''établissement.',
  'https://www.gallilex.cfwb.be/document/pdf/47237_000.pdf',
  ARRAY['cellule soutien', 'accompagnement', 'direction', 'aide']
),
(
  'AGCF du 3 juillet 2019 - Profil de la fonction d''éducateur',
  'incontournable_secondaire_specialise', 'texte_legal', '47114', false,
  'Profil de la fonction d''éducateur dans l''enseignement secondaire de plein exercice et en alternance.',
  'https://www.gallilex.cfwb.be/document/pdf/47114_000.pdf',
  ARRAY['éducateur', 'profil', 'fonction', 'secondaire']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;


-- ============================================================
-- ESAHR FACULTATIF
-- ============================================================

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES (
  'Décret du 15 mars 1999 - Formation en cours de carrière ESAHR',
  'incontournable_secondaire_specialise', 'texte_legal', '23189', false,
  'Organisation de la formation en cours de carrière dans l''enseignement secondaire artistique à horaire réduit.',
  'https://www.gallilex.cfwb.be/document/pdf/23189_000.pdf',
  ARRAY['ESAHR', 'formation', 'carrière', 'artistique']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;


-- ============================================================
-- POUR INFO (pas dans la formation mais utile)
-- ============================================================

INSERT INTO public.documents (title, category, type, cda_code, is_core, summary, source_url, tags)
VALUES (
  'Décret relatif au soutien et à l''évaluation des personnels de l''enseignement',
  'organisation', 'texte_legal', '51683', false,
  'Soutien, développement des compétences professionnelles et évaluation des personnels de l''enseignement. Ne fait pas partie de la formation FID mais est informatif.',
  'https://www.gallilex.cfwb.be/document/pdf/51683_000.pdf',
  ARRAY['évaluation', 'personnel', 'compétences', 'soutien', 'développement professionnel']
)
ON CONFLICT ((cda_code)) WHERE cda_code IS NOT NULL DO UPDATE SET
  title = EXCLUDED.title, summary = EXCLUDED.summary, tags = EXCLUDED.tags, source_url = EXCLUDED.source_url;
