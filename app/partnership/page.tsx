import Link from 'next/link';
import { Mail, Building2, Car, Users } from 'lucide-react';
import { InfoHeader } from "@/components/layout/InfoHeader";

export default function PartnershipPage() {
  return (
    <>
      <InfoHeader />
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-6">
            가이드매치와 함께할 <span className="text-[#ff385c]">파트너스</span>를 찾습니다.
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            여행사, 숙박업체, 렌터카, 항공사 등 다양한 관광 인프라와 협력하여 최고의 여행 경험을 창출합니다. 
            단순한 제휴를 넘어선 비즈니스의 동반 성장을 제안합니다.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 transition hover:shadow-md group">
             <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <Building2 className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-3">여행사 및 숙박업체</h3>
             <p className="text-slate-500 leading-relaxed text-sm">프리미엄 투어 패키지를 구성하고, 숙박 고객에게 검증된 현지 가이드를 추천하여 차별화된 맞춤형 서비스를 제공하세요.</p>
          </div>
          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 transition hover:shadow-md group">
             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
               <Car className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-3">렌터카 및 교통서비스</h3>
             <p className="text-slate-500 leading-relaxed text-sm">이동의 편리함과 현지의 전문 지식을 결합한 혁신적인 기사 포함 가이드(Driving Guide) 상품을 공동으로 기획합니다.</p>
          </div>
          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 transition hover:shadow-md group">
             <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
               <Users className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-3">콘텐츠 및 스타트업</h3>
             <p className="text-slate-500 leading-relaxed text-sm">로컬 크리에이터 연계, API 연동, 마케팅 협업 등 새로운 스마트 관광 생태계를 만들어가는 매시업 프로젝트를 환영합니다.</p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-slate-900 text-white rounded-[32px] p-8 sm:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff385c]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black mb-6">지금 바로 B2B 제휴를 문의하세요</h2>
            <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg">
              아래 이메일로 회사 소개서 혹은 제휴 제안서를 보내주시면,<br className="hidden sm:block" />
              가이드매치 제휴 담당자가 내용을 꼼꼼히 검토한 후 빠르게 회신해 드리겠습니다.
            </p>
            <div className="inline-block bg-white/10 border border-white/20 rounded-2xl px-8 py-5 backdrop-blur-md shadow-lg transition-transform hover:scale-105">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-slate-400" />
                <p className="text-sm text-slate-300 font-semibold tracking-wide">공식 제휴 담당 이메일</p>
              </div>
              <a href="mailto:leeyob@gmail.com" className="text-2xl sm:text-3xl font-black text-white hover:text-cyan-400 transition-colors">
                leeyob@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
