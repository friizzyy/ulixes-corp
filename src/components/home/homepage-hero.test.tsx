import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { parse, type AtRule, type Rule } from 'postcss'
import { afterEach, describe, expect, it, vi } from 'vitest'
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

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const MOBILE_MEDIA_QUERY = '(max-width: 767px)'
const REDUCED_MOTION_MEDIA_QUERY = '(prefers-reduced-motion: reduce)'
const stylesheet = parse(
  readFileSync(
    path.join(process.cwd(), 'src/components/home/homepage.module.css'),
    'utf8',
  ),
)

function setReducedMotion(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches: query === REDUCED_MOTION_QUERY ? matches : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }))
}

function appendCapabilitiesTarget() {
  const target = document.createElement('section')
  target.id = 'capabilities'
  const heading = document.createElement('h2')
  heading.textContent = 'Where Ulixes enters the system.'
  target.append(heading)
  target.scrollIntoView = vi.fn()
  document.body.append(target)

  return { heading, target }
}

function declarationsFor(selector: string, media?: string) {
  const declarations: Record<string, string> = {}

  stylesheet.walkRules((rule: Rule) => {
    type CssAncestor = {
      name?: string
      params?: string
      parent?: CssAncestor
      type: string
    }
    let ancestor = rule.parent as unknown as CssAncestor | undefined
    let ruleMedia: string | undefined

    while (ancestor) {
      if (ancestor.type === 'atrule' && (ancestor as AtRule).name === 'media') {
        ruleMedia = (ancestor as AtRule).params
        break
      }
      ancestor = ancestor.parent
    }

    if (ruleMedia !== media || !rule.selectors.includes(selector)) return
    rule.walkDecls((declaration) => {
      declarations[declaration.prop] = declaration.value
    })
  })

  return declarations
}

