import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    try {
        const { orderID, bookingId } = await request.json();

        console.log("--- PayPal Capture Request ---", { orderID, bookingId });

        if (!orderID || !bookingId) {
            return NextResponse.json({ error: 'Missing orderID or bookingId' }, { status: 400 });
        }

        const supabase = await createClient();

        // Security check: ensure the user making the request owns the booking
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: booking, error: fetchError } = await supabase
            .from('bookings')
            .select('id, traveler_id, status')
            .eq('id', bookingId)
            .single();

        if (fetchError || !booking || booking.traveler_id !== user.id) {
            return NextResponse.json({ error: 'Invalid booking' }, { status: 403 });
        }

        if (booking.status !== 'confirmed') {
            return NextResponse.json({ error: 'Booking is not in a payable state' }, { status: 400 });
        }

        // In a real app, you would verify the orderID with PayPal Sandbox/Live API here
        // For testing, we simulate a successful verification

        // Update booking status in database
        const { error: updateError } = await supabase
            .from('bookings')
            .update({
                status: 'paid',
                payment_intent_id: orderID
            })
            .eq('id', bookingId);

        if (updateError) {
            console.error("Database update failed after PayPal payment:", updateError);
            return NextResponse.json({ error: 'Failed to update booking status' }, { status: 500 });
        }

        // Revalidate paths
        revalidatePath('/traveler/bookings');
        revalidatePath('/admin/payments');

        return NextResponse.json({ success: true, orderID });

    } catch (error: any) {
        console.error("PayPal Capture Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
