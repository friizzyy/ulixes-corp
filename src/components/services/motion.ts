/*
 * Helpers shared by the two client pieces of the path concept.
 *
 * Both pieces render in a fully visible "static" state and only take on a
 * hidden, pre-animation state after mount, and only when the element is still
 * below the fold. So the page reads complete with no JavaScript, under reduced
 * motion, and in a test runner whose IntersectionObserver never fires.
 */

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const canObserve = () => typeof IntersectionObserver !== 'undefined'

export const inViewport = (element: Element) => {
  const rect = element.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

export const pad = (index: number) => String(index + 1).padStart(2, '0')
