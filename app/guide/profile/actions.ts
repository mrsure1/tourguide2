"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const fullName = formData.get('full_name') as string
    const avatarUrl = formData.get('avatar_url') as string
    const bio = formData.get('bio') as string
    const location = formData.get('location') as string
    const languagesStr = formData.get('languages') as string
    const languages = languagesStr ? languagesStr.split(',').map(s => s.trim()).filter(Boolean) : []
    const hourlyRate = Number(formData.get('hourly_rate')) || 0;
    const rateType = (formData.get('rate_type') as string) || 'daily';

    // Update profiles
    const { error: profileError } = await supabase
        .from('profiles')
        .update({
            full_name: fullName,
            avatar_url: avatarUrl
        })
        .eq('id', user.id)

    if (profileError) return { error: profileError.message }

    // Update or insert guides_detail
    const { error: guideError } = await supabase
        .from('guides_detail')
        .upsert({
            id: user.id,
            bio,
            location,
            languages,
            hourly_rate: hourlyRate,
            rate_type: rateType
        })

    if (guideError) return { error: guideError.message }

    revalidatePath('/guide/profile')
    revalidatePath('/guide/dashboard')
    revalidatePath('/traveler/search')
    revalidatePath(`/traveler/guides/${user.id}`)

    return { success: true }
}
