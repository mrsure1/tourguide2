
import { createClient } from './lib/supabase/server';

async function findUser() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .ilike('full_name', '%이진영%');

    if (error) {
        console.error('Error finding user:', error);
        return;
    }
    console.log('Search Results:', JSON.stringify(data, null, 2));
}

findUser();
