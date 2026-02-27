import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Search, MapPin, Star, Clock, Calendar, ChevronRight, Bell } from "lucide-react";
import HomeSearchClient from "./HomeSearchClient";

export default function TravelerHome() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-10 animate-fade-in relative">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 pointer-events-none" />

            {/* Hero / CTA Section */}
            <section className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl h-[480px] sm:h-[500px] flex flex-col justify-center">
                {/* Background Image Container */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1620023415391-72210db4dc8f?q=80&w=2000&auto=format&fit=crop"
                        alt="Seoul Namsan Tower"
                        className="w-full h-full object-cover object-left sm:object-center"
                    />
                    {/* Gradient overlay: right side has photo fading out, left side is dark for text */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                </div>

                <div className="relative z-10 p-8 sm:p-14 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white/90 text-sm font-medium">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>프리미엄 로컬 가이드 매칭</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
                        완벽한 한국 여행을 <br className="hidden sm:block" />
                        준비하세요
                    </h1>
                    <p className="text-slate-300 text-lg sm:text-xl mb-10 font-light max-w-2xl leading-relaxed">
                        나의 일정과 취향에 꼭 맞는 현지 전문가를 찾아보세요.<br className="hidden sm:block" />
                        서울부터 제주까지, 지금까지 경험하지 못한 특별한 순간이 기다립니다.
                    </p>

                    <HomeSearchClient />
                </div>
            </section>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Left Column (나의 일정 & 알림) */}
                <div className="lg:col-span-1 space-y-8">
                    <Card className="premium-card bg-white/70 backdrop-blur-md border-white/60 shadow-xl shadow-blue-900/5">
                        <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-slate-100/50">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                예정된 여행
                            </CardTitle>
                            <Link href="/traveler/bookings" className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center">
                                모두 보기 <ChevronRight className="w-3 h-3 ml-0.5" />
                            </Link>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="bg-gradient-to-br from-white to-slate-50 p-5 rounded-2xl shadow-sm border border-slate-100 mb-5 relative overflow-hidden group hover:border-blue-200 transition-colors cursor-pointer">
                                <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform">
                                    <MapPin className="w-24 h-24 text-blue-600" />
                                </div>
                                <div className="flex justify-between items-start mb-2 relative z-10">
                                    <h3 className="font-bold text-slate-900 text-lg">서울 도심 미식 투어</h3>
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 ring-1 ring-blue-700/10">D-3</span>
                                </div>
                                <p className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-1.5 relative z-10">
                                    <Clock className="w-3.5 h-3.5" /> 2026.02.24 - 2026.02.28
                                </p>
                                <div className="flex items-center justify-between relative z-10 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 shadow-sm object-cover" src="https://i.pravatar.cc/150?u=g1" alt="김철수 가이드" />
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">김철수 가이드</p>
                                            <p className="text-xs text-slate-500">서울 트렌드 마스터</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button fullWidth variant="outline" className="h-12 border-slate-200 bg-white/50 hover:bg-white text-slate-700 font-semibold rounded-xl">
                                새 일정 계획하기
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="premium-card bg-white/70 backdrop-blur-md border-white/60 shadow-xl shadow-slate-900/5">
                        <CardHeader className="pb-4 border-b border-slate-100/50">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                                <Bell className="w-5 h-5 text-slate-700" />
                                최근 알림
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ul className="divide-y divide-slate-100/80">
                                <li className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                    <div className="flex gap-4">
                                        <div className="mt-1 flex-shrink-0 relative">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">예약이 최종 확정되었습니다.</p>
                                            <p className="text-sm text-slate-600 mt-0.5 line-clamp-1">김철수 가이드님이 2월 24일 일정을 승인했습니다.</p>
                                            <p className="text-xs font-medium text-slate-400 mt-2">2시간 전</p>
                                        </div>
                                    </div>
                                </li>
                                <li className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer group">
                                    <div className="flex gap-4">
                                        <div className="mt-1 flex-shrink-0 relative">
                                            <div className="w-2 h-2 rounded-full bg-slate-300 ml-[1px]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-700">이영희 가이드님 문의 답변</p>
                                            <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">"네, 해당 일정에 북촌 한옥마을 투어도 조율 가능합니다."</p>
                                            <p className="text-xs font-medium text-slate-400 mt-2">어제</p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (추천 가이드/투어) */}
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">당신의 취향을 저격할 가이드</h2>
                                <p className="text-sm text-slate-500 mt-1 font-medium">검증된 전문가들이 제안하는 특별한 로컬 경험</p>
                            </div>
                            <Link href="/traveler/search" className="hidden sm:flex items-center text-sm text-blue-600 font-bold hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100">
                                전체보기 <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[
                                { name: "제임스 파크", region: "서울 강남/이태원", desc: "외국계 기업 주재원 출신의 글로벌 라이프스타일 가이드", tags: ["파인다이닝", "트렌드", "영어"], rating: 4.9, reviews: 156, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
                                { name: "이소연", region: "부산 해운대", desc: "현지인들만 아는 숨은 맛집과 오션뷰 명소 투어", tags: ["식도락", "포토스팟", "감성"], rating: 4.8, reviews: 92, img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" }
                            ].map((guide, idx) => (
                                <Card key={idx} className="premium-card flex flex-col p-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/10 transition-all cursor-pointer group bg-white/80 backdrop-blur-sm border-white/60">
                                    <div className="flex gap-4 mb-4">
                                        <div className="relative">
                                            <img src={guide.img} alt={guide.name} className="w-[72px] h-[72px] rounded-2xl object-cover bg-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-300" />
                                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                                                <div className="bg-amber-100 text-amber-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                    <Star className="w-3 h-3 fill-current" /> {guide.rating}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 pt-1">
                                            <h3 className="font-bold text-slate-900 text-lg truncate group-hover:text-blue-600 transition-colors">{guide.name}</h3>
                                            <div className="flex items-center text-xs text-slate-500 mt-1 font-medium gap-1">
                                                <MapPin className="w-3 h-3" /> {guide.region}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-2 mb-4 font-light leading-relaxed">
                                        "{guide.desc}"
                                    </p>
                                    <div className="mt-auto flex flex-wrap gap-1.5">
                                        {guide.tags.map(tag => (
                                            <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600/90 border border-slate-200/60">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">인기 상승 투어 코스</h2>
                                <p className="text-sm text-slate-500 mt-1 font-medium">지금 가장 많은 여행자들이 선택하고 있는 상품</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {/* Dummy Popular Tours */}
                            <Card className="premium-card overflow-hidden group cursor-pointer bg-white/80 border-white/60 shadow-lg">
                                <div className="h-48 bg-slate-200 relative overflow-hidden">
                                    <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                        BEST 1
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1587841566371-adad37cda3a8?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gyeongbokgung Palace Night Tour" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">왕의 산책로, 경복궁 및 북촌 프리미엄 야간 도보 투어</h3>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-3">
                                        <div className="flex items-center text-xs text-slate-500 font-medium">
                                            <Clock className="w-3.5 h-3.5 mr-1" /> 3시간 소요
                                        </div>
                                        <p className="text-slate-900 font-bold text-lg tracking-tight">₩ 80,000</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="premium-card overflow-hidden group cursor-pointer bg-white/80 border-white/60 shadow-lg">
                                <div className="h-48 bg-slate-200 relative overflow-hidden">
                                    <div className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full">
                                        HOT
                                    </div>
                                    <img src="https://images.unsplash.com/photo-1599308307238-6b45053228ea?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Busan Haeundae Yacht" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">로맨틱 요트 항해, 해운대 프라이빗 선셋 투어</h3>
                                    </div>
                                    <div className="flex items-center justify-between mt-4 border-t border-slate-100 pt-3">
                                        <div className="flex items-center text-xs text-slate-500 font-medium">
                                            <Clock className="w-3.5 h-3.5 mr-1" /> 2시간 소요
                                        </div>
                                        <p className="text-slate-900 font-bold text-lg tracking-tight">₩ 120,000</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
