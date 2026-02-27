import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function GuideProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'guide') {
        redirect('/role-selection');
    }

    const { data: guideDetail } = await supabase
        .from('guides_detail')
        .select('*')
        .eq('id', user.id)
        .single();

    return <ProfileClient profile={profile} detail={guideDetail} />;
}
