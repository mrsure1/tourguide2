import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";

export default async function TravelerLayout({
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

        if (profile && user.email) {
            const adminEmails = (process.env.ADMIN_EMAILS || '')
                .split(',')
                .map((email) => email.trim().toLowerCase())
                .filter(Boolean);
            if (adminEmails.includes(user.email.toLowerCase())) {
                (profile as any).isAdmin = true;
            }
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Navbar profile={profile} />

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto py-4">
                {children}
            </main>
        </div>
    );
}
