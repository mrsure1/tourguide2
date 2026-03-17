-- ==========================================
-- tour_likes 테이블 (투어 상품 좋아요)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.tour_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, tour_id) -- 중복 좋아요 방지
);

-- RLS 설정
ALTER TABLE public.tour_likes ENABLE ROW LEVEL SECURITY;

-- 정책: 본인의 좋아요 정보만 관리 가능
DROP POLICY IF EXISTS "Users can manage their own tour likes" ON public.tour_likes;
CREATE POLICY "Users can manage their own tour likes" 
ON public.tour_likes FOR ALL 
USING (auth.uid() = user_id);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_tour_likes_user_id ON public.tour_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_tour_likes_tour_id ON public.tour_likes(tour_id);
