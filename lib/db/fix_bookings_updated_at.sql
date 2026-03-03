-- ========================================================
-- [수정판] bookings 테이블에 누락된 updated_at 컬럼 추가 및 트리거 복구
-- 중복 실행 시에도 에러가 발생하지 않도록 개선되었습니다.
-- ========================================================

-- 1. updated_at 컬럼 추가 (존재하지 않는 경우에만)
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='bookings' AND column_name='updated_at'
    ) THEN 
        ALTER TABLE public.bookings ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- 2. 트리거 재설정 (삭제 후 생성으로 안전하게 처리)
DROP TRIGGER IF EXISTS handle_bookings_updated_at ON public.bookings;

-- moddatetime 확장이 필요한 경우 활성화 시도
CREATE EXTENSION IF NOT EXISTS moddatetime;

CREATE TRIGGER handle_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION moddatetime('updated_at');

-- 3. 기타 주요 테이블 점검 (기존 설정 보호하며 컬럼 추가)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='guides_detail' AND column_name='updated_at') THEN 
        ALTER TABLE public.guides_detail ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

DROP TRIGGER IF EXISTS handle_guides_detail_updated_at ON public.guides_detail;
CREATE TRIGGER handle_guides_detail_updated_at
BEFORE UPDATE ON public.guides_detail
FOR EACH ROW
EXECUTE FUNCTION moddatetime('updated_at');
