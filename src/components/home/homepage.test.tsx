import { render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  authorityItems,
  homepageContent,
  serviceModules,
} from '@/lib/homepage-content'
import { Homepage } from './homepage'

describe('Homepage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the precise living hero, still fallback, and grounded authority', () => {
    const { container } = render(<Homepage />)

    expect(container.querySelector('main')).not.toBeInTheDocument()

    const heading = screen.getByRole('heading', {
      level: 1,
      name: homepageContent.hero.headline,
    })
    expect(container.querySelectorAll('[data-hero-line]')).toHaveLength(3)
    const hero = screen.getByRole('region', { name: heading.textContent ?? '' })
    expect(hero).toHaveAttribute('data-mobile-flow', 'message-first')

    const heroImage = within(hero).getByRole('img', {
      name: homepageContent.hero.imageAlt,
    })
    const heroBody = within(hero).getByText(homepageContent.hero.body)
    const primaryAction = within(hero).getByRole('link', {
      name: homepageContent.hero.primaryCta,
    })
    const secondaryAction = within(hero).getByRole('link', {
      name: homepageContent.hero.secondaryCta,
    })
    for (const messageElement of [
      heading,
      heroBody,
      primaryAction,
      secondaryAction,
    ]) {
      expect(
        Boolean(
          messageElement.compareDocumentPosition(heroImage) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      ).toBe(true)
    }

    expect(within(hero).getByText('San Francisco')).toBeInTheDocument()
    expect(within(hero).queryByText('37.7749° N')).not.toBeInTheDocument()

    expect(primaryAction).toHaveAttribute('href', '/contact')
    expect(secondaryAction).toHaveAttribute('href', '#expertise')
    expect(heroImage).toBeInTheDocument()
    expect(
      container.querySelector('[data-video-ready="true"]'),
    ).toBeInTheDocument()
    const video = container.querySelector('video')
    expect(video).not.toHaveAttribute('poster')
    expect(video?.querySelector('source')).toHaveAttribute(
      'src',
      '/media/home/ulixes-san-francisco-loop.mp4',
    )
    expect(video).toHaveProperty('muted', true)

    const dock = within(hero).getByRole('list', {
      name: 'Ulixes advisory perspective',
    })
    expect(dock).toHaveAttribute('data-mobile-layout', 'two-by-two')
    expect(within(dock).getAllByRole('listitem')).toHaveLength(
      authorityItems.length,
    )
    for (const item of authorityItems) {
      expect(within(dock).getByText(item.context)).toBeInTheDocument()
    }
  })

  it('composes one city threshold from the message, skyline, and authority ledger', () => {
    const { container } = render(<Homepage />)

    const compositions = container.querySelectorAll(
      '[data-depth-composition="city-threshold"]',
    )
    expect(compositions).toHaveLength(1)

    const threshold = compositions[0] as HTMLElement
    const skyline = within(threshold).getByRole('img', {
      name: homepageContent.hero.imageAlt,
    })
    const message = within(threshold).getByText(homepageContent.hero.body)
    const authorityLedger = within(threshold).getByRole('list', {
      name: 'Ulixes advisory perspective',
    })

    expect(message.compareDocumentPosition(skyline)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(authorityLedger).toHaveAttribute(
      'data-depth-plane',
      'raised-ledger',
    )
  })

  it('keeps one desktop capability ledger and one mobile progressive index', () => {
    const { container } = render(<Homepage />)

    const services = screen.getByRole('region', {
      name: homepageContent.services.headline,
    })
    const engagementList = within(services).getByRole('list', {
      name: 'Ulixes capabilities',
    })
    const mobileIndex = services.querySelector<HTMLOListElement>(
      'ol[aria-label="Mobile capability index"]',
    )
    expect(mobileIndex).not.toBeNull()
    expect(within(engagementList).getAllByRole('listitem')).toHaveLength(4)
    expect(
      within(mobileIndex!).getAllByRole('listitem', { hidden: true }),
    ).toHaveLength(4)
    expect(engagementList).toHaveAttribute('aria-label', 'Ulixes capabilities')
    expect(engagementList).toHaveAttribute(
      'data-layout',
      'ledger',
    )
    expect(engagementList).toHaveAttribute(
      'data-mobile-layout',
      'action-list',
    )
    expect(engagementList).toHaveAttribute(
      'data-depth-plane',
      'recessed-decision-shelf',
    )
    expect(container.querySelectorAll('[data-service-icon]')).toHaveLength(
      serviceModules.length,
    )

    for (const service of serviceModules) {
      /*
       * No aria-label on the link. One carrying the title alone replaced the
       * scope and description for assistive tech, so the accessible name is
       * now the link's own text and must carry all three.
       */
      const serviceLink = within(engagementList).getByRole('link', {
        name: (name) =>
          name.includes(service.title) &&
          name.includes(service.scope) &&
          name.includes(service.description),
      })
      expect(serviceLink).not.toHaveAttribute('aria-label')
      expect(serviceLink).toHaveAttribute('href', service.href)
      expect(serviceLink.querySelectorAll('svg')).toHaveLength(2)
      expect(within(engagementList).getByText(service.scope)).toBeInTheDocument()
      expect(within(mobileIndex!).getByText(service.scope)).toBeInTheDocument()
      expect(
        within(mobileIndex!).queryByText(service.description),
      ).not.toBeInTheDocument()
    }
  })

  it('centers named practitioner authority and one direct inquiry close', () => {
    const { container } = render(<Homepage />)

    const practitioner = screen.getByRole('region', {
      name: homepageContent.credibility.headline,
    })
    expect(
      within(practitioner).getByRole('img', {
        name: homepageContent.credibility.imageAlt,
      }),
    ).toBeInTheDocument()
    const linkedin = within(practitioner).getByRole('link', { name: /LinkedIn/ })
    expect(linkedin).toHaveAttribute('href', homepageContent.credibility.linkedinUrl)
    // Opens a new tab, and says so to a screen reader.
    expect(linkedin).toHaveAttribute('target', '_blank')
    expect(linkedin).toHaveAccessibleName(/\(opens in a new tab\)$/)
    /*
     * The credibility grid goes single column at 899px, so the sizes hint
     * has to say so: a 767px breakpoint had next/image serving an upscaled
     * source between the two.
     */
    expect(
      within(practitioner).getByRole('img', {
        name: homepageContent.credibility.imageAlt,
      }),
    ).toHaveAttribute(
      'sizes',
      '(max-width: 895px) 100vw, (max-width: 1120px) 44vw, 640px',
    )
    expect(within(practitioner).getAllByRole('listitem')).toHaveLength(
      homepageContent.credibility.checkpoints.length,
    )
    const footprint = within(practitioner).getByRole('complementary', {
      name: 'Ulixes delivery footprint',
    })
    expect(within(footprint).getByText('Delivery footprint')).toBeInTheDocument()
    expect(within(footprint).getByText('San Francisco base')).toBeInTheDocument()
    expect(within(footprint).queryByText('Ulysses Williams')).not.toBeInTheDocument()

    const contact = screen.getByRole('region', {
      name: homepageContent.contact.headline,
    })
    expect(
      within(contact).getByRole('link', { name: 'Discuss a mandate' }),
    ).toHaveAttribute('href', '/contact')
    expect(
      within(contact).getByRole('link', { name: homepageContent.contact.email }),
    ).toHaveAttribute('href', `mailto:${homepageContent.contact.email}`)
    expect(within(contact).getByText('Or write directly')).toBeInTheDocument()

    expect(
      screen.queryByRole('region', { name: 'Experience across markets' }),
    ).not.toBeInTheDocument()
    expect(container.querySelector('[data-home-reveal]')).not.toBeInTheDocument()
  })

  it('stops the hero video loading under reduced motion and keeps the poster', async () => {
    /*
     * The stylesheet hides the video under reduced motion, but display: none
     * does not stop an autoplaying source downloading and decoding. The
     * source has to leave the tree and the element has to be told so.
     */
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }))
    const pause = vi
      .spyOn(HTMLMediaElement.prototype, 'pause')
      .mockImplementation(() => {})
    const load = vi
      .spyOn(HTMLMediaElement.prototype, 'load')
      .mockImplementation(() => {})

    const { container } = render(<Homepage />)

    await waitFor(() =>
      expect(container.querySelector('video')).toHaveAttribute(
        'data-motion',
        'reduced',
      ),
    )
    const video = container.querySelector('video') as HTMLVideoElement
    expect(video.querySelector('source')).toBeNull()
    expect(video).not.toHaveAttribute('autoplay')
    expect(video).toHaveAttribute('preload', 'none')
    expect(pause).not.toHaveBeenCalled()
    expect(load).not.toHaveBeenCalled()
    expect(
      screen.getByRole('img', { name: homepageContent.hero.imageAlt }),
    ).toBeInTheDocument()
  })

  it('leaves the ambient video unloaded on narrow screens until the visitor asks for it', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }))
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})

    const { container } = render(<Homepage />)

    await waitFor(() => {
      const video = container.querySelector('video') as HTMLVideoElement
      expect(video.querySelector('source')).toBeNull()
      expect(video).not.toHaveAttribute('autoplay')
      expect(video).toHaveAttribute('preload', 'none')
    })
    expect(
      screen.getByRole('button', { name: 'Play background video' }),
    ).toBeInTheDocument()
  })

  it('uses semantic lists without nested article landmarks for linked modules', () => {
    const { container } = render(<Homepage />)

    expect(container.querySelectorAll('article')).toHaveLength(0)
    expect(
      screen.getByRole('list', { name: 'Ulixes capabilities' }),
    ).toBeInTheDocument()
    expect(
      container.querySelector('ol[aria-label="Mobile capability index"]'),
    ).toBeInTheDocument()
  })
})
