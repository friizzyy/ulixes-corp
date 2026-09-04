import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { institutionalExperienceContent } from '@/lib/institutional-experience-content'
import { MobileInstitutionReader } from './mobile-institution-reader'

const { categories } = institutionalExperienceContent.institutions

describe('MobileInstitutionReader', () => {
  it('keeps the institution index complete while mounting one brief', async () => {
    const user = userEvent.setup()
    render(<MobileInstitutionReader categories={categories} />)
    const index = screen.getByRole('navigation', { name: 'Institution index' })

    expect(within(index).getAllByRole('button')).toHaveLength(7)
    expect(screen.getAllByTestId('institution-description')).toHaveLength(1)

    await user.click(within(index).getByRole('button', { name: categories[3].name }))

    expect(screen.getByTestId('institution-description')).toHaveTextContent(
      categories[3].description,
    )
    expect(within(index).getByRole('button', { name: categories[3].name })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByText('04 / 07')).toBeVisible()
  })

  it('reaches every brief with visible previous and next controls', async () => {
    const user = userEvent.setup()
    render(<MobileInstitutionReader categories={categories} />)
    const next = screen.getByRole('button', { name: 'Next institution' })

    for (const [index, category] of categories.entries()) {
      if (index > 0) await user.click(next)
      expect(screen.getByTestId('institution-description')).toHaveTextContent(
        category.description,
      )
    }

    await user.click(screen.getByRole('button', { name: 'Previous institution' }))
    expect(screen.getByTestId('institution-description')).toHaveTextContent(
      categories[5].description,
    )
  })

  it('supports directional keyboard selection from the compact index', () => {
    render(<MobileInstitutionReader categories={categories} />)
    const index = screen.getByRole('navigation', { name: 'Institution index' })
    const first = within(index).getByRole('button', { name: categories[0].name })

    first.focus()
    fireEvent.keyDown(first, { key: 'ArrowRight' })

    const second = within(index).getByRole('button', { name: categories[1].name })
    expect(second).toHaveFocus()
    expect(second).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('institution-description')).toHaveTextContent(
      categories[1].description,
    )
  })
})
