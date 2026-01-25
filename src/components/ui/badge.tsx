'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp } from '@/lib/motion'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  pulse?: boolean
  animate?: boolean
}

export function Badge({ children, className, pulse = true, animate = true }: BadgeProps) {
  const Wrapper = animate ? motion.div : 'div'
  
  return (
    <Wrapper
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full',
        'font-mono text-label text-text-secondary',
        className
      )}
      {...(animate ? { variants: fadeUp, initial: 'hidden', whileInView: 'visible' } : {})}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>
      )}
      {children}
    </Wrapper>
  )
}
