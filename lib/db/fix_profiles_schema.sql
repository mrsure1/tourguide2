-- ==========================================
-- profiles 테이블에 누락된 avatar_url 컬럼 추가
-- ==========================================

-- 1. avatar_url 컬럼이 없는 경우 추가
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. 스키마 캐시 갱신을 위해 권한 재설정 (필요한 경우)
-- 이전에 실행한 RLS 정책이 있다면 이 컬럼에도 적용됩니다.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT ON public.profiles TO public;
