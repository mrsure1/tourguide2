"use server"

import { createClient } from "@/lib/supabase/server"

export async function getGuideData(id: string) {
    const supabase = await createClient()

    // 1. 프로필 정보
    const { data: profile, error: pError } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, role")
        .eq("id", id)
        .maybeSingle()

    if (pError || !profile) return null

    // 2. 상세 정보
    const { data: detail } = await supabase
        .from("guides_detail")
        .select("*")
        .eq("id", id)
        .maybeSingle()

    // 3. 예약 불가 일정
    const { data: availability } = await supabase
        .from("guide_availability")
        .select("start_date")
        .eq("guide_id", id)

    return {
        profile,
        detail: detail || {},
        unavailabilities: availability || []
    }
}

export async function getGuideReviews(id: string) {
    const supabase = await createClient()

    // 운영 환경 DB 스키마에 맞춰 'reviews' 테이블 및 'content' 컬럼 사용
    const { data: reviews, error: rError } = await supabase
        .from("reviews")
        .select("*")
        .eq("guide_id", id)
        .order("created_at", { ascending: false })
        .limit(5)

    if (rError) {
        console.error("[getGuideReviews] Error:", rError)
        return []
    }

    return reviews || []
}
