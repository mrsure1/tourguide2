"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, Shield, User as UserIcon, Trash2, Search, Filter } from "lucide-react";
import { updateUserRole } from "../actions";

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: string;
    avatar_url: string;
    created_at: string;
}

export default function UsersClient({ initialUsers }: { initialUsers: UserProfile[] }) {
    const [users, setUsers] = useState<UserProfile[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!confirm(`사용자의 역할을 ${newRole}(으)로 변경하시겠습니까?`)) return;

        setLoadingId(userId);
        const result = await updateUserRole(userId, newRole);
        setLoadingId(null);

        if (result.success) {
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            alert("역할이 성공적으로 변경되었습니다.");
        } else {
            alert(result.error || "변경에 실패했습니다.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-600" />
                        사용자 관리
                    </h1>
                    <p className="text-slate-500 mt-1">시스템의 모든 사용자를 조회하고 권한을 관리합니다.</p>
                </div>
            </header>

            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-md">
                <CardHeader className="border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="이름 또는 이메일 검색..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-500" />
                        <select
                            className="bg-slate-50 border border-slate-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">모든 역할</option>
                            <option value="traveler">여행자 (Traveler)</option>
                            <option value="guide">가이드 (Guide)</option>
                            <option value="admin">관리자 (Admin)</option>
                        </select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">사용자</th>
                                    <th className="px-6 py-4">역할</th>
                                    <th className="px-6 py-4">가입일</th>
                                    <th className="px-6 py-4 text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user.avatar_url || "https://i.pravatar.cc/150"}
                                                    alt={user.full_name}
                                                    className="w-10 h-10 rounded-full object-cover bg-slate-100 border border-slate-200 shadow-sm"
                                                />
                                                <div>
                                                    <p className="font-bold text-slate-900">{user.full_name || '이름 없음'}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 ring-purple-700/10' :
                                                    user.role === 'guide' ? 'bg-emerald-100 text-emerald-700 ring-emerald-700/10' :
                                                        'bg-blue-100 text-blue-700 ring-blue-700/10'
                                                }`}>
                                                {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <select
                                                    className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    disabled={loadingId === user.id}
                                                >
                                                    <option value="traveler">Traveler</option>
                                                    <option value="guide">Guide</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-slate-400">
                                            검색 결과가 없습니다.
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
