import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function countGuides() {
    const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'guide');

    if (error) {
        console.error(error);
        return;
    }

    // Use a simpler check for sample IDs
    const { data: samples, error: sError } = await supabase
        .from('profiles')
        .select('id')
        .in('id', [
            '00000000-0000-0000-0000-000000000001',
            '00000000-0000-0000-0000-000000000034'
        ]);

    if (sError) {
        console.error(sError);
        return;
    }

    console.log(`총 가이드 수: ${count}`);
    console.log(`기존 샘플 가이드 존재 여부 (1번, 34번): ${samples.length > 0 ? '존재함' : '삭제됨'}`);

    const { data: allGuides } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('role', 'guide');

    console.log("현존 가이드 목록:");
    allGuides.forEach(g => console.log(`- ${g.full_name}`));
}

countGuides();
