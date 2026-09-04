'use client'

import { useEffect, useState } from 'react'
import styles from './mobile-rail-progress.module.css'

export type MobileRailProgressProps = {
  trackId: string
  count: number
  label?: string
  tone?: 'light' | 'dark'
}

export function MobileRailProgress({
  trackId,
  count,
  label = 'Swipe',
  tone = 'light',
}: MobileRailProgressProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const track = document.getElementById(trackId)
    if (!track) return

    const phone = window.matchMedia('(max-width: 767px)')
    let frame: number | null = null

    const measure = () => {
      const trackRect = track.getBoundingClientRect()
      const centre = trackRect.left + trackRect.width / 2
      const cards = Array.from(track.children).filter(
        (child): child is HTMLElement => child instanceof HTMLElement,
      )
      let nearest = 0
      let closest = Number.POSITIVE_INFINITY

      cards.forEach((card, cardIndex) => {
        const rect = card.getBoundingClientRect()
        if (rect.width === 0) return

        const distance = Math.abs(rect.left + rect.width / 2 - centre)
        if (distance < closest) {
          closest = distance
          nearest = cardIndex
        }
      })

      setIndex((currentIndex) => {
        const nextIndex = Math.min(nearest, Math.max(count - 1, 0))
        return currentIndex === nextIndex ? currentIndex : nextIndex
      })
    }

    const scheduleMeasurement = () => {
      if (!phone.matches || frame !== null) return
      frame = window.requestAnimationFrame(() => {
        frame = null
        measure()
      })
    }

    scheduleMeasurement()
    track.addEventListener('scroll', scheduleMeasurement, { passive: true })
    window.addEventListener('resize', scheduleMeasurement)
    phone.addEventListener('change', scheduleMeasurement)

    return () => {
      track.removeEventListener('scroll', scheduleMeasurement)
      window.removeEventListener('resize', scheduleMeasurement)
      phone.removeEventListener('change', scheduleMeasurement)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [count, trackId])

  const visibleIndex = Math.min(index, Math.max(count - 1, 0))

  return (
    <div
      className={`${styles.progress}${tone === 'dark' ? ` ${styles.dark}` : ''}`}
      data-tone={tone}
    >
      <span className={styles.label}>{label}</span>
      <span className={styles.count} aria-live="polite" aria-atomic="true">
        {String(visibleIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
      </span>
    </div>
  )
}
