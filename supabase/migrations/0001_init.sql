-- BJT Pro — initial schema for the Japanese Letter to Nepali Explainer.
-- Designed as an audit trail of sensitive interpretations, with Row Level
-- Security so each user can only access their own data.
--
-- Apply with the Supabase SQL editor or `supabase db push`.
-- Create the project in the Tokyo (ap-northeast-1) region.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  locale text default 'ne',
  plan text default 'free',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Uploaded documents (original artifacts live in private Storage bucket)
-- ---------------------------------------------------------------------------
create table if not exists public.document_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text,
  mime_type text,
  page_count int default 1,
  sha256 text,
  created_at timestamptz not null default now(),
  delete_at timestamptz default (now() + interval '7 days')
);

create table if not exists public.document_pages (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.document_uploads (id) on delete cascade,
  page_no int not null,
  preview_path text,
  quality_score numeric,
  width int,
  height int
);

-- ---------------------------------------------------------------------------
-- Pipeline outputs
-- ---------------------------------------------------------------------------
create table if not exists public.ocr_runs (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.document_uploads (id) on delete cascade,
  provider text,
  raw_text text,
  structured_ocr_jsonb jsonb,
  avg_confidence numeric,
  duration_ms int,
  created_at timestamptz not null default now()
);

create table if not exists public.classifications (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.document_uploads (id) on delete cascade,
  predicted_type text,
  confidence numeric,
  alt_types_jsonb jsonb default '[]',
  model_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.extractions (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.document_uploads (id) on delete cascade,
  data_jsonb jsonb not null default '{}',
  completeness_score numeric,
  rule_validation_jsonb jsonb default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.explanations (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.document_uploads (id) on delete cascade,
  lang text not null default 'ne',
  summary text,
  body text,
  actions_jsonb jsonb default '[]',
  risks_jsonb jsonb default '[]',
  created_at timestamptz not null default now()
);

create table if not exists public.reply_drafts (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.document_uploads (id) on delete cascade,
  lang text not null default 'ja',
  tone text,
  draft_text text,
  user_confirmed_facts jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.human_reviews (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.document_uploads (id) on delete cascade,
  status text not null default 'queued',
  reviewer_id uuid,
  notes_jsonb jsonb default '{}',
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback_events (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.document_uploads (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  field_name text,
  was_correct boolean,
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text,
  resource_type text,
  resource_id uuid,
  ip text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security: users can only touch their own rows.
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.document_uploads enable row level security;
alter table public.document_pages enable row level security;
alter table public.ocr_runs enable row level security;
alter table public.classifications enable row level security;
alter table public.extractions enable row level security;
alter table public.explanations enable row level security;
alter table public.reply_drafts enable row level security;
alter table public.human_reviews enable row level security;
alter table public.feedback_events enable row level security;

create policy "own profile" on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "own documents" on public.document_uploads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Child tables: ownership is derived from the parent document.
create or replace function public.owns_document(doc uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.document_uploads d
    where d.id = doc and d.user_id = auth.uid()
  );
$$;

create policy "own pages" on public.document_pages
  for all using (public.owns_document(document_id)) with check (public.owns_document(document_id));
create policy "own ocr" on public.ocr_runs
  for all using (public.owns_document(document_id)) with check (public.owns_document(document_id));
create policy "own classifications" on public.classifications
  for all using (public.owns_document(document_id)) with check (public.owns_document(document_id));
create policy "own extractions" on public.extractions
  for all using (public.owns_document(document_id)) with check (public.owns_document(document_id));
create policy "own explanations" on public.explanations
  for all using (public.owns_document(document_id)) with check (public.owns_document(document_id));
create policy "own reply drafts" on public.reply_drafts
  for all using (public.owns_document(document_id)) with check (public.owns_document(document_id));
create policy "own reviews" on public.human_reviews
  for all using (public.owns_document(document_id)) with check (public.owns_document(document_id));
create policy "own feedback" on public.feedback_events
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Private Storage bucket for original documents (policies via SQL).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

create policy "users read own files" on storage.objects
  for select using (bucket_id = 'documents' and owner = auth.uid());
create policy "users upload own files" on storage.objects
  for insert with check (bucket_id = 'documents' and owner = auth.uid());
create policy "users delete own files" on storage.objects
  for delete using (bucket_id = 'documents' and owner = auth.uid());
