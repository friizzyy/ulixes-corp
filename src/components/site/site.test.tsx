import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockUsePathname } = vi.hoisted(() => ({ mockUsePathname: vi.fn() }))

vi.mock('next/navigation', () => ({ usePathname: mockUsePathname }))

import {
  CtaCard,
  Eyebrow,
  PhoneDock,
  Section,
  SiteFooter,
  SiteHeader,
  SlabButton,
  TextLink,
  isActiveRoute,
} from '.'

describe('isActiveRoute', () => {
  it('matches a route and the paths below it, and the root exactly', () => {
    expect(isActiveRoute('/services', '/services')).toBe(true)
    expect(isActiveRoute('/services/', '/services')).toBe(true)
    expect(isActiveRoute('/services/rows', '/services')).toBe(true)
    expect(isActiveRoute('/services-old', '/services')).toBe(false)
    expect(isActiveRoute('/services', '/')).toBe(false)
    expect(isActiveRoute('/', '/')).toBe(true)
    expect(isActiveRoute(null, '/')).toBe(false)
  })
})

describe('SiteHeader', () => {
  beforeEach(() => mockUsePathname.mockReset())

  it('links the three routes and marks only the active one', () => {
    mockUsePathname.mockReturnValue('/nasdaq-calypso')
    render(<SiteHeader />)
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((a) => [a.textContent, a.getAttribute('href')])).toEqual([
      ['Services', '/services'],
      ['Experience', '/institutional-experience'],
      ['Nasdaq Calypso', '/nasdaq-calypso'],
    ])
    expect(within(nav).getByRole('link', { name: 'Nasdaq Calypso' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Services' })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: /Discuss a mandate/ })).toHaveAttribute('href', '/contact')
  })

  it('marks nothing on a legal route and shows the phone brand bar there', () => {
    mockUsePathname.mockReturnValue('/privacy')
    const { container } = render(<SiteHeader />)
    expect(container.querySelectorAll('[aria-current]')).toHaveLength(0)
    expect(container.querySelector('[data-site-header="phone"]')).not.toBeNull()
  })

  it('leaves the phone brand to the hero on the hero-brand routes', () => {
    for (const path of ['/', '/services', '/nasdaq-calypso', '/contact']) {
      mockUsePathname.mockReturnValue(path)
      const { container, unmount } = render(<SiteHeader />)
      expect(container.querySelector('[data-site-header="phone"]')).toBeNull()
      unmount()
    }
    mockUsePathname.mockReturnValue('/institutional-experience')
    const { container } = render(<SiteHeader />)
    expect(container.querySelector('[data-site-header="phone"]')).not.toBeNull()
  })
})

/* jsdom is 1024px wide and vitest applies the CSS modules, so the phone-only
   dock is display:none here: query it with { hidden: true }. */
describe('PhoneDock', () => {
  beforeEach(() => mockUsePathname.mockReset())

  it('highlights the active item and ends with the contact square', () => {
    mockUsePathname.mockReturnValue('/institutional-experience')
    render(<PhoneDock />)
    const dock = screen.getByRole('navigation', { name: 'Quick navigation', hidden: true })
    const links = within(dock).getAllByRole('link', { hidden: true })
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/',
      '/services',
      '/institutional-experience',
      '/nasdaq-calypso',
      '/contact',
    ])
    expect(within(dock).getByRole('link', { name: 'Experience', hidden: true })).toHaveAttribute('aria-current', 'page')
    expect(within(dock).getByRole('link', { name: 'Home', hidden: true })).not.toHaveAttribute('aria-current')
    expect(within(dock).getByRole('link', { name: 'Discuss a mandate', hidden: true })).toHaveAttribute('href', '/contact')
  })

  it('treats Home as exact', () => {
    mockUsePathname.mockReturnValue('/')
    render(<PhoneDock />)
    const current = screen.getAllByRole('link', { hidden: true }).filter((a) => a.getAttribute('aria-current') === 'page')
    expect(current.map((a) => a.textContent)).toEqual(['Home'])
  })
})

