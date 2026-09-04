import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { metadata as notFoundMetadata } from '@/app/not-found'
import { metadata as servicesMetadata } from '@/app/services/layout'
import { siteConfig } from './content'

describe('publication metadata', () => {
  it('uses the live www origin everywhere search engines discover the site', () => {
    expect(siteConfig.url).toBe('https://www.ulixescorp.com')
    expect(robots().sitemap).toBe(`${siteConfig.url}/sitemap.xml`)
    expect(sitemap().every((entry) => entry.url.startsWith(siteConfig.url))).toBe(
      true,
    )
  })

  it('does not claim every route changed at sitemap request time', () => {
    expect(sitemap().every((entry) => entry.lastModified === undefined)).toBe(
      true,
    )
  })

  it('publishes a canonical URL and complete large-card metadata per route', () => {
    expect(servicesMetadata.alternates?.canonical).toBe('/services')
    expect(servicesMetadata.openGraph?.url).toBe('/services')
    expect(servicesMetadata.openGraph?.images).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: '/media/social/ulixes-capital-markets.jpg',
          width: 1200,
          height: 630,
        }),
      ]),
    )
    expect(servicesMetadata.twitter).toMatchObject({
      card: 'summary_large_image',
      images: ['/media/social/ulixes-capital-markets.jpg'],
    })
  })

  it('ships the social image referenced by metadata', () => {
    expect(
      existsSync(
        resolve(
          process.cwd(),
          'public/media/social/ulixes-capital-markets.jpg',
        ),
      ),
    ).toBe(true)
  })

  it('keeps missing pages out of search results without canonically claiming the homepage', () => {
    expect(notFoundMetadata.robots).toMatchObject({
      index: false,
      follow: false,
    })
    expect(notFoundMetadata.alternates?.canonical).toBeNull()
  })
})
