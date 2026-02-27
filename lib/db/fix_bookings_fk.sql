-- ========================================================
-- bookings 테이블의 외래 키 참조 변경
-- guides_detail -> profiles
-- ========================================================

-- 1. 기존 제약 조건 삭제
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_guide_id_fkey;

-- 2. profiles 테이블을 참조하도록 새로운 제약 조건 추가
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_guide_id_fkey 
FOREIGN KEY (guide_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;
