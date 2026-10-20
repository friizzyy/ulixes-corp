/*
 * Glide the page so an element sits in the middle of the free screen: below
 * the sticky header on desktop and tablet, above the dock on the phone. Used
 * when a link from another page asks to open on one card, so the arrival
 * reads as a smooth move to the thing chosen rather than a jump to the top.
 * An element taller than the free screen lines up with its top instead.
 */
export function glideTo(el: HTMLElement) {
  const header = document.querySelector<HTMLElement>('[data-site-header="desktop"]')
  const top = header && header.offsetParent ? header.getBoundingClientRect().height : 0
  const phone = window.matchMedia('(max-width: 767px)').matches
  const bottom = phone ? 104 : 0
  const free = window.innerHeight - top - bottom
  const box = el.getBoundingClientRect()
  const offset = box.height < free ? top + (free - box.height) / 2 : top + 16
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: Math.max(0, window.scrollY + box.top - offset), behavior: reduce ? 'auto' : 'smooth' })
}

/** How long to let the arriving page settle before gliding. */
export const GLIDE_DELAY_MS = 260
