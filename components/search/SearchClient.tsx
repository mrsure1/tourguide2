"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Search, MapPin, Globe, Tag, Star, Clock, Filter, SlidersHorizontal, User, Heart, Calendar as CalendarIcon, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchClient({
    guides,
    recommendedGuides = [],
    popularGuides = [],
    tours = [],
    recommendedTours = []
}: {
    guides: any[],
    recommendedGuides?: any[],
    popularGuides?: any[],
    tours?: any[],
    recommendedTours?: any[]
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState<"guide" | "tour">(
        (searchParams.get('type') as "guide" | "tour") || "guide"
    );
    const [guidePage, setGuidePage] = useState(1);
    const [tourPage, setTourPage] = useState(1);
    const ITEMS_PER_PAGE = 6;
    const [selectedRegion, setSelectedRegion] = useState("전체");
    const [selectedLanguage, setSelectedLanguage] = useState("상관없음");
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [sortBy, setSortBy] = useState("추천순");
    const [searchKeyword, setSearchKeyword] = useState(searchParams.get('q') || "");

    // 1. 가이드 필터링 로직
    const filteredGuides = useMemo(() => {
        let res = [...guides];

        // 지역 필터 (사이드바 버튼)
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

        // 통합 키워드 검색 (Hero 검색창 등) - 이름, 지역, 소개글 모두 포함
        if (searchKeyword.trim()) {
            const keyword = searchKeyword.toLowerCase().trim();
            res = res.filter(g =>
                (g.full_name?.toLowerCase().includes(keyword)) ||
                (g.guides_detail?.bio?.toLowerCase().includes(keyword)) ||
                (g.guides_detail?.location?.toLowerCase().includes(keyword))
            );
        }

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
            return 0;
        });
        return res;
    }, [guides, selectedRegion, selectedLanguage, sortBy, searchKeyword]);

    // 2. 투어 필터링 로직
    const filteredTours = useMemo(() => {
        let res = [...tours];

        // 지역 필터
        if (selectedRegion !== '전체') {
            res = res.filter(t => t.region?.includes(selectedRegion.replace(' 전체', '')));
        }

        // 카테고리 필터
        if (selectedCategory !== '전체') {
            res = res.filter(t => t.category === selectedCategory);
        }

        // 통합 키워드 검색
        if (searchKeyword.trim()) {
            const keyword = searchKeyword.toLowerCase().trim();
            res = res.filter(t =>
                (t.title?.toLowerCase().includes(keyword)) ||
                (t.description?.toLowerCase().includes(keyword)) ||
                (t.region?.toLowerCase().includes(keyword))
            );
        }

        res.sort((a, b) => {
            if (sortBy === "가격 낮은순") return a.price - b.price;
            if (sortBy === "최신순") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            return 0;
        });
        return res;
    }, [tours, selectedRegion, selectedCategory, sortBy, searchKeyword]);

    // 3. 페이지네이션 관련
    const totalGuidePages = Math.max(1, Math.ceil(filteredGuides.length / ITEMS_PER_PAGE));
    const totalTourPages = Math.max(1, Math.ceil(filteredTours.length / ITEMS_PER_PAGE));

    const paginatedGuides = useMemo(() => {
        const start = (guidePage - 1) * ITEMS_PER_PAGE;
        return filteredGuides.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredGuides, guidePage]);

    const paginatedTours = useMemo(() => {
        const start = (tourPage - 1) * ITEMS_PER_PAGE;
        return filteredTours.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredTours, tourPage]);

    // 4. 이펙트 핸들러
    useEffect(() => {
        setGuidePage(1);
        setTourPage(1);
    }, [selectedRegion, selectedLanguage, selectedCategory, sortBy, searchKeyword, activeTab]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('type', activeTab);
        if (searchKeyword) params.set('q', searchKeyword);
        else params.delete('q');
        router.replace(`?${params.toString()}`, { scroll: false });
    }, [activeTab, searchKeyword, router, searchParams]);

    const isSearching = searchKeyword.trim().length > 0;

    // 5. 카드 컴포넌트
    const GuideCard = ({ guide }: { guide: any }) => (
        <Link href={`/traveler/guides/${guide.id}`}>
            <Card className="premium-card flex flex-col sm:flex-row gap-5 p-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/10 transition-all cursor-pointer group bg-white border-slate-200/60 h-full">
                <div className="w-full sm:w-36 h-48 sm:h-auto rounded-2xl bg-slate-100 shrink-0 overflow-hidden relative shadow-inner">
                    <img src={guide.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${guide.id}`} alt="Guide" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center shadow-sm">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" /> {guide.guides_detail?.rating || "신규"}
                    </div>
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
                        </p>
                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-light">
                            {guide.guides_detail?.bio || '소개글이 없습니다.'}
                        </p>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
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
    );

    const TourCard = ({ tour }: { tour: any }) => (
        <Link href={`/traveler/tours/${tour.id}`}>
            <Card className="premium-card flex flex-col gap-0 overflow-hidden hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/10 transition-all cursor-pointer group bg-white border-slate-200/60 h-full">
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                    <img src={tour.photo || "https://images.unsplash.com/photo-1544750040-4ea9b8a27d38?q=80&w=800"} alt="Tour" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-slate-900 shadow-sm">
                        {tour.region}
                    </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors mb-2">{tour.title}</h3>
                        <div className="flex items-center text-xs text-slate-500 gap-3">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {tour.duration}시간</span>
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {tour.profiles?.full_name}</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-blue-600 font-black text-lg">₩ {tour.price.toLocaleString()}</span>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="w-3 h-3 fill-amber-500" /> {tour.profiles?.guides_detail?.rating || 4.5}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-[calc(100vh-64px)] bg-slate-50 relative overflow-y-auto custom-scrollbar">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 pointer-events-none" />

            <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6 relative z-10">
                <div className="sticky top-0 pt-2 pb-4">
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <Search className="w-6 h-6 text-blue-600" />
                        통합 탐색
                    </h1>
                </div>

                <div className="space-y-6">
                    <div className="space-y-4 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl shadow-slate-200/50">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                            <MapPin className="w-4 h-4 text-blue-500" /> 지역 필터
                        </h3>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {['전체', '서울', '부산', '제주', '강원', '전주'].map((region) => (
                                <span
                                    key={region}
                                    onClick={() => setSelectedRegion(region)}
                                    className={`text-xs px-4 py-2 rounded-xl cursor-pointer transition-all font-bold ${selectedRegion === region ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-300'}`}
                                >
                                    {region}
                                </span>
                            ))}
                        </div>
                    </div>

                    {activeTab === "guide" ? (
                        <div className="space-y-4 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl shadow-slate-200/50">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                                <Globe className="w-4 h-4 text-emerald-500" /> 언어 설정
                            </h3>
                            <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value)}
                                className="w-full rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100/50 focus:border-blue-400 shadow-inner text-slate-700 cursor-pointer"
                            >
                                <option>상관없음</option>
                                <option>English</option>
                                <option>한국어</option>
                                <option>日本語</option>
                                <option>中文</option>
                            </select>
                        </div>
                    ) : (
                        <div className="space-y-4 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl shadow-slate-200/50">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                                <Tag className="w-4 h-4 text-amber-500" /> 테마 / 카테고리
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {['전체', '역사', '음식', '쇼핑', '야경', '액티비티'].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`text-[10px] font-bold py-2 px-3 rounded-xl border transition-all ${selectedCategory === cat ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-200' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            <main id="search-results" className="flex-1 min-w-0 relative z-10">
                {!isSearching ? (
                    <div className="space-y-12 animate-fade-in">
                        {activeTab === "guide" ? (
                            <>
                                <section className="space-y-6">
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                        <Sparkles className="w-7 h-7 text-amber-500 animate-pulse" />
                                        추천 가이드
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {recommendedGuides.map((guide: any) => (
                                            <GuideCard key={`rec-${guide.id}`} guide={guide} />
                                        ))}
                                    </div>
                                </section>
                                <section className="space-y-6">
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                        <TrendingUp className="w-7 h-7 text-rose-500" />
                                        인기 가이드
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                                        {popularGuides.map((guide: any) => (
                                            <GuideCard key={`pop-${guide.id}`} guide={guide} />
                                        ))}
                                    </div>
                                </section>
                            </>
                        ) : (
                            <>
                                <section className="space-y-6">
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                        <Sparkles className="w-7 h-7 text-blue-500 animate-pulse" />
                                        추천 투어
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {recommendedTours.map((tour: any) => (
                                            <TourCard key={`rectour-${tour.id}`} tour={tour} />
                                        ))}
                                    </div>
                                </section>
                                <div className="p-8 bg-blue-600 rounded-[40px] text-white text-center relative overflow-hidden shadow-2xl">
                                    <h3 className="text-2xl font-black mb-2">나만의 맞춤 투어를 찾아보세요</h3>
                                    <p className="text-blue-100 text-sm">원하는 키워드로 검색해 보세요.</p>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="bg-white/60 backdrop-blur-md rounded-[32px] border border-white shadow-2xl overflow-hidden animate-in slide-in-from-right-4 duration-500">
                        {/* Tab Navigation moved to main content area top */}
                        <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                            <div className="flex bg-slate-200/50 p-1 rounded-2xl backdrop-blur-sm max-w-md mx-auto sm:mx-0">
                                <button
                                    onClick={() => setActiveTab("guide")}
                                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === "guide" ? "bg-white text-blue-600 shadow-md transform scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    <User className="w-4 h-4" /> 가이드 찾기
                                </button>
                                <button
                                    onClick={() => setActiveTab("tour")}
                                    className={`flex-1 py-3 px-6 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === "tour" ? "bg-white text-blue-600 shadow-md transform scale-[1.02]" : "text-slate-500 hover:text-slate-700"}`}
                                >
                                    <Heart className="w-4 h-4" /> 투어 상품 탐색
                                </button>
                            </div>
                        </div>
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40">
                            <div>
                                <h2 className="text-xl font-black text-slate-900">{activeTab === "guide" ? "가이드" : "투어"} 검색 결과</h2>
                                <p className="text-sm text-slate-500"><span className="text-blue-600 font-bold">{activeTab === "guide" ? filteredGuides.length : filteredTours.length}</span>개의 결과를 찾았습니다.</p>
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-white border border-slate-200 text-sm font-bold rounded-2xl px-5 py-2.5 shadow-sm text-slate-700 min-w-32"
                            >
                                <option>추천순</option>
                                <option>평점 높은순</option>
                                <option>가격 낮은순</option>
                                {activeTab === "tour" && <option>최신순</option>}
                            </select>
                        </div>

                        <div className="p-6 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                            {(activeTab === "guide" ? filteredGuides.length : filteredTours.length) === 0 ? (
                                <div className="py-24 text-center text-slate-400">결과가 없습니다.</div>
                            ) : (
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    {activeTab === "guide" ? (
                                        paginatedGuides.map((guide: any) => (
                                            <GuideCard key={guide.id} guide={guide} />
                                        ))
                                    ) : (
                                        paginatedTours.map((tour: any) => (
                                            <TourCard key={tour.id} tour={tour} />
                                        ))
                                    )}
                                </div>
                            )}

                            {(activeTab === "guide" ? totalGuidePages : totalTourPages) > 1 && (
                                <div className="flex justify-center items-center mt-10 gap-3 pb-8">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => activeTab === "guide" ? setGuidePage(p => Math.max(1, p - 1)) : setTourPage(p => Math.max(1, p - 1))}
                                        disabled={(activeTab === "guide" ? guidePage : tourPage) === 1}
                                    >
                                        이전
                                    </Button>
                                    <span className="text-xs font-black text-slate-500">
                                        {activeTab === "guide" ? guidePage : tourPage} / {activeTab === "guide" ? totalGuidePages : totalTourPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => activeTab === "guide" ? setGuidePage(p => Math.min(totalGuidePages, p + 1)) : setTourPage(p => Math.min(totalTourPages, p + 1))}
                                        disabled={(activeTab === "guide" ? guidePage : tourPage) === (activeTab === "guide" ? totalGuidePages : totalTourPages)}
                                    >
                                        다음
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
