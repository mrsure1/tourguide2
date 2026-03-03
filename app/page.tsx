import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Search, ShieldCheck, CalendarClock, ChevronRight, UserCheck, Star, Compass, Map, ArrowDown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { switchRole } from "@/app/signup/actions";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    profile = data;
  }

  return (
    <main className="flex-1 bg-background relative overflow-hidden bg-mesh min-h-screen">
      {/* ... (Hero Section 동일 유지) ... */}
      <div className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        {/* Hero Background Image & Gradient overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 scale-105 animate-[ken-burns_20s_ease-in-out_infinite]"
            style={{ backgroundImage: "url('/hero-korea.png')" }}
          />
          {/* Multi-layered premium overlay */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-slate-900/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-blue-100 text-sm font-semibold mb-8 animate-fade-in-up shadow-2xl">
            <ShieldCheck className="w-4 h-4 text-blue-300" />
            <span>K-컬처와 함께하는 대한민국 프리미엄 가이드 매칭</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-[1.05] drop-shadow-2xl animate-fade-in-up animation-delay-100">
            K-Tour의 시작, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-200 to-white drop-shadow-sm">
              우리가 찾는 한국
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-100 mb-12 leading-relaxed max-w-3xl mx-auto font-medium drop-shadow-lg animate-fade-in-up animation-delay-200 opacity-90">
            가려진 명소부터 트렌디한 핫플레이스까지, <br className="hidden sm:block" />
            검증된 가이드와 함께 당신만의 특별한 한국 여행을 디자인하세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up animation-delay-300">
            <a href="#onboarding" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg rounded-full px-12 py-7 h-auto bg-white text-slate-950 hover:bg-slate-100 shadow-[0_20px_50px_rgba(255,255,255,0.2)] border-0 flex items-center justify-center gap-3 group transition-all duration-300 hover:scale-105 active:scale-95 font-bold">
                지금 바로 시작하기
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </Button>
            </a>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 animate-fade-in-up animation-delay-400">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white overflow-hidden shadow-xl">
                  <UserCheck className="w-5 h-5 opacity-70" />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center text-yellow-400 drop-shadow-md">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <span className="text-sm font-bold text-white drop-shadow-md">전 세계 1만명 이상이 선택한 가이드 서비스</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-floating hidden lg:block">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center p-1">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-scrolldown" />
          </div>
        </div>
      </div>

      {/* Onboarding Section - Intelligent Role Selection */}
      <section id="onboarding" className="py-24 lg:py-40 relative z-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">어떻게 이용하시겠습니까?</h2>
            <p className="text-slate-500 text-lg sm:text-xl font-light">
              {profile ? `${profile.full_name}님, 오늘 어떤 모드로 활동하시겠어요?` : "가슴 뛰는 여행의 첫 걸음, 본인의 역할을 선택해주세요."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Traveler Card */}
            {user ? (
              <Link href="/traveler/home" className="group relative">
                <div className="h-full premium-card p-10 lg:p-14 flex flex-col items-center text-center transition-all duration-500 border-2 border-transparent hover:border-blue-400 hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.2)] bg-white/90 backdrop-blur-xl group-hover:-translate-y-2">
                  <div className="w-24 h-24 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Compass className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">여행자</h3>
                  <p className="text-slate-600 text-lg font-light leading-relaxed mb-8">
                    내 취향에 딱 맞는 로컬 전문가를 탐색하고 <br className="hidden lg:block" /> 1:1 맞춤형 고퀄리티 투어를 즐겨보세요.
                  </p>
                  <div className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-base flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors duration-300 shadow-lg">
                    {profile?.role === 'guide' || profile?.role === 'admin' ? '여행자 모드 둘러보기' : '여행자 홈으로 가기'} <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/signup?role=traveler" className="group relative">
                <div className="h-full premium-card p-10 lg:p-14 flex flex-col items-center text-center transition-all duration-500 border-2 border-transparent hover:border-blue-400 hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.2)] bg-white/90 backdrop-blur-xl group-hover:-translate-y-2">
                  <div className="w-24 h-24 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Compass className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">여행자</h3>
                  <p className="text-slate-600 text-lg font-light leading-relaxed mb-8">
                    내 취향에 딱 맞는 로컬 전문가를 탐색하고 <br className="hidden lg:block" /> 1:1 맞춤형 고퀄리티 투어를 즐겨보세요.
                  </p>
                  <div className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-base flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors duration-300 shadow-lg">
                    여행자로 시작하기 <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            )}

            {/* Guide Card */}
            {user ? (
              <Link href={profile?.role === 'guide' || profile?.role === 'admin' ? '/guide/dashboard' : '/signup?role=guide'} className="group relative">
                <div className="h-full premium-card p-10 lg:p-14 flex flex-col items-center text-center transition-all duration-500 border-2 border-transparent hover:border-emerald-400 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.2)] bg-white/90 backdrop-blur-xl group-hover:-translate-y-2">
                  <div className="w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                    <Map className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">가이드</h3>
                  <p className="text-slate-600 text-lg font-light leading-relaxed mb-8">
                    나만의 유니크한 투어를 전 세계 여행자에게 <br className="hidden lg:block" /> 공유하고 전문적인 수익을 창출하세요.
                  </p>
                  <div className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-base flex items-center justify-center gap-2 group-hover:bg-emerald-600 transition-colors duration-300 shadow-lg">
                    {profile?.role === 'guide' || profile?.role === 'admin' ? '가이드 대시보드로 가기' : '새 가이드 계정 만들기'} <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/signup?role=guide" className="group relative">
                <div className="h-full premium-card p-10 lg:p-14 flex flex-col items-center text-center transition-all duration-500 border-2 border-transparent hover:border-emerald-400 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.2)] bg-white/90 backdrop-blur-xl group-hover:-translate-y-2">
                  <div className="w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                    <Map className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">가이드</h3>
                  <p className="text-slate-600 text-lg font-light leading-relaxed mb-8">
                    나만의 유니크한 투어를 전 세계 여행자에게 <br className="hidden lg:block" /> 공유하고 전문적인 수익을 창출하세요.
                  </p>
                  <div className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-base flex items-center justify-center gap-2 group-hover:bg-emerald-600 transition-colors duration-300 shadow-lg">
                    가이드로 시작하기 <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            )}
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-500 font-medium">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 underline underline-offset-4 decoration-2">안전하게 로그인하기</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights - Bento Grid */}
      <section className="py-24 bg-white/50 backdrop-blur-sm px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-2 premium-card p-10 group cursor-default shadow-sm border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-5 tracking-tight">정교한 맞춤 매칭 알고리즘</h3>
              <p className="text-slate-600 leading-relaxed font-light text-xl">
                동선, 언어, 스타일까지 분석하여 가장 잘 맞는 가이드를 실시간으로 추천해 드립니다.
              </p>
            </div>

            <div className="md:col-span-2 grid grid-rows-2 gap-6">
              <div className="premium-card p-8 flex flex-col justify-center group cursor-default shadow-sm border-slate-100">
                <div className="flex items-center gap-5 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">검증된 퀄리티</h3>
                </div>
                <p className="text-slate-600 leading-relaxed font-light text-lg pl-19">
                  엄격한 자격 심사와 리뷰 시스템으로 믿을 수 있는 서비스를 보장합니다.
                </p>
              </div>

              <div className="premium-card p-8 flex flex-col justify-center group cursor-default shadow-sm border-slate-100">
                <div className="flex items-center gap-5 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:-rotate-12 transition-transform duration-300 shadow-sm">
                    <CalendarClock className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">실시간 스케줄링</h3>
                </div>
                <p className="text-slate-600 leading-relaxed font-light text-lg pl-19">
                  번거로운 조율 없이 캘린더 연동으로 단 몇 번의 클릭으로 예약을 확정하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
