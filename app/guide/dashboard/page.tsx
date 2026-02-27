import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Calendar as CalendarIcon, Map, DollarSign, MessageSquare, Plus, CheckCircle2, XCircle, ArrowRight, UserCircle, Settings, Clock } from "lucide-react";

export default function GuideDashboard() {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10 animate-fade-in relative">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                        안녕하세요, 김철수님! <span className="text-2xl">👋</span>
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">오늘도 멋진 투어를 만들어주세요. 새로운 예약 요청이 도착했습니다.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/guide/schedule">
                        <Button variant="outline" className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm flex items-center gap-2 h-11 px-5">
                            <CalendarIcon className="w-4 h-4" /> 일정 관리
                        </Button>
                    </Link>
                    <Link href="/guide/tours/new">
                        <Button className="bg-accent hover:bg-blue-600 shadow-md shadow-accent/20 flex items-center gap-2 h-11 px-6">
                            <Plus className="w-4 h-4" /> 새 투어 만들기
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-transparent shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <CardHeader className="pb-2 border-none">
                        <div className="flex items-center justify-between">
                            <p className="text-slate-300 font-medium text-sm flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4" /> 이번 달 예상 수익
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <h2 className="text-4xl font-extrabold mb-2 tracking-tight">₩ 1,450,000</h2>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                            <ArrowRight className="w-3 h-3 -rotate-45" /> 지난 달 대비 15% 상승
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200/60 shadow-md bg-white">
                    <CardHeader className="pb-2">
                        <p className="text-slate-500 font-bold text-sm flex items-center gap-2 uppercase tracking-wider">
                            <Map className="w-4 h-4 text-accent" /> 확정된 투어 (이번 달)
                        </p>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-2">8건</h2>
                        <p className="text-sm font-medium text-slate-600 bg-slate-50 inline-block px-3 py-1 rounded-md border border-slate-100">
                            다음 투어: 내일 오전 10시
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200/60 shadow-md bg-white">
                    <CardHeader className="pb-2">
                        <p className="text-slate-500 font-bold text-sm flex items-center gap-2 uppercase tracking-wider">
                            <MessageSquare className="w-4 h-4 text-emerald-500" /> 답변 대기 중인 문의
                        </p>
                    </CardHeader>
                    <CardContent>
                        <h2 className="text-4xl font-extrabold text-slate-900 mb-2">3건</h2>
                        <p className="text-sm font-medium text-emerald-600 bg-emerald-50 inline-block px-3 py-1 rounded-md border border-emerald-100">
                            평균 응답 시간: 1.5시간
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="flex flex-col border-slate-200/60 shadow-md overflow-hidden h-[450px]">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/80 bg-slate-50/50 py-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            새로운 예약 요청
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-accent text-xs font-bold hover:bg-accent/10">
                            전체보기 <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto p-0">
                        <ul className="divide-y divide-slate-100">
                            {[1, 2, 3].map((item) => (
                                <li key={item} className="p-5 hover:bg-slate-50/80 transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <img src={`https://i.pravatar.cc/150?u=traveler${item}`} className="w-12 h-12 rounded-full border border-slate-200 shadow-sm shrink-0" alt="Traveler" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                                    John Doe <span className="text-xs text-slate-400 font-normal">미국</span>
                                                </p>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                                                    대기중
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-600 mb-3 bg-white border border-slate-100 rounded-md p-2 mt-2 leading-relaxed h-[52px] line-clamp-2">
                                                <strong className="text-slate-900 font-semibold">[서울] 경복궁 반일 도보 투어</strong>
                                                <br />2026-02-28 10:00 (어른 2명)
                                            </p>
                                            <div className="flex gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="sm" className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white flex-1 flex items-center gap-1.5 focus:bg-slate-800 focus:opacity-100 focus:outline-none">
                                                    <CheckCircle2 className="w-4 h-4" /> 수락
                                                </Button>
                                                <Button size="sm" variant="outline" className="h-9 px-4 bg-white border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 flex items-center gap-1.5">
                                                    <XCircle className="w-4 h-4" /> 거절
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="flex flex-col border-slate-200/60 shadow-md h-[450px]">
                    <CardHeader className="border-b border-slate-100/80 bg-slate-50/50 py-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-slate-400" />
                            다가오는 투어 일정
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto p-6">
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[35px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                            {/* Dummy Timeline items */}
                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-[.is-active]:bg-accent group-[.is-active]:text-white">
                                    <span className="text-xs font-bold">오늘</span>
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900 text-sm">경복궁 및 북촌 도보 투어</h4>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 bg-slate-50 px-2 py-1.5 rounded-md">
                                        <Clock className="w-3.5 h-3.5 text-accent" />
                                        <span className="font-semibold text-slate-700">10:00 - 14:00</span>
                                    </div>
                                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                                        <UserCircle className="w-3.5 h-3.5" /> 마이클 외 2명 (영어)
                                    </p>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                    <span className="text-xs font-bold">2/25</span>
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-900 text-sm">명동 쇼핑 & 스트릿푸드</h4>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 bg-white border border-slate-100 px-2 py-1.5 rounded-md">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="font-semibold text-slate-700">18:00 - 21:00</span>
                                    </div>
                                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                                        <UserCircle className="w-3.5 h-3.5" /> 사라 (영어)
                                    </p>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                    <span className="text-xs font-bold">2/28</span>
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm opacity-80 hover:opacity-100 transition-opacity flex items-center justify-center min-h-[100px] border-dashed">
                                    <p className="text-xs text-slate-500 font-medium">일정 없음</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
