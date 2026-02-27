"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ReviewModal } from "@/components/review/ReviewModal";
import { CalendarDays, Clock, Users, Ticket, MapPin, MessageSquare, Download, Repeat, Star } from "lucide-react";

export default function TravelerBookings() {
    const [activeStatus, setActiveStatus] = useState("upcoming"); // upcoming, past, cancelled
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedTourForReview, setSelectedTourForReview] = useState("");

    const handleReviewSubmit = (data: { rating: number; review: string }) => {
        console.log("Review submitted:", data);
        alert("리뷰가 등록되었습니다. 감사합니다!");
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                    <Ticket className="w-8 h-8 text-accent" />
                    나의 예약 내역
                </h1>
                <p className="mt-2 text-slate-500">예정된 투어와 다녀온 투어 일정을 확인하고 관리하세요.</p>
            </div>

            {/* Premium Tabs */}
            <div className="flex border-b border-slate-200 mb-8 overflow-x-auto hide-scrollbar gap-8">
                <button
                    onClick={() => setActiveStatus('upcoming')}
                    className={`pb-4 text-sm font-bold whitespace-nowrap transition-all relative ${activeStatus === 'upcoming' ? 'text-accent' : 'text-slate-500 hover:text-slate-800'
                        }`}
                >
                    예정된 투어 (2)
                    {activeStatus === 'upcoming' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveStatus('past')}
                    className={`pb-4 text-sm font-bold whitespace-nowrap transition-all relative ${activeStatus === 'past' ? 'text-accent' : 'text-slate-500 hover:text-slate-800'
                        }`}
                >
                    다녀온 투어 (5)
                    {activeStatus === 'past' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveStatus('cancelled')}
                    className={`pb-4 text-sm font-bold whitespace-nowrap transition-all relative ${activeStatus === 'cancelled' ? 'text-accent' : 'text-slate-500 hover:text-slate-800'
                        }`}
                >
                    취소 내역 (0)
                    {activeStatus === 'cancelled' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-t-full" />
                    )}
                </button>
            </div>

            <div className="space-y-6">
                {/* Booking Cards */}
                {[1, 2].map((idx) => (
                    <Card key={idx} className="overflow-hidden border-slate-200/60 shadow-md hover:shadow-lg transition-all flex flex-col md:flex-row group">
                        <div className="h-56 md:h-auto md:w-72 bg-slate-200 shrink-0 relative overflow-hidden">
                            <img
                                src={`https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=600&auto=format&fit=crop&sig=${idx}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                alt="Tour img"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-60" />
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-accent shadow-sm flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                예약 확정
                            </div>
                        </div>

                        <div className="p-6 lg:p-8 flex-1 flex flex-col justify-between min-w-0 bg-white">
                            <div>
                                <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 bg-slate-100 w-fit px-2 py-1 rounded-md">
                                            <MapPin className="w-3.5 h-3.5" />
                                            서울, 대한민국
                                        </div>
                                        <h2 className="text-xl lg:text-2xl font-bold text-slate-900 line-clamp-1 group-hover:text-accent transition-colors">
                                            경복궁 및 북촌 프리미엄 해설 투어
                                        </h2>
                                    </div>
                                    <span className="text-xl font-extrabold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                        ₩ 160,000
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-5 border-y border-slate-100/80 my-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-accent shrink-0">
                                            <CalendarDays className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 mb-0.5">이용 날짜</p>
                                            <p className="text-sm font-bold text-slate-900">2026.02.24</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 mb-0.5">이용 시간</p>
                                            <p className="text-sm font-bold text-slate-900">09:00 (4H)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 mb-0.5">이용 인원</p>
                                            <p className="text-sm font-bold text-slate-900">성인 2명</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 shrink-0">
                                            <Ticket className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 mb-0.5">예약 번호</p>
                                            <p className="text-sm font-bold text-slate-900">#BK-2026{idx}X</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 py-2">
                                    <img src="https://i.pravatar.cc/150?u=g1" alt="Guide" className="w-12 h-12 rounded-full border-2 border-white shadow-sm ring-1 ring-slate-100" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                            김철수 가이드
                                            <span className="flex items-center text-xs text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded font-semibold">
                                                <Star className="w-3 h-3 fill-amber-500 mr-0.5" /> 4.9
                                            </span>
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">서울 전문가 · 영어 능통</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-0 pt-6 justify-end">
                                {activeStatus === 'upcoming' && (
                                    <>
                                        <Button variant="outline" className="bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                                            예약 취소
                                        </Button>
                                        <Button variant="outline" className="bg-white border-accent/20 text-accent hover:bg-accent/5 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" /> 가이드 메시지
                                        </Button>
                                        <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-md flex items-center gap-2">
                                            <Download className="w-4 h-4" /> E-바우처
                                        </Button>
                                    </>
                                )}
                                {activeStatus === 'past' && (
                                    <>
                                        <Button variant="outline" className="bg-white border-slate-200 hover:bg-slate-50 hover:text-accent shadow-sm" onClick={() => {
                                            setSelectedTourForReview("경복궁 및 북촌 프리미엄 해설 투어");
                                            setReviewModalOpen(true);
                                        }}>
                                            <Star className="w-4 h-4 mr-2" /> 후기 작성
                                        </Button>
                                        <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-md">
                                            <Repeat className="w-4 h-4 mr-2" /> 다시 예약하기
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                onSubmit={handleReviewSubmit}
                tourName={selectedTourForReview}
            />
        </div>
    );
}

