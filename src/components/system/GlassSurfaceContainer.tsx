'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface GlassSurfaceContainerProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
  glow?: boolean
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-5',
  lg: 'p-6 md:p-8',
}

export const GlassSurfaceContainer = forwardRef<HTMLDivElement, GlassSurfaceContainerProps>(
  ({ children, className, padding = 'md', border = true, glow = false }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-md overflow-hidden',
          'bg-bg-secondary/80 backdrop-blur-sm',
          border && 'border border-border',
          glow && 'shadow-[0_0_20px_rgba(16,185,129,0.05)]',
          paddingMap[padding],
          className
        )}
      >
        {children}
      </div>
    )
  }
)

GlassSurfaceContainer.displayName = 'GlassSurfaceContainer'
