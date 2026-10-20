import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { InstitutionCarousel } from './institution-carousel'
import { PositionsAccordion } from './positions-accordion'

const items = [
  { title: 'First', description: 'First body' },
  { title: 'Second', description: 'Second body' },
  { title: 'Third', description: 'Third body' },
]

describe('PositionsAccordion', () => {
  it('opens the first item and keeps one open at a time', () => {
    render(<PositionsAccordion items={items} />)
    const [a, b] = screen.getAllByRole('button')
    expect(a).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('region', { name: /First/ })).toHaveTextContent('First body')

    fireEvent.click(b)
    expect(a).toHaveAttribute('aria-expanded', 'false')
    expect(b).toHaveAttribute('aria-expanded', 'true')
    expect(b).toHaveAttribute('aria-controls', screen.getByRole('region', { name: /Second/ }).id)
  })

  it('closes the open item when pressed again', () => {
    render(<PositionsAccordion items={items} />)
    const [a] = screen.getAllByRole('button')
    fireEvent.click(a)
    expect(a).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryAllByRole('region')).toHaveLength(0)
  })
})

describe('InstitutionCarousel', () => {
  it('moves the active dash to the chosen card', () => {
    const scrollTo = vi.fn()
    Element.prototype.scrollTo = scrollTo as unknown as typeof Element.prototype.scrollTo
    render(
      <InstitutionCarousel
        label="Cards"
        slides={[<p key="a">A</p>, <p key="b">B</p>, <p key="c">C</p>]}
        slideLabels={['a', 'b', 'c']}
      />,
    )
    expect(screen.getByRole('region', { name: 'Cards' })).toHaveAttribute('aria-roledescription', 'carousel')
    expect(screen.getAllByRole('group')).toHaveLength(3)
    const dots = screen.getAllByRole('button')
    expect(dots[0]).toHaveAttribute('aria-current', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Show c' }))
    expect(scrollTo).toHaveBeenCalled()
    expect(dots[2]).toHaveAttribute('aria-current', 'true')
    expect(dots[0]).not.toHaveAttribute('aria-current')
  })
})
