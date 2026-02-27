import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GuideNav } from "@/components/layout/GuideNav";

export default function GuideLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tighter text-slate-900">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span>Guide<span className="text-accent">Match</span></span>
                    </Link>
                </div>

                <GuideNav />

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                            {/* Dummy Avatar */}
                            <img src="https://i.pravatar.cc/150?u=g1" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">김철수 가이드</p>
                            <p className="text-xs text-slate-500 truncate">서울 / 역사·도보</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:hidden">
                    <div className="font-bold text-lg">GuideMatch</div>
                    <Button variant="ghost" size="sm" className="p-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </Button>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
