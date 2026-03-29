-- ============================================================
-- Migration 010 : Bibliothèque de modèles sauvegardés
-- ============================================================

CREATE TABLE IF NOT EXISTS public.saved_templates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  content     text NOT NULL,
  source      text NOT NULL CHECK (source IN ('assistant','decision','generateur','verification','manuel')),
  category    text NOT NULL CHECK (category IN ('courrier','reponse','convocation','note','procedure','formulation','autre')),
  tags        text[] DEFAULT NULL,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_templates_user ON public.saved_templates (user_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.saved_templates (user_id, category);

ALTER TABLE public.saved_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own templates"
  ON public.saved_templates FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
