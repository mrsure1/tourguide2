import type { Metadata } from "next";
import { ChatEmbedClient } from "@/components/chatbot/ChatEmbedClient";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";

export const metadata: Metadata = {
  title: "GuideMatch Assistant",
  robots: { index: false, follow: false },
};

export default async function EmbedChatbotPage() {
  const locale = await getRequestLocale();
  return <ChatEmbedClient locale={locale} />;
}
