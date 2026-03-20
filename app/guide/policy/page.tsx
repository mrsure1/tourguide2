import type { Metadata } from "next";
import Link from "next/link";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { localizePath } from "@/lib/i18n/routing";
import { InfoHeader } from "@/components/layout/InfoHeader";
import {
  BadgeCheck,
  CalendarClock,
  CircleAlert,
  HandCoins,
  Landmark,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const canonical = localizePath(locale, "/guide/policy");

  return {
    title:
      locale === "ko"
        ? "가이드 운영 정책 및 수수료 안내 | GuideMatch"
        : "Guide operating policy and fees | GuideMatch",
    description:
      locale === "ko"
        ? "GuideMatch 가이드 운영 정책, 수수료 체계, 정산 기준, 취소/환불 규정, 제재 정책을 안내합니다."
        : "GuideMatch guide policy, commission tiers, settlement rules, cancellation/refund terms, and enforcement policy.",
    alternates: {
      canonical,
      languages: {
        en: localizePath("en", "/guide/policy"),
        ko: canonical,
      },
    },
  };
}

const commissionPlans = [
  { name: "스타터 가이드", condition: "월 확정 예약 0~4건", rate: "15%" },
  { name: "성장 가이드", condition: "월 확정 예약 5~14건", rate: "12%" },
  { name: "프리미엄 가이드", condition: "월 확정 예약 15건 이상", rate: "10%" },
];

const operationRules = [
  "투어 상세 설명, 포함/불포함 사항, 집합 장소를 예약 확정 전까지 최신 상태로 유지해야 합니다.",
  "플랫폼 외부 직거래 유도, 외부 결제 요청, 연락처 선공유 행위는 금지됩니다.",
  "예약 확정 후 일정 변경이 필요한 경우 반드시 플랫폼 메시지로 사전 합의 및 기록을 남겨야 합니다.",
  "투어 진행 중 안전사고 또는 분쟁 발생 시 24시간 이내 고객센터에 보고해야 합니다.",
];

const settlementSchedule = [
  {
    label: "정산 기준일",
    value: "투어 완료 처리일 (가이드/여행자 상호 확인 시점)",
  },
  {
    label: "정산 주기",
    value: "매주 1회 (월요일 00:00~일요일 23:59 완료 건)",
  },
  { label: "실지급일", value: "익주 수요일 영업일 기준 순차 지급" },
  {
    label: "공제 항목",
    value: "플랫폼 수수료, 결제대행(PG) 수수료, 부가세(관련 법령 기준)",
  },
];

const cancelPolicy = [
  { window: "투어 시작 72시간 전 취소", refund: "100% 환불", color: "text-emerald-600" },
  { window: "투어 시작 24~72시간 전 취소", refund: "50% 환불", color: "text-amber-600" },
  { window: "투어 시작 24시간 이내 취소", refund: "환불 불가", color: "text-rose-600" },
  { window: "당일 No-show", refund: "환불 불가", color: "text-rose-600" },
];

const penaltyPolicy = [
  "무단 노쇼 또는 당일 일방 취소 누적 2회: 14일 노출 제한",
  "직거래 유도 또는 외부 결제 유도 적발 시: 즉시 판매 중지 및 소명 요청",
  "허위 정보 기재(경력, 자격, 투어 내용) 확인 시: 상품 비노출 및 계정 심사",
  "중대한 안전 이슈 및 폭언/차별 행위 발생 시: 사안에 따라 영구 이용 제한",
];

const policyFaq = [
  {
    q: "수수료 구간은 언제 바뀌나요?",
    a: "매월 마지막 날 23:59 기준 확정 예약 건수를 집계하고, 익월 1일부터 자동 반영됩니다.",
  },
  {
    q: "환불이 발생한 예약도 실적에 포함되나요?",
    a: "전액 환불 완료 건은 실적에서 제외되며, 부분 환불 건은 완료 금액 기준으로 일부 반영됩니다.",
  },
  {
    q: "정산 계좌는 어떻게 변경하나요?",
    a: "가이드 프로필의 정산 정보에서 변경 요청 후 본인 인증을 완료하면 다음 정산 주기부터 적용됩니다.",
  },
];

