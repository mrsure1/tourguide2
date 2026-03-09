import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Toss Payments Secret Key
const widgetSecretKey = process.env.TOSS_SECRET_KEY || "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";

export async function GET(request: Request) {
    console.log("--- Toss Payments Success Callback ---");
    const { searchParams, origin } = new URL(request.url);
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId'); // UUID from bookings table
    const amount = searchParams.get('amount');
    const popup = searchParams.get('popup') === '1';

    if (!paymentKey || !orderId || !amount) {
        if (popup) {
            return NextResponse.redirect(`${origin}/payment-popup?status=error&message=invalid`);
        }
        return NextResponse.redirect(`${origin}/traveler/bookings?error=InvalidPaymentParams`);
    }

    try {
        // 1. Pre-verify amount with our Database (Security Check)
        const supabase = await createClient();
        const { data: booking, error: fetchError } = await supabase
            .from('bookings')
            .select('total_price, status')
            .eq('id', orderId)
            .single();

        if (fetchError || !booking) {
            console.error("Booking not found for verification:", fetchError);
            if (popup) {
                return NextResponse.redirect(`${origin}/payment-popup?status=error&message=booking_not_found`);
            }
            return NextResponse.redirect(`${origin}/traveler/bookings?error=BookingNotFound`);
        }

        if (Number(booking.total_price) !== Number(amount)) {
            console.error("Payment amount mismatch!", { expected: booking.total_price, received: amount });
            if (popup) {
                return NextResponse.redirect(`${origin}/payment-popup?status=error&message=amount_mismatch&bookingId=${orderId}`);
            }
            return NextResponse.redirect(`${origin}/traveler/bookings?error=AmountMismatch`);
        }

        // 2. Verify Payment with Toss API
        const encryptedSecretKey = `Basic ${Buffer.from(widgetSecretKey + ":").toString("base64")}`;

        // Use orderId (Booking UUID) as Idempotency-Key for extra reliability
        const idempotencyKey = orderId;

        const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
            method: "POST",
            headers: {
                Authorization: encryptedSecretKey,
                "Content-Type": "application/json",
                "Idempotency-Key": idempotencyKey,
            },
            body: JSON.stringify({
                orderId,
                amount,
                paymentKey,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Toss Verification Failed:", data);
            if (popup) {
                return NextResponse.redirect(
                    `${origin}/payment-popup/${orderId}?error=${encodeURIComponent(data.code)}&message=${encodeURIComponent(data.message || data.code)}`
                );
            }
            return NextResponse.redirect(`${origin}/traveler/bookings/checkout/${orderId}?error=${data.code}`);
        }

        // 3. Update booking status in database
        const { error: updateError } = await supabase
            .from('bookings')
            .update({
                status: 'paid',
                payment_intent_id: paymentKey
            })
            .eq('id', orderId);

        if (updateError) {
            console.error("Database update failed after payment:", updateError);
        }

        // 4. Revalidate paths
        revalidatePath('/traveler/bookings');
        revalidatePath('/admin/payments');

        // 5. Redirect to bookings page with success
        if (popup) {
            return NextResponse.redirect(`${origin}/payment-popup?status=success&bookingId=${orderId}`);
        }

        return NextResponse.redirect(`${origin}/traveler/bookings?payment=success`);

    } catch (error: any) {
        console.error("Payment Confirmation Error:", error);
        if (popup && orderId) {
            return NextResponse.redirect(`${origin}/payment-popup/${orderId}?error=InternalError&message=internal`);
        }
        return NextResponse.redirect(`${origin}/traveler/bookings/checkout/${orderId}?error=InternalError`);
    }
}
