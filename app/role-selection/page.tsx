import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getRequestLocale } from "@/lib/i18n/get-request-locale";
import { localizePath } from "@/lib/i18n/routing";

export default async function RoleSelectionRedirect() {
    const locale = await getRequestLocale();
    // Role selection is now integrated into the main landing page.
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
            <h1 className="text-3xl font-black text-slate-900 mb-4">역할이 지정되지 않았습니다</h1>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
                가이드 또는 여행자 중 어떤 역할로 시작하실지<br />
                초기 화면에서 선택해주셔야 원활한 서비스 이용이 가능합니다.
            </p>
            <Link href={localizePath(locale, "/#onboarding")}>
                <Button size="lg" className="rounded-2xl px-12 bg-blue-600 text-white shadow-xl shadow-blue-500/20">
                    홈으로 가서 역할 선택하기
                </Button>
            </Link>
        </div>
    );
}