export default function PolicyPage() {
  return (
    <>
      <InfoHeader />
      <main className="min-h-screen bg-slate-50 pb-20">
        <section className="relative overflow-hidden border-b border-slate-200 bg-slate-900">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-100">
              <ShieldCheck className="h-4 w-4" />
              GuideMatch Policy Center
            </p>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              가이드 운영 정책 및 수수료 안내
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
              본 페이지는 가이드 활동에 필요한 운영 원칙, 수수료 체계, 정산 기준, 취소/환불 및 제재
              규정을 정리한 공식 안내문입니다.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-200">
              <span className="rounded-full bg-white/10 px-3 py-1">시행일: 2026년 3월 19일</span>
              <span className="rounded-full bg-white/10 px-3 py-1">버전: v1.1</span>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-10 max-w-6xl space-y-8 px-4 sm:px-6 lg:px-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
              <HandCoins className="h-5 w-5 text-blue-600" />
              1. 수수료 체계
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              수수료율은 월 확정 예약 건수 기준으로 산정되며, 익월 1일 자동 반영됩니다.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {commissionPlans.map((plan) => (
                <article
                  key={plan.name}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center"
                >
                  <p className="text-sm font-bold text-slate-900">{plan.name}</p>
                  <p className="mt-2 text-xs text-slate-500">{plan.condition}</p>
                  <p className="mt-4 text-3xl font-black text-blue-600">{plan.rate}</p>
                </article>
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed text-slate-500">
              수수료에는 플랫폼 운영비 및 고객지원 비용이 포함되며, 결제대행(PG) 수수료와 세금은 관련
              법령에 따라 별도 반영될 수 있습니다.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
              <BadgeCheck className="h-5 w-5 text-emerald-600" />
              2. 운영 기본 원칙
            </h2>
            <ul className="mt-5 space-y-3">
              {operationRules.map((rule) => (
                <li
                  key={rule}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700"
                >
                  {rule}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
              <WalletCards className="h-5 w-5 text-indigo-600" />
              3. 정산 기준 및 지급 일정
            </h2>
            <div className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200">
              {settlementSchedule.map((item) => (
                <div key={item.label} className="grid gap-2 px-4 py-4 sm:grid-cols-[180px_1fr] sm:gap-4">
                  <p className="text-sm font-bold text-slate-900">{item.label}</p>
                  <p className="text-sm text-slate-600">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
              <CalendarClock className="h-5 w-5 text-amber-600" />
              4. 취소 및 환불 기준
            </h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              {cancelPolicy.map((item) => (
                <div
                  key={item.window}
                  className="grid grid-cols-1 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-4 last:border-b-0 sm:grid-cols-2"
                >
                  <p className="text-sm font-semibold text-slate-800">{item.window}</p>
                  <p className={`text-sm font-extrabold sm:text-right ${item.color}`}>{item.refund}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              천재지변, 정부 지침, 중대한 안전 이슈 등 불가항력 사유는 별도 심사를 거쳐 예외 적용될 수
              있습니다.
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
              <CircleAlert className="h-5 w-5 text-rose-600" />
              5. 정책 위반 시 조치
            </h2>
            <ul className="mt-5 space-y-3">
              {penaltyPolicy.map((rule) => (
                <li
                  key={rule}
                  className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm leading-relaxed text-rose-900"
                >
                  {rule}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
              <Landmark className="h-5 w-5 text-slate-700" />
              6. 문의 및 이의신청
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              정책 적용 결과에 대한 이의가 있는 경우, 사유와 증빙 자료를 첨부하여 고객센터로 접수해
              주세요. 접수 후 영업일 기준 3일 이내 1차 검토 결과를 안내합니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/support"
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-800"
              >
                고객센터 문의하기
              </Link>
              <a
                href="mailto:support@guidematch.com"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100"
              >
                support@guidematch.com
              </a>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">7. 자주 묻는 질문</h2>
            <div className="mt-5 space-y-3">
              {policyFaq.map((item) => (
                <article key={item.q} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-900">{item.q}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.a}</p>
                </article>
              ))}
            </div>
            <p className="mt-5 text-xs text-slate-500">
              본 정책은 서비스 운영 상황 및 관련 법령 변경에 따라 사전 공지 후 개정될 수 있습니다.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}


