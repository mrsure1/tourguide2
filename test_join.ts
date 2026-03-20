import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  const { data, error } = await supabase
    .from("profiles")
    .select(`
        id,
        full_name,
        avatar_url,
        guides_detail (*)
    `)
    .in("role", ["guide", "admin"])
    .limit(5);

  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Joined Data:", JSON.stringify(data, null, 2));
}
main();
