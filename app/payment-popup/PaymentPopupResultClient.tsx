"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ChevronLeft, ShieldAlert, X } from "lucide-react";

const messages: Record<string, string> = {
  success: "결제가 정상적으로 완료되었습니다. 예약 내역을 새로고침하고 이 창을 닫습니다.",
  invalid: "결제 요청 값이 올바르지 않습니다.",
  invalid_booking_state: "현재 예약 상태에서는 결제를 진행할 수 없습니다.",
  user_cancel: "결제가 취소되었습니다. 이전 화면으로 돌아가 다른 결제 수단을 선택할 수 있습니다.",
  internal: "결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
};

export default function PaymentPopupResultClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "error";
  const rawMessage = searchParams.get("message") || "";
  const bookingId = searchParams.get("bookingId") || "";
  const normalizedMessage = rawMessage.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  const detail = messages[normalizedMessage] || rawMessage || messages.internal;

  useEffect(() => {
    if (status !== "success") return;

    if (window.opener && !window.opener.closed) {
      window.opener.location.href = `${window.location.origin}/traveler/bookings?payment=success`;
    }

    const timer = window.setTimeout(() => {
      window.close();
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <main className="min-h-screen bg-[#f6f4ef] px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-lg rounded-[32px] border border-[#e8e1d6] bg-white p-7 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            뒤로가기
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            onClick={() => window.close()}
          >
            <X className="mr-2 h-4 w-4" />
            닫기
          </Button>
        </div>

        <div className="mt-8 flex flex-col items-center text-center">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              status === "success" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
            }`}
          >
            {status === "success" ? (
              <CheckCircle2 className="h-8 w-8" />
            ) : (
              <ShieldAlert className="h-8 w-8" />
            )}
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-[-0.03em] text-slate-950">
            {status === "success" ? "결제가 완료되었습니다" : "결제를 완료하지 못했습니다"}
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">{detail}</p>
          {bookingId ? (
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
              Booking {bookingId.slice(0, 8)}
            </p>
          ) : null}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {status === "success" ? (
            <Button className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800" onClick={() => window.close()}>
              창 닫기
            </Button>
          ) : (
            <Button className="rounded-2xl bg-slate-950 text-white hover:bg-slate-800" onClick={() => router.back()}>
              이전 단계로
            </Button>
          )}
          <Link href="/traveler/bookings" className="block">
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-2xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            >
              예약 내역 보기
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
