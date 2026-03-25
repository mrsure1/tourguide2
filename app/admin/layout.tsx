import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { applyAdminProfileOverride } from "@/lib/auth/admin";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let profile = null;
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('avatar_url, full_name, role')
            .eq('id', user.id)
            .single();
        profile = data;

        profile = applyAdminProfileOverride(profile, user.email);
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar profile={profile} />

            {/* Main Content Area */}
            <main className="flex-1 w-full">
                {children}
            </main>
        </div>
    );
}
