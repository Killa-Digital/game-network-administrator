import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import Maintenance from '@/components/Maintenance'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'IM Shop | Recargas al instante',
  description: 'Recargas automáticas de diamantes para Free Fire',
  icons: {
    icon: '/favicon.png',
  },
}

const MAINTENANCE_MODE = true

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#050505] text-zinc-200 selection:bg-yellow-400 selection:text-black">
        {MAINTENANCE_MODE ? <Maintenance /> : <LayoutWrapper>{children}</LayoutWrapper>}
      </body>
    </html>
  )
}
