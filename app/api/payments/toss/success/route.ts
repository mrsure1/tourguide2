import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Toss Payments Secret Key
const widgetSecretKey = process.env.TOSS_SECRET_KEY || "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";

export async function GET(request: Request) {
    console.log("--- Toss Payments Success Callback ---");
    const { searchParams } = new URL(request.url);
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId'); // UUID from bookings table
    const amount = searchParams.get('amount');

    if (!paymentKey || !orderId || !amount) {
        return NextResponse.redirect(`${request.headers.get('origin')}/traveler/bookings?error=InvalidPaymentParams`);
    }

    try {
        // 1. Verify Payment with Toss API
        const encryptedSecretKey = `Basic ${Buffer.from(widgetSecretKey + ":").toString("base64")}`;

        const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
            method: "POST",
            headers: {
                Authorization: encryptedSecretKey,
                "Content-Type": "application/json",
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
            return NextResponse.redirect(`${request.headers.get('origin')}/traveler/bookings/checkout/${orderId}?error=${data.code}`);
        }

        // 2. Update booking status in database
        const supabase = await createClient();
        const { error } = await supabase
            .from('bookings')
            .update({
                status: 'paid',
                payment_intent_id: paymentKey
            })
            .eq('id', orderId);

        if (error) {
            console.error("Database update failed after payment:", error);
            // Even if DB fails, payment succeeded. Should log tightly in prod.
        }

        // 3. Revalidate paths
        revalidatePath('/traveler/bookings');
        revalidatePath('/admin/payments');

        // 4. Redirect to bookings page with success
        return NextResponse.redirect(`${request.headers.get('origin')}/traveler/bookings?payment=success`);

    } catch (error: any) {
        console.error("Payment Confirmation Error:", error);
        return NextResponse.redirect(`${request.headers.get('origin')}/traveler/bookings/checkout/${orderId}?error=InternalError`);
    }
}
