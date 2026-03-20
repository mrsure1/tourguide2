-- GuideMatch i18n schema draft
-- Created: 2026-03-19
--
-- Purpose:
-- 1. Store user locale preference
-- 2. Add multilingual fields for guide and tour content
-- 3. Keep existing source columns as fallback during migration

begin;

alter table if exists profiles
  add column if not exists preferred_locale text
  check (preferred_locale in ('en', 'ko'));

comment on column profiles.preferred_locale is
  'UI locale preference for the signed-in user. Expected values: en, ko.';

alter table if exists guides_detail
  add column if not exists bio_i18n jsonb not null default '{}'::jsonb;

comment on column guides_detail.bio_i18n is
  'Localized guide bio. Example: {"ko":"...","en":"..."}';

alter table if exists tours
  add column if not exists title_i18n jsonb not null default '{}'::jsonb,
  add column if not exists description_i18n jsonb not null default '{}'::jsonb,
  add column if not exists region_code text;

comment on column tours.title_i18n is
  'Localized tour title. Example: {"ko":"...","en":"..."}';

comment on column tours.description_i18n is
  'Localized tour description. Example: {"ko":"...","en":"..."}';

comment on column tours.region_code is
  'Canonical region code for locale-independent filtering. Example: SEOUL, BUSAN, JEJU.';

create index if not exists idx_profiles_preferred_locale
  on profiles (preferred_locale);

create index if not exists idx_guides_detail_bio_i18n
  on guides_detail using gin (bio_i18n);

create index if not exists idx_tours_title_i18n
  on tours using gin (title_i18n);

create index if not exists idx_tours_description_i18n
  on tours using gin (description_i18n);

create index if not exists idx_tours_region_code
  on tours (region_code);

-- Initial backfill from existing source columns.
-- Existing Korean content is copied into the ko branch for safe fallback.
update guides_detail
set bio_i18n = jsonb_strip_nulls(
  coalesce(bio_i18n, '{}'::jsonb) || jsonb_build_object('ko', bio)
)
where bio is not null
  and trim(bio) <> ''
  and coalesce(bio_i18n->>'ko', '') = '';

update tours
set
  title_i18n = jsonb_strip_nulls(
    coalesce(title_i18n, '{}'::jsonb) || jsonb_build_object('ko', title)
  ),
  description_i18n = jsonb_strip_nulls(
    coalesce(description_i18n, '{}'::jsonb) || jsonb_build_object('ko', description)
  )
where
  (title is not null and trim(title) <> '' and coalesce(title_i18n->>'ko', '') = '')
  or
  (description is not null and trim(description) <> '' and coalesce(description_i18n->>'ko', '') = '');

commit;
