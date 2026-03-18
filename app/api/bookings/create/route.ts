import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { buildTrackingContextFromHeaders, trackServerConversion } from "@/lib/analytics/server";
import { reportError } from "@/lib/monitoring/report";

type SampleGuide = {
  full_name: string;
  role: "guide";
};

const SAMPLE_GUIDES: Record<string, SampleGuide> = {
  "44444444-4444-4444-4444-444444444444": { full_name: "Gina", role: "guide" },
  "11111111-1111-1111-1111-111111111111": { full_name: "James", role: "guide" },
  "22222222-2222-2222-2222-222222222222": { full_name: "Soyeon", role: "guide" },
  "33333333-3333-3333-3333-333333333333": { full_name: "Henry", role: "guide" },
  "1d1742de-7c17-4ffa-9f73-41a29d6eadc2": { full_name: "Minsoo", role: "guide" },
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const guideId = formData.get("guide_id") as string;
    const startDate = formData.get("start_date") as string;
    const endDate = formData.get("end_date") as string;
    const totalPrice = formData.get("total_price") as string;
    const guests = formData.get("guests") as string;

    if (!guideId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const parsedTotalPrice = Number.parseFloat(totalPrice);
    if (!Number.isFinite(parsedTotalPrice) || parsedTotalPrice <= 0) {
      return NextResponse.json({ error: "Invalid total_price" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please login to book a guide." }, { status: 401 });
    }

    const { data: travelerProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!travelerProfile) {
      await supabase.from("profiles").upsert({
        id: user.id,
        role: "traveler",
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
      });
    }

    const { data: guideProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", guideId)
      .maybeSingle();

    if (!guideProfile && SAMPLE_GUIDES[guideId]) {
      await supabase.from("profiles").upsert({
        id: guideId,
        ...SAMPLE_GUIDES[guideId],
      });

      await supabase.from("guides_detail").upsert({
        id: guideId,
        location: "Seoul",
        hourly_rate: 100000,
      });
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          traveler_id: user.id,
          guide_id: guideId,
          start_date: new Date(startDate).toISOString(),
          end_date: new Date(endDate).toISOString(),
          status: "pending",
          total_price: parsedTotalPrice,
          guests: Number.parseInt(guests || "1", 10),
        },
      ])
      .select();

    if (error) {
      await reportError(error, {
        source: "api/bookings/create:insert",
        request,
        extra: {
          guideId,
          travelerId: user.id,
          startDate,
          endDate,
        },
      });

      if (error.code === "23503") {
        return NextResponse.json(
          {
            error: `Booking failed: guide(${guideId}) or traveler profile is invalid.`,
          },
          { status: 400 },
        );
      }

      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const booking = data?.[0];

    await trackServerConversion(
      "booking_created",
      {
        bookingId: booking?.id,
        userId: user.id,
        value: parsedTotalPrice,
        currency: "KRW",
        eventId: `booking_created:${booking?.id ?? "unknown"}`,
      },
      buildTrackingContextFromHeaders(request.headers, `${new URL(request.url).origin}/traveler/bookings`),
    );

    revalidatePath("/guide/dashboard");
    revalidatePath("/traveler/bookings");

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    await reportError(error, {
      source: "api/bookings/create:exception",
      request,
    });

    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
