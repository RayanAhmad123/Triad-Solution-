-- Kundens juridiska identitetsuppgifter som krävs för SaaS-avtal och PUB-avtal.
-- Organisationsnummer och adress fylls automatiskt in i avtalen som genereras
-- tillsammans med offerten. En offert kan inte exporteras utan dessa.

alter table public.customers
  add column if not exists org_number text,
  add column if not exists address text;
