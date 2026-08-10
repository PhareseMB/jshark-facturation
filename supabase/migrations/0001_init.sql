-- J-SHARK Facturation — schéma initial (clients, documents, lignes, compteurs) + RLS

create extension if not exists "pgcrypto";

-- =========================================================================
-- clients
-- =========================================================================
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  nom text not null,
  adresse text,
  email text,
  created_at timestamptz not null default now()
);

create index clients_user_id_idx on public.clients(user_id);

alter table public.clients enable row level security;

create policy "clients_select_own" on public.clients
  for select using (auth.uid() = user_id);
create policy "clients_insert_own" on public.clients
  for insert with check (auth.uid() = user_id);
create policy "clients_update_own" on public.clients
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "clients_delete_own" on public.clients
  for delete using (auth.uid() = user_id);

-- =========================================================================
-- documents (factures et devis)
-- =========================================================================
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  type text not null check (type in ('facture', 'devis')),
  numero text not null unique,
  client_id uuid not null references public.clients(id) on delete restrict,
  date_emission date not null default current_date,
  date_echeance date,
  taux_tva numeric(5, 2) not null default 20,
  notes text,
  -- Cycle facture : brouillon → envoyee → payee
  -- Cycle devis    : brouillon → envoye → accepte / refuse
  statut text not null default 'brouillon' check (
    statut in ('brouillon', 'envoyee', 'payee', 'envoye', 'accepte', 'refuse')
  ),
  total_ht numeric(12, 2) not null default 0,
  total_ttc numeric(12, 2) not null default 0,
  -- Renseigné quand une facture est générée depuis un devis accepté
  converti_depuis_id uuid references public.documents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index documents_user_id_idx on public.documents(user_id);
create index documents_client_id_idx on public.documents(client_id);
create index documents_type_statut_idx on public.documents(type, statut);

alter table public.documents enable row level security;

create policy "documents_select_own" on public.documents
  for select using (auth.uid() = user_id);
create policy "documents_insert_own" on public.documents
  for insert with check (auth.uid() = user_id);
create policy "documents_update_own" on public.documents
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "documents_delete_own" on public.documents
  for delete using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger documents_set_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

-- =========================================================================
-- document_lignes (lignes de prestation)
-- =========================================================================
create table public.document_lignes (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  description text not null,
  quantite numeric(10, 2) not null default 1,
  prix_unitaire numeric(12, 2) not null default 0,
  position int not null default 0
);

create index document_lignes_document_id_idx on public.document_lignes(document_id);

alter table public.document_lignes enable row level security;

-- Pas de colonne user_id ici : l'appartenance passe par le document parent.
create policy "document_lignes_select_own" on public.document_lignes
  for select using (
    exists (select 1 from public.documents d where d.id = document_id and d.user_id = auth.uid())
  );
create policy "document_lignes_insert_own" on public.document_lignes
  for insert with check (
    exists (select 1 from public.documents d where d.id = document_id and d.user_id = auth.uid())
  );
create policy "document_lignes_update_own" on public.document_lignes
  for update using (
    exists (select 1 from public.documents d where d.id = document_id and d.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.documents d where d.id = document_id and d.user_id = auth.uid())
  );
create policy "document_lignes_delete_own" on public.document_lignes
  for delete using (
    exists (select 1 from public.documents d where d.id = document_id and d.user_id = auth.uid())
  );

-- =========================================================================
-- compteurs (support de la numérotation séquentielle, voir 0002)
-- =========================================================================
create table public.compteurs (
  annee int not null,
  type text not null check (type in ('facture', 'devis')),
  dernier_numero int not null default 0,
  primary key (annee, type)
);

alter table public.compteurs enable row level security;

-- Lecture seule pour l'utilisateur authentifié ; les écritures ne passent
-- que par la fonction SECURITY DEFINER rpc_next_numero (voir 0002).
create policy "compteurs_select_authenticated" on public.compteurs
  for select using (auth.role() = 'authenticated');
