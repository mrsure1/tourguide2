import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ChevronLeft, CreditCard, User, FileText, Calendar, Clock, Users, Globe, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in relative">
            <div className="mb-8">
                <Link href="/traveler/bookings" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-accent mb-4 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    예약 내역으로 돌아가기
                </Link>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    안전한 결제
                </h1>
                <p className="mt-2 text-slate-500">여행자 정보와 결제 수단을 확인하고 예약을 확정하세요.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Content */}
                <div className="lg:col-span-2 space-y-6">

                    <Card className="border-slate-200/60 shadow-md">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100/80 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-accent" />
                                예약자 정보
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">이름 (영문)</label>
                                    <p className="text-sm font-semibold text-slate-900 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200/60">John Doe</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">연락처</label>
                                    <p className="text-sm font-semibold text-slate-900 bg-slate-50 px-4 py-3 rounded-lg border border-slate-200/60">+1 234-567-8900</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                                    <FileText className="w-4 h-4" /> 가이드에게 보내는 메시지 (선택)
                                </label>
                                <textarea
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all min-h-[100px]"
                                    placeholder="만나는 장소 관련 문의나 알러지 정보 등을 남겨주세요."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/60 shadow-md">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100/80 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-accent" />
                                결제 수단
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-3">
                                <label className="flex items-center justify-between p-4 border-2 border-accent rounded-xl bg-accent/5 cursor-pointer transition-all">
                                    <div className="flex items-center">
                                        <input type="radio" name="payment" className="h-4 w-4 text-accent border-slate-300 focus:ring-accent" defaultChecked />
                                        <span className="ml-3 font-bold text-accent">신용/체크카드 (해외결제)</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <span className="w-10 h-6 bg-white border border-slate-200 shadow-sm rounded flex justify-center items-center text-[9px] font-bold text-blue-900 italic">VISA</span>
                                        <span className="w-10 h-6 bg-white border border-slate-200 shadow-sm rounded flex justify-center items-center text-[9px] font-bold text-red-600">Master</span>
                                    </div>
                                </label>
                                <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-all hover:border-slate-300">
                                    <div className="flex items-center">
                                        <input type="radio" name="payment" className="h-4 w-4 text-accent border-slate-300 focus:ring-accent" />
                                        <span className="ml-3 font-medium text-slate-700">PayPal</span>
                                    </div>
                                    <span className="w-14 h-6 bg-blue-100 text-blue-800 font-extrabold rounded flex justify-center items-center text-[11px] italic">PayPal</span>
                                </label>
                                <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-all hover:border-slate-300">
                                    <div className="flex items-center">
                                        <input type="radio" name="payment" className="h-4 w-4 text-accent border-slate-300 focus:ring-accent" />
                                        <span className="ml-3 font-medium text-slate-700">간편결제 (카카오페이/토스)</span>
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">내국인 전용</span>
                                </label>
                            </div>

                            {/* Dummy Card Input fields */}
                            <div className="mt-8 space-y-5 pt-6 border-t border-slate-100">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700">카드 번호</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none font-medium text-slate-900 tracking-wider" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700">만료일 (MM/YY)</label>
                                        <input type="text" placeholder="MM/YY" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none font-medium text-slate-900" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700">CVC</label>
                                        <input type="text" placeholder="123" className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none font-medium text-slate-900" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Content - Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <Card className="border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden rounded-2xl">
                            <div className="h-40 bg-slate-200 relative">
                                <img src="https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=600&auto=format&fit=crop" className="w-full h-full object-cover" alt="Tour img" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                                <div className="absolute bottom-4 left-5 right-5">
                                    <h3 className="font-bold text-white text-lg leading-tight mb-1 drop-shadow-md">경복궁 및 북촌 프리미엄 투어</h3>
                                    <p className="text-sm justify-between flex text-slate-200 font-medium drop-shadow-md">
                                        <span>김철수 가이드</span>
                                    </p>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="space-y-4 pb-6 border-b border-slate-100">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium text-slate-900">2026.02.24 (화)</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium text-slate-900">09:00 - 13:00 (4H)</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium text-slate-900">성인 2명</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Globe className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium text-slate-900">English</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 pb-6 border-b border-slate-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">₩ 80,000 x 2명</span>
                                        <span className="text-slate-900 font-bold">₩ 160,000</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">플랫폼 수수료</span>
                                        <span className="text-slate-900 font-bold">₩ 16,000</span>
                                    </div>
                                </div>

                                <div className="pt-6 pb-2 space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-bold text-slate-900">총 결제 금액</span>
                                        <span className="text-2xl font-extrabold text-accent">₩ 176,000</span>
                                    </div>
                                    <div className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <p className="font-semibold mb-1 text-slate-700">취소 규정</p>
                                        가이드가 확정하기 전까지는 전액 환불됩니다. 확정 후 투어 3일 전까지 취소 시 100% 환불됩니다.
                                    </div>
                                </div>

                                <Button fullWidth size="lg" className="mt-6 rounded-xl shadow-lg shadow-accent/25 border-0 bg-accent hover:bg-blue-600 text-white font-bold text-base h-12 transition-all hover:-translate-y-0.5">
                                    안전하게 결제하기
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
