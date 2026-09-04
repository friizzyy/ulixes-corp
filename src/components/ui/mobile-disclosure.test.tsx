import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
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

const originalScrollIntoView = HTMLElement.prototype.scrollIntoView

describe('MobileDisclosure', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/')
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      writable: true,
      value: originalScrollIntoView,
    })
    vi.restoreAllMocks()
  })

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

  it('keeps one disclosure selected when collapse is disabled', async () => {
    const user = userEvent.setup()
    render(
      <MobileDisclosure
        ariaLabel="Phases"
        items={items}
        allowCollapse={false}
      />,
    )
    const first = screen.getByRole('button', { name: /implementation oversight/i })
    await user.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'true')

    first.focus()
    await user.keyboard('{Escape}')
    expect(first).toHaveAttribute('aria-expanded', 'true')
  })

  it('selects an item when strict mode is enabled after every item was collapsed', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <MobileDisclosure ariaLabel="Phases" items={items} />,
    )
    const first = screen.getByRole('button', { name: /implementation oversight/i })
    await user.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'false')

    rerender(
      <MobileDisclosure
        ariaLabel="Phases"
        items={items}
        allowCollapse={false}
      />,
    )
    expect(first).toHaveAttribute('aria-expanded', 'true')
  })

  it('selects the first remaining item when the strict selection is removed', () => {
    const { rerender } = render(
      <MobileDisclosure
        ariaLabel="Phases"
        items={items}
        allowCollapse={false}
      />,
    )

    rerender(
      <MobileDisclosure
        ariaLabel="Phases"
        items={items.slice(1)}
        allowCollapse={false}
      />,
    )

    expect(screen.getByRole('button', { name: /migration assurance/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
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

  it('uses the mobile hash behavior through the 895px ceiling', async () => {
    window.history.replaceState(null, '', '/#migration')
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === '(max-width: 895px)',
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }))
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    })

    render(
      <MobileDisclosure
        ariaLabel="Services capabilities"
        items={items}
        syncWithLocationHash
      />,
    )

    expect(await screen.findByRole('button', { name: /migration assurance/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })
})
