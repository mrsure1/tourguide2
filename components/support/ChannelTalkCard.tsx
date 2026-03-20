"use client";

import { MessageCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export function ChannelTalkCard() {
  return (
    <div 
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (typeof window !== "undefined" && (window as any).ChannelIO) {
            (window as any).ChannelIO('showMessenger');
          }
        }
      }}
      onClick={() => {
        if (typeof window !== "undefined" && (window as any).ChannelIO) {
          (window as any).ChannelIO('showMessenger');
        } else {
          alert('채널톡 위젯이 아직 로드되지 않았거나 설정되지 않았습니다.');
        }
      }}
      className="h-full outline-none"
    >
      <Card className="h-full hover:border-blue-500/50 hover:shadow-md transition-all duration-300 cursor-pointer group bg-white border-slate-200/60 overflow-hidden relative">
        <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
        <CardContent className="flex items-center gap-5 p-6 md:p-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-500 text-white flex items-center justify-center shrink-0 group-hover:-translate-y-1 transition-transform duration-300 shadow-lg shadow-blue-500/30">
                <MessageCircle className="w-7 h-7" />
            </div>
            <div className="flex-1 text-left">
                <h3 className="font-bold text-slate-900 text-lg md:text-xl mb-1 group-hover:text-blue-600 transition-colors">실시간 챗봇 상담</h3>
                <p className="text-[13px] text-slate-500">빠른 답변이 필요할 땐 챗봇에게.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
        </CardContent>
      </Card>
    </div>
  );
}
