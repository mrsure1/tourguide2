import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const guide_id = formData.get('guide_id') as string;
        const start_date = formData.get('start_date') as string;
        const end_date = formData.get('end_date') as string;
        const total_price = formData.get('total_price') as string;

        console.log('--- Booking Attempt ---');
        console.log('Guide ID:', guide_id);
        console.log('Start Date:', start_date);
        console.log('End Date:', end_date);
        console.log('Total Price:', total_price);

        if (!guide_id || !start_date || !end_date || !total_price) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = await createClient();

        // Get the current user (traveler)
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized. Please login to book a guide.' }, { status: 401 });
        }

        // Explicitly check if the guide exists in guides_detail
        // Safety: Detailed profile must exist to receive bookings
        const { data: guideExists, error: guideCheckError } = await supabase
            .from('guides_detail')
            .select('id')
            .eq('id', guide_id)
            .single();

        if (guideCheckError || !guideExists) {
            console.error('Guide detailed profile not found:', guideCheckError);
            return NextResponse.json({
                error: '예약 실패: 해당 가이드가 아직 상세 프로필을 등록하지 않았거나 승인 대기 중입니다.'
            }, { status: 400 });
        }

        // Insert booking
        const { data, error } = await supabase.from('bookings').insert([
            {
                traveler_id: user.id,
                guide_id: guide_id,
                start_date: new Date(start_date).toISOString(),
                end_date: new Date(end_date).toISOString(),
                status: 'pending',
                total_price: parseFloat(total_price)
            }
        ]).select();

        if (error) {
            console.error('Booking creation error:', error);
            // Handle specific FK error message for the user
            if (error.code === '23503') {
                return NextResponse.json({
                    error: '예약 시스템 제약 조건 에러: 가이드 정보가 유효하지 않습니다. (샘플 가이드는 실제 가입이 필요할 수 있습니다.)'
                }, { status: 400 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Revalidate guide's dashboard and traveler's booking page so they see updates
        revalidatePath('/guide/dashboard');
        revalidatePath('/traveler/bookings');

        return NextResponse.json({ success: true, booking: data[0] });

    } catch (error: any) {
        console.error('API Error /api/bookings/create:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
