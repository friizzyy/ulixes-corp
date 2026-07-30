import { fireEvent, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { homepageContent } from '@/lib/homepage-content'
import { HomepageHero } from './homepage-hero'

const VIDEO_SOURCES = [
  {
    media: '(max-width: 767px)',
    src: '/media/hero/ulixes-signal-mobile-1080.webm',
    type: 'video/webm',
  },
  {
    media: '(max-width: 767px)',
    src: '/media/hero/ulixes-signal-mobile-1080.mp4',
    type: 'video/mp4',
  },
  {
    media: null,
    src: '/media/hero/ulixes-signal-desktop-1440.webm',
    type: 'video/webm',
  },
  {
    media: null,
    src: '/media/hero/ulixes-signal-desktop-1080.mp4',
    type: 'video/mp4',
  },
] as const

describe('HomepageHero', () => {
  it('publishes the approved hero copy, actions, and attributed proof', () => {
    render(createElement(HomepageHero))

    expect(
      screen.getByRole('heading', { level: 1, name: homepageContent.hero.headline }),
    ).toBeInTheDocument()
    expect(screen.getByText(homepageContent.hero.body)).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: homepageContent.hero.primaryCta }),
    ).toHaveAttribute('href', '/contact')
    expect(
      screen.getByRole('link', { name: homepageContent.hero.secondaryCta }),
    ).toHaveAttribute('href', '#capabilities')
    expect(screen.getByText(homepageContent.hero.proof)).toHaveTextContent(
      /^Ulysses Williams/,
    )
  })

  it('keeps a priority responsive poster beneath the decorative video', () => {
    const { container } = render(createElement(HomepageHero))

    const hero = container.querySelector('#homepage-hero')
    const picture = hero?.querySelector('picture')
    const mobilePoster = picture?.querySelector('source')
    const poster = picture?.querySelector('img')
    const video = hero?.querySelector('video')

    expect(hero).toHaveAttribute('aria-labelledby', 'homepage-hero-title')
    expect(picture?.parentElement).toHaveAttribute('aria-hidden', 'true')
    expect(picture).not.toHaveAttribute('aria-hidden')
    expect(mobilePoster).toHaveAttribute('media', '(max-width: 767px)')
    expect(mobilePoster).toHaveAttribute(
      'srcset',
      '/media/hero/ulixes-signal-mobile-poster.avif',
    )
    expect(poster).toHaveAttribute(
      'src',
      '/media/hero/ulixes-signal-desktop-poster.avif',
    )
    expect(poster).toHaveAttribute('fetchpriority', 'high')
    expect(poster).toHaveAttribute('width', '2560')
    expect(poster).toHaveAttribute('height', '1440')
    expect(poster).toHaveAttribute('alt', '')
    expect(poster).toHaveAttribute('aria-hidden', 'true')
    expect(video).toHaveAttribute('aria-hidden', 'true')
  })

  it('orders mobile and desktop WebM/MP4 sources without video controls or audio', () => {
    const { container } = render(createElement(HomepageHero))
    const video = container.querySelector('video')
    const sources = Array.from(video?.querySelectorAll('source') ?? [])

    expect(sources).toHaveLength(VIDEO_SOURCES.length)
    VIDEO_SOURCES.forEach((expected, index) => {
      expect(sources[index]).toHaveAttribute('src', expected.src)
      expect(sources[index]).toHaveAttribute('type', expected.type)
      if (expected.media) {
        expect(sources[index]).toHaveAttribute('media', expected.media)
      } else {
        expect(sources[index]).not.toHaveAttribute('media')
      }
    })

    expect(video).toHaveProperty('autoplay', true)
    expect(video).toHaveProperty('muted', true)
    expect(video).toHaveProperty('loop', true)
    expect(video).toHaveProperty('playsInline', true)
    expect(video).not.toHaveAttribute('controls')
    expect(video).toHaveTextContent('')
    expect(container.querySelector('audio')).not.toBeInTheDocument()
  })

  it('reveals video only when playable and permanently restores the poster after error', () => {
    const { container } = render(createElement(HomepageHero))
    const video = container.querySelector('video')!
    const picture = container.querySelector('picture')

    expect(video).toHaveAttribute('data-readiness', 'loading')
    expect(getComputedStyle(video).opacity).toBe('0')

    fireEvent.canPlay(video)

    expect(video).toHaveAttribute('data-readiness', 'ready')
    expect(getComputedStyle(video).opacity).toBe('1')
    expect(picture).toBeInTheDocument()

    fireEvent.error(video)
    fireEvent.canPlay(video)

    expect(video).toHaveAttribute('data-readiness', 'failed')
    expect(getComputedStyle(video).opacity).toBe('0')
    expect(picture).toBeInTheDocument()
  })

  it('scrolls to capabilities and focuses its heading without cancelling the hash link', () => {
    const capabilities = document.createElement('section')
    capabilities.id = 'capabilities'
    const heading = document.createElement('h2')
    heading.textContent = 'Where Ulixes enters the system.'
    capabilities.append(heading)
    capabilities.scrollIntoView = vi.fn()
    document.body.append(capabilities)

    try {
      render(createElement(HomepageHero))
      const link = screen.getByRole('link', {
        name: homepageContent.hero.secondaryCta,
      })
      const click = new MouseEvent('click', { bubbles: true, cancelable: true })

      expect(link.dispatchEvent(click)).toBe(true)
      expect(capabilities.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      })
      expect(heading).toHaveAttribute('tabindex', '-1')
      expect(heading).toHaveFocus()
    } finally {
      capabilities.remove()
    }
  })
})
