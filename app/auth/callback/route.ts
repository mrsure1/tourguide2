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

            // 2. 역할 결정 우선순위: URL 파라미터 (명시적 선택) > DB 기존 데이터 > 메타데이터
            // 사용자가 초기 화면에서 역할을 선택하고 들어온 경우(URL에 role이 있는 경우) 이를 최우선으로 반영합니다.
            let userRole = role || existingProfile?.role || metadata?.role;

            // 관리자 하드코딩 권한 부여 (최초 로그인 시 profiles에 레코드가 없어서 발생하는 문제 해결)
            if (session.user.email === 'leeyob@gmail.com') {
                userRole = 'admin';
            }

            const userFullName = metadata?.full_name || metadata?.name || session.user.email?.split('@')[0] || 'User';
            const userAvatar = metadata?.avatar_url || metadata?.picture || metadata?.profile_image || metadata?.profile_image_url || null;

            // 3. 프로필 정보 업데이트 또는 생성 (upsert)
            // 역할 정보가 있는 경우 무조건 업데이트하여 역할 전환(Role Switch)을 지원합니다.
            if (userRole) {
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

                // 캐시 무효화 (중요: 서버 사이드 레이아웃에서 변경된 역할을 즉시 반영하기 위함)
                revalidatePath('/', 'layout')

                // 역할에 따른 서비스 화면으로 이동
                const finalNext = userRole === 'admin' ? '/admin/dashboard' : (userRole === 'guide' ? '/guide/dashboard' : '/traveler/home');
                return NextResponse.redirect(`${origin}${finalNext}`)
            } else {
                // 역할 정보가 전혀 없으면 선택 화면으로 이동
                return NextResponse.redirect(`${origin}/role-selection`)
            }
        }
    }

    // fallback for failed auth or no code
    return NextResponse.redirect(`${origin}/login?message=Could not authenticate user`)
}
