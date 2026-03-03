import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * 예약 날짜 중복 체크 API
 * 요청자가 선택한 날짜가 이미 자신의 다른 예약(pending, confirmed)과 겹치는지 확인
 */
export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    try {
        const { startDate, endDate } = await req.json();

        if (!startDate || !endDate) {
            return NextResponse.json({ error: "날짜 정보가 부족합니다." }, { status: 400 });
        }

        // 1. 사용자의 활성 예약(pending, confirmed) 가져오기
        const { data: existingBookings, error } = await supabase
            .from('bookings')
            .select('start_date, end_date, profiles!guide_id(full_name)')
            .eq('traveler_id', user.id)
            .in('status', ['pending', 'confirmed']);

        if (error) throw error;

        // 2. 날짜 겹침 판단 로직
        // (StartA <= EndB) and (EndA >= StartB)
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);

        const overlapping = existingBookings?.filter(booking => {
            const bStart = new Date(booking.start_date);
            const bEnd = new Date(booking.end_date);
            return (newStart <= bEnd && newEnd >= bStart);
        });

        if (overlapping && overlapping.length > 0) {
            const conflictNames = overlapping.map(b => (b.profiles as any)?.full_name).filter(Boolean).join(', ');
            return NextResponse.json({
                isOverlap: true,
                message: `선택하신 일정 중 이미 다른 예약(${conflictNames})이 있습니다. 그래도 진행하시겠습니까?`,
                conflicts: overlapping
            });
        }

        return NextResponse.json({ isOverlap: false });

    } catch (error: any) {
        console.error("Overlap check error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
