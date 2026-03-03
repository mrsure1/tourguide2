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

const firstNames = ['민준', '서준', '도윤', '예준', '시우', '하준', '주원', '지호', '지후', '준서', '서윤', '서연', '지우', '하윤', '민서', '하은', '지유', '윤서', '지민', '채원'];
const lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
const locations = ['서울 강남', '서울 홍대', '서울 명동', '부산 해운대', '부산 광안리', '제주 전역', '강원 속초', '전주 한옥마을', '경주 황리단길'];
const languages = [['한국어', '영어'], ['한국어', '일본어'], ['한국어', '중국어'], ['한국어', '영어', '일본어'], ['한국어', '태국어']];

const bios = [
    "열정 넘치는 가이드와 함께하는 로컬 투어!",
    "현지인만 아는 숨은 명소를 공략해보세요.",
    "역사와 문화가 살아있는 깊이 있는 여행을 선사합니다.",
    "사진 찍기 좋은 핫플레이스 위주로 안내해 드립니다.",
    "가족 단위 여행객을 위한 편안한 가이딩 서비스를 제공합니다."
];

async function seedAll() {
    console.log("Starting massive seed for 34 guides...");

    for (let i = 1; i <= 34; i++) {
        const id = `00000000-0000-0000-0000-${i.toString().padStart(12, '0')}`;
        const name = `${lastNames[i % lastNames.length]}${firstNames[i % firstNames.length]}`;
        const location = locations[i % locations.length];
        const lang = languages[i % languages.length];
        const bio = bios[i % bios.length];

        const guideImages = [
            'guide_seoul_man.png',
            'guide_busan_woman.png',
            'guide_culture_man.png',
            'guide_fashion_woman.png',
            'guide_bukchon_man.png'
        ];

        // Profiles
        const profile = {
            id,
            full_name: `${name} (${i % 2 === 0 ? 'M' : 'F'} Guide)`,
            avatar_url: `/images/guides/${guideImages[i % guideImages.length]}`,
            role: 'guide'
        };

        const { error: pError } = await supabase.from('profiles').upsert(profile);
        if (pError) console.error(`Error upserting profile ${i}:`, pError);

        // Details
        const detail = {
            id,
            location,
            languages: lang,
            bio: `${bio} (샘플 가이드 ${i}번)`,
            hourly_rate: 30000 + (i * 2000),
            rate_type: i % 5 === 0 ? 'daily' : 'hourly',
            rating: 4.0 + (Math.random() * 1.0),
            review_count: Math.floor(Math.random() * 200),
            is_verified: i % 3 === 0
        };

        const { error: dError } = await supabase.from('guides_detail').upsert(detail);
        if (dError) console.error(`Error upserting detail ${i}:`, dError);
        else console.log(`Guide ${i} (${name}) initialized.`);
    }

    console.log("Massive seed finished.");
}

seedAll();
