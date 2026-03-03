import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeCurrentGuides() {
    const { data: guides, error } = await supabase
        .from('profiles')
        .select(`
            id,
            full_name,
            avatar_url,
            guides_detail (
                location,
                hourly_rate
            )
        `)
        .eq('role', 'guide')
        .order('full_name');

    if (error) {
        console.error(error);
        return;
    }

    console.log("=== 현재 가이드 상세 분석 (ID, 이름, 이미지) ===");
    guides.forEach((g, i) => {
        const detail = Array.isArray(g.guides_detail) ? g.guides_detail[0] : g.guides_detail;
        console.log(`${i + 1}. [${g.full_name}]`);
        console.log(`   - ID: ${g.id}`);
        console.log(`   - Avatar: ${g.avatar_url}`);
        console.log(`   - Region: ${detail?.location || 'N/A'}`);
        console.log(`   - Reservable (Pattern Check): ${g.id.startsWith('0000') ? 'FAKE (Unreservable)' : 'REAL (Reservable)'}`);
        console.log('---');
    });
}

analyzeCurrentGuides();
