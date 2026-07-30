import { existsSync } from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe('production indexing routes', () => {
  it('uses the configured origin and lists only real App Router pages', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://preview.ulixes.example/')
    vi.resetModules()

    const [{ default: sitemap }, { default: robots }] = await Promise.all([
      import('./sitemap'),
      import('./robots'),
    ])
    const entries = sitemap()
    const urls = entries.map((entry) => entry.url)

    expect(urls).toContain(
      'https://preview.ulixes.example/institutional-experience',
    )
    expect(urls).not.toContain('https://preview.ulixes.example/work')
    expect(robots().sitemap).toBe(
      'https://preview.ulixes.example/sitemap.xml',
    )

    for (const entry of entries) {
      const routePath = new URL(entry.url).pathname
      const pagePath = routePath === '/'
        ? path.join(process.cwd(), 'src/app/page.tsx')
        : path.join(process.cwd(), 'src/app', routePath.slice(1), 'page.tsx')

      expect(existsSync(pagePath), `${routePath} must map to an App Router page`).toBe(
        true,
      )
    }
  })
})
