import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe2, HeartHandshake, Map, ShieldCheck, Sparkles, Users } from "lucide-react";
import { InfoHeader } from "@/components/layout/InfoHeader";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { localizePath } from "@/lib/i18n/routing";

type LocaleCode = "ko" | "en";

const localeSwitcher = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
] as const;

const valueCards: {
  icon: typeof ShieldCheck;
  accent: string;
  iconColor: string;
  title: Record<LocaleCode, string>;
  description: Record<LocaleCode, string>;
}[] = [
  {
    icon: ShieldCheck,
    accent: "from-blue-500 to-cyan-400",
    iconColor: "text-blue-600",
    title: {
      ko: "투명한 신뢰 (Trust)",
      en: "Transparent trust (Trust)",
    },
    description: {
      ko: "숨겨진 수수료나 패키지 쇼핑 없이, 약속한 일정과 비용 그대로 안전한 여행을 보장합니다.",
      en: "No hidden fees or forced shopping—just the promised itinerary and costs for a safe trip.",
    },
  },
  {
    icon: HeartHandshake,
    accent: "from-emerald-500 to-teal-400",
    iconColor: "text-emerald-600",
    title: {
      ko: "상생 (Coexistence)",
      en: "Co-creation (Coexistence)",
    },
    description: {
      ko: "합리적인 수수료로 가이드가 실력과 열정을 기반으로 정당한 보상을 얻도록 지원합니다.",
      en: "Fair commissions keep guides rewarded for their expertise and passion, not platform extraction.",
    },
  },
  {
    icon: Globe2,
    accent: "from-purple-500 to-pink-400",
    iconColor: "text-purple-600",
    title: {
      ko: "로컬 경험 (Local)",
      en: "Local experience (Local)",
    },
    description: {
      ko: "단순 관광지 나열을 넘어 실재하는 로컬 스토리와 삶의 리듬을 반영합니다.",
      en: "We go beyond tourist icons to surface living local stories and the rhythm of everyday life.",
    },
  },
];

const translations: Record<
  LocaleCode,
  {
    hero: {
      badge: string;
      titlePrefix: string;
      titleAccent: string;
      titleSuffix: string;
      description: string;
      primaryCta: string;
      secondaryCta: string;
    };
    story: {
      headingPrefix: string;
      headingAccent: string;
      headingSuffix: string;
      description: string;
      bullets: string[];
      pillars: { title: string; body: string; }[];
    };
    cta: {
      heading: string;
      description: string;
      label: string;
    };
  }
