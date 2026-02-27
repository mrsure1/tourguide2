"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, Clock, Plus, Settings, CheckCircle2, Calendar as CalendarIcon, Ban } from "lucide-react";

export default function GuideSchedule() {
    const [currentMonth, setCurrentMonth] = useState("2026년 2월");

    // 간단한 더미 달력 데이터 (2월 23일 ~ 28일 주간 예시)
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dates = [
        { date: 22, type: "prev", available: false },
        { date: 23, type: "current", available: true, slots: ["09:00", "14:00"] },
        { date: 24, type: "current", available: true, slots: ["10:00"] },
        { date: 25, type: "current", available: true, slots: ["09:00", "15:00", "19:00"] },
        { date: 26, type: "current", available: false, slots: [] },
        { date: 27, type: "current", available: true, slots: ["14:00", "18:00"] },
        { date: 28, type: "current", available: true, slots: ["10:00", "14:00"] }
    ];

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in relative flex flex-col min-h-[calc(100vh-80px)]">
            {/* Ambient Background */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">일정 관리</h1>
                <p className="text-slate-500 mt-2 text-lg">투어가 가능한 날짜와 시간을 설정해주세요. 여행자가 이 캘린더를 보고 예약합니다.</p>
            </div>

            <div className="flex gap-8 flex-col lg:flex-row flex-1 items-start">
                {/* 달력 영역 */}
                <Card className="flex-1 border-slate-200/60 shadow-md bg-white w-full overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-slate-100/80 bg-slate-50/50">
                        <Button variant="outline" className="h-9 w-9 p-0 bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm flex items-center justify-center">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-accent" /> {currentMonth}
                        </CardTitle>
                        <Button variant="outline" className="h-9 w-9 p-0 bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm flex items-center justify-center">
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-7 gap-2 text-center mb-4">
                            {days.map((day, idx) => (
                                <div key={day} className={`text-sm font-bold py-2 ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-slate-500'}`}>
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {dates.map((d, i) => (
                                <div
                                    key={i}
                                    className={`min-h-[100px] p-2 border rounded-xl flex flex-col items-center justify-start cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
                    ${d.type === 'prev' ? 'bg-slate-50/50 border-slate-100 text-slate-400 opacity-60' : 'bg-white border-slate-200 text-slate-900 hover:border-accent hover:ring-1 hover:ring-accent'}
                    ${d.date === 25 ? 'bg-blue-50/30 border-accent ring-2 ring-accent/30 shadow-accent/5' : ''}
                  `}
                                >
                                    <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full mb-1 ${d.date === 25 ? 'bg-accent text-white shadow-sm' : ''}`}>{d.date}</span>
                                    {d.available && d.type === 'current' && d.slots && (
                                        <div className="mt-1 flex flex-col gap-1 w-full px-1">
                                            {d.slots.slice(0, 2).map((slot, idx) => (
                                                <span key={idx} className="text-[11px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-1 rounded-md text-center border border-emerald-200 shadow-sm tracking-tight">
                                                    가능 {slot}
                                                </span>
                                            ))}
                                            {d.slots.length > 2 && (
                                                <span className="text-[10px] text-slate-500 font-bold bg-slate-50 py-0.5 rounded border border-slate-100">+{d.slots.length - 2}</span>
                                            )}
                                        </div>
                                    )}
                                    {!d.available && d.type === 'current' && (
                                        <div className="mt-auto mb-auto flex items-center justify-center w-full h-full">
                                            <span className="text-xs font-bold text-slate-400 flex flex-col items-center gap-1 opacity-70">
                                                <Ban className="w-4 h-4" /> 휴무
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex items-center justify-end text-sm border-t border-slate-100 pt-6">
                            <div className="flex gap-5">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded bg-emerald-400 shadow-sm border border-emerald-500/20"></span>
                                    <span className="text-slate-600 font-medium text-xs">예약 가능</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded bg-blue-500 shadow-sm border border-blue-600/20"></span>
                                    <span className="text-slate-600 font-medium text-xs">예약 확정</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded bg-slate-200 shadow-sm border border-slate-300/50"></span>
                                    <span className="text-slate-600 font-medium text-xs">휴무/불가</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 선택된 날짜 상세 패널 */}
                <Card className="w-full lg:w-96 shrink-0 border-slate-200/60 shadow-lg sticky top-6 overflow-hidden">
                    <CardHeader className="pb-4 border-b border-slate-100/80 bg-slate-50/50">
                        <CardTitle className="text-lg flex justify-between items-center">
                            <span>2월 25일 (수)</span>
                            <span className="text-xs font-bold px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md shadow-sm">선택됨</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 p-6 space-y-8 bg-white">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-accent" /> 가능 시간 추가
                            </label>
                            <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <select className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm focus:ring-2 focus:ring-accent/20 focus:border-accent appearance-none text-center">
                                    <option>09:00</option>
                                    <option>10:00</option>
                                    <option>11:00</option>
                                </select>
                                <span className="text-slate-400 font-bold">~</span>
                                <select className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm focus:ring-2 focus:ring-accent/20 focus:border-accent appearance-none text-center">
                                    <option>13:00</option>
                                    <option>14:00</option>
                                    <option>15:00</option>
                                </select>
                            </div>
                            <Button className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 shadow-md flex gap-2">
                                <Plus className="w-4 h-4" /> 시간 추가하기
                            </Button>
                        </div>

                        <div className="pt-6 border-t border-slate-100 space-y-4">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                <Settings className="w-4 h-4 text-slate-400" /> 등록된 상태 관리
                            </label>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm group hover:border-slate-300 transition-colors">
                                    <span className="text-sm text-slate-900 font-bold tracking-tight">09:00 ~ 13:00</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md border border-emerald-200">가능</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-blue-50/50 px-4 py-3 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                                    <span className="text-sm text-slate-900 font-bold tracking-tight">15:00 ~ 17:00</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-md border border-blue-200 flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3 h-3" /> 예약 확정
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm group hover:border-slate-300 transition-colors">
                                    <span className="text-sm text-slate-900 font-bold tracking-tight">19:00 ~ 21:00</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md border border-emerald-200">가능</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-bold h-11 border-dashed shadow-sm flex gap-2">
                                <Ban className="w-4 h-4" /> 이 날짜 전체 휴무로 설정
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
