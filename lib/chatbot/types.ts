export type SiteChunk = {
  id: string;
  source: string;
  text: string;
  locale?: string;
};

export type FaqRow = {
  question: string;
  answer: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
