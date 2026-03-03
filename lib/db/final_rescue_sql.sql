-- ========================================================
-- [🚨 최후의 수단] 샘플 가이드 및 예약 에러 완벽 해결 SQL
-- 이 스크립트는 모든 제약 조건 충돌을 무시하고 데이터를 강제 삽입합니다.
-- ========================================================

-- 1. profiles 테이블의 auth.users 참조 제약 조건 제거
-- (샘플 가이드가 실제 가입 없이도 DB에 존재할 수 있게 함)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. bookings 테이블의 가이드 참조 대상을 profiles(id)로 최종 고정
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_guide_id_fkey;
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_guide_id_fkey 
FOREIGN KEY (guide_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 3. 샘플 가이드 프로필 강제 삽입 (가이드 Gina 포함)
INSERT INTO public.profiles (id, full_name, role, avatar_url, email)
VALUES 
('11111111-1111-1111-1111-111111111111', '박성진 (James)', 'guide', '/images/guides/guide_seoul_man.png', 'james@sample.com'),
('22222222-2222-2222-2222-222222222222', '이소연 (Soyeon)', 'guide', '/images/guides/guide_busan_woman.png', 'soyeon@sample.com'),
('33333333-3333-3333-3333-333333333333', '이현우 (Henry)', 'guide', '/images/guides/guide_culture_man.png', 'henry@sample.com'),
('44444444-4444-4444-4444-444444444444', '김지나 (Gina)', 'guide', '/images/guides/guide_fashion_woman.png', 'gina@sample.com'),
('1d1742de-7c17-4ffa-9f73-41a29d6eadc2', '김민수 (Minsoo)', 'guide', '/images/guides/guide_bukchon_man.png', 'minsoo@sample.com')
ON CONFLICT (id) DO UPDATE 
SET full_name = EXCLUDED.full_name, role = 'guide', avatar_url = EXCLUDED.avatar_url;

-- 4. 가이드 상세 정보 강제 삽입
INSERT INTO public.guides_detail (id, location, languages, bio, hourly_rate, rate_type, rating, review_count, is_verified)
VALUES 
('11111111-1111-1111-1111-111111111111', '서울 강남/이태원', '{한국어, 영어, 일본어}', '글로벌 라이프스타일 가이드입니다.', 80000, 'hourly', 4.9, 156, true),
('22222222-2222-2222-2222-222222222222', '부산 해운대/광안리', '{한국어, 영어}', '부산 로컬 에너지를 전달해 드립니다.', 150000, 'daily', 4.8, 92, true),
('33333333-3333-3333-3333-333333333333', '서울 고궁/종로', '{한국어, 영어, 중국어}', '역사와 인문학이 함께하는 서울 여행입니다.', 250000, 'daily', 5.0, 210, true),
('44444444-4444-4444-4444-444444444444', '서울 한남/압구정', '{한국어, 프랑스어, 영어}', '당신만의 스타일을 찾는 서울 쇼핑 투어입니다.', 100000, 'hourly', 4.7, 85, true),
('1d1742de-7c17-4ffa-9f73-41a29d6eadc2', '서울 북촌/서촌', '{한국어, 영어}', '전통과 쉼이 있는 북촌 한옥 가이드입니다.', 60000, 'hourly', 4.9, 124, true)
ON CONFLICT (id) DO UPDATE
SET location = EXCLUDED.location, bio = EXCLUDED.bio;

-- 5. 변경 사항 확인
SELECT id, full_name, role FROM public.profiles WHERE role = 'guide';
