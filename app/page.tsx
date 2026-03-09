import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  CalendarCheck2,
  ChevronRight,
  Clock,
  Compass,
  Map,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const fallbackDestinations = [
  {
    city: "SEOUL",
    title: "서울 야경 & 로컬 바투어",
    desc: "남산, 익선동, 한강까지 한 번에.",
    image:
      "https://images.unsplash.com/photo-1538485399081-7c8973f7aa9f?auto=format&fit=crop&w=1400&q=80",
  },
  {
    city: "BUSAN",
    title: "부산 오션뷰 드라이브",
    desc: "해운대부터 송정까지 감성 루트.",
    image:
      "https://images.unsplash.com/photo-1600240644455-3edc55c375fe?auto=format&fit=crop&w=1400&q=80",
  },
  {
    city: "JEJU",
    title: "제주 자연 치유 코스",
    desc: "오름, 숲길, 오션 선셋을 한 일정으로.",
    image:
      "https://images.unsplash.com/photo-1595908129746-57ca1acb72a9?auto=format&fit=crop&w=1400&q=80",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { full_name?: string; role?: string } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();
    profile = data;
  }

  const { data: rawPopularTours } = await supabase
    .from("tours")
    .select(
      `
      id,
      title,
      description,
      region,
      duration,
      price,
      photo,
      profiles (
        full_name,
        guides_detail ( rating, review_count )
      )
    `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  const popularTours = (rawPopularTours || []).map((tour) => {
    const profile = Array.isArray(tour.profiles) ? tour.profiles[0] : tour.profiles;
    const guideDetail = profile?.guides_detail;
    const normalizedGuideDetail = Array.isArray(guideDetail) ? guideDetail[0] : guideDetail;

    return {
      id: tour.id,
      title: tour.title || "인기 로컬 투어",
      description: tour.description || "현지 가이드와 함께하는 특별한 로컬 경험",
      region: tour.region || "Korea",
      duration: typeof tour.duration === "number" ? tour.duration : null,
      price: typeof tour.price === "number" ? tour.price : null,
      photo: tour.photo,
      guideName: profile?.full_name || "로컬 가이드",
      rating:
        normalizedGuideDetail && typeof normalizedGuideDetail.rating === "number"
          ? normalizedGuideDetail.rating
          : null,
      reviewCount:
        normalizedGuideDetail && typeof normalizedGuideDetail.review_count === "number"
          ? normalizedGuideDetail.review_count
          : null,
    };
  });

  const featuredTour = popularTours[0] || null;
  const destinationCards =
    popularTours.length > 0
      ? popularTours.map((tour) => ({
          city: String(tour.region || "KOREA").toUpperCase(),
          title: tour.title,
          desc: tour.description,
          image:
            tour.photo ||
            "https://images.unsplash.com/photo-1538485399081-7c8973f7aa9f?auto=format&fit=crop&w=1400&q=80",
          href: `/traveler/tours/${tour.id}`,
        }))
      : fallbackDestinations.map((item) => ({ ...item, href: "#onboarding" }));

  const isGuide = profile?.role === "guide" || profile?.role === "admin";
  const travelerHref = user ? "/traveler/home" : "/signup?role=traveler";
  const guideHref = user && isGuide ? "/guide/dashboard" : "/signup?role=guide";

  return (
    <main className="flex-1 min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?auto=format&fit=crop&w=1800&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/70 to-blue-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.28),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.2),transparent_28%),radial-gradient(circle_at_75%_85%,rgba(14,116,144,0.2),transparent_30%)]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pb-28 lg:pt-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="animate-fade-in-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/15 px-4 py-2 text-xs font-semibold text-cyan-100">
                <Sparkles className="h-3.5 w-3.5" />
                KOREA LOCAL TRAVEL MATCH PLATFORM
              </div>
              <h1 className="text-4xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                한국이
                <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-300 bg-clip-text text-transparent">
                  {" "}
                  진짜 여행지
                </span>
                로 느껴지는 순간
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg break-keep">
                관광지만 훑는 여행이 아니라, 로컬 가이드와 함께 한국의 분위기와 이야기를
                경험하세요. 지금 가장 어울리는 코스로 바로 매칭됩니다.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link href={travelerHref}>
                  <Button className="h-12 rounded-xl bg-white px-7 text-slate-950 hover:bg-slate-200 font-bold">
                    {user ? "여행자로 시작하기" : "여행자로 시작하기"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href={guideHref}>
                  <Button
                    variant="outline"
                    className="h-12 rounded-xl border-white/30 bg-white/10 px-7 text-white hover:bg-white/20 font-bold"
                  >
                    {user && isGuide ? "가이드 대시보드로" : "가이드로 시작하기"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#destinations" className="text-sm font-semibold text-cyan-100/90 hover:text-cyan-100">
                  인기 코스 먼저 보기
                </a>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-black">1,200+</p>
                  <p className="text-xs text-slate-200">검증 가이드</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-black">15K+</p>
                  <p className="text-xs text-slate-200">누적 매칭</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-black">32</p>
                  <p className="text-xs text-slate-200">서비스 도시</p>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up animation-delay-200">
              <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-[0_20px_70px_rgba(2,6,23,0.45)]">
                <div className="rounded-2xl border border-white/15 bg-slate-900/45 p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-cyan-100">이번 주 인기 일정</p>
                    <p className="text-xs text-slate-300">TOP RATED</p>
                  </div>
                  <h3 className="mt-3 text-xl font-bold">
                    {featuredTour?.title || "서울 야경 + 한강 피크닉 + 로컬 바"}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">
                    {featuredTour?.description || "감성 포인트를 놓치지 않는 1일 시그니처 코스"}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-amber-300">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-4 w-4 ${
                          (featuredTour?.rating || 0) > idx ? "fill-amber-300" : ""
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-xs text-slate-200">
                      {featuredTour?.rating?.toFixed(1) || "NEW"}
                      {featuredTour?.reviewCount ? ` (${featuredTour.reviewCount})` : ""}
                    </span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <Users className="h-5 w-5 text-cyan-200" />
                    <p className="mt-2 text-sm font-semibold">{featuredTour?.guideName || "프라이빗 그룹"}</p>
                    <p className="text-xs text-slate-300">{featuredTour?.region || "최대 6인 맞춤"}</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <CalendarCheck2 className="h-5 w-5 text-cyan-200" />
                    <p className="mt-2 text-sm font-semibold">즉시 예약</p>
                    <p className="text-xs text-slate-300">
                      {featuredTour?.duration ? `${featuredTour.duration}시간` : "실시간 일정 확인"}
                    </p>
                  </div>
                </div>
                <Link
                  href={featuredTour ? `/traveler/tours/${featuredTour.id}` : "/login"}
                  className="mt-5 inline-flex items-center text-sm font-semibold text-cyan-100 hover:text-cyan-200"
                >
                  {featuredTour ? "투어 상세 보기" : "로그인하고 상세 보기"} <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="destinations" className="bg-white px-4 py-20 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-blue-600">
                DESTINATIONS YOU WILL LOVE
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
                한국으로 떠나고 싶어지는 인기 코스
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-500 break-keep">
              단순한 관광 스팟이 아니라, 현지 가이드와 함께하는 분위기 중심 루트를
              추천합니다.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {destinationCards.map((item, idx) => (
              <article
                key={`${item.city}-${item.title}-${idx}`}
                className="group relative h-96 overflow-hidden rounded-3xl border border-slate-200 shadow-sm"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url("${item.image}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-xs font-semibold tracking-[0.18em] text-cyan-200">{item.city}</p>
                  <h3 className="mt-2 text-2xl font-black leading-tight">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-200">{item.desc}</p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-200">
                    {popularTours.length > 0 && (
                      <>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {item.city}
                        </span>
                        {typeof popularTours[idx]?.duration === "number" && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {popularTours[idx]?.duration}시간
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <Link href={item.href} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-cyan-100 hover:text-cyan-200">
                    상품 보기 <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="onboarding" className="relative px-4 py-24 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-indigo-50/40 to-white overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-[pulse-slow_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-100/50 mix-blend-multiply filter blur-3xl opacity-70 animate-[pulse-slow_8s_ease-in-out_infinite_1s]" />
        
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
              {profile ? `${profile.full_name}님, 어떤 모드로 시작할까요?` : "나에게 맞는 방식으로 시작하세요"}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 break-keep">
              여행자는 최적의 가이드를 빠르게 찾고, 가이드는 자신만의 경험을 상품으로
              만들어 수익화할 수 있습니다.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Link href={travelerHref} className="group outline-none">
              <article className="relative h-full overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50/40 via-white to-white p-10 shadow-lg shadow-blue-900/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-900/10 hover:border-blue-200 ring-4 ring-transparent focus-visible:ring-blue-100">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-100/50 opacity-20 transition-transform duration-500 group-hover:scale-150" />
                <div className="relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                    <Compass className="h-8 w-8" />
                  </div>
                  <h3 className="mt-8 text-2xl font-black text-slate-900">여행자로 시작하기</h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-600 break-keep">
                    지역, 일정, 취향 기반으로 맞춤 가이드를 추천받고, 메시지로 구체적 일정까지
                    쉽고 빠르게 조율하세요.
                  </p>
                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-blue-600 rounded-full bg-blue-50 px-4 py-2 transition-colors group-hover:bg-blue-100">
                    {isGuide ? "여행자 모드로 이동" : "가이드 1분 만에 찾기"}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </div>
                </div>
              </article>
            </Link>

            <Link href={guideHref} className="group outline-none">
              <article className="relative h-full overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50/40 via-white to-white p-10 shadow-lg shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-900/10 hover:border-emerald-200 ring-4 ring-transparent focus-visible:ring-emerald-100">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-100/50 opacity-20 transition-transform duration-500 group-hover:scale-150" />
                <div className="relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                    <Map className="h-8 w-8" />
                  </div>
                  <h3 className="mt-8 text-2xl font-black text-slate-900">가이드로 등록하기</h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-600 break-keep">
                    나만의 시그니처 코스를 등록하고 수입을 창출하세요. 편리한 일정 관리 도구로 
                    고객 안내에만 집중할 수 있습니다.
                  </p>
                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 rounded-full bg-emerald-50 px-4 py-2 transition-colors group-hover:bg-emerald-100">
                    {isGuide ? "가이드 대시보드 열기" : "가이드로 무료 시작하기"}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </div>
                </div>
              </article>
            </Link>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <div className="group rounded-3xl border border-violet-100 bg-gradient-to-b from-violet-50/50 to-white p-7 shadow-xl shadow-violet-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-900/10 hover:border-violet-200">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white shadow-inner">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">신뢰할 수 있는 매칭</h4>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">엄격한 신원 인증과 실제 리뷰 데이터를 통해 믿을 수 있는 가이드와 여행자를 이어줍니다.</p>
            </div>
            <div className="group rounded-3xl border border-amber-100 bg-gradient-to-b from-amber-50/50 to-white p-7 shadow-xl shadow-amber-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/10 hover:border-amber-200">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white shadow-inner">
                <MessageSquareText className="h-7 w-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">디테일한 조율</h4>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">예약 진행 과정에서 실시간 채팅으로 픽업 장소부터 세부 코스까지 맞춤 설정이 가능합니다.</p>
            </div>
            <div className="group rounded-3xl border border-sky-100 bg-gradient-to-b from-sky-50/50 to-white p-7 shadow-xl shadow-sky-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-900/10 hover:border-sky-200">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white shadow-inner">
                <CalendarCheck2 className="h-7 w-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">빈틈 없는 예약 시스템</h4>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">일정 캘린더 기반으로 즉시 예약 처리되어 여러 번 메시지를 주고받는 소모를 줄여줍니다.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-500 font-medium">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 underline underline-offset-4 decoration-2"
              >
                로그인하기
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
