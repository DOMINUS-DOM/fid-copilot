-- ============================================================
-- Migration 006 : Documents d'école (upload utilisateur)
-- ============================================================
-- Permet aux directeurs d'uploader leurs documents internes
-- (ROI, règlement, projet, plan de pilotage, notes).
-- Ces documents fournissent un contexte LOCAL — ils ne remplacent
-- jamais les textes légaux officiels.
-- ============================================================

-- ============================================================
-- ÉTAPE 1 : Table school_documents (métadonnées)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.school_documents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  doc_type    text NOT NULL CHECK (doc_type IN (
    'roi', 'reglement_etudes', 'projet_etablissement',
    'plan_pilotage', 'note_interne', 'autre'
  )),
  file_path   text NOT NULL,
  file_size   integer NOT NULL,
  page_count  integer,
  chunk_count integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_school_docs_user ON public.school_documents (user_id);

-- ============================================================
-- ÉTAPE 2 : Table school_chunks (texte découpé par page)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.school_chunks (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_doc_id   uuid NOT NULL REFERENCES public.school_documents(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chunk_index     integer NOT NULL,
  chunk_title     text,
  content         text NOT NULL,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_school_chunks_user ON public.school_chunks (user_id);
CREATE INDEX IF NOT EXISTS idx_school_chunks_doc ON public.school_chunks (school_doc_id);
CREATE INDEX IF NOT EXISTS idx_school_chunks_fts
  ON public.school_chunks
  USING gin (to_tsvector('french', content));

-- ============================================================
-- ÉTAPE 3 : RLS — chaque utilisateur voit uniquement ses données
-- ============================================================

ALTER TABLE public.school_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own school docs"
  ON public.school_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own school docs"
  ON public.school_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own school docs"
  ON public.school_documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

ALTER TABLE public.school_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own school chunks"
  ON public.school_chunks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own school chunks"
  ON public.school_chunks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own school chunks"
  ON public.school_chunks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- ÉTAPE 4 : Bucket Supabase Storage
-- ============================================================
-- À créer manuellement dans le dashboard Supabase :
-- 1. Storage > Create bucket > name: "school-docs" > Private
-- 2. Policies :
--    - INSERT: bucket_id = 'school-docs' AND (storage.foldername(name))[1] = auth.uid()::text
--    - SELECT: bucket_id = 'school-docs' AND (storage.foldername(name))[1] = auth.uid()::text
--    - DELETE: bucket_id = 'school-docs' AND (storage.foldername(name))[1] = auth.uid()::text
