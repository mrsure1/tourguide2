-- ==========================================
-- availability 테이블에 누락된 reason 컬럼 추가
-- ==========================================

-- 1. reason 컬럼이 없는 경우 추가
ALTER TABLE public.availability 
ADD COLUMN IF NOT EXISTS reason TEXT;

-- 2. 권한 재설정 (필요한 경우)
GRANT ALL ON public.availability TO authenticated;
GRANT ALL ON public.availability TO service_role;
GRANT SELECT ON public.availability TO public;
