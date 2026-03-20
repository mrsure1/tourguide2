import type { Locale } from "@/lib/i18n/config";

const LANGUAGE_LABELS: Record<string, { en: string; ko: string }> = {
  korean: { en: "Korean", ko: "한국어" },
  한국어: { en: "Korean", ko: "한국어" },
  english: { en: "English", ko: "영어" },
  영어: { en: "English", ko: "영어" },
  japanese: { en: "Japanese", ko: "일본어" },
  일본어: { en: "Japanese", ko: "일본어" },
  chinese: { en: "Chinese", ko: "중국어" },
  중국어: { en: "Chinese", ko: "중국어" },
  french: { en: "French", ko: "프랑스어" },
  프랑스어: { en: "French", ko: "프랑스어" },
  spanish: { en: "Spanish", ko: "스페인어" },
  스페인어: { en: "Spanish", ko: "스페인어" },
  german: { en: "German", ko: "독일어" },
  독일어: { en: "German", ko: "독일어" },
  russian: { en: "Russian", ko: "러시아어" },
  러시아어: { en: "Russian", ko: "러시아어" },
  vietnamese: { en: "Vietnamese", ko: "베트남어" },
  베트남어: { en: "Vietnamese", ko: "베트남어" },
  thai: { en: "Thai", ko: "태국어" },
  태국어: { en: "Thai", ko: "태국어" },
  indonesian: { en: "Indonesian", ko: "인도네시아어" },
  인도네시아어: { en: "Indonesian", ko: "인도네시아어" },
};

const LOCATION_LABELS: Record<string, { en: string; ko: string }> = {
  seoul: { en: "Seoul", ko: "서울" },
  서울: { en: "Seoul", ko: "서울" },
  busan: { en: "Busan", ko: "부산" },
  부산: { en: "Busan", ko: "부산" },
  jeju: { en: "Jeju", ko: "제주" },
  제주: { en: "Jeju", ko: "제주" },
  incheon: { en: "Incheon", ko: "인천" },
  인천: { en: "Incheon", ko: "인천" },
  gyeongju: { en: "Gyeongju", ko: "경주" },
  경주: { en: "Gyeongju", ko: "경주" },
  gangneung: { en: "Gangneung", ko: "강릉" },
  강릉: { en: "Gangneung", ko: "강릉" },
  yeosu: { en: "Yeosu", ko: "여수" },
  여수: { en: "Yeosu", ko: "여수" },
  jeonju: { en: "Jeonju", ko: "전주" },
  전주: { en: "Jeonju", ko: "전주" },
  daegu: { en: "Daegu", ko: "대구" },
  대구: { en: "Daegu", ko: "대구" },
  daejeon: { en: "Daejeon", ko: "대전" },
  대전: { en: "Daejeon", ko: "대전" },
  ulsan: { en: "Ulsan", ko: "울산" },
  울산: { en: "Ulsan", ko: "울산" },
  sokcho: { en: "Sokcho", ko: "속초" },
  속초: { en: "Sokcho", ko: "속초" },
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function pickLocalizedLabel(
  value: string,
  locale: Locale,
  labels: Record<string, { en: string; ko: string }>,
) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const direct = labels[trimmed] || labels[normalizeKey(trimmed)];
  if (direct) {
    return direct[locale];
  }

  return trimmed;
}

export function localizeLanguageLabel(value: string, locale: Locale) {
  return pickLocalizedLabel(value, locale, LANGUAGE_LABELS);
}

export function localizeLanguageList(values: string[] | string | null | undefined, locale: Locale) {
  const list = Array.isArray(values)
    ? values
    : typeof values === "string"
      ? values.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

  return list.map((value) => localizeLanguageLabel(value, locale)).filter(Boolean);
}

export function localizeLocationLabel(value: string | null | undefined, locale: Locale) {
  if (!value) return "";
  return pickLocalizedLabel(value, locale, LOCATION_LABELS);
}
