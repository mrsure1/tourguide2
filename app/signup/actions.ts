'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('password-confirm') as string
    const fullName = formData.get('name') as string
    const role = formData.get('role') as string || 'traveler'

    if (password !== confirmPassword) {
        return redirect('/signup?message=Passwords do not match')
    }

    // 1. 회원가입
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                role: role,
            }
        }
    })

    if (error) {
        return redirect('/signup?message=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    // Depending on email confirmation settings, user might need to check email.
    // For now, redirect to login with success message.
    redirect('/login?message=Check your email to continue sign in process')
}
