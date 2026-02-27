const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testQuery() {
    // 1. Get a guide ID first
    const { data: guides, error: listError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'guide')
        .limit(1);

    if (listError || !guides || guides.length === 0) {
        console.error("List Error:", listError);
        return;
    }

    const guideId = guides[0].id;
    console.log("Testing with Guide ID:", guideId, guides[0].full_name);

    // 2. Test the detail query
    const { data: guide, error } = await supabase
        .from('profiles')
        .select(`
            id,
            full_name,
            guides_detail (
                id,
                location,
                languages,
                bio,
                hourly_rate,
                rating,
                review_count
            )
        `)
        .eq('id', guideId)
        .eq('role', 'guide')
        .single();

    console.log("Guide Data:", JSON.stringify(guide, null, 2));
    console.log("Error:", error);
}

testQuery();
