function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

/** 띄어쓰기 없는 한국어 질문도 FAQ와 맞추기 위한 음절 2-gram */
function hangulBigrams(s: string): string[] {
  const h = s.replace(/[^가-힣]/g, "");
  if (h.length < 2) return [];
  const out: string[] = [];
  for (let i = 0; i < h.length - 1; i++) {
    out.push(h.slice(i, i + 2));
  }
  return [...new Set(out)];
}

function extractKeywords(query: string): string[] {
  const n = normalize(query);
  const words = n.split(/\s+/).filter((w) => w.length > 1);
  const hangul = query.match(/[가-힣]{2,}/g) ?? [];
  const latin = query.match(/[a-zA-Z]{3,}/g) ?? [];
  const bi = hangulBigrams(query);
  return [
    ...new Set([
      ...words,
      ...hangul.map((h) => h.toLowerCase()),
      ...latin.map((x) => x.toLowerCase()),
      ...bi,
    ]),
  ];
}

export function scoreText(query: string, text: string): number {
  const qk = extractKeywords(query);
  const tn = normalize(text);
  if (qk.length === 0) return 0;

  let score = 0;
  for (const kw of qk) {
    const k = kw.toLowerCase();
    if (tn.includes(k)) score += k.length >= 3 ? 2 : 1;
  }

  const pn = normalize(query);
  if (pn.length >= 4 && tn.includes(pn)) score += 6;

  return score;
}
