import type { Metadata } from 'next'
import { Outfit, JetBrains_Mono } from 'next/font/google'
import { Navigation, Footer, GridBackground } from '@/components/layout'
import { ErrorBoundary } from '@/components/ui'
import { siteConfig } from '@/lib/content'
import '@/styles/globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['Calypso', 'trading systems', 'financial technology', 'consulting', 'implementation', 'capital markets', 'hedge accounting'],
  authors: [{ name: siteConfig.name }],
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`}>
      <body className="font-display">
        <ErrorBoundary>
          <GridBackground />
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  )
}
