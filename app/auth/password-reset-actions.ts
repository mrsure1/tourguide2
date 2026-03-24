'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getSiteOriginFromHeaders } from '@/lib/site-origin'

export async function requestPasswordReset(email: string) {
  const trimmed = email?.trim() ?? ''
  if (!trimmed) {
    return { success: false as const, message: '이메일 주소를 입력해주세요.' }
  }

  const headersList = await headers()
  const origin = getSiteOriginFromHeaders(headersList)
  const redirectTo = `${origin}/auth/callback?next=/update-password`

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
    redirectTo,
  })

  if (error) {
    console.error('[requestPasswordReset]', { message: error.message, status: error.status, redirectTo })
    return {
      success: false as const,
      message: error.message,
      status: error.status,
    }
  }

  return { success: true as const }
}
