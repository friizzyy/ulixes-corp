import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomeBrand } from './home-brand'
import { HomeHeroMedia } from './home-hero-media'
import { AuthorityIcon, ServiceIcon } from './home-icons'
import type {
  AuthorityIconName,
  ServiceIconName,
} from '@/lib/homepage-content'

describe('homepage brand and icon primitives', () => {
  it('renders an accessible Ulixes wordmark with a decorative monogram', () => {
    const { container } = render(<HomeBrand />)

    expect(screen.getByText('ULIXES')).toBeInTheDocument()
    expect(screen.getByText('CORPORATION')).toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('svg path')).toHaveLength(1)
    expect(container.querySelector('svg path')).toHaveAttribute(
      'fill',
      'currentColor',
    )
  })

  it('keeps the small wordmark descriptor at WCAG AA contrast', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'src/components/home/home-brand.module.css'),
      'utf8',
    )

    expect(css).toMatch(/\.descriptor\s*\{[\s\S]*?color:\s*#56666d/i)
  })

  it('keeps the local hero poster present with or without an ambient video', () => {
    const { rerender, container } = render(
      <HomeHeroMedia imageAlt="San Francisco skyline" />,
    )

    expect(
      screen
        .getByRole('img', { name: 'San Francisco skyline' })
        .getAttribute('src'),
    ).toContain('ulixes-san-francisco-blue-hour.webp')
    expect(
      screen.getByRole('img', { name: 'San Francisco skyline' }),
    ).toHaveAttribute('fetchpriority', 'high')
    expect(container.querySelector('video')).not.toBeInTheDocument()

    rerender(
      <HomeHeroMedia
        imageAlt="San Francisco skyline"
        videoSrc="/media/home/skyline-loop.mp4"
      />,
    )

    const video = container.querySelector('video')
    /* The responsive next/image remains visible beneath the video. A second
       poster URL would download the full-width source again on phones even
       while preload="none" keeps the ambient loop itself dormant. */
    expect(video).not.toHaveAttribute('poster')
    expect(video).toHaveAttribute('loop')
    expect(video).toHaveAttribute('autoplay')
    expect(video).toHaveAttribute('playsinline')
    expect(video).toHaveProperty('muted', true)
    expect(video).toHaveAttribute('aria-hidden', 'true')
    expect(video?.querySelector('source')).toHaveAttribute(
      'src',
      '/media/home/skyline-loop.mp4',
    )
  })

  it('ships lightweight hero media instead of the multi-megabyte source files', () => {
    const mediaRoot = resolve(process.cwd(), 'public/media/home')

    expect(
      statSync(resolve(mediaRoot, 'ulixes-san-francisco-blue-hour.webp')).size,
    ).toBeLessThan(300_000)
    expect(
      statSync(resolve(mediaRoot, 'ulixes-san-francisco-loop.mp4')).size,
    ).toBeLessThan(1_500_000)
    expect(
      statSync(resolve(mediaRoot, 'ulixes-financial-district-day.webp')).size,
    ).toBeLessThan(300_000)
  })

  it('renders every authority and service icon as decorative SVG', () => {
    const authorityNames: AuthorityIconName[] = [
      'history',
      'lifecycle',
      'regions',
      'access',
    ]
    const serviceNames: ServiceIconName[] = [
      'implementation',
      'migration',
      'testing',
      'readiness',
    ]

    const { container } = render(
      <>
        {authorityNames.map((name) => (
          <AuthorityIcon key={name} name={name} />
        ))}
        {serviceNames.map((name) => (
          <ServiceIcon key={name} name={name} />
        ))}
      </>,
    )

    expect(container.querySelectorAll('svg')).toHaveLength(8)
    for (const icon of Array.from(container.querySelectorAll('svg'))) {
      expect(icon).toHaveAttribute('aria-hidden', 'true')
      expect(icon).toHaveAttribute('focusable', 'false')
    }
  })
})
