import { render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Footer } from './footer'

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: mockUsePathname,
}))

describe('Footer', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  it('publishes the approved advisory navigation without private contact details', () => {
    render(createElement(Footer))

    const destinations = [
      ['Expertise', '#capabilities'],
      ['Approach', '#system-trace'],
      ['Experience', '/institutional-experience'],
      ['Services', '/services'],
      ['Contact', '/contact'],
      ['Privacy', '/privacy'],
      ['Terms', '/terms'],
    ] as const

    for (const [label, href] of destinations) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href)
    }

    const linkedIn = screen.getByRole('link', { name: 'LinkedIn' })
    expect(linkedIn).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/ulysses-williams-2379634/',
    )
    expect(linkedIn).toHaveAttribute('target', '_blank')
    expect(linkedIn).toHaveAttribute('rel', 'noreferrer')

    expect(
      screen.getByText('Senior-led Calypso and capital-markets systems advisory.'),
    ).toBeInTheDocument()
    expect(screen.queryByText('admin@ulixescorp.com')).not.toBeInTheDocument()
    expect(screen.queryByText('+1 (415) 283-9983')).not.toBeInTheDocument()
  })

  it('uses working homepage URLs for expertise and approach on interior routes', () => {
    mockUsePathname.mockReturnValue('/services')

    render(createElement(Footer))

    expect(screen.getByRole('link', { name: 'Expertise' })).toHaveAttribute(
      'href',
      '/#capabilities',
    )
    expect(screen.getByRole('link', { name: 'Approach' })).toHaveAttribute(
      'href',
      '/#system-trace',
    )
  })
})
