import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { calypsoContent } from '@/lib/calypso-content'
import { chainStages } from '@/lib/expertise-content'
import { MobileLifecyclePager } from './mobile-lifecycle-pager'

const renderPager = () =>
  render(
    <MobileLifecyclePager
      stages={chainStages}
      schematic={calypsoContent.schematic}
    />,
  )

function installStageRailLayout({
  controlWidth = 44,
  viewportWidth = 100,
}: {
  controlWidth?: number
  viewportWidth?: number
} = {}) {
  const originalGetBoundingClientRect =
    HTMLElement.prototype.getBoundingClientRect
  const originalScrollTo = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'scrollTo',
  )
  const originalScrollIntoView = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'scrollIntoView',
  )
  const scrollIntoView = vi.fn()
  const scrollTo = vi.fn(function (
    this: HTMLElement,
    optionsOrX?: ScrollToOptions | number,
  ) {
    const left =
      typeof optionsOrX === 'number'
        ? optionsOrX
        : (optionsOrX?.left ?? this.scrollLeft)
    this.scrollLeft = left
  })
  const rect = (left: number, width: number): DOMRect =>
    ({
      x: left,
      y: 0,
      left,
      top: 0,
      width,
      height: 48,
      right: left + width,
      bottom: 48,
      toJSON: () => ({}),
    }) as DOMRect

  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    writable: true,
    value: scrollTo,
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    writable: true,
    value: scrollIntoView,
  })
  HTMLElement.prototype.getBoundingClientRect = function () {
    const group = this.parentElement?.getAttribute('role') === 'group'
      ? this.parentElement
      : null
    const viewport = group?.parentElement

    if (this.tagName === 'BUTTON' && group && viewport) {
      const controls = Array.from(group.querySelectorAll('button'))
      const index = controls.indexOf(this as HTMLButtonElement)
      return rect(index * controlWidth - viewport.scrollLeft, controlWidth)
    }

    if (this.firstElementChild?.getAttribute('role') === 'group') {
      return rect(0, viewportWidth)
    }

    return originalGetBoundingClientRect.call(this)
  }

  return {
    scrollIntoView,
    scrollTo,
    restore() {
      HTMLElement.prototype.getBoundingClientRect =
        originalGetBoundingClientRect
      if (originalScrollTo) {
        Object.defineProperty(HTMLElement.prototype, 'scrollTo', originalScrollTo)
      } else {
        delete (HTMLElement.prototype as Partial<HTMLElement>).scrollTo
      }
      if (originalScrollIntoView) {
        Object.defineProperty(
          HTMLElement.prototype,
          'scrollIntoView',
          originalScrollIntoView,
        )
      } else {
        delete (HTMLElement.prototype as Partial<HTMLElement>).scrollIntoView
      }
    },
  }
}

