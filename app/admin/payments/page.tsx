import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PaymentsClient from "./PaymentsClient";

export default async function AdminPaymentsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Role 확인
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        redirect('/');
    }

    // 모든 예약/결제 내역 가져오기 (여행자, 가이드 정보 포함)
    // Supabase에서 다중 조인이 복잡할 수 있으므로, profiles를 두 번 참조해야 함
    const { data: rawBookings, error } = await supabase
        .from('bookings')
        .select(`
            *,
            traveler:traveler_id (full_name, email),
            guide:guide_id (full_name, email)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching payments history:", error);
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
            <PaymentsClient initialPayments={rawBookings || []} />
        </div>
    );
}
