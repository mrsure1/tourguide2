import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkTours() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const { data: tours, error } = await supabase
        .from('tours')
        .select('id, title, is_active, photo')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("DB Error:", error.message);
        return;
    }

    console.log(`TOTAL TOURS FOUND: ${tours.length}`);
    tours.forEach((t, i) => {
        console.log(`[${i + 1}] TITLE: "${t.title}" | ACTIVE: ${t.is_active} | PHOTO: ${t.photo}`);
    });
}

checkTours();
