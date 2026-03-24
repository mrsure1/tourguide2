/**
 * Extracts site copy from messages/*.json and selected app pages for chatbot RAG.
 * Output: lib/chatbot/site-corpus.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outPath = path.join(root, "lib", "chatbot", "site-corpus.json");

const MAX_CHUNK = 720;
const MIN_STRING_LEN = 12;

/** @param {unknown} obj @param {string[]} out */
function walkJsonStrings(obj, out) {
  if (typeof obj === "string") {
    const t = obj.trim();
    if (t.length >= MIN_STRING_LEN) out.push(t);
  } else if (Array.isArray(obj)) {
    for (const x of obj) walkJsonStrings(x, out);
  } else if (obj && typeof obj === "object") {
    for (const v of Object.values(obj)) walkJsonStrings(v, out);
  }
}

/** @param {string} s */
function chunkText(s) {
  const chunks = [];
  for (let i = 0; i < s.length; i += MAX_CHUNK) {
    chunks.push(s.slice(i, i + MAX_CHUNK));
  }
  return chunks.length ? chunks : [s];
}

/** @param {string} dir */
function listJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
}

/** @param {string} src */
function extractQuotedStrings(src) {
  const out = new Set();
  const re = /["']([^"'\\]{15,800})["']/g;
  let m;
  while ((m = re.exec(src))) {
    let s = m[1].replace(/\\n/g, "\n");
    if (/^[\s./@\-_a-zA-Z0-9{}[\]:,$]+$/.test(s)) continue;
    if (s.includes("className")) continue;
    if (s.startsWith("http")) continue;
    if (s.includes("import ") || s.includes("from ")) continue;
    out.add(s.trim());
  }
  return [...out];
}

/** @param {string} rel */
function readPageStrings(rel) {
  const fp = path.join(root, rel);
  if (!fs.existsSync(fp)) return [];
  return extractQuotedStrings(fs.readFileSync(fp, "utf8"));
}

function main() {
  /** @type {{ id: string; source: string; text: string; locale?: string }[]} */
  const rows = [];
  let id = 0;

  for (const loc of ["ko", "en"]) {
    const mdir = path.join(root, "messages", loc);
    for (const file of listJsonFiles(mdir)) {
      const fp = path.join(mdir, file);
      const j = JSON.parse(fs.readFileSync(fp, "utf8"));
      const strings = [];
      walkJsonStrings(j, strings);
      for (const str of strings) {
        for (const part of chunkText(str)) {
          rows.push({
            id: `m-${++id}`,
            source: `messages/${loc}/${file}`,
            locale: loc,
            text: part,
          });
        }
      }
    }
  }

  const pageFiles = [
    "app/support/page.tsx",
    "app/support/inquiry/page.tsx",
    "app/terms/page.tsx",
    "app/partnership/page.tsx",
    "app/archive/page.tsx",
  ];

  for (const pf of pageFiles) {
    for (const s of readPageStrings(pf)) {
      for (const part of chunkText(s)) {
        rows.push({
          id: `p-${++id}`,
          source: pf,
          text: part,
        });
      }
    }
  }

  const seen = new Set();
  const deduped = rows.filter((r) => {
    const k = r.text;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(deduped));
  console.info(`[chatbot-corpus] wrote ${deduped.length} chunks -> ${path.relative(root, outPath)}`);
}

main();
