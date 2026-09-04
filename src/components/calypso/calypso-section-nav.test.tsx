import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CalypsoSectionNav } from './calypso-section-nav'

const sections = [
  { id: 'lifecycle', label: 'Lifecycle' },
  { id: 'programs', label: 'Programs' },
  { id: 'mandates', label: 'Mandates' },
] as const

let notify: IntersectionObserverCallback
const observe = vi.fn()
const disconnect = vi.fn()
const originalIntersectionObserver = globalThis.IntersectionObserver

class SectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = []

  constructor(callback: IntersectionObserverCallback) {
    notify = callback
  }

  observe = observe
  unobserve = vi.fn()
  disconnect = disconnect
  takeRecords = () => []
}

const emptyRect: DOMRectReadOnly = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
  toJSON: () => ({}),
}

const intersecting = (
  target: HTMLElement,
  intersectionRatio: number,
  isIntersecting = true,
): IntersectionObserverEntry => ({
  boundingClientRect: emptyRect,
  intersectionRatio,
  intersectionRect: emptyRect,
  isIntersecting,
  rootBounds: null,
  target,
  time: 0,
})

function PageSections() {
  return (
    <>
      <CalypsoSectionNav sections={sections} />
      {sections.map((section) => (
        <section key={section.id} id={section.id}>
          {section.label} content
        </section>
      ))}
    </>
  )
}

describe('CalypsoSectionNav', () => {
  beforeEach(() => {
    observe.mockClear()
    disconnect.mockClear()
    globalThis.IntersectionObserver = SectionObserver
  })

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver
  })

  it('links all three page destinations and starts at Lifecycle', () => {
    render(<PageSections />)

    const navigation = screen.getByLabelText('Calypso sections')
    expect(navigation.tagName).toBe('NAV')
    expect(navigation).toHaveAttribute('data-calypso-sticky-nav', 'true')
    for (const section of sections) {
      expect(screen.getByText(section.label, { selector: 'a' })).toHaveAttribute(
        'href',
        `#${section.id}`,
      )
    }
    expect(screen.getByText('Lifecycle', { selector: 'a' })).toHaveAttribute(
      'aria-current',
      'location',
    )
  })

  it('moves the current location to the most visible observed section', () => {
    render(<PageSections />)
    const lifecycle = document.getElementById('lifecycle') as HTMLElement
    const programs = document.getElementById('programs') as HTMLElement

    act(() => {
      notify(
        [
          intersecting(lifecycle, 0.2),
          intersecting(programs, 0.8),
        ],
        {} as IntersectionObserver,
      )
    })

    expect(screen.getByText('Programs', { selector: 'a' })).toHaveAttribute(
      'aria-current',
      'location',
    )
    expect(screen.getByText('Lifecycle', { selector: 'a' })).not.toHaveAttribute(
      'aria-current',
    )
  })

  it('keeps the most visible section active across separate observer callbacks', () => {
    render(<PageSections />)
    const lifecycle = document.getElementById('lifecycle') as HTMLElement
    const programs = document.getElementById('programs') as HTMLElement

    act(() => {
      notify([intersecting(lifecycle, 0.8)], {} as IntersectionObserver)
    })
    act(() => {
      notify([intersecting(programs, 0.15)], {} as IntersectionObserver)
    })

    expect(screen.getByText('Lifecycle', { selector: 'a' })).toHaveAttribute(
      'aria-current',
      'location',
    )

    act(() => {
      notify([intersecting(lifecycle, 0, false)], {} as IntersectionObserver)
    })

    expect(screen.getByText('Programs', { selector: 'a' })).toHaveAttribute(
      'aria-current',
      'location',
    )
  })

  it('keeps an aligned Programs target current when the outgoing section has a larger ratio', () => {
    render(<PageSections />)
    const navigation = screen.getByLabelText('Calypso sections')
    const lifecycle = document.getElementById('lifecycle') as HTMLElement
    const programs = document.getElementById('programs') as HTMLElement
    let aligned = false
    let animationCallback: FrameRequestCallback | undefined
    const requestFrame = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => {
        animationCallback = callback
        return 1
      })
    vi.spyOn(navigation, 'getBoundingClientRect').mockReturnValue({
      ...emptyRect,
      top: 64.25,
      bottom: 118.5,
      height: 54.25,
      y: 64.25,
    })
    vi.spyOn(lifecycle, 'getBoundingClientRect').mockImplementation(() => ({
      ...emptyRect,
      top: -1800,
      bottom: aligned ? 132.75 : 400,
      height: aligned ? 1932.75 : 2200,
      y: -1800,
    }))
    vi.spyOn(programs, 'getBoundingClientRect').mockImplementation(() => ({
      ...emptyRect,
      top: aligned ? 132.75 : 400,
      bottom: aligned ? 1800 : 2067.25,
      height: 1667.25,
      y: aligned ? 132.75 : 400,
    }))

    act(() => {
      notify(
        [intersecting(lifecycle, 0.4), intersecting(programs, 0.08)],
        {} as IntersectionObserver,
      )
    })
    fireEvent.click(screen.getByText('Programs', { selector: 'a' }))
    act(() => {
      notify([intersecting(lifecycle, 0.4)], {} as IntersectionObserver)
    })
    expect(screen.getByText('Lifecycle', { selector: 'a' })).toHaveAttribute(
      'aria-current',
      'location',
    )

    aligned = true
    act(() => {
      fireEvent.scroll(window)
      animationCallback?.(0)
    })

    expect(screen.getByText('Programs', { selector: 'a' })).toHaveAttribute(
      'aria-current',
      'location',
    )
    requestFrame.mockRestore()
  })

  it('disconnects its section observer when removed', () => {
    const addEventListener = vi.spyOn(window, 'addEventListener')
    const removeEventListener = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<PageSections />)
    const scrollRegistration = addEventListener.mock.calls.find(
      ([event]) => event === 'scroll',
    )

    expect(observe).toHaveBeenCalledTimes(3)
    expect(scrollRegistration).toEqual([
      'scroll',
      expect.any(Function),
      { passive: true },
    ])
    unmount()

    expect(disconnect).toHaveBeenCalledTimes(1)
    expect(removeEventListener).toHaveBeenCalledWith(
      'scroll',
      scrollRegistration?.[1],
    )
    addEventListener.mockRestore()
    removeEventListener.mockRestore()
  })
})
