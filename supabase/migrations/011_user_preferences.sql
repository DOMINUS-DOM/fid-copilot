-- ============================================================
-- Migration 011 : Préférences utilisateur
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_preferences (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name    text,
  last_name     text,
  job_title     text DEFAULT 'Directeur/Directrice',
  school_name   text,
  school_network text,
  school_level  text,
  default_tone  text DEFAULT 'neutre' CHECK (default_tone IN ('neutre','ferme','apaisant','formel')),
  default_mode  text DEFAULT 'terrain' CHECK (default_mode IN ('examen','terrain','portfolio')),
  default_length text DEFAULT 'standard' CHECK (default_length IN ('courte','standard','detaillee')),
  signature     text,
  closing_formula text DEFAULT 'Veuillez agréer l''expression de mes salutations distinguées.',
  updated_at    timestamptz DEFAULT now()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own preferences"
  ON public.user_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
