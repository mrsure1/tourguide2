"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, MapPin, Clock, Eye, EyeOff, Edit, Tag, TrendingUp, Sparkles, AlertCircle, ImagePlus } from "lucide-react";
import Link from "next/link";
import { getMyTours, toggleTourStatus } from "./actions";
import { useRouter } from "next/navigation";

export default function GuideToursClient() {
    const router = useRouter();
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await toggleTourStatus(id, currentStatus);
            // 상태 업데이트 후 목록 다시 불러오기
            const data = await getMyTours();
            setTours(data);
        } catch (err) {
            console.error("Failed to toggle status:", err);
            alert("상태 변경에 실패했습니다.");
        }
    };

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const data = await getMyTours();
                setTours(data);
            } catch (err) {
                console.error("Failed to fetch tours:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    if (loading) {
        return (
            <div className="p-10 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-medium">투어 목록을 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in relative">
            {/* Ambient Background */}
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">투어 상품 관리</h1>
                    <p className="text-slate-500 mt-2 text-lg">제공할 투어 상품을 등록하고 세부 정보를 관리하세요.</p>
                </div>
                <Link href="/guide/tours/new">
                    <Button className="bg-accent hover:bg-blue-600 shadow-md shadow-accent/20 h-11 px-6 text-sm font-bold flex items-center gap-2 transition-all hover:scale-[1.02]">
                        <Plus className="w-4 h-4" /> 새 투어 등록
                    </Button>
                </Link>
            </div>

            {/* 투어 현황 요약 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-slate-200/60 shadow-sm bg-white">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-accent flex items-center justify-center shrink-0">
                            <Tag className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500">전체 투어</p>
                            <p className="text-2xl font-extrabold text-slate-900">{tours.length}개</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200/60 shadow-sm bg-white">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Eye className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500">활성화된 투어</p>
                            <p className="text-2xl font-extrabold text-slate-900">{tours.filter(t => t.is_active).length}개</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200/60 shadow-sm bg-white">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500">최근 등록 투어</p>
                            <p className="text-lg font-bold text-slate-900 leading-tight truncate max-w-[150px]">
                                {tours.length > 0 ? tours[0].title : "-"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 등록된 투어 리스트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tours.map((tour, idx) => (
                    <Card key={tour.id || idx} className="flex flex-col border-slate-200/60 shadow-md bg-white overflow-hidden group hover:shadow-lg transition-all relative">
                        {/* 카드 내용 클릭 시 상세 페이지 이동 */}
                        <div
                            className="cursor-pointer flex flex-col h-full"
                            onClick={() => router.push(`/guide/tours/${tour.id}`)}
                        >
                            <div className="h-48 w-full bg-slate-200 relative overflow-hidden">
                                {tour.photo ? (
                                    <img src={tour.photo} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                        <ImagePlus className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                <div className="absolute top-4 right-4 z-10">
                                    <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-md shadow-sm border ${tour.is_active
                                        ? 'bg-emerald-500/90 text-white border-emerald-600 backdrop-blur-sm'
                                        : 'bg-slate-800/80 text-white border-slate-700 backdrop-blur-sm'
                                        }`}>
                                        {tour.is_active ? '● 활성화됨' : '○ 숨김 처리됨'}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 z-10 w-full pr-8">
                                    <h3 className="font-bold text-lg text-white leading-tight line-clamp-2">{tour.title}</h3>
                                </div>
                            </div>
                            <CardContent className="flex-1 p-5 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                                    <div className="flex gap-3">
                                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                            <MapPin className="w-3 h-3 text-emerald-500" /> {tour.region}
                                        </span>
                                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                            <Clock className="w-3 h-3 text-accent" /> {tour.duration}시간
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">가이드 요금</p>
                                    <p className="text-xl font-black text-slate-900">₩ {tour.price?.toLocaleString()}</p>
                                </div>
                            </CardContent>
                        </div>

                        {/* 하단 버튼 영역 */}
                        <div className="px-5 pb-5 pt-0 mt-auto flex gap-2 relative z-10">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 h-10 border-slate-200 text-slate-600 font-bold hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all text-xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/guide/tours/${tour.id}/edit`);
                                }}
                            >
                                <Edit className="w-3.5 h-3.5 mr-1" /> 수정
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={`flex-1 h-10 font-bold transition-all text-xs ${tour.is_active
                                    ? 'border-amber-100 text-amber-600 hover:bg-amber-50'
                                    : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'
                                    }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleStatus(tour.id, tour.is_active);
                                }}
                            >
                                {tour.is_active ? <><EyeOff className="w-3.5 h-3.5 mr-1" /> 숨기기</> : <><Eye className="w-3.5 h-3.5 mr-1" /> 활성화</>}
                            </Button>
                        </div>
                    </Card>
                ))}

                {/* 새 투어 등록 유도 카드 */}
                <Link href="/guide/tours/new" className="block focus:outline-none focus:ring-4 ring-accent/20 rounded-xl">
                    <Card className="flex flex-col border-dashed border-2 border-slate-300 shadow-none bg-slate-50/50 hover:bg-slate-50 hover:border-accent/50 transition-all h-full min-h-[400px] cursor-pointer group">
                        <CardContent className="flex-1 p-8 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6 text-slate-400 group-hover:text-accent group-hover:bg-accent/5 group-hover:border-accent/20 transition-all group-hover:scale-110">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-accent transition-colors">새로운 투어 아이디어가 <br />있으신가요?</h3>
                            <p className="text-sm text-slate-500 mb-8 leading-relaxed max-w-[200px]">
                                여행자들에게 잊지 못할 특별한 한국의 매력을 보여줄 새로운 투어 코스를 만들어보세요.
                            </p>
                            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 shadow-md flex items-center gap-2 group-hover:bg-accent group-hover:shadow-accent/20">
                                <Plus className="w-4 h-4" /> 지금 바로 만들기
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div >
    );
}
