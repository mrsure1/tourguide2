import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envConfig = fs.readFileSync(path.resolve(__dirname, '../.env.local'), 'utf8');
const envLines = envConfig.split('\n');
envLines.forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        process.env[match[1]] = match[2].trim();
    }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyGuides = [
    { name: "이민호", location: "서울", langs: ["한국어", "English"], bio: "서울의 숨겨진 명소를 안내해드립니다. 10년 경력의 베테랑 가이드입니다.", rate: 35000, rating: 4.9, review: 120 },
    { name: "김지수", location: "부산", langs: ["한국어", "日本語"], bio: "부산의 맛집과 해안가 투어를 전문으로 합니다. 사진 촬영 서비스 제공!", rate: 40000, rating: 4.8, review: 85 },
    { name: "박서준", location: "제주", langs: ["한국어", "English", "中文"], bio: "제주도 방방곡곡 자연 친화적인 투어. 차량 지원 가능합니다.", rate: 50000, rating: 5.0, review: 300 },
    { name: "최유진", location: "강원", langs: ["한국어"], bio: "강릉/속초 바다열차 투어 및 커피거리 탐방. 힐링이 필요하다면 연락주세요.", rate: 30000, rating: 4.7, review: 42 },
    { name: "정태우", location: "전주", langs: ["한국어", "English"], bio: "전주 한옥마을의 역사와 야경 투어. 한복 체험과 함께하는 스냅 사진.", rate: 25000, rating: 4.9, review: 210 },
    { name: "강소라", location: "서울", langs: ["한국어", "中文", "日本語"], bio: "서울 쇼핑 및 뷰티 투어 전문. 트렌디한 핫플레이스 안내.", rate: 45000, rating: 4.6, review: 56 },
    { name: "조현우", location: "제주", langs: ["한국어"], bio: "제주 한라산 등반 가이드. 안전하고 즐거운 산행을 약속드립니다.", rate: 60000, rating: 4.9, review: 110 },
    { name: "윤아름", location: "부산", langs: ["한국어", "English"], bio: "해운대 야경 투어 및 요트 체험 연계 가이드. 로맨틱한 추억을 만들어 드려요.", rate: 55000, rating: 4.8, review: 95 },
    { name: "송지효", location: "강원", langs: ["한국어", "日本語"], bio: "설악산 트레킹 & 속초 아바이마을 미식 투어.", rate: 38000, rating: 4.7, review: 67 },
    { name: "백종문", location: "전주", langs: ["한국어"], bio: "전주/완주 맛집 싹쓸이 투어. 진정한 미식가를 위한 코스입니다.", rate: 28000, rating: 4.9, review: 154 }
];

const dummyTours = [
    { name: "[패키지] 경복궁 야간 해설 투어", location: "서울", langs: ["한국어", "English"], bio: "전문 해설사와 함께하는 경복궁 야간 개장 특별 투어입니다. (매주 금, 토 한정)", rate: 20000, rating: 5.0, review: 450 },
    { name: "[상품] 부산 베스트셀러 맛집 탐방", location: "부산", langs: ["한국어", "日本語", "中文"], bio: "부산 현지인들만 아는 찐 맛집 5곳을 방문하는 반나절 투어.", rate: 45000, rating: 4.8, review: 230 },
    { name: "[패키지] 우도 프라이빗 일주 투어", location: "제주", langs: ["한국어", "English"], bio: "전기자전거 대여 및 우도 명소 스냅 촬영이 포함된 올인원 패키지.", rate: 75000, rating: 4.9, review: 180 },
    { name: "[체험] 전주 비빔밥 만들기 & 한옥 스냅", location: "전주", langs: ["한국어", "English"], bio: "명인과 함께하는 전주 비빔밥 체험 및 전문 작가의 한옥 스냅 촬영.", rate: 65000, rating: 4.8, review: 90 },
    { name: "[패키지] 강릉 커피로드 & 서핑 기초", location: "강원", langs: ["한국어"], bio: "안목해변 커피거리 스페셜티 시음 및 초보자를 위한 서핑 2시간 강습 코스.", rate: 85000, rating: 4.7, review: 115 }
];

async function seed() {
    console.log("Starting to seed database...");
    let index = 1;

    const allItems = [...dummyGuides, ...dummyTours];

    for (const item of allItems) {
        const email = `dummy_${Date.now()}_${index}@example.com`;
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password: 'password123!'
        });

        if (authError) {
            console.error(`Error signing up ${item.name}:`, authError.message);
            continue;
        }

        if (!authData.user) continue;

        const userId = authData.user.id;

        // Insert profile
        const { error: profileError } = await supabase.from('profiles').insert({
            id: userId,
            email: email,
            full_name: item.name,
            role: 'guide',
            avatar_url: `https://i.pravatar.cc/150?u=${userId}`
        });

        if (profileError) {
            console.error(`Error inserting profile for ${item.name}:`, profileError.message);
        }

        // Insert guide detail
        const { error: gdError } = await supabase.from('guides_detail').insert({
            id: userId,
            location: item.location,
            languages: item.langs,
            bio: item.bio,
            hourly_rate: item.rate,
            rating: item.rating,
            review_count: item.review
        });

        if (gdError) {
            console.error(`Error inserting guides_detail for ${item.name}:`, gdError.message);
        }

        console.log(`Created: ${item.name}`);
        index++;
    }

    console.log("Seeding complete! You can log in with any of the emails (e.g. looking at DB) and password 'password123!'");
}

seed();
