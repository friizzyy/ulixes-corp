import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { calypsoStages } from '@/lib/calypso-content'
import NasdaqCalypsoPage from './page'

/*
 * jsdom is 1024px wide and CSS modules are applied, so the phone-only
 * compositions are display:none here: query them with { hidden: true }.
 */
describe('Nasdaq Calypso page', () => {
  it('opens on the hero headline and the facts bar', () => {
    render(<NasdaqCalypsoPage />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Calypso since 2004. Every office it touches.' }),
    ).toBeInTheDocument()
    const facts = screen.getByRole('list', { name: 'The practice in numbers' })
    expect(within(facts).getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      '7lifecycle stagesCapture to regulatory reporting',
      '8programsEarnings, delivery and capital',
      '6instrument classesRates through equity derivatives',
      '3officesFront, middle and back',
    ])
    expect(screen.getAllByRole('link', { name: /Discuss a mandate/ })[0]).toHaveAttribute('href', '/contact')
    expect(screen.getByRole('link', { name: /Explore the platform/ })).toHaveAttribute('href', '#lifecycle')
  })

  it('draws the brand inside the phone hero', () => {
    render(<NasdaqCalypsoPage />)
    const phone = screen.getByTestId('calypso-hero-phone')
    expect(within(phone).getByRole('link', { name: 'Ulixes Corporation, home', hidden: true })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('renders the section headings in order', () => {
    render(<NasdaqCalypsoPage />)
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'One trade, seven places it goes wrong.',
      'Eight programs, six instrument classes.',
      'Four shapes a Calypso mandate takes.',
      'Bring the Calypso question.',
    ])
  })

  it('breaks a stage and shows how far the break travels', () => {
    render(<NasdaqCalypsoPage />)
    const desk = screen.getByTestId('lifecycle-desk')
    const stages = within(desk).getAllByRole('button').filter((b) => b.hasAttribute('aria-pressed'))
    expect(stages).toHaveLength(7)
    expect(stages[0]).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('lifecycle-count')).toHaveTextContent('6')
    expect(screen.getByTestId('lifecycle-readout')).toHaveTextContent(`WHERE CAPTURE BREAKS${calypsoStages[0].breaks}`)

    fireEvent.click(stages[3])
    expect(stages[3]).toHaveAttribute('aria-pressed', 'true')
    expect(stages[0]).toHaveAttribute('aria-pressed', 'false')
    expect(stages[3]).toHaveAttribute('data-state', 'broken')
    expect(stages.slice(4).every((s) => s.dataset.state === 'inherits')).toBe(true)
    expect(stages.slice(0, 3).every((s) => s.dataset.state === 'clear')).toBe(true)
    expect(screen.getByTestId('lifecycle-count')).toHaveTextContent('3')
    expect(screen.getByTestId('lifecycle-readout')).toHaveTextContent('WHERE COLLATERAL BREAKS')
    expect(within(desk).getByRole('link', { name: /Discuss this stage/ })).toHaveAttribute(
      'href',
      '/contact?program=Calypso%20collateral%20stage',
    )

    fireEvent.keyDown(stages[6], { key: 'Enter' })
    expect(screen.getByTestId('lifecycle-count')).toHaveTextContent('0')
  })

  it('shares the break with the phone rail', () => {
    render(<NasdaqCalypsoPage />)
    const phone = screen.getByTestId('lifecycle-phone')
    const cards = within(phone).getAllByRole('button', { hidden: true })
    expect(cards).toHaveLength(7)
    fireEvent.keyDown(cards[1], { key: ' ' })
    expect(cards[1]).toHaveAttribute('aria-pressed', 'true')
    expect(cards[1]).toHaveTextContent('Break')
    expect(cards[2]).toHaveTextContent('Inherits')
    const desk = screen.getByTestId('lifecycle-desk')
    expect(within(desk).getAllByRole('button').filter((b) => b.getAttribute('aria-pressed') === 'true')[0]).toHaveTextContent(
      'Valuation',
    )
  })

  it('opens one program at a time within each desktop column', () => {
    render(<NasdaqCalypsoPage />)
    const desk = screen.getByTestId('programs-desk')
    const first = within(desk).getByRole('button', { name: /Hedge accounting framework design/ })
    const second = within(desk).getByRole('button', { name: /Earnings volatility remediation/ })
    const other = within(desk).getByRole('button', { name: /Calypso front-to-back implementation/ })
    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(other).toHaveAttribute('aria-expanded', 'true')
    expect(second).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(second)
    expect(second).toHaveAttribute('aria-expanded', 'true')
    expect(first).toHaveAttribute('aria-expanded', 'false')
    expect(other).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(second)
    expect(second).toHaveAttribute('aria-expanded', 'false')
    expect(document.getElementById(second.getAttribute('aria-controls')!)).toHaveAttribute('inert')
  })

  it('lists the eight programs and six instrument classes', () => {
    render(<NasdaqCalypsoPage />)
    const desk = screen.getByTestId('programs-desk')
    expect(within(desk).getAllByRole('button')).toHaveLength(8)
    expect(screen.getByRole('list', { name: 'APPLIED ACROSS SIX PRODUCT DOMAINS' }).children).toHaveLength(6)
  })

  it('opens program families and read-more notes on the phone', () => {
    render(<NasdaqCalypsoPage />)
    const phone = screen.getByTestId('programs-phone')
    const families = ['Earnings and audit', 'Delivery and migration', 'Capital and regulatory'].map((name) =>
      within(phone).getByRole('button', { name: new RegExp(name), hidden: true }),
    )
    expect(families.map((f) => f.getAttribute('aria-expanded'))).toEqual(['true', 'false', 'false'])
    fireEvent.click(families[1])
    expect(families.map((f) => f.getAttribute('aria-expanded'))).toEqual(['false', 'true', 'false'])

    const more = within(phone)
      .getAllByRole('button', { hidden: true })
      .find((b) => b.textContent === 'Read more about Platform migration and data integrity')!
    expect(more).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(more)
    expect(more).toHaveAttribute('aria-expanded', 'true')
  })

  it('shows four mandate cards and a phone accordion', () => {
    render(<NasdaqCalypsoPage />)
    expect(within(screen.getByTestId('mandates-desk')).getAllByRole('listitem')).toHaveLength(4)
    const phone = screen.getByTestId('mandates-phone')
    const items = within(phone).getAllByRole('button', { hidden: true })
    expect(items.map((b) => b.getAttribute('aria-expanded'))).toEqual(['true', 'false', 'false', 'false'])
    fireEvent.click(items[2])
    expect(items.map((b) => b.getAttribute('aria-expanded'))).toEqual(['false', 'false', 'true', 'false'])
    fireEvent.click(items[2])
    expect(items.every((b) => b.getAttribute('aria-expanded') === 'false')).toBe(true)
  })

  it('closes on the brief card', () => {
    render(<NasdaqCalypsoPage />)
    expect(screen.getByRole('heading', { level: 2, name: 'Bring the Calypso question.' })).toBeInTheDocument()
  })

  it('uses no italic or serif turn', () => {
    const { container } = render(<NasdaqCalypsoPage />)
    expect(container.querySelector('em.s, i.s')).toBeNull()
    expect(container.innerHTML).not.toMatch(/font-serif/)
  })
})
