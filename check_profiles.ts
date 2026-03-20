import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
  console.log("Connecting to:", supabaseUrl);
  const { data, error } = await supabase
    .from("profiles")
    .select("role");

  if (error) {
    console.error("Error fetching profiles:", error);
  } else if (!data || data.length === 0) {
    console.log("No profiles found.");
  } else {
    const roles = Array.from(new Set(data.map(d => d.role)));
    console.log("Unique roles found in DB:", roles);
    
    // Also check total count
    console.log("Total profile records:", data.length);
  }
}

checkProfiles();
