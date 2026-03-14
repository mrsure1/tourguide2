import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: 'd:/MrSure/guidematch/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runTest() {
    const email = `test_${Date.now()}@test.com`;
    console.log(`Step 1: Signing up with ${email}...`);
    
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password: "TestPassword123!",
    });

    if (signupError) {
        console.error("Signup Error:", signupError);
        return;
    }
    console.log("Signup Success. User ID:", signupData.user?.id);

    console.log("\nStep 2: Checking if user exists via Admin API...");
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
        console.error("List Error:", listError);
        return;
    }

    const found = users.find(u => u.email === email);
    if (found) {
        console.log(`FOUND! Email: ${found.email} | Confirmed: ${found.email_confirmed_at}`);
    } else {
        console.log("NOT FOUND in the list of users.");
        console.log("Total users found:", users.length);
        users.forEach(u => console.log(`- ${u.email}`));
    }
}

runTest();
