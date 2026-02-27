import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Camera, MapPin, Globe, Tag, User, Mail, Info, Plus, X } from "lucide-react";

export default function GuideProfile() {
    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in relative">
            {/* Ambient Background */}
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
                    <form className="space-y-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <div className="w-28 h-28 rounded-full bg-slate-100 overflow-hidden relative group shrink-0 border-4 border-white shadow-sm ring-1 ring-slate-100">
                                <img src="https://i.pravatar.cc/150?u=g1" alt="Profile" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-[2px]">
                                    <Camera className="w-6 h-6 text-white mb-1" />
                                    <span className="text-white text-xs font-bold">사진 변경</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-5 w-full">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-none p-0">가이드 이름</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <User className="w-4 h-4 text-slate-400" />
                                        </div>
                                        {/* Input component doesn't support className prop propagation well without checking, let's wrap it nicely */}
                                        <div className="pl-8">
                                            <Input defaultValue="김철수" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-none p-0">연락처 이메일</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div className="pl-8 opacity-70">
                                            <Input defaultValue="guide1@example.com" disabled />
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1 pl-1">이메일 변경은 고객센터로 문의해주세요.</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                <Info className="w-4 h-4 text-slate-400" /> 자기소개 (Bio)
                            </label>
                            <textarea
                                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white p-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all min-h-[140px] leading-relaxed resize-y shadow-sm"
                                defaultValue="서울의 역사와 문화를 깊이있게 영어로 설명해드리는 5년차 전문 가이드입니다. 고객 맞춤형 도보 투어를 지향합니다."
                                placeholder="여행자들에게 자신을 매력적으로 소개해보세요."
                            />
                        </div>
                    </form>
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
                                <MapPin className="w-4 h-4 text-slate-400" /> 활동 지역
                            </label>
                            <div className="flex flex-wrap gap-2 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">
                                    서울 <button className="text-blue-500 hover:text-blue-800 focus:outline-none hover:bg-blue-200 rounded p-0.5 transition-colors"><X className="w-3.5 h-3.5" /></button>
                                </span>
                                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-dashed border-slate-300 shadow-sm transition-colors group">
                                    <Plus className="w-4 h-4 text-slate-400 group-hover:text-slate-600" /> 지역 추가
                                </button>
                            </div>
                        </div>

                        {/* 구사 언어 */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                <Globe className="w-4 h-4 text-slate-400" /> 구사 언어
                            </label>
                            <div className="flex flex-wrap gap-2 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-purple-100 text-purple-700 border border-purple-200 shadow-sm">
                                    Korean (Native) <button className="text-purple-500 hover:text-purple-800 focus:outline-none hover:bg-purple-200 rounded p-0.5 transition-colors"><X className="w-3.5 h-3.5" /></button>
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-purple-100 text-purple-700 border border-purple-200 shadow-sm">
                                    English (Fluent) <button className="text-purple-500 hover:text-purple-800 focus:outline-none hover:bg-purple-200 rounded p-0.5 transition-colors"><X className="w-3.5 h-3.5" /></button>
                                </span>
                                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-dashed border-slate-300 shadow-sm transition-colors group">
                                    <Plus className="w-4 h-4 text-slate-400 group-hover:text-slate-600" /> 언어 추가
                                </button>
                            </div>
                        </div>

                        {/* 투어 스타일 */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                <Tag className="w-4 h-4 text-slate-400" /> 투어 스타일 (태그)
                            </label>
                            <div className="flex flex-wrap gap-2 items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                                    역사/문화 <button className="text-emerald-600 hover:text-emerald-900 focus:outline-none hover:bg-emerald-200 rounded p-0.5 transition-colors"><X className="w-3.5 h-3.5" /></button>
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
                                    도보 투어 <button className="text-emerald-600 hover:text-emerald-900 focus:outline-none hover:bg-emerald-200 rounded p-0.5 transition-colors"><X className="w-3.5 h-3.5" /></button>
                                </span>
                                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-dashed border-slate-300 shadow-sm transition-colors group">
                                    <Plus className="w-4 h-4 text-slate-400 group-hover:text-slate-600" /> 스타일 추가
                                </button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-6 pb-12">
                <Button variant="outline" className="bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 h-11 px-6 shadow-sm">취소</Button>
                <Button className="bg-accent hover:bg-blue-600 h-11 px-8 shadow-md font-bold">저장하기</Button>
            </div>
        </div>
    );
}
