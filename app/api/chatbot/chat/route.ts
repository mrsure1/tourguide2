import { NextResponse } from "next/server";
import { generateChatReply } from "@/lib/chatbot/generate-reply";
import type { ChatMessage } from "@/lib/chatbot/types";

export const runtime = "nodejs";

function isChatMessage(x: unknown): x is ChatMessage {
  if (!x || typeof x !== "object") return false;
  const m = x as ChatMessage;
  return (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.length > 0;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: unknown; locale?: string };
    const raw = body.messages;
    if (!Array.isArray(raw) || raw.length === 0) {
      return NextResponse.json({ error: "messages 배열이 필요합니다." }, { status: 400 });
    }

    const messages = raw.filter(isChatMessage) as ChatMessage[];
    if (messages.length === 0) {
      return NextResponse.json({ error: "유효한 메시지가 없습니다." }, { status: 400 });
    }

    const locale = body.locale === "en" ? "en" : "ko";
    const result = await generateChatReply(messages, locale);

    return NextResponse.json({
      answer: result.answer,
      usedModel: result.usedModel,
    });
  } catch (e) {
    console.error("[chatbot/chat]", e);
    return NextResponse.json({ error: "챗봇 응답 생성 중 오류가 발생했습니다." }, { status: 500 });
  }
}
