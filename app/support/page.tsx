import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Search, MessageCircle, HelpCircle, ChevronRight, BookOpen, FileText } from "lucide-react";

export default function SupportPage() {
    const faqs = [
        {
            q: "예약한 투어를 취소하고 싶습니다.",
            a: "투어 시작 48시간 전까지는 전액 환불이 가능합니다. [내 예약] 메뉴에서 취소 버튼을 눌러주세요."
        },
        {
            q: "가이드와 미리 연락할 수 있나요?",
            a: "네, 예약이 확정되면 [메시지] 탭을 통해 가이드와 직접 채팅이 가능합니다."
        },
        {
            q: "가이드로 활동하려면 어떻게 해야 하나요?",
            a: "상단 메뉴의 '가이드 지원하기'를 통해 프로필을 등록해 주세요. 심사를 거쳐 활동하실 수 있습니다."
        },
        {
            q: "결제 영수증은 어디서 확인하나요?",
            a: "[내 정보] > [이용 내역] 에 들어가시면 각 내역 우측 하단에 '영수증' 다운로드 버튼이 있습니다."
        }
    ];

    const categories = [
        { icon: BookOpen, title: '예약 및 결제', desc: '결제 수단, 환불 규정' },
        { icon: HelpCircle, title: '투어 이용', desc: '만나는 장소, 준비물' },
        { icon: MessageCircle, title: '메시지 및 알림', desc: '채팅 기능, 푸시 알림 설정' },
        { icon: FileText, title: '증빙 및 서류', desc: '영수증 발급, 회사 제출용 서류' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center animate-fade-in">
            {/* Ambient Background */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full filter blur-[120px] pointer-events-none -z-10" />

            <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">고객센터</h1>
                    <p className="text-lg text-slate-500 font-medium">무엇을 도와드릴까요? 궁금한 점을 쉽고 빠르게 해결해 드립니다.</p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-16 relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-slate-400 group-focus-within:text-accent transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="검색어를 입력하세요 (예: 환불, 예약 취소)"
                        className="w-full pl-12 pr-12 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all duration-300"
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                        <Button className="w-10 h-10 p-0 flex items-center justify-center rounded-xl bg-accent hover:bg-blue-600 shadow-sm text-white transition-transform active:scale-95">
                            <Search className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
                    <Card className="hover:border-accent/50 hover:shadow-md transition-all duration-300 cursor-pointer group bg-white border-slate-200/60 overflow-hidden relative">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                        <CardContent className="flex items-center gap-5 p-6 md:p-8">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100/50 flex items-center justify-center text-accent shrink-0 group-hover:-translate-y-1 transition-transform duration-300">
                                <MessageCircle className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-lg md:text-xl mb-1 group-hover:text-accent transition-colors">1:1 문의하기</h3>
                                <p className="text-sm text-slate-500">도움이 필요하시면 언제든 남겨주세요.</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-accent transition-colors shrink-0" />
                        </CardContent>
                    </Card>

                    <Card className="hover:border-emerald-500/50 hover:shadow-md transition-all duration-300 cursor-pointer group bg-white border-slate-200/60 overflow-hidden relative">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                        <CardContent className="flex items-center gap-5 p-6 md:p-8">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100/50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:-translate-y-1 transition-transform duration-300">
                                <HelpCircle className="w-7 h-7" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-lg md:text-xl mb-1 group-hover:text-emerald-600 transition-colors">자주 묻는 질문</h3>
                                <p className="text-sm text-slate-500">가장 많이 찾는 답변을 모았습니다.</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
                        </CardContent>
                    </Card>
                </div>

                {/* Categories */}
                <div className="mb-16">
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        도움말 카테고리
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((cat, i) => (
                            <div key={i} className="bg-white border border-slate-200/80 rounded-2xl p-5 text-center hover:shadow-md hover:border-accent/40 transition-all cursor-pointer group">
                                <div className="w-12 h-12 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-50 transition-colors">
                                    <cat.icon className="w-6 h-6 text-slate-500 group-hover:text-accent transition-colors" />
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm mb-1">{cat.title}</h4>
                                <p className="text-[11px] text-slate-500 line-clamp-1">{cat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top FAQs list */}
                <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
                        자주 묻는 질문 베스트
                        <Button variant="ghost" className="text-sm font-bold text-accent hover:bg-accent/5">전체보기</Button>
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-md hover:border-slate-300 transition-all group">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-start gap-4">
                                    <span className="text-accent font-extrabold text-xl leading-none mt-0.5">Q</span>
                                    <span className="flex-1 group-hover:text-accent transition-colors leading-snug">{faq.q}</span>
                                </h3>
                                <div className="flex items-start gap-4">
                                    <span className="text-slate-300 font-extrabold text-xl leading-none mt-0.5">A</span>
                                    <p className="text-slate-600 leading-relaxed font-medium text-[15px] flex-1">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-20 pt-8 border-t border-slate-200/80 text-center flex flex-wrap justify-center gap-6 text-sm font-bold text-slate-500">
                    <Link href="/terms" className="hover:text-slate-900 transition-colors">이용약관</Link>
                    <span className="w-1 h-1 rounded-full bg-slate-300 self-center hidden sm:block"></span>
                    <Link href="/terms?type=privacy" className="hover:text-slate-900 transition-colors">개인정보처리방침</Link>
                    <span className="w-1 h-1 rounded-full bg-slate-300 self-center hidden sm:block"></span>
                    <Link href="#" className="hover:text-slate-900 transition-colors">운영정책</Link>
                </div>
            </div>
        </div>
    );
}
