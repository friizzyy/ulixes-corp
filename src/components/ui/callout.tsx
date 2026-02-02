'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, viewportOnce } from '@/lib/motion'

interface CalloutProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'accent' | 'quote'
}

export function Callout({ children, className, variant = 'default' }: CalloutProps) {
  const variantStyles = {
    default: 'bg-surface/50 border-border',
    accent: 'bg-accent/5 border-accent/20',
    quote: 'bg-transparent border-l-2 border-accent pl-6 md:pl-8',
  }

  return (
    <motion.div
      className={cn(
        'relative rounded-lg overflow-hidden',
        variant !== 'quote' && 'p-8 md:p-12 border',
        variantStyles[variant],
        className
      )}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      {/* Decorative gradient for non-quote variants */}
      {variant !== 'quote' && (
        <>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="relative z-10">
        {variant === 'quote' ? (
          <blockquote className="text-body-lg md:text-xl text-text-primary leading-relaxed italic">
            {children}
          </blockquote>
        ) : (
          <div className="text-body-lg md:text-xl text-text-primary leading-relaxed">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  )
}
