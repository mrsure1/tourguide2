'use server';

import { createClient } from "@/lib/supabase/server";

export async function fetchToursAction({
    keyword = "",
    page = 0,
    pageSize = 10
}: {
    keyword?: string,
    page?: number,
    pageSize?: number
}) {
    const supabase = await createClient();
    const from = page * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
        .from('tours')
        .select(`
            *,
            title_en,
            description_en,
            region_en,
            profiles (
                full_name,
                avatar_url,
                guides_detail (
                    rating,
                    review_count,
                    languages
                )
            )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
    .range(from, to);

    if (keyword) {
        // 여행자 화면은 영어 컬럼을 우선 검색합니다.
        query = query.or(
            `title_en.ilike.%${keyword}%,description_en.ilike.%${keyword}%,region_en.ilike.%${keyword}%,title.ilike.%${keyword}%,description.ilike.%${keyword}%,region.ilike.%${keyword}%`
        );
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching tours:", error);
        return [];
    }

    return data || [];
}
