'use client'

import { useState, useEffect, useRef } from 'react'
import { useReducedMotion, useInView } from 'framer-motion'

interface UseCountUpOptions {
  duration?: number
  delay?: number
  once?: boolean
}

export function useCountUp(
  endValue: number,
  options: UseCountUpOptions = {}
) {
  const { duration = 800, delay = 0, once = true } = options
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once, margin: '-50px' })
  const prefersReducedMotion = useReducedMotion()
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || (once && hasAnimated.current)) return

    // If user prefers reduced motion, show final value immediately
    if (prefersReducedMotion) {
      setCount(endValue)
      hasAnimated.current = true
      return
    }

    hasAnimated.current = true
    const startTime = performance.now() + delay

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime

      if (elapsed < 0) {
        requestAnimationFrame(animate)
        return
      }

      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(easeOut * endValue)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(endValue)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, endValue, duration, delay, once, prefersReducedMotion])

  return { count, ref }
}

// Parse stat value to extract number and suffix
export function parseStatValue(value: string): { number: number; suffix: string; prefix: string } {
  const match = value.match(/^([^\d]*)(\d+\.?\d*)(.*)$/)
  if (!match) {
    return { number: 0, suffix: '', prefix: '' }
  }
  return {
    prefix: match[1] || '',
    number: parseFloat(match[2]),
    suffix: match[3] || '',
  }
}
