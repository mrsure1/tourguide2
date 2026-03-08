import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { booking_id, guide_id, rating, review } = body;

        if (!booking_id || !guide_id || !rating || !review) {
            return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: any) {
                        cookieStore.set(name, value, options);
                    },
                    remove(name: string, options: any) {
                        cookieStore.delete({ name, ...options });
                    },
                },
            }
        );

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "인증되지 않은 사용자입니다." }, { status: 401 });
        }

        // 중복 리뷰 확인 (동일한 booking_id)
        const { data: existingReview, error: checkError } = await supabase
            .from("reviews")
            .select("id")
            .eq("booking_id", booking_id)
            .maybeSingle();
            
        if (existingReview) {
            return NextResponse.json({ error: "이미 이 투어에 대한 리뷰를 작성하셨습니다." }, { status: 400 });
        }

        // 리뷰 저장
        const { error: insertError } = await supabase
            .from("reviews")
            .insert({
                booking_id: booking_id,
                guide_id: guide_id,
                traveler_id: user.id,
                rating: rating,
                content: review
            });

        if (insertError) {
            console.error("Insert error:", insertError);
            return NextResponse.json({ error: "리뷰 저장에 실패했습니다." }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "리뷰가 성공적으로 등록되었으며 가이드 별점이 업데이트되었습니다." });
    } catch (error) {
        console.error("Review POST Error:", error);
        return NextResponse.json({ error: "요청을 처리하는 도중 오류가 발생했습니다." }, { status: 500 });
    }
}
