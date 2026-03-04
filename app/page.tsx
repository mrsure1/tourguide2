import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Search, ShieldCheck, CalendarClock, ChevronRight, UserCheck, Star, Compass, Map, ArrowDown, Users, Zap, MapPin } from "lucide-react";
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
            <Users className="w-4 h-4 text-blue-300" />
            <span>Premium Local Guide Marketplace in Korea</span>
          </div>

          <h1 className="font-black tracking-tighter mb-8 leading-[1] drop-shadow-2xl animate-fade-in-up animation-delay-100">
            <span className="block text-4xl sm:text-7xl lg:text-9xl text-white mb-2 uppercase italic">
              Unlock Korea,
            </span>
            <span className="block text-3xl sm:text-6xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 pb-2">
              Expertly Yours.
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-100 mb-12 leading-relaxed max-w-3xl mx-auto font-medium drop-shadow-lg animate-fade-in-up animation-delay-200 opacity-90 break-keep [hyphens:none]">
            실시간 로컬 가이드 매칭으로 당신만의 한국 여행을 완성하세요. <br className="hidden sm:block" />
            <span className="inline-block whitespace-nowrap text-blue-200 font-bold">Connect with Top-rated Local Experts</span> for an unforgettable <span className="inline-block whitespace-nowrap text-blue-200 font-bold">K-experience.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-in-up animation-delay-300">
            <a href="#onboarding" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg rounded-full px-12 py-7 h-auto bg-white text-slate-950 hover:bg-slate-100 shadow-[0_20px_50px_rgba(255,255,255,0.2)] border-0 flex items-center justify-center gap-3 group transition-all duration-300 hover:scale-105 active:scale-95 font-bold">
                지금 바로 시작하기
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </Button>
            </a>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-8 animate-fade-in-up animation-delay-400">
            <div className="flex items-center gap-4 whitespace-nowrap bg-slate-900/40 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl shadow-xl hover:bg-slate-900/50 transition-colors">
              <div className="p-3 rounded-2xl bg-blue-500/20 border border-blue-400/30">
                <Users className="w-8 h-8 text-blue-300" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-white leading-none">1,200+</p>
                <p className="text-sm text-blue-200 font-medium whitespace-nowrap">Verified Guides</p>
              </div>
            </div>

            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/20"></div>

            <div className="flex items-center gap-4 whitespace-nowrap bg-slate-900/40 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl shadow-xl hover:bg-slate-900/50 transition-colors">
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400/30">
                <Zap className="w-8 h-8 text-amber-300" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-white leading-none">15k+</p>
                <p className="text-sm text-blue-200 font-medium whitespace-nowrap">Successful Matches</p>
              </div>
            </div>

            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/20"></div>

            <div className="flex items-center gap-4 whitespace-nowrap bg-slate-900/40 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl shadow-xl hover:bg-slate-900/50 transition-colors">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
                <MapPin className="w-8 h-8 text-emerald-300" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-white leading-none">32</p>
                <p className="text-sm text-blue-200 font-medium whitespace-nowrap">Korean Cities</p>
              </div>
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
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight break-keep">가이드와 여행자를 잇는 최고의 플랫폼</h2>
            <p className="text-slate-500 text-lg sm:text-xl font-light break-keep">
              {profile ? `${profile.full_name}님, 어떤 파트너를 찾으시겠어요?` : "대한민국 No.1 매칭 플랫폼, 가점되는 당신의 자리를 선택하세요."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Traveler Card */}
            {user ? (
              <Link href={profile ? "/traveler/home" : "/signup?role=traveler"} className="group relative">
                <div className="h-full premium-card p-10 lg:p-14 flex flex-col items-center text-center transition-all duration-500 border-2 border-transparent hover:border-blue-400 hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.2)] bg-white/90 backdrop-blur-xl group-hover:-translate-y-2">
                  <div className="w-24 h-24 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Compass className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight whitespace-nowrap">가이드 찾기 (여행자)</h3>
                  <p className="text-slate-600 text-lg font-light leading-relaxed mb-8 break-keep">
                    내 취향에 딱 맞는 로컬 전문가를 직접 탐색하고 <br className="hidden lg:block" /> 일대일 매칭을 통해 나만의 투어를 완성하세요.
                  </p>
                  <div className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-base flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors duration-300 shadow-lg whitespace-nowrap">
                    {profile?.role === 'guide' || profile?.role === 'admin' ? '여행자 모드로 매칭하기' : (profile ? '가이드 리스트 투기' : '여행자 프로필 설정하기')} <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/signup?role=traveler" className="group relative">
                <div className="h-full premium-card p-10 lg:p-14 flex flex-col items-center text-center transition-all duration-500 border-2 border-transparent hover:border-blue-400 hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.2)] bg-white/90 backdrop-blur-xl group-hover:-translate-y-2">
                  <div className="w-24 h-24 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Compass className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight whitespace-nowrap">가이드 찾기 (여행자)</h3>
                  <p className="text-slate-600 text-lg font-light leading-relaxed mb-8 break-keep">
                    내 취향에 딱 맞는 로컬 전문가를 직접 탐색하고 <br className="hidden lg:block" /> 일대일 매칭을 통해 나만의 투어를 완성하세요.
                  </p>
                  <div className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-base flex items-center justify-center gap-2 group-hover:bg-blue-600 transition-colors duration-300 shadow-lg whitespace-nowrap">
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
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight whitespace-nowrap">가이드로 활동하기</h3>
                  <p className="text-slate-600 text-lg font-light leading-relaxed mb-8 break-keep">
                    나만의 유니크한 투어 상품을 등록하고 <br className="hidden lg:block" /> 전 세계 여행자들과 만나 특별한 경험을 공유해 보세요.
                  </p>
                  <div className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-base flex items-center justify-center gap-2 group-hover:bg-emerald-600 transition-colors duration-300 shadow-lg whitespace-nowrap">
                    {profile?.role === 'guide' || profile?.role === 'admin' ? '가이드 센터 바로가기' : '신규 가이드로 등록하기'} <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/signup?role=guide" className="group relative">
                <div className="h-full premium-card p-10 lg:p-14 flex flex-col items-center text-center transition-all duration-500 border-2 border-transparent hover:border-emerald-400 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.2)] bg-white/90 backdrop-blur-xl group-hover:-translate-y-2">
                  <div className="w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                    <Map className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight whitespace-nowrap">가이드로 활동하기</h3>
                  <p className="text-slate-600 text-lg font-light leading-relaxed mb-8 break-keep">
                    나만의 유니크한 투어 상품을 등록하고 <br className="hidden lg:block" /> 전 세계 여행자들과 만나 특별한 경험을 공유해 보세요.
                  </p>
                  <div className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-base flex items-center justify-center gap-2 group-hover:bg-emerald-600 transition-colors duration-300 shadow-lg whitespace-nowrap">
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
