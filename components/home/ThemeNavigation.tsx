"use client";

import { Coffee, Camera, Landmark, Zap, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/LocaleProvider";

export function ThemeNavigation() {
  const { messages } = useI18n();
  const landing = messages.landing;

  const themes = [
    { name: landing.sections.themeFood, icon: Coffee, color: "bg-orange-100 text-orange-600" },
    { name: landing.sections.themePhoto, icon: Camera, color: "bg-purple-100 text-purple-600" },
    { name: landing.sections.themeHistory, icon: Landmark, color: "bg-amber-100 text-amber-600" },
    { name: landing.sections.themeNight, icon: Zap, color: "bg-blue-100 text-blue-600" },
    { name: landing.sections.themeLocal, icon: MapIcon, color: "bg-emerald-100 text-emerald-600" },
  ];

  return (
    <div className="flex overflow-x-auto pb-4 mb-10 gap-6 scrollbar-none justify-center">
      {themes.map((theme, i) => (
        <button key={i} className="flex flex-col items-center gap-2 group shrink-0 transition-transform active:scale-95">
          <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg shadow-sm border border-white", theme.color)}>
            <theme.icon className="w-7 h-7" />
          </div>
          <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{theme.name}</span>
        </button>
      ))}
    </div>
  );
}
