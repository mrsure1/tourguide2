import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkIds() {
  const { data: details, error } = await supabase
    .from("guides_detail")
    .select("id");

  if (error) {
    console.error("Error fetching details:", error);
    return;
  }

  console.log("IDs in guides_detail:");
  details.forEach(d => console.log(d.id));

  const { data: profiles, error: pError } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .limit(30);
  
  console.log("\nProfiles sampled (including travelers):");
  profiles?.forEach(p => console.log(`ID: ${p.id}, Role: ${p.role}, Name: ${p.full_name}`));
}

checkIds();
