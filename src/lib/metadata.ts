import type { Metadata } from 'next'
import { siteConfig } from './content'

const socialImage = {
  url: '/media/social/ulixes-capital-markets.jpg',
  width: 1200,
  height: 630,
  alt: 'San Francisco skyline, home of Ulixes Corporation.',
} as const

export function createRouteMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: `/${string}` | '/'
}): Pick<Metadata, 'description' | 'alternates' | 'openGraph' | 'twitter'> {
  return {
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: path,
      siteName: siteConfig.name,
      title,
      description,
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage.url],
    },
  }
}
