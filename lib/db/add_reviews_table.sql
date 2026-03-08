-- 1. Create `reviews` table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    guide_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    traveler_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 추가 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_reviews_guide_id ON public.reviews(guide_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON public.reviews(booking_id);

-- 2. `guides_detail` 테이블에 review_count 컬럼이 없다면 추가 (rating 은 이미 있다고 가정)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='guides_detail' AND column_name='review_count') THEN
        ALTER TABLE public.guides_detail ADD COLUMN review_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- 3. Trigger Function: 리뷰 테이블에 변경이 생길 때 guides_detail의 rating, review_count 자동 갱신
CREATE OR REPLACE FUNCTION update_guide_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating NUMERIC;
    rev_count INTEGER;
    g_id UUID;
BEGIN
    -- 삭제의 경우 OLD, 생성/수정의 경우 NEW 에서 guide_id 가져오기
    IF TG_OP = 'DELETE' THEN
        g_id := OLD.guide_id;
    ELSE
        g_id := NEW.guide_id;
    END IF;

    -- 평균 별점과 리뷰 수 계산
    SELECT COALESCE(AVG(rating), 0), COUNT(id)
    INTO avg_rating, rev_count
    FROM public.reviews
    WHERE guide_id = g_id;

    -- guides_detail 테이블 갱신 (소수점 1자리까지 반올림)
    UPDATE public.guides_detail
    SET rating = ROUND(avg_rating, 1),
        review_count = rev_count
    WHERE id = g_id;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 삭제 후 재생성 (중복 방지)
DROP TRIGGER IF EXISTS trigger_update_guide_rating ON public.reviews;

CREATE TRIGGER trigger_update_guide_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION update_guide_rating();

-- 기본 RLS 보안 정책 설정 (이 프로젝트에 적용 중인 룰에 맞춰 개방/제한 가능)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 누구나 읽을 수 있음
CREATE POLICY "Anyone can read reviews" ON public.reviews FOR SELECT USING (true);
-- 인증된 사용자만 작성 가능
CREATE POLICY "Authenticated users can insert reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (true);
-- 작성자 본인만 수정/삭제 가능
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = traveler_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = traveler_id);
