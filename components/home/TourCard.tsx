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

export function TourCard({ tour, queryString }: { tour: LandingTour, queryString?: string }) {
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
    <div className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#e9e4db] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)]">
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
                sizes="(min-width: 1280px) 24rem, (min-width: 768px) 33vw, 100vw"
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

        <Link href={localizePath(locale, `/traveler/tours/${tour.id}${queryString || ''}`)} className="absolute left-4 top-4 z-10 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-slate-900 backdrop-blur">
          {tour.region}
        </Link>
        <Link href={localizePath(locale, `/traveler/tours/${tour.id}${queryString || ''}`)} className="absolute inset-0 z-0">
          <span className="sr-only">{card.viewTourDetailsSr}</span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <Link
          href={localizePath(locale, `/traveler/tours/${tour.id}${queryString || ''}`)}
        >
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">{tour.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{tour.description}</p>
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatDurationHours(tour.duration || 0, locale)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-[#ff385c] text-[#ff385c]" />
            {tour.rating ? tour.rating.toFixed(1) : newLabel}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{formatCurrencyKRW(tour.price, locale)}</p>
            <Link 
              href={localizePath(locale, `/traveler/guides/${tour.guideId}`)}
              className="text-xs text-slate-500 hover:text-blue-600 transition-colors underline-offset-2 hover:underline"
            >
              {tour.guideName}
            </Link>
          </div>
          <Link 
            href={localizePath(locale, `/traveler/tours/${tour.id}${queryString || ''}`)}
            className="text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            {card.viewDetails}
          </Link>
        </div>
      </div>
    </div>
  );
}
