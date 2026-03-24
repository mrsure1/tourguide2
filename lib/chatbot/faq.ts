import fs from "fs";
import path from "path";
import type { FaqRow } from "@/lib/chatbot/types";
import bundledKo from "./faq-bundled-ko.json";
import bundledEn from "./faq-bundled-en.json";

/**
 * FAQ는 `prebuild` 시 `scripts/build-chatbot-corpus.mjs`가 CSV를 읽어
 * `faq-bundled-*.json`으로 넣습니다. 서버리스에서 fs로 ChatBot/ 경로를 못 읽어도
 * 번들에 포함되어 매칭이 동작합니다. JSON이 비었을 때만 디스크 CSV를 시도합니다.
 */
const cache = new Map<string, FaqRow[]>();

const KO_DISK_PATHS = [
  path.join(process.cwd(), "ChatBot", "faq_data.csv"),
  path.join(process.cwd(), "chatbot", "faq_data.csv"),
];

const EN_DISK_PATHS = [
  path.join(process.cwd(), "ChatBot", "faq_data_english.csv"),
  path.join(process.cwd(), "chatbot", "faq_data_english.csv"),
];

function parseLine(line: string): FaqRow | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("Question,")) return null;

  const quoted = trimmed.match(/^(.+),"(.*)"$/);
  if (quoted) {
    return {
      question: quoted[1].trim(),
      answer: quoted[2].replace(/""/g, '"').trim(),
    };
  }

  const i = trimmed.indexOf(",");
  if (i === -1) return null;
  const question = trimmed.slice(0, i).trim();
  const answer = trimmed.slice(i + 1).trim();
  if (question.length < 2 || answer.length < 2) return null;
  return { question, answer };
}

function parseCsv(raw: string): FaqRow[] {
  const lines = raw.split(/\r?\n/);
  const rows: FaqRow[] = [];
  for (const line of lines) {
    const row = parseLine(line);
    if (row) rows.push(row);
  }
  return rows;
}

function readFirstExisting(paths: string[]): string {
  for (const fp of paths) {
    try {
      if (fs.existsSync(fp)) {
        return fs.readFileSync(fp, "utf8");
      }
    } catch {
      /* try next */
    }
  }
  return "";
}

function loadFaqFromDisk(which: "ko" | "en"): FaqRow[] {
  const paths = which === "en" ? EN_DISK_PATHS : KO_DISK_PATHS;
  let raw = readFirstExisting(paths).replace(/^\uFEFF/, "");
  if (which === "en" && !raw.trim()) {
    console.warn(
      "[chatbot] faq_data_english.csv를 찾지 못했습니다. 한국어 CSV로 대체합니다.",
    );
    raw = readFirstExisting(KO_DISK_PATHS).replace(/^\uFEFF/, "");
  }
  if (!raw.trim()) return [];
  return parseCsv(raw);
}

/**
 * FAQ 로드. `en`이면 영어 번들(비면 ko), 그 외는 한국어 번들.
 */
export function loadFaqRows(locale = "ko"): FaqRow[] {
  const key = locale === "en" ? "en" : "ko";
  const hit = cache.get(key);
  if (hit) return hit;

  const ko = bundledKo as FaqRow[];
  const en = bundledEn as FaqRow[];

  let rows: FaqRow[] =
    key === "en" ? (en.length > 0 ? en : ko) : ko;

  if (rows.length === 0) {
    rows = loadFaqFromDisk(key === "en" ? "en" : "ko");
    if (key === "en" && rows.length === 0) {
      rows = loadFaqFromDisk("ko");
    }
  }

  if (rows.length === 0) {
    console.error(
      "[chatbot] FAQ 데이터가 비어 있습니다. `node scripts/build-chatbot-corpus.mjs` 실행 또는 ChatBot/faq_data.csv를 확인하세요.",
    );
  }

  cache.set(key, rows);
  return rows;
}
