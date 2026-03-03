import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();

    if (!session || error) {
        redirect('/login');
    }

    // Role 재확인 (보안)
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        redirect('/'); // 권한이 없으면 메인으로
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-2">시스템 전반을 관리하는 관리자용 페이지입니다.</p>
                    </div>
                </header>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">환영합니다, {session.user.email}님!</h2>
                    <p className="text-gray-600 mb-6">
                        현재 관리자 계정으로 접속하셨습니다.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-blue-50 text-blue-900 rounded-xl border border-blue-100 flex flex-col justify-center items-center text-center">
                            <h3 className="text-lg font-bold">사용자 관리</h3>
                            <p className="text-sm mt-2 opacity-80">개발 예정</p>
                        </div>
                        <div className="p-6 bg-purple-50 text-purple-900 rounded-xl border border-purple-100 flex flex-col justify-center items-center text-center">
                            <h3 className="text-lg font-bold">가이드 승인</h3>
                            <p className="text-sm mt-2 opacity-80">개발 예정</p>
                        </div>
                        <div className="p-6 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-100 flex flex-col justify-center items-center text-center">
                            <h3 className="text-lg font-bold">결제 내역</h3>
                            <p className="text-sm mt-2 opacity-80">개발 예정</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
