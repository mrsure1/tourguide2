"use client";

import { useEffect } from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { InfoHeader } from "@/components/layout/InfoHeader";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <>
      <InfoHeader />
      <div className="min-h-[80vh] bg-slate-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 text-center max-w-lg">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-8 animate-pulse">
            <AlertOctagon className="w-12 h-12 text-rose-500" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Something <br className="sm:hidden" />Went Wrong
          </h1>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
            We&apos;re sorry for the inconvenience.<br className="hidden sm:block" />
            Please try again or contact support if the issue persists.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => reset()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
            >
              <RotateCcw className="w-5 h-5" /> Try Again
            </button>
            <Link 
              href="/" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Home className="w-5 h-5 text-slate-400" /> Go to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
