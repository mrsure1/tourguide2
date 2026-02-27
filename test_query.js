const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testQuery() {
    console.log("Testing original query...");
    const { data, error } = await supabase
        .from('profiles')
        .select(`
            id,
            full_name,
            avatar_url,
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
        .eq('role', 'guide')
        .not('guides_detail', 'is', null);

    if (error) {
        console.error("Error 1:", JSON.stringify(error, null, 2));
    } else {
        console.log("Success 1, count:", data.length);
    }

    console.log("\nTesting inner join query...");
    const { data: data2, error: error2 } = await supabase
        .from('profiles')
        .select(`
            id,
            full_name,
            avatar_url,
            guides_detail!inner (
                id,
                location,
                languages,
                bio,
                hourly_rate,
                rating,
                review_count
            )
        `)
        .eq('role', 'guide');

    if (error2) {
        console.error("Error 2:", JSON.stringify(error2, null, 2));
    } else {
        console.log("Success 2, count:", data2.length);
    }
}

testQuery();
