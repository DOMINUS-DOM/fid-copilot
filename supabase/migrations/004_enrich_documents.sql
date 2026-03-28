-- ============================================================
-- Migration 004 : Enrichissement de la table documents
-- À exécuter dans l'éditeur SQL de Supabase (Dashboard > SQL Editor)
-- ============================================================
-- ORDRE D'EXÉCUTION : les 3 blocs dans l'ordre, un par un si besoin.
-- Chaque bloc est idempotent (safe à re-exécuter).

-- ============================================================
-- ÉTAPE 1 : Ajouter les valeurs manquantes à l'ENUM document_type
-- ============================================================
-- Actuellement : texte_legal, synthese, guide, portfolio
-- On ajoute  : methodologie, organisation
--
-- POURQUOI : permet de distinguer les guides méthodologiques FID
-- (vade-mecum, consignes d'évaluation) des textes d'organisation
-- (calendrier, structure de la formation). Le scoring utilise déjà
-- ces types côté TypeScript.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'methodologie' AND enumtypid = 'document_type'::regtype) THEN
    ALTER TYPE document_type ADD VALUE 'methodologie';
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'organisation' AND enumtypid = 'document_type'::regtype) THEN
    ALTER TYPE document_type ADD VALUE 'organisation';
  END IF;
END$$;


-- ============================================================
-- ÉTAPE 2 : Ajouter la colonne tags (text[])
-- ============================================================
-- POURQUOI : mots-clés de retrieval. Permet un matching plus fin
-- que title/summary seuls. Le scoring accorde +3 par keyword match
-- dans les tags (vs +5 dans le titre, +2 dans le summary).
-- Format : array de textes courts, ex: {"inscription", "exclusion", "recours"}
-- ============================================================

ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT NULL;

COMMENT ON COLUMN documents.tags IS 'Mots-clés de retrieval pour le scoring de pertinence. Ex: {"inscription", "exclusion", "recours"}';


-- ============================================================
-- ÉTAPE 3 (optionnel) : Peupler les tags des documents existants
-- ============================================================
-- Adapte les titres ci-dessous à tes documents réels.
-- Tu peux modifier/compléter les tags à tout moment.
-- ============================================================

UPDATE documents SET tags = ARRAY[
  'enseignement', 'inscription', 'exclusion', 'obligation scolaire',
  'redoublement', 'recours', 'discipline', 'gratuité', 'programme'
] WHERE title ILIKE '%code de l''enseignement%' OR title ILIKE '%code enseignement%';

UPDATE documents SET tags = ARRAY[
  'missions', 'école', 'enseignement', 'objectifs', 'neutralité',
  'participation', 'conseil', 'projet éducatif'
] WHERE title ILIKE '%décret missions%';

UPDATE documents SET tags = ARRAY[
  'directeur', 'statut', 'nomination', 'désignation', 'barème',
  'ancienneté', 'évaluation', 'fonction', 'mandat'
] WHERE title ILIKE '%statut%directeur%' OR title ILIKE '%directeur%statut%';

UPDATE documents SET tags = ARRAY[
  'direction', 'profil', 'fonction', 'compétence', 'pilotage',
  'leadership', 'management', 'pédagogique', 'administratif', 'relationnel'
] WHERE title ILIKE '%profil de fonction%' OR title ILIKE '%fonction-type%';

UPDATE documents SET tags = ARRAY[
  'portfolio', 'réflexif', 'compétence', 'développement professionnel',
  'trace', 'autoévaluation', 'posture', 'identité professionnelle'
] WHERE title ILIKE '%portfolio%';

UPDATE documents SET tags = ARRAY[
  'fid', 'formation', 'organisation', 'calendrier', 'module',
  'évaluation', 'certificative', 'programme'
] WHERE title ILIKE '%vade-mecum%' OR title ILIKE '%organisation%fid%' OR title ILIKE '%guide%fid%';
