-- ========================================================
-- bookings 테이블의 외래 키 참조 복구
-- profiles -> guides_detail (상세 프로필 필수화)
-- ========================================================

-- 1. 기존 제약 조건 삭제
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_guide_id_fkey;

-- 2. guides_detail 테이블을 참조하도록 복구
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_guide_id_fkey 
FOREIGN KEY (guide_id) 
REFERENCES public.guides_detail(id) 
ON DELETE CASCADE;
