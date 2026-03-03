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
        return (
            <div className="p-10 text-center">
                <h1 className="text-3xl font-bold text-red-500">투어를 찾을 수 없습니다</h1>
                <p className="mt-4">요청하신 ID: {id}</p>
                <p>디버그: getTourById returns null.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/guide/tours" className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">투어 상세 정보</h1>
                    </div>
                    <Link href={`/guide/tours/${id}/edit`}>
                        <Button variant="outline" size="sm" className="font-bold border-slate-200 text-slate-600 hover:text-accent flex items-center gap-1.5">
                            <Edit className="w-4 h-4" /> 수정하기
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
                {/* Hero Section */}
                <div className="relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 group">
                    {tour.photo ? (
                        <img src={tour.photo} alt={tour.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                            <MapPin className="w-16 h-16" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                    <div className="absolute bottom-8 left-8 right-8 text-white">
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${tour.is_active
                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                                : 'bg-slate-500/20 border-slate-500/50 text-slate-300'}`}>
                                {tour.is_active ? '● 활성화됨' : '○ 숨김 상태'}
                            </span>
                            <span className="bg-white/10 border border-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {tour.region}
                            </span>
                        </div>
                        <h2 className="text-4xl font-black tracking-tight leading-tight">{tour.title}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Side: Info & Features */}
                    <div className="md:col-span-2 space-y-8">
                        <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white ring-1 ring-slate-100 overflow-hidden">
                            <CardContent className="p-8 space-y-8">
                                <section>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 font-noto">
                                        <div className="w-1.5 h-6 bg-accent rounded-full" />
                                        투어 소개
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg font-light">
                                        {tour.description}
                                    </p>
                                </section>

                                <section className="pt-8 border-t border-slate-50">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 font-noto">
                                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                        포함 사항
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {(tour.included_items || []).map((item: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 bg-slate-50/80 p-4 rounded-xl border border-slate-100 group transition-all hover:bg-emerald-50/50 hover:border-emerald-100">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                                <span className="text-slate-700 font-medium">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Quick Stats */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white ring-1 ring-slate-100">
                            <CardContent className="p-8 space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">가이드 요금</p>
                                    <p className="text-3xl font-black text-slate-900">₩ {tour.price?.toLocaleString()}</p>
                                    <p className="text-xs text-slate-500 mt-1">1인 기준 (수수료 제외)</p>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-slate-50">
                                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                                            <Clock className="w-4 h-4" /> 소요 시간
                                        </div>
                                        <span className="font-bold text-slate-900">{tour.duration}시간</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                                            <Users className="w-4 h-4" /> 최대 인원
                                        </div>
                                        <span className="font-bold text-slate-900">{tour.max_guests}명</span>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Link href={`/guide/tours/${id}/edit`}>
                                        <Button className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg rounded-2xl shadow-lg transition-all active:scale-95">
                                            정보 수정하기
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status Toggle Card (Optional logic can be added later) */}
                        <Card className={`border-0 shadow-md ${tour.is_active ? 'bg-emerald-50' : 'bg-slate-50'} ring-1 ${tour.is_active ? 'ring-emerald-100' : 'ring-slate-100'}`}>
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tour.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'}`}>
                                        {tour.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500">현재 노출 상태</p>
                                        <p className={`font-bold ${tour.is_active ? 'text-emerald-700' : 'text-slate-700'}`}>
                                            {tour.is_active ? '여행자에게 노출 중' : '숨김 처리됨'}
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
