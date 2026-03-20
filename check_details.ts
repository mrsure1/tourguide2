import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDetails() {
  const { data, error } = await supabase
    .from("guides_detail")
    .select("*")
    .limit(10);

  if (error) {
    console.error("Error fetching guides_detail:", error);
  } else {
    console.log(`Found ${data.length} records in guides_detail:`);
    data.forEach(d => console.log(`ID: ${d.id}, ProfileID: ${d.id}, Location: ${d.location}`));
  }
}

checkDetails();
