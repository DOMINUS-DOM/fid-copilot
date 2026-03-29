-- ============================================================
-- Migration 007 : Decision Engine
-- ============================================================
-- Stocke les analyses décisionnelles pour suivi et archivage.
-- Chaque décision est liée à un utilisateur avec RLS.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.decisions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  situation   text NOT NULL,
  category    text CHECK (category IN (
    'recours', 'discipline', 'personnel', 'inspection', 'parents', 'autre'
  )),
  urgency     text CHECK (urgency IN ('immediat', 'semaine', 'planifier')),
  analysis    text NOT NULL,
  status      text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  resolved_at timestamptz,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_decisions_user ON public.decisions (user_id);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON public.decisions (user_id, status);

ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own decisions"
  ON public.decisions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
