-- ============================================================
-- Migration 012 : Permettre la suppression des logs par l'utilisateur
-- ============================================================

CREATE POLICY IF NOT EXISTS "Users can delete own logs"
  ON public.assistant_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
