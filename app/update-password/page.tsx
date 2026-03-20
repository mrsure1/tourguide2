"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/client";
import { useI18n } from "@/components/providers/LocaleProvider";
import { localizePath } from "@/lib/i18n/routing";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const { locale } = useI18n();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !passwordConfirm) return;

    if (password !== passwordConfirm) {
      setStatus("error");
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setStatus("error");
      setErrorMessage("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase client is not available");

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setStatus("success");
      
      // 3초 후 로그인 페이지로 리다이렉트
      setTimeout(() => {
        router.push(localizePath(locale, "/login?message=" + encodeURIComponent("비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해주세요.")));
      }, 3000);
      
    } catch (error: any) {
      console.error("Password update error:", error);
      setStatus("error");
      setErrorMessage(error.message || "비밀번호 업데이트 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-[calc(100vh-80px)] relative overflow-hidden bg-mesh">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[pulse-slow_7s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-[pulse-slow_9s_ease-in-out_infinite_1s]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up relative z-10">
        <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <KeyRound className="w-8 h-8 text-white" />
            </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          새 비밀번호 설정
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 font-light">
          로그인에 사용할 새로운 비밀번호를 입력해주세요.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up animation-delay-200 relative z-10">
        <Card className="premium-card bg-white/80 backdrop-blur-xl border-white/50 shadow-xl overflow-hidden">
          <CardContent className="pt-8 pb-10 px-6 sm:px-10">
            {status === "success" ? (
              <div className="text-center animate-fade-in py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">변경 완료!</h3>
                <p className="text-slate-500 text-sm mb-6">
                  비밀번호가 성공적으로 변경되었습니다.<br/>잠시 후 로그인 페이지로 이동합니다.
                </p>
                <Loader2 className="w-6 h-6 text-slate-300 animate-spin mx-auto" />
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {status === "error" && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm p-3 rounded-xl">
                    {errorMessage}
                  </div>
                )}
                
                <div>
                  <Input
                    label="새 비밀번호"
                    id="password"
                    type="password"
                    required
                    placeholder="최소 6자 이상"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/50 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <Input
                    label="새 비밀번호 확인"
                    id="password-confirm"
                    type="password"
                    required
                    placeholder="비밀번호 다시 입력"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    className="bg-white/50 focus:bg-white transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    fullWidth 
                    size="lg" 
                    disabled={isLoading || !password || !passwordConfirm}
                    className="rounded-xl py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 border-0 text-base font-semibold hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        변경 중...
                      </>
                    ) : (
                      <>
                        비밀번호 변경하기
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
