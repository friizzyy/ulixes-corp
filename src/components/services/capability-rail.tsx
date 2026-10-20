'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { GLIDE_DELAY_MS, glideTo } from '@/components/site'
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
   * A link to one capability opens on that card. From another page it comes
   * as /services?card=trading: the page opens at the top as usual, the phone
   * track quietly centres the card while it is still off screen, and then
   * the page glides the card to the middle of the screen and rings it. The
   * hero bar's in-page #trading links keep the browser's own smooth scroll.
   */
  useEffect(() => {
    const ring = (card: HTMLElement) => {
      card.removeAttribute('data-landed')
      void card.offsetWidth
      card.setAttribute('data-landed', '')
    }
    const indexOf = (id: string | null) => cardsOf(railRef.current).findIndex((card) => card.id === id)
    const timers: number[] = []

    const arrived = indexOf(new URLSearchParams(window.location.search).get('card'))
    if (arrived >= 0) {
      show(arrived, true)
      const card = cardsOf(railRef.current)[arrived]
      timers.push(window.setTimeout(() => glideTo(card), GLIDE_DELAY_MS))
      timers.push(window.setTimeout(() => ring(card), GLIDE_DELAY_MS + 520))
    }

    const onHash = () => {
      const index = indexOf(decodeURIComponent(window.location.hash.slice(1)))
      if (index < 0) return
      show(index)
      ring(cardsOf(railRef.current)[index])
    }
    window.addEventListener('hashchange', onHash)
    return () => {
      timers.forEach((t) => window.clearTimeout(t))
      window.removeEventListener('hashchange', onHash)
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
