import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findTop10Guides() {
    const { data: guides, error } = await supabase
        .from('profiles')
        .select(`
            id,
            full_name,
            avatar_url,
            guides_detail (
                id
            )
        `)
        .eq('role', 'guide');

    if (error) {
        console.error(error);
        return;
    }

    // Sort by name and image presence
    const sorted = guides.sort((a, b) => {
        const aHasImage = a.avatar_url && !a.avatar_url.includes('ui-avatars') ? 1 : 0;
        const bHasImage = b.avatar_url && !b.avatar_url.includes('ui-avatars') ? 1 : 0;
        if (bHasImage !== aHasImage) return bHasImage - aHasImage;
        return a.full_name.localeCompare(b.full_name);
    });

    console.log("=== 가이드 정리 제안 (상위 10인 유지 예정) ===");
    const seenNames = new Set();
    const toKeep = [];
    const toDelete = [];

    sorted.forEach(g => {
        const name = g.full_name || 'Unknown';
        if (toKeep.length < 10 && !seenNames.has(name) && g.avatar_url && !g.avatar_url.includes('ui-avatars')) {
            toKeep.push(g);
            seenNames.add(name);
        } else {
            toDelete.push(g);
        }
    });

    console.log("\n[유지 대상]");
    toKeep.forEach(g => console.log(`- ${g.full_name} (${g.avatar_url})`));

    console.log("\n[삭제 대상]");
    toDelete.forEach(g => console.log(`- ${g.full_name} (${g.id})`));
}

findTop10Guides();
