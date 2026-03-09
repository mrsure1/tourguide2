import { createClient } from "@/lib/supabase/server";
import MainLandingClient, {
  type LandingGuide,
  type LandingTour,
} from "@/components/home/MainLandingClient";

const fallbackGuides: LandingGuide[] = [
  {
    id: "fallback-guide-seoul",
    name: "민지 가이드",
    location: "서울",
    bio: "한옥, 전통시장, 카페 골목을 가볍게 엮어 서울 하루를 설계해 드립니다.",
    languages: ["한국어", "English"],
    hourlyRate: 45000,
    rating: 4.9,
    reviewCount: 128,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    isVerified: true,
  },
  {
    id: "fallback-guide-busan",
    name: "준호 가이드",
    location: "부산",
    bio: "바다 전망, 로컬 식당, 야경 스팟 중심으로 부산의 분위기를 연결합니다.",
    languages: ["한국어", "日本語"],
    hourlyRate: 42000,
    rating: 4.8,
    reviewCount: 96,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    isVerified: true,
  },
  {
    id: "fallback-guide-jeju",
    name: "서연 가이드",
    location: "제주",
    bio: "오름, 해안 드라이브, 느린 식사까지 제주다운 동선을 제안합니다.",
    languages: ["한국어", "English"],
    hourlyRate: 50000,
    rating: 5,
    reviewCount: 74,
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80",
    isVerified: true,
  },
];

const fallbackTours: LandingTour[] = [
  {
    id: "fallback-tour-seoul",
    title: "서울 감성 산책 + 로컬 브런치",
    region: "서울",
    description: "성수와 서울숲 주변을 천천히 걷고, 취향에 맞는 브런치 스팟까지 이어지는 코스입니다.",
    duration: 4,
    price: 89000,
    photo:
      "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1400&q=80",
    guideName: "민지 가이드",
    rating: 4.9,
    reviewCount: 61,
  },
  {
    id: "fallback-tour-busan",
    title: "부산 오션뷰 드라이브 데이",
    region: "부산",
    description: "광안리, 해운대, 기장까지 이어지는 해안 드라이브와 식사 추천이 포함됩니다.",
    duration: 6,
    price: 119000,
    photo:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    guideName: "준호 가이드",
    rating: 4.8,
    reviewCount: 44,
  },
  {
    id: "fallback-tour-jeju",
    title: "제주 오름과 노을 루트",
    region: "제주",
    description: "오전 오름 산책부터 해 질 무렵 해안 포인트까지 하루를 부드럽게 연결합니다.",
    duration: 7,
    price: 149000,
    photo:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
    guideName: "서연 가이드",
    rating: 5,
    reviewCount: 39,
  },
];

type GuideDetailRow = {
  location?: string | null;
  languages?: string[] | string | null;
  bio?: string | null;
  hourly_rate?: number | null;
  rating?: number | null;
  review_count?: number | null;
  is_verified?: boolean | null;
};

type GuideRow = {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
  guides_detail?: GuideDetailRow | GuideDetailRow[] | null;
};

type TourGuideDetailRow = {
  rating?: number | null;
  review_count?: number | null;
};

type TourProfileRow = {
  full_name?: string | null;
  guides_detail?: TourGuideDetailRow | TourGuideDetailRow[] | null;
};

type TourRow = {
  id: string;
  title?: string | null;
  description?: string | null;
  region?: string | null;
  duration?: number | null;
  price?: number | null;
  photo?: string | null;
  profiles?: TourProfileRow | TourProfileRow[] | null;
};

function firstOf<T>(value: T | T[] | null | undefined): T | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profileResult = user
    ? await supabase.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle()
    : null;

  const profile = profileResult?.data ?? null;

  const { data: rawGuides } = await supabase
    .from("profiles")
    .select(
      `
      id,
      full_name,
      avatar_url,
      guides_detail (
        location,
        languages,
        bio,
        hourly_rate,
        rating,
        review_count,
        is_verified
      )
    `,
    )
    .in("role", ["guide", "admin"])
    .order("rating", { foreignTable: "guides_detail", ascending: false })
    .limit(6);

  const { data: rawTours } = await supabase
    .from("tours")
    .select(
      `
      id,
      title,
      description,
      region,
      duration,
      price,
      photo,
      profiles (
        full_name,
        guides_detail (
          rating,
          review_count
        )
      )
    `,
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const guides: LandingGuide[] =
    (rawGuides as GuideRow[] | null)?.map((guide) => {
      const detail = firstOf(guide.guides_detail);
      const languages = detail?.languages;

      return {
        id: guide.id,
        name: guide.full_name || "로컬 가이드",
        location: detail?.location || "서울",
        bio: detail?.bio || "여행 취향에 맞는 동선을 제안하는 로컬 가이드입니다.",
        languages: Array.isArray(languages)
          ? languages.filter(Boolean)
          : languages
            ? [languages]
            : ["한국어"],
        hourlyRate: typeof detail?.hourly_rate === "number" ? detail.hourly_rate : 0,
        rating: typeof detail?.rating === "number" ? detail.rating : null,
        reviewCount: typeof detail?.review_count === "number" ? detail.review_count : null,
        avatar:
          guide.avatar_url ||
          `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(guide.id)}`,
        isVerified: Boolean(detail?.is_verified),
      };
    }) || fallbackGuides;

  const tours: LandingTour[] =
    (rawTours as TourRow[] | null)?.map((tour) => {
      const profileRow = firstOf(tour.profiles);
      const guideDetail = firstOf(profileRow?.guides_detail);

      return {
        id: tour.id,
        title: tour.title || "로컬 추천 여행상품",
        region: tour.region || "서울",
        description:
          tour.description || "현지 가이드와 함께 이동 동선과 포인트를 간결하게 담은 일정입니다.",
        duration: typeof tour.duration === "number" ? tour.duration : 0,
        price: typeof tour.price === "number" ? tour.price : 0,
        photo:
          tour.photo ||
          "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
        guideName: profileRow?.full_name || "GuideMatch",
        rating: typeof guideDetail?.rating === "number" ? guideDetail.rating : null,
        reviewCount:
          typeof guideDetail?.review_count === "number" ? guideDetail.review_count : null,
      };
    }) || fallbackTours;

  const isGuide = profile?.role === "guide" || profile?.role === "admin";
  const travelerHref = user ? "/traveler/home" : "/signup?role=traveler";
  const guideHref = user && isGuide ? "/guide/dashboard" : "/signup?role=guide";

  return (
    <MainLandingClient
      userName={profile?.full_name ?? null}
      travelerHref={travelerHref}
      guideHref={guideHref}
      guides={guides.length > 0 ? guides : fallbackGuides}
      tours={tours.length > 0 ? tours : fallbackTours}
    />
  );
}
