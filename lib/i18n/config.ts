export const SUPPORTED_LOCALES = ["en", "ko"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const GUIDE_DEFAULT_LOCALE: Locale = "ko";
export const LOCALE_COOKIE_NAME = "guidematch_locale";

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "ko";
}

export function normalizeLocale(value: string | null | undefined): Locale | null {
  if (!value) return null;
  const candidate = value.toLowerCase();
  if (candidate.startsWith("ko")) return "ko";
  if (candidate.startsWith("en")) return "en";
  return null;
}

export function detectLocaleFromAcceptLanguage(value: string | null | undefined): Locale {
  if (!value) return DEFAULT_LOCALE;

  const normalized = value.toLowerCase();
  if (normalized.includes("ko")) return "ko";
  return "en";
}

export function getDefaultLocaleForRequest({
  pathname,
  roleParam,
}: {
  pathname: string;
  roleParam?: string | null;
}): Locale {
  // 가이드/관리자 영역은 무조건 한국어를 사용합니다.
  if (pathname.startsWith("/guide") || pathname.startsWith("/admin") || roleParam === "guide") {
    return GUIDE_DEFAULT_LOCALE;
  }

  // 여행자/공개 영역은 무조건 영어를 기본값으로 고정합니다.
  return DEFAULT_LOCALE;
}

export function toOpenGraphLocale(locale: Locale) {
  return locale === "ko" ? "ko_KR" : "en_US";
}
