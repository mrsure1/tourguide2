import Link from "next/link";
import { ChevronLeft, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InfoHeader } from "@/components/layout/InfoHeader";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { localizePath } from "@/lib/i18n/routing";

export default async function TermsPage(props: {
    searchParams: Promise<{ type?: string }>;
}) {
    const searchParams = await props.searchParams;
    const isPrivacy = searchParams.type === 'privacy';
    const locale = await getRequestLocale();
    const localePath = (href: string) => localizePath(locale, href);

    return (
        <div className="w-full">
            <InfoHeader />
        <div className="min-h-screen bg-slate-50 relative overflow-hidden animate-fade-in">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative z-10">

                {/* Header */}
                <div className="mb-10 text-center md:text-left">
                    <Link href={localePath("/support")} className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200/60">
                        <ChevronLeft className="w-4 h-4" /> 고객센터로 돌아가기
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md shrink-0 mx-auto md:mx-0 ${isPrivacy ? 'bg-emerald-500' : 'bg-accent'}`}>
                            {isPrivacy ? <ShieldCheck className="w-7 h-7 text-white" /> : <FileText className="w-7 h-7 text-white" />}
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                {isPrivacy ? '개인정보처리방침' : '서비스 이용약관'}
                            </h1>
                            <p className="text-slate-500 font-medium mt-1">KOREA GUIDE MATCH 서비스의 투명하고 안전한 운영 원칙</p>
                        </div>
                    </div>
                </div>

                {/* Content Container */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 md:p-14 shadow-lg shadow-slate-200/50">
                    <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            시행일자: 2026년 2월 1일
                        </p>
                        <div className="text-sm text-slate-400 font-medium">
                            v1.0
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none 
                        prose-h2:text-xl prose-h2:font-extrabold prose-h2:text-slate-900 prose-h2:mt-10 prose-h2:mb-4 prose-h2:flex prose-h2:items-center prose-h2:gap-2
                        prose-p:text-base prose-p:leading-relaxed prose-p:text-slate-600 prose-p:font-medium
                        prose-li:text-slate-600 prose-li:font-medium prose-li:marker:text-accent
                        prose-strong:text-slate-900 prose-strong:font-bold">

                        {isPrivacy ? (
                            <>
                                <h2><span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>제 1 조 (개인정보의 처리 목적)</h2>
                                <p>가이드매치(이하 '회사')는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                                <ul>
                                    <li><strong>홈페이지 회원 가입 및 관리:</strong> 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정 이용 방지</li>
                                    <li><strong>재화 또는 서비스 제공:</strong> 투어 예약 및 매칭, 서비스 제공, 청구서 발송, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 요금결제 및 정산</li>
                                    <li><strong>고충 처리:</strong> 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보</li>
                                </ul>

                                <h2><span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>제 2 조 (수집하는 개인정보 항목 및 수집 방법)</h2>
                                <p>회사는 안정적인 서비스 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
                                <ul>
                                    <li><strong>회원 가입 (여행자):</strong> [필수] 이메일, 비밀번호, 이름, 연락처 / [선택] 프로필 사진, 관심 여행지</li>
                                    <li><strong>회원 가입 (가이드):</strong> [필수] 이메일, 비밀번호, 이름, 연락처, 신분증 사본, 계좌정보, 자격증명 / [선택] 구사 언어, 자기소개</li>
                                    <li><strong>서비스 이용 과정:</strong> IP 주소, 쿠키, 방문 일시, 불량 이용 기록, 결제 기록</li>
                                </ul>

                                <h2><span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>제 3 조 (개인정보의 처리 및 보유 기간)</h2>
                                <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 유효하게 처리 및 보관합니다.</p>
                                <ul>
                                    <li><strong>계약 또는 청약철회, 대금결제, 재화 등의 공급기록:</strong> 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                                    <li><strong>소비자의 불만 또는 분쟁처리에 관한 기록:</strong> 3년 (동법)</li>
                                    <li><strong>웹사이트 방문 기록:</strong> 3개월 (통신비밀보호법)</li>
                                </ul>

                                <h2><span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>제 4 조 (개인정보의 제3자 제공)</h2>
                                <p>회사는 원칙적으로 이용자의 개인정보를 제1조에서 명시한 범위 내에서 처리하며, 이용자의 사전 동의 없이는 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다. 단, 다음의 경우에는 예외로 합니다.</p>
                                <ul>
                                    <li>이용자가 사전에 제3자 제공 및 공개에 동의한 경우 (예: 투어 예약 시 해당 가이드에게 예약자 이름, 연락처 제공)</li>
                                    <li>법령 등에 의해 제공이 요구되는 경우</li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <h2><span className="w-2 h-2 rounded-full bg-accent block"></span>제 1 조 (목적)</h2>
                                <p>본 약관은 KOREA GUIDE MATCH가 제공하는 제반 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>

                                <h2><span className="w-2 h-2 rounded-full bg-accent block"></span>제 2 조 (회원의 정의)</h2>
                                <p>1. <strong>회원</strong>이란 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</p>
                                <p>2. 회원은 그 역할에 따라 <strong>여행자</strong>와 <strong>가이드</strong>로 구분되며, 각 역할에 따른 권한과 책임이 부여됩니다. 여행자는 플랫폼을 통해 투어를 예약하고 이용하는 자를, 가이드는 자신의 전문 지식을 바탕으로 투어 상품을 기획하고 제공하는 자를 일컫습니다.</p>

                                <h2><span className="w-2 h-2 rounded-full bg-accent block"></span>제 3 조 (가이드의 의무와 책임)</h2>
                                <p>가이드는 등록된 투어 상품을 성실히 이행할 의무가 있으며, 허위 정보 제공이나 부적절한 언행으로 인한 모든 불이익에 대해 책임을 집니다. 회사는 가이드의 자격을 유지하기 위해 최소한의 서비스 품질 기준을 요구할 수 있으며, 이를 지속적으로 위반할 경우 계정 이용이 제한될 수 있습니다.</p>

                                <h2><span className="w-2 h-2 rounded-full bg-accent block"></span>제 4 조 (결제 및 환불)</h2>
                                <p>모든 결제는 플랫폼 내 안전 시스템을 통해 이루어지며, 무통장 입금이나 개인간 직접 거래는 엄격히 금지됩니다. 환불 규정은 각 가이드가 설정한 개별 상품의 환불 정책을 우선적으로 따르되, 플랫폼의 기본 환불 정책에 부합해야 합니다.</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-12 text-center flex flex-col items-center gap-4">
                    <p className="text-slate-500 text-sm font-medium">더 궁금한 점이 있으신가요?</p>
                    <Link href={localePath("/support")}>
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 h-12 rounded-xl shadow-md">
                            고객센터 문의하기
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
        </div>
    );
}
