"use client";

import type { ConversionEventName } from "@/lib/analytics/events";

type ConversionParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function compactParams(params?: ConversionParams) {
  if (!params) return {};
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
  );
}

export function trackClientConversion(event: ConversionEventName, params?: ConversionParams) {
  const payload = compactParams(params);

  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }

  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", event, payload);
  }
}

