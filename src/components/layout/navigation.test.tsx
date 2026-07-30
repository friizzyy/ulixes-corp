import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createElement } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Navigation } from './navigation'

const { mockUsePathname } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: mockUsePathname,
}))

describe('Navigation', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 0,
      writable: true,
    })
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  it('publishes the approved homepage links and removes the obsolete action', () => {
    render(createElement(Navigation))

    const destinations = [
      ['Expertise', '#capabilities'],
      ['Approach', '#system-trace'],
      ['Experience', '/institutional-experience'],
      ['Discuss the mandate', '/contact'],
    ] as const

    for (const [label, href] of destinations) {
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href)
    }

    expect(screen.queryByText('Get Started')).not.toBeInTheDocument()
  })

  it('sends homepage anchors back to the homepage from interior routes', () => {
    mockUsePathname.mockReturnValue('/services')

    render(createElement(Navigation))

    expect(screen.getByRole('link', { name: 'Expertise' })).toHaveAttribute(
      'href',
      '/#capabilities',
    )
    expect(screen.getByRole('link', { name: 'Approach' })).toHaveAttribute(
      'href',
      '/#system-trace',
    )
  })

  it('closes the mobile dialog on Escape and returns focus to its trigger', async () => {
    const user = userEvent.setup()
    render(createElement(Navigation))

    const trigger = screen.getByRole('button', { name: 'Open menu' })
    await user.click(trigger)

    expect(screen.getByRole('dialog', { name: 'Navigation menu' })).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Close menu' })).toHaveFocus()
    })

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog', { name: 'Navigation menu' })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes on link activation and restores the locked scroll position', async () => {
    const user = userEvent.setup()
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 240,
      writable: true,
    })

    render(createElement(Navigation))
    await user.click(screen.getByRole('button', { name: 'Open menu' }))

    expect(document.body).toHaveStyle({
      overflow: 'hidden',
      position: 'fixed',
      top: '-240px',
    })

    await user.click(
      screen.getByRole('dialog', { name: 'Navigation menu' })
        .querySelector<HTMLAnchorElement>('a[href="#capabilities"]')!,
    )

    expect(screen.queryByRole('dialog', { name: 'Navigation menu' })).not.toBeInTheDocument()
    expect(document.body.style.overflow).toBe('')
    expect(window.scrollTo).toHaveBeenCalledWith(0, 240)
  })

  it('uses a Carbon surface at the 24px homepage scroll threshold', () => {
    render(createElement(Navigation))

    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' })
    expect(navigation).toHaveAttribute('data-surface', 'transparent')

    window.scrollY = 23
    fireEvent.scroll(window)
    expect(navigation).toHaveAttribute('data-surface', 'transparent')

    window.scrollY = 24
    fireEvent.scroll(window)
    expect(navigation).toHaveAttribute('data-surface', 'carbon')
  })
})
