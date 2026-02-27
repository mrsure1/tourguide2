"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function GuideNav() {
    const pathname = usePathname();
    const navLinks = [
        {
            href: "/guide/dashboard", label: "대시보드", icon: (
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            href: "/guide/schedule", label: "일정 관리", icon: (
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            href: "/guide/profile", label: "가이드 프로필", icon: (
                <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ), borderTop: true
        }
    ];

    return (
        <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
                {navLinks.map((link) => {
                    const isActive = pathname.startsWith(link.href);
                    return (
                        <li key={link.href} className={link.borderTop ? "pt-4 mt-4 border-t border-slate-100" : ""}>
                            <Link
                                href={link.href}
                                className={`flex items-center px-3 py-2.5 rounded-lg font-medium group transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50 hover:text-accent'}`}
                            >
                                <div className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-accent'}>
                                    {link.icon}
                                </div>
                                {link.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
