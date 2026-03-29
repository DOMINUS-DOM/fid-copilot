-- ============================================================
-- Migration 009 : Colonnes complémentaires legal_chunks
-- ============================================================
-- Ajoute : source_short_title, topics, education_level
-- Rend la recherche thématique + le filtrage par niveau possible.
-- ============================================================

ALTER TABLE public.legal_chunks
  ADD COLUMN IF NOT EXISTS source_short_title text,
  ADD COLUMN IF NOT EXISTS topics text[] DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS education_level text DEFAULT NULL;

-- Index pour filtrage par niveau d'enseignement
CREATE INDEX IF NOT EXISTS idx_legal_chunks_level
  ON public.legal_chunks (education_level)
  WHERE education_level IS NOT NULL;

-- Index GIN sur topics pour recherche thématique
CREATE INDEX IF NOT EXISTS idx_legal_chunks_topics
  ON public.legal_chunks USING gin (topics)
  WHERE topics IS NOT NULL;

COMMENT ON COLUMN public.legal_chunks.source_short_title IS 'Titre court pour affichage compact (ex: AR 29 juin 1984, Décret Missions)';
COMMENT ON COLUMN public.legal_chunks.topics IS 'Thèmes couverts par ce chunk (ex: {recours, redoublement, conseil de classe})';
COMMENT ON COLUMN public.legal_chunks.education_level IS 'Niveau d''enseignement : commun, secondaire, fondamental, specialise, esahr';
