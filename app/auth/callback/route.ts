import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/role-selection'

    // if "role" is in param, we might want to attach it to the profile
    const role = searchParams.get('role')

    if (code) {
        const supabase = await createClient()
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && session) {
            const userId = session.user.id;
            const metadata = session.user.user_metadata;

            // 1. 기존 프로필 정보 조회
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .maybeSingle();

            // 1. 역할 결정 우선순위
            // a. 관리자 하드코딩 (최우선)
            let userRole = (session.user.email === 'leeyob@gmail.com') ? 'admin' : null;

            // b. 관리자가 아닌 경우: URL 파라미터 > 기존 프로필 > 메타데이터
            if (!userRole) {
                const { data: existingProfile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', userId)
                    .maybeSingle();

                userRole = role || existingProfile?.role || metadata?.role || 'traveler';
            }

            const userFullName = metadata?.full_name || metadata?.name || session.user.email?.split('@')[0] || 'User';
            const userAvatar = metadata?.avatar_url || metadata?.picture || metadata?.profile_image || metadata?.profile_image_url || null;

            // 2. 프로필 정보 업데이트 또는 생성 (upsert)
            const { error: upsertError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    role: userRole,
                    full_name: userFullName,
                    avatar_url: userAvatar
                }, { onConflict: 'id' });

            if (upsertError) {
                console.error("[Auth Callback] Profile Upsert Error:", upsertError);
            }

            // 캐시 무효화
            revalidatePath('/', 'layout')

            // 역할에 따른 서비스 화면으로 이동
            const finalNext = userRole === 'admin'
                ? '/admin/dashboard'
                : (userRole === 'guide' ? '/guide/dashboard' : '/traveler/home');

            return NextResponse.redirect(`${origin}${finalNext}`)

        }
    }

    // fallback for failed auth or no code
    return NextResponse.redirect(`${origin}/login?message=Could not authenticate user`)
}
