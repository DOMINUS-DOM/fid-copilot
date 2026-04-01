-- Migration: Add rating column to assistant_logs
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
--
-- Stores user feedback: 'up', 'down', or NULL (no feedback yet).
-- Column is text (not enum) to allow future extension (e.g. comment, reason).

ALTER TABLE public.assistant_logs
ADD COLUMN IF NOT EXISTS rating text DEFAULT NULL;

-- Constraint: only allow valid values
ALTER TABLE public.assistant_logs
ADD CONSTRAINT assistant_logs_rating_check
CHECK (rating IS NULL OR rating IN ('up', 'down'));

COMMENT ON COLUMN public.assistant_logs.rating IS
'User feedback: up (helpful), down (not helpful), or NULL (no feedback)';
