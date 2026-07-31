import type { Metadata, Viewport } from 'next'
import { Outfit, JetBrains_Mono, EB_Garamond } from 'next/font/google'
import { Navigation, Footer, GridBackground } from '@/components/layout'
import { ErrorBoundary } from '@/components/ui'
import { siteConfig } from '@/lib/content'
import { Agentation } from 'agentation'
import '@/styles/globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

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
    <html lang="en" className={`${outfit.variable} ${ebGaramond.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">
        <ErrorBoundary>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-bg-primary focus:rounded-sm focus:text-body-sm focus:font-medium"
          >
            Skip to main content
          </a>
          <GridBackground />
          <Navigation />
          <main id="main-content" className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ErrorBoundary>
        {process.env.NODE_ENV === 'development' && <Agentation />}
      </body>
    </html>
  )
}
