import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function findAdmin() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('email', 'leeyob@gmail.com');

    if (error) {
        console.error("Error:", error.message);
        return;
    }

    console.log("Admin Profile:", profiles[0]);
}

findAdmin();
