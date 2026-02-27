"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, CheckCircle2, Calendar as CalendarIcon, Ban, Clock, Trash2, Save } from "lucide-react";
import { addUnavailableDate, removeUnavailableDate, addUnavailableDates } from "./actions";

export default function ScheduleClient({ bookings, unavailabilities }: { bookings: any[], unavailabilities: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const currentMonthLabel = `${year}년 ${month + 1}월`;

    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonthDays = getDaysInMonth(year, month - 1);
    const dates = [];

    // format YYYY-MM-DD
    const formatDate = (y: number, m: number, d: number) => {
        const mm = String(m + 1).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        return `${y}-${mm}-${dd}`;
    };

    // fill previous month
    for (let i = firstDay - 1; i >= 0; i--) {
        dates.push({ date: prevMonthDays - i, type: "prev", fullDate: formatDate(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1, prevMonthDays - i) });
    }

    // fill current month
    for (let i = 1; i <= daysInMonth; i++) {
        dates.push({ date: i, type: "current", fullDate: formatDate(year, month, i) });
    }

    // fill over
    const remaining = 42 - dates.length; // 6 rows
    for (let i = 1; i <= remaining; i++) {
        dates.push({ date: i, type: "next", fullDate: formatDate(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1, i) });
    }

    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

    // Toggle date selection
    const toggleDate = (fullDate: string) => {
        setSelectedDates(prev =>
            prev.includes(fullDate)
                ? prev.filter(d => d !== fullDate)
                : [...prev, fullDate]
        );
    };

    const handleAddUnavailables = () => {
        if (selectedDates.length === 0) return;

        const formData = new FormData();
        formData.append('dates', JSON.stringify(selectedDates));
        formData.append('reason', '휴무');

        startTransition(async () => {
            const result = await addUnavailableDates(formData);
            if (result.success) {
                setSelectedDates([]);
                // 서버 컴포넌트 데이터 갱신
                router.refresh();
                alert("휴무일이 설정되었습니다.");
            } else if (result.error) {
                alert("오류 발생: " + result.error);
            }
        });
    };

    const handleRemoveUnavailable = (id: string) => {
        const formData = new FormData();
        formData.append('id', id);
        startTransition(async () => {
            const result = await removeUnavailableDate(formData);
            if (result.success) {
                router.refresh();
            } else if (result.error) {
                alert("삭제 실패: " + result.error);
            }
        });
    };

    // Detailed info for the last selected date (if any)
    const featuredDate = selectedDates.length > 0 ? selectedDates[selectedDates.length - 1] : null;
    const dayBookings = featuredDate ? bookings.filter(b => b.start_date <= featuredDate && b.end_date >= featuredDate) : [];
    const dayUnavailables = featuredDate ? unavailabilities.filter(u => u.start_date <= featuredDate && u.end_date >= featuredDate) : [];

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in relative flex flex-col min-h-[calc(100vh-80px)]">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">일정 관리</h1>
                <p className="text-slate-500 mt-2 text-lg">여러 날짜를 선택하여 한 번에 휴무일로 지정할 수 있습니다.</p>
            </div>

            <div className="flex gap-8 flex-col lg:flex-row flex-1 items-start">
                <Card className="flex-1 border-slate-200/60 shadow-md bg-white w-full overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-slate-100/80 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => { e.preventDefault(); setCurrentDate(new Date()); }}
                                className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-all shadow-sm mr-2"
                            >
                                오늘
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); prevMonth(); }}
                                className="p-2 rounded-full hover:bg-white hover:shadow-md text-blue-600 bg-blue-50/50 border border-blue-100 transition-all active:scale-95 flex items-center justify-center"
                                title="이전 달"
                            >
                                <ChevronLeft className="w-6 h-6" strokeWidth={3} />
                            </button>
                        </div>
                        <CardTitle className="text-xl font-black flex items-center gap-2 text-slate-900 mx-4">
                            <CalendarIcon className="w-6 h-6 text-blue-600" /> {currentMonthLabel}
                        </CardTitle>
                        <button
                            onClick={(e) => { e.preventDefault(); nextMonth(); }}
                            className="p-2 rounded-full hover:bg-white hover:shadow-md text-blue-600 bg-blue-50/50 border border-blue-100 transition-all active:scale-95 flex items-center justify-center"
                            title="다음 달"
                        >
                            <ChevronRight className="w-6 h-6" strokeWidth={3} />
                        </button>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-7 gap-2 text-center mb-4">
                            {["일", "월", "화", "수", "목", "금", "토"].map((day, idx) => (
                                <div key={day} className={`text-sm font-bold py-2 ${idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-slate-500'}`}>
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {dates.map((d, i) => {
                                const isSelected = selectedDates.includes(d.fullDate);
                                const isBlocked = unavailabilities.some(u => u.start_date <= d.fullDate && u.end_date >= d.fullDate);
                                const hasBooking = bookings.some(b => b.start_date <= d.fullDate && b.end_date >= d.fullDate);

                                return (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            toggleDate(d.fullDate);
                                            if (d.type === 'prev') prevMonth();
                                            if (d.type === 'next') nextMonth();
                                        }}
                                        className={`min-h-[110px] p-2 border-2 rounded-2xl flex flex-col items-center justify-start cursor-pointer transition-all duration-300 relative group
                    ${d.type !== 'current' ? 'bg-slate-50/20 border-slate-100 text-slate-400 opacity-40' : 'bg-white border-slate-200 text-slate-900 hover:border-blue-400 hover:shadow-xl hover:-translate-y-1'}
                    ${isSelected ? 'border-blue-500 bg-blue-50 shadow-inner z-10 ring-4 ring-blue-500/10' : ''}
                    ${isBlocked && !isSelected ? 'bg-slate-100/50 border-slate-200' : ''}
                  `}
                                    >
                                        <span className={`text-sm font-black w-9 h-9 flex items-center justify-center rounded-full mb-2 transition-all ${isSelected ? 'bg-blue-600 text-white shadow-lg scale-110' : 'group-hover:bg-slate-100'}`}>
                                            {d.date}
                                        </span>

                                        {isBlocked && (
                                            <div className="mt-auto mb-auto flex items-center justify-center w-full">
                                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isSelected ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-500'} flex items-center gap-1`}>
                                                    <Ban className="w-2.5 h-2.5" /> 휴무
                                                </span>
                                            </div>
                                        )}

                                        {!isBlocked && hasBooking && (
                                            <div className="mt-1 flex flex-col gap-1 w-full px-1">
                                                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1 py-1 rounded text-center border border-blue-200 shadow-sm truncate">예약됨</span>
                                            </div>
                                        )}

                                        {!isBlocked && !hasBooking && d.type === 'current' && (
                                            <div className="mt-1 flex flex-col gap-1 w-full px-1">
                                                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1 py-1 rounded text-center border border-emerald-200 shadow-sm truncate">가능</span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card className="w-full lg:w-96 shrink-0 border-slate-200/60 shadow-lg sticky top-6 overflow-hidden">
                    <CardHeader className="pb-4 border-b border-slate-100/80 bg-blue-600 text-white">
                        <CardTitle className="text-lg font-bold flex flex-col gap-1">
                            <span>관리 패널</span>
                            <span className="text-xs font-normal opacity-90">{selectedDates.length}개의 날짜 선택됨</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 p-6 space-y-6 bg-white">

                        {selectedDates.length > 0 ? (
                            <div className="space-y-4">
                                <Button
                                    onClick={handleAddUnavailables}
                                    disabled={isPending}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black h-12 rounded-xl flex items-center gap-2 shadow-lg active:scale-[0.98] transition-all"
                                >
                                    {isPending ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save className="w-5 h-5" />}
                                    {selectedDates.length}개 날짜 휴무로 설정
                                </Button>
                                <Button
                                    onClick={() => setSelectedDates([])}
                                    variant="outline"
                                    className="w-full border-slate-200 text-slate-500 hover:bg-slate-50 font-bold h-11 rounded-xl"
                                >
                                    선택 해제
                                </Button>

                                <div className="pt-4 border-t border-slate-100">
                                    <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-600" /> 최근 선택한 날짜 상세
                                    </h3>
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <div className="text-base font-black text-slate-900 mb-3">{featuredDate}</div>

                                        <div className="space-y-4">
                                            {dayBookings.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">이 날의 투어</div>
                                                    {dayBookings.map(b => (
                                                        <div key={b.id} className="text-xs bg-white p-2 rounded border border-slate-200 shadow-sm flex justify-between items-center">
                                                            <span className="font-bold">{b.traveler?.full_name}</span>
                                                            <span className="text-slate-400">₩{Number(b.total_price).toLocaleString()}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {dayUnavailables.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="text-[11px] font-bold text-red-500 uppercase tracking-wider">휴무 정보</div>
                                                    {dayUnavailables.map(u => (
                                                        <div key={u.id} className="flex justify-between items-center bg-white p-2 rounded border border-red-100">
                                                            <span className="text-xs font-bold text-red-600">{u.reason}</span>
                                                            <button
                                                                onClick={() => handleRemoveUnavailable(u.id)}
                                                                className="text-red-400 hover:text-red-600"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 opacity-60">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                    <CalendarIcon className="w-8 h-8 text-slate-400" />
                                </div>
                                <div>
                                    <div className="text-base font-bold text-slate-900">날짜를 선택하세요</div>
                                    <p className="text-xs text-slate-500 mt-1">달력에서 휴무로 지정할<br />날짜들을 클릭하세요.</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
