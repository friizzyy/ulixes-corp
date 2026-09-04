import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { institutionalExperienceContent } from '@/lib/institutional-experience-content'
import { MobileInstitutionReader } from './mobile-institution-reader'

const { categories } = institutionalExperienceContent.institutions
const readerStyles = readFileSync(
  resolve(
    process.cwd(),
    'src/components/experience/mobile-institution-reader.module.css',
  ),
  'utf8',
)

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

  it('limits reader motion to opacity and transform', () => {
    const keyframes = readerStyles.slice(
      readerStyles.indexOf('@keyframes brief-enter-forward'),
      readerStyles.indexOf('@media (min-width: 600px)'),
    )

    expect(readerStyles).not.toMatch(/\btransition\s*:/)
    expect(keyframes).toMatch(/opacity:/)
    expect(keyframes).toMatch(/transform:/)
    expect(keyframes).not.toMatch(
      /(?:background|border|color|height|width|top|right|bottom|left):/,
    )
  })

  it('removes the brief animation when reduced motion is requested', () => {
    const reducedMotionStyles = readerStyles.slice(
      readerStyles.indexOf('@media (prefers-reduced-motion: reduce)'),
    )

    expect(reducedMotionStyles).toMatch(
      /\.brief\s*\{[^}]*animation:\s*none/,
    )
  })

  it('keeps every selector and pager control above the 44px target floor', () => {
    const indexControlStyles = readerStyles.slice(
      readerStyles.indexOf('.indexControl {'),
      readerStyles.indexOf(".indexControl[aria-pressed='true']"),
    )
    const pagerControlStyles = readerStyles.slice(
      readerStyles.indexOf('.pagerControl {'),
      readerStyles.indexOf('.pagerControl:disabled'),
    )

    expect(indexControlStyles).toMatch(/min-height:\s*3\.5rem/)
    expect(pagerControlStyles).toMatch(/width:\s*3\.5rem/)
    expect(pagerControlStyles).toMatch(/min-height:\s*3\.5rem/)
  })
})
