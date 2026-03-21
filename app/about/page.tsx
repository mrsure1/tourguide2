import { InfoHeader } from "@/components/layout/InfoHeader";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CalendarCheck2,
  Camera,
  CreditCard,
  Globe2,
  HeartHandshake,
  Map,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "가이드매치 소개 | GuideMatch",
  description:
    "검증된 로컬 가이드와 여행자를 연결하는 GuideMatch의 비전, 운영 기준, 서비스 가치를 소개합니다.",
};

const valueCards = [
  {
    title: "투명한 예약 구조",
    description:
      "여행자는 상품 설명, 포함 사항, 일정, 가격 구조를 분명하게 확인하고 선택할 수 있습니다. 가이드는 자신이 설계한 경험의 가치를 직접 설명합니다.",
    icon: ShieldCheck,
    accent: "from-sky-500 to-cyan-400",
    iconStyle: "bg-sky-100 text-sky-700",
  },
  {
    title: "검증된 현지 전문성",
    description:
      "도시 이해도, 언어 역량, 진행 경험, 응대 태도까지 고려한 프로필 중심 구조로 여행의 품질을 판단할 수 있게 돕습니다.",
    icon: BadgeCheck,
    accent: "from-emerald-500 to-teal-400",
    iconStyle: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "진짜 로컬 경험 설계",
    description:
      "명소 소비형 여행에서 끝나지 않도록, 지역의 맥락과 스토리를 전달하는 사람 중심의 경험 설계를 추구합니다.",
    icon: Globe2,
    accent: "from-amber-500 to-orange-400",
    iconStyle: "bg-amber-100 text-amber-700",
  },
];

const processSteps = [
  {
    step: "01",
    title: "여행 목적과 취향을 구체화합니다",
    description:
      "도시, 일정, 인원, 관심 테마를 기준으로 원하는 경험의 방향을 선명하게 정리합니다. 가족 여행인지, 미식 탐방인지, 문화 해설 중심인지에 따라 적합한 가이드는 달라집니다.",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "프로필을 비교하고 직접 선택합니다",
    description:
      "가이드의 소개, 운영 스타일, 언어, 전문 영역, 제안 가능한 동선을 살펴보며 내 여행과 맞는 파트너를 스스로 선택할 수 있습니다.",
    icon: Users,
  },
  {
    step: "03",
    title: "현장에서 더 깊은 여행이 시작됩니다",
    description:
      "단순 이동과 설명을 넘어, 지역의 맥락을 이해하고 여행자 성향에 맞춘 속도와 분위기로 경험을 완성합니다.",
    icon: CalendarCheck2,
  },
];

const travelerBenefits = [
  "여행 스타일에 맞는 가이드를 직접 비교하고 선택",
  "단체 패키지보다 유연한 일정 조정과 밀도 높은 경험",
  "언어, 테마, 이동 편의성까지 고려한 사전 판단 가능",
  "간편 결제와 명확한 일정 구조로 예약 부담 최소화",
];

const guideBenefits = [
  "자신의 전문 분야와 지역 감도를 투어로 구조화 가능",
  "과도한 중간 마진 없이 정당한 수익 설계에 집중",
  "프로필, 리뷰, 운영 이력 중심으로 신뢰 자산 축적",
  "반복 가능한 대표 코스와 맞춤형 일정 제안 모두 운영 가능",
];

const galleryCards = [
  {
    src: "/images/tours/gyeongbokgung_2.png",
    alt: "경복궁을 배경으로 한 서울 투어 이미지",
    title: "도시의 대표 장면도 더 입체적으로",
    description: "유명한 장소를 보는 것에서 끝나지 않고, 장소가 품은 시대성과 생활 문화를 함께 이해합니다.",
  },
  {
    src: "/images/tours/haeundae.png",
    alt: "해운대 해변 전경",
    title: "지역의 분위기를 읽는 이동 동선",
    description: "단순 방문보다 시간대와 분위기를 설계해 여행의 리듬을 살립니다.",
  },
  {
    src: "/images/tours/jeju_1.png",
    alt: "제주 자연 풍경 투어 이미지",
    title: "관광지가 아닌 지역의 맥락으로",
    description: "자연, 미식, 문화, 산책 코스를 하나의 이야기처럼 연결해 체류 경험을 더 깊게 만듭니다.",
  },
];

