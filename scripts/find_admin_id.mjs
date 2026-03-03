import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function getAdminId() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .eq('role', 'admin')
        .limit(1);

    if (error) {
        console.error("Error fetching admin:", error);
        return;
    }

    if (profiles && profiles.length > 0) {
        console.log("Admin ID:", profiles[0].id);
        console.log("Admin Name:", profiles[0].full_name);
    } else {
        console.log("No admin found in profiles table.");
    }
}

getAdminId();
