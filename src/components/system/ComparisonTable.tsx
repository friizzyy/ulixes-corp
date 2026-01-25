'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { GlassSurfaceContainer } from './GlassSurfaceContainer'

interface ComparisonItem {
  feature: string
  before: string | boolean | React.ReactNode
  after: string | boolean | React.ReactNode
  improvement?: string
}

interface ComparisonTableProps {
  items: ComparisonItem[]
  beforeLabel?: string
  afterLabel?: string
  title?: string
  description?: string
  className?: string
  animated?: boolean
}

export function ComparisonTable({
  items,
  beforeLabel = 'Before',
  afterLabel = 'After',
  title,
  description,
  className,
  animated = true,
}: ComparisonTableProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const renderValue = (value: string | boolean | React.ReactNode) => {
    if (typeof value === 'boolean') {
      return value ? (
        <span className="text-emerald-400">✓</span>
      ) : (
        <span className="text-text-muted">—</span>
      )
    }
    return value
  }

  return (
    <div ref={ref} className={className}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h3 className="text-xl font-semibold text-text-primary">{title}</h3>}
          {description && <p className="text-text-secondary mt-2">{description}</p>}
        </div>
      )}

      <GlassSurfaceContainer padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-sm font-medium text-text-secondary px-6 py-4">
                  Feature
                </th>
                <th className="text-center text-sm font-medium text-text-muted px-6 py-4 bg-red-500/5">
                  {beforeLabel}
                </th>
                <th className="text-center text-sm font-medium text-accent px-6 py-4 bg-accent/5">
                  {afterLabel}
                </th>
                <th className="text-right text-sm font-medium text-text-secondary px-6 py-4">
                  Impact
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <motion.tr
                  key={item.feature}
                  className="border-b border-border/50 last:border-0"
                  initial={animated ? { opacity: 0, y: 10 } : undefined}
                  animate={animated && isInView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="text-sm text-text-primary px-6 py-4 font-medium">
                    {item.feature}
                  </td>
                  <td className="text-sm text-text-muted px-6 py-4 text-center bg-red-500/5">
                    {renderValue(item.before)}
                  </td>
                  <td className="text-sm text-text-primary px-6 py-4 text-center bg-accent/5 font-medium">
                    {renderValue(item.after)}
                  </td>
                  <td className="text-sm text-emerald-400 px-6 py-4 text-right font-mono">
                    {item.improvement && (
                      <span className="inline-flex items-center gap-1">
                        <span>↑</span>
                        {item.improvement}
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassSurfaceContainer>
    </div>
  )
}

// Before/After visual comparison
interface BeforeAfterProps {
  before: {
    label?: string
    content: React.ReactNode
  }
  after: {
    label?: string
    content: React.ReactNode
  }
  className?: string
}

export function BeforeAfter({ before, after, className }: BeforeAfterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div ref={ref} className={cn('grid grid-cols-1 md:grid-cols-2 gap-6', className)}>
      {/* Before */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <GlassSurfaceContainer className="h-full" padding="none">
          <div className="px-4 py-3 border-b border-border bg-red-500/5">
            <span className="text-sm font-medium text-red-400">
              {before.label || 'Before'}
            </span>
          </div>
          <div className="p-4">{before.content}</div>
        </GlassSurfaceContainer>
      </motion.div>

      {/* After */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <GlassSurfaceContainer className="h-full" padding="none" glow>
          <div className="px-4 py-3 border-b border-border bg-accent/5">
            <span className="text-sm font-medium text-accent">
              {after.label || 'After'}
            </span>
          </div>
          <div className="p-4">{after.content}</div>
        </GlassSurfaceContainer>
      </motion.div>
    </div>
  )
}
