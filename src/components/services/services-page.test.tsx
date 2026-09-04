import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { serviceCapabilities, servicesContent } from '@/lib/services-content'
import { ServicesPage } from './services-page'

describe('ServicesPage', () => {
  it('leads with one headline and one dominant action', () => {
    render(<ServicesPage />)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(servicesContent.hero.headline)
    const hero = screen.getByRole('region', {
      name: servicesContent.hero.headline,
    })
    const heroImage = within(hero).getByRole('img', {
      name: /Travertine atrium/i,
    })
    expect(hero).toHaveAttribute('data-mobile-flow', 'message-first')
    expect(
      headings[0].compareDocumentPosition(heroImage) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
    expect(screen.getAllByRole('link', { name: /Discuss a mandate/ })[0]).toHaveAttribute(
      'href',
      '/contact',
    )
  })

  it('sets the four capabilities as one ledger of conversation starters', () => {
    const { container } = render(<ServicesPage />)
    for (const capability of serviceCapabilities) {
      const row = container.querySelector(
        `a[data-disclosure-hash-target="${capability.id}"]`,
      )
      expect(row).not.toBeNull()
      expect(row).not.toHaveAttribute('id')
      expect(document.getElementById(capability.id)).toBeNull()
      expect(row).toHaveAttribute('href', capability.contactHref)
      expect(within(row as HTMLElement).getByText(capability.title)).toBeInTheDocument()
      expect(within(row as HTMLElement).getByText(capability.risk)).toBeInTheDocument()
    }
  })

  it('offers four mobile capability controls with the first open by default', () => {
    render(<ServicesPage />)
    const disclosure = screen.getByRole('region', { name: 'Services capabilities' })
    const controls = within(disclosure).getAllByRole('button')

    expect(controls).toHaveLength(4)
    expect(controls[0]).toHaveAttribute('aria-expanded', 'true')
    controls.slice(1).forEach((control) => {
      expect(control).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('always keeps exactly one mobile capability selected', async () => {
    const user = userEvent.setup()
    render(<ServicesPage />)
    const disclosure = screen.getByRole('region', { name: 'Services capabilities' })
    const controls = within(disclosure).getAllByRole('button')

    await user.click(controls[0])
    expect(
      within(disclosure).getAllByRole('button', { expanded: true }),
    ).toHaveLength(1)

    await user.click(controls[2])
    expect(
      within(disclosure).getAllByRole('button', { expanded: true }),
    ).toHaveLength(1)
    expect(controls[2]).toHaveAttribute('aria-expanded', 'true')
  })

  it('links every mobile capability panel to its mandate target', () => {
    render(<ServicesPage />)
    const disclosure = screen.getByRole('region', { name: 'Services capabilities' })
    const controls = within(disclosure).getAllByRole('button')

    serviceCapabilities.forEach((capability, index) => {
      if (index > 0) fireEvent.click(controls[index])
      expect(within(disclosure).getByText(capability.risk)).toBeInTheDocument()
      expect(
        within(disclosure).getByRole('link', {
          name: servicesContent.capabilities.contactCta,
        }),
      ).toHaveAttribute('href', capability.contactHref)
    })
  })

  it('opens and aligns the capability named by a phone deep link', () => {
    const originalMatchMedia = window.matchMedia
    const originalRequestAnimationFrame = window.requestAnimationFrame
    const originalCancelAnimationFrame = window.cancelAnimationFrame
    const originalScrollIntoView = HTMLElement.prototype.scrollIntoView
    const scheduled: FrameRequestCallback[] = []
    const scrollIntoView = vi.fn()

    window.history.replaceState(null, '', '/services#trading')
    window.matchMedia = (query: string) =>
      ({
        matches: query === '(max-width: 895px)',
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList
    window.requestAnimationFrame = (callback: FrameRequestCallback) => {
      scheduled.push(callback)
      return scheduled.length
    }
    window.cancelAnimationFrame = vi.fn()
    HTMLElement.prototype.scrollIntoView = scrollIntoView

    try {
      render(<ServicesPage />)
      const disclosure = screen.getByRole('region', {
        name: 'Services capabilities',
      })
      const trading = within(disclosure).getByRole('button', {
        name: /Trading, risk and post-trade/i,
      })

      expect(trading).toHaveAttribute('aria-expanded', 'true')
      act(() => scheduled.forEach((callback) => callback(0)))
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'auto',
        block: 'start',
        inline: 'nearest',
      })
    } finally {
      window.history.replaceState(null, '', '/')
      window.matchMedia = originalMatchMedia
      window.requestAnimationFrame = originalRequestAnimationFrame
      window.cancelAnimationFrame = originalCancelAnimationFrame
      HTMLElement.prototype.scrollIntoView = originalScrollIntoView
    }
  })

  it('assigns capability variants to opposite sides of the 895/896 breakpoint', () => {
    const { container } = render(<ServicesPage />)
    const desktopLedger = container.querySelector(
      '[data-services-capabilities="desktop"]',
    )
    const disclosure = screen.getByRole('region', { name: 'Services capabilities' })
    const mobileDisclosure = disclosure.closest('[data-services-capabilities="mobile"]')

    expect(desktopLedger).toHaveAttribute('data-visible-from', '896px')
    expect(mobileDisclosure).toHaveAttribute('data-visible-through', '895px')
  })

  it('makes the desktop approach and mobile process pager breakpoint-exclusive', () => {
    const { container } = render(<ServicesPage />)
    expect(screen.getByText(servicesContent.negation.statement)).toBeInTheDocument()
    const desktopApproach = container.querySelector('[data-services-process="desktop"]')
    const mobileApproach = container.querySelector('[data-services-process="mobile"]')

    expect(desktopApproach).toHaveAttribute('data-visible-from', '896px')
    expect(mobileApproach).toHaveAttribute('data-visible-through', '895px')
    expect(
      within(mobileApproach as HTMLElement).getAllByRole('button', {
        expanded: true,
      }),
    ).toHaveLength(1)
  })

  it('carries the automation note and the Calypso evidence', () => {
    render(<ServicesPage />)
    expect(screen.getByText(servicesContent.automation.headline)).toBeInTheDocument()
    expect(screen.getByText(servicesContent.automation.body)).toBeInTheDocument()
    expect(screen.getByText(servicesContent.calypso.headline)).toBeInTheDocument()
  })

  it('renders no lists and no em dashes', () => {
    const { container } = render(<ServicesPage />)
    expect(container.querySelectorAll('ul, ol')).toHaveLength(0)
    expect(container.textContent).not.toContain('—')
  })
})
