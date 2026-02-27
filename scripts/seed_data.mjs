import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing environment variables");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("Starting enhanced seed...");

    // 1. Create guide profiles with Oriental photos
    const guides = [
        {
            id: '11111111-1111-1111-1111-111111111111',
            full_name: '박성진 (James)',
            avatar_url: '/images/guides/guide_seoul_man.png',
            role: 'guide'
        },
        {
            id: '22222222-2222-2222-2222-222222222222',
            full_name: '이소연 (Soyeon)',
            avatar_url: '/images/guides/guide_busan_woman.png',
            role: 'guide'
        },
        {
            id: '33333333-3333-3333-3333-333333333333',
            full_name: '이현우 (Henry)',
            avatar_url: '/images/guides/guide_culture_man.png',
            role: 'guide'
        },
        {
            id: '44444444-4444-4444-4444-444444444444',
            full_name: '김지나 (Gina)',
            avatar_url: '/images/guides/guide_fashion_woman.png',
            role: 'guide'
        },
        {
            id: '1d1742de-7c17-4ffa-9f73-41a29d6eadc2',
            full_name: '김민수 (Minsoo)',
            avatar_url: '/images/guides/guide_bukchon_man.png',
            role: 'guide'
        }
    ];

    for (const g of guides) {
        const { error } = await supabase.from('profiles').upsert(g);
        if (error) console.error(`Error upserting profile ${g.full_name}:`, error);
        else console.log(`Profile ${g.full_name} upserted.`);
    }

    // 2. Create guides_detail with rich virtual info
    const details = [
        {
            id: '11111111-1111-1111-1111-111111111111',
            location: '서울 강남/이태원',
            languages: ['한국어', '영어', '일본어'],
            bio: '뉴욕에서 10년간 주재원으로 근무하며 쌓은 글로벌 감각을 바탕으로, 서울의 가장 힙하고 트렌디한 장소를 안내해 드립니다. 강남의 프리미엄 파인다이닝부터 이태원의 숨겨진 루프탑 바까지, 비즈니스 매너를 갖춘 수준 높은 가이딩을 약속합니다.',
            hourly_rate: 80000,
            rate_type: 'hourly',
            rating: 4.9,
            review_count: 156,
            is_verified: true
        },
        {
            id: '22222222-2222-2222-2222-222222222222',
            location: '부산 해운대/광안리',
            languages: ['한국어', '영어'],
            bio: '부산에서 태어나고 자란 "로컬 찐 팬" 소연입니다! 인스타그램에서 핫한 오션뷰 카페부터 현지인들만 아는 자갈치 시장의 숨은 횟집까지, 에너지 넘치는 부산 여행을 만들어 드릴게요. 사진 촬영도 전문적으로 도와드려요!',
            hourly_rate: 150000,
            rate_type: 'daily',
            rating: 4.8,
            review_count: 92,
            is_verified: true
        },
        {
            id: '33333333-3333-3333-3333-333333333333',
            location: '서울 고궁/종로',
            languages: ['한국어', '영어', '중국어'],
            bio: '역사학을 전공하고 15년간 문화유산 가이드로 활동해온 전문가입니다. 경복궁의 돌 하나하나에 담긴 역사적 의미부터 조선 시대의 흥미진진한 뒷이야기까지, 깊이 있는 인문학 여행을 선사해 드립니다. 가족 여행객에게 강력 추천합니다.',
            hourly_rate: 250000,
            rate_type: 'daily',
            rating: 5.0,
            review_count: 210,
            is_verified: true
        },
        {
            id: '44444444-4444-4444-4444-444444444444',
            location: '서울 한남/압구정',
            languages: ['한국어', '프랑스어', '영어'],
            bio: '파리 패션 디자인 유학파 출신의 퍼스널 쇼퍼 겸 가이드입니다. 한남동의 감각적인 편집숍, 도산공원의 프라이빗한 갤러리 투어를 통해 서울의 세련된 라이프스타일을 제안합니다. 당신만의 아름다움을 찾는 스타일 투어를 제안합니다.',
            hourly_rate: 100000,
            rate_type: 'hourly',
            rating: 4.7,
            review_count: 85,
            is_verified: true
        },
        {
            id: '1d1742de-7c17-4ffa-9f73-41a29d6eadc2',
            location: '서울 북촌/서촌',
            languages: ['한국어', '영어'],
            bio: '북촌 한옥마을에서 나고 자란 토박이 가이드 민수입니다. 골목 구석구석 숨어있는 조용한 찻집과 공방들을 함께 거닐며, 바쁜 도심 속에서 느끼는 한가로운 여유를 선물해 드립니다. 외국인 친구들에게 한국의 정(情)을 느끼게 해주고 싶을 때 찾아주세요.',
            hourly_rate: 60000,
            rate_type: 'hourly',
            rating: 4.9,
            review_count: 124,
            is_verified: true
        }
    ];

    for (const d of details) {
        const { error } = await supabase.from('guides_detail').upsert(d);
        if (error) console.error(`Error upserting detail for ${d.id}:`, error);
        else console.log(`Detail for ${d.id} upserted.`);
    }

    console.log("Enhanced seed finished.");
}

seed();
