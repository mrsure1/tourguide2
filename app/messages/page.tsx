"use client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Info, User, Check, CheckCheck, MapPin, Calendar as CalendarIcon, Clock, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
    const router = useRouter();
    const [newMessage, setNewMessage] = useState("");
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, text: "안녕하세요! 예약 확정 안내 도와드렸습니다. 일정 관련해서 궁금한 점 있으시면 편하게 말씀해주세요.", sender: "guide", time: "09:12 AM" },
        { id: 2, text: "안녕하세요! 24일 투어 미팅 장소 관련해서 문의드립니다. 안국역 3번 출구로 가면 될까요?", sender: "me", time: "10:42 AM" }
    ]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        setChatMessages([...chatMessages, {
            id: Date.now(),
            text: newMessage,
            sender: "me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setNewMessage("");
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col animate-fade-in relative gap-4">
            {/* Ambient Background */}
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full filter blur-[100px] pointer-events-none -z-10" />

            {/* Global Back Navigation */}
            <div className="flex items-center">
                <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2 px-3 py-2 rounded-xl transition-colors font-medium">
                    <ArrowLeft className="w-5 h-5" />
                    <span>뒤로 가기</span>
                </Button>
            </div>

            <Card className="w-full flex-1 flex overflow-hidden border-slate-200/60 shadow-lg bg-white/80 backdrop-blur-xl">

                {/* Left Sidebar - Chat List */}
                <div className={`w-full sm:w-80 md:w-96 flex flex-col border-r border-slate-200/60 bg-white/50 shrink-0 ${isMobileChatOpen ? 'hidden sm:flex' : 'flex'}`}>
                    <div className="p-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">메시지</h2>
                            <span className="bg-accent/10 text-accent text-xs font-bold px-2.5 py-1 rounded-full border border-accent/20">
                                3 안읽음
                            </span>
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
                        {/* Chat Items */}
                        <div className="p-3 space-y-1">
                            {[1, 2, 3].map((idx) => (
                                <div key={idx} onClick={() => setIsMobileChatOpen(true)} className={`p-3 flex gap-3 cursor-pointer transition-all rounded-xl ${idx === 1 ? 'bg-blue-50/50 shadow-sm border border-blue-100/50' : 'hover:bg-slate-50 border border-transparent hover:border-slate-100'}`}>
                                    <div className="w-12 h-12 rounded-full shrink-0 relative shadow-sm ring-2 ring-white">
                                        <img src={`https://i.pravatar.cc/150?u=m${idx}`} alt="User" className="w-full h-full object-cover rounded-full" />
                                        {idx === 1 && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white bg-emerald-500 rounded-full shadow-sm"></span>}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className={`text-sm font-bold truncate ${idx === 1 ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {idx === 1 ? '김철수 가이드' : idx === 2 ? '이영희 가이드' : '박지훈 가이드'}
                                            </h3>
                                            <span className={`text-[10px] shrink-0 font-medium ${idx === 1 ? 'text-accent' : 'text-slate-400'}`}>
                                                {idx === 1 ? '10:42 AM' : idx === 2 ? '어제' : '2월 10일'}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate ${idx === 1 ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                                            {idx === 1 ? '안녕하세요! 24일 투어 미팅 장소 관련해서 문의드립니다...' : '예약 확정되셨습니다. 감사합니다!'}
                                        </p>
                                    </div>
                                    {idx === 1 && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-sm shadow-accent/20 self-center shrink-0"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content - Active Chat */}
                <div className={`${isMobileChatOpen ? 'flex' : 'hidden'} sm:flex flex-1 flex-col bg-slate-50/30 relative`}>
                    {/* Chat Header */}
                    <div className="px-5 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsMobileChatOpen(false)} className="sm:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full relative shadow-sm ring-2 ring-slate-50">
                                    <img src="https://i.pravatar.cc/150?u=m1" alt="Guide" className="w-full h-full object-cover rounded-full" />
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white bg-emerald-500 rounded-full"></span>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-sm font-bold text-slate-900 leading-tight">김철수 가이드</h3>
                                    <p className="text-xs text-slate-500 font-medium">최근 접속: 방금 전</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
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

                    {/* Tour Context Snippet */}
                    <div className="bg-white border-b border-slate-200/60 px-5 py-3 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                <img src="https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=200&auto=format&fit=crop" alt="Tour" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-accent transition-colors">경복궁 프리미엄 해설 투어</h4>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                    <span className="flex items-center gap-1 font-medium"><CalendarIcon className="w-3 h-3" /> 2026.02.24</span>
                                    <span className="flex items-center gap-1 font-medium"><User className="w-3 h-3" /> 2인</span>
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0 pl-4 hidden sm:block">
                            <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded border border-emerald-100">예약 확정</span>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
                        {/* Date Divider */}
                        <div className="flex justify-center my-4 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white text-slate-500 text-[10px] font-bold px-4 py-1.5 rounded-full border border-slate-200 shadow-sm tracking-wider">
                                    2월 19일 목요일
                                </span>
                            </div>
                        </div>

                        {chatMessages.map((msg, idx) => {
                            const showAvatar = msg.sender !== 'me' && (idx === 0 || chatMessages[idx - 1].sender === 'me');
                            return (
                                <div key={msg.id} className={`flex items-end gap-2 text-sm ${msg.sender === 'me' ? 'justify-end' : ''}`}>
                                    {msg.sender !== 'me' && (
                                        <div className={`w-8 h-8 rounded-full shrink-0 mb-1 ${showAvatar ? 'bg-slate-200 shadow-sm' : 'bg-transparent'}`}>
                                            {showAvatar && <img src="https://i.pravatar.cc/150?u=m1" alt="Guide" className="w-full h-full object-cover rounded-full" />}
                                        </div>
                                    )}
                                    {msg.sender === 'me' && <span className="text-[10px] text-slate-400 font-medium mb-1 shrink-0">{msg.time}</span>}
                                    <div className={`flex flex-col gap-1 max-w-[70%] ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                        <div className={
                                            msg.sender === 'me'
                                                ? "bg-accent border border-accent/20 p-3.5 rounded-2xl rounded-br-sm shadow-sm text-white font-medium leading-relaxed"
                                                : "bg-white border border-slate-200/80 p-3.5 rounded-2xl rounded-bl-sm shadow-sm text-slate-700 leading-relaxed font-medium"
                                        }>
                                            {msg.text}
                                        </div>
                                        {msg.sender === 'me' && (
                                            <div className="flex items-center gap-1 mt-0.5 pr-1 text-slate-400">
                                                <span className="text-[10px] font-bold">읽음</span>
                                                <CheckCheck className="w-3.5 h-3.5 text-accent" />
                                            </div>
                                        )}
                                    </div>
                                    {msg.sender !== 'me' && <span className="text-[10px] text-slate-400 font-medium mb-1 shrink-0">{msg.time}</span>}
                                </div>
                            )
                        })}
                    </div>

                    {/* Input Area */}
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
                                disabled={!newMessage.trim()}
                                className="bg-accent hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 rounded-xl h-10 w-10 shrink-0 p-0 flex items-center justify-center shadow-sm transition-all"
                            >
                                <Send className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
