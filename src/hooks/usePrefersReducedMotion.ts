'use client'

import { useEffect, useState } from 'react'

export const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

/*
 * Reports the reduced-motion preference now and on every change, and returns
 * the unsubscribe. Safari before 14 only has the deprecated addListener pair,
 * so both forms are handled.
 */
export function watchReducedMotion(
  onChange: (reduced: boolean) => void,
): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {}
  }

  const query = window.matchMedia(reducedMotionQuery)
  const notify = () => onChange(query.matches)
  notify()

  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', notify)
    return () => query.removeEventListener('change', notify)
  }

  query.addListener(notify)
  return () => query.removeListener(notify)
}

/*
 * Why not framer-motion's useReducedMotion: it returns null on the server and,
 * for a reduced-motion user, true on the first client render, so anything that
 * branches its element tree on it hydrates a different tree from the one the
 * server sent and React logs a mismatch.
 *
 * This is null until the component has mounted, so the server and the first
 * client render always agree, and reports the real preference from the first
 * effect onward. Callers that only need a boolean compare against true.
 */
export function usePrefersReducedMotion(): boolean | null {
  const [reduced, setReduced] = useState<boolean | null>(null)

  useEffect(() => watchReducedMotion(setReduced), [])

  return reduced
}
