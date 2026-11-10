import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Maintenance from '@/components/Maintenance'
import LayoutWrapper from '@/components/LayoutWrapper'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IM Shop | Recargas al instante para Free Fire',
  description:
    'Recargas automáticas y seguras de diamantes, pases y membresías para Free Fire. Entrega inmediata con saldo virtual.',
  keywords: [
    'Free Fire',
    'diamantes',
    'recargas Free Fire',
    'IM Shop',
    'pases Free Fire',
    'Perú',
    'fragmentos',
    'cajas',
  ],
  authors: [{ name: 'IM Shop' }],
  openGraph: {
    title: 'IM Shop | Recargas al instante',
    description: 'Recargas automáticas y seguras de diamantes para Free Fire. Entrega inmediata.',
    url: 'https://www.imshop.games',
    siteName: 'IM Shop',
    locale: 'es_PE',
    type: 'website',
  },
  icons: { icon: '/favicon.svg' },
}

const ADMIN_EMAILS = [
  'chaos40021@gmail.com',
  'mckenzey17@gmail.com',
]

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: settings } = await supabase
    .from('site_settings')
    .select('maintenance_mode')
    .eq('id', 1)
    .single()

  const isMaintenanceActive = settings?.maintenance_mode || false

  let isAdmin = false

  if (isMaintenanceActive) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user && user.email && ADMIN_EMAILS.includes(user.email)) {
      isAdmin = true
    }
  }

  const showMaintenanceScreen = isMaintenanceActive && !isAdmin

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'IM Shop',
    url: 'https://www.imshop.games',
    description: 'Recargas automáticas de diamantes para Free Fire',
    publisher: {
      '@type': 'Organization',
      name: 'IM Shop',
      logo: { '@type': 'ImageObject', url: 'https://www.imshop.games/logo.png' },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.imshop.games/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#050505] text-zinc-200 selection:bg-yellow-400 selection:text-black relative">
        {showMaintenanceScreen ? <Maintenance /> : <LayoutWrapper>{children}</LayoutWrapper>}

        <a
          href="https://wa.me/51936667063"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 group bg-[#25D366] p-3 shadow-[4px_4px_0px_#000000] border-2 border-black hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_#000000] transition-all"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-black">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
        </a>
      </body>
    </html>
  )
}
