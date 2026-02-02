'use client'

import { forwardRef } from 'react'
import Link from 'next/link'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { buttonHover } from '@/lib/motion'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  asChild?: boolean
  href?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-br from-accent to-accent-secondary text-bg-primary shadow-glow hover:shadow-glow-strong',
  secondary: 'bg-transparent text-text-primary border border-border-accent hover:bg-surface hover:border-text-muted',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-body-sm gap-1.5',
  md: 'px-6 py-3 text-body-sm gap-2',
  lg: 'px-8 py-4 text-body-md gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, href, ...props }, ref) => {
    const baseStyles = 'group inline-flex items-center justify-center rounded-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none'

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      className
    )

    if (href) {
      return (
        <Link href={href} className={combinedClassName}>
          {children}
        </Link>
      )
    }

    return (
      <motion.button
        ref={ref}
        className={combinedClassName}
        variants={buttonHover}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
