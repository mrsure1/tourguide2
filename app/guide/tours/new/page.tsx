import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import TourCreateForm from "./TourCreateForm";

export default function NewTourPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/guide/tours" className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">새 투어 등록</h1>
                        <p className="text-xs text-slate-500 font-medium">여행자들에게 보여질 새로운 투어 코스를 만들어주세요.</p>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white ring-1 ring-slate-100 overflow-hidden">
                    <CardContent className="p-0">
                        {/* 클라이언트 컴포넌트 폼 분리 */}
                        <TourCreateForm />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
