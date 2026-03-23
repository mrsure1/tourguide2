"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/components/providers/LocaleProvider";
import { formatCurrencyKRW, formatDurationHours } from "@/lib/i18n/format";
import { localizePath } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

export type LandingTour = {
  id: string;
  title: string;
  region: string;
  description: string;
  duration: number;
  price: number;
  photo: string;
  guideName: string;
  guideId: string;
  rating: number | null;
  reviewCount: number | null;
};

export function TourCard({ tour, queryString, compact }: { tour: LandingTour; queryString?: string; compact?: boolean }) {
  const { locale, messages } = useI18n();
  const card = messages.landing.card;
  const newLabel = locale === "ko" ? "신규" : "New";
  const photos = tour.photo ? tour.photo.split(',') : ['https://images.unsplash.com/photo-1544750040-4ea9b8a27d38?q=80&w=800'];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIdx, setCurrentIdx] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const idx = Math.round(scrollLeft / clientWidth);
      setCurrentIdx(idx);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const move = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: move, behavior: 'smooth' });
    }
  };

  return (
    <div
      className={cn(
        "group flex h-full flex-col overflow-hidden border border-[#e9e4db] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)]",
        compact ? "rounded-2xl sm:rounded-[28px]" : "rounded-[28px]",
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f1ea]">
        {/* Image Carousel */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scrollbar-none scroll-smooth"
        >
          {photos.map((photo, index) => (
            <div key={index} className="relative h-full w-full shrink-0 snap-start">
              <Image
                src={photo}
                alt={`${tour.title} - ${index + 1}`}
                fill
                sizes={compact ? "(min-width: 1024px) 24rem, (min-width: 640px) 40vw, 50vw" : "(min-width: 1280px) 24rem, (min-width: 768px) 33vw, 100vw"}
                className="object-cover transition duration-500 group-hover:scale-105"
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Carousel Navigation Buttons (Arrows) */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll('left'); }}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-slate-900 opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-white",
                currentIdx === 0 && "hidden"
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll('right'); }}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-slate-900 opacity-0 group-hover:opacity-100 transition shadow-sm hover:bg-white",
                currentIdx === photos.length - 1 && "hidden"
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Carousel Indicators (Dots) */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 z-10">
            {photos.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-300",
                  currentIdx === i ? "bg-white w-3" : "bg-white/60"
                )}
              />
            ))}
          </div>
        )}

        <Link
          href={localizePath(locale, `/traveler/tours/${tour.id}${queryString || ''}`)}
          className={cn(
            "absolute z-10 rounded-full bg-white/92 font-semibold text-slate-900 backdrop-blur",
            compact ? "left-2 top-2 px-2 py-0.5 text-[10px] sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-xs" : "left-4 top-4 px-3 py-1 text-xs",
          )}
        >
          {tour.region}
        </Link>
        <Link href={localizePath(locale, `/traveler/tours/${tour.id}${queryString || ''}`)} className="absolute inset-0 z-0">
          <span className="sr-only">{card.viewTourDetailsSr}</span>
        </Link>
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "gap-2 p-3 sm:gap-4 sm:p-5" : "gap-4 p-5")}>
        <Link href={localizePath(locale, `/traveler/tours/${tour.id}${queryString || ''}`)}>
          <h3 className={cn("line-clamp-2 font-semibold text-slate-900", compact ? "text-sm leading-snug sm:text-lg" : "text-lg")}>{tour.title}</h3>
          <p className={cn("line-clamp-2 text-slate-600", compact ? "mt-1 text-xs leading-snug sm:mt-2 sm:text-sm sm:leading-6" : "mt-2 text-sm leading-6")}>{tour.description}</p>
        </Link>
        <div className={cn("flex flex-wrap items-center gap-2 text-slate-500 sm:gap-4", compact ? "text-[11px] sm:text-sm" : "text-sm")}>
          <span className="inline-flex items-center gap-0.5 sm:gap-1">
            <Clock className={cn(compact ? "h-3 w-3 sm:h-4 sm:w-4" : "h-4 w-4")} />
            {formatDurationHours(tour.duration || 0, locale)}
          </span>
          <span className="inline-flex items-center gap-0.5 sm:gap-1">
            <Star className={cn("fill-[#ff385c] text-[#ff385c]", compact ? "h-3 w-3 sm:h-4 sm:w-4" : "h-4 w-4")} />
            {tour.rating ? tour.rating.toFixed(1) : newLabel}
          </span>
        </div>
        <div className={cn("mt-auto flex items-center justify-between border-t border-slate-100", compact ? "pt-2 sm:pt-4" : "pt-4")}>
          <div className="min-w-0">
            <p className={cn("font-semibold text-slate-900", compact ? "text-xs sm:text-sm" : "text-sm")}>{formatCurrencyKRW(tour.price, locale)}</p>
            <Link
              href={localizePath(locale, `/traveler/guides/${tour.guideId}`)}
              className={cn(
                "block truncate text-slate-500 transition-colors underline-offset-2 hover:text-blue-600 hover:underline",
                compact ? "text-[10px] sm:text-xs" : "text-xs",
              )}
            >
              {tour.guideName}
            </Link>
          </div>
          <Link
            href={localizePath(locale, `/traveler/tours/${tour.id}${queryString || ''}`)}
            className={cn("shrink-0 font-medium text-slate-600 transition-colors hover:text-blue-600", compact ? "text-[10px] sm:text-xs" : "text-xs")}
          >
            {card.viewDetails}
          </Link>
        </div>
      </div>
    </div>
  );
}
