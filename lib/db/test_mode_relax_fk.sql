-- ========================================================
-- [테스트 모드] 제약 조건 완화 안내 및 SQL
-- 상세 프로필(guides_detail)이 없는 사용자도 예약 가능하게 함
-- ========================================================

-- 1. 기존 상세 프로필 참조 외래 키 삭제
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_guide_id_fkey;

-- 2. 다시 profiles 테이블을 참조하도록 외래 키 설정 (임시)
-- 이 작업을 통해 모든 가이드(프로필만 있는 경우 포함)에게 예약이 가능해집니다.
ALTER TABLE public.bookings 
ADD CONSTRAINT bookings_guide_id_fkey 
FOREIGN KEY (guide_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

COMMENT ON CONSTRAINT bookings_guide_id_fkey ON public.bookings IS '테스트를 위해 일시적으로 profiles를 참조하도록 완화함';
