"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { approveGuide, rejectGuide } from "../actions";
import { CheckCircle, ShieldCheck, Globe, CreditCard, Clock } from "lucide-react";

interface GuideRecord {
  id: string;
  full_name: string;
  avatar_url: string;
  guides_detail: {
    location: string;
    languages: string[];
    bio: string;
    bio_i18n?: {
      ko?: string | null;
      en?: string | null;
    } | null;
    hourly_rate: number;
    is_verified: boolean;
    created_at: string;
  };
}

export default function GuidesClient({ initialGuides }: { initialGuides: GuideRecord[] }) {
  const [guides, setGuides] = useState<GuideRecord[]>(initialGuides);
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const displayedGuides = guides.filter((guide) => {
    if (filter === "pending") return !guide.guides_detail.is_verified;
    return true;
  });

  const handleApprove = async (guideId: string) => {
    if (!confirm("이 가이드를 승인하시겠습니까?")) return;

    setProcessingId(guideId);
    const result = await approveGuide(guideId);
    setProcessingId(null);

    if (result.success) {
      setGuides((current) =>
        current.map((guide) =>
          guide.id === guideId
            ? { ...guide, guides_detail: { ...guide.guides_detail, is_verified: true } }
            : guide,
        ),
      );
    } else {
      alert(result.error || "승인 처리 중 오류가 발생했습니다.");
    }
  };

  const handleReject = async (guideId: string) => {
    if (!confirm("이 가이드를 거절하시겠습니까?")) return;

    setProcessingId(guideId);
    const result = await rejectGuide(guideId);
    setProcessingId(null);

    if (result.success) {
      setGuides((current) =>
        current.map((guide) =>
          guide.id === guideId
            ? { ...guide, guides_detail: { ...guide.guides_detail, is_verified: false } }
            : guide,
        ),
      );
    } else {
      alert(result.error || "거절 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-slate-900">
            <ShieldCheck className="h-8 w-8 text-purple-600" />
            가이드 승인 관리
          </h1>
          <p className="mt-1 text-slate-500">
            신규 가이드 신청을 검토하고 승인 여부를 결정합니다.
          </p>
        </div>

        <div className="flex rounded-2xl border border-slate-100 bg-white p-1 shadow-sm">
          <button
            onClick={() => setFilter("pending")}
            className={`rounded-xl px-6 py-2 text-sm font-bold transition-all ${
              filter === "pending"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            승인 대기
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`rounded-xl px-6 py-2 text-sm font-bold transition-all ${
              filter === "all"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            전체 가이드
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {displayedGuides.map((guide) => {
          const localizedBio = guide.guides_detail.bio_i18n?.ko || guide.guides_detail.bio;
          const isProcessing = processingId === guide.id;

          return (
            <Card key={guide.id} className="overflow-hidden border-none bg-white shadow-xl shadow-slate-200/40">
              <div className="grid gap-0 md:grid-cols-[260px_1fr]">
                <div className="flex flex-col items-center border-r border-slate-100 bg-slate-50/60 p-8 text-center">
                  <img
                    src={guide.avatar_url || "https://i.pravatar.cc/150"}
                    alt={guide.full_name}
                    className="h-24 w-24 rounded-3xl border-2 border-white object-cover shadow-md ring-4 ring-slate-100"
                  />
                  <div className="mt-4 flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{guide.full_name}</h3>
                    {guide.guides_detail.is_verified && <CheckCircle className="h-5 w-5 text-blue-500" />}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">가이드 상세 정보</p>
                  <div className="mt-6 space-y-3 text-left">
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <Globe className="h-3 w-3" />
                        지역
                      </p>
                      <p className="font-bold text-slate-800">{guide.guides_detail.location}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <CreditCard className="h-3 w-3" />
                        시간당 요금
                      </p>
                      <p className="font-black text-slate-900">₩{guide.guides_detail.hourly_rate.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <Clock className="h-3 w-3" />
                        등록일
                      </p>
                      <p className="text-sm font-medium text-slate-600">
                        {new Date(guide.guides_detail.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">가이드 소개글</p>
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-700 italic leading-relaxed">
                      {localizedBio || "등록된 소개글이 없습니다."}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">가이드 언어</p>
                      <div className="flex flex-wrap gap-2">
                        {guide.guides_detail.languages.map((lang) => (
                          <span
                            key={lang}
                            className="rounded-md border border-slate-200/50 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">승인 상태</p>
                      <p className="font-bold text-slate-800">
                        {guide.guides_detail.is_verified ? "승인 완료" : "승인 대기"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleApprove(guide.id)}
                      disabled={isProcessing || guide.guides_detail.is_verified}
                      className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleReject(guide.id)}
                      disabled={isProcessing}
                      className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      거절
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {displayedGuides.length === 0 && (
          <Card className="border-none bg-white/50 p-20 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-100">
              <ShieldCheck className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800">처리할 요청이 없습니다.</h3>
            <p className="text-slate-500">현재 승인 대기 중인 가이드 신청이 없습니다.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
