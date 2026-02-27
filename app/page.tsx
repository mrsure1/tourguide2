import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Search, ShieldCheck, CalendarClock, ChevronRight, UserCheck, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 bg-background relative overflow-hidden bg-mesh min-h-screen">

      {/* Hero Background Image & Gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-[800px] z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=2070&auto=format&fit=crop')" }}
        />
        {/* Dark overlay that fades smoothly into the page's background color at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-background" />
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-[pulse-slow_6s_ease-in-out_infinite] z-0" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-[pulse-slow_8s_ease-in-out_infinite_1s] z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 lg:pt-40 lg:pb-32 relative z-10">

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/40 backdrop-blur-md border border-slate-700/50 text-blue-200 text-sm font-medium mb-8 animate-fade-in-up shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>대한민국 공식 인증 여행 가이드 서비스</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight mb-8 leading-[1.1] drop-shadow-md animate-fade-in-up animation-delay-100">
            당신만의 특별한 여정, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 drop-shadow-sm">
              전문 로컬 가이드
            </span>와 함께
          </h1>

          <p className="text-lg sm:text-xl text-slate-200 mb-12 leading-relaxed max-w-2xl mx-auto font-light drop-shadow animate-fade-in-up animation-delay-200">
            엄격한 인증을 거친 전문가가 당신의 취향과 일정에 맞춰 완벽하고 안전한 1:1 맞춤형 여행을 직접 디자인 해드립니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-300">
            <Link href="/traveler/search" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base rounded-full px-8 py-6 h-auto bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/30 border-0 flex items-center gap-2 group transition-all duration-300 hover:scale-105">
                <Search className="w-5 h-5" />
                <span>여행 가이드 탐색하기</span>
                <ChevronRight className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Button>
            </Link>
            <Link href="/role-selection" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base rounded-full px-8 py-6 h-auto bg-slate-900/40 backdrop-blur-md border border-slate-600/50 text-white hover:bg-slate-800/60 transition-all duration-300">
                시작하기
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 animate-fade-in-up animation-delay-400 opacity-90">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-slate-700 bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden shadow-sm`}>
                  <UserCheck className="w-4 h-4 opacity-50" />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start ml-2">
              <div className="flex items-center text-amber-400 drop-shadow-sm">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-sm font-medium text-slate-200 drop-shadow-sm">누적 매칭 1만 건 이상</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights - Bento Grid */}
        <div className="mt-32 grid md:grid-cols-4 gap-6 animate-fade-in-up animation-delay-500">
          <div className="md:col-span-2 premium-card p-8 lg:p-10 group cursor-default">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">정교한 맞춤 매칭 알고리즘</h3>
            <p className="text-slate-600 leading-relaxed font-light text-lg">
              원하는 동선, 사용 언어, 여행 스타일(식도락, 자연, 역사 등)까지 분석합니다. 데이터 기반의 자체 알고리즘을 통해 당신과 가장 잘 맞는 완벽한 가이드를 1순위로 추천해드립니다.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-rows-2 gap-6">
            <div className="premium-card p-8 flex flex-col justify-center group cursor-default">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">검증된 전문가 퀄리티</h3>
              </div>
              <p className="text-slate-600 leading-relaxed font-light pl-16">
                까다로운 자격 심사와 범죄 이력 조회, 생생한 이용자 리뷰 시스템을 도입하여 단 1%의 타협 없는 최고 등급의 서비스 품질을 상시 보장합니다.
              </p>
            </div>

            <div className="premium-card p-8 flex flex-col justify-center group cursor-default">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:-rotate-12 transition-transform duration-300">
                  <CalendarClock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">유연한 실시간 스케줄링</h3>
              </div>
              <p className="text-slate-600 leading-relaxed font-light pl-16">
                복잡한 상담과 기다림은 잊으세요. 실시간 연동 캘린더 시스템으로 번거로운 조율 과정 없이 투어 날짜와 시간을 단 몇 번의 클릭으로 편리하게 확정할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
