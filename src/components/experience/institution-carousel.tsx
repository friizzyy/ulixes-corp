'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, MobileRailProgress } from '@/components/ui'
import { institutionalExperienceContent } from '@/lib/institutional-experience-content'
import styles from './institution-carousel.module.css'

const { categories } = institutionalExperienceContent.institutions

/*
 * The seven institution types on one line, drifting slowly, with arrows to step
 * through them.
 *
 * Two constraints shaped the implementation. The list is the page's proof of
 * institutional breadth, so every entry has to stay readable: cards are sized
 * from the measure backwards, at roughly 46 characters a line, rather than from
 * how many fit on screen. And auto-moving content needs a way to stop, so the
 * drift pauses on hover and on focus and never starts under
 * prefers-reduced-motion.
 *
 * Stopping comes in two grades, because the two gestures mean different things.
 * An arrow press means "show me the next one, then carry on", so the drift
 * resumes three seconds later. Scrolling, dragging or arrow-keying the track
 * means "I am reading this myself", and ends the motion for the rest of the
 * visit — that one is the stop mechanism proper, and without it there would be
 * no way to end the movement at all.
 *
 * The drift reverses at each end rather than looping through a duplicated
 * track. A seamless loop needs a second copy of every card in the DOM, and
 * these cards hold the page's actual evidence, not decoration — duplicating
 * that prose costs a doubled DOM and puts every institution's description in
 * the document twice. Reversing keeps exactly seven, and because it turns at
 * the same slow speed there is never a rewind sweep to notice.
 */
const DRIFT_PX_PER_SECOND = 18
const RESUME_AFTER_MS = 3000

export function InstitutionCarousel() {
  const trackRef = useRef<HTMLOListElement>(null)
  const [drifting, setDrifting] = useState(true)
  const paused = useRef(false)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Read once at mount and held in a ref, so the resume timer can never start
  // motion for a reader who asked for none.
  const motionAllowed = useRef(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    /* No drift on touch screens either: on a phone the rail is the reader's
       to swipe, and a track that moves on its own fights the thumb. */
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none), (max-width: 767px)').matches
    ) {
      motionAllowed.current = false
      setDrifting(false)
    }
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
    }
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track || !drifting) return

    let frame = 0
    let previous = 0
    let direction = 1
    // The position is kept here as a float rather than read back off the
    // element each frame. At this speed a frame is worth about 0.3px, and
    // scrollLeft rounds to whole pixels on assignment — reading it back would
    // discard the remainder every frame and the track would never move at all.
    let position = track.scrollLeft

    const tick = (now: number) => {
      const elapsed = previous ? now - previous : 0
      previous = now

      const limit = track.scrollWidth - track.clientWidth

      // limit is 0 until the cards are laid out, and on any viewport wide
      // enough to hold all seven. Skip the move but keep the loop alive —
      // returning here would kill the drift permanently on the first frame.
      if (!paused.current && elapsed > 0 && limit > 1) {
        position += (direction * DRIFT_PX_PER_SECOND * elapsed) / 1000

        if (position >= limit) {
          position = limit
          direction = -1
        } else if (position <= 0) {
          position = 0
          direction = 1
        }

        track.scrollLeft = position
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [drifting])

  // Scrolling, dragging or arrow-keying the track reads as "I am working
  // through this myself", and hands control over for the rest of the visit.
  // This is the stop mechanism auto-moving content owes the reader — hover and
  // focus only ever pause it, so without this there would be no way to end the
  // motion at all.
  const stopDrift = useCallback(() => {
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current)
      resumeTimer.current = null
    }
    setDrifting(false)
  }, [])

  /*
   * An arrow press is a different intent: show me the next one, then carry on.
   * Toggling `drifting` off and back on is deliberate — it tears the animation
   * down and rebuilds it, and the rebuilt loop re-reads scrollLeft. Leaving it
   * running would have kept the stale float from before the arrow scrolled, and
   * the track would snap back to it the moment the drift resumed.
   */
  const pauseThenResume = useCallback(() => {
    setDrifting(false)
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => {
      resumeTimer.current = null
      if (motionAllowed.current) setDrifting(true)
    }, RESUME_AFTER_MS)
  }, [])

  const step = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current
      if (!track) return
      pauseThenResume()

      const first = track.children[0] as HTMLElement | undefined
      const second = track.children[1] as HTMLElement | undefined
      const stride =
        first && second
          ? second.offsetLeft - first.offsetLeft
          : track.clientWidth * 0.8

      track.scrollBy({ left: stride * direction, behavior: 'smooth' })
    },
    [pauseThenResume],
  )

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => {
        paused.current = true
      }}
      onMouseLeave={() => {
        paused.current = false
      }}
    >
      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowPrev}`}
        onClick={() => step(-1)}
        aria-label="Show previous institution types"
      >
        <ArrowLeft size={17} />
      </button>

      <ol
        ref={trackRef}
        className={styles.track}
        id="experience-institutions-rail"
        aria-label="Institution types"
        tabIndex={0}
        onWheel={stopDrift}
        onPointerDown={stopDrift}
        onKeyDown={stopDrift}
        /* Focus-pause belongs to the track, not the whole component. On the
           wrapper it also caught the arrows, which keep focus after a click —
           so the drift would resume on schedule and then sit still, frozen by
           a focus the reader had no idea was holding it. */
        onFocusCapture={() => {
          paused.current = true
        }}
        onBlurCapture={() => {
          paused.current = false
        }}
      >
        {categories.map((category, index) => (
          <li key={category.name} className={styles.card}>
            <span className={styles.index} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </li>
        ))}
      </ol>
      <div className={styles.phoneCue}>
        <MobileRailProgress
          trackId="experience-institutions-rail"
          count={categories.length}
          label="Swipe"
        />
      </div>

      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowNext}`}
        onClick={() => step(1)}
        aria-label="Show next institution types"
      >
        <ArrowRight size={17} />
      </button>
    </div>
  )
}
