-- tours 테이블용 다국어 컬럼 추가 스크립트
-- 목적:
-- 1. 기존 한국어 원문을 *_ko 컬럼에 보관
-- 2. AI 번역본을 *_en 컬럼에 저장
-- 3. 기존 title/description/region 컬럼은 하위 호환용으로 유지

begin;

alter table if exists public.tours
  add column if not exists title_ko text,
  add column if not exists title_en text,
  add column if not exists description_ko text,
  add column if not exists description_en text,
  add column if not exists region_ko text,
  add column if not exists region_en text,
  add column if not exists meeting_point_ko text,
  add column if not exists meeting_point_en text,
  add column if not exists included_items_ko text[] default '{}'::text[],
  add column if not exists included_items_en text[] default '{}'::text[];

comment on column public.tours.title_ko is '투어 제목 원문(한국어)';
comment on column public.tours.title_en is '투어 제목 영어 번역본';
comment on column public.tours.description_ko is '투어 소개 원문(한국어)';
comment on column public.tours.description_en is '투어 소개 영어 번역본';
comment on column public.tours.region_ko is '지역/미팅존 원문(한국어)';
comment on column public.tours.region_en is '지역/미팅존 영어 번역본';
comment on column public.tours.meeting_point_ko is '미팅장소 원문(한국어)';
comment on column public.tours.meeting_point_en is '미팅장소 영어 번역본';
comment on column public.tours.included_items_ko is '포함 항목 원문(한국어)';
comment on column public.tours.included_items_en is '포함 항목 영어 번역본';

update public.tours
set
  title_ko = coalesce(title_ko, title),
  description_ko = coalesce(description_ko, description),
  region_ko = coalesce(region_ko, region),
  included_items_ko = coalesce(included_items_ko, included_items)
where
  title_ko is null
  or description_ko is null
  or region_ko is null
  or included_items_ko is null;

commit;
