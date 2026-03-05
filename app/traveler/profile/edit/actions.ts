"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateTravelerProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const fullName = formData.get('full_name') as string
    const avatarUrl = formData.get('avatar_url') as string
    const emailNotifications = formData.get('email_notifications') === 'on'
    const pushNotifications = formData.get('push_notifications') === 'on'

    // Update profiles
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name: fullName,
            avatar_url: avatarUrl,
            // 알림 설정을 settings JSON 컬럼에 저장 (없을 경우를 대비해 스키마 확장 가능성 고려)
            settings: {
                notifications: {
                    email: emailNotifications,
                    push: pushNotifications
                }
            }
        })
        .eq('id', user.id)

    if (profileError) {
        // settings 컬럼이 없는 경우를 대비해 기본 정보만 다시 업데이트 시도 (안정성 확보)
        console.warn("Settings column might be missing, retrying with basic info only");
        const { error: retryError } = await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                avatar_url: avatarUrl
            })
            .eq('id', user.id)

        if (retryError) return { error: retryError.message }
    }

    // 캐시 무효화 및 해당 프로필 페이지로 이동
    revalidatePath('/traveler/profile')
    revalidatePath('/guide/dashboard')

    return { success: true }
}
