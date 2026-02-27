-- ========================================================
-- 샘플 가이드 데이터 생성 및 상세 정보 등록 (테스트용)
-- ========================================================

-- 1. 가이드 사용자 생성 (profiles)
-- ID는 임의 생성하되 중복 방지를 위해 DO 블록 사용
DO $$
DECLARE
    guide1_id UUID := 'a1111111-1111-4111-a111-111111111111';
    guide2_id UUID := 'a2222222-2222-4222-a222-222222222222';
    guide3_id UUID := 'a3333333-3333-4333-a333-333333333333';
BEGIN
    -- 제임스 파크
    INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
    VALUES (guide1_id, 'james@example.com', '제임스 파크', 'guide', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop')
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

    INSERT INTO public.guides_detail (id, location, languages, bio, hourly_rate, rate_type, rating, is_verified)
    VALUES (guide1_id, '서울 강남/이태원', '{영어, 한국어}', '외국계 기업 주재원 출신의 글로벌 라이프스타일 가이드입니다. 세련된 서울의 매력을 보여드립니다.', 50000, 'hourly', 4.9, true)
    ON CONFLICT (id) DO UPDATE SET location = EXCLUDED.location;

    -- 이소연
    INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
    VALUES (guide2_id, 'soyeon@example.com', '이소연', 'guide', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop')
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

    INSERT INTO public.guides_detail (id, location, languages, bio, hourly_rate, rate_type, rating, is_verified)
    VALUES (guide2_id, '부산 해운대', '{한국어, 일본어}', '현지인들만 아는 숨은 맛집과 오션뷰 명소 투어를 전문으로 합니다. 감성 넘치는 여행을 약속합니다.', 120000, 'daily', 4.8, true)
    ON CONFLICT (id) DO UPDATE SET location = EXCLUDED.location;

    -- 김철수 (예정된 여행용 샘플)
    INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
    VALUES (guide3_id, 'chulsoo@example.com', '김철수', 'guide', 'https://i.pravatar.cc/150?u=g1')
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

    INSERT INTO public.guides_detail (id, location, languages, bio, hourly_rate, rate_type, rating, is_verified)
    VALUES (guide3_id, '서울 종로/중구', '{한국어}', '서울 트렌드 마스터 김철수입니다. 역사와 현대가 공존하는 서울의 매력을 실감나게 전달해 올립니다.', 150000, 'daily', 4.5, true)
    ON CONFLICT (id) DO UPDATE SET location = EXCLUDED.location;
END $$;
