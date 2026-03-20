import { getTourById } from "@/app/guide/tours/actions";
import { notFound, unstable_rethrow } from "next/navigation";
import { Suspense } from "react";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import TourDetailClient from "./TourDetailClient";

export const dynamic = "force-dynamic";

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  let locale: any = "ko";
  let messages: any = {};
  let t: any = {};

  try {
    const { id } = await params;

    // i18n 로딩 (실패해도 페이지가 죽지 않도록 기본값 설정)
    try {
      locale = (await getRequestLocale()) || "ko";
      messages = await getDictionary(locale);
      t = messages.landing?.tourDetail || {};
    } catch (e) {
      console.error("[TourDetail] i18n loading failed:", e);
    }

    const tour = await getTourById(id);

    if (!tour) {
      console.warn(`[TourDetail] No tour found with ID: ${id}`);
      notFound();
    }

    return (
      <Suspense fallback={<div className="p-8 text-center text-slate-500">{t.loading || "Loading..."}</div>}>
        <TourDetailClient tour={tour} />
      </Suspense>
    );
  } catch (error) {
    // Next.js 시스템 에러(404, Redirect 등)는 unstable_rethrow를 통해 상위로 전파
    unstable_rethrow(error);

    console.error("[TourDetail] Fatal error:", error);
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="text-rose-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">죄송합니다. 오류가 발생했습니다.</h2>
        <p className="text-slate-500 text-center max-w-md mb-8">
          요청하신 투어 정보를 불러오는 중 예상치 못한 문제가 발생했습니다. <br/>
          잠시 후 다시 시도해 주세요.
        </p>
        <a href="/" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors">
          홈으로 돌아가기
        </a>
      </div>
    );
  }
}