export default function AboutPage() {
  return (
    <>
      <InfoHeader />
      <main className="min-h-screen bg-[#f6f3ee] text-slate-900">
        <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(180deg,#0f172a_0%,#132238_52%,#f6f3ee_52%,#f6f3ee_100%)]">
          <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.14),transparent_30%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] [background-size:72px_72px]" />

          <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div className="pt-4 sm:pt-8">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 backdrop-blur">
                <Sparkles className="h-4 w-4 text-cyan-300" />
                로컬 가이드와 여행자를 가장 정교하게 연결하는 방식
              </div>

              <h1 className="max-w-3xl text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl hero-title">
                소개 페이지가 아니라,
                <br className="hidden sm:block" />
                <span className="text-transparent bg-gradient-to-r from-cyan-300 via-sky-300 to-amber-200 bg-clip-text">
                  여행의 품질 기준
                </span>
                을 설명합니다
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                가이드매치는 검증된 로컬 가이드와 여행자가 직접 연결되는 구조를 만듭니다. 누구와
                함께 여행하느냐가 경험의 밀도를 결정한다는 전제에서 출발해, 가이드의 전문성과
                여행자의 취향이 정밀하게 맞물리는 예약 경험을 설계합니다.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Matching</p>
                  <p className="mt-3 text-lg font-bold text-white">프로필 중심 매칭</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">여행 목적과 가이드 강점을 직접 비교해 선택합니다.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Trust</p>
                  <p className="mt-3 text-lg font-bold text-white">검증 기반 신뢰</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">소개 문구보다 운영 태도와 전문성 판단이 중요합니다.</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Experience</p>
                  <p className="mt-3 text-lg font-bold text-white">현지 감도 높은 경험</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">명소를 소비하는 여행이 아니라 지역을 해석하는 여행을 지향합니다.</p>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f4efe7] px-7 py-4 text-sm font-bold text-slate-900 transition-transform hover:-translate-y-0.5"
                >
                  여행자용 투어 보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup?role=guide"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/15"
                >
                  가이드 등록 시작하기
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-full bg-amber-300/30 blur-2xl lg:block" />
              <div className="absolute -right-8 bottom-28 hidden h-28 w-28 rounded-full bg-cyan-300/20 blur-2xl lg:block" />

              <div className="relative rounded-[2rem] border border-white/12 bg-white/8 p-3 shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur">
                <div className="relative overflow-hidden rounded-[1.6rem]">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src="/hero-korea.png"
                      alt="한국 여행의 분위기를 보여주는 메인 이미지"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">GuideMatch Standard</p>
                    <p className="mt-3 max-w-sm text-2xl font-bold tracking-[-0.04em] text-white">
                      여행자의 취향과 가이드의 전문성이 정확히 만날 때, 여행은 훨씬 깊어집니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto -mt-14 grid max-w-xl gap-4 px-4 sm:grid-cols-[0.84fr_1.16fr] lg:-mt-24 lg:ml-8 lg:px-0">
                <div className="rounded-[1.75rem] border border-slate-200 bg-[#fcfaf7] p-3 shadow-xl shadow-slate-900/10">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem]">
                    <Image
                      src="/images/guides/guide_busan_woman.png"
                      alt="가이드 프로필 예시 이미지"
                      fill
                      sizes="(max-width: 640px) 100vw, 18vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.75rem] border border-slate-200 bg-[#fcfaf7] p-5 shadow-xl shadow-slate-900/10">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-slate-900 p-3 text-white">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">프로필 기반 신뢰 형성</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          어떤 테마에 강한지, 어떤 분위기로 여행을 이끄는지 한눈에 파악할 수 있어 선택의
                          불확실성을 줄입니다.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-slate-200 bg-[#fcfaf7] p-5 shadow-xl shadow-slate-900/10">
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                        <HeartHandshake className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">여행자와 가이드 모두를 위한 구조</p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          여행자는 더 나은 경험을 얻고, 가이드는 자신만의 서비스 가치를 지속적으로 쌓아갈 수
                          있도록 설계합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">Our Perspective</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-900 sm:text-4xl">
                왜 여행 플랫폼에
                <br />
                브랜드 기준이 필요할까요
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-600">
                많은 여행 서비스가 장소와 가격에 집중합니다. 하지만 실제 만족도는 어떤 사람과 어떤 흐름으로
                여행했는지에서 크게 갈립니다. 가이드매치는 그 간극을 줄이는 데 집중합니다. 가이드의
                전문성, 여행자의 취향, 현장의 맥락을 연결하는 구조가 있어야 더 나은 경험이 반복적으로
                만들어질 수 있다고 보기 때문입니다.
              </p>
              <div className="mt-8 rounded-[1.5rem] bg-slate-950 px-6 py-5 text-slate-100">
                <p className="text-sm leading-7">
                  &quot;좋은 가이드는 단순히 길을 안내하지 않습니다. 여행자가 도시를 이해하는 방식을 바꿉니다.&quot;
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {valueCards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="group rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.05)] transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className={`inline-flex rounded-2xl p-3 ${card.iconStyle}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold tracking-[-0.03em] text-slate-900">{card.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{card.description}</p>
                    <div className={`mt-8 h-1.5 rounded-full bg-gradient-to-r ${card.accent}`} />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-[#efe7dc]">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-24">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">How It Works</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-900 sm:text-4xl">
                여행자와 가이드가
                <br />
                더 잘 만나는 과정
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-700">
                가이드매치의 핵심은 예약 자체보다 선택 과정입니다. 정보가 충분히 보이고, 비교가 가능하고,
                현장에서의 기대치가 맞아야 만족도가 높아집니다. 그래서 우리는 매칭 전 단계의 설명력을
                중요하게 다룹니다.
              </p>

              <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-slate-300 bg-white/70 p-3 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem]">
                  <Image
                    src="/images/tours/gyeongbokgung_1.png"
                    alt="서울 도심 투어를 상징하는 이미지"
                    fill
                    sizes="(max-width: 1024px) 100vw, 36vw"
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-8 left-8 right-8 rounded-[1.5rem] border border-white/40 bg-slate-950/70 p-5 text-white backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">Editorial Matching</p>
                  <p className="mt-2 text-lg font-bold tracking-[-0.03em]">
                    단순 예약 흐름이 아니라, 선택의 근거가 남는 구조를 만듭니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {processSteps.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.step}
                    className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-slate-900 px-4 py-2 text-sm font-bold tracking-[0.18em] text-white">
                          {item.step}
                        </div>
                        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold tracking-[-0.03em] text-slate-900">{item.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">Built For Both Sides</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-900 sm:text-4xl">
              여행자에게도, 가이드에게도
              <br />
              납득되는 플랫폼
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <article className="overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/images/tours/jeju_2.png"
                  alt="여행자 중심 경험을 보여주는 제주 투어 이미지"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                    <Map className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-[-0.03em] text-slate-900">여행자를 위해</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  검색 결과에서 끝나는 서비스가 아니라, 실제로 내 여행에 맞는 사람을 선택하고 결과를 예측할 수
                  있는 정보 구조를 제공합니다.
                </p>
                <ul className="mt-6 space-y-3">
                  {travelerBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-sm leading-7 text-slate-700">
                      <span className="mt-1 rounded-full bg-slate-900 p-1 text-white">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-2">Curated Match</span>
                  <span className="rounded-full bg-slate-100 px-3 py-2">Flexible Itinerary</span>
                  <span className="rounded-full bg-slate-100 px-3 py-2">Local Context</span>
                </div>
              </div>
            </article>

            <article className="overflow-hidden rounded-[2.2rem] border border-slate-200 bg-[#0f172a] text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/images/guides/guide_fashion_woman.png"
                  alt="가이드 파트너십을 보여주는 가이드 이미지"
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white/10 p-3 text-amber-200">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold tracking-[-0.03em]">가이드를 위해</h3>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  좋은 가이드는 더 많은 예약을 받는 것만으로 성장하지 않습니다. 자신의 전문성과 스타일을
                  명확히 보여주고, 그에 맞는 고객을 만나야 지속 가능한 운영이 가능합니다.
                </p>
                <ul className="mt-6 space-y-3">
                  {guideBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-sm leading-7 text-slate-200">
                      <span className="mt-1 rounded-full bg-white/12 p-1 text-amber-200">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.3rem] border border-white/10 bg-white/6 p-4">
                    <div className="flex items-center gap-2 text-amber-200">
                      <CreditCard className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">Revenue</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">정산 흐름과 판매 구조를 더 명확하게 설계할 수 있습니다.</p>
                  </div>
                  <div className="rounded-[1.3rem] border border-white/10 bg-white/6 p-4">
                    <div className="flex items-center gap-2 text-cyan-200">
                      <Camera className="h-4 w-4" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">Profile</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">프로필과 콘텐츠가 곧 가이드의 브랜드 자산이 됩니다.</p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-slate-500">Scene Gallery</p>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-900 sm:text-4xl">
                  실제 여행이 더 풍부해지는 순간들
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                이미지는 단지 분위기를 보여주기 위한 장식이 아닙니다. 가이드매치가 지향하는 여행의 깊이와
                현장감을 설명하는 증거로 배치했습니다.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {galleryCards.map((card, index) => (
                <article
                  key={card.title}
                  className={`overflow-hidden rounded-[2rem] border border-slate-200 bg-[#faf7f2] shadow-[0_18px_48px_rgba(15,23,42,0.06)] ${
                    index === 1 ? "lg:translate-y-10" : ""
                  }`}
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={card.src}
                      alt={card.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 31vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-7">
                    <h3 className="text-xl font-bold tracking-[-0.03em] text-slate-900">{card.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{card.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 py-10 text-center text-white shadow-[0_30px_90px_rgba(15,23,42,0.22)] sm:px-10 sm:py-14">
            <div className="mx-auto max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">GuideMatch Promise</p>
              <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                더 전문적으로 보이는 소개 페이지의 핵심은
                <br className="hidden sm:block" />
                보기 좋은 문장보다 명확한 기준입니다
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-300">
                가이드매치는 여행을 판매하는 플랫폼이 아니라, 사람과 경험을 더 정교하게 연결하는 플랫폼이
                되고자 합니다. 여행자라면 더 잘 맞는 가이드를, 가이드라면 더 오래 기억되는 서비스를 만들 수
                있도록 돕겠습니다.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition-transform hover:-translate-y-0.5"
                >
                  투어 둘러보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup?role=guide"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  파트너 가이드 등록
                </Link>
              </div>

              <div className="mt-10 grid gap-4 text-left sm:grid-cols-3">
                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-2 text-cyan-200">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">Trust</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">설명 가능한 신뢰 구조를 갖춘 여행 플랫폼</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-2 text-amber-200">
                    <HeartHandshake className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">Partnership</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">여행자 만족과 가이드 성장의 균형을 고려한 운영</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-2 text-emerald-200">
                    <Globe2 className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">Locality</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-300">도시를 소비하지 않고 이해하게 만드는 로컬 경험</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
