-- ========================================================
-- availability 테이블의 외래 키 참조 변경
-- guides_detail -> profiles (회원이면 일단 일정 등록 가능하도록)
-- ========================================================

-- 1. 기존 제약 조건 삭제
ALTER TABLE public.availability 
DROP CONSTRAINT IF EXISTS availability_guide_id_fkey;

-- 2. profiles 테이블을 참조하도록 새로운 제약 조건 추가
ALTER TABLE public.availability 
ADD CONSTRAINT availability_guide_id_fkey 
FOREIGN KEY (guide_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;
