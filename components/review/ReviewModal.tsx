"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { rating: number; review: string }) => void;
    tourName: string;
}

export function ReviewModal({ isOpen, onClose, onSubmit, tourName }: ReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">리뷰 작성</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-sm text-slate-500 mb-1">투어는 어떠셨나요?</p>
                        <h3 className="font-bold text-slate-900 mb-4">{tourName}</h3>

                        <div className="flex justify-center gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <svg
                                        className={`w-10 h-10 ${star <= (hoverRating || rating) ? "text-amber-400" : "text-slate-200"
                                            }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-sm font-medium text-accent h-5">
                            {rating === 1 ? '별로예요' : rating === 2 ? '그저 그래요' : rating === 3 ? '보통이에요' : rating === 4 ? '좋아요' : rating === 5 ? '최고예요!' : ''}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-900">상세 리뷰</label>
                        <textarea
                            className="w-full h-32 rounded-lg border border-slate-300 bg-white p-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none custom-scrollbar"
                            placeholder="가이드님과의 시간은 어땠나요? 다른 여행자들에게 도움이 될 만한 내용을 남겨주세요."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        />
                        <p className="text-xs text-slate-500 text-right">{review.length} / 500자</p>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-3 justify-end">
                    <Button variant="ghost" onClick={onClose}>취소</Button>
                    <Button
                        className="bg-slate-900 hover:bg-slate-800"
                        disabled={rating === 0 || review.trim().length === 0}
                        onClick={() => {
                            onSubmit({ rating, review });
                            onClose();
                        }}
                    >
                        리뷰 등록하기
                    </Button>
                </div>
            </div>
        </div>
    );
}
