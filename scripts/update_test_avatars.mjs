import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function update() {
  // Update 여행객1 
  const { error: err1 } = await supabase
    .from('profiles')
    .update({ avatar_url: '/traveler1.png' })
    .ilike('full_name', '%여행객%');
    
  if (err1) {
    console.error('Error updating traveler1:', err1);
  } else {
    console.log('Successfully updated traveler1 avatars.');
  }

  // Update guide2
  const { error: err2 } = await supabase
    .from('profiles')
    .update({ avatar_url: '/guide2.png' })
    .ilike('full_name', '%guide2%');
    
  if (err2) {
    console.error('Error updating guide2:', err2);
  } else {
    console.log('Successfully updated guide2 avatars.');
  }
}

update();
