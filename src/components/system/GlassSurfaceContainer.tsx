'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface GlassSurfaceContainerProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-5',
  lg: 'p-6 md:p-8',
}

export const GlassSurfaceContainer = forwardRef<HTMLDivElement, GlassSurfaceContainerProps>(
  ({ children, className, padding = 'md', border = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-md overflow-hidden',
          'bg-white/[0.03] backdrop-blur-xl',
          'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]',
          border && 'border border-white/[0.06]',
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
