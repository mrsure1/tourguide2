'use client';

import React, { useState } from 'react';
import { X, Calendar, User, DollarSign, ArrowRight, Clock, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Link from 'next/link';

interface Booking {
    id: string;
    start_date: string;
    end_date: string;
    total_price: number;
    status: string;
    traveler: {
        full_name: string;
        avatar_url: string | null;
    };
}

interface ConfirmedToursModalProps {
    bookings: Booking[];
    trigger: React.ReactNode;
}

export default function ConfirmedToursModal({ bookings, trigger }: ConfirmedToursModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);

    return (
        <>
            <div onClick={toggleModal} className="cursor-pointer">
                {trigger}
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    <div
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={toggleModal}
                    />

                    <div className="relative bg-white w-full max-w-2xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-accent" />
                                    확정된 투어 목록
                                </h2>
                                <p className="text-sm text-slate-500 mt-0.5">총 {bookings.length}건의 예정된 일정이 있습니다.</p>
                            </div>
                            <button
                                onClick={toggleModal}
                                className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                            {bookings.length === 0 ? (
                                <div className="text-center py-20">
                                    <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                    <p className="text-slate-400 font-medium">확정된 투어 일정이 없습니다.</p>
                                </div>
                            ) : (
                                bookings.map((booking) => (
                                    <Card key={booking.id} className="border-slate-200/60 shadow-sm hover:shadow-md hover:border-accent/30 transition-all bg-white overflow-hidden group">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <img
                                                        src={booking.traveler.avatar_url || `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(booking.traveler.full_name || 'T')}`}
                                                        alt={booking.traveler.full_name}
                                                        className="w-12 h-12 rounded-full border border-slate-100 shadow-sm object-cover"
                                                    />
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                                            {booking.traveler.full_name}
                                                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-extrabold border border-blue-100">CONFIRMED</span>
                                                        </h4>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {booking.start_date} ~ {booking.end_date}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Price</p>
                                                        <p className="text-sm font-black text-slate-900">₩ {booking.total_price.toLocaleString()}</p>
                                                    </div>
                                                    <Link
                                                        href={`/guide/bookings/${booking.id}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-accent transition-all shadow-lg shadow-slate-900/10 group-hover:scale-105 active:scale-95 inline-flex items-center justify-center"
                                                    >
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-white border-t border-slate-100 text-center">
                            <button
                                onClick={toggleModal}
                                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors text-sm"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
