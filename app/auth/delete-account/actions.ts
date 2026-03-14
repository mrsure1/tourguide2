'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function deleteAccount() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: '로그인이 필요합니다.' }
    }

    const adminClient = createAdminClient()

    // 1. Auth 계정 삭제 (이 행위는 연쇄적으로 profiles 테이블의 데이터도 삭제할 수 있지만, 
    // 트리거 설정에 따라 다를 수 있으므로 명시적으로 profiles부터 처리할 수도 있음.
    // 하지만 auth.users 삭제가 핵심임.)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id)

    if (deleteError) {
        console.error('Error deleting user account:', deleteError)
        return { error: '계정 삭제 중 오류가 발생했습니다: ' + deleteError.message }
    }

    // 2. 세션 로그아웃 (서버사이드 쿠키 정리)
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    
    // 3. 홈 화면으로 리다이렉트 (클라이언트에서 처리할 수도 있지만 서버 액션에서 시도)
    return { success: true }
}
