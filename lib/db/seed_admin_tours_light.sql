DO $$
DECLARE
    v_guide_id UUID;
BEGIN
    -- 로그인에 사용하는 leeyob@gmail.com 계정의 고유 ID를 가져옵니다.
    -- (auth.users 대신 profiles 테이블을 조회하여 권한 문제 방지)
    SELECT id INTO v_guide_id FROM public.profiles WHERE email = 'leeyob@gmail.com' LIMIT 1;
    
    IF v_guide_id IS NULL THEN
        RAISE NOTICE 'leeyob@gmail.com 프로필을 찾을 수 없습니다. (혹시 다른 이메일로 가입하셨다면 이 코드를 임의의 가이드 ID로 수정해야 합니다)';
        RETURN;
    END IF;

    -- 기존에 중복으로 들어간 샘플 투어 삭제
    DELETE FROM public.tours WHERE title IN (
        '이태원 투어', 
        '왕의 산책로, 경복궁 및 북촌 프리미엄 야간 도보 투어', 
        '로맨틱 요트 항해, 해운대 프라이빗 선셋 투어', 
        '이태원 로컬 미식 & 다채로운 문화 탐방 투어'
    );

    -- 본인의 ID(v_guide_id)로 투어 3개 새로 등록 (용량이 작은 정적 이미지 경로 사용)
    INSERT INTO public.tours (guide_id, title, description, region, duration, price, max_guests, photo, included_items, is_active)
    VALUES 
    (
        v_guide_id, 
        '왕의 산책로, 경복궁 및 북촌 프리미엄 야간 도보 투어', 
        '서울의 심장부에서 즐기는 특별한 야간 산책입니다. 조명이 밝혀진 경복궁의 고궁미와 북촌 한옥마을의 고즈넉함을 가이드의 깊이 있는 해설과 함께 체험하세요.',
        '서울 종로구',
        3,
        45000,
        10,
        '/images/tours/gyeongbokgung.png',
        ARRAY['경복궁 야간 관람 입장권', '한국어/영어 해설', '무선 수신기', '한복 대여 할인권'],
        true
    ),
    (
        v_guide_id, 
        '로맨틱 요트 항해, 해운대 프라이빗 선셋 투어', 
        '해운대의 눈부신 노을과 함께하는 프라이빗 요트 투어입니다. 광안대교의 야경과 바다 위에서의 낭만적인 저녁 시간을 소중한 사람들과 함께 즐겨보세요.',
        '부산 해운대구',
        2,
        75000,
        8,
        '/images/tours/haeundae.png',
        ARRAY['럭셔리 요트 승선권', '간단한 스낵 및 음료', '구명조끼 및 안전 장비', '기념 사진 촬영 서비스'],
        true
    ),
    (
        v_guide_id, 
        '이태원 로컬 미식 & 다채로운 문화 탐방 투어', 
        '세계의 축소판 이태원에서 즐기는 미식과 문화 여행입니다. 골목 구석구석 숨겨진 맛집과 이국적인 상점들을 둘러보며 글로벌한 분위기를 만끽하세요.',
        '서울 용산구',
        4,
        55000,
        12,
        '/images/tours/itaewon.png',
        ARRAY['골목길 도보 안내', '유명 맛집 시식 3곳', '음료 1잔', '다문화 역사 해설'],
        true
    );

    RAISE NOTICE '성공적으로 3개의 투어가 leeyob@gmail.com 님의 소유로 등록되었습니다!';
END $$;
