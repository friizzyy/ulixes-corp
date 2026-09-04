import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { serviceCapabilities, servicesContent } from '@/lib/services-content'
import { ServicesPage } from './services-page'

const servicesStylesheet = readFileSync(
  resolve(process.cwd(), 'src/components/services/services-page.module.css'),
  'utf8',
)
const approachStylesheet = readFileSync(
  resolve(process.cwd(), 'src/components/services/approach-line.module.css'),
  'utf8',
)

function channelToLinear(channel: number) {
  const value = channel / 255
  return value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4
}

function luminance([red, green, blue]: readonly number[]) {
  return (
    0.2126 * channelToLinear(red) +
    0.7152 * channelToLinear(green) +
    0.0722 * channelToLinear(blue)
  )
}

function contrastForWhiteOverlay(
  foreground: readonly number[],
  background: readonly number[],
  alpha: number,
) {
  const composite = foreground.map((channel, index) =>
    Math.round(channel * alpha + background[index] * (1 - alpha)),
  )
  return (luminance(composite) + 0.05) / (luminance(background) + 0.05)
}

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

  it('keeps every route composition contract on the 895/896 boundary', () => {
    const { container } = render(<ServicesPage />)
    const responsiveContracts = [
      servicesStylesheet,
      ...Array.from(container.querySelectorAll('img'), (image) =>
        image.getAttribute('sizes'),
      ),
    ]
      .filter(Boolean)
      .join('\n')

    expect(responsiveContracts).toContain('max-width: 895px')
    expect(responsiveContracts).toContain('min-width: 896px')
    expect(responsiveContracts).not.toMatch(/(?:max-width:\s*899px|min-width:\s*900px)/)
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

  it('centers only the dark thesis at every composition width', () => {
    const { container } = render(<ServicesPage />)
    const statement = screen.getByRole('heading', {
      level: 2,
      name: servicesContent.negation.statement,
    })
    const thesis = container.querySelector(
      '[data-heading-composition="centered-thesis"]',
    )

    expect(thesis).not.toBeNull()
    expect(thesis).toContainElement(statement)
    expect(thesis).toContainElement(
      screen.getByText(servicesContent.negation.body),
    )
    expect(thesis).not.toContainElement(
      screen.getByText(servicesContent.approach.eyebrow),
    )

    const centeredThesisRule = servicesStylesheet.match(
      /\.chapterLead\s*\{([^}]*)\}/,
    )
    expect(centeredThesisRule?.[1]).toMatch(/justify-self:\s*center/)
    expect(centeredThesisRule?.[1]).toMatch(/text-align:\s*center/)
    expect(servicesStylesheet).toMatch(
      /\.chapterStatement\s*\{[^}]*margin:\s*0\s+auto/,
    )
    expect(servicesStylesheet).toMatch(
      /\.chapterBody\s*\{[^}]*margin:\s*1\.3rem\s+auto\s+0/,
    )
    expect(servicesStylesheet).toMatch(
      /\.chapterRegister\s*\{[^}]*text-align:\s*left/,
    )

    // The unqualified rule applies through 895px and from 896px upward.
    const chapterLeadIndex = servicesStylesheet.indexOf('.chapterLead')
    expect(chapterLeadIndex).toBeLessThan(
      servicesStylesheet.indexOf('@media (max-width: 895px)', chapterLeadIndex),
    )
    expect(chapterLeadIndex).toBeLessThan(
      servicesStylesheet.indexOf('@media (min-width: 896px)', chapterLeadIndex),
    )
    expect(servicesStylesheet.match(/\.chapterLead\s*\{/g)).toHaveLength(1)
    expect(container.querySelectorAll('[data-heading-composition]')).toHaveLength(1)
  })

  it('keeps desktop approach indices above WCAG AA contrast without lifting other copy', () => {
    const token = approachStylesheet.match(
      /--chapter-faint:\s*rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/,
    )
    expect(token).not.toBeNull()

    const foreground = token!.slice(1, 4).map(Number)
    const alpha = Number(token![4])
    const contrast = contrastForWhiteOverlay(
      foreground,
      [0x19, 0x1b, 0x1d],
      alpha,
    )

    expect(contrast).toBeGreaterThanOrEqual(4.5)
    expect(approachStylesheet.match(/var\(--chapter-faint\)/g)).toHaveLength(1)
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
