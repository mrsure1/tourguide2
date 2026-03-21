"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Calendar,
  LayoutDashboard,
  Map,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { HeaderActions } from "@/components/layout/HeaderActions";
import { useI18n } from "@/components/providers/LocaleProvider";
import { localizePath } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

interface NavbarProps {
  profile: any;
}

type NavItem = {
  href: string;
  label: string;
  icon: typeof Map;
};

export function Navbar({ profile }: NavbarProps) {
  const pathname = usePathname();
  const { locale } = useI18n();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isGuide = profile?.role === "guide" || profile?.role === "admin";
  const isKorean = locale === "ko";
  const withLocale = (href: string) => localizePath(locale, href);

  const travelerLinks: NavItem[] = isKorean
    ? [
        { href: withLocale("/"), label: "가이드/투어 탐색", icon: Map },
        { href: withLocale("/traveler/bookings"), label: "내 예약", icon: Calendar },
        { href: withLocale("/traveler/profile"), label: "마이페이지", icon: User },
      ]
    : [
        { href: withLocale("/"), label: "Explore Guides & Tours", icon: Map },
        { href: withLocale("/traveler/bookings"), label: "My bookings", icon: Calendar },
        { href: withLocale("/traveler/profile"), label: "My page", icon: User },
      ];

  const guideLinks: NavItem[] = isKorean
    ? [
        { href: withLocale("/"), label: "가이드/투어 탐색", icon: Map },
        { href: withLocale("/guide/tours"), label: "내 상품 관리", icon: ShoppingBag },
        { href: withLocale("/guide/dashboard"), label: "가이드 대시보드", icon: LayoutDashboard },
        { href: withLocale("/guide/profile"), label: "마이페이지", icon: User },
        ...(profile?.role === "admin"
          ? [{ href: withLocale("/admin/dashboard"), label: "관리자 대시보드", icon: Search }]
          : []),
      ]
    : [
        { href: withLocale("/"), label: "Explore Guides & Tours", icon: Map },
        { href: withLocale("/guide/tours"), label: "My tours", icon: ShoppingBag },
        { href: withLocale("/guide/dashboard"), label: "Guide dashboard", icon: LayoutDashboard },
        { href: withLocale("/guide/profile"), label: "My page", icon: User },
        ...(profile?.role === "admin"
          ? [{ href: withLocale("/admin/dashboard"), label: "Admin dashboard", icon: Search }]
          : []),
      ];

  const links = isGuide ? guideLinks : travelerLinks;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-slate-200/60 bg-white/90 py-2 shadow-sm backdrop-blur-xl"
          : "border-transparent bg-white py-4",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="shrink-0">
          <BrandLogo href={withLocale("/")} size="sm" tone="dark" showTagline={false} />
        </div>

        <nav className="mx-4 hidden items-center gap-1 rounded-2xl border border-slate-200/50 bg-slate-100/50 p-1 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition-all",
                  isActive
                    ? "bg-white text-accent shadow-sm ring-1 ring-slate-100"
                    : "text-slate-500 hover:bg-white/50 hover:text-slate-900",
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-accent" : "text-slate-400")} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <HeaderActions variant="dark" />

          <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

          <Link href={withLocale(isGuide ? "/guide/profile" : "/traveler/profile")} className="shrink-0">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-md transition-all hover:ring-2 ring-accent cursor-pointer">
              <img
                src={
                  profile?.avatar_url ||
                  `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(profile?.full_name || "User")}`
                }
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </Link>

          <LanguageSwitcher className="hidden md:inline-flex text-[11px] uppercase tracking-wider" />

          <button
            className="rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="absolute left-0 top-full w-full border-b border-slate-200 bg-white shadow-2xl animate-in slide-in-from-top duration-300 md:hidden">
          <nav className="space-y-2 p-4">
            {links.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl p-4 text-base font-bold transition-all",
                    isActive ? "bg-blue-50 text-accent" : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-accent" : "text-slate-400")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
