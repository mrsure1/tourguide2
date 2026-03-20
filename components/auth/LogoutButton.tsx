"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { clearChannelTalkSessionCookie } from "@/components/support/channelTalkSession";
import { useI18n } from "@/components/providers/LocaleProvider";
import { localizePath } from "@/lib/i18n/routing";

interface LogoutButtonProps {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

export function LogoutButton({
  variant = "ghost",
  size = "md",
  className = "",
  showText = true,
}: LogoutButtonProps) {
  const supabase = createClient();
  const router = useRouter();
  const { locale } = useI18n();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      alert("로그아웃 중 오류가 발생했습니다.");
      return;
    }

    // 로그아웃 직후 채널톡 세션 쿠키를 지워서 다음 계정에 이전 기록이 섞이지 않게 합니다.
    clearChannelTalkSessionCookie();
    router.push(localizePath(locale, "/login"));
    router.refresh();
  };

  return (
    <Button
      variant={variant as any}
      size={size}
      onClick={handleLogout}
      className={`flex items-center gap-2 ${className}`}
    >
      <LogOut className="w-4 h-4" />
      {showText && <span>로그아웃</span>}
    </Button>
  );
}
