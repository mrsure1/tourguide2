import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const popup = url.searchParams.get("popup") === "1";
  const code = url.searchParams.get("code") || "user_cancel";
  const message = url.searchParams.get("message") || code;
  const orderId = url.searchParams.get("orderId");
  const locale = url.searchParams.get("locale") || "ko";
  const prefix = locale === "en" ? "/en" : "/ko";

  if (popup && orderId) {
    const redirectUrl = new URL(`${prefix}/payment-popup/${orderId}`, origin);
    redirectUrl.searchParams.set("error", code);
    redirectUrl.searchParams.set("message", message);
    return NextResponse.redirect(redirectUrl);
  }

  if (orderId) {
    const redirectUrl = new URL(`${prefix}/traveler/bookings/checkout/${orderId}`, origin);
    redirectUrl.searchParams.set("error", code);
    redirectUrl.searchParams.set("message", message);
    return NextResponse.redirect(redirectUrl);
  }

  const fallbackUrl = new URL(`${prefix}/payment-popup`, origin);
  fallbackUrl.searchParams.set("status", "error");
  fallbackUrl.searchParams.set("message", message);
  return NextResponse.redirect(fallbackUrl);
}
