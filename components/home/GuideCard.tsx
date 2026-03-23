"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { useI18n } from "@/components/providers/LocaleProvider";
import { formatCurrencyKRW, formatReviewCount } from "@/lib/i18n/format";
import { localizePath } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

export type LandingGuide = {
  id: string;
  name: string;
  location: string;
  bio: string;
  languages: string[];
  hourlyRate: number;
  rating: number | null;
  reviewCount: number | null;
  avatar: string;
  isVerified: boolean;
};

export function GuideCard({ guide, queryString, compact }: { guide: LandingGuide; queryString?: string; compact?: boolean }) {
  const { locale, messages } = useI18n();
  const card = messages.landing.card;
  const newLabel = locale === "ko" ? "신규" : "New";

  return (
    <Link
      href={localizePath(locale, `/traveler/guides/${guide.id}${queryString || ''}`)}
      className={cn(
        "group flex h-full flex-col overflow-hidden border border-[#e9e4db] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)]",
        compact ? "rounded-2xl sm:rounded-[28px]" : "rounded-[28px]",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f1ea]">
        <Image
          src={guide.avatar}
          alt={guide.name}
          fill
          sizes={compact ? "(min-width: 1024px) 24rem, (min-width: 640px) 40vw, 50vw" : "(min-width: 1280px) 24rem, (min-width: 768px) 33vw, 100vw"}
          className="object-cover transition duration-500 group-hover:scale-105"
          unoptimized
        />
        <div
          className={cn(
            "absolute inline-flex items-center gap-1 rounded-full bg-white/92 font-semibold text-slate-900 backdrop-blur",
            compact ? "left-2 top-2 px-2 py-0.5 text-[10px] sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-xs" : "left-4 top-4 px-3 py-1 text-xs",
          )}
        >
          <Star className={cn("fill-[#ff385c] text-[#ff385c]", compact ? "h-3 w-3 sm:h-3.5 sm:w-3.5" : "h-3.5 w-3.5")} />
          {guide.rating ? guide.rating.toFixed(1) : newLabel}
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col", compact ? "gap-2 p-3 sm:gap-4 sm:p-5" : "gap-4 p-5")}>
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0">
            <h3 className={cn("font-semibold text-slate-900", compact ? "text-sm sm:text-lg" : "text-lg")}>{guide.name}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-slate-500 sm:mt-1">
              <MapPin className={cn("shrink-0", compact ? "h-3 w-3 sm:h-4 sm:w-4" : "h-4 w-4")} />
              <span className={cn(compact ? "line-clamp-1 text-[11px] sm:text-sm" : "text-sm")}>{guide.location}</span>
            </p>
          </div>
          {guide.isVerified && (
            <span
              className={cn(
                "shrink-0 rounded-full bg-[#fff0f3] font-semibold text-[#ff385c]",
                compact ? "hidden px-2 py-0.5 text-[9px] sm:inline-flex sm:px-3 sm:py-1 sm:text-xs" : "px-3 py-1 text-xs",
              )}
            >
              {card.verified}
            </span>
          )}
        </div>
        <p className={cn("line-clamp-2 text-slate-600", compact ? "text-xs leading-snug sm:text-sm sm:leading-6" : "text-sm leading-6")}>{guide.bio}</p>
        <div className={cn("flex flex-wrap gap-1.5 sm:gap-2", compact && "[&>span]:max-sm:px-2 [&>span]:max-sm:py-0.5 [&>span]:max-sm:text-[10px]")}>
          {guide.languages.slice(0, 3).map((language) => (
            <span
              key={`${guide.id}-${language}`}
              className="rounded-full bg-[#f7f5f2] px-3 py-1 text-xs font-medium text-slate-600"
            >
              {language}
            </span>
          ))}
        </div>
        <div className={cn("mt-auto flex items-center justify-between border-t border-slate-100", compact ? "pt-2 sm:pt-4" : "pt-4")}>
          <div>
            <p className={cn("font-semibold text-slate-900", compact ? "text-xs sm:text-sm" : "text-sm")}>{formatCurrencyKRW(guide.hourlyRate, locale)}</p>
            <p className={cn("text-slate-500", compact ? "text-[10px] sm:text-xs" : "text-xs")}>{card.hourlyGuide}</p>
          </div>
          <div className="text-right">
            <p className={cn("text-slate-500", compact ? "text-[10px] sm:text-xs" : "text-xs")}>{formatReviewCount(guide.reviewCount, locale)}</p>
            <p className={cn("font-medium text-blue-600", compact ? "mt-0.5 text-[10px] sm:mt-1 sm:text-xs" : "mt-1 text-xs")}>{card.viewDetails}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
