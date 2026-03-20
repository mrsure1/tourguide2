import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ChevronLeft, MapPin, Clock, Users, CheckCircle2, Edit, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { getTourById } from "../actions";
import { notFound } from "next/navigation";

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tour = await getTourById(id);

  if (!tour) {
    notFound();
  }

  const title = tour.title_ko || tour.title || "";
  const description = tour.description_ko || tour.description || "";
  const region = tour.region_ko || tour.region || "";
  const includedItems = Array.isArray(tour.included_items_ko)
    ? tour.included_items_ko
    : Array.isArray(tour.included_items)
      ? tour.included_items
      : [];
  const photos = tour.photo ? tour.photo.split(",") : [];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-4">
            <Link href="/guide/tours" className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100">
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">투어 상세 정보</h1>
          </div>

          <Link href={`/guide/tours/${id}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 border-slate-200 font-bold text-slate-600 hover:text-accent">
              <Edit className="h-4 w-4" />
              수정하기
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <div className="relative h-[400px] w-full overflow-hidden rounded-3xl shadow-2xl shadow-slate-200/50">
          {photos.length > 0 ? (
            <img src={photos[0]} alt={title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
              <MapPin className="h-16 w-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

          <div className="absolute bottom-8 left-8 right-8 text-white">
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-md ${
                  tour.is_active
                    ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-400"
                    : "border-slate-500/50 bg-slate-500/20 text-slate-300"
                }`}
              >
                {tour.is_active ? "노출 중" : "비공개"}
              </span>
              <span className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                <MapPin className="h-3 w-3" /> {region}
              </span>
            </div>
            <h2 className="text-4xl font-black leading-tight tracking-tight">{title}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <Card className="overflow-hidden border-0 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
              <CardContent className="space-y-8 p-8">
                <section>
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                    <div className="h-6 w-1.5 rounded-full bg-accent" />
                    투어 소개
                  </h3>
                  <p className="whitespace-pre-wrap text-lg leading-relaxed font-light text-slate-600">{description}</p>
                </section>

                <section className="border-t border-slate-50 pt-8">
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                    <div className="h-6 w-1.5 rounded-full bg-emerald-500" />
                    포함 항목
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {includedItems.map((item: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                        <span className="font-medium text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
              <CardContent className="space-y-6 p-8">
                <div>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">가격</p>
                  <p className="text-3xl font-black text-slate-900">₩ {tour.price?.toLocaleString()}</p>
                </div>

                <div className="space-y-4 border-t border-slate-50 pt-6">
                  <div className="flex items-center justify-between rounded-xl bg-slate-50/50 p-4">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Clock className="h-4 w-4" /> 소요 시간
                    </div>
                    <span className="font-bold text-slate-900">{tour.duration}시간</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50/50 p-4">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Users className="h-4 w-4" /> 최대 인원
                    </div>
                    <span className="font-bold text-slate-900">{tour.max_guests}명</span>
                  </div>
                </div>

                <Link href={`/guide/tours/${id}/edit`}>
                  <Button className="h-14 w-full rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-lg transition-all active:scale-95 hover:bg-slate-800">
                    투어 수정하기
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className={`border-0 shadow-md ${tour.is_active ? "bg-emerald-50" : "bg-slate-50"} ring-1 ${tour.is_active ? "ring-emerald-100" : "ring-slate-100"}`}>
              <CardContent className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tour.is_active ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"}`}>
                    {tour.is_active ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500">현재 공개 상태</p>
                    <p className={`font-bold ${tour.is_active ? "text-emerald-700" : "text-slate-700"}`}>
                      {tour.is_active ? "여행자에게 노출 중" : "비공개 처리됨"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
