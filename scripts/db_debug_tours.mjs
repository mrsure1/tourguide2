import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkTours() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const { data: tours, error } = await supabase
        .from('tours')
        .select('id, title, is_active, photo')
        .order('created_at', { ascending: false });

    let output = "";
    if (error) {
        output = `DB Error: ${error.message}\n`;
    } else {
        output = `TOTAL TOURS FOUND: ${tours.length}\n`;
        tours.forEach((t, i) => {
            output += `[${i + 1}] TITLE: "${t.title}" | ACTIVE: ${t.is_active} | PHOTO: ${t.photo}\n`;
        });
    }

    fs.writeFileSync('tour_debug.txt', output);
    console.log("Check complete. Results written to tour_debug.txt");
}

checkTours();
