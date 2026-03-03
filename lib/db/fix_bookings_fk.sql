-- ========================================================
-- bookings 테이블의 외래 키 참조 변경
-- guide_id: auth.users -> profiles (샘플 가이드 예약 가능하도록)
-- ========================================================

-- 1. 기존 제약 조건 이름 확인 필요 (일반적으로 bookings_guide_id_fkey)
-- 기존 제약 조건 삭제
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_guide_id_fkey;

-- 2. profiles 테이블을 참조하도록 새로운 제약 조건 추가
-- 이제 auth.users에 없는 가이드 ID라도 profiles에만 있으면 예약이 가능합니다.
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_guide_id_fkey 
FOREIGN KEY (guide_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- 3. traveler_id도 만약을 위해 profiles를 참조하도록 변경 (선택 사항이지만 안전함)
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_traveler_id_fkey;

ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_traveler_id_fkey 
FOREIGN KEY (traveler_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;
