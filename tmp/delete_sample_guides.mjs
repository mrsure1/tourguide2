import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteSampleGuides() {
    console.log("Starting deletion of sample guides...");

    // sample IDs: 00000000-0000-0000-0000-000000000001 to 00000000-0000-0000-0000-000000000034
    const sampleIds = [];
    for (let i = 1; i <= 34; i++) {
        sampleIds.push(`00000000-0000-0000-0000-${i.toString().padStart(12, '0')}`);
    }

    // 1. Delete from guides_detail
    console.log("Deleting from guides_detail...");
    const { error: dError } = await supabase
        .from('guides_detail')
        .delete()
        .in('id', sampleIds);

    if (dError) {
        console.error("Error deleting from guides_detail:", dError);
    } else {
        console.log("Deleted from guides_detail successfully.");
    }

    // 2. Delete from profiles
    console.log("Deleting from profiles...");
    const { error: pError } = await supabase
        .from('profiles')
        .delete()
        .in('id', sampleIds);

    if (pError) {
        console.error("Error deleting from profiles:", pError);
    } else {
        console.log("Deleted from profiles successfully.");
    }

    console.log("Deletion process finished.");
}

deleteSampleGuides();
