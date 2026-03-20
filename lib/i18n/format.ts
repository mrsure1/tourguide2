import type { Locale } from "@/lib/i18n/config";

export function formatCurrencyKRW(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatReviewCount(value: number | null, locale: Locale) {
  const count = value ?? 0;
  const formatted = new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US").format(count);
  return locale === "ko" ? `후기 ${formatted}개` : `${formatted} reviews`;
}

export function formatDurationHours(value: number, locale: Locale) {
  if (locale === "ko") {
    return `${value}시간`;
  }

  return `${value} hr${value === 1 ? "" : "s"}`;
}

export function formatGuestCount(count: number, locale: Locale) {
  if (locale === "ko") {
    return `${count}명`;
  }

  return `${count}`;
}