describe('MobileLifecyclePager', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/nasdaq-calypso#lifecycle')
  })

  afterEach(() => {
    document.body.removeAttribute('style')
    vi.restoreAllMocks()
  })

  it('offers seven direct stage controls and mounts one active summary', () => {
    renderPager()

    const selector = screen.getByRole('group', {
      name: 'Select lifecycle stage',
    })
    const controls = within(selector).getAllByRole('button')
    const summary = screen.getByRole('region', {
      name: 'Active lifecycle stage',
    })

    expect(controls).toHaveLength(7)
    expect(controls.filter((control) => control.getAttribute('aria-pressed') === 'true'))
      .toHaveLength(1)
    expect(controls[0]).toHaveAccessibleName('Stage 1: Capture')
    expect(summary).toHaveTextContent('01 / 07')
    expect(summary).toHaveTextContent('Capture')
    expect(summary).toHaveTextContent('Front office')
    expect(summary).toHaveTextContent(
      calypsoContent.schematic.stageDetail.capture.does,
    )
    expect(summary).toHaveTextContent(
      calypsoContent.schematic.stageDetail.capture.breaks,
    )
    expect(summary).not.toHaveTextContent(
      calypsoContent.schematic.stageDetail.valuation.does,
    )
  })

  it('selects a stage directly and keeps only its summary mounted', async () => {
    const user = userEvent.setup()
    renderPager()

    await user.click(screen.getByRole('button', { name: 'Stage 4: Collateral' }))

    const summary = screen.getByRole('region', {
      name: 'Active lifecycle stage',
    })
    expect(summary).toHaveTextContent('04 / 07')
    expect(summary).toHaveTextContent('Collateral')
    expect(summary).toHaveTextContent('Middle office')
    expect(summary).toHaveTextContent(
      calypsoContent.schematic.stageDetail.collateral.breaks,
    )
    expect(
      screen.getByRole('button', { name: 'Stage 4: Collateral' }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('stops previous and next navigation at the lifecycle boundaries', async () => {
    const user = userEvent.setup()
    renderPager()

    const previous = screen.getByRole('button', { name: 'Previous stage' })
    const next = screen.getByRole('button', { name: 'Next stage' })

    expect(previous).toBeDisabled()
    await user.click(next)
    expect(screen.getByText('02 / 07')).toBeVisible()
    expect(previous).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Stage 7: Regulatory reporting' }))
    expect(next).toBeDisabled()
  })

  it('selects and focuses stages with arrow, Home, and End keys', () => {
    renderPager()
    const controls = within(
      screen.getByRole('group', { name: 'Select lifecycle stage' }),
    ).getAllByRole('button')

    controls[0].focus()
    fireEvent.keyDown(controls[0], { key: 'ArrowRight' })
    expect(controls[1]).toHaveFocus()
    expect(controls[1]).toHaveAttribute('aria-pressed', 'true')

    fireEvent.keyDown(controls[1], { key: 'End' })
    expect(controls[6]).toHaveFocus()
    expect(controls[6]).toHaveAttribute('aria-pressed', 'true')

    fireEvent.keyDown(controls[6], { key: 'Home' })
    expect(controls[0]).toHaveFocus()
    expect(controls[0]).toHaveAttribute('aria-pressed', 'true')

    fireEvent.keyDown(controls[0], { key: 'ArrowLeft' })
    expect(controls[0]).toHaveFocus()
    expect(controls[0]).toHaveAttribute('aria-pressed', 'true')
  })

  it('initializes from a valid stage URL and falls back from an unknown one', () => {
    window.history.replaceState(
      {},
      '',
      '/nasdaq-calypso?stage=reporting#lifecycle',
    )
    const { unmount } = renderPager()

    expect(screen.getByText('07 / 07')).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Stage 7: Regulatory reporting' }),
    ).toHaveAttribute('aria-pressed', 'true')

    unmount()
    window.history.replaceState(
      {},
      '',
      '/nasdaq-calypso?stage=unknown#lifecycle',
    )
    renderPager()
    expect(screen.getByText('01 / 07')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Stage 1: Capture' }))
      .toHaveAttribute('aria-pressed', 'true')
  })

  it('locally reveals a direct URL stage without moving the page', () => {
    const rail = installStageRailLayout()
    const pageScroll = vi.spyOn(window, 'scrollTo')
    window.history.replaceState(
      {},
      '',
      '/nasdaq-calypso?stage=reporting#lifecycle',
    )

    try {
      renderPager()
      const viewport = screen.getByRole('group', {
        name: 'Select lifecycle stage',
      }).parentElement

      expect(viewport?.scrollLeft).toBe(208)
      expect(rail.scrollTo).toHaveBeenLastCalledWith({
        behavior: 'auto',
        left: 208,
      })
      expect(rail.scrollIntoView).not.toHaveBeenCalled()
      expect(pageScroll).not.toHaveBeenCalled()
    } finally {
      rail.restore()
    }
  })

  it('reveals direct selection, popstate, and a returning mobile viewport', async () => {
    const user = userEvent.setup()
    const rail = installStageRailLayout()
    const pageScroll = vi.spyOn(window, 'scrollTo')

    try {
      renderPager()
      const viewport = screen.getByRole('group', {
        name: 'Select lifecycle stage',
      }).parentElement as HTMLElement

      await user.click(
        screen.getByRole('button', { name: 'Stage 7: Regulatory reporting' }),
      )
      expect(viewport.scrollLeft).toBe(208)
      expect(rail.scrollTo).toHaveBeenLastCalledWith({
        behavior: 'smooth',
        left: 208,
      })

      viewport.scrollLeft = 0
      window.history.pushState(
        {},
        '',
        '/nasdaq-calypso?stage=reporting#lifecycle',
      )
      fireEvent.popState(window)
      expect(viewport.scrollLeft).toBe(208)
      expect(rail.scrollTo).toHaveBeenLastCalledWith({
        behavior: 'auto',
        left: 208,
      })

      viewport.scrollLeft = 0
      fireEvent.resize(window)
      expect(viewport.scrollLeft).toBe(208)
      expect(rail.scrollIntoView).not.toHaveBeenCalled()
      expect(pageScroll).not.toHaveBeenCalled()
    } finally {
      rail.restore()
    }
  })

  it('cuts horizontal reveal motion when reduced motion is requested', async () => {
    const user = userEvent.setup()
    const rail = installStageRailLayout()
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList,
    )

    try {
      renderPager()
      await user.click(
        screen.getByRole('button', { name: 'Stage 7: Regulatory reporting' }),
      )

      expect(rail.scrollTo).toHaveBeenLastCalledWith({
        behavior: 'auto',
        left: 208,
      })
    } finally {
      rail.restore()
    }
  })

  it('writes selection to history while preserving other query and hash state', async () => {
    const user = userEvent.setup()
    window.history.replaceState(
      {},
      '',
      '/nasdaq-calypso?view=compact#lifecycle',
    )
    const pushState = vi.spyOn(window.history, 'pushState')
    renderPager()

    await user.click(screen.getByRole('button', { name: 'Stage 5: Settlement' }))

    expect(window.location.search).toBe('?view=compact&stage=settlement')
    expect(window.location.hash).toBe('#lifecycle')
    expect(pushState).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Stage 5: Settlement' }))
    expect(pushState).toHaveBeenCalledTimes(1)
  })

  it('restores the selected stage when browser history changes', () => {
    renderPager()
    const target = screen.getByRole('button', {
      name: 'Stage 6: Ledger',
    })
    target.focus()

    window.history.pushState(
      {},
      '',
      '/nasdaq-calypso?stage=collateral#lifecycle',
    )
    fireEvent.popState(window)

    expect(screen.getByText('04 / 07')).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Stage 4: Collateral' }),
    ).toHaveFocus()
  })

  it('keeps deep evidence out of the page until the active stage sheet opens', async () => {
    const user = userEvent.setup()
    renderPager()
    await user.click(screen.getByRole('button', { name: 'Stage 4: Collateral' }))

    expect(screen.queryByText('Built from')).not.toBeInTheDocument()
    expect(screen.queryByText('Depends on')).not.toBeInTheDocument()
    expect(screen.queryByText('Hands on')).not.toBeInTheDocument()

    const trigger = screen.getByRole('button', { name: 'View control detail' })
    await user.click(trigger)

    const dialog = screen.getByRole('dialog', {
      name: 'Collateral control detail',
    })
    expect(dialog).toHaveTextContent('Built from')
    expect(dialog).toHaveTextContent('Depends on')
    expect(dialog).toHaveTextContent('Hands on')
    for (const item of calypsoContent.schematic.stageLedger.collateral.objects) {
      expect(dialog).toHaveTextContent(item)
    }
    expect(dialog).toHaveTextContent(
      calypsoContent.schematic.stageLedger.collateral.depends,
    )
    expect(dialog).toHaveTextContent(
      calypsoContent.schematic.stageLedger.collateral.carries,
    )

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('cuts directional motion when reduced motion is requested', async () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => false,
        }) as MediaQueryList,
    )
    renderPager()

    expect(
      await screen.findByTestId('mobile-lifecycle-pager'),
    ).toHaveAttribute('data-motion', 'reduced')
  })
})
