"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Calendar as CalendarIcon, Ban, Clock, Trash2, Save } from "lucide-react";
import { addUnavailableDate, removeUnavailableDate, addUnavailableDates } from "./actions";
import { Calendar } from "@/components/ui/Calendar";

export default function ScheduleClient({ bookings, unavailabilities }: { bookings: any[], unavailabilities: any[] }) {
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleAddUnavailables = () => {
        if (selectedDates.length === 0) return;

        const formData = new FormData();
        formData.append('dates', JSON.stringify(selectedDates));
        formData.append('reason', '휴무');

        startTransition(async () => {
            const result = await addUnavailableDates(formData);
            if (result.success) {
                setSelectedDates([]);
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
    const dayBookings = featuredDate ? bookings.filter(b => b.start_date.split('T')[0] <= featuredDate && b.end_date.split('T')[0] >= featuredDate) : [];
    const dayUnavailables = featuredDate ? unavailabilities.filter(u => u.start_date.split('T')[0] <= featuredDate && u.end_date.split('T')[0] >= featuredDate) : [];

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in relative flex flex-col min-h-[calc(100vh-80px)]">
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">일정 관리</h1>
                <p className="text-slate-500 mt-2 text-lg">여러 날짜를 선택하여 한 번에 휴무일로 지정할 수 있습니다.</p>
            </div>

            <div className="flex gap-8 flex-col lg:flex-row flex-1 items-start">
                <Card className="flex-1 border-slate-200/60 shadow-md bg-white w-full overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                        <CardTitle className="text-xl font-black flex items-center gap-2 text-slate-900">
                            <CalendarIcon className="w-6 h-6 text-blue-600" /> 일정 캘린더
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Calendar
                            mode="multiple"
                            selected={selectedDates}
                            onSelect={setSelectedDates}
                            renderDay={(fullDate, isCurrentMonth) => {
                                const isBlocked = unavailabilities.some(u => u.start_date.split('T')[0] <= fullDate && u.end_date.split('T')[0] >= fullDate);
                                const hasBooking = bookings.some(b => b.start_date.split('T')[0] <= fullDate && b.end_date.split('T')[0] >= fullDate);

                                return (
                                    <div className="mt-1 w-full flex flex-col items-center">
                                        {isBlocked && (
                                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 flex items-center gap-0.5" title="휴일/휴무">
                                                <Ban className="w-2 h-2" /> 휴무
                                            </span>
                                        )}
                                        {!isBlocked && hasBooking && (
                                            <span className="text-[9px] font-bold bg-blue-100 text-blue-700 px-1 py-0.5 rounded border border-blue-200 w-[90%] text-center truncate">예약됨</span>
                                        )}
                                        {!isBlocked && !hasBooking && isCurrentMonth && (
                                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded border border-emerald-200 w-[90%] text-center truncate">가능</span>
                                        )}
                                    </div>
                                )
                            }}
                        />
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
