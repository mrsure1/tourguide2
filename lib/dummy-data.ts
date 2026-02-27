import { User, GuideProfile, Tour, GuideAvailability, TravelerPlan } from "./types";

export const dummyUsers: User[] = [
    {
        id: "u1",
        email: "traveler1@example.com",
        role: "traveler",
        name: "John Doe",
        photo: "https://i.pravatar.cc/150?u=u1",
        language: ["English"],
        createdAt: "2023-01-01T00:00:00Z"
    },
    {
        id: "g1",
        email: "guide1@example.com",
        role: "guide",
        name: "김철수",
        photo: "https://i.pravatar.cc/150?u=g1",
        language: ["Korean", "English"],
        createdAt: "2023-01-02T00:00:00Z"
    },
    {
        id: "g2",
        email: "guide2@example.com",
        role: "guide",
        name: "이영희",
        photo: "https://i.pravatar.cc/150?u=g2",
        language: ["Korean", "Japanese"],
        createdAt: "2023-01-03T00:00:00Z"
    }
];

export const dummyGuideProfiles: GuideProfile[] = [
    {
        id: "gp1",
        userId: "g1",
        bio: "서울의 역사와 문화를 깊이있게 영어로 설명해드리는 5년차 전문 가이드입니다.",
        region: ["서울"],
        languages: ["Korean", "English"],
        styles: ["역사/문화", "도보 투어"],
        verified: true,
        rating: 4.8,
        reviewCount: 120
    },
    {
        id: "gp2",
        userId: "g2",
        bio: "부산의 맛집과 핫플을 안내해드리는 트렌디한 투어 가이드입니다!",
        region: ["부산"],
        languages: ["Korean", "Japanese"],
        styles: ["식도락", "사진촬영"],
        verified: true,
        rating: 4.9,
        reviewCount: 85
    }
];

export const dummyTours: Tour[] = [
    {
        id: "t1",
        guideId: "g1",
        title: "경복궁 및 북촌 도보 투어 (영어진행)",
        description: "왕실의 역사와 북촌 한옥마을의 아름다움을 영어 전문 가이드와 함께 체험하세요.",
        region: "서울",
        duration: 4,
        price: 80000,
        style: ["역사/문화", "도보 투어"],
        language: ["English"],
        photo: "https://images.unsplash.com/photo-1546874177-9e664107314e?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "t2",
        guideId: "g2",
        title: "부산 해운대 및 광안리 야경 투어",
        description: "로컬들이 사랑하는 맛집 방문과 아름다운 부산의 야경 코스를 둘러봅니다.",
        region: "부산",
        duration: 5,
        price: 95000,
        style: ["식도락", "야간 투어", "사진촬영"],
        language: ["Japanese"],
        photo: "https://images.unsplash.com/photo-1594916848149-114af1dbe1d0?q=80&w=800&auto=format&fit=crop"
    }
];

// 2026-02-25~28 예시 데이터
export const dummyAvailability: GuideAvailability[] = [
    { id: "a1", guideId: "g1", date: "2026-02-25", startTime: "09:00", endTime: "13:00", status: "available" },
    { id: "a2", guideId: "g1", date: "2026-02-26", startTime: "14:00", endTime: "18:00", status: "booked" },
    { id: "a3", guideId: "g1", date: "2026-02-27", startTime: "09:00", endTime: "13:00", status: "available" },
    { id: "a4", guideId: "g2", date: "2026-02-25", startTime: "18:00", endTime: "22:00", status: "available" },
    { id: "a5", guideId: "g2", date: "2026-02-26", startTime: "18:00", endTime: "22:00", status: "available" }
];

export const dummyTravelerPlans: TravelerPlan[] = [
    {
        id: "tp1",
        userId: "u1",
        region: "서울",
        startDate: "2026-02-24",
        endDate: "2026-02-28",
        language: ["English"],
        style: ["역사/문화", "식도락"],
        budget: 200000
    }
];
