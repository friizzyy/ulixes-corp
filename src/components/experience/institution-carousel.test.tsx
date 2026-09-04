import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { InstitutionCarousel } from './institution-carousel'

describe('InstitutionCarousel', () => {
  it('publishes one seven-item institution rail with explicit phone progress', () => {
    const { container } = render(<InstitutionCarousel />)
    const rail = screen.getByRole('list', { name: 'Institution types' })

    expect(rail).toHaveAttribute('id', 'experience-institutions-rail')
    expect(within(rail).getAllByRole('listitem')).toHaveLength(7)
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent(
      '01 / 07',
    )
    expect(screen.getByText('Swipe')).toBeInTheDocument()
  })

  it('keeps every card stable while the native track scrolls', () => {
    render(<InstitutionCarousel />)
    const rail = screen.getByRole('list', { name: 'Institution types' })

    for (const card of Array.from(rail.children) as HTMLElement[]) {
      expect(card.style.transform).toBe('')
      expect(card.style.opacity).toBe('')
      expect(card.style.zIndex).toBe('')
    }
  })
})
