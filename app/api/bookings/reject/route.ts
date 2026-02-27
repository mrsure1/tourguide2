import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const url = new URL(request.url);
    const bookingId = url.searchParams.get('id');

    if (!bookingId) {
        return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
        .from('bookings')
        .update({ status: 'declined' })
        .eq('id', bookingId)
        .eq('guide_id', user.id); // Security check

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath('/guide/dashboard');
    return NextResponse.redirect(new URL('/guide/dashboard', request.url));
}
