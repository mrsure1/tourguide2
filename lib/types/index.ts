export type Role = "traveler" | "guide" | "admin";

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
  title_ko?: string;
  title_en?: string;
  description: string;
  description_ko?: string;
  description_en?: string;
  region: string;
  region_ko?: string;
  region_en?: string;
  meeting_point_ko?: string;
  meeting_point_en?: string;
  duration: number;
  price: number;
  style: string[];
  language: string[];
  photo?: string;
  included_items?: string[];
  included_items_ko?: string[];
  included_items_en?: string[];
}

export interface GuideAvailability {
  id: string;
  guideId: string;
  date: string;
  startTime: string;
  endTime: string;
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
