import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is missing');
}

if (!serviceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing');
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const tourId = '1e7f45c3-6a06-4721-9691-c2f5717daa0b';

const payload = {
  title: '제주 동쪽 오름·해안 드라이브 프리미엄 데이 투어',
  region: '제주',
  description:
    '성산일출봉, 섭지코지, 광치기해변, 성읍민속마을과 제주 동쪽 오름 지대를 하루에 자연스럽게 잇는 프리미엄 데이 투어입니다. 단순히 명소를 빠르게 찍고 이동하는 일정이 아니라, 제주 고유의 화산 지형과 해안 풍경, 마을 문화, 제철 먹거리까지 입체적으로 경험할 수 있도록 동선을 구성했습니다. 이른 오전에는 오름과 해안의 가장 맑은 빛을 볼 수 있는 포인트로 이동하고, 점심 전후에는 제주 현지 식당과 감성 카페를 포함해 여유 있는 템포로 여행을 진행합니다. 사진 촬영이 잘 나오는 시간대와 구도를 가이드가 직접 안내하며, 커플 여행과 가족 여행, 부모님 동반 일정에도 무리 없도록 이동과 휴식의 균형을 세심하게 맞춘 상품입니다.',
  included_items: [
    '제주 동부 핵심 포인트 맞춤 동선 안내',
    '로컬 가이드 스토리텔링 해설',
    '인생 사진 촬영 포인트 추천',
    '동선별 휴식 및 카페 추천',
    '여행 성향에 맞춘 당일 일정 조정',
  ],
};

const { data, error } = await supabase
  .from('tours')
  .update(payload)
  .eq('id', tourId)
  .select('id, title, region, description, included_items')
  .single();

if (error) {
  throw error;
}

console.log(JSON.stringify(data, null, 2));
