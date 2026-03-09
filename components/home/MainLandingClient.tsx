"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CalendarRange,
  ChevronRight,
  Clock,
  Compass,
  Map,
  MapPin,
  Minus,
  Plus,
  Search,
  Sparkles,
  Star,
  Users,
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
  rating: number | null;
  reviewCount: number | null;
};

type TabType = "guide" | "tour";

type SearchDraft = {
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
};

type Props = {
  userName?: string | null;
  travelerHref: string;
  guideHref: string;
  guides: LandingGuide[];
  tours: LandingTour[];
};

const numberFormatter = new Intl.NumberFormat("ko-KR");

const tabCopy: Record<
  TabType,
  {
    label: string;
    title: string;
    subtitle: string;
  }
> = {
  guide: {
    label: "가이드 추천",
    title: "내 여행에 맞는 로컬 가이드",
    subtitle: "목적지와 일정이 정해졌다면, 동행할 사람부터 고를 수 있습니다.",
  },
  tour: {
    label: "여행상품 추천",
    title: "바로 비교할 수 있는 여행상품",
    subtitle: "일정형 상품을 먼저 보고 싶다면 이 탭에서 빠르게 좁혀가면 됩니다.",
  },
};

function formatPrice(value: number) {
  return `₩${numberFormatter.format(value)}`;
}

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "날짜 미정";
  }

  return `${start.getMonth() + 1}.${start.getDate()} - ${end.getMonth() + 1}.${end.getDate()}`;
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
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#f7f5f2] px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{count}명 선택</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, count - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          aria-label={`${label} 감소`}
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-slate-900">{count}</span>
        <button
          type="button"
          onClick={() => onChange(count + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          aria-label={`${label} 증가`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function GuideCard({ guide }: { guide: LandingGuide }) {
  return (
    <Link
      href={`/traveler/guides/${guide.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#e9e4db] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f1ea]">
        <Image
          src={guide.avatar}
          alt={guide.name}
          fill
          sizes="(min-width: 1280px) 24rem, (min-width: 768px) 33vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-slate-900 backdrop-blur">
          <Star className="h-3.5 w-3.5 fill-[#ff385c] text-[#ff385c]" />
          {guide.rating ? guide.rating.toFixed(1) : "New"}
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
              인증
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
            <p className="text-sm font-semibold text-slate-900">{formatPrice(guide.hourlyRate)}</p>
            <p className="text-xs text-slate-500">시간당 가이드</p>
          </div>
          <p className="text-xs text-slate-500">
            후기 {guide.reviewCount ? numberFormatter.format(guide.reviewCount) : 0}개
          </p>
        </div>
      </div>
    </Link>
  );
}

function TourCard({ tour }: { tour: LandingTour }) {
  return (
    <Link
      href={`/traveler/tours/${tour.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#e9e4db] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f1ea]">
        <Image
          src={tour.photo}
          alt={tour.title}
          fill
          sizes="(min-width: 1280px) 24rem, (min-width: 768px) 33vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-slate-900 backdrop-blur">
          {tour.region}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">{tour.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{tour.description}</p>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {tour.duration || 0}시간
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 fill-[#ff385c] text-[#ff385c]" />
            {tour.rating ? tour.rating.toFixed(1) : "New"}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{formatPrice(tour.price)}</p>
            <p className="text-xs text-slate-500">{tour.guideName}</p>
          </div>
          <p className="text-xs font-medium text-slate-600">자세히 보기</p>
        </div>
      </div>
    </Link>
  );
}

export default function MainLandingClient({
  userName,
  travelerHref,
  guideHref,
  guides,
  tours,
}: Props) {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [activeTab, setActiveTab] = useState<TabType>("tour");
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

    return Array.from(new Set(values)).slice(0, 8);
  }, [guides, tours]);

  const topRegions = useMemo(() => destinationOptions.slice(0, 4), [destinationOptions]);

  useEffect(() => {
    if (!criteria) return;

    const section = document.getElementById("explore-results");
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [criteria, activeTab]);

  const canSearch = Boolean(draft.destination && draft.startDate && draft.endDate);

  const filteredGuides = useMemo(() => {
    const list = [...guides];

    if (!criteria) {
      return list.slice(0, 6);
    }

    return list
      .filter((guide) => guide.location.toLowerCase().includes(criteria.destination.toLowerCase()))
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [criteria, guides]);

  const filteredTours = useMemo(() => {
    const list = [...tours];

    if (!criteria) {
      return list.slice(0, 6);
    }

    return list
      .filter((tour) => tour.region.toLowerCase().includes(criteria.destination.toLowerCase()))
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }, [criteria, tours]);

  const visibleGuides = filteredGuides.slice(0, 6);
  const visibleTours = filteredTours.slice(0, 6);
  const visibleCards = activeTab === "guide" ? visibleGuides : visibleTours;

  const resultsLabel = criteria
    ? `${criteria.destination} · ${formatDateRange(criteria.startDate, criteria.endDate)} · 성인 ${criteria.adults}명${
        criteria.children > 0 ? ` · 어린이 ${criteria.children}명` : ""
      }`
    : "여행자가 가장 많이 보는 추천 카드부터 먼저 보여줍니다.";

  return (
    <main className="min-h-screen bg-[#fbf8f3] text-slate-900">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,56,92,0.10),transparent_28%),radial-gradient(circle_at_85%_12%,rgba(255,180,93,0.18),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(11,92,122,0.08),transparent_30%)]" />
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14">
          <header className="flex items-center justify-between gap-4 rounded-full border border-white/70 bg-white/80 px-5 py-3 shadow-[0_10px_40px_rgba(15,23,42,0.04)] backdrop-blur">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff385c] text-white">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ff385c]">
                  GuideMatch
                </p>
                <p className="text-sm text-slate-500">Traveler-first local planning</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href={guideHref}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              >
                가이드 메뉴
              </Link>
            </div>
          </header>

          <div className="grid gap-10 pb-10 pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                <Sparkles className="h-4 w-4 text-[#ff385c]" />
                {userName ? `${userName}님, 여행 계획부터 바로 시작하세요` : "여행자 중심으로 바로 검색하고 비교하세요"}
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-6xl">
                여행지와 날짜를 먼저 고르고,
                <br />
                <span className="text-[#ff385c]">내 일정에 맞는 선택지</span>만 바로 보세요.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                복잡한 단계 없이 목적지, 일정, 인원을 정한 다음 추천 여행상품과 추천 가이드를 같은 자리에서
                비교하도록 정리했습니다. 기본 화면도 여행자가 바로 움직일 수 있게 상품 중심으로 시작합니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {topRegions.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setDraft((prev) => ({ ...prev, destination: region }))}
                    className="rounded-full border border-[#e8e1d5] bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)] backdrop-blur">
                <p className="text-sm text-slate-500">여행 준비 흐름</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">목적지 → 날짜 → 인원</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  여행자가 먼저 정해야 하는 값만 위에 배치해 검색 전환이 빠르게 일어나게 했습니다.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/70 bg-[#fff4f6] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)]">
                <p className="text-sm text-slate-500">기본 추천 탭</p>
                <p className="mt-3 text-2xl font-semibold text-slate-950">여행상품 추천</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  처음 방문한 여행자가 바로 비교하기 쉽도록 상품 탭을 기본값으로 두었습니다.
                </p>
              </div>
            </div>
          </div>

          <section className="rounded-[36px] border border-white/70 bg-white/88 p-4 shadow-[0_28px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="inline-flex w-full max-w-md rounded-full bg-[#f3efe8] p-1">
                {(
                  [
                    { key: "tour", label: tabCopy.tour.label, icon: Map },
                    { key: "guide", label: tabCopy.guide.label, icon: Compass },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition",
                        activeTab === tab.key
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-500 hover:text-slate-800",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
              <div className="rounded-full bg-[#fff4f6] px-4 py-2 text-sm text-slate-600">
                {tabCopy[activeTab].subtitle}
              </div>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!canSearch) return;
                setCriteria({ ...draft });
              }}
              className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_1.2fr_1fr_auto]"
            >
              <label className="flex min-h-[88px] flex-col justify-center rounded-[28px] border border-[#ece6dc] bg-[#fcfbf8] px-5 py-4 transition hover:border-slate-300">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <MapPin className="h-4 w-4 text-[#ff385c]" />
                  어디로 여행할까요?
                </span>
                <select
                  value={draft.destination}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, destination: event.target.value }))
                  }
                  className="mt-2 bg-transparent text-base text-slate-600 outline-none"
                >
                  <option value="">지역 선택</option>
                  {destinationOptions.map((destination) => (
                    <option key={destination} value={destination}>
                      {destination}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex min-h-[88px] flex-col justify-center rounded-[28px] border border-[#ece6dc] bg-[#fcfbf8] px-5 py-4 transition hover:border-slate-300">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <CalendarRange className="h-4 w-4 text-[#ff385c]" />
                    출발일
                  </span>
                  <input
                    type="date"
                    min={today}
                    value={draft.startDate}
                    onChange={(event) =>
                      setDraft((prev) => {
                        const startDate = event.target.value;
                        const endDate =
                          prev.endDate && prev.endDate < startDate ? startDate : prev.endDate;

                        return { ...prev, startDate, endDate };
                      })
                    }
                    className="mt-2 bg-transparent text-base text-slate-600 outline-none"
                  />
                </label>
                <label className="flex min-h-[88px] flex-col justify-center rounded-[28px] border border-[#ece6dc] bg-[#fcfbf8] px-5 py-4 transition hover:border-slate-300">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <CalendarRange className="h-4 w-4 text-[#ff385c]" />
                    도착일
                  </span>
                  <input
                    type="date"
                    min={draft.startDate || today}
                    value={draft.endDate}
                    onChange={(event) =>
                      setDraft((prev) => ({ ...prev, endDate: event.target.value }))
                    }
                    className="mt-2 bg-transparent text-base text-slate-600 outline-none"
                  />
                </label>
              </div>

              <div className="grid gap-3 rounded-[28px] border border-[#ece6dc] bg-[#fcfbf8] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Users className="h-4 w-4 text-[#ff385c]" />
                  인원 선택
                </div>
                <GuestStepper
                  label="성인"
                  count={draft.adults}
                  min={1}
                  onChange={(next) => setDraft((prev) => ({ ...prev, adults: next }))}
                />
                <GuestStepper
                  label="어린이"
                  count={draft.children}
                  onChange={(next) => setDraft((prev) => ({ ...prev, children: next }))}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={!canSearch}
                className="h-auto min-h-[88px] rounded-[28px] bg-[#ff385c] px-8 text-base font-semibold text-white hover:bg-[#e43355]"
              >
                <Search className="mr-2 h-5 w-5" />
                검색하기
              </Button>
            </form>

            <p className="mt-4 text-sm text-slate-500">
              검색 후 아래 카드 영역에서 여행상품과 가이드를 탭으로 전환하며 바로 비교할 수 있습니다.
            </p>
          </section>
        </div>
      </section>

      <section id="explore-results" className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 rounded-[32px] border border-[#eee7dc] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.05)] sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium text-[#ff385c]">{tabCopy[activeTab].title}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-slate-950">
                {criteria ? `${criteria.destination} 기준으로 추린 결과` : "여행자가 바로 둘러볼 추천 리스트"}
              </h2>
              <p className="mt-3 text-sm text-slate-500">{resultsLabel}</p>
            </div>
            <Link
              href={travelerHref}
              className="inline-flex items-center gap-2 rounded-full bg-[#f7f5f2] px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-[#efeae1]"
            >
              여행자 홈으로 이동
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {visibleCards.length === 0 ? (
            <div className="rounded-[28px] bg-[#fcfbf8] px-6 py-14 text-center">
              <p className="text-lg font-semibold text-slate-900">조건에 맞는 결과가 없습니다.</p>
              <p className="mt-2 text-sm text-slate-500">지역이나 날짜를 조금 넓혀서 다시 검색해 보세요.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {activeTab === "guide"
                ? visibleGuides.map((guide) => <GuideCard key={guide.id} guide={guide} />)
                : visibleTours.map((tour) => <TourCard key={tour.id} tour={tour} />)}
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] border border-[#eee7dc] bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-medium text-[#ff385c]">여행자 기준 탐색</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
              검색 흐름은 가볍게, 결정은 빠르게.
            </h3>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] bg-[#f7f5f2] p-5">
                <p className="text-sm font-semibold text-slate-900">1. 지역 선택</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  여행자는 보통 여행지를 먼저 정하므로 가장 앞에 배치했습니다.
                </p>
              </div>
              <div className="rounded-[24px] bg-[#f7f5f2] p-5">
                <p className="text-sm font-semibold text-slate-900">2. 날짜와 인원 입력</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  바로 검색 가능한 핵심 항목만 남겨 복잡한 필터를 줄였습니다.
                </p>
              </div>
              <div className="rounded-[24px] bg-[#f7f5f2] p-5">
                <p className="text-sm font-semibold text-slate-900">3. 카드 비교</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  아래에서 상품과 가이드를 탭으로 바꿔가며 자연스럽게 비교합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
            <p className="text-sm font-medium text-[#ffb4c3]">빠른 탐색</p>
            <h3 className="mt-2 text-2xl font-semibold">지금 많이 찾는 방식</h3>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("tour");
                  if (topRegions[0]) {
                    setDraft((prev) => ({ ...prev, destination: topRegions[0] }));
                  }
                }}
                className="flex w-full items-center justify-between rounded-[24px] bg-white/10 px-5 py-4 text-left transition hover:bg-white/16"
              >
                <span>
                  <span className="block text-sm font-semibold">여행상품 먼저 보기</span>
                  <span className="text-sm text-slate-300">빠르게 일정형 상품 비교</span>
                </span>
                <Map className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("guide")}
                className="flex w-full items-center justify-between rounded-[24px] bg-white/10 px-5 py-4 text-left transition hover:bg-white/16"
              >
                <span>
                  <span className="block text-sm font-semibold">가이드 먼저 보기</span>
                  <span className="text-sm text-slate-300">현지 동행 중심으로 비교</span>
                </span>
                <Compass className="h-5 w-5" />
              </button>
              <Link
                href={guideHref}
                className="mt-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200"
              >
                가이드이신가요? 메뉴로 이동
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
