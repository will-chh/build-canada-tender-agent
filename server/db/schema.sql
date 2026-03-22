-- Enable pgvector extension
create extension if not exists vector;

-- Profiles
create table profiles (
  id                    uuid primary key default gen_random_uuid(),
  company_name          text not null,
  naics_codes           text[] default '{}',
  capabilities          text,
  province              text,
  city                  text,
  certifications        text[] default '{}',
  canadian_content_pct  integer default 0,
  created_at            timestamptz default now()
);

-- Tenders
create table tenders (
  id                      uuid primary key default gen_random_uuid(),
  title                   text not null,
  description             text,
  closing_date            date,
  department              text,
  estimated_value         text,
  required_certifications text[] default '{}',
  naics_codes             text[] default '{}',
  source_url              text,
  embedding               vector(1536),
  created_at              timestamptz default now()
);

-- Form checklists
create table form_checklists (
  id               uuid primary key default gen_random_uuid(),
  tender_id        uuid references tenders(id),
  form_name        text not null,
  form_description text,
  form_url         text,
  is_mandatory     boolean default true,
  status           text default 'not_started' check (status in ('not_started', 'in_progress', 'done')),
  created_at       timestamptz default now()
);

-- Vector similarity index on tenders
create index on tenders
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 10);
