import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { InstitutionCarousel } from './institution-carousel'

describe('InstitutionCarousel', () => {
  it('preserves the complete seven-card desktop rail', () => {
    render(<InstitutionCarousel />)
    const rail = screen.getByRole('list', { name: 'Institution types' })

    expect(rail).toHaveAttribute('id', 'experience-institutions-rail')
    expect(within(rail).getAllByRole('listitem')).toHaveLength(7)
    expect(within(rail).getAllByRole('heading', { level: 3 })).toHaveLength(7)
    expect(within(rail).getAllByText(/./, { selector: 'p' })).toHaveLength(7)
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
