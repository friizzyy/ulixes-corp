import type { Metadata, Viewport } from 'next'
import { Archivo, Outfit, JetBrains_Mono } from 'next/font/google'
import { PhoneDock, SiteFooter, SiteHeader } from '@/components/site'
import { ErrorBoundary } from '@/components/ui'
import { siteConfig } from '@/lib/content'
import { createRouteMetadata } from '@/lib/metadata'
import '@/styles/globals.css'
import '@/styles/editorial.css'
import '@/styles/site.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

/*
 * The three faces of the redesign. site.css maps them to --font-display
 * (Archivo), --font-sans (Outfit) and --font-mono (JetBrains Mono). No serif:
 * the house rules ban it.
 */
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-home-display',
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
  /* The mineral ground, so the browser chrome meets the page in one colour. */
  themeColor: '#f3f1ec',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['capital markets transformation', 'solution architecture', 'hedge accounting', 'trading platforms', 'post-trade', 'Nasdaq Calypso', 'Calypso consulting', 'capital markets'],
  authors: [{ name: siteConfig.name }],
  ...createRouteMetadata({
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    path: '/',
  }),
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
    <html
      lang="en"
      className={`${outfit.variable} ${archivo.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans">
        <ErrorBoundary>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-[#10212b] focus:px-4 focus:py-2 focus:text-body-sm focus:font-medium focus:text-[#f9faf8]"
          >
            Skip to main content
          </a>
          <SiteHeader />
          {/*
           * No minimum height: every page root sizes itself, and the body
           * behind main is the same mineral as the pages, so a short route
           * (not-found, error) leaves cream above the footer, not a band.
           */}
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
          <PhoneDock />
        </ErrorBoundary>
      </body>
    </html>
  )
}
