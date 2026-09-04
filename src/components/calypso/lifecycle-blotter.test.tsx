import { fireEvent, render, screen } from '@testing-library/react'
import { act } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { calypsoContent } from '@/lib/calypso-content'
import { chainStages } from '@/lib/expertise-content'
import { LifecycleBlotter } from './lifecycle-blotter'

const officeBands = [
  'Front office',
  'Front office',
  'Middle office',
  'Middle office',
  'Back office',
  'Back office',
  'Back office',
]

function installMatchMedia(initialMatches: Record<string, boolean> = {}) {
  const matches = new Map(Object.entries(initialMatches))
  const listeners = new Map<string, Set<(event: MediaQueryListEvent) => void>>()

  const originalMatchMedia = window.matchMedia
  window.matchMedia = ((query: string) => ({
    get matches() {
      return matches.get(query) ?? false
    },
    media: query,
    onchange: null,
    addEventListener: (
      _event: string,
      listener: EventListenerOrEventListenerObject,
    ) => {
      if (typeof listener !== 'function') return
      const queryListeners = listeners.get(query) ?? new Set()
      queryListeners.add(listener as (event: MediaQueryListEvent) => void)
      listeners.set(query, queryListeners)
    },
    removeEventListener: (
      _event: string,
      listener: EventListenerOrEventListenerObject,
    ) => {
      if (typeof listener !== 'function') return
      listeners.get(query)?.delete(listener as (event: MediaQueryListEvent) => void)
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia

  return {
    report(query: string, next: boolean) {
      matches.set(query, next)
      const event = { matches: next, media: query } as MediaQueryListEvent
      listeners.get(query)?.forEach((listener) => listener(event))
    },
    restore() {
      window.matchMedia = originalMatchMedia
    },
  }
}

function installRailLayout({
  tabWidth = 44,
  viewportWidth = 100,
}: {
  tabWidth?: number
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
  const rect = (
    left: number,
    top: number,
    width: number,
    height: number,
  ): DOMRect =>
    ({
      x: left,
      y: top,
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
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
    const tablist =
      this.getAttribute('role') === 'tablist' ? this : this.parentElement
    const viewport = tablist?.parentElement

    if (this.getAttribute('role') === 'tab' && tablist && viewport) {
      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'))
      const index = tabs.indexOf(this)
      const horizontal =
        tablist.getAttribute('aria-orientation') === 'horizontal'
      const left = horizontal
        ? index * tabWidth - viewport.scrollLeft
        : 0
      const top = horizontal ? 0 : index * tabWidth

      return rect(
        left,
        top,
        horizontal ? tabWidth : viewportWidth,
        tabWidth,
      )
    }

    if (this.firstElementChild?.getAttribute('role') === 'tablist') {
      return rect(0, 0, viewportWidth, tabWidth)
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
        Object.defineProperty(
          HTMLElement.prototype,
          'scrollTo',
          originalScrollTo,
        )
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

describe('LifecycleBlotter', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/nasdaq-calypso#lifecycle')
  })

  it('selects and locally reveals a valid stage from the URL after mount', () => {
    const rail = installRailLayout()
    window.history.replaceState(
      {},
      '',
      '/nasdaq-calypso?stage=reporting#lifecycle',
    )

    try {
      render(<LifecycleBlotter />)

      expect(screen.getByRole('tab', { name: /reporting/i })).toHaveAttribute(
        'aria-selected',
        'true',
      )
      expect(screen.getByRole('tablist').parentElement?.scrollLeft).toBe(208)
      expect(rail.scrollTo).toHaveBeenLastCalledWith({
        behavior: 'smooth',
        left: 208,
      })
      expect(rail.scrollIntoView).not.toHaveBeenCalled()
    } finally {
      rail.restore()
    }
  })

  it('writes user selection to the URL while preserving query and fragment', () => {
    window.history.replaceState(
      {},
      '',
      '/nasdaq-calypso?view=compact#lifecycle',
    )
    const pushState = vi.spyOn(window.history, 'pushState')
    render(<LifecycleBlotter />)

    fireEvent.click(screen.getByRole('tab', { name: /settlement/i }))

    expect(window.location.search).toBe('?view=compact&stage=settlement')
    expect(window.location.hash).toBe('#lifecycle')
    expect(pushState).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('tab', { name: /settlement/i }))
    expect(pushState).toHaveBeenCalledTimes(1)
  })

  it('restores and locally reveals the URL stage when browser history changes', () => {
    const rail = installRailLayout()

    try {
      render(<LifecycleBlotter />)
      window.history.pushState(
        {},
        '',
        '/nasdaq-calypso?stage=reporting#lifecycle',
      )

      fireEvent.popState(window)

      expect(screen.getByRole('tab', { name: /reporting/i })).toHaveAttribute(
        'aria-selected',
        'true',
      )
      expect(screen.getByRole('tablist').parentElement?.scrollLeft).toBe(208)
      expect(rail.scrollTo).toHaveBeenLastCalledWith({
        behavior: 'smooth',
        left: 208,
      })
      expect(rail.scrollIntoView).not.toHaveBeenCalled()
    } finally {
      rail.restore()
    }
  })

  it('falls back to Capture when browser history contains an unknown stage', () => {
    render(<LifecycleBlotter />)
    fireEvent.click(screen.getByRole('tab', { name: /collateral/i }))
    window.history.pushState(
      {},
      '',
      '/nasdaq-calypso?stage=unknown#lifecycle',
    )

    fireEvent.popState(window)

    expect(screen.getByRole('tab', { name: /capture/i })).toHaveAttribute(
      'aria-selected',
      'true',
    )
  })

  it('renders one seven-stage tab system and one detail panel', () => {
    render(<LifecycleBlotter />)

    expect(screen.getAllByRole('tablist')).toHaveLength(1)
    expect(screen.getAllByRole('tab')).toHaveLength(7)
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)

    chainStages.forEach((stage, index) => {
      const tab = screen.getByRole('tab', { name: new RegExp(stage.label, 'i') })
      const detail = calypsoContent.schematic.stageDetail[stage.id]

      expect(tab).toHaveAttribute('id', `lifecycle-stage-tab-${stage.id}`)
      expect(tab).toHaveAttribute('aria-controls', 'lifecycle-stage-detail')
      expect(tab).toHaveTextContent(String(index + 1).padStart(2, '0'))
      expect(tab).toHaveAccessibleName(
        `${String(index + 1).padStart(2, '0')}. ${stage.label}. ${officeBands[index]}. ${detail.breaks}`,
      )
    })
  })

  it('shows every active-stage evidence field', () => {
    render(<LifecycleBlotter />)
    fireEvent.click(screen.getByRole('tab', { name: /collateral/i }))

    const panel = screen.getByRole('tabpanel')
    const stage = calypsoContent.schematic.stageDetail.collateral
    const ledger = calypsoContent.schematic.stageLedger.collateral

    expect(panel).toHaveTextContent(stage.breaks)
    expect(panel).toHaveTextContent(stage.does)
    ledger.objects.forEach((item) => expect(panel).toHaveTextContent(item))
    expect(panel).toHaveTextContent(ledger.depends)
    expect(panel).toHaveTextContent(ledger.carries)
  })

  it('keeps explicit list semantics when Built from markers are restyled', () => {
    render(<LifecycleBlotter />)

    const builtFrom = screen.getByText('Built from').parentElement
    expect(builtFrom?.querySelector('ul')).toHaveAttribute('role', 'list')
  })

  it('moves with arrows, Home, and End without duplicate controls', () => {
    render(<LifecycleBlotter />)
    const tabs = screen.getAllByRole('tab')

    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' })
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[1]).toHaveFocus()

    fireEvent.keyDown(tabs[1], { key: 'End' })
    expect(tabs[6]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(tabs[6], { key: 'ArrowRight' })
    expect(tabs[6]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(tabs[6], { key: 'Home' })
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(tabs[0], { key: 'ArrowLeft' })
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
  })

  it.each([
    { key: 'ArrowLeft', from: 2, to: 1 },
    { key: 'ArrowDown', from: 0, to: 1 },
    { key: 'ArrowUp', from: 1, to: 0 },
  ])('$key selects and focuses the adjacent stage', ({ key, from, to }) => {
    render(<LifecycleBlotter />)
    const tabs = screen.getAllByRole('tab')

    fireEvent.click(tabs[from])
    act(() => tabs[from].focus())
    fireEvent.keyDown(tabs[from], { key })

    expect(tabs[to]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[to]).toHaveFocus()
  })

  it('does not select or resize a stage on hover', () => {
    render(<LifecycleBlotter />)
    const tabs = screen.getAllByRole('tab')

    fireEvent.mouseEnter(tabs[3])

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(tabs[3]).toHaveAttribute('aria-selected', 'false')
  })

  it('stops previous and next controls at the lifecycle boundaries', () => {
    render(<LifecycleBlotter />)
    const previous = screen.getByRole('button', { name: /previous stage/i })
    const next = screen.getByRole('button', { name: /next stage/i })

    expect(previous).toBeDisabled()
    fireEvent.click(next)
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(screen.getAllByRole('tab')[6])
    expect(next).toBeDisabled()
  })

  it('changes the single tablist orientation without replacing selected focus', () => {
    const media = installMatchMedia({ '(min-width: 48rem)': false })

    try {
      render(<LifecycleBlotter />)
      const tablist = screen.getByRole('tablist')
      const tabs = screen.getAllByRole('tab')

      act(() => tabs[3].focus())
      fireEvent.click(tabs[3])
      expect(tablist).toHaveAttribute('aria-orientation', 'horizontal')

      act(() => media.report('(min-width: 48rem)', true))

      expect(screen.getAllByRole('tablist')).toHaveLength(1)
      expect(tablist).toHaveAttribute('aria-orientation', 'vertical')
      expect(tabs[3]).toHaveAttribute('aria-selected', 'true')
      expect(tabs[3]).toHaveFocus()
    } finally {
      media.restore()
    }
  })

  it('reveals the active stage when the rail changes from vertical to horizontal', () => {
    const media = installMatchMedia({ '(min-width: 48rem)': true })
    const rail = installRailLayout()

    try {
      render(<LifecycleBlotter />)
      const tablist = screen.getByRole('tablist')
      const reporting = screen.getByRole('tab', { name: /reporting/i })

      fireEvent.click(reporting)
      expect(tablist).toHaveAttribute('aria-orientation', 'vertical')
      expect(rail.scrollTo).not.toHaveBeenCalled()

      act(() => media.report('(min-width: 48rem)', false))

      expect(tablist).toHaveAttribute('aria-orientation', 'horizontal')
      expect(reporting).toHaveAttribute('aria-selected', 'true')
      expect(tablist.parentElement?.scrollLeft).toBe(208)
      expect(rail.scrollTo).toHaveBeenLastCalledWith({
        behavior: 'smooth',
        left: 208,
      })
      expect(rail.scrollIntoView).not.toHaveBeenCalled()
    } finally {
      rail.restore()
      media.restore()
    }
  })

  it('scrolls only the mobile rail and respects reduced motion', () => {
    const media = installMatchMedia({
      '(min-width: 48rem)': false,
      '(prefers-reduced-motion: reduce)': false,
    })
    const rail = installRailLayout()

    try {
      render(<LifecycleBlotter />)
      const tabs = screen.getAllByRole('tab')

      fireEvent.click(tabs[6])
      expect(rail.scrollTo).toHaveBeenLastCalledWith({
        behavior: 'smooth',
        left: 208,
      })

      act(() => media.report('(prefers-reduced-motion: reduce)', true))
      fireEvent.click(tabs[0])
      expect(rail.scrollTo).toHaveBeenLastCalledWith({
        behavior: 'instant',
        left: 0,
      })
      expect(rail.scrollIntoView).not.toHaveBeenCalled()
    } finally {
      rail.restore()
      media.restore()
    }
  })
})
