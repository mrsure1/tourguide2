import Link from "next/link";
import { Compass, Map } from "lucide-react";

export default function RoleSelection() {
    return (
        <main className="flex-1 bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)] relative overflow-hidden bg-mesh">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[pulse-slow_6s_ease-in-out_infinite]" />
            <div className="absolute bottom-0 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-[pulse-slow_8s_ease-in-out_infinite_1s]" />

            <div className="sm:mx-auto sm:w-full sm:max-w-xl animate-fade-in-up relative z-10">
                <h2 className="mt-6 text-center text-4xl font-extrabold text-slate-900 tracking-tight">
                    어떻게 이용하시겠습니까?
                </h2>
                <p className="mt-4 text-center text-lg text-slate-600 font-light">
                    Korea Guide Match에서 원하는 계정의 유형을 선택해주세요.
                </p>
            </div>

            <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-3xl animate-fade-in-up animation-delay-200 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-0">
                    <Link href="/signup?role=traveler" className="block outline-none group">
                        <div className="h-full premium-card p-10 flex flex-col items-center text-center transition-all duration-400 border-2 border-transparent group-hover:border-blue-300 group-focus:ring-2 group-focus:ring-accent group-focus:ring-offset-2 cursor-pointer bg-white/80 backdrop-blur-md">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                                <Compass className="w-10 h-10 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">여행자 (Traveler)</h3>
                            <p className="text-slate-600 font-light leading-relaxed">
                                내 취향에 딱 맞는 로컬 전문가를 직접 탐색하고 투어를 의뢰하고 싶습니다.
                            </p>
                            <div className="mt-6 text-blue-600 font-medium text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                여행자로 시작하기 &rarr;
                            </div>
                        </div>
                    </Link>

                    <Link href="/signup?role=guide" className="block outline-none group">
                        <div className="h-full premium-card p-10 flex flex-col items-center text-center transition-all duration-400 border-2 border-transparent group-hover:border-emerald-300 group-focus:ring-2 group-focus:ring-emerald-500 group-focus:ring-offset-2 cursor-pointer bg-white/80 backdrop-blur-md">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                                <Map className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">가이드 (Guide)</h3>
                            <p className="text-slate-600 font-light leading-relaxed">
                                매력적인 나만의 투어 코스를 설계하고, 전 세계의 훌륭한 여행자들을 안내하고 싶습니다.
                            </p>
                            <div className="mt-6 text-emerald-600 font-medium text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                가이드로 시작하기 &rarr;
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="mt-10 text-center text-sm text-slate-500 font-light">
                    이미 계정이 있으신가요?{" "}
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                        안전하게 로그인하기
                    </Link>
                </div>
            </div>
        </main>
    );
}
