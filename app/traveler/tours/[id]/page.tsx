"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Star, MapPin, Clock, Users, Heart, Share2, ChevronLeft, CheckCircle2 } from "lucide-react";

export default function TourDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const tourData: Record<string, any> = {
        "1": { title: "왕의 산책로, 경복궁 및 북촌 특별 프라이빗 투어", region: "서울", duration: "4시간", price: 80000, img: "https://images.unsplash.com/photo-1546874177-9e664107314e" },
        "2": { title: "해운대 럭셔리 요트 선셋 투어와 야경 스냅", region: "부산", duration: "3시간", price: 120000, img: "https://images.unsplash.com/photo-1517154421773-0529f29ea451" },
        "3": { title: "한라산 영실코스 에코 트레킹 투어", region: "제주", duration: "6시간", price: 60000, img: "https://images.unsplash.com/photo-1582035300183-b903e1cdeb3c" },
        "4": { title: "강릉 안목해변 커피거리 & 정동진 바다부채길", region: "강원", duration: "5시간", price: 50000, img: "https://images.unsplash.com/photo-1596701062351-8c2c14d1f271" },
        "5": { title: "전주 한옥마을 한복 스냅 & 길거리 음식 완정 복어 투어", region: "전주", duration: "4시간", price: 45000, img: "https://images.unsplash.com/photo-1579482527814-1e04db4fde09" },
        "6": { title: "서울 홍대/연남 인디 문화 & 로컬 펍 크롤링", region: "서울", duration: "3시간", price: 55000, img: "https://images.unsplash.com/photo-1520626090623-bc9ba1ce29a8" }
    };

    const tour = tourData[id] || tourData["1"];

    return (
        <div className="bg-white min-h-[calc(100vh-64px)] animate-fade-in pb-20">
            {/* Header image & Quick Nav */}
            <div className="relative h-[40vh] md:h-[50vh] w-full bg-slate-900">
                <img src={`${tour.img}?q=80&w=2000&auto=format&fit=crop`} alt={tour.title} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                <div className="absolute top-6 left-4 md:left-8 right-4 md:right-8 flex justify-between items-center z-10">
                    <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 hover:text-red-400 transition-colors">
                            <Heart className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/50 transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1 bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                        <div className="flex items-center gap-2 mb-4 text-sm font-bold text-blue-600">
                            <span className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">베스트셀러</span>
                            <span className="bg-slate-50 px-3 py-1 rounded-full border border-slate-200 text-slate-600 font-medium flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> 4.9 (128)
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                            {tour.title}
                        </h1>

                        <div className="flex flex-wrap gap-6 mb-8 py-6 border-y border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-medium mb-0.5">지역</div>
                                    <div className="text-sm font-bold text-slate-900">{tour.region}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-medium mb-0.5">소요 시간</div>
                                    <div className="text-sm font-bold text-slate-900">{tour.duration}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 font-medium mb-0.5">투어 인원</div>
                                    <div className="text-sm font-bold text-slate-900">최대 4인</div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">투어 소개</h2>
                            <p className="text-slate-600 leading-relaxed">
                                숨겨진 로컬 명소부터 필수 코스까지, 단순한 관광을 넘어선 진짜 여행을 경험해보세요.
                                전문 가이드와 함께 편안하고 유익한 시간을 보내며 평생 기억에 남을 추억을 만들어 드립니다.
                            </p>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">포함 사항</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {['전문 가이드 비용', '기본 입장료', '생수 및 간단한 다과', '스냅 사진 촬영 (10장)'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-slate-700 text-sm">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Booking Card */}
                    <div className="w-full md:w-96 shrink-0 mt-8 md:mt-0">
                        <div className="sticky top-24">
                            <Card className="bg-white shadow-2xl shadow-slate-200 border-0 rounded-3xl overflow-hidden">
                                <CardContent className="p-6 md:p-8">
                                    <div className="mb-6">
                                        <div className="text-sm font-medium text-slate-500 mb-1">1인 기준</div>
                                        <div className="text-3xl font-black text-slate-900 tracking-tight">
                                            ₩ {tour.price.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                                            <div className="text-xs font-bold text-slate-500 mb-1">날짜 선택</div>
                                            <div className="text-sm font-semibold text-slate-900">2026년 2월 24일</div>
                                        </div>
                                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex justify-between items-center">
                                            <div>
                                                <div className="text-xs font-bold text-slate-500 mb-1">인원</div>
                                                <div className="text-sm font-semibold text-slate-900">성인 2명</div>
                                            </div>
                                            <div className="text-sm font-bold text-blue-600">수정</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-6 border-t border-slate-100 mb-8">
                                        <div className="flex justify-between text-slate-600 text-sm">
                                            <span>₩ {tour.price.toLocaleString()} x 2인</span>
                                            <span>₩ {(tour.price * 2).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-600 text-sm">
                                            <span>서비스 수수료</span>
                                            <span>₩ {(tour.price * 2 * 0.05).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-100">
                                            <span>총 합계</span>
                                            <span>₩ {(tour.price * 2 * 1.05).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Button fullWidth size="lg" className="h-14 bg-slate-900 hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-slate-900/10 text-base font-bold transition-all" onClick={() => alert('예약 시스템 연동 예정입니다.')}>
                                        예약 진행하기
                                    </Button>
                                    <p className="text-center text-xs text-slate-400 mt-4">예약 확정 전에는 결제되지 않습니다.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

