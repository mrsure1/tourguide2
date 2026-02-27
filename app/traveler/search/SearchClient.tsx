"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Search, MapPin, Calendar, Globe, Tag, Star, Clock, Filter, SlidersHorizontal, User, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchClient({ guides }: { guides: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState("전체");
    const [selectedLanguage, setSelectedLanguage] = useState("상관없음");
    const [sortBy, setSortBy] = useState("추천순");
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
    const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 1, 24));
    const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 1, 26));
    const [searchKeyword, setSearchKeyword] = useState(searchParams.get('q') || "");

    const filteredGuides = useMemo(() => {
        let res = [...guides];

        // 지역 필터
        if (selectedRegion !== '전체') {
            res = res.filter(g => g.guides_detail?.location?.includes(selectedRegion.replace(' 전체', '')));
        }

        // 언어 필터
        if (selectedLanguage !== '상관없음') {
            res = res.filter(g => {
                const guideLangs = g.guides_detail?.languages || [];
                return guideLangs.some((lang: string) => lang.toLowerCase().includes(selectedLanguage.toLowerCase()));
            });
        }

        // 검색어 필터
        if (searchKeyword.trim()) {
            res = res.filter(g =>
                g.full_name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                g.guides_detail?.bio?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                g.guides_detail?.location?.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        }

        // 정렬
        res.sort((a, b) => {
            const ratingA = a.guides_detail?.rating || 0;
            const ratingB = b.guides_detail?.rating || 0;
            const reviewsA = a.guides_detail?.review_count || 0;
            const reviewsB = b.guides_detail?.review_count || 0;
            const priceA = a.guides_detail?.hourly_rate || 0;
            const priceB = b.guides_detail?.hourly_rate || 0;

            if (sortBy === "평점 높은순") return ratingB - ratingA;
            if (sortBy === "리뷰 많은순") return reviewsB - reviewsA;
            if (sortBy === "가격 낮은순") return priceA - priceB;
            return 0; // 추천순
        });

        return res;
    }, [guides, selectedRegion, selectedLanguage, sortBy, searchKeyword]);


    return (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 h-[calc(100vh-64px)] overflow-hidden bg-slate-50 relative">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 pointer-events-none" />

            {/* Left Sidebar - Filters */}
            <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar relative z-10">
                <div className="sticky top-0 bg-slate-50 pt-2 pb-4 z-20">
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <Search className="w-6 h-6 text-blue-600" />
                        가이드 탐색하기
                    </h1>
                </div>

                <div className="space-y-8 pb-10">
                    {/* Region Filter */}
                    <div className="space-y-4 bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-500" /> 키워드 / 지역
                        </h3>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <Input
                                placeholder="이름이나 소개글로 검색"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                className="pl-9 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm rounded-xl"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {['전체', '서울', '부산', '제주', '강원', '전주'].map((region) => (
                                <span
                                    key={region}
                                    onClick={() => setSelectedRegion(region)}
                                    className={`text-xs px-3.5 py-1.5 rounded-full cursor-pointer transition-all ${selectedRegion === region ? 'bg-slate-900 text-white font-medium shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                                >
                                    {region}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Date Filter */}
                    <div className="space-y-4 bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm relative z-30">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500" /> 여행 날짜
                        </h3>
                        <div className="grid grid-cols-2 gap-3 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[1px] bg-slate-300 z-10" />
                            <Input onClick={() => setIsCalendarOpen(!isCalendarOpen)} readOnly value={startDate ? `${startDate.getFullYear()}.${String(startDate.getMonth() + 1).padStart(2, '0')}.${String(startDate.getDate()).padStart(2, '0')}` : "가는 날"} className="text-xs bg-white border-slate-200 shadow-sm rounded-xl py-2 px-3 focus:border-blue-500 cursor-pointer text-center" />
                            <Input onClick={() => setIsCalendarOpen(!isCalendarOpen)} readOnly value={endDate ? `${endDate.getFullYear()}.${String(endDate.getMonth() + 1).padStart(2, '0')}.${String(endDate.getDate()).padStart(2, '0')}` : "오는 날"} className="text-xs bg-white border-slate-200 shadow-sm rounded-xl py-2 px-3 focus:border-blue-500 cursor-pointer text-center" />

                            {isCalendarOpen && (
                                <div className="absolute top-full mt-2 left-0 w-[280px] bg-white border border-slate-200 shadow-xl rounded-2xl z-50 p-4 animate-fade-in">
                                    <div className="flex justify-between items-center mb-4">
                                        <button onClick={(e) => { e.preventDefault(); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); }} className="text-slate-400 hover:text-slate-900 p-1">&lt;</button>
                                        <div className="text-sm font-bold text-slate-900">{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</div>
                                        <button onClick={(e) => { e.preventDefault(); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); }} className="text-slate-400 hover:text-slate-900 p-1">&gt;</button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium mb-1">
                                        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => <div key={d} className={i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-slate-500'}>{d}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => (
                                            <div key={`empty-${i}`} className="py-1.5" />
                                        ))}
                                        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                            const day = i + 1;
                                            const currentItemDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

                                            // isSelected Logic
                                            let isSelected = false;
                                            if (startDate && endDate) {
                                                isSelected = currentItemDate >= startDate && currentItemDate <= endDate;
                                            } else if (startDate) {
                                                isSelected = currentItemDate.getTime() === startDate.getTime();
                                            }

                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        if (!startDate || (startDate && endDate)) {
                                                            setStartDate(currentItemDate);
                                                            setEndDate(null);
                                                        } else {
                                                            if (currentItemDate < startDate) {
                                                                setStartDate(currentItemDate);
                                                                setEndDate(null);
                                                            } else {
                                                                setEndDate(currentItemDate);
                                                            }
                                                        }
                                                    }}
                                                    className={`relative py-1.5 cursor-pointer rounded-lg transition-colors ${isSelected ? 'bg-blue-600 text-white font-bold shadow-sm' : 'text-slate-700 hover:bg-slate-100'}`}
                                                >
                                                    {day}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        <Button size="sm" onClick={() => setIsCalendarOpen(false)} className="text-xs">적용</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Language Filter */}
                    <div className="space-y-4 bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-slate-500" /> 지원 언어
                        </h3>
                        <div className="relative">
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="appearance-none w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm text-slate-700 cursor-pointer"
                            >
                                <option>상관없음</option>
                                <option>English</option>
                                <option>한국어</option>
                                <option>日本語</option>
                                <option>中文</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                <ChevronDownIcon className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 pb-8 lg:pb-0">
                        <Button fullWidth className="h-14 lg:flex bg-slate-900 hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-slate-900/10 transition-colors text-base font-bold flex items-center justify-center gap-2">
                            <Filter className="w-4 h-4" /> 찾기 ({filteredGuides.length}명)
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content - Results */}
            <main className="flex-1 flex flex-col min-w-0 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-xl shadow-slate-200/50 overflow-hidden relative z-10">
                <div className="p-5 sm:p-6 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40">
                    <p className="text-sm text-slate-600 font-medium">
                        총 <span className="font-black text-blue-600 text-base mx-1">{filteredGuides.length}</span>명의 인증된 가이드
                    </p>
                    <div className="relative inline-block w-full sm:w-auto">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none w-full sm:w-40 bg-white border border-slate-200 text-sm font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm text-slate-700 cursor-pointer pr-10"
                        >
                            <option>추천순</option>
                            <option>평점 높은순</option>
                            <option>리뷰 많은순</option>
                            <option>가격 낮은순</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                            <ChevronDownIcon className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar bg-slate-50/30">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {filteredGuides.map(guide => (
                            <Link key={guide.id} href={`/traveler/guides/${guide.id}`}>
                                <Card className="premium-card flex flex-col sm:flex-row gap-5 p-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/10 transition-all cursor-pointer group bg-white border-slate-200/60">
                                    <div className="w-full sm:w-36 h-48 sm:h-auto rounded-2xl bg-slate-100 shrink-0 overflow-hidden relative shadow-inner">
                                        <img src={guide.avatar_url || `https://i.pravatar.cc/150?u=${guide.id}`} alt="Guide" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center shadow-sm">
                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" /> {guide.guides_detail?.rating || "신규"}
                                        </div>
                                        <button className="absolute top-3 right-3 p-1.5 bg-black/20 backdrop-blur-sm rounded-full text-white hover:text-red-400 hover:bg-black/40 transition-colors">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start mb-1.5">
                                                <h3 className="font-bold text-xl text-slate-900 truncate group-hover:text-blue-700 transition-colors">{guide.full_name || 'Anonymous'}</h3>
                                                {guide.guides_detail?.is_verified && (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                                                        인증 가이드
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-1.5 truncate">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {guide.guides_detail?.location || '지역 미정'} <span className="text-slate-300">|</span>
                                                <Globe className="w-3.5 h-3.5 text-slate-400" /> {(guide.guides_detail?.languages || []).join(', ') || '한국어'}
                                                <span className="text-slate-300 ml-1">|</span>
                                                <span className="text-xs ml-1">리뷰 {guide.guides_detail?.review_count || 0}개</span>
                                            </p>
                                            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-light">
                                                {guide.guides_detail?.bio || '소개글이 없습니다.'}
                                            </p>
                                        </div>
                                        <div className="mt-5 flex items-center justify-between">
                                            <div className="flex flex-wrap gap-1.5">
                                                {/* 투어 스타일 태그 등 위치 */}
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">
                                                ₩ {Number(guide.guides_detail?.hourly_rate || 0).toLocaleString()}
                                                <span className="text-xs font-normal text-slate-500 ml-1">
                                                    / {guide.guides_detail?.rate_type === 'hourly' ? '시간' : '일'}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                        {filteredGuides.length === 0 && (
                            <div className="col-span-full py-20 text-center text-slate-500">검색 결과가 없습니다.</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
}
