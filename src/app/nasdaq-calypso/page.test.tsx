import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  calypsoContent,
  calypsoDelivery,
  calypsoDomains,
  calypsoPrograms,
} from '@/lib/calypso-content'
import NasdaqCalypsoPage from './page'

describe('Nasdaq Calypso page', () => {
  it('opens with the open masthead and verified authority', () => {
    render(<NasdaqCalypsoPage />)

    const heading = screen.getByRole('heading', {
      level: 1,
      name: `${calypsoContent.hero.headlineLead} ${calypsoContent.hero.headlineTurn}`,
    })

    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toBe(
      `${calypsoContent.hero.headlineLead} ${calypsoContent.hero.headlineTurn}`,
    )
    /*
     * The hero is photographic, matching the homepage and the experience page.
     * Pinned because two earlier versions put the lifecycle console in the
     * hero instead: once tilted 54 degrees into the floor, once flat and full
     * width. Both opened the page on a component rather than an image, which
     * is what stopped it belonging to the rest of the site.
     */
    expect(screen.getByTestId('calypso-hero')).toHaveAttribute(
      'data-layout',
      'open-masthead',
    )
    expect(screen.getByTestId('calypso-hero')).toHaveAttribute(
      'data-mobile-flow',
      'editorial-poster',
    )
    expect(heading).toHaveAttribute('data-mobile-title', 'two-lines')
    expect(screen.getByTestId('calypso-hero-actions')).toHaveAttribute(
      'data-mobile-layout',
      'paired-actions',
    )
    expect(screen.getByTestId('lifecycle-blotter')).toBeInTheDocument()
    const authority = screen.getByLabelText('Calypso authority')
    expect(authority.closest('[data-mobile-layout="two-by-two"]')).not.toBeNull()
    expect(authority.closest('[data-mobile-alignment="centered-cells"]')).not.toBeNull()
    expect(authority).toHaveTextContent('Banks and hedge funds')

    const copy = screen.getByTestId('calypso-hero-copy')
    const media = screen.getByTestId('calypso-hero-media')
    expect(copy.compareDocumentPosition(media) & Node.DOCUMENT_POSITION_FOLLOWING)
      .toBeTruthy()
    expect(media.compareDocumentPosition(authority) & Node.DOCUMENT_POSITION_FOLLOWING)
      .toBeTruthy()
    expect(media).toHaveTextContent('')
  })

  it('uses the lifecycle as the route single depth composition', () => {
    render(<NasdaqCalypsoPage />)

    const depthCompositions = document.querySelectorAll(
      '[data-depth-composition]',
    )
    expect(depthCompositions).toHaveLength(1)
    expect(depthCompositions[0]).toHaveAttribute(
      'data-depth-composition',
      'three-office-trade-spine',
    )
    expect(depthCompositions[0]).toContainElement(
      screen.getByTestId('lifecycle-blotter'),
    )
  })

  it('recomposes every published Calypso scope into the new page chapters', () => {
    render(<NasdaqCalypsoPage />)

    expect(document.querySelector('[data-section="programs"]')).toBeInTheDocument()
    expect(document.querySelector('[data-section="mandates"]')).toBeInTheDocument()
    /*
     * getAllByText, because the programs section is a grouped index beside an
     * open detail panel: whichever program is selected renders its name in the
     * index row and again as the panel heading. Every program must still be
     * reachable from the index, which is what this asserts.
     */
    for (const program of calypsoPrograms) {
      expect(screen.getAllByText(program.name).length).toBeGreaterThan(0)
    }
    for (const domain of calypsoDomains) {
      expect(screen.getByText(domain.name)).toBeInTheDocument()
    }
    for (const mandate of calypsoDelivery) {
      expect(screen.getAllByText(mandate.title).length).toBeGreaterThan(0)
    }
  })

  it('keeps programs in one bounded book with photography separate from copy', () => {
    render(<NasdaqCalypsoPage />)

    const book = screen.getByTestId('calypso-program-book')
    expect(book).toHaveAttribute('data-mobile-layout', 'program-book')

    const media = within(book).getByTestId('calypso-program-book-media')
    const content = within(book).getByTestId('calypso-program-book-content')
    expect(media).toHaveTextContent('')
    expect(media.querySelector('img')).toHaveAttribute(
      'sizes',
      '(max-width: 895px) calc(100vw - 40px), 1248px',
    )
    expect(media.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING)
      .toBeTruthy()
  })

  it('exposes stable hooks for the centered program title and mirrored mandate header', () => {
    render(<NasdaqCalypsoPage />)

    const programHeader = screen.getByTestId('calypso-program-header')
    const programTitle = within(programHeader).getByTestId(
      'calypso-program-title-group',
    )
    const programLede = within(programHeader).getByTestId(
      'calypso-program-lede',
    )
    const mandateHeader = screen.getByTestId('calypso-mandate-header')
    const mandateTitle = within(mandateHeader).getByTestId(
      'calypso-mandate-title-group',
    )
    const mandateLede = within(mandateHeader).getByTestId(
      'calypso-mandate-lede',
    )

    expect(programTitle).toContainElement(
      screen.getByRole('heading', { level: 2, name: /eight programs/i }),
    )
    expect(programTitle.compareDocumentPosition(programLede))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(mandateTitle).toContainElement(
      screen.getByRole('heading', { level: 2, name: /four shapes/i }),
    )
    expect(mandateTitle.compareDocumentPosition(mandateLede))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('renders four mandates as one stacked ledger without a content rail', () => {
    const { container } = render(<NasdaqCalypsoPage />)

    const ledger = screen.getByRole('list', { name: 'Calypso mandate shapes' })
    expect(ledger).toHaveAttribute('data-visible-from', '896px')
    expect(within(ledger).getAllByRole('listitem')).toHaveLength(
      calypsoDelivery.length,
    )

    const mobile = screen.getByRole('region', {
      name: 'Mobile Calypso mandates',
    })
    expect(mobile).toHaveAttribute('data-visible-through', '895px')
    expect(within(mobile).getAllByRole('button')).toHaveLength(
      calypsoDelivery.length,
    )
    expect(container.querySelectorAll('[data-mandate-risk]')).toHaveLength(1)
  })
})
