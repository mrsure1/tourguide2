/**
 * 한국 공휴일 데이터를 관리하는 파일입니다.
 * 2024년 ~ 2026년까지의 공휴일 정보를 포함하고 있습니다.
 */

export interface Holiday {
    date: string; // YYYY-MM-DD
    name: string;
    isPublic: boolean;
}

export const KOREAN_HOLIDAYS: Record<string, Holiday> = {
    // 2024년
    "2024-01-01": { date: "2024-01-01", name: "신정", isPublic: true },
    "2024-02-09": { date: "2024-02-09", name: "설날", isPublic: true },
    "2024-02-10": { date: "2024-02-10", name: "설날", isPublic: true },
    "2024-02-11": { date: "2024-02-11", name: "설날", isPublic: true },
    "2024-02-12": { date: "2024-02-12", name: "대체공휴일(설날)", isPublic: true },
    "2024-03-01": { date: "2024-03-01", name: "삼일절", isPublic: true },
    "2024-04-10": { date: "2024-04-10", name: "제22대 국회의원 선거", isPublic: true },
    "2024-05-05": { date: "2024-05-05", name: "어린이날", isPublic: true },
    "2024-05-06": { date: "2024-05-06", name: "대체공휴일(어린이날)", isPublic: true },
    "2024-05-15": { date: "2024-05-15", name: "부처님 오신 날", isPublic: true },
    "2024-06-06": { date: "2024-06-06", name: "현충일", isPublic: true },
    "2024-08-15": { date: "2024-08-15", name: "광복절", isPublic: true },
    "2024-09-16": { date: "2024-09-16", name: "추석", isPublic: true },
    "2024-09-17": { date: "2024-09-17", name: "추석", isPublic: true },
    "2024-09-18": { date: "2024-09-18", name: "추석", isPublic: true },
    "2024-10-03": { date: "2024-10-03", name: "개천절", isPublic: true },
    "2024-10-09": { date: "2024-10-09", name: "한글날", isPublic: true },
    "2024-12-25": { date: "2024-12-25", name: "성탄절", isPublic: true },

    // 2025년
    "2025-01-01": { date: "2025-01-01", name: "신정", isPublic: true },
    "2025-01-28": { date: "2025-01-28", name: "설날", isPublic: true },
    "2025-01-29": { date: "2025-01-29", name: "설날", isPublic: true },
    "2025-01-30": { date: "2025-01-30", name: "설날", isPublic: true },
    "2025-03-01": { date: "2025-03-01", name: "삼일절", isPublic: true },
    "2025-03-03": { date: "2025-03-03", name: "대체공휴일(삼일절)", isPublic: true },
    "2025-05-05": { date: "2025-05-05", name: "어린이날/부처님 오신 날", isPublic: true },
    "2025-05-06": { date: "2025-05-06", name: "대체공휴일(부처님 오신 날)", isPublic: true },
    "2025-06-06": { date: "2025-06-06", name: "현충일", isPublic: true },
    "2025-08-15": { date: "2025-08-15", name: "광복절", isPublic: true },
    "2025-10-03": { date: "2025-10-03", name: "개천절", isPublic: true },
    "2025-10-05": { date: "2025-10-05", name: "추석", isPublic: true },
    "2025-10-06": { date: "2025-10-06", name: "추석", isPublic: true },
    "2025-10-07": { date: "2025-10-07", name: "추석", isPublic: true },
    "2025-10-08": { date: "2025-10-08", name: "대체공휴일(추석)", isPublic: true },
    "2025-10-09": { date: "2025-10-09", name: "한글날", isPublic: true },
    "2025-12-25": { date: "2025-12-25", name: "성탄절", isPublic: true },

    // 2026년
    "2026-01-01": { date: "2026-01-01", name: "신정", isPublic: true },
    "2026-02-16": { date: "2026-02-16", name: "설날", isPublic: true },
    "2026-02-17": { date: "2026-02-17", name: "설날", isPublic: true },
    "2026-02-18": { date: "2026-02-18", name: "설날", isPublic: true },
    "2026-03-01": { date: "2026-03-01", name: "삼일절", isPublic: true },
    "2026-03-02": { date: "2026-03-02", name: "대체공휴일(삼일절)", isPublic: true },
    "2026-05-05": { date: "2026-05-05", name: "어린이날", isPublic: true },
    "2026-05-24": { date: "2026-05-24", name: "부처님 오신 날", isPublic: true },
    "2026-05-25": { date: "2026-05-25", name: "대체공휴일(부처님 오신 날)", isPublic: true },
    "2026-06-03": { date: "2026-06-03", name: "지방선거", isPublic: true },
    "2026-06-06": { date: "2026-06-06", name: "현충일", isPublic: true },
    "2026-08-15": { date: "2026-08-15", name: "광복절", isPublic: true },
    "2026-08-17": { date: "2026-08-17", name: "대체공휴일(광복절)", isPublic: true },
    "2026-09-24": { date: "2026-09-24", name: "추석", isPublic: true },
    "2026-09-25": { date: "2026-09-25", name: "추석", isPublic: true },
    "2026-09-26": { date: "2026-09-26", name: "추석", isPublic: true },
    "2026-10-03": { date: "2026-10-03", name: "개천절", isPublic: true },
    "2026-10-05": { date: "2026-10-05", name: "대체공휴일(개천절)", isPublic: true },
    "2026-10-09": { date: "2026-10-09", name: "한글날", isPublic: true },
    "2026-12-25": { date: "2026-12-25", name: "성탄절", isPublic: true },
};

export const getHoliday = (date: string): Holiday | null => {
    return KOREAN_HOLIDAYS[date] || null;
};

export const isHoliday = (date: string): boolean => {
    return !!KOREAN_HOLIDAYS[date];
};
