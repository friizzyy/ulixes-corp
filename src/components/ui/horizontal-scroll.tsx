'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArrowLeft, ArrowRight } from './icons'

interface HorizontalScrollProps {
  children: React.ReactNode
  className?: string
  showControls?: boolean
  peek?: boolean // Show partial next card to hint scrollability
}

export function HorizontalScroll({
  children,
  className,
  showControls = true,
  peek = true,
}: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return

    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)

    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return

    const scrollAmount = el.clientWidth * 0.8
    const targetScroll = el.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)

    el.scrollTo({
      left: targetScroll,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <div className={cn('relative group', className)}>
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className={cn(
          'flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory',
          peek && 'pr-[15%] md:pr-[10%]' // Leave space for peek preview
        )}
      >
        {children}
      </div>

      {/* Navigation controls */}
      {showControls && (
        <>
          {/* Left arrow */}
          <motion.button
            onClick={() => scroll('left')}
            className={cn(
              'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4',
              'w-10 h-10 rounded-full bg-surface border border-border',
              'flex items-center justify-center',
              'text-text-secondary hover:text-text-primary hover:border-border-accent',
              'transition-all duration-200',
              'opacity-0 group-hover:opacity-100',
              'disabled:opacity-0 disabled:pointer-events-none',
              'hidden md:flex' // Hide on mobile, use native scroll
            )}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            initial={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={18} />
          </motion.button>

          {/* Right arrow */}
          <motion.button
            onClick={() => scroll('right')}
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4',
              'w-10 h-10 rounded-full bg-surface border border-border',
              'flex items-center justify-center',
              'text-text-secondary hover:text-text-primary hover:border-border-accent',
              'transition-all duration-200',
              'opacity-0 group-hover:opacity-100',
              'disabled:opacity-0 disabled:pointer-events-none',
              'hidden md:flex'
            )}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            initial={{ opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight size={18} />
          </motion.button>
        </>
      )}

      {/* Fade edges to indicate scrollability */}
      <div
        className={cn(
          'absolute inset-y-0 left-0 w-8 pointer-events-none',
          'bg-gradient-to-r from-bg-primary to-transparent',
          'transition-opacity duration-200',
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div
        className={cn(
          'absolute inset-y-0 right-0 w-16 pointer-events-none',
          'bg-gradient-to-l from-bg-primary to-transparent',
          'transition-opacity duration-200',
          canScrollRight ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  )
}

interface ScrollCardProps {
  children: React.ReactNode
  className?: string
  width?: 'sm' | 'md' | 'lg'
}

export function ScrollCard({ children, className, width = 'md' }: ScrollCardProps) {
  const widthClasses = {
    sm: 'w-[280px] md:w-[320px]',
    md: 'w-[320px] md:w-[400px]',
    lg: 'w-[360px] md:w-[480px]',
  }

  return (
    <div
      className={cn(
        'flex-shrink-0 snap-start',
        widthClasses[width],
        className
      )}
    >
      {children}
    </div>
  )
}
