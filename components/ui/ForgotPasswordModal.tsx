"use client";

import { useState } from "react";
import { Mail, ArrowRight, X, Loader2 } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { createClient } from "@/lib/supabase/client";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const supabase = createClient();
      if (!supabase) throw new Error("Supabase client is not available");
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      });

      if (error) throw error;

      setStatus("success");
    } catch (error: any) {
      console.error("Password reset error:", error);
      setStatus("error");
      setErrorMessage(error.message || "비밀번호 재설정 이메일 전송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <Mail className="w-6 h-6" />
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-2">비밀번호 찾기</h3>
          
          {status === "success" ? (
            <div className="mt-4 animate-fade-in">
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
                <p className="text-emerald-800 text-sm leading-relaxed">
                  <span className="font-bold">{email}</span> 주소로 비밀번호 재설정 링크가 포함된 이메일을 발송했습니다. 
                  이메일함을 확인해주세요. (스팸함도 확인 부탁드립니다)
                </p>
              </div>
              <Button fullWidth size="lg" className="rounded-xl h-12 font-bold" onClick={onClose}>
                메인으로 돌아가기
              </Button>
            </div>
          ) : (
            <>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                가입하신 이메일 주소를 입력해주세요. 
                해당 이메일로 비밀번호 재설정 링크를 보내드립니다.
              </p>

              {status === "error" && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm p-3 rounded-xl mb-4">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input 
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-slate-50"
                  />
                </div>
                <Button 
                  type="submit" 
                  fullWidth 
                  size="lg" 
                  className="rounded-xl h-12 font-bold group"
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      이메일 전송
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
