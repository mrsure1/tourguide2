import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function GuideDetail({ params }: { params: { id: string } }) {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile & Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile Header */}
                    <section className="flex flex-col sm:flex-row gap-6 items-start">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-slate-200 shrink-0 overflow-hidden relative shadow-md">
                            <img src="https://i.pravatar.cc/300?u=g1" alt="Guide Profile" className="w-full h-full object-cover" />
                            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-center text-slate-900 flex justify-center items-center shadow-sm">
                                <span className="text-amber-400 mr-1 text-sm">★</span> 4.8 (120)
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">김철수</h1>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-accent border border-blue-100">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    인증 완료
                                </span>
                            </div>
                            <p className="text-lg text-slate-500 font-light mb-4">서울을 가장 잘 아는 5년 차 영/한 이중언어 가이드</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-slate-100 text-slate-700">📍 서울전역</span>
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-slate-100 text-slate-700">🗣️ 한국어, English</span>
                                <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-slate-100 text-slate-700">✨ 역사/도보 전문가</span>
                            </div>
                        </div>
                    </section>

                    {/* About */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">가이드 소개</h2>
                        <div className="prose prose-slate max-w-none prose-p:leading-relaxed text-slate-600 font-light">
                            <p>안녕하세요! 5년째 외국인 여행자들의 성공적인 한국 여행을 돕고 있는 가이드 김철수입니다.</p>
                            <p>단순히 관광지만을 방문하는 것이 아닌, 한국의 깊은 역사와 로컬들이 즐기는 숨겨진 문화를 영어와 한국어로 유창하게 설명해 드립니다. 특히 도보 투어와 역사 유적지 해설에 전문성을 가지고 있으며, 여행 일정과 취향에 맞는 유연성 있는 개인 맞춤 투어를 지향합니다.</p>
                        </div>
                    </section>

                    {/* Tours (List of Products) */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">제공하는 투어 상품</h2>
                        <div className="space-y-4">
                            {[1, 2].map((idx) => (
                                <Card key={idx} className="flex flex-col sm:flex-row gap-4 p-4 hover:border-accent transition-all cursor-pointer group bg-white">
                                    <div className="w-full sm:w-48 h-40 sm:h-32 rounded-lg bg-slate-200 shrink-0 overflow-hidden relative">
                                        <img src={`https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=400&auto=format&fit=crop&sig=${idx}`} alt="Tour" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1 group-hover:text-accent transition-colors">경복궁 및 북촌 프리미엄 해설 투어</h3>
                                            <p className="text-sm text-slate-500 mb-2">4시간 소요 · 도보 이동</p>
                                            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed font-light">조선 왕궁의 웅장함과 북촌 한옥마을의 고즈넉함을 영어 전문가의 깊이있는 역사 해설과 함께 즐겨보세요.</p>
                                        </div>
                                        <div className="mt-3 flex justify-between items-center">
                                            <p className="text-accent font-bold">₩ 80,000 <span className="text-xs text-slate-500 font-normal">/ 1인</span></p>
                                            <Button size="sm" variant="outline" className="rounded-full px-4 text-xs font-semibold">선택하기</Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Reviews Preview */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900">여행자 리뷰 (120)</h2>
                            <Button variant="ghost" className="text-accent text-sm">모두 보기</Button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2].map(idx => (
                                <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?u=r${idx}`} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">David M. (United States)</p>
                                                <p className="text-xs text-slate-500 mt-0.5">2026.02.10 방문</p>
                                            </div>
                                        </div>
                                        <div className="flex text-amber-400 text-sm">★★★★★</div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        최고의 가이드였습니다! 서울의 역사에 대해 정말 많은 것을 배웠고, 김철수 가이드님의 영어 실력도 아주 훌륭했습니다. 점심으로 추천해주신 현지 맛집도 최고였어요. 다음 한국 방문 때 다시 꼭 신청할 예정입니다.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Right Column - Booking Widget & Calendar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                <CardTitle className="text-lg">일정 매칭 & 시작하기</CardTitle>
                                <p className="text-sm text-slate-500 mt-1 font-light">투어를 선택하고 예약할 날짜를 골라주세요.</p>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">

                                {/* 1. 상품 선택 */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-900">투어 선택</label>
                                    <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                                        <option>경복궁 및 북촌 프리미엄 투어 (₩80,000)</option>
                                        <option>남산 서울타워 야경 투어 (₩75,000)</option>
                                    </select>
                                </div>

                                {/* 2. 날짜 선택 (간이 캘린더 형태) */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="block text-sm font-medium text-slate-900">날짜</label>
                                        <span className="text-xs font-semibold text-accent bg-blue-50 px-2 py-0.5 rounded">일정 겹침 3일</span>
                                    </div>

                                    {/* Matching Calendar Simulation */}
                                    <div className="border border-slate-200 rounded-lg p-3 bg-white">
                                        <div className="flex justify-between items-center mb-2">
                                            <button className="text-slate-400 hover:text-slate-600">&lt;</button>
                                            <span className="text-sm font-bold">2026년 2월</span>
                                            <button className="text-slate-400 hover:text-slate-600">&gt;</button>
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1 text-slate-500">
                                            <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                            {/* Empty spaces */}
                                            <div></div><div></div><div></div><div></div>

                                            {/* Dates */}
                                            <div className="py-1.5 rounded text-slate-400">19</div>
                                            <div className="py-1.5 rounded text-slate-400">20</div>
                                            <div className="py-1.5 rounded text-slate-400">21</div>
                                            <div className="py-1.5 rounded text-slate-400">22</div>

                                            {/* Available + Matched Dates */}
                                            <div className="py-1.5 rounded bg-blue-50 font-bold text-accent border border-blue-200 cursor-pointer hover:bg-blue-100">23</div>
                                            <div className="py-1.5 rounded bg-blue-50 font-bold text-accent border border-blue-200 cursor-pointer hover:bg-blue-100 ring-2 ring-accent">24</div>
                                            <div className="py-1.5 rounded bg-blue-50 font-bold text-accent border border-blue-200 cursor-pointer hover:bg-blue-100">25</div>

                                            <div className="py-1.5 rounded text-slate-400 line-through">26</div>
                                            <div className="py-1.5 rounded bg-slate-100 text-slate-700 cursor-pointer hover:bg-slate-200">27</div>
                                            <div className="py-1.5 rounded bg-slate-100 text-slate-700 cursor-pointer hover:bg-slate-200">28</div>
                                        </div>
                                        <div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-slate-500">
                                            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-100 border border-blue-300 mr-1 block" /> 내 일정 일치</span>
                                            <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-100 border border-slate-300 mr-1 block" /> 예약 가능</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. 인원 */}
                                <div className="space-y-2 border-b border-slate-100 pb-6">
                                    <label className="block text-sm font-medium text-slate-900">인원 수</label>
                                    <div className="flex items-center justify-between border border-slate-300 rounded-lg p-1 bg-white">
                                        <button className="w-8 h-8 rounded shrink-0 flex items-center justify-center hover:bg-slate-100 text-slate-600">-</button>
                                        <span className="text-sm font-medium">2 명</span>
                                        <button className="w-8 h-8 rounded shrink-0 flex items-center justify-center hover:bg-slate-100 text-slate-600">+</button>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-end pt-2">
                                    <p className="text-sm font-medium text-slate-900">총 결제예정금액</p>
                                    <p className="text-2xl font-extrabold text-slate-900">₩ 160,000</p>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <Button fullWidth size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-900/20">
                                        예약 진행하기 (결제)
                                    </Button>
                                    <Button fullWidth variant="outline" className="rounded-xl border-slate-200 text-slate-700 bg-white hover:bg-slate-50">
                                        가이드에게 메시지 보내기
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
