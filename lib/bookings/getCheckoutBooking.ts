import { createClient } from "@/lib/supabase/server";

export async function getCheckoutBooking(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, booking: null, fullBooking: null, bookingError: null };
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .eq("traveler_id", user.id)
    .single();

  if (bookingError || !booking) {
    return { user, booking: null, fullBooking: null, bookingError };
  }

  const { data: traveler } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", booking.traveler_id)
    .single();

  const { data: guideProfile } = await supabase
    .from("profiles")
    .select(
      `
        full_name,
        avatar_url,
        guides_detail(location, languages, rating)
      `,
    )
    .eq("id", booking.guide_id)
    .single();

  let tour = null;
  if (booking.tour_id) {
    const { data: tourData } = await supabase
      .from("tours")
      .select("title, photo, duration, max_guests, region")
      .eq("id", booking.tour_id)
      .single();
    tour = tourData;
  }

  return {
    user,
    booking,
    bookingError: null,
    fullBooking: {
      ...booking,
      traveler,
      guide: guideProfile,
      tour,
    },
  };
}
