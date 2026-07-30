import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Navigation, Footer, GridBackground } from '@/components/layout'
import { ErrorBoundary } from '@/components/ui'
import { siteConfig } from '@/lib/content'
import { sharedSocialImage, siteMetadataTitle } from '@/lib/metadata'
import { Agentation } from 'agentation'
import '@/styles/globals.css'

const instrumentSans = localFont({
  src: '../assets/fonts/InstrumentSans-Variable.woff2',
  variable: '--font-instrument',
  weight: '400 700',
  display: 'swap',
})

const plexMono = localFont({
  src: '../assets/fonts/IBMPlexMono-Medium.woff2',
  variable: '--font-plex-mono',
  weight: '500',
  display: 'swap',
})

const organizationId = `${siteConfig.url}/#organization`
const presidentId = `${siteConfig.url}/#ulysses-williams`

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': organizationId,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    {
      '@type': 'Person',
      '@id': presidentId,
      name: 'Ulysses Williams',
      jobTitle: 'President',
      url: siteConfig.linkedIn,
      sameAs: [siteConfig.linkedIn],
      worksFor: {
        '@id': organizationId,
      },
    },
  ],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteMetadataTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'Calypso advisory',
    'Calypso implementation',
    'Calypso migration',
    'capital markets',
    'compliance analysis',
    'software testing',
  ],
  authors: [{ name: siteConfig.name }],
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteMetadataTitle,
    description: siteConfig.description,
    images: [sharedSocialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadataTitle,
    description: siteConfig.description,
    images: [sharedSocialImage],
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
    <html lang="en" className={`${instrumentSans.variable} ${plexMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className="font-sans">
        <ErrorBoundary>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:inline-flex focus:min-h-[44px] focus:items-center focus:px-4 focus:py-2 focus:bg-action focus:text-action-ink focus:rounded-sm focus:text-body-sm focus:font-medium"
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
