import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('id');

    if (!bookingId) {
        return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update status to 'cancelled'
    const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('traveler_id', user.id); // Must be the owner of the booking

    if (error) {
        console.error("Cancellation error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath('/traveler/bookings');
    revalidatePath('/traveler/home');

    return NextResponse.json({ success: true });
}
