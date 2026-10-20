'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './capabilities.module.css'

const cardsOf = (rail: HTMLElement | null) =>
  Array.from(rail?.querySelectorAll<HTMLElement>('[data-capability-card]') ?? [])

interface CapabilityRailProps {
  children: ReactNode
  /** Card titles, in order, for the progress controls' labels. */
  titles: readonly string[]
}

/*
 * The card track. On desktop and tablet it is a plain grid; on the phone it
 * scrolls sideways with snap points, and the dashes under it show (and set)
 * which card is centred.
 */
export function CapabilityRail({ children, titles }: CapabilityRailProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const sync = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const centre = rail.scrollLeft + rail.clientWidth / 2
    let best = 0
    let bestDistance = Infinity
    cardsOf(rail).forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centre)
      if (distance < bestDistance) {
        bestDistance = distance
        best = index
      }
    })
    setActive(best)
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(sync)
    }
    rail.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      rail.removeEventListener('scroll', onScroll)
    }
  }, [sync])

  const show = useCallback((index: number, instant = false) => {
    const rail = railRef.current
    const card = cardsOf(rail)[index]
    if (!rail || !card) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const left = card.offsetLeft + card.offsetWidth / 2 - rail.clientWidth / 2
    if (typeof rail.scrollTo === 'function') {
      rail.scrollTo({ left, behavior: instant || reduce ? 'auto' : 'smooth' })
    } else {
      rail.scrollLeft = left
    }
    setActive(index)
  }, [])

  /*
   * A link to one capability (/services#trading, from the home index or the
   * hero bar) opens on that card. The page scroll is the browser's; on the
   * phone this also centres the card in the sideways track, after the
   * browser has landed, so the two scrolls do not fight.
   */
  useEffect(() => {
    let frame = 0
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1))
      const index = cardsOf(railRef.current).findIndex((card) => card.id === id)
      if (index < 0) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        show(index, true)
        // A brief ring on the card the reader asked for (desktop shows all four).
        const card = cardsOf(railRef.current)[index]
        card.removeAttribute('data-landed')
        void card.offsetWidth
        card.setAttribute('data-landed', '')
      })
    }
    open()
    window.addEventListener('hashchange', open)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', open)
    }
  }, [show])

  return (
    <>
      <div ref={railRef} className={`wrap ${styles.g}`}>
        {children}
      </div>
      <div className={styles.dt} role="group" aria-label="Choose a capability">
        {titles.map((title, index) => (
          <button
            key={title}
            type="button"
            className={index === active ? styles.dotOn : styles.dot}
            aria-label={`Capability ${index + 1} of ${titles.length}: ${title}`}
            aria-current={index === active ? 'true' : undefined}
            onClick={() => show(index)}
          />
        ))}
      </div>
    </>
  )
}
