"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Search, MapPin, Calendar, Globe, Tag, Star, Clock, Filter, SlidersHorizontal, User, Heart } from "lucide-react";
import Link from "next/link";

const dummyGuides = [
    { id: 1, name: "김철수", rating: 4.8, region: "서울", tags: ["역사/문화", "도보 투어"], price: 35000, reviews: 120, img: 1, desc: "서울의 역사와 문화를 깊이있게 영어로 설명해드리는 5년차 전문 가이드입니다." },
    { id: 2, name: "이영희", rating: 4.9, region: "제주", tags: ["자연/힐링", "사진촬영"], price: 40000, reviews: 300, img: 2, desc: "제주도의 아름다운 풍경을 스냅 사진과 함께 담아드리는 감성 투어 가이드입니다." },
    { id: 3, name: "박지민", rating: 4.6, region: "부산", tags: ["식도락", "야경"], price: 30000, reviews: 85, img: 3, desc: "부산 토박이가 알려주는 진짜 찐 로컬 맛집과 숨겨진 야경 명소 투어입니다." },
    { id: 4, name: "최수민", rating: 4.7, region: "강원", tags: ["자연/힐링"], price: 45000, reviews: 50, img: 4, desc: "속초와 양양의 푸른 바다를 만끽하는 힐링 드라이브 투어 전문가." },
];

