import { useState } from 'react'
import { renderToString } from 'react-dom/server'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MobileDetailSheet } from './mobile-detail-sheet'

function SheetHarness({ onClose }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        View control detail
      </button>
      <MobileDetailSheet
        open={open}
        onClose={() => {
          onClose?.()
          setOpen(false)
        }}
        eyebrow="Control evidence"
        title="Settlement dependencies"
        footer={<a href="/contact">Discuss this control</a>}
      >
        <p>Confirmed source systems and hand-offs.</p>
        <button type="button">Inspect dependency</button>
      </MobileDetailSheet>
    </>
  )
}

describe('MobileDetailSheet', () => {
  afterEach(() => {
    document.body.removeAttribute('style')
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
    vi.restoreAllMocks()
  })

  it('moves focus into the sheet and restores it to the trigger on close', async () => {
    const user = userEvent.setup()
    render(<SheetHarness />)
    const trigger = screen.getByRole('button', { name: 'View control detail' })
    await user.click(trigger)
    expect(screen.getByRole('button', { name: 'Close detail' })).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(trigger).toHaveFocus()
  })

  it('renders an accessible labeled dialog only while open', async () => {
    const user = userEvent.setup()
    render(<SheetHarness />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'View control detail' }))

    const dialog = screen.getByRole('dialog', { name: 'Settlement dependencies' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(within(dialog).getByText('Control evidence')).toBeInTheDocument()
    expect(within(dialog).getByText('Confirmed source systems and hand-offs.')).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: 'Discuss this control' })).toBeInTheDocument()
  })

  it('renders the open sheet as a direct body-level layer', async () => {
    const user = userEvent.setup()
    const { container } = render(<SheetHarness />)

    await user.click(screen.getByRole('button', { name: 'View control detail' }))

    const dialog = screen.getByRole('dialog', { name: 'Settlement dependencies' })
    expect(container).not.toContainElement(dialog)
    expect(dialog.parentElement?.parentElement).toBe(document.body)
  })

  it('defers an initially open sheet until client mount', () => {
    const markup = renderToString(
      <MobileDetailSheet open onClose={() => {}} title="Server-safe detail">
        <p>Deferred detail.</p>
      </MobileDetailSheet>,
    )

    expect(markup).toBe('')
  })

  it('contains forward and reverse Tab navigation within the sheet controls', async () => {
    const user = userEvent.setup()
    render(<SheetHarness />)
    await user.click(screen.getByRole('button', { name: 'View control detail' }))

    const close = screen.getByRole('button', { name: 'Close detail' })
    const footerAction = screen.getByRole('link', { name: 'Discuss this control' })

    close.focus()
    await user.tab({ shift: true })
    expect(footerAction).toHaveFocus()

    await user.tab()
    expect(close).toHaveFocus()
  })

  it('closes from the backdrop without putting the backdrop in the tab order', async () => {
    const user = userEvent.setup()
    render(<SheetHarness />)
    const trigger = screen.getByRole('button', { name: 'View control detail' })
    await user.click(trigger)

    const backdrop = screen.getByRole('button', { name: 'Close detail backdrop' })
    expect(backdrop).toHaveAttribute('tabindex', '-1')
    await user.click(backdrop)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('restores prior body styles and scroll position after close', async () => {
    const user = userEvent.setup()
    const scrollTo = vi.spyOn(window, 'scrollTo')
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 184 })
    document.body.style.overflow = 'clip'
    document.body.style.position = 'relative'
    document.body.style.width = '92%'
    document.body.style.top = '7px'
    render(<SheetHarness />)

    await user.click(screen.getByRole('button', { name: 'View control detail' }))
    expect(document.body.style.overflow).toBe('hidden')
    expect(document.body.style.position).toBe('fixed')
    expect(document.body.style.width).toBe('100%')
    expect(document.body.style.top).toBe('-184px')

    await user.click(screen.getByRole('button', { name: 'Close detail' }))
    expect(document.body.style.overflow).toBe('clip')
    expect(document.body.style.position).toBe('relative')
    expect(document.body.style.width).toBe('92%')
    expect(document.body.style.top).toBe('7px')
    expect(scrollTo).toHaveBeenCalledWith({ top: 184, behavior: 'instant' })
  })

  it('cleans up scroll locking and keyboard handling when unmounted open', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { unmount } = render(<SheetHarness onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'View control detail' }))

    unmount()
    expect(document.body.style.overflow).toBe('')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes and releases the page when the viewport reaches 896px', async () => {
    const user = userEvent.setup()
    const listeners = new Set<(event: MediaQueryListEvent) => void>()
    let desktop = false
    const mediaQuery = {
      get matches() {
        return desktop
      },
      media: '(min-width: 896px)',
      onchange: null,
      addEventListener: (_type: 'change', listener: (event: MediaQueryListEvent) => void) => {
        listeners.add(listener)
      },
      removeEventListener: (_type: 'change', listener: (event: MediaQueryListEvent) => void) => {
        listeners.delete(listener)
      },
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery)
    render(<SheetHarness />)
    await user.click(screen.getByRole('button', { name: 'View control detail' }))
    expect(document.body.style.overflow).toBe('hidden')

    desktop = true
    listeners.forEach((listener) =>
      listener({ matches: true, media: '(min-width: 896px)' } as MediaQueryListEvent),
    )

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(document.body.style.overflow).toBe('')
  })
})
