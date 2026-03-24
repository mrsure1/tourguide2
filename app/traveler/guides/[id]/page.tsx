import { notFound, unstable_rethrow } from "next/navigation"
import { getRequestLocale } from "@/lib/i18n/get-request-locale"
import { getDictionary } from "@/lib/i18n/dictionary"
import { localizeLanguageList, localizeLocationLabel } from "@/lib/i18n/display"
import { getGuideData, getGuideReviews } from "@/app/traveler/guides/actions"
import { translateBioToEnglish } from "@/lib/i18n/translate-bio"
import GuideDetailClient from "./GuideDetailClient"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function GuideDetail({ params }: { params: Promise<{ id: string }> }) {
    let locale: any = "ko"
    let messages: any = {}
    let t: any = {}

    try {
        const { id } = await params
        
        // 1. i18n 로딩
        try {
            locale = (await getRequestLocale()) || "ko"
            messages = await getDictionary(locale)
            t = messages.landing?.guideDetail || {}
        } catch (e) {
            console.error("[GuideDetail] i18n failed", e)
        }

        const isFallback = id.startsWith("fallback-")
        let guide: any = null
        let gd: any = {}
        let unavailabilities: any[] = []
        let reviews: any[] = []

        if (isFallback) {
            const isSeoul = id.includes("seoul")
            const isBusan = id.includes("busan")
            guide = {
                id,
                full_name: isSeoul ? "박성진 (James)" : isBusan ? "이소연 (Soyeon)" : "김지나 (Gina)",
                avatar_url: null,
                role: "guide"
            }
            gd = {
                location: isSeoul ? (locale === "en" ? "Seoul" : "서울") : isBusan ? (locale === "en" ? "Busan" : "부산") : (locale === "en" ? "Jeju" : "제주"),
                languages: ["한국어", "영어"],
                bio: locale === "ko"
                    ? "로컬 생활을 가이드에 녹여내는 여행 전문가입니다. 당신의 여행을 더욱 특별하게 만들어 드립니다."
                    : "A local travel expert who blends daily life into your journey, making your trip truly special.",
                hourly_rate: isSeoul ? 45000 : isBusan ? 50000 : 55000,
                rating: isSeoul ? 4.9 : isBusan ? 5.0 : 4.8,
                review_count: isSeoul ? 128 : isBusan ? 74 : 39,
                is_verified: true,
                rate_type: isSeoul ? "hourly" : "daily"
            }
        } else {
            const data = await getGuideData(id)
            if (!data) notFound()

            guide = data.profile
            gd = data.detail
            unavailabilities = data.unavailabilities
            reviews = await getGuideReviews(id)
        }

        let localizedBio = gd.bio;
        if (locale === "ko") {
            localizedBio = gd.bio_i18n?.ko || gd.bio;
        } else if (locale === "en") {
            if (gd.bio_i18n?.en) {
                localizedBio = gd.bio_i18n.en;
            } else if (gd.bio && !isFallback) {
                localizedBio = await translateBioToEnglish(gd.bio);
            } else if (isFallback) {
                localizedBio = gd.bio;
            } else {
                localizedBio = "A local guide who knows the route well.";
            }
        }

        const languagesList = localizeLanguageList(gd.languages, locale)
        const languagesString = languagesList.length > 0 ? languagesList.join(", ") : (locale === "en" ? "Korean" : "한국어")
        const formattedLocation = gd.location ? localizeLocationLabel(gd.location, locale) : (locale === "en" ? "South Korea" : "한국")

        return (
            <GuideDetailClient 
                guide={guide}
                gd={gd}
                unavailabilities={unavailabilities}
                reviews={reviews}
                t={t}
                locale={locale}
                formattedLocation={formattedLocation}
                languagesString={languagesString}
                localizedBio={localizedBio}
            />
        )
    } catch (error) {
        unstable_rethrow(error)
        console.error("[GuideDetail] Fatal Error:", error)
        
        // Fail-safe view
        return (
            <div className="p-20 text-center">
                <h1 className="text-2xl font-bold text-slate-900 mb-4">페이지를 로드할 수 없습니다.</h1>
                <p className="text-slate-500 mb-8">서버와의 연결이 원활하지 않거나 데이터가 존재하지 않습니다.</p>
                <Link href="/" className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold">홈으로 가기</Link>
            </div>
        )
    }
}
