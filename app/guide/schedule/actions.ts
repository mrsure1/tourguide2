"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addUnavailableDate(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const rawDate = formData.get('date') as string // YYYY-MM-DD
    const reason = formData.get('reason') as string || '휴무'

    if (!rawDate) return { error: 'Missing date' }

    const { error } = await supabase.from('availability').insert({
        guide_id: user.id,
        start_date: rawDate,
        end_date: rawDate,
        reason
    })

    if (error) return { error: error.message }
    revalidatePath('/guide/schedule')
    return { success: true }
}

export async function addUnavailableDates(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const datesJson = formData.get('dates') as string // JSON array of YYYY-MM-DD
    const reason = formData.get('reason') as string || '휴무'

    if (!datesJson) return { error: 'Missing dates' }

    try {
        const dates = JSON.parse(datesJson) as string[]
        if (!Array.isArray(dates) || dates.length === 0) return { error: 'Invalid dates format' }

        const inserts = dates.map(date => ({
            guide_id: user.id,
            start_date: date,
            end_date: date,
            reason
        }))

        const { error } = await supabase.from('availability').insert(inserts)
        if (error) return { error: error.message }

        revalidatePath('/guide/schedule')
        return { success: true }
    } catch (e) {
        return { error: 'Failed to parse dates' }
    }
}

export async function removeUnavailableDate(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const id = formData.get('id') as string

    if (!id) return { error: 'Missing id' }

    const { error } = await supabase.from('availability').delete().eq('id', id).eq('guide_id', user.id)

    if (error) return { error: error.message }
    revalidatePath('/guide/schedule')
    return { success: true }
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const fullName = formData.get('full_name') as string
    const avatarUrl = formData.get('avatar_url') as string

    const updates: any = {}
    if (fullName) updates.full_name = fullName
    // Check if avatar_url key exists in formData
    if (formData.has('avatar_url')) updates.avatar_url = avatarUrl

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/guide/dashboard')
    revalidatePath('/guide/profile')
    return { success: true }
}
