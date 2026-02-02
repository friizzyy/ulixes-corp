'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GlassSurfaceContainer } from './GlassSurfaceContainer'

interface MetricCardProps {
  value: number | string
  label: string
  suffix?: string
  prefix?: string
  description?: string
  trend?: {
    value: number
    label?: string
    direction: 'up' | 'down' | 'neutral'
  }
  icon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
  className?: string
}

export function MetricCard({
  value,
  label,
  suffix = '',
  prefix = '',
  description,
  trend,
  icon,
  size = 'md',
  animate = true,
  className,
}: MetricCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const prefersReducedMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value)

  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0
  const isNumeric = typeof value === 'number' || !isNaN(parseFloat(value as string))

  // Animate number count-up
  useEffect(() => {
    if (!animate || !isInView || !isNumeric || prefersReducedMotion) {
      setDisplayValue(value)
      return
    }

    const duration = 800
    const startTime = performance.now()

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setDisplayValue(Math.floor(easeOut * numericValue))

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setDisplayValue(numericValue)
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, animate, numericValue, isNumeric, value, prefersReducedMotion])

  const sizeClasses = {
    sm: {
      container: 'p-4',
      value: 'text-2xl',
      label: 'text-xs',
      desc: 'text-xs',
    },
    md: {
      container: 'p-5',
      value: 'text-3xl md:text-4xl',
      label: 'text-sm',
      desc: 'text-xs',
    },
    lg: {
      container: 'p-6 md:p-8',
      value: 'text-4xl md:text-5xl',
      label: 'text-base',
      desc: 'text-sm',
    },
  }

  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-text-muted',
  }

  const trendIcons = {
    up: '↑',
    down: '↓',
    neutral: '→',
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <GlassSurfaceContainer
        className={cn('group relative overflow-hidden', className)}
        padding="none"
        glow
      >
        <div className={cn('relative z-10', sizeClasses[size].container)}>
          {/* Icon */}
          {icon && (
            <div className="mb-3 text-text-muted">
              {icon}
            </div>
          )}

          {/* Value */}
          <div className={cn(
            'font-bold font-mono tracking-tight gradient-text',
            sizeClasses[size].value
          )}>
            {prefix}
            {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
            {suffix}
          </div>

          {/* Label */}
          <div className={cn(
            'text-text-secondary mt-1',
            sizeClasses[size].label
          )}>
            {label}
          </div>

          {/* Trend */}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 mt-2 font-mono',
              trendColors[trend.direction],
              sizeClasses[size].desc
            )}>
              <span>{trendIcons[trend.direction]}</span>
              <span>{trend.value}%</span>
              {trend.label && <span className="text-text-muted ml-1">{trend.label}</span>}
            </div>
          )}

          {/* Description */}
          {description && (
            <p className={cn(
              'text-text-muted mt-2',
              sizeClasses[size].desc
            )}>
              {description}
            </p>
          )}
        </div>

        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </GlassSurfaceContainer>
    </motion.div>
  )
}

// Grid layout for multiple metrics
interface MetricGridProps {
  children: React.ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function MetricGrid({ children, columns = 4, className }: MetricGridProps) {
  const colClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={cn('grid gap-4 md:gap-6', colClasses[columns], className)}>
      {children}
    </div>
  )
}
