import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: 'd:/MrSure/guidematch/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSignup(email) {
  console.log(`Testing signup for: ${email}`);
  
  const password = "testPassword123!";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            full_name: "Test User",
            role: "traveler"
        }
    }
  });

  if (error) {
    console.error("Error signing up:");
    console.error(JSON.stringify(error, null, 2));
  } else {
    console.log("Success! Supabase returned a successful response.");
    console.log(JSON.stringify(data, null, 2));
    
    if (data.session) {
        console.log("\n[ANALYSIS] Email confirmation is DISABLED in Supabase. User was logged in immediately.");
    } else {
        console.log("\n[ANALYSIS] Email confirmation is ENABLED in Supabase. A verification email should have been sent.");
        console.log("If the email didn't arrive, check the SMTP settings in Supabase Dashboard.");
    }
  }
}

// Generate a random email to avoid "User already exists" error
const randomEmail = `test_${Math.floor(Math.random() * 100000)}@test.com`;
const testEmail = process.argv[2] || randomEmail;
testSignup(testEmail);
