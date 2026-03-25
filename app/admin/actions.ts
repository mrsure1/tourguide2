"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { isAdminProfile } from "@/lib/auth/admin"

/**
 * 사용자 권한(Role) 변경
 */
export async function updateUserRole(userId: string, newRole: string) {
    const supabase = await createClient()

    // 관리자 권한 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: '인증되지 않았습니다.' }

    const { data: adminProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!isAdminProfile(adminProfile, user.email)) {
        return { error: '권한이 없습니다.' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

    if (error) return { error: error.message }

    revalidatePath('/admin/users')
    return { success: true }
}

/**
 * 가이드 승인 처리
 */
export async function approveGuide(guideId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: '인증되지 않았습니다.' }

    const { error } = await supabase
        .from('guides_detail')
        .update({ is_verified: true })
        .eq('id', guideId)

    if (error) return { error: error.message }

    revalidatePath('/admin/guides')
    revalidatePath('/traveler/search')
    return { success: true }
}

/**
 * 가이드 승인 거절 (상세 정보 삭제 또는 상태 변경)
 * 여기서는 상세 정보를 삭제하지 않고 is_verified를 false로 유지하거나 
 * 특별한 처리가 필요할 경우 확장 가능
 */
export async function rejectGuide(guideId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: '인증되지 않았습니다.' }

    // 단순히 is_verified를 false로 확정 (이미 false일 수 있음)
    const { error } = await supabase
        .from('guides_detail')
        .update({ is_verified: false })
        .eq('id', guideId)

    if (error) return { error: error.message }

    revalidatePath('/admin/guides')
    return { success: true }
}
