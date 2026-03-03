import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectGuides() {
    const { data: guides, error } = await supabase
        .from('profiles')
        .select(`
            id,
            full_name,
            guides_detail (
                location,
                hourly_rate,
                rate_type
            )
        `)
        .eq('role', 'guide')
        .order('full_name');

    if (error) {
        console.error(error);
        return;
    }

    console.log("=== 가이드 예약 가능 리스트 (34명 샘플 데이터 포함) ===");
    guides.forEach((g, i) => {
        const detail = Array.isArray(g.guides_detail) ? g.guides_detail[0] : g.guides_detail;
        console.log(`${i + 1}. [${g.full_name}] - ID: ${g.id} / 지역: ${detail?.location || '미정'} / 요금: ${detail?.hourly_rate || '미정'}`);
    });
}

inspectGuides();
