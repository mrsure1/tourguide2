"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { useI18n } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";
import { formatCurrencyKRW, formatDurationHours, formatGuestCount, formatReviewCount } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { HeaderActions } from "@/components/layout/HeaderActions";
import { localizePath } from "@/lib/i18n/routing";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import {
  Clock,
  Map as MapIcon,
  MapPin,
  Minus,
  Plus,
  Search,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Camera,
  Landmark,
  Zap,
  User,
} from "lucide-react";

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



type SearchDraft = {
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
};

const DESTINATION_DEFINITIONS = [
  {
    value: "서울",
    labels: { ko: "서울", en: "Seoul" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["서울", "seoul"],
  },
  {
    value: "제주",
    labels: { ko: "제주", en: "Jeju" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["제주", "jeju"],
  },
  {
    value: "부산",
    labels: { ko: "부산", en: "Busan" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["부산", "busan"],
  },
  {
    value: "인천",
    labels: { ko: "인천", en: "Incheon" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["인천", "incheon"],
  },
  {
    value: "경주",
    labels: { ko: "경주", en: "Gyeongju" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["경주", "gyeongju"],
  },
  {
    value: "강릉",
    labels: { ko: "강릉", en: "Gangneung" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["강릉", "gangneung"],
  },
  {
    value: "여수",
    labels: { ko: "여수", en: "Yeosu" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["여수", "yeosu"],
  },
  {
    value: "전주",
    labels: { ko: "전주", en: "Jeonju" },
    country: { ko: "대한민국", en: "South Korea" },
    aliases: ["전주", "jeonju"],
  },
] as const;

type Props = {
  guideHref: string;
  guides: LandingGuide[];
  tours: LandingTour[];
  userName?: string | null;
  userRole?: string | null;
};

function formatDateRange(startDate: string, endDate: string, locale: Locale, fallbackLabel: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return fallbackLabel;
  }

  if (locale === "ko") {
    return `${start.getMonth() + 1}.${start.getDate()} - ${end.getMonth() + 1}.${end.getDate()}`;
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

function replaceCount(template: string, count: number) {
  return template.replace("{count}", String(count));
}

function resolveDestinationSearchValue(input: string) {
  const normalizedInput = input.trim().toLowerCase();
  const match = DESTINATION_DEFINITIONS.find((destination) =>
    destination.aliases.some((alias) => alias.toLowerCase() === normalizedInput),
  );

  return match?.value ?? input.trim();
}

function GuestStepper({
  label,
  count,
  min = 0,
  onChange,
}: {
  label: string;
  count: number;
  min?: number;
  onChange: (next: number) => void;
}) {
  const { locale } = useI18n();
  const decreaseLabel = locale === "ko" ? `${label} 감소` : `Decrease ${label}`;
  const increaseLabel = locale === "ko" ? `${label} 증가` : `Increase ${label}`;

  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{formatGuestCount(count, locale)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(Math.max(min, count - 1)); }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          aria-label={decreaseLabel}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-slate-900">{count}</span>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(count + 1); }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          aria-label={increaseLabel}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function GuideCard({ guide, queryString }: { guide: LandingGuide, queryString?: string }) {
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

function TourCard({ tour, queryString }: { tour: LandingTour, queryString?: string }) {
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

export default function MainLandingClient({ guideHref, guides, tours, userName, userRole }: Props) {
  const { locale, messages } = useI18n();
  const withLocale = (href: string) => localizePath(locale, href);
  const nav = messages.common.navigation;
  const landing = messages.landing;
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const destinationPanelRef = useRef<HTMLDivElement | null>(null);
  const datePanelRef = useRef<HTMLDivElement | null>(null);
  const guestPanelRef = useRef<HTMLDivElement | null>(null);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
  const [draft, setDraft] = useState<SearchDraft>({
    destination: "",
    startDate: "",
    endDate: "",
    adults: 2,
    children: 0,
  });
  const [criteria, setCriteria] = useState<SearchDraft | null>(null);

  const destinationOptions = useMemo(() => {
    const values = [...guides.map((guide) => guide.location), ...tours.map((tour) => tour.region)]
      .map((value) => value.trim())
      .filter(Boolean);

    return Array.from(new Set(values));
  }, [guides, tours]);

  const quickRegions = useMemo(
    () =>
      DESTINATION_DEFINITIONS.slice(0, 5).map((destination) => ({
        value: destination.value,
        label: destination.labels[locale],
      })),
    [locale],
  );

  const filteredDestinationOptions = useMemo(() => {
    if (!draft.destination.trim()) {
      return DESTINATION_DEFINITIONS.slice(0, 6).map((destination) => ({
        name: destination.labels[locale],
        searchValue: destination.value,
        desc: destination.country[locale],
      }));
    }

    const normalizedInput = draft.destination.toLowerCase();
    const staticOptions = DESTINATION_DEFINITIONS.filter((destination) =>
      [destination.value, destination.labels.ko, destination.labels.en, ...destination.aliases].some((term) =>
        term.toLowerCase().includes(normalizedInput),
      ),
    ).map((destination) => ({
      name: destination.labels[locale],
      searchValue: destination.value,
      desc: destination.country[locale],
    }));

    const dynamicOptions = destinationOptions
      .filter((option) => option.toLowerCase().includes(normalizedInput))
      .map((option) => ({
        name: option,
        searchValue: option,
        desc: landing.search.destinationOptionFallback,
      }));

    return Array.from(new Map([...staticOptions, ...dynamicOptions].map((option) => [option.searchValue, option])).values()).slice(0, 6);
  }, [destinationOptions, draft.destination, landing.search.destinationOptionFallback, locale]);

  const selectedRange = useMemo(
    () => ({
      from: draft.startDate,
      to: draft.endDate,
    }),
    [draft.endDate, draft.startDate],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (destinationPanelRef.current && !destinationPanelRef.current.contains(target)) {
        setIsDestinationOpen(false);
      }

      if (datePanelRef.current && !datePanelRef.current.contains(target)) {
        setIsDatePickerOpen(false);
      }

      if (guestPanelRef.current && !guestPanelRef.current.contains(target)) {
        setIsGuestPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const canSearch = Boolean(draft.destination.trim());

  const filteredGuides = useMemo(() => {
    const list = [...guides];

    if (!criteria || !criteria.destination.trim()) return list;

    const query = resolveDestinationSearchValue(criteria.destination).toLowerCase();

    return list
      .filter((guide) => {
        const fields = [
            guide.location,
            guide.name,
            guide.bio,
            ...(guide.languages || [])
        ];
        return fields.some(field => field && field.toLowerCase().includes(query));
      })
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [criteria, guides]);

  const filteredTours = useMemo(() => {
    const list = [...tours];

    if (!criteria || !criteria.destination.trim()) return list;

    const query = resolveDestinationSearchValue(criteria.destination).toLowerCase();

    return list
      .filter((tour) => {
        const fields = [
            tour.title,
            tour.region,
            tour.description,
            tour.guideName
        ];
        return fields.some(field => field && field.toLowerCase().includes(query));
      })
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [criteria, tours]);

  useEffect(() => {
    if (!criteria) return;

    // Determine target section based on results
    let targetId = "explore-results";

    // If both tabs have no results, redirect scroll to recommended sections
    if (filteredGuides.length === 0 && filteredTours.length === 0) {
      targetId = "recommended-guides";
    }

    // Give a slight delay to allow the DOM to render the message and unhide the target sections properly before scrolling
    setTimeout(() => {
      const section = document.getElementById(targetId);
      section?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [criteria, filteredGuides.length, filteredTours.length]);

  const guestSummary =
    locale === "ko"
      ? `${replaceCount(landing.search.adultCount, draft.adults)}${
          draft.children > 0 ? ` · ${replaceCount(landing.search.childrenCount, draft.children)}` : ""
        }`
      : `Adults ${draft.adults}${draft.children > 0 ? ` · Children ${draft.children}` : ""}`;

  return (
    <main className="min-h-screen bg-[#fbf8f3] text-slate-900 [overflow-wrap:normal] [word-break:keep-all] pb-24">
      <section className="relative z-20 overflow-visible">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?auto=format&fit=crop&w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/72 to-blue-950/68" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.28),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.2),transparent_28%),radial-gradient(circle_at_75%_85%,rgba(14,116,144,0.2),transparent_30%)]" />

        <div className="relative z-[150] mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 md:gap-4">
            <header className="relative z-[100] flex flex-1 items-center justify-between gap-4 rounded-full border border-white/15 bg-white/8 px-5 py-3 backdrop-blur-md">
            <BrandLogo href={withLocale("/")} size="lg" tone="light" variant="signature" />
            
            <div className="flex items-center gap-4">
              {userName ? (
                <>
                  <HeaderActions variant="light" />
                  <Link
                    href={withLocale(userRole === 'guide' || userRole === 'admin' ? '/guide/profile' : '/traveler/profile')}
                    className="flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs font-bold text-white transition hover:border-white/30 hover:bg-white/12"
                  >
                    <User className="w-3 h-3" />
                    {nav.myPage}
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href={withLocale("/login")}
                    className="px-3 py-2 text-xs font-bold text-white/90 hover:text-white transition"
                  >
                    {nav.login}
                  </Link>
                  <Link
                    href={withLocale("/signup")}
                    className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black text-white transition hover:border-white/30 hover:bg-white/20 shadow-lg"
                  >
                    {nav.signup}
                  </Link>
                </div>
              )}
              
              <Link
                href={withLocale(guideHref)}
                className="rounded-full border border-white/20 bg-white/8 px-4 py-2 text-xs font-medium text-white/72 transition hover:border-white/30 hover:bg-white/12 hover:text-white sm:block hidden"
              >
                {nav.guideMenu}
              </Link>
            </div>
          </header>

          <div className="shrink-0 hidden md:block">
             <LanguageSwitcher 
               tone="light" 
               className="bg-white/10 border-white/20 backdrop-blur-md hover:bg-white/20 shadow-lg ring-1 ring-white/10" 
             />
          </div>
        </div>

          <div className="mt-8 rounded-3xl sm:rounded-[38px] border border-white/15 bg-white/96 p-2 sm:p-3 shadow-[0_30px_80px_rgba(2,6,23,0.26)] backdrop-blur-md">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!canSearch) return;
                setCriteria({ ...draft, destination: resolveDestinationSearchValue(draft.destination.trim()) });
              }}
              className="flex flex-col lg:grid lg:grid-cols-[1.4fr_1fr_0.9fr_auto] rounded-[24px] lg:rounded-full bg-white lg:bg-transparent shadow-sm lg:shadow-none border border-slate-200 lg:border-none divide-y lg:divide-y-0 lg:divide-x divide-slate-100 lg:outline lg:outline-1 lg:outline-slate-200 lg:bg-white relative z-50"
            >
              <div ref={destinationPanelRef} className="relative w-full">
                <label className="flex min-h-[72px] sm:min-h-[84px] flex-col justify-center px-5 sm:px-6 py-3 sm:py-4 transition hover:bg-slate-50 cursor-text w-full lg:rounded-l-full">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 tracking-wide">{landing.search.destinationLabel}</span>
                  <input
                    type="text"
                    value={draft.destination}
                    onFocus={() => setIsDestinationOpen(true)}
                    onChange={(event) => {
                      setDraft((prev) => ({ ...prev, destination: event.target.value }));
                      setIsDestinationOpen(true);
                    }}
                    placeholder={landing.search.destinationPlaceholder}
                    className="mt-0.5 sm:mt-1 bg-transparent text-sm sm:text-base font-medium text-slate-700 outline-none placeholder:text-slate-400 placeholder:font-normal w-full"
                  />
                </label>

                {isDestinationOpen && filteredDestinationOptions.length > 0 && (
                  <div className="absolute left-0 top-full mt-3 z-[100] w-[90vw] sm:w-[400px] lg:w-full rounded-[32px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.2)] lg:shadow-[0_24px_60px_rgba(15,23,42,0.16)] overflow-hidden">
                    <div className="border-b border-slate-100/80 px-5 py-4 text-[11px] font-black tracking-widest text-slate-400 bg-slate-50/50">
                      {landing.search.recommendedDestinations}
                    </div>
                    <div className="py-2">
                      {filteredDestinationOptions.map((destination) => (
                        <button
                          key={destination.name}
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setDraft((prev) => ({ ...prev, destination: destination.name }));
                            setIsDestinationOpen(false);
                            setTimeout(() => setIsDatePickerOpen(true), 150);
                          }}
                          className="flex w-full items-center gap-4 px-5 py-3 text-left transition hover:bg-slate-50 group"
                        >
                          <div className="flex w-12 h-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm group-hover:text-blue-600 transition-all border border-transparent group-hover:border-slate-200">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-base font-bold text-slate-800">{destination.name}</span>
                            <span className="text-xs font-medium text-slate-500 mt-0.5">{destination.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div ref={datePanelRef} className="relative w-full">
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen((prev) => !prev)}
                  className="flex min-h-[72px] sm:min-h-[84px] w-full flex-col justify-center px-5 sm:px-6 py-3 sm:py-4 text-left transition hover:bg-slate-50"
                >
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 tracking-wide">{landing.search.dateLabel}</span>
                  <span className={cn("mt-0.5 sm:mt-1 text-sm sm:text-base", draft.startDate && draft.endDate ? "text-slate-800 font-bold" : "text-slate-400 font-medium")}>
                    {draft.startDate && draft.endDate
                      ? formatDateRange(draft.startDate, draft.endDate, locale, landing.search.invalidDateRange)
                      : landing.search.datePlaceholder}
                  </span>
                </button>

                {isDatePickerOpen && (
                  <div className="absolute left-0 lg:-left-12 xl:left-0 top-full mt-3 z-[100] rounded-[32px] bg-white border border-slate-200 p-2 sm:p-4 shadow-[0_30px_100px_rgba(15,23,42,0.2)] lg:shadow-[0_24px_60px_rgba(15,23,42,0.16)] w-[calc(100vw-40px)] sm:w-max min-w-[320px]">
                    <Calendar
                      mode="range"
                      minDate={today}
                      selected={selectedRange}
                      onSelect={(range: { from: string; to: string }) => {
                        setDraft((prev) => ({
                          ...prev,
                          startDate: range?.from || "",
                          endDate: range?.to || "",
                        }));

                        if (range?.from && range?.to) {
                          setIsDatePickerOpen(false);
                          setTimeout(() => setIsGuestPickerOpen(true), 150);
                        }
                      }}
                      className="w-full sm:w-[340px] border-none mx-auto"
                    />
                  </div>
                )}
              </div>

              <div ref={guestPanelRef} className="relative w-full">
                <button
                  type="button"
                  onClick={() => setIsGuestPickerOpen((prev) => !prev)}
                  className="flex min-h-[72px] sm:min-h-[84px] w-full flex-col justify-center px-5 sm:px-6 py-3 sm:py-4 text-left transition hover:bg-slate-50"
                >
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 tracking-wide">{landing.search.travelersLabel}</span>
                  <span className={cn("mt-0.5 sm:mt-1 text-sm sm:text-base", draft.adults > 0 ? "text-slate-800 font-bold" : "text-slate-400 font-medium")}>
                    {draft.adults > 0 || draft.children > 0 ? guestSummary : landing.search.guestPlaceholder}
                  </span>
                </button>

                {isGuestPickerOpen && (
                  <div className="absolute right-0 top-full mt-3 z-[100] w-[90vw] sm:w-[360px] max-w-[calc(100vw-32px)] lg:w-[380px] rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_100px_rgba(15,23,42,0.2)] lg:shadow-[0_24px_60px_rgba(15,23,42,0.16)] text-left">
                    <div className="space-y-4">
                      <GuestStepper
                        label={landing.search.adults}
                        count={draft.adults}
                        min={1}
                        onChange={(next) => setDraft((prev) => ({ ...prev, adults: next }))}
                      />
                      <hr className="border-slate-100 my-2 mx-2" />
                      <GuestStepper
                        label={landing.search.children}
                        count={draft.children}
                        onChange={(next) => setDraft((prev) => ({ ...prev, children: next }))}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center p-2 sm:px-4 sm:py-3 lg:p-2 bg-white">
                <Button
                  type="submit"
                  size="lg"
                  disabled={!canSearch}
                  className="h-12 sm:h-14 w-full rounded-[14px] lg:rounded-full bg-[#ff385c] px-7 text-base font-bold text-white hover:bg-[#e31c5f] lg:w-auto shadow-md hover:shadow-lg transition-all"
                >
                  <Search className="mr-2 h-5 w-5" />
                  {landing.search.searchButton}
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-8 max-w-3xl text-white">
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/12 px-4 py-2 text-sm font-medium text-cyan-50 shadow-sm">
              <Sparkles className="h-4 w-4" />
              {userName
                ? landing.hero.loggedInBadge.replace("{name}", userName)
                : landing.hero.loggedOutBadge}
            </p>
            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl hero-title">
              {landing.hero.titleLine1}
              <br />
              {landing.hero.titleLine2}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
              {landing.hero.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {quickRegions.map((region) => (
                <button
                  key={region.value}
                  type="button"
                  onClick={() => setDraft((prev) => ({ ...prev, destination: region.label }))}
                  className="rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm text-white/88 transition hover:bg-white/16"
                >
                  {region.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="explore-results" className="relative z-10 mx-auto max-w-7xl px-4 pb-0 pt-0 sm:px-6 lg:px-8">
        {(() => {
          const params = new URLSearchParams();
          if (criteria?.startDate) params.set('startDate', criteria.startDate);
          if (criteria?.endDate) params.set('endDate', criteria.endDate);
          if (criteria?.adults) params.set('adults', criteria.adults.toString());
          if (criteria?.children) params.set('children', criteria.children.toString());
          const searchParamsString = Array.from(params.keys()).length > 0 ? `?${params.toString()}` : '';

          return (
            <div className="space-y-10">
              {/* Search Results Display Area */}
              {criteria && (
                <div className="space-y-16 animate-in slide-in-from-bottom-4 fade-in duration-500">
                  {/* Searched Guides Section */}
                  {filteredGuides.length > 0 && (
                    <section className="container mx-auto px-4 pt-12 relative border-t border-slate-100">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-3xl font-black text-slate-900">
                             {landing.sections.guideResultsTitle}
                          </h2>
                          <p className="text-slate-500 mt-2 font-medium">
                            {landing.sections.guideResultsDescription}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredGuides.slice(0, 8).map((guide) => (
                          <GuideCard key={guide.id} guide={guide} queryString={searchParamsString} />
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Searched Tours Section */}
                  {filteredTours.length > 0 && (
                    <section className="container mx-auto px-4 py-12 relative border-t border-slate-100">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-3xl font-black text-slate-900">
                            {landing.sections.tourResultsTitle}
                          </h2>
                          <p className="text-slate-500 mt-2 font-medium">
                            {landing.sections.tourResultsDescription}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredTours.map((tour) => (
                          <TourCard key={tour.id} tour={tour} queryString={searchParamsString} />
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredGuides.length === 0 && filteredTours.length === 0 && (
                    <section className="container mx-auto px-4 py-20 text-center border-t border-slate-100">
                       <h3 className="text-2xl font-bold text-slate-700">{landing.sections.emptyResultsTitle}</h3>
                       <p className="text-slate-500 mt-2">{landing.sections.emptyResultsDescription}</p>
                     </section>
                  )}
                </div>
              )}

              {/* Default Recommended Section (Shown whether searched or not, beneath results) */}
              <div className="w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw] bg-white pb-0 pt-10">
                <div className="space-y-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                  {/* Recommended Guides Section */}
              <section id="recommended-guides" className="container mx-auto px-4 py-10 relative scroll-mt-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-4 animate-fade-in-up">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{landing.sections.verifiedExperts}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                      {landing.sections.recommendedGuidesTitlePrefix} <span className="text-blue-600">{landing.sections.recommendedGuidesTitleAccent}</span>
                    </h2>
                    <p className="text-slate-500 mt-4 max-w-2xl text-lg font-medium">
                      {landing.sections.recommendedGuidesDescription}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {guides.slice(0, 4).map((guide) => (
                    <GuideCard key={guide.id} guide={guide} queryString={searchParamsString} />
                  ))}
                </div>
              </section>

              {/* Local Experience Section ([시안 2]) */}
              <section id="trending-tours" className="bg-[#fcfaf7] pt-12 pb-16 rounded-3xl scroll-mt-20">
                <div className="container mx-auto px-4">
                  <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                      {landing.sections.localExperienceTitlePrefix} <span className="text-[#ff385c]">{landing.sections.localExperienceTitleAccent}</span>
                    </h2>
                    <p className="mt-4 text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                      {landing.sections.localExperienceDescription}
                    </p>
                  </div>

                  {/* Theme Navigation */}
                  <div className="flex overflow-x-auto pb-4 mb-10 gap-6 scrollbar-none justify-center">
                    {[
                      { name: landing.sections.themeFood, icon: Coffee, color: "bg-orange-100 text-orange-600" },
                      { name: landing.sections.themePhoto, icon: Camera, color: "bg-purple-100 text-purple-600" },
                      { name: landing.sections.themeHistory, icon: Landmark, color: "bg-amber-100 text-amber-600" },
                      { name: landing.sections.themeNight, icon: Zap, color: "bg-blue-100 text-blue-600" },
                      { name: landing.sections.themeLocal, icon: MapIcon, color: "bg-emerald-100 text-emerald-600" },
                    ].map((theme, i) => (
                      <button key={i} className="flex flex-col items-center gap-2 group shrink-0 transition-transform active:scale-95">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg shadow-sm border border-white", theme.color)}>
                          <theme.icon className="w-7 h-7" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{theme.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Trending Section */}
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Zap className="w-5 h-5 text-red-500 fill-current" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">{landing.sections.trendingTours}</h3>
                      <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-200 to-transparent ml-4" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {tours.slice(0, 3).map((tour) => (
                        <TourCard key={tour.id} tour={tour} queryString={searchParamsString} />
                      ))}
                    </div>
                  </div>

                  {/* Half-day Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Clock className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900">{landing.sections.halfDayExperiences}</h3>
                      <p className="text-slate-400 text-sm font-medium ml-4 hidden sm:block">{landing.sections.halfDayDescription}</p>
                      <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-200 to-transparent ml-4" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {tours.slice(3, 6).map((tour) => (
                        <TourCard key={tour.id} tour={tour} queryString={searchParamsString} />
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {!criteria && (
                <section className="container mx-auto px-4 py-12 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900">{landing.sections.allToursTitle}</h2>
                      <p className="text-slate-500 mt-2 font-medium">{landing.sections.allToursDescription}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {tours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} queryString={searchParamsString} />
                    ))}
                  </div>
                </section>
              )}
                </div>
              </div>
            </div>
          );
        })()}
      </section>
    </main>
  );
}
