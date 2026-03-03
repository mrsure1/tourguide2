"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * 새로운 투어 상품을 생성합니다.
 */
export async function createTourAction(formData: any) {
    const supabase = await createClient();

    // 현재 사용자 세션 확인
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error("인증된 사용자만 투어를 등록할 수 있습니다.");
    }

    // 금액에서 콤마 제거 및 숫자로 변환
    const priceNumber = parseInt(formData.price.replace(/,/g, ''), 10);
    const durationNumber = parseInt(formData.duration.replace(/[^0-9]/g, ''), 10);

    const { data, error } = await supabase
        .from('tours')
        .insert({
            guide_id: user.id,
            title: formData.title,
            description: formData.description,
            region: formData.region,
            duration: durationNumber,
            price: priceNumber,
            max_guests: parseInt(formData.maxGuests, 10),
            photo: formData.img,
            included_items: formData.includedItems,
            is_active: true
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating tour:", error);
        throw new Error(error.message);
    }

    // 목록 및 상세 페이지 캐시 갱신
    revalidatePath("/guide/tours");
    revalidatePath("/traveler/tours");
    revalidatePath(`/guide/tours/${data.id}`);
    revalidatePath(`/traveler/tours/${data.id}`);

    return data;
}

/**
 * 현재 가이드의 투어 목록을 조회합니다.
 */
export async function getMyTours() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('guide_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching tours:", error);
        return [];
    }

    return data;
}

/**
 * 투어 정보를 업데이트합니다.
 */
export async function updateTourAction(id: string, formData: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("인증이 필요합니다.");

    const priceNumber = typeof formData.price === 'string'
        ? parseInt(formData.price.replace(/,/g, ''), 10)
        : formData.price;
    const durationNumber = typeof formData.duration === 'string'
        ? parseInt(formData.duration.replace(/[^0-9]/g, ''), 10)
        : formData.duration;

    const { data, error } = await supabase
        .from('tours')
        .update({
            title: formData.title,
            description: formData.description,
            region: formData.region,
            duration: durationNumber,
            price: priceNumber,
            max_guests: parseInt(formData.maxGuests, 10),
            photo: formData.img,
            included_items: formData.includedItems
        })
        .eq('id', id)
        .eq('guide_id', user.id)
        .select()
        .single();

    if (error) {
        console.error("Error updating tour:", error);
        throw new Error(error.message);
    }

    revalidatePath("/guide/tours");
    revalidatePath("/traveler/tours");
    revalidatePath(`/guide/tours/${id}`);
    revalidatePath(`/traveler/tours/${id}`);

    return data;
}

/**
 * 투어의 활성 상태를 토글합니다.
 */
export async function toggleTourStatus(id: string, currentStatus: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("인증이 필요합니다.");

    const { error } = await supabase
        .from('tours')
        .update({ is_active: !currentStatus })
        .eq('id', id)
        .eq('guide_id', user.id);

    if (error) {
        console.error("Error toggling tour status:", error);
        throw new Error(error.message);
    }

    revalidatePath("/guide/tours");
}

/**
 * 특정 투어 정보를 조회합니다.
 */
export async function getTourById(id: string) {
    console.log("🔥 [getTourById] Received ID:", id);
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("🔥 [getTourById] Error fetching tour by ID:", id, error);
        return null;
    }

    console.log("🔥 [getTourById] Found tour:", data?.title);
    return data;
}
