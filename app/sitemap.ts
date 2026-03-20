import type { MetadataRoute } from "next";
import { DEFAULT_LOCALE, type Locale, SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routing";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const publicRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/login", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/signup", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/role-selection", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/support", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/terms", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/archive", priority: 0.4, changeFrequency: "monthly" as const },
  ];

  return SUPPORTED_LOCALES.flatMap((locale) =>
    publicRoutes.map((route) => ({
      url: `${siteUrl}${localizePath(locale as Locale, route.path)}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: locale === DEFAULT_LOCALE && route.path === "/" ? route.priority : route.priority - 0.05,
    })),
  );
}
