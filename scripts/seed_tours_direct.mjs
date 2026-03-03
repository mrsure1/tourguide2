import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function seedTours() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const guideId = '1b3d8a7a-10b1-4545-961b-802d996fd28f';
    const images = JSON.parse(fs.readFileSync('tmp_images.json', 'utf8'));

    // 1. Get existing Itaewon image if available
    const { data: existingTours } = await supabase.from('tours').select('photo').eq('title', '이태원 투어').limit(1);
    const itaewonPhoto = (existingTours && existingTours[0]) ? existingTours[0].photo : images.gyeongbokgung;

    // 2. Clear existing entries
    await supabase.from('tours').delete().in('title', [
        '이태원 투어',
        '왕의 산책로, 경복궁 및 북촌 프리미엄 야간 도보 투어',
        '로맨틱 요트 항해, 해운대 프라이빗 선셋 투어',
        '이태원 로컬 미식 & 다채로운 문화 탐방 투어'
    ]);

    // 3. Insert new tours with correct columns and INTEGER types
    const newTours = [
        {
            guide_id: guideId,
            title: '왕의 산책로, 경복궁 및 북촌 프리미엄 야간 도보 투어',
            description: '서울의 심장부에서 즐기는 특별한 야간 산책입니다. 조명이 밝혀진 경복궁의 고궁미와 북촌 한옥마을의 고즈넉함을 가이드의 깊이 있는 해설과 함께 체험하세요.',
            duration: 3, // Changed to INTEGER
            price: 45000, // Changed to INTEGER
            region: '서울 종로구',
            max_guests: 10,
            is_active: true,
            photo: images.gyeongbokgung,
            included_items: ['가이드 해설 피드백', '무선 수신기 대여', '한복 대여 할인권']
        },
        {
            guide_id: guideId,
            title: '로맨틱 요트 항해, 해운대 프라이빗 선셋 투어',
            description: '부산 해운대의 푸른 바다 위에서 인생샷을 남겨보세요. 황금빛 석양과 광안대교의 야경을 감상하며 샴페인 한 잔의 여유를 즐길 수 있는 프리미엄 패키지입니다.',
            duration: 2, // Changed to INTEGER
            price: 85000, // Changed to INTEGER
            region: '부산 해운대구',
            max_guests: 6,
            is_active: true,
            photo: images.haeundae,
            included_items: ['프라이빗 요트 탑승', '스낵 및 샴페인 1잔', '폴라로이드 사진 촬영']
        },
        {
            guide_id: guideId,
            title: '이태원 로컬 미식 & 다채로운 문화 탐방 투어',
            description: '서울에서 가장 이국적인 동네, 이태원의 숨겨진 맛집과 문화를 탐방합니다. 로컬 가이드만이 아는 골목길 맛집에서 다양한 세계 음식을 맛보고 이태원의 독특한 변천사를 배워보세요.',
            duration: 4, // Changed to INTEGER
            price: 60000, // Changed to INTEGER
            region: '서울 용산구',
            max_guests: 8,
            is_active: true,
            photo: itaewonPhoto,
            included_items: ['메인 요리 2종 시식', '수제 맥주 또는 음료 1잔', '이태원 로컬 맛집 지도']
        }
    ];

    const { error } = await supabase.from('tours').insert(newTours);
    if (error) {
        console.error("Insert Error:", error.message);
    } else {
        console.log("Successfully seeded 3 admin tours.");
    }
}

seedTours();
