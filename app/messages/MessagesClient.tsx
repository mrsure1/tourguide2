"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState, useTransition, useEffect, useRef } from "react";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Info, CheckCheck, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { sendMessage } from "./actions";

export default function MessagesClient({ clientId, conversations, profiles }: { clientId: string, conversations: any[], profiles: any[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialGuideId = searchParams.get('guide');

    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
    const [activeContactId, setActiveContactId] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [isPending, startTransition] = useTransition();
    const scrollRef = useRef<HTMLDivElement>(null);

    // If navigated from a specific tour with ?guide=id, set it active
    useEffect(() => {
        if (initialGuideId) {
            setActiveContactId(initialGuideId);
            setIsMobileChatOpen(true);
        } else if (conversations.length > 0 && !activeContactId) {
            setActiveContactId(conversations[0].contact.id);
        }
    }, [initialGuideId, conversations]);

    // Auto scroll down
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversations, activeContactId]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !activeContactId) return;

        startTransition(async () => {
            const res = await sendMessage(activeContactId, newMessage);
            if (res.error) {
                alert(`전송 실패: ${res.error}`);
            } else {
                setNewMessage("");
            }
        });
    };

    // Find the active conversation
    let activeConversation = conversations.find(c => c.contact.id === activeContactId);

    // If not found (new conversation scenario with initialGuideId), build a temporary one
    if (!activeConversation && activeContactId) {
        const contactProfile = profiles.find(p => p.id === activeContactId);
        if (contactProfile) {
            activeConversation = {
                contact: contactProfile,
                messages: []
            };
            // Add to the front temporarily for display
            conversations = [activeConversation, ...conversations];
        }
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col animate-fade-in relative gap-4">
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

            <div className="flex items-center">
                <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-medium">
                    <ArrowLeft className="w-5 h-5" />
                    <span>뒤로 가기</span>
                </Button>
            </div>

            <Card className="w-full flex-1 flex overflow-hidden border-slate-200/60 shadow-lg bg-white/80 backdrop-blur-xl">

                <div className={`w-full sm:w-80 md:w-96 flex flex-col border-r border-slate-200/60 bg-white/50 shrink-0 ${isMobileChatOpen ? 'hidden sm:flex' : 'flex'}`}>
                    <div className="p-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">메시지</h2>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-accent transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="이름 또는 투어 검색..."
                                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all shadow-sm group-hover:border-slate-300"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="p-3 space-y-1">
                            {conversations.length === 0 && (
                                <p className="text-center text-slate-400 text-sm py-10">대화 내역이 없습니다.</p>
                            )}
                            {conversations.map((conv, idx) => {
                                const contact = conv.contact;
                                const lastMsg = conv.messages[conv.messages.length - 1];
                                const isActive = activeContactId === contact.id;

                                return (
                                    <div
                                        key={contact.id}
                                        onClick={() => {
                                            setActiveContactId(contact.id);
                                            setIsMobileChatOpen(true);
                                        }}
                                        className={`p-3 flex gap-3 cursor-pointer transition-all rounded-xl ${isActive ? 'bg-blue-50/50 shadow-sm border border-blue-100/50' : 'hover:bg-slate-50 border border-transparent hover:border-slate-100'}`}
                                    >
                                        <div className="w-12 h-12 rounded-full shrink-0 relative shadow-sm ring-2 ring-white">
                                            <img src={contact.avatar_url || `https://i.pravatar.cc/150?u=${contact.id}`} alt="User" className="w-full h-full object-cover rounded-full" />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h3 className={`text-sm font-bold truncate ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                                                    {contact.full_name || '사용자'}
                                                </h3>
                                                <span className={`text-[10px] shrink-0 font-medium ${isActive ? 'text-accent' : 'text-slate-400'}`}>
                                                    {lastMsg ? lastMsg.time : ''}
                                                </span>
                                            </div>
                                            <p className={`text-xs truncate ${isActive ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                                                {lastMsg ? lastMsg.text : '대화를 시작해보세요!'}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className={`${isMobileChatOpen ? 'flex' : 'hidden'} sm:flex flex-1 flex-col bg-slate-50/30 relative`}>
                    {activeConversation ? (
                        <>
                            <div className="px-5 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setIsMobileChatOpen(false)} className="sm:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full relative shadow-sm ring-2 ring-slate-50">
                                            <img src={activeConversation.contact.avatar_url || `https://i.pravatar.cc/150?u=${activeConversation.contact.id}`} className="w-full h-full object-cover rounded-full" />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-sm font-bold text-slate-900 leading-tight">{activeConversation.contact.full_name} </h3>
                                            <p className="text-xs text-slate-500 font-medium">{activeConversation.contact.role === 'guide' ? '가이드' : '여행자'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 sm:gap-2">
                                    <Button variant="ghost" className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-0 rounded-full w-9 h-9 flex items-center justify-center">
                                        <Phone className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" className="hidden sm:flex text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-0 rounded-full w-9 h-9 items-center justify-center">
                                        <Video className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-0 rounded-full w-9 h-9 flex items-center justify-center">
                                        <Info className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-0 rounded-full w-9 h-9 flex items-center justify-center">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
                                {activeConversation.messages.map((msg: any) => {
                                    return (
                                        <div key={msg.id} className={`flex items-end gap-2 text-sm ${msg.isMe ? 'justify-end' : ''}`}>
                                            {!msg.isMe && (
                                                <div className={`w-8 h-8 rounded-full shrink-0 mb-1 bg-slate-200 shadow-sm`}>
                                                    <img src={activeConversation.contact.avatar_url || `https://i.pravatar.cc/150?u=${activeConversation.contact.id}`} alt="User" className="w-full h-full object-cover rounded-full" />
                                                </div>
                                            )}
                                            {msg.isMe && <span className="text-[10px] text-slate-400 font-medium mb-1 shrink-0">{msg.time}</span>}
                                            <div className={`flex flex-col gap-1 max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                                <div className={
                                                    msg.isMe
                                                        ? "bg-accent border border-accent/20 p-3.5 rounded-2xl rounded-br-sm shadow-sm text-white font-medium leading-relaxed"
                                                        : "bg-white border border-slate-200/80 p-3.5 rounded-2xl rounded-bl-sm shadow-sm text-slate-700 leading-relaxed font-medium"
                                                }>
                                                    {msg.text}
                                                </div>
                                                {msg.isMe && (
                                                    <div className="flex items-center gap-1 mt-0.5 pr-1 text-slate-400">
                                                        <span className="text-[10px] font-bold">전송됨</span>
                                                        <CheckCheck className="w-3.5 h-3.5 text-accent" />
                                                    </div>
                                                )}
                                            </div>
                                            {!msg.isMe && <span className="text-[10px] text-slate-400 font-medium mb-1 shrink-0">{msg.time}</span>}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="p-4 bg-white border-t border-slate-200/60 sticky bottom-0">
                                <div className="flex items-end gap-2 max-w-4xl mx-auto bg-slate-50 border border-slate-200 p-2 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-accent/20 focus-within:border-accent transition-all">
                                    <button className="p-2.5 text-slate-400 hover:text-accent hover:bg-white rounded-xl transition-all shrink-0">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <textarea
                                        placeholder="메시지를 입력하세요..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        className="w-full max-h-32 min-h-[44px] bg-transparent py-2.5 px-2 text-sm focus:outline-none resize-none custom-scrollbar placeholder:text-slate-400 font-medium leading-relaxed"
                                        rows={1}
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!newMessage.trim() || isPending}
                                        className="bg-accent hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 rounded-xl h-10 w-10 shrink-0 p-0 flex items-center justify-center shadow-sm transition-all"
                                    >
                                        <Send className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-4">
                            <span className="text-6xl border-2 border-slate-200 rounded-full p-8 text-slate-200 bg-slate-50">💬</span>
                            <p>대화할 연락처를 선택해주세요</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
