import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ScheduleClient from "./ScheduleClient";

export default async function GuideSchedule() {
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

    // Fetch availability (blocked dates)
    const { data: unavailabilities } = await supabase
        .from('availability')
        .select('*')
        .eq('guide_id', user.id);

    // Fetch future bookings (both pending and confirmed)
    const { data: bookings } = await supabase
        .from('bookings')
        .select(`
            *,
            traveler:profiles!traveler_id ( full_name )
        `)
        .eq('guide_id', user.id)
        .gte('end_date', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

    return (
        <ScheduleClient
            bookings={bookings || []}
            unavailabilities={unavailabilities || []}
        />
    );
}
