'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface ApproachRevealProps {
  children: ReactNode
  className?: string
}

/*
 * Draws the phase line once the card is in view (04-approach-desk): the rule
 * fills, the four dots fill in turn, and FIRST CLOSE arrives last. Sets
 * data-on; the CSS owns the motion and drops it under reduced motion. Falls
 * back to the drawn state after 2.5s, as the spec's script does.
 */
export function ApproachReveal({ children, className }: ApproachRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setOn(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setOn(true)
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(node)
    const fallback = window.setTimeout(() => setOn(true), 2500)
    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <div ref={ref} className={className} data-on={on ? '' : undefined}>
      {children}
    </div>
  )
}
