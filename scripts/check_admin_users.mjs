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

async function checkAdminAccounts() {
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  
  // Find any email containing 'leeyob'
  const matchedUsers = users.filter(u => u.email && u.email.toLowerCase().includes('leeyob'));
  
  const userIds = matchedUsers.map(u => u.id);

  const { data: profiles } = await supabase.from('profiles').select('*').in('id', userIds);
  const { data: guides_detail } = await supabase.from('guides_detail').select('*').in('id', userIds);
  const { data: tours } = await supabase.from('tours').select('id, title, profiles!inner(id)').in('profiles.id', userIds);

  const fs = await import('fs');
  fs.writeFileSync('admin_data.json', JSON.stringify({ matchedUsers, profiles, guides_detail, tours }, null, 2));
  console.log('Saved to admin_data.json');
}

checkAdminAccounts();
