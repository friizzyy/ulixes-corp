import { render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StatusPage } from './status-page'

const EM_DASH = '\u2014'
const legalStylesheet = readFileSync(
  resolve(process.cwd(), 'src/components/legal/legal.module.css'),
  'utf8',
)

describe('StatusPage', () => {
  it('renders a linked primary action beside one ghost link', () => {
    const { container } = render(
      <StatusPage
        eyebrow="Page not found"
        title="This page doesn't exist."
        body="The address may have changed."
        primary={{ label: 'Return home', href: '/' }}
        secondary={{ label: 'See the capabilities', href: '/services' }}
      />,
    )

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByText('Page not found')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(
      screen.getByRole('link', { name: 'See the capabilities' }),
    ).toHaveAttribute('href', '/services')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(container.querySelectorAll('ul, ol')).toHaveLength(0)
    expect(container.textContent).not.toContain(EM_DASH)
  })

  it('renders a button that calls the handler when given one', async () => {
    const user = userEvent.setup()
    const reset = vi.fn()
    render(
      <StatusPage
        eyebrow="Something went wrong"
        title="This page failed to load."
        body="Trying again usually clears it."
        primary={{ label: 'Try again', onClick: reset }}
        secondary={{ label: 'Return home', href: '/' }}
      />,
    )

    const button = screen.getByRole('button', { name: 'Try again' })
    expect(button).toHaveAttribute('type', 'button')
    await user.click(button)
    expect(reset).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute(
      'href',
      '/',
    )
  })

  it('does not introduce sticky or fixed conversion actions', () => {
    const actionRules = [
      ...legalStylesheet.matchAll(
        /\.(?:actions|primaryAction|textLink)\s*\{([^}]*)\}/g,
      ),
    ].map((match) => match[1])

    expect(actionRules.length).toBeGreaterThan(0)
    for (const rule of actionRules) {
      expect(rule).not.toMatch(/position:\s*(?:fixed|sticky)/)
    }
  })
})
