/*
 * One passive scroll subscription, coalesced to a frame. The callbacks read
 * layout and write transforms straight to the DOM, so nothing here goes
 * through React state and the scroll thread pays for a handful of rect reads.
 *
 * Scroll is listened for in the capture phase so it still arrives if an old
 * Safari makes the body the scroller (see the note on overflow in
 * globals.css); scroll events do not bubble, but they do capture.
 */
export function subscribeScrollFrame(onFrame: () => void): () => void {
  let frame = 0

  const schedule = () => {
    if (frame) return
    frame = window.requestAnimationFrame(() => {
      frame = 0
      onFrame()
    })
  }

  window.addEventListener('scroll', schedule, { passive: true, capture: true })
  window.addEventListener('resize', schedule, { passive: true })
  schedule()

  return () => {
    window.removeEventListener('scroll', schedule, { capture: true })
    window.removeEventListener('resize', schedule)
    if (frame) window.cancelAnimationFrame(frame)
    frame = 0
  }
}

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))
