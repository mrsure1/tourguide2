import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase Service Role credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function cleanupAdmin() {
  const emailToClean = 'leeyob@gmail.com';
  
  // Find the exact user
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  const targetUser = users.find(u => u.email && u.email.toLowerCase() === emailToClean);

  if (!targetUser) {
    console.log(`No user found with email ${emailToClean}`);
    return;
  }
  
  console.log(`Found target user ID: ${targetUser.id}`);
  
  // Supabase profiles table usually has ON DELETE CASCADE from auth.users,
  // But let's manually delete tours just in case there's no cascade from profile to tours.
  const { error: err1 } = await supabase.from('tours').delete().eq('guide_id', targetUser.id);
  if (err1) console.error('Error deleting tours:', err1);
  else console.log('Deleted tours.');

  const { error: err2 } = await supabase.from('guides_detail').delete().eq('id', targetUser.id);
  if (err2) console.error('Error deleting guide details:', err2);
  else console.log('Deleted guide details.');

  const { error: err3 } = await supabase.from('profiles').delete().eq('id', targetUser.id);
  if (err3) console.error('Error deleting profile:', err3);
  else console.log('Deleted profile.');

  const { data, error: err4 } = await supabase.auth.admin.deleteUser(targetUser.id);
  if (err4) console.error('Error deleting auth user:', err4);
  else console.log(`Deleted auth user successfully: ${targetUser.email}`);
  
  console.log('Cleanup complete!');
}

cleanupAdmin();
