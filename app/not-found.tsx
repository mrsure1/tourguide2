import Link from 'next/link';
import { FileQuestion, Home, Search } from 'lucide-react';
import { InfoHeader } from '@/components/layout/InfoHeader';

export default function NotFound() {
  return (
    <>
      <InfoHeader />
      <div className="min-h-[80vh] bg-slate-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 text-center max-w-lg">
          <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
            <FileQuestion className="w-12 h-12 text-slate-400" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Page <br className="sm:hidden" />Not Found
          </h1>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
            The page you&apos;re looking for doesn&apos;t exist<br className="hidden sm:block" />
            or may have been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
            >
              <Home className="w-5 h-5" /> Go to Home
            </Link>
            <Link 
              href="/support" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Search className="w-5 h-5 text-slate-400" /> Help Center
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