describe('CtaCard', () => {
  it('renders the per-page headline as lead plus a steel turn', () => {
    render(<CtaCard lead="Bring the" turn="Calypso question." />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Bring the Calypso question.')
    const turn = heading.querySelector('.s')
    expect(turn).toHaveTextContent('Calypso question.')
    expect(heading.firstChild?.textContent).toBe('Bring the')
    expect(screen.getByRole('article')).toHaveAccessibleName('Bring the Calypso question.')
  })

  it('carries the brief: eyebrow, practitioner, first-note list, action and address', () => {
    render(<CtaCard lead="Start with" turn="the platform decision." />)
    expect(screen.getByText('Start a conversation')).toHaveClass('eb')
    expect(screen.getByText('President · Calypso subject-matter expert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'A USEFUL FIRST NOTE INCLUDES' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByRole('link', { name: /Discuss a mandate/ })).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: 'admin@ulixescorp.com' })).toHaveAttribute('href', 'mailto:admin@ulixescorp.com')
    expect(screen.getByText(/Describe the platform change/)).toBeInTheDocument()
  })

  it('accepts its own body copy and heading level', () => {
    render(<CtaCard lead="A" turn="B." body="Custom body." headingLevel={3} />)
    expect(screen.getByRole('heading', { level: 3, name: 'A B.' })).toBeInTheDocument()
    expect(screen.getByText('Custom body.')).toBeInTheDocument()
  })
})

describe('SiteFooter', () => {
  it('signposts the four legal destinations with real links and no LEGAL labels', () => {
    render(<SiteFooter />)
    const nav = screen.getByRole('navigation', { name: 'Legal and disclosures' })
    const links = within(nav).getAllByRole('link')
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/privacy',
      '/terms',
      'mailto:admin@ulixescorp.com?subject=Accessibility',
      '/terms#services',
    ])
    expect(within(nav).getByRole('link', { name: /Privacy Policy/ })).toBeInTheDocument()
    expect(within(nav).getByRole('link', { name: /Disclosures/ })).toBeInTheDocument()
    expect(screen.queryByText(/^legal$/i)).toBeNull()
  })

  it('closes with the lead, the wordmark, the copyright and the contact icons', () => {
    render(<SiteFooter />)
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Senior-led, from the first decision.')
    expect(screen.getByText('ULIXES')).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} Ulixes Corporation · San Francisco`))).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Call/ })).toHaveAttribute('href', 'tel:+14152839983')
    expect(screen.getByRole('link', { name: /^Email/ })).toHaveAttribute('href', 'mailto:admin@ulixescorp.com')
    const linkedin = screen.getByRole('link', { name: /LinkedIn/ })
    expect(linkedin).toHaveAttribute('target', '_blank')
    expect(linkedin).toHaveAttribute('rel', 'noopener noreferrer')
    expect(screen.queryByRole('link', { name: /map/i })).toBeNull()
  })
})

describe('primitives', () => {
  it('SlabButton renders a link or a button with the divided arrow cell', () => {
    const { rerender } = render(<SlabButton href="/contact" variant="light" arrow="→">Go</SlabButton>)
    const link = screen.getByRole('link', { name: /Go/ })
    expect(link).toHaveAttribute('href', '/contact')
    expect(link.querySelector('i')).toHaveTextContent('→')
    expect(link.querySelector('i')).toHaveAttribute('aria-hidden', 'true')
    rerender(<SlabButton type="submit">Send</SlabButton>)
    expect(screen.getByRole('button', { name: /Send/ })).toHaveAttribute('type', 'submit')
  })

  it('Eyebrow centres and tones through the global classes', () => {
    render(<Eyebrow centred tone="light">Approach</Eyebrow>)
    expect(screen.getByText('Approach')).toHaveClass('eb', 'eb-c', 'eb-lt')
  })

  it('TextLink is a .tl link', () => {
    render(<TextLink href="/services">Review the capabilities</TextLink>)
    const link = screen.getByRole('link', { name: /Review the capabilities/ })
    expect(link).toHaveClass('tl')
    expect(link).toHaveAttribute('href', '/services')
  })

  it('Section applies the rhythm class and the wrap', () => {
    const { container } = render(
      <>
        <Section space="head">a</Section>
        <Section>b</Section>
        <Section space="none" wrap={false}>c</Section>
      </>,
    )
    const [head, rhythm, flush] = Array.from(container.querySelectorAll('section'))
    expect(head).toHaveClass('sec-head')
    expect(rhythm).toHaveClass('sec')
    expect(rhythm.firstElementChild).toHaveClass('wrap')
    expect(flush.className).toBe('')
    expect(flush.querySelector('.wrap')).toBeNull()
  })
})
