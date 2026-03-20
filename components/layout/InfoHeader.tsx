"use client";

import { BrandLogo } from "@/components/brand/BrandLogo";
import { useI18n } from "@/components/providers/LocaleProvider";
import { localizePath } from "@/lib/i18n/routing";

export function InfoHeader() {
  const { locale } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <BrandLogo href={localizePath(locale, "/")} size="sm" tone="dark" showTagline={false} />
      </div>
    </header>
  );
}
