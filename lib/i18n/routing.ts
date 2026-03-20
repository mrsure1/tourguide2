import { DEFAULT_LOCALE, detectLocaleFromAcceptLanguage, isSupportedLocale, type Locale } from "@/lib/i18n/config";

export type RequestLocaleSource = "path" | "cookie" | "accept-language" | "default";

export function getLocaleFromPathname(pathname: string): Locale | null {
  const match = pathname.match(/^\/(en|ko)(?:\/|$)/);
  if (!match) return null;
  return match[1] as Locale;
}

export function stripLocalePrefix(pathname: string) {
  const locale = getLocaleFromPathname(pathname);
  if (!locale) return pathname;

  const stripped = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "");
  return stripped === "" ? "/" : stripped;
}

export function localizePath(locale: Locale, href: string) {
  if (!href.startsWith("/")) return href;

  const url = new URL(href, "https://guidematch.local");
  const strippedPath = stripLocalePrefix(url.pathname);
  const localizedPath = strippedPath === "/" ? `/${locale}` : `/${locale}${strippedPath}`;

  return `${localizedPath}${url.search}${url.hash}`;
}

export function resolveLocaleFromSignals({
  pathname,
  cookieLocale,
  acceptLanguage,
}: {
  pathname: string;
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
}): { locale: Locale; source: RequestLocaleSource } {
  const pathLocale = getLocaleFromPathname(pathname);
  if (pathLocale) {
    return { locale: pathLocale, source: "path" };
  }

  if (isSupportedLocale(cookieLocale)) {
    return { locale: cookieLocale, source: "cookie" };
  }

  const detected = detectLocaleFromAcceptLanguage(acceptLanguage);
  if (detected) {
    return { locale: detected, source: "accept-language" };
  }

  return { locale: DEFAULT_LOCALE, source: "default" };
}
