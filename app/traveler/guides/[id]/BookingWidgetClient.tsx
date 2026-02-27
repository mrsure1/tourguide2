"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"

export default function BookingWidgetClient({
    guideId,
    isProfileComplete,
    rateType,
    hourlyRate,
    unavailableDates
}: {
    guideId: string,
    isProfileComplete: boolean,
    rateType: string,
    hourlyRate: number,
    unavailableDates: any[]
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [durationHours, setDurationHours] = useState(4) // Default 4 hours for hourly booking
    const [guests, setGuests] = useState(1)

    // Calculate total price based on rateType
    const start = new Date(startDate)
    const end = new Date(endDate)
    let days = 0
    if (startDate && endDate && end >= start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    const totalPrice = rateType === 'hourly'
        ? hourlyRate * durationHours * guests
        : hourlyRate * days * guests;

    const handleBooking = async () => {
        if (!isProfileComplete) {
            alert("이 가이드는 아직 상세 정보를 등록하지 않았습니다.");
            return;
        }
        if (!startDate || !endDate) {
            alert("시작일과 종료일을 선택해주세요.")
            return
        }

        startTransition(async () => {
            const formData = new FormData()
            formData.append('guide_id', guideId)
            formData.append('start_date', startDate)
            formData.append('end_date', endDate)
            formData.append('total_price', totalPrice.toString())

            const res = await fetch('/api/bookings/create', {
                method: 'POST',
                body: formData
            })

            if (res.ok) {
                alert("예약 신청이 완료되었습니다!")
                router.push('/traveler/bookings')
            } else {
                const data = await res.json()
                alert(`예약 실패: ${data.error}`)
            }
        })
    }

    return (
        <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg">일정 매칭 & 예약하기</CardTitle>
                <p className="text-sm text-slate-500 mt-1 font-light">투어 일정을 선택해 주세요.</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">

                <div className={`space-y-4 ${!isProfileComplete ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">시작일</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none"
                                    value={startDate}
                                    onChange={e => {
                                        setStartDate(e.target.value);
                                        if (!endDate || e.target.value > endDate) setEndDate(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">종료일</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all outline-none"
                                    value={endDate}
                                    min={startDate}
                                    onChange={e => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {rateType === 'hourly' && (
                        <div className="space-y-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-slate-700">이용 시간 (시간)</label>
                                <span className="text-accent font-bold">{durationHours}시간</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="12"
                                value={durationHours}
                                onChange={(e) => setDurationHours(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
                            />
                            <p className="text-[10px] text-slate-500">가이드와 만날 시간을 설정해주세요.</p>
                        </div>
                    )}
                </div>

                {!isProfileComplete && (
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-center">
                        <p className="text-xs font-bold text-amber-700">가이드가 아직 프로필을 작성 중입니다.</p>
                        <p className="text-[10px] text-amber-600 mt-1">상세 정보가 등록된 후 예약이 가능합니다.</p>
                    </div>
                )}

                <div className={`space-y-2 border-b border-slate-100 pb-6 ${!isProfileComplete ? 'opacity-50 pointer-events-none' : ''}`}>
                    <label className="block text-sm font-bold text-slate-700">참여 인원</label>
                    <div className="flex items-center justify-between border border-slate-200 rounded-xl p-2 bg-white shadow-sm">
                        <button
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center hover:bg-slate-50 text-slate-600 border border-slate-100 transition-colors"
                        >-</button>
                        <span className="text-sm font-bold text-slate-900">{guests} 명</span>
                        <button
                            onClick={() => setGuests(guests + 1)}
                            className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center hover:bg-slate-50 text-slate-600 border border-slate-100 transition-colors"
                        >+</button>
                    </div>
                </div>

                <div className={`bg-slate-900 rounded-2xl p-5 text-white shadow-lg space-y-3 ${!isProfileComplete ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between items-center opacity-80">
                        <span className="text-xs font-medium">기준 요금 ({rateType === 'hourly' ? '시간당' : '일일'})</span>
                        <span className="text-xs font-bold font-mono">₩ {hourlyRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end border-t border-white/10 pt-3">
                        <div>
                            <p className="text-[10px] uppercase tracking-tighter opacity-60 font-bold">Estimated Total</p>
                            <p className="text-sm font-medium">예상 총 금액</p>
                        </div>
                        <p className="text-2xl font-black">₩ {totalPrice > 0 ? totalPrice.toLocaleString() : 0}</p>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Button
                        className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-white font-bold text-lg shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                        onClick={handleBooking}
                        disabled={isPending || !startDate || !endDate || !isProfileComplete}
                    >
                        {isPending ? "처리 중..." : !isProfileComplete ? "프로필 준비 중" : "예약 신청하기"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
