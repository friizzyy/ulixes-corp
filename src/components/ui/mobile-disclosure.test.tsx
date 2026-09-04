import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MobileDisclosure } from './mobile-disclosure'

const items = [
  {
    id: 'implementation',
    index: '01',
    eyebrow: 'Delivery',
    title: 'Implementation oversight',
    summary: 'Decision-ready control from the first working session.',
    panel: <a href="/contact">Discuss implementation oversight</a>,
  },
  {
    id: 'migration',
    index: '02',
    title: 'Migration assurance',
    summary: 'Readiness before a migration becomes irreversible.',
    panel: <a href="/contact">Discuss migration assurance</a>,
  },
]

describe('MobileDisclosure', () => {
  it('opens the requested item by default and keeps the other panel unavailable', () => {
    render(
      <MobileDisclosure
        ariaLabel="Services capabilities"
        items={items}
        defaultOpenId="migration"
      />,
    )

    const implementation = screen.getByRole('button', {
      name: /implementation oversight/i,
    })
    const migration = screen.getByRole('button', { name: /migration assurance/i })

    expect(implementation).toHaveAttribute('aria-expanded', 'false')
    expect(migration).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('region', { name: /migration assurance/i }),
    ).toContainElement(
      screen.getByRole('link', { name: /discuss migration assurance/i }),
    )
    expect(document.getElementById(implementation.getAttribute('aria-controls')!)).toHaveAttribute(
      'hidden',
    )
    expect(
      screen.queryByRole('link', { name: /discuss implementation oversight/i }),
    ).not.toBeInTheDocument()
  })

  it('switches to the selected item without leaving the previous panel open', async () => {
    const user = userEvent.setup()
    render(<MobileDisclosure ariaLabel="Services capabilities" items={items} />)

    await user.click(
      screen.getByRole('button', { name: /migration assurance/i }),
    )

    expect(
      screen.getByRole('button', { name: /implementation oversight/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', { name: /migration assurance/i }),
    ).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.queryByRole('link', { name: /discuss implementation oversight/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /discuss migration assurance/i }),
    ).toBeInTheDocument()
  })

  it('collapses the open panel with Escape only while its control has focus', async () => {
    const user = userEvent.setup()
    render(<MobileDisclosure ariaLabel="Services capabilities" items={items} />)

    const implementation = screen.getByRole('button', {
      name: /implementation oversight/i,
    })
    implementation.focus()
    await user.keyboard('{Escape}')

    expect(implementation).toHaveAttribute('aria-expanded', 'false')

    await user.click(implementation)
    const panelLink = screen.getByRole('link', {
      name: /discuss implementation oversight/i,
    })
    panelLink.focus()
    await user.keyboard('{Escape}')

    expect(implementation).toHaveAttribute('aria-expanded', 'true')
  })

  it('keeps control and panel ids stable across state changes', async () => {
    const user = userEvent.setup()
    render(<MobileDisclosure ariaLabel="Services capabilities" items={items} />)

    const implementation = screen.getByRole('button', {
      name: /implementation oversight/i,
    })
    const initialControlId = implementation.id
    const panelId = implementation.getAttribute('aria-controls')

    expect(panelId).toBeTruthy()
    expect(screen.getByRole('region', { name: /implementation oversight/i })).toHaveAttribute(
      'id',
      panelId,
    )

    await user.click(screen.getByRole('button', { name: /migration assurance/i }))
    await user.click(implementation)

    expect(implementation).toHaveAttribute('id', initialControlId)
    expect(implementation).toHaveAttribute('aria-controls', panelId)
    expect(screen.getByRole('region', { name: /implementation oversight/i })).toHaveAttribute(
      'id',
      panelId,
    )
  })

  it('uses a dark tone class and leaves every control keyboard reachable', async () => {
    const user = userEvent.setup()
    const { container } = render(
      <MobileDisclosure
        ariaLabel="Services capabilities"
        items={items}
        tone="dark"
      />,
    )

    expect(container.firstElementChild?.className).toMatch(/dark/)

    await user.tab()
    expect(screen.getByRole('button', { name: /implementation oversight/i })).toHaveFocus()
    await user.tab()
    expect(
      screen.getByRole('link', { name: /discuss implementation oversight/i }),
    ).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: /migration assurance/i })).toHaveFocus()
  })
})