function clamp(minimum: number, preferred: number, maximum: number) {
  return Math.min(Math.max(preferred, minimum), maximum)
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  window.history.replaceState(null, '', '/')
  document.getElementById('capabilities')?.remove()
})

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

  it('server-renders the React 18 priority hint in lowercase without warnings', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    const markup = renderToString(createElement(HomepageHero))

    expect(markup).toContain('fetchpriority="high"')
    expect(markup).not.toContain('fetchPriority=')
    expect(consoleError).not.toHaveBeenCalled()
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

  it('keeps the native hash and focuses after smooth scrolling emits scrollend', () => {
    vi.useFakeTimers()
    setReducedMotion(false)
    const { heading, target } = appendCapabilitiesTarget()
    const removeEventListener = vi.spyOn(window, 'removeEventListener')
    const setTimeout = vi.spyOn(window, 'setTimeout')
    const clearTimeout = vi.spyOn(window, 'clearTimeout')
    render(createElement(HomepageHero))
    const link = screen.getByRole('link', {
      name: homepageContent.hero.secondaryCta,
    })
    let defaultPrevented = true
    document.addEventListener('click', (event) => {
      defaultPrevented = event.defaultPrevented
    }, { once: true })

    link.click()
    expect(defaultPrevented).toBe(false)
    vi.advanceTimersByTime(0)
    expect(window.location.hash).toBe('#capabilities')
    expect(target.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
    expect(heading).not.toHaveFocus()
    const fallbackIndex = setTimeout.mock.calls.findIndex(([, delay]) => (
      typeof delay === 'number' && delay > 0 && delay <= 999
    ))
    const fallbackId = setTimeout.mock.results[fallbackIndex]?.value

    window.dispatchEvent(new Event('scrollend'))

    expect(heading).toHaveAttribute('tabindex', '-1')
    expect(heading).toHaveFocus()
    expect(clearTimeout).toHaveBeenCalledWith(fallbackId)
    expect(removeEventListener).toHaveBeenCalledWith('scrollend', expect.any(Function))
  })

  it('uses instant reduced-motion scrolling and a bounded focus fallback', () => {
    vi.useFakeTimers()
    setReducedMotion(true)
    const { heading, target } = appendCapabilitiesTarget()
    render(createElement(HomepageHero))
    const link = screen.getByRole('link', {
      name: homepageContent.hero.secondaryCta,
    })
    let defaultPrevented = true
    document.addEventListener('click', (event) => {
      defaultPrevented = event.defaultPrevented
    }, { once: true })

    link.click()
    expect(defaultPrevented).toBe(false)
    vi.advanceTimersByTime(0)
    expect(window.location.hash).toBe('#capabilities')
    expect(target.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'auto',
      block: 'start',
    })
    expect(heading).not.toHaveFocus()

    vi.advanceTimersByTime(999)

    expect(heading).toHaveFocus()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cleans pending scroll focus work when the hero unmounts', () => {
    vi.useFakeTimers()
    setReducedMotion(false)
    const { heading } = appendCapabilitiesTarget()
    const removeEventListener = vi.spyOn(window, 'removeEventListener')
    const setTimeout = vi.spyOn(window, 'setTimeout')
    const clearTimeout = vi.spyOn(window, 'clearTimeout')
    const { unmount } = render(createElement(HomepageHero))

    screen.getByRole('link', { name: homepageContent.hero.secondaryCta }).click()
    vi.advanceTimersByTime(0)
    const fallbackIndex = setTimeout.mock.calls.findIndex(([, delay]) => (
      typeof delay === 'number' && delay > 0 && delay <= 999
    ))
    const fallbackId = setTimeout.mock.results[fallbackIndex]?.value
    unmount()
    window.dispatchEvent(new Event('scrollend'))
    vi.advanceTimersByTime(1000)

    expect(heading).not.toHaveFocus()
    expect(clearTimeout).toHaveBeenCalledWith(fallbackId)
    expect(removeEventListener).toHaveBeenCalledWith('scrollend', expect.any(Function))
  })

  it('protects short-mobile copy and proof without altering the approved scrims', () => {
    const copyScrim = declarationsFor('.copyScrim')
    const navigationScrim = declarationsFor('.navigationScrim')
    const mobileHero = declarationsFor('.hero', MOBILE_MEDIA_QUERY)
    const mobileLayout = declarationsFor('.layout', MOBILE_MEDIA_QUERY)
    const mobileHeadline = declarationsFor('.headline', MOBILE_MEDIA_QUERY)
    const mobileBody = declarationsFor('.body', MOBILE_MEDIA_QUERY)
    const mobileActions = declarationsFor('.actions', MOBILE_MEDIA_QUERY)
    const mobileAction = declarationsFor('.primaryAction', MOBILE_MEDIA_QUERY)
    const mobileScrim = declarationsFor('.mobileScrim', MOBILE_MEDIA_QUERY)
    const mobileScrimBase = declarationsFor('.mobileScrim')
    const reducedMotionHtml = declarationsFor(
      ':global(html):has(.hero)',
      REDUCED_MOTION_MEDIA_QUERY,
    )

    expect(copyScrim.background).toBe(
      'linear-gradient(90deg, rgba(8,9,12,.92) 0%, rgba(8,9,12,.68) 34%, rgba(8,9,12,.18) 52%, transparent 68%)',
    )
    expect(navigationScrim.background).toBe(
      'linear-gradient(180deg, rgba(8,9,12,.72) 0%, rgba(8,9,12,.24) 72%, transparent 100%)',
    )
    expect(mobileScrimBase).toMatchObject({
      display: 'none',
      inset: '0',
      position: 'absolute',
    })
    expect(mobileScrim.display).toBe('block')
    expect(mobileScrim.background).toMatch(/^linear-gradient\(180deg,/)
    expect(mobileScrim.background).toMatch(/rgba\(8,9,12,\.94\) 100%\)$/)
    expect(mobileHero['min-height']).toContain('43.75rem')
    expect(mobileActions['grid-template-columns']).toBe(
      'repeat(2, minmax(0, 1fr))',
    )
    expect(mobileAction['min-height']).toBe('44px')
    expect(mobileAction['min-width']).toBe('0')
    expect(Number(mobileAction['font-size'].replace('rem', '')) * 16).toBeLessThanOrEqual(12.5)
    expect(reducedMotionHtml['scroll-behavior']).toBe('auto')

    const floorRem = Number(mobileHero['min-height'].match(/([\d.]+)rem/)?.[1])
    const topMin = Number(mobileLayout['padding-top'].match(/clamp\(([\d.]+)px/)?.[1])
    const headlineMinRem = Number(
      mobileHeadline['font-size'].match(/clamp\(([\d.]+)rem/)?.[1],
    )
    const headlinePreferredVw = Number(
      mobileHeadline['font-size'].match(/, ([\d.]+)vw/)?.[1],
    )
    const headlineMaxRem = Number(
      mobileHeadline['font-size'].match(/, ([\d.]+)rem\)$/)?.[1],
    )
    const bodyMargin = Number(mobileBody['margin-top'].replace('px', ''))
    const actionsMargin = Number(mobileActions['margin-top'].replace('px', ''))
    const actionHeight = Number(mobileAction['min-height'].replace('px', ''))

    for (const [width, height] of [[320, 568], [390, 844]] as const) {
      const compositionHeight = Math.max(height, floorRem * 16)
      const top = clamp(topMin, height * 0.13, 112)
      const headlineSize = clamp(
        headlineMinRem * 16,
        width * headlinePreferredVw / 100,
        headlineMaxRem * 16,
      )
      const copyAndActionsBottom = top
        + headlineSize * 1.045 * 3
        + bodyMargin
        + 16 * 1.5 * 3
        + actionsMargin
        + actionHeight

      expect(copyAndActionsBottom).toBeLessThan(compositionHeight * 0.55)
    }
  })
})
