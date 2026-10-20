import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { homepageContent } from '@/lib/homepage-content'
import { Homepage } from './homepage'
import { LIFECYCLE_STEP_MS } from './lifecycle-live'

const { hero, services, calypso, practitioner } = homepageContent

function section(name: string | RegExp) {
  return screen.getByRole('region', { name })
}

describe('Homepage', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders the four sections in order, with one h1 and no closing card', () => {
    render(<Homepage />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings).toEqual([
      `${services.headlineLead} ${services.headlineTurn}`,
      `${calypso.headlineLead} ${calypso.headlineTurn}`,
      `${practitioner.headlineLead} ${practitioner.headlineTurn}`,
    ])
    /* The footer (05-close) belongs to the layout. */
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
  })

  it('leads with the hero copy, both actions and the poster', () => {
    render(<Homepage />)
    const region = section(hero.headline)

    expect(within(region).getByRole('heading', { level: 1 })).toHaveTextContent(hero.headline)
    expect(within(region).getByText(hero.eyebrow.desk)).toBeInTheDocument()
    expect(within(region).getByText(hero.body.desk)).toBeInTheDocument()
    expect(within(region).getByRole('link', { name: hero.primaryCta })).toHaveAttribute(
      'href',
      '/contact',
    )
    expect(within(region).getByRole('link', { name: hero.secondaryCta })).toHaveAttribute(
      'href',
      '/services',
    )
    expect(within(region).getByRole('img', { name: hero.imageAlt })).toBeInTheDocument()
  })

  it('draws the brand inside the phone hero', () => {
    render(<Homepage />)
    const region = section(hero.headline)
    expect(
      within(region).getByRole('link', { name: 'Ulixes Corporation, home', hidden: true }),
    ).toHaveAttribute('href', '/')
  })

  it('loads the loop only after mount on wide screens and lets the visitor pause it', () => {
    const { container } = render(<Homepage />)
    const video = container.querySelector('video')
    expect(video).toHaveProperty('muted', true)
    expect(video).toHaveAttribute('aria-hidden', 'true')
    expect(video?.querySelector('source')).toHaveAttribute('src', hero.videoSrc)

    /* The control follows the element's own play / pause events. */
    act(() => {
      video?.dispatchEvent(new Event('play'))
    })
    const control = screen.getByRole('button', { name: 'Pause background video' })
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause')
    fireEvent.click(control)
    expect(pause).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Play background video' })).toBeInTheDocument()
  })

  it('keeps phones on the still image', () => {
    const matchMedia = window.matchMedia
    window.matchMedia = ((query: string) => ({
      ...matchMedia(query),
      matches: false,
    })) as typeof window.matchMedia
    try {
      const { container } = render(<Homepage />)
      expect(container.querySelector('video source')).toBeNull()
      expect(screen.getByRole('button', { name: 'Play background video' })).toBeInTheDocument()
    } finally {
      window.matchMedia = matchMedia
    }
  })

  it('lists the four facts in the dock and once, accessibly, in the phone ticker', () => {
    render(<Homepage />)
    const region = section(hero.headline)
    const dock = region.querySelector('dl') as HTMLElement
    for (const fact of hero.facts) {
      expect(within(dock).getByText(fact.label)).toBeInTheDocument()
      expect(within(dock).getByText(fact.value)).toBeInTheDocument()
      expect(within(dock).getByText(fact.detail)).toBeInTheDocument()
    }
    const ticker = within(region).getByRole('list', { name: 'At a glance', hidden: true })
    expect(within(ticker).getAllByRole('listitem', { hidden: true })).toHaveLength(hero.facts.length)
    expect(region.querySelectorAll('ul[aria-hidden="true"] li')).toHaveLength(hero.facts.length)
  })

  it('links every service row to the services page and moves the hover photograph', () => {
    const { container } = render(<Homepage />)
    const region = section(`${services.headlineLead} ${services.headlineTurn}`)
    const rows = within(region)
      .getAllByRole('link')
      .filter((link) => services.items.some((item) => link.textContent?.includes(item.title)))
    expect(rows).toHaveLength(4)
    rows.forEach((row) => expect(row).toHaveAttribute('href', '/services'))
    services.items.forEach((item, i) => {
      expect(rows[i]).toHaveTextContent(item.number)
      expect(rows[i]).toHaveTextContent(item.scope)
    })

    expect(within(region).getByRole('link', { name: services.cta })).toHaveAttribute(
      'href',
      '/services',
    )

    const pic = container.querySelector('[data-placed]')
    expect(pic).toHaveAttribute('aria-hidden', 'true')
    expect(pic).toHaveAttribute('data-placed', 'false')
    fireEvent.mouseEnter(rows[2]!)
    expect(pic).toHaveAttribute('data-placed', 'true')
    const active = pic?.querySelector('[data-active="true"]')
    expect(active).toHaveAttribute('src', expect.stringContaining('financial-district-day'))
  })

  it('walks the lifecycle, stops on a chosen stage and resumes from the live control', () => {
    vi.useFakeTimers()
    render(<Homepage />)
    const region = section(`${calypso.headlineLead} ${calypso.headlineTurn}`)
    const stage = (name: string) =>
      within(region).getByRole('button', { name: new RegExp(`^${name},`) })

    expect(stage('Capture')).toHaveAttribute('aria-current', 'step')
    act(() => {
      vi.advanceTimersByTime(LIFECYCLE_STEP_MS)
    })
    expect(stage('Valuation')).toHaveAttribute('aria-current', 'step')
    expect(within(region).getByText(calypso.stages[1]!.does)).toBeInTheDocument()

    fireEvent.click(stage('Settlement'))
    expect(stage('Settlement')).toHaveAttribute('aria-current', 'step')
    act(() => {
      vi.advanceTimersByTime(LIFECYCLE_STEP_MS * 3)
    })
    expect(stage('Settlement')).toHaveAttribute('aria-current', 'step')

    const toggle = within(region).getByRole('button', { name: /^Paused/ })
    fireEvent.click(toggle)
    expect(within(region).getByRole('button', { name: /^Live/ })).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(LIFECYCLE_STEP_MS)
    })
    expect(stage('Ledger')).toHaveAttribute('aria-current', 'step')

    expect(within(region).getByRole('link', { name: calypso.cta })).toHaveAttribute(
      'href',
      '/nasdaq-calypso',
    )
  })

  it('starts the lifecycle paused under reduced motion', () => {
    vi.useFakeTimers()
    const matchMedia = window.matchMedia
    window.matchMedia = ((query: string) => ({
      ...matchMedia(query),
      matches: query === '(prefers-reduced-motion: reduce)' || query === '(min-width: 768px)',
    })) as typeof window.matchMedia
    try {
      const { container } = render(<Homepage />)
      const region = section(`${calypso.headlineLead} ${calypso.headlineTurn}`)
      act(() => {
        vi.advanceTimersByTime(LIFECYCLE_STEP_MS * 2)
      })
      expect(within(region).getByRole('button', { name: /^Capture,/ })).toHaveAttribute(
        'aria-current',
        'step',
      )
      expect(within(region).getByRole('button', { name: /^Paused/ })).toBeInTheDocument()
      /* The loop stays out of the tree until the visitor asks for it. */
      expect(container.querySelector('video source')).toBeNull()
    } finally {
      window.matchMedia = matchMedia
    }
  })

  it('introduces the practitioner with the first-note brief and his links', () => {
    render(<Homepage />)
    const region = section(`${practitioner.headlineLead} ${practitioner.headlineTurn}`)

    expect(within(region).getByRole('heading', { level: 3, name: practitioner.name })).toBeInTheDocument()
    expect(within(region).getByRole('img', { name: practitioner.imageAlt })).toBeInTheDocument()
    for (const point of practitioner.briefPoints) {
      expect(within(region).getByText(point.title)).toBeInTheDocument()
      expect(within(region).getByText(point.body)).toBeInTheDocument()
    }
    const linkedin = within(region).getByRole('link', { name: /^LinkedIn/ })
    expect(linkedin).toHaveAttribute('href', homepageContent.credibility.linkedinUrl)
    expect(linkedin).toHaveAttribute('target', '_blank')
    expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer')
    expect(
      within(region).getByRole('link', { name: practitioner.experienceCta.desk }),
    ).toHaveAttribute('href', '/institutional-experience')
    expect(within(region).getByRole('link', { name: practitioner.cta })).toHaveAttribute(
      'href',
      '/contact',
    )
  })
})
