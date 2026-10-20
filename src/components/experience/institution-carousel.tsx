'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import styles from './institution-carousel.module.css'

export interface InstitutionCarouselProps {
  /** Accessible name of the carousel. */
  label: string
  /** One element per slide. */
  slides: ReactNode[]
  /** Accessible name of each slide, used by its progress dash. */
  slideLabels: string[]
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/**
 * The phone swipe rail with progress dashes (03-inst-m-ph). Native scroll-snap
 * does the swiping; the dashes track the card in view and jump to a card.
 */
export function InstitutionCarousel({ label, slides, slideLabels }: InstitutionCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const sync = useCallback(() => {
    const rail = railRef.current
    if (!rail || rail.children.length < 2) return
    const first = rail.children[0] as HTMLElement
    const second = rail.children[1] as HTMLElement
    const step = second.offsetLeft - first.offsetLeft
    if (step <= 0) return
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2
    const next = atEnd
      ? rail.children.length - 1
      : Math.min(rail.children.length - 1, Math.round(rail.scrollLeft / step))
    setActive(next)
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    rail.addEventListener('scroll', sync, { passive: true })
    return () => rail.removeEventListener('scroll', sync)
  }, [sync])

  const goTo = (index: number) => {
    const rail = railRef.current
    const slide = rail?.children[index] as HTMLElement | undefined
    if (!rail || !slide) return
    const left = slide.offsetLeft - (rail.firstElementChild as HTMLElement).offsetLeft
    rail.scrollTo({ left, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    setActive(index)
  }

  return (
    <div className={styles.root} role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={railRef} className={styles.rail} tabIndex={0}>
        {slides.map((slide, i) => (
          <div
            key={slideLabels[i]}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
          >
            {slide}
          </div>
        ))}
      </div>
      <div className={styles.dots}>
        {slideLabels.map((name, i) => (
          <button
            key={name}
            type="button"
            className={`${styles.dot} ${i === active ? styles.on : ''}`}
            aria-label={`Show ${name}`}
            aria-current={i === active ? 'true' : undefined}
            onClick={() => goTo(i)}
          >
            <i aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  )
}
