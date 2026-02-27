import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, MapPin, Clock, Eye, EyeOff, Edit, Tag, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function GuideTours() {
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
                            <p className="text-2xl font-extrabold text-slate-900">12개</p>
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
                            <p className="text-2xl font-extrabold text-slate-900">8개</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-slate-200/60 shadow-sm bg-white">
                    <CardContent className="p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500">이달의 인기 투어</p>
                            <p className="text-lg font-bold text-slate-900 leading-tight">경복궁 야간 도보 투어</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 등록된 투어 리스트 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    {
                        title: "경복궁 및 북촌 프리미엄 해설 투어",
                        region: "서울",
                        duration: "4시간",
                        price: "1인 ₩ 80,000",
                        status: "활성",
                        img: "https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=800&auto=format&fit=crop",
                        reviews: 124,
                        rating: 4.9
                    },
                    {
                        title: "명동 스포트라이트 & 남산 포토 스팟 투어",
                        region: "서울",
                        duration: "3.5시간",
                        price: "1인 ₩ 75,000",
                        status: "숨김",
                        img: "https://images.unsplash.com/photo-1594916848149-114af1dbe1d0?q=80&w=800&auto=format&fit=crop",
                        reviews: 89,
                        rating: 4.7
                    },
                    {
                        title: "부산 해운대 요트 투어 VIP 패키지",
                        region: "부산",
                        duration: "2시간",
                        price: "1인 ₩ 120,000",
                        status: "활성",
                        img: "https://images.unsplash.com/photo-1627883906368-b3ab3b376b1b?q=80&w=800&auto=format&fit=crop",
                        reviews: 45,
                        rating: 5.0
                    }
                ].map((tour, idx) => (
                    <Card key={idx} className="flex flex-col border-slate-200/60 shadow-md bg-white overflow-hidden group hover:shadow-lg transition-all">
                        <div className="h-48 w-full bg-slate-200 relative overflow-hidden">
                            <img src={tour.img} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                            <div className="absolute top-4 right-4 z-10">
                                <span className={`px-2.5 py-1 text-[11px] font-extrabold rounded-md shadow-sm border ${tour.status === '활성'
                                        ? 'bg-emerald-500/90 text-white border-emerald-600 backdrop-blur-sm'
                                        : 'bg-slate-800/80 text-white border-slate-700 backdrop-blur-sm'
                                    }`}>
                                    {tour.status === '활성' ? '● 활성화됨' : '○ 숨김 처리됨'}
                                </span>
                            </div>
                            <div className="absolute bottom-4 left-4 z-10 w-full pr-8">
                                <h3 className="font-bold text-lg text-white leading-tight line-clamp-2 md:truncate">{tour.title}</h3>
                            </div>
                        </div>
                        <CardContent className="flex-1 p-5 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                                <div className="flex gap-3">
                                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                        <MapPin className="w-3 h-3 text-emerald-500" /> {tour.region}
                                    </span>
                                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                        <Clock className="w-3 h-3 text-accent" /> {tour.duration}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-amber-500">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-sm font-bold text-slate-700">{tour.rating} <span className="text-slate-400 font-normal">({tour.reviews})</span></span>
                                </div>
                            </div>

                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">투어 가격</p>
                                    <p className="text-accent font-extrabold text-lg">{tour.price}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm" className="flex-1 bg-white border-slate-200 text-slate-600 hover:text-accent hover:border-accent/30 hover:bg-accent/5 font-bold shadow-sm flex items-center gap-1.5">
                                    <Edit className="w-3.5 h-3.5" /> 수정
                                </Button>
                                <Button variant="outline" size="sm" className={`flex-1 font-bold shadow-sm flex items-center gap-1.5 ${tour.status === '활성'
                                        ? 'bg-white border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50'
                                        : 'bg-white border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50'
                                    }`}>
                                    {tour.status === '활성' ? <><EyeOff className="w-3.5 h-3.5" /> 숨기기</> : <><Eye className="w-3.5 h-3.5" /> 활성화</>}
                                </Button>
                            </div>
                        </CardContent>
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
        </div>
    );
}
