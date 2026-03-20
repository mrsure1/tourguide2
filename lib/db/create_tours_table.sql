-- tours 테이블 생성 스크립트
-- 새 구조:
-- 1. 한국어 원문은 *_ko
-- 2. 영어 번역본은 *_en
-- 3. 기존 title/description/region은 하위 호환용으로 유지

create table if not exists public.tours (
    id uuid primary key default gen_random_uuid(),
    guide_id uuid not null references public.profiles(id) on delete cascade,

    -- 하위 호환용 legacy 컬럼
    title text not null,
    description text not null,
    region text not null,

    -- 다국어 컬럼
    title_ko text not null,
    title_en text,
    description_ko text not null,
    description_en text,
    region_ko text not null,
    region_en text,
    meeting_point_ko text,
    meeting_point_en text,
    included_items_ko text[] default '{}'::text[],
    included_items_en text[] default '{}'::text[],

    duration integer not null,
    price integer not null,
    max_guests integer not null default 4,
    photo text,
    included_items text[] default '{}',
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.tours enable row level security;

drop policy if exists "Allow public read access on tours" on public.tours;
create policy "Allow public read access on tours"
on public.tours for select
using (true);

drop policy if exists "Allow individual tour management" on public.tours;
create policy "Allow individual tour management"
on public.tours for all
using (auth.uid() = guide_id);

create index if not exists idx_tours_guide_id on public.tours(guide_id);
create index if not exists idx_tours_region on public.tours(region);
create index if not exists idx_tours_region_ko on public.tours(region_ko);
create index if not exists idx_tours_title_en on public.tours(title_en);

drop trigger if exists update_tours_modtime on public.tours;
create trigger update_tours_modtime
before update on public.tours
for each row execute procedure update_modified_column();
