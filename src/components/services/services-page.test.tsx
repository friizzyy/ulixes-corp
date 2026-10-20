import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ServicesPage } from './services-page'

afterEach(() => {
  vi.useRealTimers()
})

describe('ServicesPage', () => {
  it('renders the hero headline, brand and calls to action', () => {
    render(<ServicesPage />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Architecture. Not configuration.')
    expect(screen.getAllByRole('link', { name: /discuss a mandate/i, hidden: true })[0]).toHaveAttribute(
      'href',
      '/contact',
    )
    expect(screen.getByRole('link', { name: /view capabilities/i })).toHaveAttribute(
      'href',
      '#capabilities',
    )
    // The phone hero draws the brand itself (hidden in the 1024px jsdom).
    expect(screen.getByRole('link', { name: 'Ulixes Corporation, home', hidden: true })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('links the capability bar to each card', () => {
    render(<ServicesPage />)
    const bar = screen.getByRole('navigation', { name: 'Capabilities' })
    const links = within(bar).getAllByRole('link')
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '#architecture',
      '#accounting',
      '#trading',
      '#assurance',
    ])
    for (const link of links) {
      expect(document.getElementById(link.getAttribute('href')!.slice(1))).not.toBeNull()
    }
  })

  it('renders the four capability cards with lists and lifecycle spans', () => {
    render(<ServicesPage />)
    const section = screen.getByRole('region', { name: 'Four capabilities' })
    const cards = within(section).getAllByRole('article')
    expect(cards).toHaveLength(4)
    expect(within(cards[0]).getByRole('heading', { level: 2 })).toHaveTextContent(
      'Transformation and solution architecture',
    )
    expect(within(cards[0]).getAllByRole('listitem')).toHaveLength(5)
    expect(within(cards[2]).getAllByRole('listitem')).toHaveLength(6)
    expect(cards[0]).toHaveTextContent('LIFECYCLE SPAN · 7 OF 7 STAGES')
    expect(cards[1]).toHaveTextContent('LIFECYCLE SPAN · 3 OF 7 STAGES')
    expect(within(cards[3]).getByRole('img')).toHaveAccessibleName('Spans risk to reporting')
  })

  it('marks the active carousel dash and moves it on selection', () => {
    render(<ServicesPage />)
    const dashes = screen.getAllByRole('button', { name: /^Capability \d of 4/, hidden: true })
    expect(dashes).toHaveLength(4)
    expect(dashes[0]).toHaveAttribute('aria-current', 'true')
    fireEvent.click(dashes[2])
    expect(dashes[2]).toHaveAttribute('aria-current', 'true')
    expect(dashes[0]).not.toHaveAttribute('aria-current')
  })

  it('renders the approach with a centred heading, four phases and the first close', () => {
    vi.useFakeTimers()
    render(<ServicesPage />)
    const h2 = screen.getByRole('heading', { level: 2, name: 'Go-live is not success.' })
    expect(h2.previousElementSibling).toHaveClass('eb', 'eb-c')
    const phases = screen.getAllByRole('heading', { level: 3, name: 'Architecture definition', hidden: true })
    // One set for the line card, one for the phone rail.
    expect(phases).toHaveLength(2)
    expect(screen.getByRole('img', { name: 'Four phases, ending at the first close' })).toHaveTextContent(
      'FIRST CLOSE',
    )
    const card = screen.getByRole('img', { name: 'Four phases, ending at the first close' }).parentElement!
    act(() => {
      vi.advanceTimersByTime(2600)
    })
    expect(card).toHaveAttribute('data-on')
  })

  it('closes on the brief card with the services headline', () => {
    render(<ServicesPage />)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Start with the platform decision.' }),
    ).toBeInTheDocument()
  })
})
