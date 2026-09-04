'use client'

import { useEffect, useRef } from 'react'
import { servicesContent } from '@/lib/services-content'
import { inViewport, pad, prefersReducedMotion } from './motion'
import { clamp01, subscribeScrollFrame } from './scroll-frame'
import styles from './approach-line.module.css'

const { approach } = servicesContent

/* Fraction of the viewport height the reader's eye is assumed to sit at. */
const READING_LINE = 0.82
const STAGGER_MS = 60

/*
 * The four approach steps on a line that draws itself. The line is an SVG path
 * normalised to pathLength 1, so its dash offset is 1 minus the fraction of
 * the register that has passed the reading line. Each step arrives when the
 * line reaches its stop; steps reached in the same frame arrive 60ms apart.
 * Both latch, so nothing undraws on the way back up.
 *
 * Progressive, and gated on view. The server markup carries
 * data-enhanced="false", under which the line is fully drawn and every step
 * visible. The effect only switches the hidden-at-rest styles on when it can
 * also drive them, when the register is still below the fold at mount, and
 * never under reduced motion; so nothing on the page can be left invisible.
 */
export function ApproachLine() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const path = pathRef.current
    if (!root || !path || prefersReducedMotion() || inViewport(root)) return

    const steps = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'))
    const stops = steps.map(
      (step) => step.querySelector<HTMLElement>('[data-stop]') ?? step,
    )
    root.dataset.enhanced = 'true'
    let drawn = 0

    const frame = () => {
      const readingLine = window.innerHeight * READING_LINE
      const rect = root.getBoundingClientRect()
      if (rect.height > 0) {
        const progress = clamp01((readingLine - rect.top) / rect.height)
        if (progress > drawn) {
          drawn = progress
          path.style.strokeDashoffset = String(1 - drawn)
        }
      }

      let arrivals = 0
      steps.forEach((step, index) => {
        if (step.dataset.reached === 'true') return
        const stop = stops[index].getBoundingClientRect()
        if (stop.top + stop.height / 2 > readingLine) return
        step.style.transitionDelay = `${arrivals * STAGGER_MS}ms`
        step.dataset.reached = 'true'
        arrivals += 1
      })
    }

    return subscribeScrollFrame(frame)
  }, [])

  return (
    <div
      ref={rootRef}
      id="services-approach-rail"
      className={styles.approach}
      data-enhanced="false"
      data-mobile-layout="vertical-timeline"
    >
      <svg
        className={styles.approachLine}
        viewBox="0 0 2 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M1 0V100" pathLength={1} className={styles.approachTrack} />
        <path
          ref={pathRef}
          d="M1 0V100"
          pathLength={1}
          className={styles.approachDrawn}
        />
      </svg>

      {approach.steps.map((step, index) => (
        <div
          key={step.title}
          className={styles.step}
          data-step="true"
          data-reached="false"
        >
          <span className={styles.stepStop} data-stop="true" aria-hidden="true" />
          <span className={styles.stepIndex}>{pad(index)}</span>
          <h3 className={styles.stepTitle}>{step.title}</h3>
          <p className={styles.stepText}>{step.description}</p>
        </div>
      ))}
    </div>
  )
}
