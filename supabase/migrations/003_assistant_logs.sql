-- ============================================================
-- Table assistant_logs : historique des questions posées
-- ============================================================

create table public.assistant_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  question text not null,
  created_at timestamptz default now() not null
);

-- Index pour accélérer les requêtes par utilisateur
create index idx_assistant_logs_user_id on public.assistant_logs (user_id);

-- ============================================================
-- RLS : chaque utilisateur accède uniquement à ses propres logs
-- ============================================================

alter table public.assistant_logs enable row level security;

create policy "Les utilisateurs peuvent lire leurs propres logs"
  on public.assistant_logs for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Les utilisateurs peuvent insérer leurs propres logs"
  on public.assistant_logs for insert
  to authenticated
  with check (auth.uid() = user_id);
