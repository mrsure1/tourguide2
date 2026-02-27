-- ========================================================
-- 특정 가이드(이진영) 인증 처리 및 운영 데이터 관리
-- ========================================================

-- 1. 가이드 '이진영'을 인증 상태로 변경
-- profiles에서 이름을 찾아 guides_detail의 is_verified를 업데이트
UPDATE public.guides_detail
SET is_verified = true
WHERE id IN (
    SELECT id FROM public.profiles 
    WHERE full_name = '이진영' AND role = 'guide'
);

-- 2. 상세 프로필 필수 항목 확인용 뷰 생성 (선택사항 - 관리자용)
-- 어떤 정보가 누락되었는지 쉽게 파악하기 위함
CREATE OR REPLACE VIEW public.guide_profile_status AS
SELECT 
    p.full_name,
    p.email,
    gd.location IS NOT NULL as has_location,
    gd.hourly_rate > 0 as has_rate,
    gd.bio IS NOT NULL AND length(gd.bio) > 10 as has_substantial_bio,
    (gd.languages IS NOT NULL AND array_length(gd.languages, 1) > 0) as has_languages,
    gd.is_verified
FROM public.profiles p
JOIN public.guides_detail gd ON p.id = gd.id;
