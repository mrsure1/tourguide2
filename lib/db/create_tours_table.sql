-- ==========================================
-- tours 테이블 (투어 상품 정보)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guide_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    region TEXT NOT NULL,
    duration INTEGER NOT NULL, -- 소요 시간 (시간 단위)
    price INTEGER NOT NULL, -- 가격 (원화)
    max_guests INTEGER NOT NULL DEFAULT 4, -- 최대 인원
    photo TEXT, -- 썸네일 이미지 URL 또는 Base64
    included_items TEXT[] DEFAULT '{}', -- 포함 사항
    is_active BOOLEAN DEFAULT true, -- 활성/비활성 상태
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS 설정
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- 정책: 누구나 조회 가능
DROP POLICY IF EXISTS "Allow public read access on tours" ON public.tours;
CREATE POLICY "Allow public read access on tours" 
ON public.tours FOR SELECT 
USING (true);

-- 정책: 가이드는 자신의 투어만 관리 가능 (생성/수정/삭제)
DROP POLICY IF EXISTS "Allow individual tour management" ON public.tours;
CREATE POLICY "Allow individual tour management" 
ON public.tours FOR ALL 
USING (auth.uid() = guide_id);

-- 인덱스 추가 (검색 및 필터링 성능)
CREATE INDEX IF NOT EXISTS idx_tours_guide_id ON public.tours(guide_id);
CREATE INDEX IF NOT EXISTS idx_tours_region ON public.tours(region);

-- 업데이트 시간 자동 갱신 트리거
DROP TRIGGER IF EXISTS update_tours_modtime ON public.tours;
CREATE TRIGGER update_tours_modtime 
BEFORE UPDATE ON public.tours 
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
