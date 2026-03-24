import fs from "fs";
import path from "path";
import type { SiteChunk } from "@/lib/chatbot/types";

let cache: SiteChunk[] | null = null;

export function loadSiteCorpus(): SiteChunk[] {
  if (cache) return cache;
  const fp = path.join(process.cwd(), "lib", "chatbot", "site-corpus.json");
  if (!fs.existsSync(fp)) {
    cache = [];
    return cache;
  }
  try {
    const raw = fs.readFileSync(fp, "utf8");
    const parsed = JSON.parse(raw) as SiteChunk[];
    cache = Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("[chatbot] site-corpus.json 파싱 실패:", e);
    cache = [];
  }
  return cache;
}
