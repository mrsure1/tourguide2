import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE_NAME, type Locale } from "@/lib/i18n/config";
import { resolveLocaleFromSignals } from "@/lib/i18n/routing";

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const localeHeader = headerStore.get("x-guidematch-locale");
  if (localeHeader === "en" || localeHeader === "ko") {
    return localeHeader;
  }

  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const acceptLanguage = headerStore.get("accept-language");

  return resolveLocaleFromSignals({
    pathname: "",
    cookieLocale,
    acceptLanguage,
  }).locale;
}
