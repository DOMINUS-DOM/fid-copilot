-- Migration: Add metadata JSONB column to assistant_logs
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
--
-- This column stores the pipeline audit trail for each response:
-- - cdaRouted: CDA codes identified
-- - pivotArticles: pivot articles injected
-- - articlesSentToLlm: article numbers in the LLM context
-- - model: LLM model used (gemini-2.5-flash or gpt-4o-mini)
-- - confidence: high/medium/low
-- - latencyMs: LLM response time
-- - citationGuard: verified/unverified citations

ALTER TABLE public.assistant_logs
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT NULL;

-- Optional: index for querying by model or confidence
CREATE INDEX IF NOT EXISTS idx_assistant_logs_metadata_model
ON public.assistant_logs ((metadata->>'model'));

COMMENT ON COLUMN public.assistant_logs.metadata IS
'Pipeline audit trail: cdaRouted, pivotArticles, articlesSentToLlm, model, confidence, latencyMs, citationGuard';
