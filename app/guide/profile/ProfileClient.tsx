"use client";

import { useRef, useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Camera, MapPin, Globe, Tag, User, Mail, Info, Plus, X, DollarSign, Loader2 } from "lucide-react";
import { updateProfile } from "./actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ProfileClient({ profile, detail }: { profile: any, detail: any }) {
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
            // Also update the hidden/input field if needed, but since it's a form, 
            // the state won't automatically update the defaultValue of the Input.
            // We should use a controlled input for avatar_url now.
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
            const result = await updateProfile(formData);
            if (result.error) {
                alert("저장 중 오류가 발생했습니다: " + result.error);
            } else {
                alert("프로필이 성공적으로 저장되었습니다.");
                router.refresh();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in relative">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">가이드 프로필 관리</h1>
                <p className="text-slate-500 mt-2 text-lg">여행자에게 보여질 기본 정보와 전문 분야를 등록해주세요.</p>
            </div>

            <Card className="border-slate-200/60 shadow-md bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100/80 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <User className="w-5 h-5 text-accent" /> 기본 정보
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
                                    className="w-28 h-28 rounded-full bg-slate-100 overflow-hidden relative group shrink-0 border-4 border-white shadow-md ring-1 ring-slate-100 cursor-pointer"
                                >
                                    {isUploading ? (
                                        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-accent animate-spin" />
                                        </div>
                                    ) : (
                                        <>
                                            <img
                                                src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'User')}&background=random`}
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
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-none p-0">가이드 이름</label>
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

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                <Info className="w-4 h-4 text-slate-400" /> 자기소개 (Bio)
                            </label>
                            <textarea
                                name="bio"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all min-h-[140px] leading-relaxed resize-y shadow-sm"
                                defaultValue={detail?.bio || ""}
                                placeholder="여행자들에게 자신을 매력적으로 소개해보세요."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-none p-0">기본 투어 요금 (원)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <DollarSign className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div className="pl-8">
                                        <Input name="hourly_rate" type="number" defaultValue={detail?.hourly_rate || ""} placeholder="예: 150000" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-none p-0">요금 기준</label>
                                <select
                                    name="rate_type"
                                    defaultValue={detail?.rate_type || 'daily'}
                                    className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                >
                                    <option value="daily">일당 (1일 기준)</option>
                                    <option value="hourly">시간제 (1시간 기준)</option>
                                </select>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 pl-1 font-light italic">투어 진행 시 기준이 되는 요금과 단위를 설정해주세요.</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-md bg-white overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100/80 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Tag className="w-5 h-5 text-accent" /> 전문 분야 및 역량
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-8">
                        {/* 활동 지역 */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-slate-400" /> 주요 활동 지역
                            </label>
                            <Input name="location" defaultValue={detail?.location || ""} placeholder="예: 서울, 부산, 제주도" required />
                        </div>

                        {/* 구사 언어 */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                <Globe className="w-4 h-4 text-slate-400" /> 구사 언어 (쉼표로 구분)
                            </label>
                            <Input name="languages" defaultValue={detail?.languages?.join(', ') || ""} placeholder="예: 한국어, English, 日本語" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-6 pb-12">
                <Button type="button" onClick={() => router.back()} disabled={isPending} variant="outline" className="bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 h-11 px-6 shadow-sm">취소</Button>
                <Button type="submit" disabled={isPending} className="bg-accent hover:bg-blue-600 h-11 px-8 shadow-md font-bold">
                    {isPending ? '저장 중...' : '저장하기'}
                </Button>
            </div>
        </form>
    );
}
