'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion'

type SpacingVariant = 'compact' | 'default' | 'relaxed' | 'dramatic'

const spacingClasses: Record<SpacingVariant, string> = {
  compact: 'py-16 md:py-20',
  default: 'py-24 md:py-32',
  relaxed: 'py-32 md:py-40',
  dramatic: 'py-40 md:py-48',
}

interface SectionProps extends HTMLMotionProps<'section'> {
  children: React.ReactNode
  className?: string
  container?: boolean
  animate?: boolean
  spacing?: SpacingVariant
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className, container = true, animate = true, spacing = 'default', ...props }, ref) => {
    const content = container ? (
      <div className="container-main">
        {children}
      </div>
    ) : children

    const spacingClass = spacingClasses[spacing]

    if (animate) {
      return (
        <motion.section
          ref={ref}
          className={cn(spacingClass, 'relative z-10', className)}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          {...props}
        >
          {content}
        </motion.section>
      )
    }

    return (
      <section
        ref={ref as React.Ref<HTMLElement>}
        className={cn(spacingClass, 'relative z-10', className)}
      >
        {content}
      </section>
    )
  }
)

Section.displayName = 'Section'

interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
  className?: string
  align?: 'left' | 'center'
  animate?: boolean
}

export function SectionHeader({ 
  label, 
  title, 
  description, 
  className,
  align = 'center',
  animate = true
}: SectionHeaderProps) {
  const alignStyles = align === 'center' ? 'text-center max-w-2xl mx-auto' : 'text-left max-w-xl'
  const Wrapper = animate ? motion.div : 'div'
  
  return (
    <Wrapper
      className={cn('mb-12 md:mb-16', alignStyles, className)}
      {...(animate ? { variants: fadeUp } : {})}
    >
      {label && (
        <div className="section-label">{label}</div>
      )}
      <h2 className="text-display-sm md:text-display-md font-semibold text-text-primary mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-body-lg text-text-secondary">
          {description}
        </p>
      )}
    </Wrapper>
  )
}

interface SectionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  animate?: boolean
}

export function SectionContent({ children, className, animate = true, ...props }: SectionContentProps) {
  if (animate) {
    return (
      <motion.div
        className={className}
        variants={fadeUp}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}