> = {
  ko: {
    hero: {
      badge: "로컬 여행의 패러다임을 바꿉니다",
      titlePrefix: "당신만의 ",
      titleAccent: "완벽한 가이드",
      titleSuffix: "를 만나는 가장 쉬운 방법",
      description:
        "가이드매치는 검증된 로컬 전문가와 특별한 여행을 꿈꾸는 여행자를 직접 연결하여, 중간 마진 없이 투명하고 신뢰할 수 있는 진짜 여행 생태계를 만들어갑니다.",
      primaryCta: "인기 투어 찾아보기",
      secondaryCta: "가이드로 합류하기",
    },
    story: {
      headingPrefix: "여행의 스토리는",
      headingAccent: "누구와 함께하느냐",
      headingSuffix: "에 따라 달라집니다",
      description:
        "가이드매치는 단순한 여행 포털이 아닙니다. 검증된 로컬 전문가의 프로필과 실제 여행자 리뷰를 바탕으로, 당신의 취향에 딱 맞는 파트너를 직접 선택할 수 있게 합니다.",
      bullets: [
        "철저한 가이드 신원 및 자격 검증 시스템",
        "도시별 통찰을 공유하는 글로벌 로컬 네트워크",
      ],
      pillars: [
        {
          icon: Users,
          title: "여행자를 위해",
          body: "1:1 맞춤형 전담 투어와 소규모 그룹을 안전하고 편리한 결제로 연결합니다.",
        },
        {
          icon: Map,
          title: "파트너 가이드를 위해",
          body: "자체 일정을 자유롭게 설계하고 특별한 투어 상품을 정당한 수준의 수익으로 전환하세요.",
        },
      ],
    },
    cta: {
      heading: "지금 바로 새로운 여행을 시작해 볼까요?",
      description: "가이드매치와 함께 평생 잊지 못할 당신만의 특별한 추억을 만들어보세요.",
      label: "어디로 떠나고 싶으신가요?",
    },
  },
  en: {
    hero: {
      badge: "Reinventing how local travel connects",
      titlePrefix: "Meet your perfect ",
      titleAccent: "local guide",
      titleSuffix: " effortlessly",
      description:
        "GuideMatch pairs verified local experts with travelers so you skip the middleman and step into trustworthy, immersive journeys.",
      primaryCta: "Explore popular tours",
      secondaryCta: "Join as a guide",
    },
    story: {
      headingPrefix: "Travel stories",
      headingAccent: "change depending on who you travel with",
      headingSuffix: "",
      description:
        "GuideMatch isn't just another travel portal. We highlight vetted local experts and real traveler reviews so you can choose the companion who matches your pace.",
      bullets: [
        "Rigorous verification of guide identity and credentials",
        "An expanding global network that keeps local insight fresh in every city",
      ],
      pillars: [
        {
          icon: Users,
          title: "For travelers",
          body: "From bespoke private tours to small-group departures, we handle safe, frictionless checkouts.",
        },
        {
          icon: Map,
          title: "For partner guides",
          body: "Design your own schedule and turn signature experiences into fair, repeatable income.",
        },
      ],
    },
    cta: {
      heading: "Ready to start a new kind of trip?",
      description: "Let GuideMatch help you craft unforgettable memories.",
      label: "Where to next?",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: locale === "ko" ? "GuideMatch 소개 | GuideMatch" : "About GuideMatch | GuideMatch",
    description:
      locale === "ko"
        ? "GuideMatch는 검증된 로컬 가이드와 여행자를 연결해 경험의 밀도를 높이는 서비스를 제공합니다."
        : "GuideMatch connects verified local guides with travelers for richer, more trustworthy trips.",
  };
}

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const content = translations[locale];
  const localePath = (href: string) => localizePath(locale, href);

  return (
    <>
      <InfoHeader />
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.12),transparent_28%)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex flex-col items-center gap-3 text-white/80 sm:flex-row sm:justify-center">
              <p className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                {content.hero.badge}
              </p>
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
                {localeSwitcher.map(({ code, label }) => (
                  <Link
                    key={code}
                    href={localizePath(code, "/about")}
                    className={`rounded-full px-3 py-1 transition ${
                      locale === code
                        ? "bg-white text-slate-900 shadow-lg shadow-slate-950/30"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <h1 className="mt-8 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl hero-title">
              {content.hero.titlePrefix}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {content.hero.titleAccent}
              </span>
              {content.hero.titleSuffix}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-white/80 sm:text-lg">
              {content.hero.description}
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href={localePath("/")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5"
              >
                {content.hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={localePath("/signup?role=guide")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/20"
              >
                {content.hero.secondaryCta}
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3">
              {valueCards.map((card) => (
                <article
                  key={card.title.ko}
                  className="group relative overflow-hidden rounded-[28px] border border-slate-100 bg-white p-8 shadow-xl shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${card.accent}`}>
                      <card.icon className={`h-7 w-7 ${card.iconColor}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{card.title[locale]}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{card.description[locale]}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white border-y border-slate-200 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                  {content.story.headingPrefix}
                  <br className="hidden sm:block" />
                  <span className="text-blue-600">{content.story.headingAccent}</span>
                  {content.story.headingSuffix && (
                    <>
                      <br className="hidden sm:block" />
                      {content.story.headingSuffix}
                    </>
                  )}
                </h2>
                <p className="mt-6 text-base leading-relaxed text-slate-600">{content.story.description}</p>
                <ul className="mt-8 space-y-4">
                  {content.story.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="mt-0.5 h-2 w-2 rounded-full bg-blue-600" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-cyan-50 rounded-[3rem] transform rotate-[3deg] scale-[1.05] -z-10" />
                <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 sm:p-10 shadow-2xl">
                  <div className="space-y-8">
                    {content.story.pillars.map((pillar) => (
                      <div key={pillar.title} className="space-y-2">
                        <div className="flex items-center gap-3 text-slate-900">
                          <pillar.icon className="h-5 w-5 text-slate-500" />
                          <p className="text-sm font-bold">{pillar.title}</p>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{pillar.body}</p>
                        <div className="h-px w-full bg-slate-100" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl">{content.cta.heading}</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{content.cta.description}</p>
            <Link
              href={localePath("/")}
              className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-bold text-white transition transform hover:-translate-y-1 hover:bg-blue-700"
            >
              {content.cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
