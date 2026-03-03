"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LogoutButtonProps {
    variant?: "primary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    className?: string;
    showText?: boolean;
}

export function LogoutButton({
    variant = "ghost",
    size = "md",
    className = "",
    showText = true
}: LogoutButtonProps) {
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error.message);
            alert("로그아웃 중 오류가 발생했습니다.");
        } else {
            router.push("/login");
            router.refresh();
        }
    };

    return (
        <Button
            variant={variant as any}
            size={size}
            onClick={handleLogout}
            className={`flex items-center gap-2 ${className}`}
        >
            <LogOut className="w-4 h-4" />
            {showText && <span>로그아웃</span>}
        </Button>
    );
}
