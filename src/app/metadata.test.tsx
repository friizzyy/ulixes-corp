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
    expect(homepageMetadata?.alternates?.canonical).toBe('/')
    expect(rootMetadata.openGraph).toMatchObject({
      url: 'https://preview.ulixes.example',
      images: [
        {
          url: '/media/ulixes-social-card.jpg',
          width: 1200,
          height: 630,
        },
      ],
    })
    expect(rootMetadata.twitter).toMatchObject({
      card: 'summary_large_image',
      images: [
        {
          url: '/media/ulixes-social-card.jpg',
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

function existsAndIsJpeg(filePath: string) {
  try {
    const bytes = readFileSync(filePath)
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes.at(-2) === 0xff && bytes.at(-1) === 0xd9
  } catch {
    return false
  }
}
