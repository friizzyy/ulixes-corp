'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ExecutionResult, formatLatency, formatSystemTime } from '@/lib/system'

interface ExecutionFeedbackRowProps {
  execution: ExecutionResult
  autoDismiss?: boolean
  dismissAfter?: number // ms
  onDismiss?: (id: string) => void
  className?: string
}

export function ExecutionFeedbackRow({
  execution,
  autoDismiss = false,
  dismissAfter = 5000,
  onDismiss,
  className,
}: ExecutionFeedbackRowProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isCollapsing, setIsCollapsing] = useState(false)

  useEffect(() => {
    if (autoDismiss && execution.result !== 'pending') {
      const timer = setTimeout(() => {
        setIsCollapsing(true)
        setTimeout(() => {
          setIsVisible(false)
          onDismiss?.(execution.id)
        }, 200)
      }, dismissAfter)

      return () => clearTimeout(timer)
    }
  }, [autoDismiss, dismissAfter, execution.result, execution.id, onDismiss])

  if (!isVisible) return null

  const resultStyles = {
    success: {
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/20',
      icon: '✓',
      iconColor: 'text-emerald-400',
      label: 'Success',
    },
    failure: {
      bg: 'bg-red-500/5',
      border: 'border-red-500/20',
      icon: '✕',
      iconColor: 'text-red-400',
      label: 'Failed',
    },
    pending: {
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/20',
      icon: '○',
      iconColor: 'text-blue-400',
      label: 'Running',
    },
  }

  const style = resultStyles[execution.result]

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3 rounded-md border font-mono text-sm',
        'transition-all duration-200',
        style.bg,
        style.border,
        isCollapsing && 'opacity-0 transform -translate-y-2',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Left: Icon + Action */}
      <div className="flex items-center gap-3">
        <span className={cn('text-lg', style.iconColor)}>
          {execution.result === 'pending' ? (
            <span className="inline-block animate-spin">◌</span>
          ) : (
            style.icon
          )}
        </span>
        <div className="flex flex-col">
          <span className="text-text-primary">{execution.action}</span>
          {execution.details && (
            <span className="text-xs text-text-muted">{execution.details}</span>
          )}
        </div>
      </div>

      {/* Right: Metadata */}
      <div className="flex items-center gap-4 text-xs">
        <span className={style.iconColor}>{style.label}</span>
        {execution.result !== 'pending' && (
          <span className="text-text-muted">{formatLatency(execution.latencyMs)}</span>
        )}
        <span className="text-text-muted">{formatSystemTime(execution.timestamp)}</span>
      </div>
    </div>
  )
}

// Container for multiple execution feedback rows
interface ExecutionFeedbackListProps {
  executions: ExecutionResult[]
  autoDismiss?: boolean
  dismissAfter?: number
  onDismiss?: (id: string) => void
  maxVisible?: number
  className?: string
}

export function ExecutionFeedbackList({
  executions,
  autoDismiss = true,
  dismissAfter = 5000,
  onDismiss,
  maxVisible = 5,
  className,
}: ExecutionFeedbackListProps) {
  const visibleExecutions = executions.slice(-maxVisible)

  return (
    <div className={cn('space-y-2', className)}>
      {visibleExecutions.map(exec => (
        <ExecutionFeedbackRow
          key={exec.id}
          execution={exec}
          autoDismiss={autoDismiss}
          dismissAfter={dismissAfter}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  )
}
