import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function performGuidCleanup() {
    console.log("=== 가이드 데이터 최종 정리 시작 ===");

    const { data: guides, error } = await supabase
        .from('profiles')
        .select(`
            id,
            full_name,
            avatar_url,
            guides_detail (id)
        `)
        .eq('role', 'guide');

    if (error) {
        console.error(error);
        return;
    }

    // 선별 로직:
    // 1. 이미지가 있는가? (/images/guides/ 포함)
    // 2. 이름이 중복되지 않는가?
    // 3. ID가 유효한가?

    const sorted = guides.sort((a, b) => {
        const aHasImage = a.avatar_url && a.avatar_url.includes('/images/guides/') ? 2 : (a.avatar_url ? 1 : 0);
        const bHasImage = b.avatar_url && b.avatar_url.includes('/images/guides/') ? 2 : (b.avatar_url ? 1 : 0);
        if (bHasImage !== aHasImage) return bHasImage - aHasImage;
        return a.full_name.localeCompare(b.full_name);
    });

    const toKeep = [];
    const seenNames = new Set();
    const toDeleteIds = [];

    for (const g of sorted) {
        const name = g.full_name?.trim() || 'Unknown';
        if (toKeep.length < 10 && !seenNames.has(name) && g.avatar_url && !g.avatar_url.includes('ui-avatars')) {
            toKeep.push(g);
            seenNames.add(name);
        } else {
            toDeleteIds.push(g.id);
        }
    }

    console.log(`유지할 가이드 (${toKeep.length}명):`);
    toKeep.forEach(g => console.log(`- ${g.full_name} (${g.avatar_url})`));

    if (toDeleteIds.length > 0) {
        console.log(`\n삭제 대상 수: ${toDeleteIds.length}명`);

        // Delete from guides_detail first
        const { error: dError } = await supabase.from('guides_detail').delete().in('id', toDeleteIds);
        if (dError) console.error("guides_detail 삭제 중 오류:", dError);

        // Delete from profiles
        const { error: pError } = await supabase.from('profiles').delete().in('id', toDeleteIds);
        if (pError) console.error("profiles 삭제 중 오류:", pError);

        console.log("삭제 작업 완료.");
    } else {
        console.log("\n삭제할 대상이 없습니다.");
    }
}

performGuidCleanup();
