import type { Locale } from "@/lib/i18n/config";

export const DESTINATION_DEFINITIONS = [
  {
    value: "서울",
    labels: { ko: "서울", en: "Seoul" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["서울", "seoul"],
  },
  {
    value: "제주",
    labels: { ko: "제주", en: "Jeju" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["제주", "jeju"],
  },
  {
    value: "부산",
    labels: { ko: "부산", en: "Busan" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["부산", "busan"],
  },
  {
    value: "인천",
    labels: { ko: "인천", en: "Incheon" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["인천", "incheon"],
  },
  {
    value: "경주",
    labels: { ko: "경주", en: "Gyeongju" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["경주", "gyeongju"],
  },
  {
    value: "강릉",
    labels: { ko: "강릉", en: "Gangneung" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["강릉", "gangneung"],
  },
  {
    value: "여수",
    labels: { ko: "여수", en: "Yeosu" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["여수", "yeosu"],
  },
  {
    value: "전주",
    labels: { ko: "전주", en: "Jeonju" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["전주", "jeonju"],
  },
] as const;

export function resolveDestinationSearchValue(input: string) {
  const normalizedInput = input.trim().toLowerCase();
  const match = DESTINATION_DEFINITIONS.find((destination) =>
    destination.aliases.some((alias) => alias.toLowerCase() === normalizedInput),
  );

  return match?.value ?? input.trim();
}

export function formatDateRange(startDate: string, endDate: string, locale: Locale, fallbackLabel: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return fallbackLabel;
  }

  if (locale === "ko") {
    return `${start.getMonth() + 1}.${start.getDate()} - ${end.getMonth() + 1}.${end.getDate()}`;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

export function replaceCount(template: string, count: number) {
  return template.replace("{count}", String(count));
}

export function replaceName(template: string, name: string) {
  return template.replace("{name}", name);
}
