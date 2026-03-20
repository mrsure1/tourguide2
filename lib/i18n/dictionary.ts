import type { Locale } from "@/lib/i18n/config";
import commonEn from "@/messages/en/common.json";
import landingEn from "@/messages/en/landing.json";
import authEn from "@/messages/en/auth.json";
import commonKo from "@/messages/ko/common.json";
import landingKo from "@/messages/ko/landing.json";
import authKo from "@/messages/ko/auth.json";

const dictionaries = {
  en: {
    common: commonEn,
    landing: landingEn,
    auth: authEn,
  },
  ko: {
    common: commonKo,
    landing: landingKo,
    auth: authKo,
  },
} as const;

export type Dictionary = (typeof dictionaries)["en"];

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale] ?? dictionaries.en;
}
