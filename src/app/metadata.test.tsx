import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { Metadata } from 'next'
import sharp from 'sharp'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'mock-font-variable' }),
}))

vi.mock('@/components/layout', () => ({
  Footer: () => null,
  GridBackground: () => null,
  Navigation: () => null,
}))

vi.mock('@/components/ui', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
}))

vi.mock('agentation', () => ({ Agentation: () => null }))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('site metadata', () => {
  it('derives canonical and social metadata from NEXT_PUBLIC_SITE_URL', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://preview.ulixes.example/')
    vi.resetModules()

    const [{ metadata: rootMetadata }, homePageModule, { siteConfig }] = await Promise.all([
      import('./layout'),
      import('./page'),
      import('@/lib/content'),
    ])
    const homepageMetadata = Reflect.get(homePageModule, 'metadata') as
      | Metadata
      | undefined

    expect(siteConfig.url).toBe('https://preview.ulixes.example')
    expect(rootMetadata.metadataBase).toEqual(
      new URL('https://preview.ulixes.example'),
    )
    expect(rootMetadata.alternates).toBeUndefined()
    expect(homepageMetadata?.alternates?.canonical).toBe(
      'https://preview.ulixes.example',
    )
    expect(rootMetadata.openGraph).toMatchObject({
      url: 'https://preview.ulixes.example',
      images: [
        {
          url: 'https://preview.ulixes.example/media/ulixes-social-card.jpg',
          width: 1200,
          height: 630,
        },
      ],
    })
    expect(rootMetadata.twitter).toMatchObject({
      card: 'summary_large_image',
      images: [
        {
          url: 'https://preview.ulixes.example/media/ulixes-social-card.jpg',
          width: 1200,
          height: 630,
        },
      ],
    })
  })

  it('falls back to the production origin when no site URL is configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
    vi.resetModules()

    const { siteConfig } = await import('@/lib/content')

    expect(siteConfig.url).toBe('https://ulixescorp.com')
  })

  it.each([
    ['malformed input', 'not a URL'],
    ['JavaScript URL', 'javascript:alert(1)'],
    ['file URL', 'file:///tmp/ulixes'],
    ['mail URL', 'mailto:webmaster@ulixescorp.com'],
    ['data URL', 'data:text/plain,ulixes'],
    ['FTP URL', 'ftp://files.ulixescorp.com/site'],
  ])('falls back to production for %s', async (_label, configuredUrl) => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', configuredUrl)
    vi.resetModules()

    const { siteConfig } = await import('@/lib/content')

    expect(siteConfig.url).toBe('https://ulixescorp.com')
  })

  it.each([
    [
      'https://preview.ulixes.example/site?ref=qa',
      'https://preview.ulixes.example',
    ],
    ['http://localhost:3000/site?ref=qa', 'http://localhost:3000'],
  ])(
    'normalizes the HTTP site URL %s to its origin',
    async (configuredUrl, expected) => {
      vi.stubEnv('NEXT_PUBLIC_SITE_URL', configuredUrl)
      vi.resetModules()

      const { siteConfig } = await import('@/lib/content')

      expect(siteConfig.url).toBe(expected)
    },
  )

  it('publishes route-specific canonical and social metadata for every sitemap page', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://preview.ulixes.example/site')
    vi.resetModules()

    const [{ default: sitemap }, routeModules] = await Promise.all([
      import('./sitemap'),
      loadIndexableRouteModules(),
    ])
    const sitemapPaths = sitemap().map((entry) => new URL(entry.url).pathname)

    expect(new Set(Object.keys(routeModules))).toEqual(new Set(sitemapPaths))

    for (const [routePath, routeModule] of Object.entries(routeModules)) {
      const routeUrl = routePath === '/'
        ? 'https://preview.ulixes.example'
        : `https://preview.ulixes.example${routePath}`
      const sharedImage = {
        url: 'https://preview.ulixes.example/media/ulixes-social-card.jpg',
        width: 1200,
        height: 630,
        alt: 'Ulixes Corporation system signal',
      }

      expect(
        routeModule.metadata,
        `${routePath} must export metadata`,
      ).toBeDefined()
      expect(routeModule.metadata?.alternates?.canonical).toBe(routeUrl)
      expect(routeModule.metadata?.openGraph).toMatchObject({
        url: routeUrl,
        images: [sharedImage],
      })
      expect(routeModule.metadata?.twitter).toMatchObject({
        card: 'summary_large_image',
        images: [sharedImage],
      })
    }

    expect(
      routeModules['/institutional-experience'].metadata?.title,
    ).toBe('Institutional Experience')

    expect(routeModules['/about'].metadata).toMatchObject({
      description:
        'Ulysses Williams has Calypso experience since 2004, spanning front-, middle-, and back-office delivery across North America, Europe, APAC, and Latin America.',
      openGraph: {
        description:
          "Ulysses Williams's product-domain experience covers interest-rate derivatives, FX, fixed income, money markets, commodities, and equity derivatives.",
      },
      twitter: {
        description:
          "Ulysses Williams's product-domain experience covers interest-rate derivatives, FX, fixed income, money markets, commodities, and equity derivatives.",
      },
    })
    expect(routeModules['/institutional-experience'].metadata).toMatchObject({
      description:
        'Ulysses Williams has Calypso experience since 2004 across front-, middle-, and back-office delivery.',
      openGraph: {
        description:
          "Ulysses Williams's experience spans North America, Europe, APAC, Latin America, interest-rate derivatives, FX, fixed income, money markets, commodities, and equity derivatives.",
      },
      twitter: {
        description:
          "Ulysses Williams's experience spans North America, Europe, APAC, Latin America, interest-rate derivatives, FX, fixed income, money markets, commodities, and equity derivatives.",
      },
    })
  })

  it('gives the focused skip link a full-height touch target', async () => {
    const { default: RootLayout } = await import('./layout')
    const markup = renderToStaticMarkup(
      createElement(RootLayout, null, createElement('p', null, 'Page content')),
    )
    const document = new DOMParser().parseFromString(markup, 'text/html')
    const skipLink = document.querySelector<HTMLAnchorElement>(
      'a[href="#main-content"]',
    )

    expect(skipLink?.classList).toContain('focus:inline-flex')
    expect(skipLink?.classList).toContain('focus:min-h-[44px]')
    expect(skipLink?.classList).toContain('focus:items-center')
  })

  it('ships a restrained 1200 by 630 JPEG social image', async () => {
    const socialImagePath = path.join(
      process.cwd(),
      'public/media/ulixes-social-card.jpg',
    )

    expect(existsAndIsJpeg(socialImagePath)).toBe(true)
    const metadata = await sharp(socialImagePath).metadata()

    expect(metadata).toMatchObject({
      format: 'jpeg',
      width: 1200,
      height: 630,
    })
  })
})

type RouteMetadataModule = { metadata?: Metadata }

async function loadIndexableRouteModules(): Promise<
  Record<string, RouteMetadataModule>
> {
  const [
    homepage,
    about,
    contact,
    institutionalExperience,
    philosophy,
    privacy,
    services,
    terms,
  ] = await Promise.all([
    import('./page'),
    import('./about/layout'),
    import('./contact/layout'),
    import('./institutional-experience/layout'),
    import('./philosophy/layout'),
    import('./privacy/layout'),
    import('./services/layout'),
    import('./terms/layout'),
  ])

  return {
    '/': homepage,
    '/about': about,
    '/contact': contact,
    '/institutional-experience': institutionalExperience,
    '/philosophy': philosophy,
    '/privacy': privacy,
    '/services': services,
    '/terms': terms,
  }
}

function existsAndIsJpeg(filePath: string) {
  try {
    const bytes = readFileSync(filePath)
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes.at(-2) === 0xff && bytes.at(-1) === 0xd9
  } catch {
    return false
  }
}
