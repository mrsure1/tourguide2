import { Suspense } from "react"
import Image, { type ImageLoaderProps } from "next/image"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getRequestLocale } from "@/lib/i18n/get-request-locale"
import { getDictionary } from "@/lib/i18n/dictionary"
import { localizeLanguageList, localizeLocationLabel } from "@/lib/i18n/display"
import BookingWidgetErrorBoundary from "./BookingWidgetErrorBoundary"
import BookingWidgetClient from "./BookingWidgetClient"

type Review = {
    id: string
    rating: number
    content: string
    created_at: string
    traveler?: {
        full_name?: string | null
        avatar_url?: string | null
    } | null
}

function passthroughLoader({ src }: ImageLoaderProps) {
    return src
}

export default async function GuideDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const locale = await getRequestLocale()
    const messages = await getDictionary(locale)
    const t = messages.landing.guideDetail
    const cardT = messages.landing.card
    
    const supabase = await createClient()
    
    // UUID validation to prevent SQL errors on non-UUID strings
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isFallback = id.startsWith("fallback-");

    if (!uuidRegex.test(id) && !isFallback) {
        console.warn(`[GuideDetail] Invalid guide ID format: ${id}. Redirecting to 404.`);
        notFound();
    }

    let guide: any = null;
    let gd: any = {};

    try {
        if (isFallback) {
            console.info(`[GuideDetail] Using fallback data for ID: ${id}`);
            // Provide consistent fallback data matching app/page.tsx
            const isSeoul = id.includes("seoul");
            const isBusan = id.includes("busan");
            const isJeju = id.includes("jeju");

            guide = {
                id,
                full_name: locale === "ko" 
                    ? (isSeoul ? "민�? 가?�드" : isBusan ? "준??가?�드" : "?�연 가?�드")
                    : (isSeoul ? "Minji Guide" : isBusan ? "Junho Guide" : "Seoyeon Guide"),
                avatar_url: isSeoul 
                    ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
                    : isBusan
                    ? "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=80"
                    : "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80"
            };

            gd = {
                location: isSeoul ? "Seoul" : isBusan ? "Busan" : "Jeju",
                languages: ["Korean", "English"],
                bio: locale === "ko"
                    ? "로컬 ?�활??가?�드???�여?�는 ?�행 ?�문가?�니??"
                    : "A local travel expert who blends daily life into your journey.",
                hourly_rate: isSeoul ? 45000 : isBusan ? 50000 : 55000,
                rating: isSeoul ? 4.9 : isBusan ? 5.0 : 4.8,
                review_count: isSeoul ? 128 : isBusan ? 74 : 39,
                is_verified: true,
                rate_type: "hourly"
            };
        } else {
            console.info(`[GuideDetail] Fetching guide data for ID: ${id}, Locale: ${locale}`);
            const { data: dbGuide, error } = await supabase
                .from("profiles")
                .select(`
                    id,
                    full_name,
                    avatar_url,
                    guides_detail (*)
                `)
                .eq("id", id)
                .single()

            if (error || !dbGuide) {
                console.error("[GuideDetail] Supabase profiles query error or null:", error);
                notFound();
            }
            
            guide = dbGuide;
            gd = (Array.isArray(guide.guides_detail) ? guide.guides_detail[0] : guide.guides_detail || {})
        }

        const localizedBio = locale === "ko"
            ? gd.bio_i18n?.ko || gd.bio
            : gd.bio_i18n?.en || gd.bio || "A local guide who knows the route well."

        const languagesList = localizeLanguageList(gd.languages, locale)
        
        const languagesString = languagesList.length > 0 ? languagesList.join(", ") : locale === "ko" ? "?�국?? : "English"
        const localizedLocation = localizeLocationLabel(gd.location || "", locale)

        let unavailabilities: any[] = []
        try {
            const { data: availData, error: availError } = await supabase
                .from("availability")
                .select("*")
                .eq("guide_id", guide.id)
            
            if (!availError && availData) {
                unavailabilities = availData
            }
        } catch (e) {
            console.error("[GuideDetail] Availability query exception:", e)
        }

        // 리뷰 조회 (traveler 조인 ?�패 ??fallback)
        let reviews: Review[] | null = null
        try {
            const { data: reviewData, error: reviewError } = await supabase
                .from("reviews")
                .select(`
                    id,
                    rating,
                    content,
                    created_at,
                    traveler: traveler_id (
                        full_name,
                        avatar_url
                    )
                `)
                .eq("guide_id", guide.id)
                .order("created_at", { ascending: false })
                .limit(10)

            if (reviewError) {
                // 조인 ?�패 ??traveler ?�이 리뷰�?가?�옴
                console.warn("[GuideDetail] Reviews join failed, falling back:", reviewError.message)
                const { data: fallbackData } = await supabase
                    .from("reviews")
                    .select("id, rating, content, created_at")
                    .eq("guide_id", guide.id)
                    .order("created_at", { ascending: false })
                    .limit(10)
                reviews = (fallbackData as Review[]) || null
            } else {
                reviews = (reviewData as Review[]) || null
            }
        } catch (e) {
            console.error("[GuideDetail] Reviews query exception:", e)
        }

        return (
        <div className="mx-auto max-w-6xl animate-fade-in px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    <section className="flex flex-col items-start gap-6 sm:flex-row">
                        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl bg-slate-200 shadow-md sm:h-40 sm:w-40">
                            <Image
                                src={
                                    guide.avatar_url ||
                                    `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(guide.full_name || "G")}`
                                }
                                alt={t.avatarAlt}
                                loader={passthroughLoader}
                                unoptimized
                                width={160}
                                height={160}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center rounded-lg bg-white/90 px-2 py-1 text-center text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm">
                                <span className="mr-1 text-sm text-amber-400">??/span>
                                {gd.rating || cardT.new} ({gd.review_count || 0})
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                    {guide.full_name || t.anonymousTraveler}
                                </h1>
                                {gd.is_verified && (
                                    <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-accent">
                                        <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {cardT.verified}
                                    </span>
                                )}
                            </div>
                            <p className="mb-4 text-lg font-light text-slate-500">
                                {t.expertGuide.replace("{location}", localizedLocation)}
                            </p>

                            <div className="mb-4 flex flex-wrap gap-2">
                                <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                    {t.locationFormat.replace("{location}", localizedLocation)}
                                </span>
                                <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                    {t.languagesFormat.replace("{languages}", languagesString)}
                                </span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-4 text-xl font-bold text-slate-900">{t.introductionTitle}</h2>
                        <div className="prose prose-slate max-w-none whitespace-pre-wrap font-light text-slate-600 prose-p:leading-relaxed">
                            {localizedBio || t.noBio}
                        </div>
                    </section>

                    <section className="border-t border-slate-100 pt-8">
                        <div className="mb-6 flex items-center gap-3">
                            <h2 className="text-xl font-bold text-slate-900">{t.reviewTitle}</h2>
                            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1">
                                <span className="text-sm font-bold text-amber-600">??{gd.rating || 0}</span>
                                <span className="text-xs text-amber-600/70">({gd.review_count || 0})</span>
                            </div>
                        </div>

                        {reviews && reviews.length > 0 ? (
                            <div className="space-y-6">
                                {reviews.map((review) => {
                                    const traveler = review.traveler || {}

                                    return (
                                        <div
                                            key={review.id}
                                            className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6"
                                        >
                                            <div className="mb-4 flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={
                                                            traveler.avatar_url ||
                                                            `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${encodeURIComponent(traveler.full_name || "T")}`
                                                        }
                                                        alt={t.anonymousTraveler}
                                                        loader={passthroughLoader}
                                                        unoptimized
                                                        width={40}
                                                        height={40}
                                                        className="h-10 w-10 rounded-full border border-slate-200 shadow-sm"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">
                                                            {traveler.full_name || t.anonymousTraveler}
                                                        </p>
                                                        <p className="text-xs text-slate-500">
                                                            {new Date(review.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, index) => (
                                                        <span
                                                            key={index}
                                                            className={`text-lg ${index < review.rating ? "text-amber-400" : "text-slate-200"}`}
                                                        >
                                                            ??                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                                                {review.content}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-100 bg-slate-50 py-12 text-center">
                                <p className="text-sm text-slate-500 whitespace-pre-wrap">
                                    {t.noReview}
                                </p>
                            </div>
                        )}
                    </section>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <BookingWidgetErrorBoundary>
                            <Suspense fallback={<div className="p-8 text-center text-slate-500">{t.loadingBooking}</div>}>
                                <BookingWidgetClient
                                    guideId={guide.id}
                                    isProfileComplete={true}
                                    rateType={gd.rate_type || "daily"}
                                    hourlyRate={Number(gd.hourly_rate || 150000)}
                                    unavailableDates={unavailabilities || []}
                                />
                            </Suspense>
                        </BookingWidgetErrorBoundary>
                    </div>
                </div>
            </div>
        </div>
    )
    } catch (error) {
        console.error("[GuideDetail] Fatal error:", error);
        return <div>Error loading guide detail.</div>;
    }
}
