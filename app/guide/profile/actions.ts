"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function translateBioToEnglish(bio: string) {
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "")
    try {
        const response = await fetch(new URL("/api/translate", siteUrl), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fields: {
                    bio,
                },
            }),
            cache: "no-store",
        })

        if (!response.ok) {
            return ""
        }

        const data = await response.json()
        const translated = data?.translations?.bio

        if (typeof translated !== "string" || !translated.trim()) {
            return ""
        }

        return translated.trim()
    } catch {
        return ""
    }
}

async function supportsGuideBioI18n(supabase: Awaited<ReturnType<typeof createClient>>) {
    const { error } = await supabase
        .from('guides_detail')
        .select('bio_i18n')
        .limit(1)

    return !error
}

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
    const bioKo = bio.trim();
    const canStoreBioI18n = await supportsGuideBioI18n(supabase);
    const bioEn = bioKo && canStoreBioI18n ? await translateBioToEnglish(bioKo) : "";

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
            bio: bioKo,
            location,
            languages,
            hourly_rate: hourlyRate,
            rate_type: rateType,
            ...(canStoreBioI18n && bioKo
                ? {
                    bio_i18n: {
                        ko: bioKo,
                        en: bioEn,
                    },
                }
                : {})
        })

    if (guideError) return { error: guideError.message }

    revalidatePath('/guide/profile')
    revalidatePath('/guide/dashboard')
    revalidatePath('/traveler/search')
    revalidatePath('/')
    revalidatePath(`/traveler/guides/${user.id}`)

    return { success: true }
}