const dummyTours = [
    { id: 1, title: "왕의 산책로, 경복궁 및 북촌 특별 프라이빗 투어", rating: 4.8, region: "서울", duration: "4시간", price: 80000, img: "https://images.unsplash.com/photo-1546874177-9e664107314e" },
    { id: 2, title: "해운대 럭셔리 요트 선셋 투어와 야경 스냅", rating: 4.9, region: "부산", duration: "3시간", price: 120000, img: "https://images.unsplash.com/photo-1517154421773-0529f29ea451" },
    { id: 3, title: "한라산 영실코스 에코 트레킹 투어", rating: 4.7, region: "제주", duration: "6시간", price: 60000, img: "https://images.unsplash.com/photo-1590409241031-64eb78ae7aa9" },
    { id: 4, title: "강릉 안목해변 커피거리 & 정동진 바다부채길", rating: 4.6, region: "강원", duration: "5시간", price: 50000, img: "https://images.unsplash.com/photo-1495474472205-51f7d4c0cce5" },
    { id: 5, title: "전주 한옥마을 한복 스냅 & 길거리 음식 완정 복어 투어", rating: 4.8, region: "전주", duration: "4시간", price: 45000, img: "https://images.unsplash.com/photo-1538681105587-85640961bf8b" },
    { id: 6, title: "서울 홍대/연남 인디 문화 & 로컬 펍 크롤링", rating: 4.5, region: "서울", duration: "3시간", price: 55000, img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5" },
];

export default function TravelerSearch() {
    const [activeTab, setActiveTab] = useState("guide"); // 'guide' | 'tour'
    const [priceMax, setPriceMax] = useState(20);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState("서울 전체");
    const [sortBy, setSortBy] = useState("추천순");
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
    const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 1, 24));
    const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 1, 26));

    const filteredGuides = useMemo(() => {
        let res = [...dummyGuides];
        if (selectedRegion !== '서울 전체' && selectedRegion !== '전체') {
            res = res.filter(g => g.region.includes(selectedRegion.replace(' 전체', '')));
        }
        res.sort((a, b) => {
            if (sortBy === "평점 높은순") return b.rating - a.rating;
            if (sortBy === "리뷰 많은순") return b.reviews - a.reviews;
            if (sortBy === "가격 낮은순") return a.price - b.price;
            return 0; // 추천순
        });
        return res;
    }, [selectedRegion, sortBy]);

    const filteredTours = useMemo(() => {
        let res = [...dummyTours];
        if (selectedRegion !== '서울 전체' && selectedRegion !== '전체') {
            res = res.filter(t => t.region.includes(selectedRegion.replace(' 전체', '')));
        }
        res = res.filter(t => t.price <= priceMax * 10000);
        res.sort((a, b) => {
            if (sortBy === "평점 높은순") return b.rating - a.rating;
            if (sortBy === "리뷰 많은순") return b.rating - a.rating; // Placeholder
            if (sortBy === "가격 낮은순") return a.price - b.price;
            return 0; // 추천순
        });
        return res;
    }, [selectedRegion, priceMax, sortBy]);


    return (
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8 h-[calc(100vh-64px)] overflow-hidden bg-slate-50 relative">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 pointer-events-none" />

            {/* Left Sidebar - Filters */}
            <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar relative z-10">
                <div className="sticky top-0 bg-slate-50 pt-2 pb-4 z-20">
                    <h1 className="text-2xl font-black text-slate-900 mb-5 flex items-center gap-2">
                        <Search className="w-6 h-6 text-blue-600" />
                        탐색하기
                    </h1>
                    <div className="flex p-1 bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-slate-200/60 font-medium">
                        <button
                            className={`flex-1 py-2 text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'guide' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'}`}
                            onClick={() => setActiveTab('guide')}
                        >
                            <User className="w-4 h-4" /> 가이드
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === 'tour' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'}`}
                            onClick={() => setActiveTab('tour')}
                        >
                            <MapPin className="w-4 h-4" /> 투어 상품
                        </button>
                    </div>
                </div>

                <div className="space-y-8 pb-10">
                    {/* Region Filter */}
                    <div className="space-y-4 bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-500" /> 지역
                        </h3>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <Input
                                placeholder="어디로 떠나시나요?"
                                defaultValue="서울"
                                className="pl-9 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm rounded-xl"
                            />
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {['서울 전체', '부산', '제주', '강원', '전주'].map((region) => (
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
                            <Calendar className="w-4 h-4 text-slate-500" /> 날짜
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
                                            const isHoliday = currentItemDate.getFullYear() === 2026 && currentItemDate.getMonth() === 1 && (day === 15 || day === 16 || day === 17); // 2026 설날
                                            const isWeekend = currentItemDate.getDay() === 0 || currentItemDate.getDay() === 6;

                                            // isSelected Logic
                                            let isSelected = false;
                                            if (startDate && endDate) {
                                                isSelected = currentItemDate >= startDate && currentItemDate <= endDate;
                                            } else if (startDate) {
                                                isSelected = currentItemDate.getTime() === startDate.getTime();
                                            }

                                            // 15,16,17일 공휴일 표시 (설날)
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
                                                    className={`relative py-1.5 cursor-pointer rounded-lg transition-colors ${isSelected ? 'bg-blue-600 text-white font-bold shadow-sm' : isHoliday ? 'text-red-500 font-bold bg-red-50' : isWeekend ? (currentItemDate.getDay() === 0 ? 'text-red-500' : 'text-blue-500') : 'text-slate-700 hover:bg-slate-100'}`}
                                                >
                                                    {day}
                                                    {isHoliday && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] text-red-500 font-normal whitespace-nowrap scale-75">설날</div>}
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
                        <label className="flex items-center text-sm text-slate-600 cursor-pointer mt-3 group">
                            <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                                <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer" />
                                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span className="group-hover:text-slate-900 transition-colors">내 일정과 일치하는 항목만</span>
                        </label>
                    </div>

                    {/* Language Filter */}
                    <div className="space-y-4 bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-slate-500" /> 지원 언어
                        </h3>
                        <div className="relative">
                            <select className="appearance-none w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm text-slate-700 cursor-pointer">
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

                    {/* Style/Tag Filter */}
                    <div className="space-y-4 bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-slate-500" /> 투어 스타일
                        </h3>
                        <div className="grid grid-cols-2 gap-2.5">
                            {['역사/문화', '도보 투어', '식도락', '야경', '사진촬영', '자연/힐링'].map(style => (
                                <label key={style} className="flex items-center text-sm text-slate-700 cursor-pointer p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm group">
                                    <div className="relative flex items-center justify-center w-4 h-4 mr-2.5">
                                        <input type="checkbox" className="peer appearance-none w-4 h-4 border-2 border-slate-300 rounded-sm checked:bg-slate-900 checked:border-slate-900 transition-colors cursor-pointer" />
                                        <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className="group-hover:text-slate-900 font-medium text-xs">{style}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range Filter (Only for Tours) */}
                    {activeTab === 'tour' && (
                        <div className="space-y-4 bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-slate-500" /> 가격 범위
                            </h3>
                            <div className="pt-2 pb-1">
                                <input
                                    type="range"
                                    min="0" max="50" step="1"
                                    value={priceMax}
                                    onChange={(e) => setPriceMax(Number(e.target.value))}
                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                                />
                            </div>
                            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                                <span>₩0</span>
                                <span>₩500,000+</span>
                            </div>
                            <div className="flex justify-center text-sm font-bold text-slate-800 bg-slate-50 py-1.5 rounded-lg border border-slate-100">
                                최대 {priceMax === 50 ? '500,000원 이상' : `${priceMax}0,000원`}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 pb-8 lg:pb-0">
                        <Button fullWidth className="h-14 lg:flex bg-slate-900 hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-slate-900/10 transition-colors text-base font-bold flex items-center justify-center gap-2">
                            <Filter className="w-4 h-4" /> {activeTab === 'guide' ? filteredGuides.length : filteredTours.length}개의 결과 보기
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content - Results */}
            <main className="flex-1 flex flex-col min-w-0 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-xl shadow-slate-200/50 overflow-hidden relative z-10">
                <div className="p-5 sm:p-6 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40">
                    <p className="text-sm text-slate-600 font-medium">
                        총 <span className="font-black text-blue-600 text-base mx-1">{activeTab === 'guide' ? filteredGuides.length : filteredTours.length}</span>개의 <span className="text-slate-900">{activeTab === 'guide' ? '전문 가이드를' : '특별한 투어 상품을'}</span> 찾았습니다
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
                    {activeTab === 'guide' ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {filteredGuides.map(guide => (
                                <Card key={guide.id} className="premium-card flex flex-col sm:flex-row gap-5 p-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/10 transition-all cursor-pointer group bg-white border-slate-200/60">
                                    <div className="w-full sm:w-36 h-48 sm:h-auto rounded-2xl bg-slate-100 shrink-0 overflow-hidden relative shadow-inner">
                                        <img src={`https://i.pravatar.cc/150?u=g${guide.img}`} alt="Guide" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center shadow-sm">
                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" /> {guide.rating}
                                        </div>
                                        <button className="absolute top-3 right-3 p-1.5 bg-black/20 backdrop-blur-sm rounded-full text-white hover:text-red-400 hover:bg-black/40 transition-colors">
                                            <Heart className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div>
                                            <div className="flex justify-between items-start mb-1.5">
                                                <h3 className="font-bold text-xl text-slate-900 truncate group-hover:text-blue-700 transition-colors">{guide.name}</h3>
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                                                    인증 가이드
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-slate-500 mb-3 flex items-center gap-1.5 truncate">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {guide.region} 전문 <span className="text-slate-300">|</span>
                                                <Globe className="w-3.5 h-3.5 text-slate-400" /> EN, KO
                                                <span className="text-slate-300 ml-1">|</span>
                                                <span className="text-xs ml-1">리뷰 {guide.reviews}개</span>
                                            </p>
                                            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-light">
                                                {guide.desc}
                                            </p>
                                        </div>
                                        <div className="mt-5 flex items-center justify-between">
                                            <div className="flex flex-wrap gap-1.5">
                                                {guide.tags.map(tag => (
                                                    <span key={tag} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-sm font-bold text-slate-900">₩ {guide.price.toLocaleString()}<span className="text-xs font-normal text-slate-500">/시간</span></span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            {filteredGuides.length === 0 && (
                                <div className="col-span-full py-20 text-center text-slate-500">검색 결과가 없습니다.</div>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                            {filteredTours.map(tour => (
                                <Link key={tour.id} href={`/traveler/tours/${tour.id}`} className="block">
                                    <Card className="premium-card flex flex-col h-full group cursor-pointer overflow-hidden border-slate-200/60 bg-white hover:border-blue-300 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10">
                                        <div className="h-56 bg-slate-200 relative overflow-hidden shrink-0">
                                            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center shadow-sm">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" /> {tour.rating}
                                            </div>
                                            <img src={`${tour.img}?q=80&w=600&auto=format&fit=crop`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Tour" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <button className="absolute top-3 right-3 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:text-red-400 hover:bg-black/40 transition-colors z-10" onClick={(e) => { e.preventDefault(); }}>
                                                <Heart className="w-4 h-4" />
                                            </button>
                                            <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                                                <span className="text-white text-xs font-medium px-2 py-1 rounded bg-white/20 backdrop-blur-md border border-white/20">
                                                    바로 예약 가능
                                                </span>
                                            </div>
                                        </div>
                                        <CardContent className="p-5 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-3 gap-2">
                                                <h3 className="font-bold text-slate-900 text-lg leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">{tour.title}</h3>
                                            </div>
                                            <p className="text-sm font-medium text-slate-500 mb-5 flex items-center gap-3">
                                                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {tour.region}</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {tour.duration}</span>
                                            </p>
                                            <div className="flex items-end justify-between mt-auto pt-4 border-t border-slate-100">
                                                <div className="flex -space-x-2 relative group/avatars">
                                                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm relative z-20" src={`https://i.pravatar.cc/150?u=g${tour.id}`} alt="Guide" />
                                                    <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600 shadow-sm relative z-10">+12</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-black text-slate-900 tracking-tight">
                                                        ₩ {tour.price.toLocaleString()} <span className="text-xs font-medium text-slate-500">/ 1인</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                            {filteredTours.length === 0 && (
                                <div className="col-span-full py-20 text-center text-slate-500">조회된 투어 상품이 없습니다.</div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Helper icon component
function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
}
