"use client";

import { useRef, useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Camera, User, Loader2, Settings, Shield } from "lucide-react";
import { updateTravelerProfile } from "./actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfileEditClient({ profile }: { profile: any }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || "");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (e.g., 2MB limit)
        if (file.size > 2 * 1024 * 1024) {
            alert("이미지 크기는 2MB 이하여야 합니다.");
            return;
        }

        setIsUploading(true);
        const supabase = createClient();

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
            const { error: uploadError, data } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true });

            if (uploadError) {
                console.error("Upload error details:", uploadError);
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            setAvatarPreview(publicUrl);
        } catch (error: any) {
            alert("이미지 업로드 중 오류가 발생했습니다: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await updateTravelerProfile(formData);
            if (result?.error) {
                alert("저장 중 오류가 발생했습니다: " + result.error);
            } else {
                alert("프로필이 성공적으로 업데이트되었습니다.");
                router.push("/traveler/profile");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in relative z-10">
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full filter blur-[80px] pointer-events-none -z-10" />

            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">프로필 정보 수정</h1>
                <p className="text-slate-500 mt-2 text-lg">기본 정보와 프로필 사진을 관리할 수 있습니다.</p>
            </div>

            <Card className="border-slate-200/60 shadow-md bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100/80 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-500" /> 기본 정보
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="flex flex-col items-center gap-3">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <div
                                    onClick={handleAvatarClick}
                                    className="w-32 h-32 rounded-full bg-slate-100 overflow-hidden relative group shrink-0 border-4 border-white shadow-md ring-1 ring-slate-100 cursor-pointer"
                                >
                                    {isUploading ? (
                                        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                        </div>
                                    ) : (
                                        <>
                                            <img
                                                src={avatarPreview || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(profile?.full_name || 'User')}`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                                                <Camera className="w-6 h-6 text-white mb-1" />
                                                <span className="text-white text-[10px] font-bold">변경 가능</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 space-y-5 w-full">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-none p-0">프로필 사진 URL</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <Camera className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div className="pl-8">
                                            <Input
                                                name="avatar_url"
                                                value={avatarPreview}
                                                onChange={(e) => setAvatarPreview(e.target.value)}
                                                placeholder="https://example.com/photo.jpg"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1 pl-1 italic">사진을 클릭하여 업로드하거나 URL을 직접 입력할 수 있습니다.</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-none p-0">이름</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <User className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div className="pl-8">
                                            <Input name="full_name" defaultValue={profile?.full_name || ""} required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 알림 설정 섹션 */}
            <div id="notifications" className="scroll-mt-24">
                <Card className="border-slate-200/60 shadow-md bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100/80 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Settings className="w-5 h-5 text-amber-500" /> 알림 설정
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">이메일 알림</p>
                                    <p className="text-xs text-slate-500 mt-0.5">새로운 투어 제안 및 예약 확정 소식을 이메일로 받습니다.</p>
                                </div>
                                <input type="checkbox" name="email_notifications" defaultChecked className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">앱 푸시 알림</p>
                                    <p className="text-xs text-slate-500 mt-0.5">실시간 메시지 및 가이드 응답을 실시간으로 확인하세요.</p>
                                </div>
                                <input type="checkbox" name="push_notifications" defaultChecked className="w-5 h-5 accent-blue-600 rounded cursor-pointer" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 보안 설정 섹션 */}
            <div id="security" className="scroll-mt-24">
                <Card className="border-slate-200/60 shadow-md bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100/80 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Shield className="w-5 h-5 text-rose-500" /> 보안 설정
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-rose-50/30 rounded-2xl border border-rose-100/50">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">비밀번호 재설정</p>
                                    <p className="text-xs text-slate-500 mt-0.5">안전한 계정 관리를 위해 주기적으로 비밀번호를 변경하세요.</p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                                    onClick={async () => {
                                        const supabase = createClient();
                                        const { data: { user } } = await supabase.auth.getUser();
                                        if (user?.email) {
                                            const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
                                                redirectTo: `${window.location.origin}/auth/callback?next=/traveler/profile/edit`,
                                            });
                                            if (error) alert("오류가 발생했습니다: " + error.message);
                                            else alert("비밀번호 재설정 이메일이 발송되었습니다. 이메일을 확인해주세요.");
                                        }
                                    }}
                                >
                                    재설정 이메일 받기
                                </Button>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-sm font-bold text-slate-900">SNS 연동 계정</p>
                                <div className="mt-3 flex gap-3">
                                    <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-2 italic text-slate-400">KAKAO 연동됨</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end gap-3 pt-6 pb-12">
                <Button type="button" onClick={() => router.back()} disabled={isPending} variant="outline" className="bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 h-11 px-6 shadow-sm">취소</Button>
                <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 h-11 px-8 shadow-md font-bold text-white">
                    {isPending ? '저장 중...' : '변경 내용 저장'}
                </Button>
            </div>
        </form>
    );
}
