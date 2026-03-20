"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type TranslationMap = Record<string, string | string[]>;

function asNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function asText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(", ");
  return "";
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function pickTranslation(translation: TranslationMap | undefined, key: string, fallback: string) {
  const value = translation?.[key];
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (Array.isArray(value) && value.length > 0) {
    return value.join(", ");
  }
  return "";
}

function pickTranslationArray(translation: TranslationMap | undefined, key: string, fallback: string[]) {
  const value = translation?.[key];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  return [];
}

function buildTourPayload(formData: any, translation?: TranslationMap) {
  const titleKo = asText(formData.title);
  const descriptionKo = asText(formData.description);
  const regionKo = asText(formData.region);
  const meetingPointKo = asText(formData.meetingPoint);
  const includedItemsKo = asStringArray(formData.includedItems);

  return {
    // 기존 컬럼은 한국어 원문으로 유지합니다.
    title: titleKo,
    description: descriptionKo,
    region: regionKo,
    included_items: includedItemsKo,

    // 새 다국어 컬럼은 원문과 번역본을 함께 저장합니다.
    title_ko: titleKo,
    title_en: pickTranslation(translation, "title", titleKo),
    description_ko: descriptionKo,
    description_en: pickTranslation(translation, "description", descriptionKo),
    region_ko: regionKo,
    region_en: pickTranslation(translation, "region", regionKo),
    meeting_point_ko: meetingPointKo || null,
    meeting_point_en: pickTranslation(translation, "meetingPoint", meetingPointKo),
    included_items_ko: includedItemsKo,
    included_items_en: pickTranslationArray(translation, "includedItems", includedItemsKo),

    duration: asNumber(formData.duration),
    price: asNumber(formData.price),
    max_guests: asNumber(formData.maxGuests) || 4,
    photo: asText(formData.img),
    is_active: true,
  };
}

/**
 * 가이드가 작성한 한국어 투어 폼을 Supabase에 저장합니다.
 * translation에는 /api/translate에서 받아온 영어 번역본이 들어갑니다.
 */
export async function createTourAction(formData: any, translation?: TranslationMap) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("인증된 사용자만 투어를 등록할 수 있습니다.");
  }

  const payload = {
    ...buildTourPayload(formData, translation),
    guide_id: user.id,
  };

  const { data, error } = await supabase.from("tours").insert(payload).select().single();

  if (error) {
    console.error("Error creating tour:", error);
    throw new Error(error.message);
  }

  revalidatePath("/guide/tours");
  revalidatePath("/traveler/tours");
  revalidatePath(`/guide/tours/${data.id}`);
  revalidatePath(`/traveler/tours/${data.id}`);

  return data;
}

/**
 * 현재 가이드가 등록한 투어 목록을 가져옵니다.
 */
export async function getMyTours() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("guide_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tours:", error);
    return [];
  }

  return data;
}

/**
 * 투어 정보를 수정합니다.
 */
export async function updateTourAction(id: string, formData: any, translation?: TranslationMap) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("인증이 필요합니다.");
  }

  const payload = buildTourPayload(formData, translation);

  const { data, error } = await supabase
    .from("tours")
    .update(payload)
    .eq("id", id)
    .eq("guide_id", user.id)
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
 * 투어 공개 상태를 토글합니다.
 */
export async function toggleTourStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("인증이 필요합니다.");
  }

  const { error } = await supabase
    .from("tours")
    .update({ is_active: !currentStatus })
    .eq("id", id)
    .eq("guide_id", user.id);

  if (error) {
    console.error("Error toggling tour status:", error);
    throw new Error(error.message);
  }

  revalidatePath("/guide/tours");
}

/**
 * 특정 투어를 조회합니다.
 */
export async function getTourById(id: string) {
  const isFallback = id.startsWith("fallback-tour-");
  
  if (isFallback) {
    // Return dummy tour data for fallbacks
    const isSeoul = id.includes("seoul");
    const isBusan = id.includes("busan");
    const isJeju = id.includes("jeju");

    return {
      id,
      title_ko: isSeoul ? "서울 감성 산책 + 로컬 브런치" : isBusan ? "부산 오션뷰 드라이브 데이" : "제주 오름과 노을 루트",
      title_en: isSeoul ? "Seoul Mood Walk and Local Brunch" : isBusan ? "Busan Ocean View Drive Day" : "Jeju Oreum and Sunset Route",
      description_ko: isSeoul ? "성수와 서울숲을 천천히 걷고, 일정에 맞는 브런치까지 이어지는 코스입니다." : isBusan ? "광안리에서 해운대, 기장까지 이어지는 해안 루트와 로컬 맛집을 함께 즐깁니다." : "조용한 오름 산책부터 해안 노을 포인트까지 이어지는 하루 코스입니다.",
      description_en: isSeoul ? "A gentle route through Seongsu and Seoul Forest with a brunch stop." : isBusan ? "A scenic coastal route from Gwangalli to Haeundae and Gijang." : "A day course from quiet oreum walks to coastal sunset points.",
      region_ko: isSeoul ? "서울" : isBusan ? "부산" : "제주",
      region_en: isSeoul ? "Seoul" : isBusan ? "Busan" : "Jeju",
      duration: isSeoul ? 4 : isBusan ? 6 : 7,
      price: isSeoul ? 89000 : isBusan ? 119000 : 149000,
      photo: isSeoul 
        ? "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1400&q=80"
        : isBusan
        ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
        : "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
      guide_id: isSeoul ? "fallback-guide-seoul" : isBusan ? "fallback-guide-busan" : "fallback-guide-jeju",
      is_active: true
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("tours").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching tour by ID:", id, error);
    return null;
  }

  return data;
}
