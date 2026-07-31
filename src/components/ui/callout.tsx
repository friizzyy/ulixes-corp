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
      {/* Clean top border for non-quote variants */}
      {variant !== 'quote' && (
        <>
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
