-- ============================================================
-- Migration 008 : Enrichissement legal_chunks pour citations exactes
-- ============================================================
-- Objectif : permettre à l'assistant de citer exactement :
-- "Arrêté royal du 29 juin 1984, article 5 § 3"
-- au lieu de deviner ou inventer un article.
-- ============================================================

-- Nouvelles colonnes structurées
ALTER TABLE public.legal_chunks
  ADD COLUMN IF NOT EXISTS source_title text,
  ADD COLUMN IF NOT EXISTS article_number text,
  ADD COLUMN IF NOT EXISTS paragraph text,
  ADD COLUMN IF NOT EXISTS citation_display text;

-- source_title  : "Arrêté Royal du 29 juin 1984 - Organisation de l'enseignement secondaire"
-- article_number: "5" ou "13bis" ou NULL si pas d'article détecté
-- paragraph     : "1" ou "3" ou NULL si pas de §
-- citation_display : "Article 5 § 1er de l'Arrêté royal du 29 juin 1984 (CDA 10450)"
--   → prêt à être injecté tel quel dans la réponse de l'assistant

-- Index pour recherche par article
CREATE INDEX IF NOT EXISTS idx_legal_chunks_article
  ON public.legal_chunks (cda_code, article_number)
  WHERE article_number IS NOT NULL;

COMMENT ON COLUMN public.legal_chunks.source_title IS 'Titre complet du texte source (ex: Décret du 24 juillet 1997 - Missions prioritaires)';
COMMENT ON COLUMN public.legal_chunks.article_number IS 'Numéro d''article extrait (ex: 5, 13bis, 21ter). NULL si pas d''article identifié.';
COMMENT ON COLUMN public.legal_chunks.paragraph IS 'Numéro de paragraphe § si présent (ex: 1, 2, 3). NULL sinon.';
COMMENT ON COLUMN public.legal_chunks.citation_display IS 'Citation prête à être utilisée par l''assistant (ex: Article 5 § 1er du Code de l''enseignement (CDA 49466))';
