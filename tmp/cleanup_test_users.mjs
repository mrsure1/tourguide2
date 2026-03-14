import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: 'd:/MrSure/guidematch/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function cleanup() {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) {
        console.error(error);
        return;
    }

    const testUsers = users.filter(u => u.email.includes('@test.com') || u.email.includes('@debug.com') || u.email.includes('@sharklasers.com'));
    console.log(`Deleting ${testUsers.length} test users...`);

    for (const user of testUsers) {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
        if (deleteError) {
            console.error(`Error deleting ${user.email}:`, deleteError);
        } else {
            console.log(`Deleted: ${user.email}`);
        }
    }
}

cleanup();
