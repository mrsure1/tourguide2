/* 
   Supabase SQL Editor에서 실행할 수 있는 샘플 데이터 생성 스크립트 
   (10명의 샘플 가이드 및 5명의 가상 상품 계정)
*/

-- 1. UUID 확장을 사용 (필요시)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 임시로 변수 대신 직접 INSERT 하는 방식
-- 기존 테스트 데이터와 충돌을 막기 위해 ON CONFLICT 절 사용 (PostgreSQL)

DO $$
DECLARE
    guide1_id UUID := uuid_generate_v4();
    guide2_id UUID := uuid_generate_v4();
    guide3_id UUID := uuid_generate_v4();
    guide4_id UUID := uuid_generate_v4();
    guide5_id UUID := uuid_generate_v4();
    guide6_id UUID := uuid_generate_v4();
    guide7_id UUID := uuid_generate_v4();
    guide8_id UUID := uuid_generate_v4();
    guide9_id UUID := uuid_generate_v4();
    guide10_id UUID := uuid_generate_v4();
    
    tour1_id UUID := uuid_generate_v4();
    tour2_id UUID := uuid_generate_v4();
    tour3_id UUID := uuid_generate_v4();
    tour4_id UUID := uuid_generate_v4();
    tour5_id UUID := uuid_generate_v4();
BEGIN

    -- A. Auth Users 테이블에 임의로 사용자 생성 (비밀번호: crypted password required if we want to login, but for just display it's fine not to login)
    -- 하지만 auth.users에 넣으려면 복잡한 필수 컬럼이 많습니다. 
    -- 테스트를 위한 가장 좋은 방법은 ForeignKey 제약을 잠시 끄는 것입니다.

    -- ==========================================
    -- 프로필 테이블 FK 제약조건 잠시 해제
    -- (auth.users 가입 우회)
    -- ==========================================
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

    -- Profiles Insert
    INSERT INTO public.profiles (id, full_name, role, avatar_url) VALUES 
    (guide1_id, '이민호', 'guide', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'),
    (guide2_id, '김지수', 'guide', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'),
    (guide3_id, '박서준', 'guide', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'),
    (guide4_id, '최유진', 'guide', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'),
    (guide5_id, '정태우', 'guide', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'),
    (guide6_id, '강소라', 'guide', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'),
    (guide7_id, '조현우', 'guide', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop'),
    (guide8_id, '윤아름', 'guide', 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&h=400&fit=crop'),
    (guide9_id, '송지효', 'guide', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'),
    (guide10_id, '백종문', 'guide', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop'),
    
    (tour1_id, '[패키지] 경복궁 야간 해설 투어', 'guide', 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?w=400&h=400&fit=crop'),
    (tour2_id, '[상품] 부산 베스트셀러 맛집 탐방', 'guide', 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=400&h=400&fit=crop'),
    (tour3_id, '[패키지] 우도 프라이빗 일주 투어', 'guide', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop'),
    (tour4_id, '[체험] 전주 비빔밥 만들기 & 스냅', 'guide', 'https://images.unsplash.com/photo-1547592166-23ac45744a05?w=400&h=400&fit=crop'),
    (tour5_id, '[패키지] 강릉 커피로드 & 서핑', 'guide', 'https://images.unsplash.com/photo-1518837697219-79c482c3dc8c?w=400&h=400&fit=crop');

    -- Guides Detail Insert
    INSERT INTO public.guides_detail (id, location, languages, bio, hourly_rate, rating, review_count, is_verified) VALUES 
    (guide1_id, '서울', ARRAY['한국어', 'English'], '서울의 숨겨진 명소를 안내해드립니다. 10년 경력의 베테랑 가이드입니다.', 35000, 4.9, 120, true),
    (guide2_id, '부산', ARRAY['한국어', '日本語'], '부산의 맛집과 해안가 투어를 전문으로 합니다. 사진 촬영 서비스 제공!', 40000, 4.8, 85, true),
    (guide3_id, '제주', ARRAY['한국어', 'English', '中文'], '제주도 방방곡곡 자연 친화적인 투어. 차량 지원 가능합니다.', 50000, 5.0, 300, true),
    (guide4_id, '강원', ARRAY['한국어'], '강릉/속초 바다열차 투어 및 커피거리 탐방. 힐링이 필요하다면 연락주세요.', 30000, 4.7, 42, true),
    (guide5_id, '전주', ARRAY['한국어', 'English'], '전주 한옥마을의 역사와 야경 투어. 한복 체험과 함께하는 스냅 사진.', 25000, 4.9, 210, true),
    (guide6_id, '서울', ARRAY['한국어', '中文', '日本語'], '서울 쇼핑 및 뷰티 투어 전문. 트렌디한 핫플레이스 안내.', 45000, 4.6, 56, true),
    (guide7_id, '제주', ARRAY['한국어'], '제주 한라산 등반 가이드. 안전하고 즐거운 산행을 약속드립니다.', 60000, 4.9, 110, true),
    (guide8_id, '부산', ARRAY['한국어', 'English'], '해운대 야경 투어 및 요트 체험 연계 가이드. 로맨틱한 추억을 만들어 드려요.', 55000, 4.8, 95, true),
    (guide9_id, '강원', ARRAY['한국어', '日本語'], '설악산 트레킹 & 속초 아바이마을 미식 투어.', 38000, 4.7, 67, true),
    (guide10_id, '전주', ARRAY['한국어'], '전주/완주 맛집 싹쓸이 투어. 진정한 미식가를 위한 코스입니다.', 28000, 4.9, 154, true),

    (tour1_id, '서울', ARRAY['한국어', 'English'], '전문 해설사와 함께하는 경복궁 야간 개장 특별 투어입니다. (매주 금, 토 한정)', 20000, 5.0, 450, true),
    (tour2_id, '부산', ARRAY['한국어', '日本語', '中文'], '부산 현지인들만 아는 찐 맛집 5곳을 방문하는 반나절 투어.', 45000, 4.8, 230, true),
    (tour3_id, '제주', ARRAY['한국어', 'English'], '전기자전거 대여 및 우도 명소 스냅 촬영이 포함된 올인원 패키지.', 75000, 4.9, 180, true),
    (tour4_id, '전주', ARRAY['한국어', 'English'], '명인과 함께하는 전주 비빔밥 체험 및 전문 작가의 한옥 스냅 촬영.', 65000, 4.8, 90, true),
    (tour5_id, '강원', ARRAY['한국어'], '안목해변 커피거리 스페셜티 시음 및 초보자를 위한 서핑 2시간 강습 코스.', 85000, 4.7, 115, true);

END $$;
