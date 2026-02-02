'use client'

import { useRef, useEffect, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

interface StatCounterProps {
  value: string
  className?: string
}

function parseStatValue(value: string): { number: number; suffix: string; prefix: string; hasDecimal: boolean } {
  const match = value.match(/^([^\d]*)(\d+\.?\d*)(.*)$/)
  if (!match) {
    return { number: 0, suffix: '', prefix: '', hasDecimal: false }
  }
  const numStr = match[2]
  return {
    prefix: match[1] || '',
    number: parseFloat(numStr),
    suffix: match[3] || '',
    hasDecimal: numStr.includes('.'),
  }
}

export function StatCounter({ value, className }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const prefersReducedMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = useState('0')
  const hasAnimated = useRef(false)

  const parsed = parseStatValue(value)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return

    // If user prefers reduced motion, show final value immediately
    if (prefersReducedMotion) {
      setDisplayValue(parsed.hasDecimal ? parsed.number.toFixed(1) : String(Math.floor(parsed.number)))
      hasAnimated.current = true
      return
    }

    hasAnimated.current = true
    const duration = 800
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentNumber = easeOut * parsed.number

      if (parsed.hasDecimal) {
        setDisplayValue(currentNumber.toFixed(1))
      } else {
        setDisplayValue(String(Math.floor(currentNumber)))
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Ensure we end on the exact value
        setDisplayValue(parsed.hasDecimal ? parsed.number.toFixed(1) : String(Math.floor(parsed.number)))
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, parsed.number, parsed.hasDecimal, prefersReducedMotion])

  return (
    <span ref={ref} className={className}>
      {parsed.prefix}{displayValue}{parsed.suffix}
    </span>
  )
}
