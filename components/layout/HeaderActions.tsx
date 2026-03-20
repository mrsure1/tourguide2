"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { NotificationPopup } from "@/components/notification/NotificationPopup";
import { useI18n } from "@/components/providers/LocaleProvider";
import { localizePath } from "@/lib/i18n/routing";

interface HeaderActionsProps {
  className?: string;
  variant?: "light" | "dark";
}

export function HeaderActions({ className, variant = "dark" }: HeaderActionsProps) {
  const { locale } = useI18n();
  const [unreadCount, setUnreadCount] = useState(0);
  const [upcomingBookingsCount, setUpcomingBookingsCount] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  const labels =
    locale === "ko"
      ? {
          upcomingTrips: "예정된 여행",
          notifications: "알림",
        }
      : {
          upcomingTrips: "Upcoming trips",
          notifications: "Notifications",
        };

  useEffect(() => {
    const fetchCounts = async (uid: string) => {
      const { count: nCount, error: nError } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", uid)
        .eq("is_read", false);

      if (!nError && nCount !== null) {
        setUnreadCount(nCount);
      }

      const today = new Date().toISOString().split("T")[0];
      const { count: bCount, error: bError } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("traveler_id", uid)
        .eq("status", "confirmed")
        .gte("start_date", today);

      if (!bError && bCount !== null) {
        setUpcomingBookingsCount(bCount);
      }
    };

    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);
      fetchCounts(user.id);

      const nChannel = supabase
        .channel(`public:notifications:count:${user.id}`)
        .on(
          "postgres_changes" as any,
          { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
          () => fetchCounts(user.id),
        )
        .subscribe();

      const bChannel = supabase
        .channel(`public:bookings:count:${user.id}`)
        .on(
          "postgres_changes" as any,
          { event: "*", schema: "public", table: "bookings", filter: `traveler_id=eq.${user.id}` },
          () => fetchCounts(user.id),
        )
        .subscribe();

      return () => {
        supabase.removeChannel(nChannel);
        supabase.removeChannel(bChannel);
      };
    };

    setup();
  }, []);

  const iconClass = cn(
    "group relative rounded-full p-2.5 transition-all duration-300 hover:scale-110 active:scale-95",
    variant === "light"
      ? "text-white/80 hover:bg-white/10 hover:text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  );

  const badgeClass =
    "absolute right-1.5 top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-[#ff385c] px-1 text-[10px] font-bold text-white shadow-sm animate-in zoom-in duration-300";

  if (!userId) return null;

  return (
    <div className={cn("flex items-center gap-1 sm:gap-2", className)}>
      <Link href={localizePath(locale, "/traveler/bookings")} title={labels.upcomingTrips} aria-label={labels.upcomingTrips}>
        <button className={iconClass}>
          <Calendar className="h-[22px] w-[22px]" strokeWidth={1.8} />
          {upcomingBookingsCount > 0 && <span className={badgeClass}>{upcomingBookingsCount}</span>}
        </button>
      </Link>

      <div className="flex items-center">
        <NotificationPopup
          customTrigger={
            <button className={iconClass} title={labels.notifications} aria-label={labels.notifications}>
              <Bell className="h-[22px] w-[22px]" strokeWidth={1.8} />
              {unreadCount > 0 && <span className={badgeClass}>{unreadCount}</span>}
            </button>
          }
        />
      </div>
    </div>
  );
}
