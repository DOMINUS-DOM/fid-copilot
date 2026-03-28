-- ============================================================
-- Migration 003 : Ajouter un rôle utilisateur à profiles
-- ============================================================

-- 1. Créer le type enum
CREATE TYPE public.user_role AS ENUM ('user', 'admin');

-- 2. Ajouter la colonne avec valeur par défaut
ALTER TABLE public.profiles
ADD COLUMN role public.user_role NOT NULL DEFAULT 'user';

-- 3. Se définir admin (remplacer l'email par le vôtre)
-- UPDATE public.profiles SET role = 'admin' WHERE id = (
--   SELECT id FROM auth.users WHERE email = 'votre-email@exemple.com'
-- );
