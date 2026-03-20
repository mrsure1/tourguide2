-- Guide bio multilingual column
-- Existing Korean bio is preserved in the ko branch.
-- English content is backfilled later by scripts/backfill_existing_translations.mjs.

begin;

alter table if exists public.guides_detail
  add column if not exists bio_i18n jsonb not null default '{}'::jsonb;

comment on column public.guides_detail.bio_i18n is
  'Localized guide bio. Example: {"ko":"...","en":"..."}';

create index if not exists idx_guides_detail_bio_i18n
  on public.guides_detail using gin (bio_i18n);

update public.guides_detail
set bio_i18n = jsonb_strip_nulls(
  coalesce(bio_i18n, '{}'::jsonb) || jsonb_build_object('ko', bio)
)
where bio is not null
  and trim(bio) <> ''
  and coalesce(bio_i18n->>'ko', '') = '';

commit;
