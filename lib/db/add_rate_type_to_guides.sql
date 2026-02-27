-- ============================================
-- guides_detail 테이블에 요금 유형(rate_type) 컬럼 추가
-- ============================================

-- 1. 가이드 요금 유형 타입 생성 (이미 존재하면 무시)
DO $$ BEGIN
    CREATE TYPE rate_type AS ENUM ('daily', 'hourly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. rate_type 컬럼 추가 (기본값 'daily')
ALTER TABLE public.guides_detail 
ADD COLUMN IF NOT EXISTS rate_type TEXT DEFAULT 'daily';

-- 3. 기존 데이터가 있다면 daily로 설정 (TEXT로 추가했을 경우를 대비해 체크)
COMMENT ON COLUMN public.guides_detail.rate_type IS 'daily: 일당, hourly: 시간제 요금';
