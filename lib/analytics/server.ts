import { createHash, randomUUID } from "crypto";
import type { ConversionEventName } from "@/lib/analytics/events";
import { reportError } from "@/lib/monitoring/report";

type ServerConversionPayload = {
  bookingId?: string;
  userId?: string;
  email?: string;
  value?: number;
  currency?: string;
  paymentProvider?: "toss" | "paypal" | "kakao" | "unknown";
  paymentIntentId?: string;
  eventId?: string;
};

type TrackingContext = {
  clientIp?: string;
  userAgent?: string;
  eventSourceUrl?: string;
};

function compactRecord<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined && item !== null && item !== ""),
  ) as Partial<T>;
}

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function getFirstForwardedIp(forwardedFor?: string | null) {
  if (!forwardedFor) return undefined;
  return forwardedFor.split(",")[0]?.trim() || undefined;
}

export function buildTrackingContextFromHeaders(
  headers: Headers,
  eventSourceUrl?: string,
): TrackingContext {
  return {
    clientIp: getFirstForwardedIp(headers.get("x-forwarded-for")) || headers.get("x-real-ip") || undefined,
    userAgent: headers.get("user-agent") || undefined,
    eventSourceUrl,
  };
}

async function sendGa4Event(
  eventName: ConversionEventName,
  payload: ServerConversionPayload,
  context: TrackingContext,
) {
  const measurementId =
    process.env.GA4_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
  const apiSecret = process.env.GA4_API_SECRET || "";

  if (!measurementId || !apiSecret) return;

  const gaEventParams = compactRecord({
    booking_id: payload.bookingId,
    currency: payload.currency || "KRW",
    value: typeof payload.value === "number" ? payload.value : undefined,
    payment_provider: payload.paymentProvider,
    payment_intent_id: payload.paymentIntentId,
  });

  const gaBody = compactRecord({
    client_id: payload.userId || context.clientIp || randomUUID(),
    user_id: payload.userId,
    events: [
      {
        name: eventName,
        params: gaEventParams,
      },
    ],
  });

  const response = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gaBody),
    },
  );

  if (!response.ok) {
    throw new Error(`GA4 delivery failed: ${response.status}`);
  }
}

async function sendMetaEvent(
  eventName: ConversionEventName,
  payload: ServerConversionPayload,
  context: TrackingContext,
) {
  const pixelId = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN || "";
  if (!pixelId || !accessToken) return;

  const userData = compactRecord({
    client_ip_address: context.clientIp,
    client_user_agent: context.userAgent,
    em: payload.email ? sha256(payload.email.trim().toLowerCase()) : undefined,
    external_id: payload.userId ? sha256(payload.userId) : undefined,
  });

  if (Object.keys(userData).length === 0) return;

  const customData = compactRecord({
    value: typeof payload.value === "number" ? payload.value : undefined,
    currency: payload.currency || "KRW",
    booking_id: payload.bookingId,
    payment_provider: payload.paymentProvider,
    payment_intent_id: payload.paymentIntentId,
  });

  const eventId = payload.eventId || `${eventName}:${payload.bookingId || randomUUID()}`;

  const metaBody = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: context.eventSourceUrl,
        user_data: userData,
        custom_data: customData,
      },
    ],
    test_event_code: process.env.META_TEST_EVENT_CODE || undefined,
  };

  const response = await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(metaBody),
  });

  if (!response.ok) {
    throw new Error(`Meta CAPI delivery failed: ${response.status}`);
  }
}

export async function trackServerConversion(
  eventName: ConversionEventName,
  payload: ServerConversionPayload,
  context: TrackingContext = {},
) {
  const tasks = [
    sendGa4Event(eventName, payload, context),
    sendMetaEvent(eventName, payload, context),
  ];

  const results = await Promise.allSettled(tasks);
  const rejected = results.filter((result) => result.status === "rejected");

  if (rejected.length > 0) {
    await reportError(new Error("Analytics delivery failed"), {
      source: "analytics:server-conversion",
      level: "warning",
      extra: {
        eventName,
        bookingId: payload.bookingId,
        provider: payload.paymentProvider,
        failures: rejected.length,
      },
    });
  }
}
