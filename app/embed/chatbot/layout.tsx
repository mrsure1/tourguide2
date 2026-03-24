export default function EmbedChatbotLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] overflow-hidden bg-[#fbf8f3] text-slate-900 [overflow-wrap:normal] [word-break:keep-all]">
      {children}
    </div>
  );
}
