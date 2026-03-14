'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react'
import { deleteAccount } from '@/app/auth/delete-account/actions'
import { useRouter } from 'next/navigation'

interface DeleteAccountButtonProps {
    className?: string
}

export function DeleteAccountButton({ className }: DeleteAccountButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteAccount()
            if (result.success) {
                setIsOpen(false)
                router.push('/')
                router.refresh()
            } else if (result.error) {
                alert(result.error)
            }
        })
    }

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(true)}
                className={`text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all font-medium flex items-center gap-2 ${className}`}
            >
                <Trash2 className="w-4 h-4" />
                회원 탈퇴
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">정말 탈퇴하시겠습니까?</h3>
                            <p className="text-slate-500 leading-relaxed mb-8">
                                계정을 삭제하면 모든 프로필 정보, 예약 내역 및 활동 데이터가 완전히 삭제되며 **이 작업은 되돌릴 수 없습니다.**
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="outline"
                                    fullWidth
                                    size="lg"
                                    onClick={() => setIsOpen(false)}
                                    disabled={isPending}
                                    className="h-14 rounded-2xl border-slate-200 text-slate-600 font-bold"
                                >
                                    취소
                                </Button>
                                <Button
                                    fullWidth
                                    size="lg"
                                    onClick={handleDelete}
                                    disabled={isPending}
                                    className="h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg shadow-rose-500/20"
                                >
                                    {isPending ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        '탈퇴하기'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
