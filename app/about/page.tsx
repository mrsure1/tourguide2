import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Globe2, ShieldCheck, Sparkles, Users } from "lucide-react";
import { InfoHeader } from "@/components/layout/InfoHeader";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { localizePath } from "@/lib/i18n/routing";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();

  return {
    title: locale === "ko" ? "GuideMatch 소개 | GuideMatch" : "About GuideMatch | GuideMatch",
    description:
      locale === "ko"
        ? "GuideMatch는 검증된 로컬 가이드와 여행자를 연결해 안전하고 밀도 높은 여행 경험을 만듭니다."
        : "GuideMatch connects verified local guides with travelers for safer, richer trip experiences.",
  };
}

const cards = {
  ko: [
    {
      icon: ShieldCheck,
      title: "검증된 파트너",
      description: "가이드 등록, 프로필, 운영 이력을 확인한 뒤 공개합니다.",
    },
    {
      icon: Sparkles,
      title: "맞춤 연결",
      description: "여행 목적과 일정에 맞게 가이드와 투어를 연결합니다.",
    },
    {
      icon: Users,
      title: "현장 경험 중심",
      description: "관광지만이 아니라 동선, 생활, 로컬 이야기를 담습니다.",
    },
  ],
  en: [
    {
      icon: ShieldCheck,
      title: "Verified partners",
      description: "We review guide registration, profiles, and operating history before listing.",
    },
    {
      icon: Sparkles,
      title: "Tailored matching",
      description: "We connect travelers with guides and tours based on goals and schedule.",
    },
    {
      icon: Users,
      title: "Experience-first",
      description: "We focus on routes, everyday life, and local stories, not just landmarks.",
    },
  ],
} as const;

export default async function AboutPage() {
  const locale = await getRequestLocale();
  const localePath = (href: string) => localizePath(locale, href);
  const content = cards[locale];

  return (
    <>
      <InfoHeader />
      <main className="min-h-screen bg-[#f6f3ee] text-slate-900">
        <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.12),transparent_28%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur">
                <Globe2 className="h-4 w-4 text-cyan-300" />
                {locale === "ko" ? "로컬 여행 매칭 플랫폼" : "Local travel matching platform"}
              </div>
              <h1 className="mt-6 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                {locale === "ko"
                  ? "여행자와 가이드를 더 정확하게 연결합니다."
                  : "We connect travelers and guides with more precision."}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                {locale === "ko"
                  ? "GuideMatch는 단순한 목록이 아니라, 여행 목적과 현장 경험을 기준으로 적합한 가이드를 찾는 서비스입니다."
                  : "GuideMatch is not just a list. It helps travelers find the right guide based on purpose and real on-the-ground experience."}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={localePath("/")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f4efe7] px-7 py-4 text-sm font-bold text-slate-900 transition-transform hover:-translate-y-0.5"
                >
                  {locale === "ko" ? "여행자 홈 보기" : "View traveler home"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={localePath("/signup?role=guide")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  {locale === "ko" ? "가이드 등록 시작" : "Start guide signup"}
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {content.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-3xl border border-white/10 bg-white/10 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.24)] backdrop-blur"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                        <Icon className="h-6 w-6 text-cyan-300" />
                      </div>
                      <h2 className="text-lg font-bold">{item.title}</h2>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-200">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <BadgeCheck className="h-6 w-6 text-blue-600" />
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {locale === "ko" ? "신뢰 중심 운영" : "Trust-first operations"}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {locale === "ko"
                  ? "검증된 정보, 명확한 정책, 그리고 예약 이후까지 이어지는 지원을 우선합니다."
                  : "We prioritize verified information, clear policies, and support that continues after booking."}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <Sparkles className="h-6 w-6 text-amber-500" />
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {locale === "ko" ? "맞춤형 여행 흐름" : "Personalized travel flow"}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {locale === "ko"
                  ? "관광 코스보다 여행자의 일정과 동선을 먼저 생각합니다."
                  : "We start with the traveler’s schedule and route, not a generic tour list."}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <Users className="h-6 w-6 text-emerald-600" />
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                {locale === "ko" ? "현장 경험 강화" : "Built around lived experience"}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {locale === "ko"
                  ? "가이드의 실제 경험과 현지 맥락을 설명할 수 있는 구조를 지향합니다."
                  : "We aim to surface a guide’s real experience and local context."}
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
