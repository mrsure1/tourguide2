import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
            let finalNext = next;

            if (role) {
                // Optionally update the user's role in the DB after OAuth if it's their first time
                await supabase
                    .from('profiles')
                    .upsert({
                        id: session.user.id,
                        role: role,
                        full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User'
                    }, { onConflict: 'id' });
                // Redirect based on the newly set role
                finalNext = role === 'guide' ? '/guide/dashboard' : '/traveler/home';
            } else {
                // DB에서 현재 역할 확인
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (profile?.role) {
                    finalNext = profile.role === 'guide' ? '/guide/dashboard' : '/traveler/home';
                } else {
                    finalNext = '/role-selection'; // 역할이 없으면 선택 화면으로
                }
            }
            return NextResponse.redirect(`${origin}${finalNext}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?message=Could not authenticate user`)
}
