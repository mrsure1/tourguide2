export type Role = "traveler" | "guide";

export interface User {
    id: string;
    email: string;
    role: Role;
    name: string;
    photo?: string;
    language?: string[];
    createdAt: string;
}

export interface GuideProfile {
    id: string;
    userId: string;
    bio: string;
    region: string[];
    languages: string[];
    styles: string[];
    verified: boolean;
    rating: number;
    reviewCount: number;
}

export interface Tour {
    id: string;
    guideId: string;
    title: string;
    description: string;
    region: string;
    duration: number; // 시간 단위
    price: number;
    style: string[];
    language: string[];
    photo?: string;
}

export interface GuideAvailability {
    id: string;
    guideId: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    status: "available" | "booked" | "unavailable";
}

export interface TravelerPlan {
    id: string;
    userId: string;
    region: string;
    startDate: string;
    endDate: string;
    language: string[];
    style: string[];
    budget: number;
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "canceled";

export interface Booking {
    id: string;
    tourId: string;
    guideId: string;
    travelerId: string;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
    status: BookingStatus;
}
