'use client'

import { cn } from '@/lib/utils'
import { SystemStatus, statusColors } from '@/lib/system'

interface SystemStatusBadgeProps {
  status: SystemStatus
  label?: string
  showDot?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export function SystemStatusBadge({
  status,
  label,
  showDot = true,
  size = 'md',
  className,
}: SystemStatusBadgeProps) {
  const colors = statusColors[status]
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full font-mono',
        colors.bg,
        colors.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
      role="status"
      aria-label={`System status: ${displayLabel}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {status === 'syncing' && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
                colors.dot
              )}
            />
          )}
          <span className={cn('relative inline-flex h-2 w-2 rounded-full', colors.dot)} />
        </span>
      )}
      <span>{displayLabel}</span>
    </div>
  )
}
