import fs from 'fs';

const images = JSON.parse(fs.readFileSync('tmp_images.json', 'utf8'));
const guideId = '1b3d8a7a-10b1-4545-961b-802d996fd28f';

// Get existing Itaewon image from tmp_images.json if I had saved it there, 
// but I only saved gyeongbokgung and haeundae.
// I'll use Gyeongbokgung as placeholder for Itaewon if I can't get it, 
// or I'll just skip updating Itaewon's photo if I want to be safe.
// Wait, I'll use a placeholder for now since I can't read from DB easily without service key.

const sql = `DELETE FROM public.tours WHERE title IN ('이태원 투어', '왕의 산책로, 경복궁 및 북촌 프리미엄 야간 도보 투어', '로맨틱 요트 항해, 해운대 프라이빗 선셋 투어', '이태원 로컬 미식 & 다채로운 문화 탐방 투어');

INSERT INTO public.tours (guide_id, title, description, region, duration, price, max_guests, photo, included_items, is_active)
VALUES 
(
    '${guideId}', 
    '왕의 산책로, 경복궁 및 북촌 프리미엄 야간 도보 투어', 
    '서울의 심장부에서 즐기는 특별한 야간 산책입니다. 조명이 밝혀진 경복궁의 고궁미와 북촌 한옥마을의 고즈넉함을 가이드의 깊이 있는 해설과 함께 체험하세요.',
    '서울 종로구',
    3,
    45000,
    10,
    '${images.gyeongbokgung}',
    ARRAY['가이드 해설 피드백', '무선 수신기 대여', '한복 대여 할인권'],
    true
),
(
    '${guideId}', 
    '로맨틱 요트 항해, 해운대 프라이빗 선셋 투어', 
    '부산 해운대의 푸른 바다 위에서 인생샷을 남겨보세요. 황금빛 석양과 광안대교의 야경을 감상하며 샴페인 한 잔의 여유를 즐길 수 있는 프리미엄 패키지입니다.',
    '부산 해운대구',
    2,
    85000,
    6,
    '${images.haeundae}',
    ARRAY['프라이빗 요트 탑승', '스낵 및 샴페인 1잔', '폴라로이드 사진 촬영'],
    true
),
(
    '${guideId}', 
    '이태원 로컬 미식 & 다채로운 문화 탐방 투어', 
    '서울에서 가장 이국적인 동네, 이태원의 숨겨진 맛집과 문화를 탐방합니다. 로컬 가이드만이 아는 골목길 맛집에서 다양한 세계 음식을 맛보고 이태원의 독특한 변천사를 배워보세요.',
    '서울 용산구',
    4,
    60000,
    8,
    '${images.gyeongbokgung}', 
    ARRAY['메인 요리 2종 시식', '수제 맥주 또는 음료 1잔', '이태원 로컬 맛집 지도'],
    true
);`;

fs.writeFileSync('lib/db/seed_admin_tours.sql', sql);
console.log("SQL generated at lib/db/seed_admin_tours.sql");
