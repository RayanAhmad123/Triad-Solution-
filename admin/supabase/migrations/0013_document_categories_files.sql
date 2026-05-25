-- Documents: categories (folders) + file attachments.
--
-- Adds a `kind` column to `documents` so a row can be either a
-- regular document (with tiptap content) or a category (a folder that
-- groups child documents/categories and holds uploaded files).
--
-- Also adds a `document_files` table for arbitrary file uploads attached
-- to a document/category, stored in a new `documents` storage bucket.

-- DOCUMENT KIND -------------------------------------------------------
alter table public.documents
  add column if not exists kind text not null default 'document';

alter table public.documents
  drop constraint if exists documents_kind_check;
alter table public.documents
  add constraint documents_kind_check check (kind in ('document', 'category'));

create index if not exists documents_kind_idx on public.documents (kind);

-- DOCUMENT FILES ------------------------------------------------------
create table if not exists public.document_files (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  label text,
  file_path text not null, -- path inside the 'documents' storage bucket
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references public.profiles(id) on delete set null,
  uploaded_at timestamptz default now()
);
create index if not exists document_files_document_idx on public.document_files (document_id);

-- RLS -----------------------------------------------------------------
alter table public.document_files enable row level security;
drop policy if exists document_files_member on public.document_files;
create policy document_files_member on public.document_files
  for all using (public.is_member()) with check (public.is_member());

-- STORAGE BUCKET ------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

do $$
declare
  op text;
  pol text;
begin
  foreach op in array array['select','insert','update','delete']
  loop
    pol := 'documents_' || op;
    execute format('drop policy if exists %I on storage.objects;', pol);
    if op = 'insert' then
      execute format(
        'create policy %I on storage.objects for %s with check (bucket_id = %L and public.is_member());',
        pol, op, 'documents'
      );
    else
      execute format(
        'create policy %I on storage.objects for %s using (bucket_id = %L and public.is_member());',
        pol, op, 'documents'
      );
    end if;
  end loop;
end $$;
