import type { Metadata } from 'next'
import { siteConfig } from '@/lib/content'

export const siteMetadataTitle =
  'Ulixes Corporation | Senior-Led Calypso Advisory'

export const sharedSocialImage = {
  url: `${siteConfig.url}/media/ulixes-social-card.jpg`,
  width: 1200,
  height: 630,
  alt: 'Ulixes Corporation system signal',
}

type PageMetadataOptions = {
  path: '/' | `/${string}`
  title?: string
  description: string
  socialTitle: string
  socialDescription?: string
}

export function createPageMetadata({
  path,
  title,
  description,
  socialTitle,
  socialDescription = description,
}: PageMetadataOptions): Metadata {
  const pageUrl = path === '/' ? siteConfig.url : `${siteConfig.url}${path}`

  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: pageUrl,
      siteName: siteConfig.name,
      title: socialTitle,
      description: socialDescription,
      images: [sharedSocialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: socialDescription,
      images: [sharedSocialImage],
    },
  }
}
