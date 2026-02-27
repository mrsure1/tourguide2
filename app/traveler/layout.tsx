import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { NotificationPopup } from "@/components/notification/NotificationPopup";
import { TravelerNav } from "@/components/layout/TravelerNav";

export default function TravelerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/traveler/home" className="flex items-center gap-2 text-xl font-extrabold tracking-tighter text-slate-900">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span>Guide<span className="text-accent">Match</span></span>
                    </Link>

                    <TravelerNav />

                    <div className="flex items-center gap-4">
                        <div className="md:hidden">
                            <NotificationPopup />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-accent transition-all">
                            <img src="https://i.pravatar.cc/150?u=u1" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <Button variant="ghost" size="sm" className="md:hidden p-2">
                            <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
