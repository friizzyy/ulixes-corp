import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MobileRailProgress } from './mobile-rail-progress'

type Rect = Pick<DOMRect, 'left' | 'width'>

function setRect(element: Element, { left, width }: Rect) {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    bottom: 0,
    height: 80,
    left,
    right: left + width,
    top: 0,
    width,
    x: left,
    y: 0,
    toJSON: () => ({}),
  })
}

function mockPhoneMediaQuery() {
  let changeListener: EventListener | undefined
  const query = {
    matches: true,
    media: '(max-width: 767px)',
    onchange: null,
    addEventListener: vi.fn((type: string, listener: EventListener) => {
      if (type === 'change') changeListener = listener
    }),
    removeEventListener: vi.fn(),
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }

  vi.spyOn(window, 'matchMedia').mockReturnValue(query)

  return {
    query,
    emitChange: () => changeListener?.(new Event('change')),
  }
}

function mockAnimationFrames() {
  const callbacks = new Map<number, FrameRequestCallback>()
  let frame = 0
  const request = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(
    (callback: FrameRequestCallback) => {
      frame += 1
      callbacks.set(frame, callback)
      return frame
    },
  )
  const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(
    (id: number) => {
      callbacks.delete(id)
    },
  )

  return { callbacks, cancel, request }
}

describe('MobileRailProgress', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('shows the card nearest the rail centre after native scrolling without styling cards', () => {
    const { callbacks } = mockAnimationFrames()
    mockPhoneMediaQuery()

    const { container } = render(
      <>
        <div id="institution-rail">
          <article>First institution</article>
          <article>Second institution</article>
          <article>Third institution</article>
        </div>
        <MobileRailProgress trackId="institution-rail" count={3} label="Browse" />
      </>,
    )
    const track = document.getElementById('institution-rail')!
    const cards = Array.from(track.children) as HTMLElement[]

    setRect(track, { left: 0, width: 100 })
    setRect(cards[0], { left: -180, width: 100 })
    setRect(cards[1], { left: -40, width: 100 })
    setRect(cards[2], { left: 100, width: 100 })

    expect(callbacks.size).toBe(1)
    act(() => {
      callbacks.get(1)?.(0)
    })
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('02 / 03')

    setRect(cards[0], { left: -320, width: 100 })
    setRect(cards[1], { left: -180, width: 100 })
    setRect(cards[2], { left: -40, width: 100 })
    act(() => {
      fireEvent.scroll(track)
      callbacks.get(2)?.(16)
    })

    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('03 / 03')
    expect(screen.getByText('Browse')).toBeInTheDocument()
    for (const card of cards) {
      expect(card.getAttribute('style')).toBeNull()
      expect(card.style.transform).toBe('')
      expect(card.style.opacity).toBe('')
      expect(card.style.zIndex).toBe('')
    }
  })

  it('coalesces clustered scroll, resize, and media-query changes into one frame', () => {
    const { callbacks, request } = mockAnimationFrames()
    const { emitChange } = mockPhoneMediaQuery()
    render(
      <>
        <div id="institution-rail">
          <article>First institution</article>
          <article>Second institution</article>
        </div>
        <MobileRailProgress trackId="institution-rail" count={2} />
      </>,
    )
    const track = document.getElementById('institution-rail')!

    expect(request).toHaveBeenCalledTimes(1)
    act(() => {
      fireEvent.scroll(track)
      fireEvent.scroll(track)
      window.dispatchEvent(new Event('resize'))
      emitChange()
    })
    expect(request).toHaveBeenCalledTimes(1)

    act(() => {
      callbacks.get(1)?.(0)
    })
    act(() => {
      fireEvent.scroll(track)
      window.dispatchEvent(new Event('resize'))
      emitChange()
    })

    expect(request).toHaveBeenCalledTimes(2)
    expect(callbacks.size).toBe(2)
  })

  it('removes listeners and cancels a pending frame when unmounted', () => {
    const { cancel } = mockAnimationFrames()
    const { query } = mockPhoneMediaQuery()
    const removeWindowListener = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(
      <>
        <div id="institution-rail">
          <article>First institution</article>
        </div>
        <MobileRailProgress trackId="institution-rail" count={1} />
      </>,
    )
    const track = document.getElementById('institution-rail')!
    const removeTrackListener = vi.spyOn(track, 'removeEventListener')

    unmount()

    expect(removeTrackListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    expect(removeWindowListener).toHaveBeenCalledWith('resize', expect.any(Function))
    expect(query.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    expect(cancel).toHaveBeenCalledWith(1)
  })
})
