import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set({ name, value, ...options })
              )
            } catch {
              // Se ignora si se llama desde un Server Component
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('status')
          .eq('id', data.user.id)
          .single()

        if (profile?.status === 'suspended') {
          await supabase.auth.signOut()
          return NextResponse.redirect(`${origin}/login?error=suspended`)
        }
      }

      // Redirige limpiamente a la raíz sin parámetros en la URL
      return NextResponse.redirect(`${origin}/`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=No_se_pudo_autenticar`)
}
