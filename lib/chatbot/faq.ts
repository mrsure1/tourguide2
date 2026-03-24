import fs from "fs";
import path from "path";
import type { FaqRow } from "@/lib/chatbot/types";

let cache: FaqRow[] | null = null;

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

export function loadFaqRows(): FaqRow[] {
  if (cache) return cache;
  const candidates = [
    path.join(process.cwd(), "ChatBot", "faq_data.csv"),
    path.join(process.cwd(), "chatbot", "faq_data.csv"),
  ];
  let raw = "";
  for (const fp of candidates) {
    try {
      if (fs.existsSync(fp)) {
        raw = fs.readFileSync(fp, "utf8");
        break;
      }
    } catch {
      /* try next */
    }
  }
  raw = raw.replace(/^\uFEFF/, "");
  if (!raw) {
    console.error("[chatbot] FAQ CSV를 찾거나 읽을 수 없습니다. 경로:", candidates.join(", "));
    cache = [];
    return cache;
  }
  const lines = raw.split(/\r?\n/);
  const rows: FaqRow[] = [];
  for (const line of lines) {
    const row = parseLine(line);
    if (row) rows.push(row);
  }
  cache = rows;
  return rows;
}
