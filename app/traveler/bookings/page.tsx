import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BookingsClient from "./BookingsClient";

export default async function TravelerBookings() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch bookings along with the guide profile details
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
            *,
            guide_id:profiles!bookings_guide_id_fkey (
                id,
                full_name,
                guides_detail (
                    rating,
                    location,
                    languages
                )
            )
        `)
        .eq('traveler_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching traveler bookings:", error);
    }

    // Process bookings to handle array relation return in supabase
    const processedBookings = (bookings || []).map(b => {
        const guide = b.guide_id as any;
        if (guide && Array.isArray(guide.guides_detail)) {
            guide.guides_detail = guide.guides_detail[0] || {};
        }
        return b;
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <BookingsClient bookings={processedBookings} />
        </div>
    );
}
