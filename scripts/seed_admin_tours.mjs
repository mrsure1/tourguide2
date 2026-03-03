import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const adminId = '1b3d8a7a-10b1-4545-961b-802d996fd28f';

async function seedAdminTours() {
    console.log("Seeding admin tours...");

    const tours = [
        {
            guide_id: adminId,
            title: "왕의 산책로, 경복궁 및 북촌 프리미엄 야간 도보 투어",
            description: "조선 왕조의 정궁인 경복궁의 아름다운 야경과 한옥의 정취가 살아있는 북촌을 전문 가이드의 깊이 있는 해설과 함께 거닐어보세요. 고즈넉한 밤의 궁궐이 주는 특별한 감동을 선사합니다.",
            region: "서울",
            duration: 3,
            price: 80000,
            max_guests: 6,
            photo: "/images/tours/gyeongbokgung.png",
            included_items: ["전문 가이드 해설", "경복궁 야간 입장료", "북촌 전통차 시음", "무선 송수신기 대여"],
            is_active: true
        },
        {
            guide_id: adminId,
            title: "로맨틱 요트 항해, 해운대 프라이빗 선셋 투어",
            description: "부산 바다 위에서 즐기는 환상적인 일몰. 럭셔리 요트를 타고 해운대와 광안대교의 야경을 가장 가까운 곳에서 감상하세요. 프라이빗한 공간에서 누리는 최고의 휴식을 약속합니다.",
            region: "부산",
            duration: 2,
            price: 120000,
            max_guests: 4,
            photo: "/images/tours/haeundae.png",
            included_items: ["요트 단독 대관", "웰컴 드링크 및 다과", "선상 폴라로이드 촬영", "구명조끼 등 안전장비"],
            is_active: true
        }
    ];

    for (const tour of tours) {
        // 기존 동일 제목 투어 삭제 (멱등성 확보)
        await supabase
            .from('tours')
            .delete()
            .eq('title', tour.title)
            .eq('guide_id', adminId);

        const { data, error } = await supabase
            .from('tours')
            .insert(tour)
            .select();

        if (error) {
            console.error(`Error inserting tour "${tour.title}":`, error);
        } else {
            console.log(`Tour created: ${tour.title} (ID: ${data[0].id})`);
        }
    }

    console.log("Seeding finished.");
}

seedAdminTours();
