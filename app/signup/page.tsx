"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { useState, useEffect, Suspense } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

function SignupForm() {
    const searchParams = useSearchParams();
    const [role, setRole] = useState<string>("traveler");

    const handleOAuthSignup = async (provider: 'google' | 'kakao') => {
        const supabase = getSupabaseClient();
        if (supabase) {
            await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        role: role // Pass role to custom callback if needed
                    }
                }
            });
        } else {
            alert('Supabase client is not initialized. Check your environment variables.');
        }
    };

    useEffect(() => {
        const roleParam = searchParams.get("role");
        if (roleParam === "guide" || roleParam === "traveler") {
            setRole(roleParam);
        }
    }, [searchParams]);

    return (
        <main className="flex-1 bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)] relative overflow-hidden bg-mesh">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[pulse-slow_7s_ease-in-out_infinite]" />
            <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[pulse-slow_9s_ease-in-out_infinite_1s]" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up relative z-10">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
                    계정 만들기
                </h2>
                <div className="mt-3 flex justify-center items-center gap-2">
                    <span className="text-sm text-slate-600 font-light">
                        현재 선택된 역할:
                    </span>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${role === "guide"
                        ? "bg-indigo-50 text-indigo-700 ring-indigo-600/20"
                        : "bg-blue-50 text-blue-700 ring-blue-600/20"
                        }`}>
                        {role === "guide" ? "가이드" : "여행자"}
                    </span>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up animation-delay-200 relative z-10">
                <Card className="premium-card bg-white/80 backdrop-blur-xl border-white/50 shadow-xl overflow-hidden">
                    <CardContent className="pt-8 pb-10 px-6 sm:px-10">
                        <form className="space-y-5" action="#" method="POST">
                            <div>
                                <Input
                                    label="이름"
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    placeholder="홍길동"
                                    className="bg-white/50 focus:bg-white transition-colors"
                                />
                            </div>

                            <div>
                                <Input
                                    label="이메일 주소"
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="your@email.com"
                                    className="bg-white/50 focus:bg-white transition-colors"
                                />
                            </div>

                            <div>
                                <Input
                                    label="비밀번호"
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    placeholder="••••••••"
                                    className="bg-white/50 focus:bg-white transition-colors"
                                />
                            </div>

                            <div>
                                <Input
                                    label="비밀번호 확인"
                                    id="password-confirm"
                                    name="password-confirm"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    placeholder="••••••••"
                                    className="bg-white/50 focus:bg-white transition-colors"
                                />
                            </div>

                            <div className="flex items-center mt-4">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 transition-colors cursor-pointer"
                                />
                                <label htmlFor="terms" className="ml-2 block text-sm text-slate-700 cursor-pointer">
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">이용약관</a> 및{" "}
                                    <a href="#" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">개인정보처리방침</a>에 동의합니다.
                                </label>
                            </div>

                            <div className="pt-4">
                                <Button fullWidth size="lg" className="rounded-xl py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 border-0 text-base font-semibold hover:-translate-y-0.5 transition-all duration-300">
                                    가입 완료하기
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-transparent px-3 text-slate-500 font-light backdrop-blur-sm">소셜 계정으로 빠른 가입</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <Button variant="outline" fullWidth className="h-12 text-slate-700 bg-white/60 hover:bg-white border-slate-200 transition-all shadow-sm group" onClick={() => handleOAuthSignup('google')}>
                                    <span className="w-5 h-5 mr-no-shrink mr-2 relative flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                                            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                            </g>
                                        </svg>
                                    </span>
                                    Google
                                </Button>
                                <Button variant="outline" fullWidth className="h-12 text-[#381E1F] bg-[#FEE500]/60 hover:bg-[#FEE500] border-transparent transition-all shadow-sm" onClick={() => handleOAuthSignup('kakao')}>
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 3C6.47715 3 2 6.47715 2 10.7643C2 13.5133 3.69335 15.932 6.22383 17.2797L5.35821 20.4568C5.23485 20.9088 5.7501 21.2562 6.13601 20.9592L9.89667 18.0673C10.5739 18.239 11.2778 18.3286 12 18.3286C17.5228 18.3286 22 14.8514 22 10.5643C22 6.27715 17.5228 3 12 3Z" />
                                    </svg>
                                    Kakao
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-sm text-slate-500 font-light">
                    이미 계정이 있으신가요?{" "}
                    <Link href="/login" className="font-medium text-blue-600 hover:text-blue-800 transition-colors">
                        안전하게 로그인하기
                    </Link>
                </p>
            </div>
        </main>
    );
}

export default function Signup() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SignupForm />
        </Suspense>
    );
}
