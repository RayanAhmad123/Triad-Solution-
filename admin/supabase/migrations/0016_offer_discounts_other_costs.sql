-- Rabatter per priskategori + fritextfält för övriga (rörliga) kostnader.
-- - project_discount_pct: rabatt i % på engångskostnaden
-- - monthly_discount_pct: rabatt i % på månadsavgiften
-- - other_costs: fri text för rörliga kostnader (royalty, arvode/beställning, etc.)
--   som inte hör hemma i totalsumman men ska synas i offerten.

alter table public.offers
  add column if not exists project_discount_pct numeric(5,2) not null default 0,
  add column if not exists monthly_discount_pct numeric(5,2) not null default 0,
  add column if not exists other_costs text;

-- Sanity checks: rabatten ska vara 0–100 %.
alter table public.offers
  drop constraint if exists offers_project_discount_pct_chk;
alter table public.offers
  add constraint offers_project_discount_pct_chk
  check (project_discount_pct >= 0 and project_discount_pct <= 100);

alter table public.offers
  drop constraint if exists offers_monthly_discount_pct_chk;
alter table public.offers
  add constraint offers_monthly_discount_pct_chk
  check (monthly_discount_pct >= 0 and monthly_discount_pct <= 100);
