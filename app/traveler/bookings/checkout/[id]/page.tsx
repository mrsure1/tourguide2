import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import CheckoutClient from "@/app/traveler/bookings/components/CheckoutClient";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // 1. Fetch booking details (No Joins to avoid relationship errors)
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .eq('traveler_id', user.id)
        .single();

    if (bookingError || !booking) {
        console.error("Booking not found or error:", bookingError);
        return (
            <div className="p-10 border-4 border-red-500 bg-red-50 m-10 rounded-xl">
                <h1 className="text-2xl font-black text-red-600 mb-4">🚨 데이터 조회 실패 (Debug Mode)</h1>
                <div className="space-y-4">
                    <div>
                        <p className="font-bold text-gray-700">전달된 ID:</p>
                        <code className="bg-white p-1 rounded border shadow-sm block">{id}</code>
                    </div>
                    <div>
                        <p className="font-bold text-gray-700">접속한 사용자 ID (user.id):</p>
                        <code className="bg-white p-1 rounded border shadow-sm block">{user.id}</code>
                    </div>
                    <div>
                        <p className="font-bold text-red-700">에러 상세 정보:</p>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto text-xs">
                            {JSON.stringify(bookingError, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Fetch traveler details separately
    const { data: traveler } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', booking.traveler_id)
        .single();

    // 3. Fetch guide details separately
    const { data: guideProfile } = await supabase
        .from('profiles')
        .select(`
            full_name, 
            avatar_url, 
            guides_detail(location, languages, rating)
        `)
        .eq('id', booking.guide_id)
        .single();

    // 4. Fetch tour details separately
    let tour = null;
    if (booking.tour_id) {
        const { data: tourData } = await supabase
            .from('tours')
            .select('title, photo, duration, max_guests, region')
            .eq('id', booking.tour_id)
            .single();
        tour = tourData;
    }

    // 5. Merge all data for the client component
    const fullBooking = {
        ...booking,
        traveler,
        guide: guideProfile,
        tour
    };

    // Only confirmed bookings can be paid for
    if (booking.status !== 'confirmed') {
        redirect('/traveler/bookings');
    }

    return <CheckoutClient booking={fullBooking} />;
}

