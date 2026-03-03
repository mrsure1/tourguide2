"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CreditCard, Calendar, User, Search, Filter, ArrowUpRight, CheckCircle2, AlertCircle, Clock } from "lucide-react";

interface PaymentRecord {
    id: string;
    traveler_id: string;
    guide_id: string;
    start_date: string;
    end_date: string;
    total_price: number;
    status: string;
    payment_intent_id?: string;
    created_at: string;
    traveler: { full_name: string; email: string };
    guide: { full_name: string; email: string };
}

export default function PaymentsClient({ initialPayments }: { initialPayments: any[] }) {
    const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filteredPayments = payments.filter(p => {
        const matchesSearch =
            p.traveler?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.guide?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.payment_intent_id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
            case 'completed': return 'bg-emerald-100 text-emerald-700 ring-emerald-700/10';
            case 'confirmed': return 'bg-blue-100 text-blue-700 ring-blue-700/10';
            case 'pending': return 'bg-amber-100 text-amber-700 ring-amber-700/10';
            case 'declined':
            case 'cancelled': return 'bg-rose-100 text-rose-700 ring-rose-700/10';
            default: return 'bg-slate-100 text-slate-700 ring-slate-700/10';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid':
            case 'completed': return <CheckCircle2 className="w-3 h-3" />;
            case 'pending': return <Clock className="w-3 h-3" />;
            case 'declined':
            case 'cancelled': return <AlertCircle className="w-3 h-3" />;
            default: return <ArrowUpRight className="w-3 h-3" />;
        }
    };

    const totalRevenue = payments
        .filter(p => p.status === 'paid' || p.status === 'completed')
        .reduce((sum, p) => sum + (Number(p.total_price) || 0), 0);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-emerald-600" />
                        결제 및 매출 현황
                    </h1>
                    <p className="text-slate-500 mt-1">시스템에서 발생하는 모든 거래 및 예약 상태를 모니터링합니다.</p>
                </div>
                <div className="bg-emerald-600 px-6 py-4 rounded-3xl shadow-lg shadow-emerald-100 text-white">
                    <p className="text-xs font-bold text-emerald-100 uppercase tracking-widest mb-1">총 누적 매출</p>
                    <p className="text-2xl font-black italic">₩ {totalRevenue.toLocaleString()}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm bg-white p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <ArrowUpRight className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">전체 거래</p>
                        <p className="text-xl font-black text-slate-900">{payments.length}건</p>
                    </div>
                </Card>
                <Card className="border-none shadow-sm bg-white p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">대기 중인 예약</p>
                        <p className="text-xl font-black text-slate-900">{payments.filter(p => p.status === 'pending').length}건</p>
                    </div>
                </Card>
                <Card className="border-none shadow-sm bg-white p-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">취소/거절</p>
                        <p className="text-xl font-black text-slate-900">{payments.filter(p => p.status === 'cancelled' || p.status === 'declined').length}건</p>
                    </div>
                </Card>
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-md">
                <CardHeader className="border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="사용자명 또는 거래 ID 검색..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <select
                            className="bg-slate-50 border border-slate-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-emerald-500/20"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">모든 상태</option>
                            <option value="pending">Pending (승인대기)</option>
                            <option value="confirmed">Confirmed (승인완료)</option>
                            <option value="paid">Paid (결제완료)</option>
                            <option value="completed">Completed (투어완료)</option>
                            <option value="declined">Declined (거절됨)</option>
                            <option value="cancelled">Cancelled (취소됨)</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">거래 ID / 일시</th>
                                    <th className="px-6 py-4">여행자 & 가이드</th>
                                    <th className="px-6 py-4">금액</th>
                                    <th className="px-6 py-4">상태</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredPayments.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <p className="font-mono text-[10px] text-slate-400 mb-1">{p.id.split('-')[0]}...{p.payment_intent_id ? ` / ${p.payment_intent_id}` : ''}</p>
                                            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(p.created_at).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3 h-3 rounded-full bg-blue-100 flex items-center justify-center text-[8px] font-bold text-blue-600">T</span>
                                                    <span className="font-bold text-slate-800">{p.traveler?.full_name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3 h-3 rounded-full bg-purple-100 flex items-center justify-center text-[8px] font-bold text-purple-600">G</span>
                                                    <span className="font-bold text-slate-800">{p.guide?.full_name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="font-black text-slate-900 text-base">₩ {Number(p.total_price).toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight ring-1 ${getStatusColor(p.status)}`}>
                                                {getStatusIcon(p.status)}
                                                {p.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPayments.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                                            매칭되는 거래 내역이 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
