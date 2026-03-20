"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { createClient } from "@/lib/supabase/client";
import { clearChannelTalkSessionCookie } from "./channelTalkSession";

declare global {
  interface Window {
    ChannelIO?: any;
    ChannelIOInitialized?: boolean;
  }
}

export function ChannelTalk() {
  const pluginKey = "b5a1ac1a-f71f-4098-bc07-a9897a1ca2c4";
  const supabase = createClient();
  const lastUserIdRef = useRef<string | null>(null);
  const bootTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearPendingBoot = () => {
      if (bootTimerRef.current) {
        clearTimeout(bootTimerRef.current);
        bootTimerRef.current = null;
      }
    };

    const bootChannelTalk = (user: any) => {
      if (typeof window === "undefined" || !window.ChannelIO) return;

      const nextUserId = user?.id ?? null;
      const previousUserId = lastUserIdRef.current;
      const userChanged = Boolean(previousUserId && nextUserId && previousUserId !== nextUserId);

      // 이전 예약이 남아 있으면 취소하고, 채널톡을 먼저 비웁니다.
      clearPendingBoot();
      window.ChannelIO("shutdown");

      // 로그아웃이거나 다른 아이디로 바뀐 경우, 브라우저 세션 쿠키를 지워서 기록이 섞이지 않게 합니다.
      if (!nextUserId || userChanged) {
        clearChannelTalkSessionCookie();
      }

      bootTimerRef.current = setTimeout(() => {
        if (nextUserId) {
          // 로그인한 사용자의 memberId로 다시 부팅합니다.
          window.ChannelIO("boot", {
            pluginKey,
            memberId: nextUserId,
            profile: {
              name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
              email: user.email,
            },
          });
          console.log("ChannelTalk booted for user:", nextUserId);
        } else {
          // 로그아웃 상태는 게스트로 다시 부팅합니다.
          window.ChannelIO("boot", {
            pluginKey,
          });
          console.log("ChannelTalk booted as guest");
        }

        lastUserIdRef.current = nextUserId;
        bootTimerRef.current = null;
      }, 100);
    };

    // 초기 세션 기준으로 채널톡 상태를 맞춥니다.
    supabase.auth.getSession().then(({ data: { session } }) => {
      bootChannelTalk(session?.user);
    });

    // 로그인/로그아웃/계정 전환 때마다 채널톡도 다시 동기화합니다.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      bootChannelTalk(session?.user);
    });

    return () => {
      if (bootTimerRef.current) {
        clearTimeout(bootTimerRef.current);
        bootTimerRef.current = null;
      }
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <Script
      id="channel-io-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(){var w=window;if(w.ChannelIO){return w.console.error("ChannelIO script included twice.");}var ch=function(){ch.c(arguments);};ch.q=[];ch.c=function(args){ch.q.push(args);};w.ChannelIO=ch;function l(){if(w.ChannelIOInitialized){return;}w.ChannelIOInitialized=true;var s=document.createElement("script");s.type="text/javascript";s.async=true;s.src="https://cdn.channel.io/plugin/ch-plugin-web.js";var x=document.getElementsByTagName("script")[0];if(x.parentNode){x.parentNode.insertBefore(s,x);}}if(document.readyState==="complete"){l();}else{w.addEventListener("DOMContentLoaded",l);w.addEventListener("load",l);}})();
        `,
      }}
    />
  );
}
