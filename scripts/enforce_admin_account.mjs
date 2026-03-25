import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const targetEmail = (process.argv[2] || "leeyob@gmail.com").trim().toLowerCase();

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase service role credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function buildProfilePayload(user, existingProfile) {
  const payload = {
    id: user.id,
    role: "admin",
    full_name:
      existingProfile?.full_name ||
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Admin",
  };

  if (existingProfile && Object.prototype.hasOwnProperty.call(existingProfile, "email")) {
    payload.email = targetEmail;
  }

  if (existingProfile?.avatar_url) {
    payload.avatar_url = existingProfile.avatar_url;
  }

  return payload;
}

async function main() {
  const {
    data: { users },
    error: listError,
  } = await supabase.auth.admin.listUsers();

  if (listError) {
    throw listError;
  }

  const matchedUsers = (users || []).filter(
    (user) => user.email?.trim().toLowerCase() === targetEmail,
  );

  if (matchedUsers.length === 0) {
    throw new Error(`No auth user found for ${targetEmail}`);
  }

  if (matchedUsers.length > 1) {
    throw new Error(`Multiple auth users found for ${targetEmail}. Manual cleanup required.`);
  }

  const user = matchedUsers[0];

  const { data: existingProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  const profilePayload = buildProfilePayload(user, existingProfile);

  const { error: upsertProfileError } = await supabase
    .from("profiles")
    .upsert(profilePayload, { onConflict: "id" });

  if (upsertProfileError) {
    throw upsertProfileError;
  }

  const nextUserMetadata = {
    ...(user.user_metadata || {}),
    role: "admin",
  };

  const { error: updateUserError } = await supabase.auth.admin.updateUserById(user.id, {
    user_metadata: nextUserMetadata,
  });

  if (updateUserError) {
    throw updateUserError;
  }

  const cleanupTargets = [
    { table: "availability", column: "guide_id" },
    { table: "subscriptions", column: "guide_id" },
    { table: "promotions", column: "guide_id" },
    { table: "tours", column: "guide_id" },
    { table: "guides_detail", column: "id" },
  ];

  const cleanupSummary = [];

  for (const target of cleanupTargets) {
    const { data: rows, error: selectError } = await supabase
      .from(target.table)
      .select("id")
      .eq(target.column, user.id);

    if (selectError) {
      throw selectError;
    }

    const count = rows?.length || 0;

    if (count > 0) {
      const { error: deleteError } = await supabase
        .from(target.table)
        .delete()
        .eq(target.column, user.id);

      if (deleteError) {
        throw deleteError;
      }
    }

    cleanupSummary.push({ ...target, count });
  }

  console.log(
    JSON.stringify(
      {
        email: targetEmail,
        userId: user.id,
        profileRole: "admin",
        cleaned: cleanupSummary,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
