import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable() {
    console.log("=== bookings 테이블 컬럼 확인 ===");
    const { data: cols, error: cError } = await supabase.rpc('get_table_columns_v2', { tname: 'bookings' });

    // If RPC doesn't exist (likely), use a direct select to see structure
    const { data: sample, error: sError } = await supabase.from('bookings').select('*').limit(1);

    if (sError) {
        console.error("Error fetching sample:", sError);
    } else if (sample && sample.length > 0) {
        console.log("Columns present in bookings:", Object.keys(sample[0]));
    } else {
        console.log("No bookings found to inspect columns.");
    }
}

inspectTable();
