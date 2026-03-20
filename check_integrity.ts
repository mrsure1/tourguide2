import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkIntegrity() {
  const { data: guides, error: gError } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("role", "guide");

  if (gError) {
    console.error("Error fetching guides:", gError);
    return;
  }

  console.log(`Found ${guides.length} guides in profiles table.`);

  const { data: details, error: dError } = await supabase
    .from("guides_detail")
    .select("id, location");

  if (dError) {
    console.error("Error fetching details:", dError);
    return;
  }

  console.log(`Found ${details.length} records in guides_detail table.`);

  guides.forEach(g => {
    const hasDetail = details.some(d => d.id === g.id);
    console.log(`Guide: ${g.full_name} (${g.id}) | Has Detail: ${hasDetail}`);
  });
}

checkIntegrity();
