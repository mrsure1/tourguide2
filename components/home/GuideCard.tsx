"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { useI18n } from "@/components/providers/LocaleProvider";
import { formatCurrencyKRW, formatReviewCount } from "@/lib/i18n/format";
import { localizePath } from "@/lib/i18n/routing";

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

export function GuideCard({ guide, queryString }: { guide: LandingGuide, queryString?: string }) {
  const { locale, messages } = useI18n();
  const card = messages.landing.card;
  const newLabel = locale === "ko" ? "신규" : "New";

  return (
    <Link
      href={localizePath(locale, `/traveler/guides/${guide.id}${queryString || ''}`)}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#e9e4db] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f1ea]">
        <Image
          src={guide.avatar}
          alt={guide.name}
          fill
          sizes="(min-width: 1280px) 24rem, (min-width: 768px) 33vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-slate-900 backdrop-blur">
          <Star className="h-3.5 w-3.5 fill-[#ff385c] text-[#ff385c]" />
          {guide.rating ? guide.rating.toFixed(1) : newLabel}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{guide.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              {guide.location}
            </p>
          </div>
          {guide.isVerified && (
            <span className="rounded-full bg-[#fff0f3] px-3 py-1 text-xs font-semibold text-[#ff385c]">
              {card.verified}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-slate-600">{guide.bio}</p>
        <div className="flex flex-wrap gap-2">
          {guide.languages.slice(0, 3).map((language) => (
            <span
              key={`${guide.id}-${language}`}
              className="rounded-full bg-[#f7f5f2] px-3 py-1 text-xs font-medium text-slate-600"
            >
              {language}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{formatCurrencyKRW(guide.hourlyRate, locale)}</p>
            <p className="text-xs text-slate-500">{card.hourlyGuide}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">{formatReviewCount(guide.reviewCount, locale)}</p>
            <p className="text-xs font-medium text-blue-600 mt-1">{card.viewDetails}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
