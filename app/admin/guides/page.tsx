import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import GuidesClient from "./GuidesClient";

export default async function AdminGuidesPage() {
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

    // 모든 가이드 상세 정보와 프로필 조인하여 가져오기
    const { data: guides, error } = await supabase
        .from('profiles')
        .select(`
            id,
            full_name,
            email,
            avatar_url,
            guides_detail (
                id,
                location,
                languages,
                bio,
                hourly_rate,
                is_verified,
                created_at
            )
        `)
        .eq('role', 'guide');

    if (error) {
        console.error("Error fetching guides for approval:", error);
    }

    // 가이드 데이터 가공
    const processedGuides = (guides || []).map(g => {
        const detail = Array.isArray(g.guides_detail) ? g.guides_detail[0] : g.guides_detail;
        return {
            ...g,
            guides_detail: detail || null
        };
    }).filter(g => g.guides_detail !== null);

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
            <GuidesClient initialGuides={processedGuides as any[]} />
        </div>
    );
}
