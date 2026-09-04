import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { homepageContent } from '@/lib/homepage-content'
import HomePage from './page'

describe('homepage route', () => {
  it('renders the refreshed homepage as the only route composition', () => {
    render(<HomePage />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      homepageContent.hero.headline,
    )
    expect(screen.queryByText('Infrastructure Is')).not.toBeInTheDocument()
  })

  it('keeps development annotation tooling out of the root layout', () => {
    const layoutSource = readFileSync(resolve(process.cwd(), 'src/app/layout.tsx'), 'utf8')

    expect(layoutSource).not.toContain('DevAnnotation')
    expect(layoutSource).not.toContain('Agentation')
    expect(layoutSource).not.toContain('agentation')
  })
})
