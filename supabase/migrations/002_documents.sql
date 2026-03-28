-- ============================================================
-- Table documents : documents FID avec métadonnées
-- ============================================================

-- Types ENUM pour garantir la cohérence des données
create type public.document_category as enum (
  'incontournable_commun',
  'incontournable_secondaire_specialise',
  'synthese',
  'organisation',
  'fonction_direction',
  'portfolio'
);

create type public.document_type as enum (
  'texte_legal',
  'synthese',
  'guide',
  'portfolio'
);

-- Table principale
create table public.documents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category public.document_category not null,
  type public.document_type not null,
  cda_code text,
  is_core boolean default false not null,
  summary text,
  source_url text,
  created_at timestamptz default now() not null
);

-- Index pour accélérer les requêtes fréquentes
create index idx_documents_category on public.documents (category);
create index idx_documents_is_core on public.documents (is_core);

-- ============================================================
-- RLS : lecture seule pour les utilisateurs authentifiés
-- ============================================================

alter table public.documents enable row level security;

create policy "Les utilisateurs authentifiés peuvent lire les documents"
  on public.documents for select
  to authenticated
  using (true);

-- Pas de policy INSERT/UPDATE/DELETE :
-- seul un admin via le dashboard ou un service_role peut écrire.
