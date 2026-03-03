import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkTypes() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    // We can't easily get SQL types via JS SDK directly without a special query,
    // but we can try to guess by viewing the first row more carefully if it existed,
    // or we can try to insert a test row with nulls and see what fails.
    // Better: use rpc if available, or just assume common sense.

    // Actually, I can use a raw SQL query via a temporary function if I had access,
    // but I don't.
    // Let's assume duration and price are actually integers.
    // Duration: 3시간 -> 3
    // Price: 45,000 -> 45000

    console.log("Attempting to infer types by looking at a known row (if any)...");
    const { data } = await supabase.from('tours').select('*').limit(1);
    if (data && data.length > 0) {
        for (const [key, value] of Object.entries(data[0])) {
            console.log(`${key}: ${typeof value} (${value})`);
        }
    } else {
        console.log("No data found.");
    }
}

checkTypes();
