import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UsersClient from "./UsersClient";
import { isAdminProfile } from "@/lib/auth/admin";

export default async function AdminUsersPage() {
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

    if (!isAdminProfile(profile, user.email)) {
        redirect('/');
    }

    // 모든 사용자 정보 가져오기
    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });

    if (error) {
        console.error("Error fetching users:", error);
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
            <UsersClient initialUsers={users || []} />
        </div>
    );
}
