"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NotificationPopup } from "@/components/notification/NotificationPopup";

export function TravelerNav() {
    const pathname = usePathname();
    const navLinks = [
        { href: "/traveler/search", label: "가이드 탐색" },
        { href: "/traveler/bookings", label: "내 여행 (예약)" },
        { href: "/messages", label: "메시지" },
    ];

    return (
        <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${isActive ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'}`}
                    >
                        {link.label}
                    </Link>
                );
            })}
            <div className="ml-2 pl-2 border-l border-slate-200">
                <NotificationPopup />
            </div>
        </nav>
    );
}
