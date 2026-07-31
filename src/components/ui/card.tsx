'use client'

import { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { cardHover } from '@/lib/motion'

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  hover?: boolean
  highlight?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, hover = true, highlight = false, ...props }, ref) => {
    const baseStyles = 'relative bg-bg-secondary border border-border rounded-md overflow-hidden transition-all duration-300'
    const hoverStyles = hover ? 'hover:border-border-accent hover:shadow-md' : ''
    const highlightStyles = highlight ? 'before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-gradient-accent before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100' : ''

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, hoverStyles, highlightStyles, className)}
        variants={hover ? cardHover : undefined}
        initial={hover ? 'rest' : undefined}
        whileHover={hover ? 'hover' : undefined}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('p-6 pb-0 md:p-8 md:pb-0', className)}>
      {children}
    </div>
  )
}

interface CardContentProps {
  children: React.ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('p-6 md:p-8', className)}>
      {children}
    </div>
  )
}

interface CardIconProps {
  children: React.ReactNode
  className?: string
}

export function CardIcon({ children, className }: CardIconProps) {
  return (
    <div className={cn(
      'w-12 h-12 flex items-center justify-center rounded-sm bg-surface border border-border mb-5',
      className
    )}>
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: React.ReactNode
  className?: string
  as?: 'h2' | 'h3' | 'h4'
}

export function CardTitle({ children, className, as: Component = 'h3' }: CardTitleProps) {
  return (
    <Component className={cn('text-heading-md font-semibold text-text-primary mb-3', className)}>
      {children}
    </Component>
  )
}

interface CardDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('text-body-sm text-text-secondary leading-relaxed', className)}>
      {children}
    </p>
  )
}
