import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import TourEditForm from "./TourEditForm";
import { getTourById } from "../../actions";
import { notFound } from "next/navigation";

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const tour = await getTourById(id);

    if (!tour) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/guide/tours" className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">투어 정보 수정</h1>
                        <p className="text-xs text-slate-500 font-medium">여행자들에게 보여질 투어 정보를 최신 상태로 유지해주세요.</p>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white ring-1 ring-slate-100 overflow-hidden">
                    <CardContent className="p-0">
                        {/* 클라이언트 컴포넌트 폼 분리 */}
                        <TourEditForm tour={tour} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
