'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TimelineItem {
  id: string
  title: string
  description?: string
  date?: string
  status?: 'complete' | 'current' | 'upcoming'
  icon?: React.ReactNode
  details?: React.ReactNode
}

interface TimelineVerticalProps {
  items: TimelineItem[]
  className?: string
  showLine?: boolean
  animated?: boolean
}

export function TimelineVertical({
  items,
  className,
  showLine = true,
  animated = true,
}: TimelineVerticalProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Vertical line */}
      {showLine && (
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
      )}

      <div className="space-y-8">
        {items.map((item, index) => (
          <TimelineEntry
            key={item.id}
            item={item}
            index={index}
            animated={animated}
            showLine={showLine}
          />
        ))}
      </div>
    </div>
  )
}

interface TimelineEntryProps {
  item: TimelineItem
  index: number
  animated: boolean
  showLine: boolean
}

function TimelineEntry({ item, index, animated, showLine }: TimelineEntryProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const statusStyles = {
    complete: {
      dot: 'bg-accent border-accent',
      icon: 'text-bg-primary',
      line: 'bg-accent',
    },
    current: {
      dot: 'bg-accent/20 border-accent',
      icon: 'text-accent',
      line: 'bg-border',
    },
    upcoming: {
      dot: 'bg-bg-secondary border-border',
      icon: 'text-text-muted',
      line: 'bg-border',
    },
  }

  const status = item.status || 'upcoming'
  const styles = statusStyles[status]

  return (
    <motion.div
      ref={ref}
      className="relative flex gap-6"
      initial={animated ? { opacity: 0, x: -20 } : undefined}
      animate={animated && isInView ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Node */}
      <div className="relative z-10 flex-shrink-0">
        <div
          className={cn(
            'w-10 h-10 rounded-full border-2 flex items-center justify-center',
            styles.dot
          )}
        >
          {item.icon ? (
            <span className={styles.icon}>{item.icon}</span>
          ) : status === 'complete' ? (
            <svg
              className={cn('w-5 h-5', styles.icon)}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className={cn('text-sm font-mono font-medium', styles.icon)}>
              {index + 1}
            </span>
          )}
        </div>

        {/* Connecting line progress for complete items */}
        {showLine && status === 'complete' && (
          <motion.div
            className="absolute left-1/2 top-10 w-px -translate-x-1/2 bg-accent"
            initial={{ height: 0 }}
            animate={isInView ? { height: 'calc(100% + 2rem)' } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pt-1.5 pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={cn(
              'text-base font-semibold',
              status === 'upcoming' ? 'text-text-muted' : 'text-text-primary'
            )}>
              {item.title}
            </h3>
            {item.description && (
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          {item.date && (
            <span className="flex-shrink-0 text-xs text-text-muted font-mono">
              {item.date}
            </span>
          )}
        </div>

        {/* Additional details */}
        {item.details && (
          <div className="mt-4 p-4 bg-surface/50 border border-border rounded-md">
            {item.details}
          </div>
        )}

        {/* Current indicator */}
        {status === 'current' && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-xs text-accent font-medium">In Progress</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
