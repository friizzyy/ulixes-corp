'use client'

import { type ReactNode, useRef } from 'react'
import { motion, useInView, type Transition, type Variants } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/*
 * The motion vocabulary for the Calypso page.
 *
 * Deliberately four distinct gestures rather than one applied everywhere.
 * Repeating a single opacity-and-rise on every section is both a rule
 * violation and the reason a page can be "animated" and still feel inert: if
 * every section arrives the same way, the arrival stops carrying information.
 *
 * So each has a job. Curtain is for headlines, where type should appear to be
 * uncovered rather than to fly in. Cascade is for lists, where the order is
 * the content. Rule is for the hairlines that separate registers. Lift is the
 * quiet one, for surfaces that should settle rather than announce.
 *
 * Spring physics throughout, per the motion engine spec. No linear easing, and
 * nothing bouncy: overshoot on an infrastructure consultancy reads as a toy.
 *
 * Reduced motion never changes the element tree. Each component renders the
 * same motion elements whatever the preference, so the server markup and the
 * first client render always agree; the preference only changes where the
 * animation lands and how long it takes. framer-motion treats a zero duration
 * as a plain set, so under reduced motion everything arrives in its resting
 * state at once, with no transform left behind.
 *
 * The preference is read after mount (see usePrefersReducedMotion) and until
 * it is known each component holds its initial state rather than starting the
 * spring. framer-motion only restarts an animation when its target changes, so
 * a spring that had already begun would run on regardless of a transition
 * swapped in a frame later.
 */

const spring = { type: 'spring' as const, stiffness: 100, damping: 20, mass: 0.9 }
const instant: Transition = { duration: 0 }

/* A headline uncovered by its own mask. The wrapper clips, the child rises. */
export function Curtain({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'span'
}) {
  const reduced = usePrefersReducedMotion()
  const Wrapper = as === 'span' ? motion.span : motion.div
  const Inner = as === 'span' ? motion.span : motion.div
  const hidden = { y: '108%' }
  const shown = { y: 0 }

  return (
    <Wrapper
      className={className}
      style={{ overflow: 'hidden', display: as === 'span' ? 'inline-block' : 'block' }}
    >
      <Inner
        initial={hidden}
        animate={reduced === null ? hidden : shown}
        transition={reduced ? instant : { ...spring, delay }}
        style={{ display: as === 'span' ? 'inline-block' : 'block', willChange: 'transform' }}
      >
        {children}
      </Inner>
    </Wrapper>
  )
}

const cascadeParent: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
}

const cascadeParentInstant: Variants = {
  hidden: {},
  shown: { transition: instant },
}

/*
 * Children arrive in sequence from the side the reading eye is travelling
 * toward, which is why this offsets on x rather than y. It keeps list reveals
 * distinguishable from the surface reveals above and below them.
 */
const cascadeChild: Variants = {
  hidden: { opacity: 0, x: -14 },
  shown: { opacity: 1, x: 0, transition: spring },
}

const cascadeChildInstant: Variants = {
  hidden: { opacity: 0, x: -14 },
  shown: { opacity: 1, x: 0, transition: instant },
}

/*
 * Explicit motion.ul / motion.li rather than an indexed motion[as] lookup.
 * The indexed form resolved to undefined once bundled and took the whole hero
 * subtree down with "Cannot read properties of undefined (reading 'call')".
 *
 * The list stays a real list on purpose: wrapping <li> in a motion <div> puts
 * a non-list-item between the list and its children, which drops the semantics
 * a screen reader uses to announce "list, 4 items".
 */
export function Cascade({
  children,
  className,
  amount = 0.25,
  label,
}: {
  children: ReactNode
  className?: string
  amount?: number
  label?: string
}) {
  const ref = useRef<HTMLUListElement>(null)
  const inView = useInView(ref, { once: true, amount })
  const reduced = usePrefersReducedMotion()
  const shown = reduced === true || (reduced === false && inView)

  return (
    <motion.ul
      ref={ref}
      className={className}
      aria-label={label}
      variants={reduced ? cascadeParentInstant : cascadeParent}
      initial="hidden"
      animate={shown ? 'shown' : 'hidden'}
    >
      {children}
    </motion.ul>
  )
}

export function CascadeItem({
  children,
  className,
  primary,
}: {
  children: ReactNode
  className?: string
  primary?: boolean
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.li
      className={className}
      data-primary={primary || undefined}
      variants={reduced ? cascadeChildInstant : cascadeChild}
    >
      {children}
    </motion.li>
  )
}

/* A hairline that draws itself from its own origin. */
export function Rule({
  className,
  delay = 0,
  origin = 'left',
}: {
  className?: string
  delay?: number
  origin?: 'left' | 'right'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = usePrefersReducedMotion()
  const drawn = reduced === true || (reduced === false && inView)

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ transformOrigin: origin, willChange: 'transform' }}
      initial={{ scaleX: 0 }}
      animate={drawn ? { scaleX: 1 } : { scaleX: 0 }}
      transition={
        reduced ? instant : { duration: 0.85, delay, ease: [0.22, 0.61, 0.36, 1] }
      }
    />
  )
}

/* The quiet one. A surface settling into place, not arriving from off-screen. */
export function Lift({
  children,
  className,
  delay = 0,
  amount = 0.15,
}: {
  children: ReactNode
  className?: string
  delay?: number
  amount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount })
  const reduced = usePrefersReducedMotion()
  const settled = reduced === true || (reduced === false && inView)
  const hidden = { opacity: 0, y: 18, scale: 0.994 }
  const shown = { opacity: 1, y: 0, scale: 1 }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={settled ? shown : hidden}
      transition={reduced ? instant : { ...spring, delay }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}
