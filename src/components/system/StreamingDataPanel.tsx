'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { formatPreciseTime, formatLatency } from '@/lib/system'
import { GlassSurfaceContainer } from './GlassSurfaceContainer'
import { SystemStatusBadge } from './SystemStatusBadge'

interface DataPoint {
  id: string
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  timestamp: Date
}

interface StreamingDataPanelProps {
  title?: string
  data?: DataPoint[]
  onRefresh?: () => Promise<DataPoint[]>
  refreshInterval?: number // ms, 0 to disable auto-refresh
  className?: string
  showTimestamp?: boolean
  compact?: boolean
}

export function StreamingDataPanel({
  title = 'System Metrics',
  data: initialData = [],
  onRefresh,
  refreshInterval = 0,
  className,
  showTimestamp = true,
  compact = false,
}: StreamingDataPanelProps) {
  const [data, setData] = useState<DataPoint[]>(initialData)
  const [isStreaming, setIsStreaming] = useState(refreshInterval > 0)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [latency, setLatency] = useState<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = useCallback(async () => {
    if (!onRefresh) return

    const start = performance.now()
    try {
      const newData = await onRefresh()
      setLatency(performance.now() - start)
      setLastUpdate(new Date())

      // Stream in data points with slight delays
      for (let i = 0; i < newData.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 15))
        setData(prev => {
          const updated = [...prev]
          const existingIndex = updated.findIndex(d => d.label === newData[i].label)
          if (existingIndex >= 0) {
            updated[existingIndex] = newData[i]
          } else {
            updated.push(newData[i])
          }
          return updated
        })
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
    }
  }, [onRefresh])

  // Set up auto-refresh
  useEffect(() => {
    if (isStreaming && refreshInterval > 0 && onRefresh) {
      fetchData()
      intervalRef.current = setInterval(fetchData, refreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isStreaming, refreshInterval, fetchData, onRefresh])

  // Update data when initialData changes
  useEffect(() => {
    if (initialData.length > 0) {
      setData(initialData)
      setLastUpdate(new Date())
    }
  }, [initialData])

  const toggleStreaming = () => {
    setIsStreaming(prev => !prev)
  }

  const getTrendIndicator = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <span className="text-emerald-400">↑</span>
      case 'down':
        return <span className="text-red-400">↓</span>
      case 'stable':
        return <span className="text-text-muted">→</span>
      default:
        return null
    }
  }

  return (
    <GlassSurfaceContainer className={className} padding="none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-body-sm font-medium text-text-primary">{title}</span>
          <SystemStatusBadge
            status={isStreaming ? 'syncing' : 'connected'}
            label={isStreaming ? 'Live' : 'Paused'}
            size="sm"
          />
        </div>
        <div className="flex items-center gap-3">
          {showTimestamp && lastUpdate && (
            <span className="text-xs text-text-muted font-mono">
              {formatPreciseTime(lastUpdate)} · {formatLatency(latency)}
            </span>
          )}
          {onRefresh && refreshInterval > 0 && (
            <button
              onClick={toggleStreaming}
              className={cn(
                'text-xs font-mono px-2 py-1 rounded transition-colors',
                isStreaming
                  ? 'bg-accent/10 text-accent hover:bg-accent/20'
                  : 'bg-surface text-text-secondary hover:text-text-primary'
              )}
            >
              {isStreaming ? 'Pause' : 'Resume'}
            </button>
          )}
        </div>
      </div>

      {/* Data grid */}
      <div className={cn('p-4', compact ? 'space-y-2' : 'space-y-3')}>
        {data.length === 0 ? (
          <div className="text-center py-8 text-text-muted text-sm">
            No data available
          </div>
        ) : (
          data.map(point => (
            <div
              key={point.id}
              className={cn(
                'flex items-center justify-between',
                compact ? 'py-1' : 'py-2',
                'border-b border-border/50 last:border-0'
              )}
            >
              <span className="text-body-sm text-text-secondary">{point.label}</span>
              <div className="flex items-center gap-2 font-mono">
                {getTrendIndicator(point.trend)}
                <span className={cn(
                  'text-text-primary',
                  compact ? 'text-sm' : 'text-base font-medium'
                )}>
                  {typeof point.value === 'number' ? point.value.toLocaleString() : point.value}
                </span>
                {point.unit && (
                  <span className="text-text-muted text-sm">{point.unit}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </GlassSurfaceContainer>
  )
}
