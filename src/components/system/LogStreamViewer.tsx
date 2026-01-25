'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { LogEntry, LogSeverity, severityColors, formatPreciseTime, generateId } from '@/lib/system'
import { GlassSurfaceContainer } from './GlassSurfaceContainer'

interface LogStreamViewerProps {
  logs?: LogEntry[]
  onNewLog?: (callback: (log: LogEntry) => void) => () => void // Returns unsubscribe fn
  maxLogs?: number
  className?: string
  title?: string
  showFilters?: boolean
  showTimestamp?: boolean
  showSource?: boolean
}

const severityLabels: Record<LogSeverity, string> = {
  info: 'INFO',
  warn: 'WARN',
  error: 'ERR',
  debug: 'DBG',
}

export function LogStreamViewer({
  logs: initialLogs = [],
  onNewLog,
  maxLogs = 200,
  className,
  title = 'Event Log',
  showFilters = true,
  showTimestamp = true,
  showSource = false,
}: LogStreamViewerProps) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs)
  const [isPaused, setIsPaused] = useState(false)
  const [filter, setFilter] = useState<LogSeverity | 'all'>('all')
  const [isAutoScroll, setIsAutoScroll] = useState(true)
  const [pendingLogs, setPendingLogs] = useState<LogEntry[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const wasScrolledToBottom = useRef(true)

  // Subscribe to new logs
  useEffect(() => {
    if (!onNewLog) return

    const unsubscribe = onNewLog((log) => {
      if (isPaused) {
        setPendingLogs(prev => [...prev, log].slice(-maxLogs))
      } else {
        setLogs(prev => [...prev, log].slice(-maxLogs))
      }
    })

    return unsubscribe
  }, [onNewLog, isPaused, maxLogs])

  // Handle auto-scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container || !isAutoScroll || isPaused) return

    container.scrollTop = container.scrollHeight
  }, [logs, isAutoScroll, isPaused])

  // Track if user has scrolled away from bottom
  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50
    wasScrolledToBottom.current = isAtBottom
    setIsAutoScroll(isAtBottom)
  }, [])

  // Resume and merge pending logs
  const handleResume = () => {
    setLogs(prev => [...prev, ...pendingLogs].slice(-maxLogs))
    setPendingLogs([])
    setIsPaused(false)
    setIsAutoScroll(true)
  }

  const handlePause = () => {
    setIsPaused(true)
  }

  const handleClear = () => {
    setLogs([])
    setPendingLogs([])
  }

  const filteredLogs = filter === 'all'
    ? logs
    : logs.filter(log => log.severity === filter)

  return (
    <GlassSurfaceContainer className={cn('flex flex-col', className)} padding="none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-body-sm font-medium text-text-primary">{title}</span>
          <span className="text-xs text-text-muted font-mono">
            {filteredLogs.length} events
          </span>
          {isPaused && pendingLogs.length > 0 && (
            <span className="text-xs text-yellow-400 font-mono">
              +{pendingLogs.length} pending
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Severity filter */}
          {showFilters && (
            <div className="flex gap-1">
              {(['all', 'info', 'warn', 'error', 'debug'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setFilter(sev)}
                  className={cn(
                    'px-2 py-1 text-xs font-mono rounded transition-colors',
                    filter === sev
                      ? 'bg-accent/20 text-accent'
                      : 'text-text-muted hover:text-text-secondary'
                  )}
                >
                  {sev === 'all' ? 'All' : severityLabels[sev]}
                </button>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-1 ml-2 border-l border-border pl-2">
            <button
              onClick={isPaused ? handleResume : handlePause}
              className={cn(
                'px-2 py-1 text-xs font-mono rounded transition-colors',
                isPaused
                  ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                  : 'text-text-muted hover:text-text-secondary hover:bg-surface'
              )}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={handleClear}
              className="px-2 py-1 text-xs font-mono text-text-muted hover:text-text-secondary hover:bg-surface rounded transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Log entries */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto min-h-[200px] max-h-[400px] font-mono text-xs"
      >
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-muted">
            No events to display
          </div>
        ) : (
          <div className="p-2">
            {filteredLogs.map(log => (
              <div
                key={log.id}
                className={cn(
                  'flex items-start gap-3 py-1.5 px-2 rounded',
                  'hover:bg-surface/50 transition-colors'
                )}
              >
                {showTimestamp && (
                  <span className="text-text-muted flex-shrink-0 w-[85px]">
                    {formatPreciseTime(log.timestamp)}
                  </span>
                )}
                <span
                  className={cn(
                    'flex-shrink-0 w-[42px] text-right',
                    severityColors[log.severity]
                  )}
                >
                  [{severityLabels[log.severity]}]
                </span>
                {showSource && log.source && (
                  <span className="text-text-muted flex-shrink-0">
                    {log.source}:
                  </span>
                )}
                <span className="text-text-secondary break-all">
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auto-scroll indicator */}
      {!isAutoScroll && !isPaused && (
        <button
          onClick={() => {
            setIsAutoScroll(true)
            if (containerRef.current) {
              containerRef.current.scrollTop = containerRef.current.scrollHeight
            }
          }}
          className="absolute bottom-14 right-4 px-3 py-1.5 bg-surface border border-border rounded text-xs font-mono text-text-secondary hover:text-text-primary transition-colors"
        >
          ↓ Scroll to bottom
        </button>
      )}

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border text-xs text-text-muted font-mono flex justify-between">
        <span>Scroll: {isAutoScroll ? 'Auto' : 'Manual'}</span>
        <span>Buffer: {logs.length}/{maxLogs}</span>
      </div>
    </GlassSurfaceContainer>
  )
}

// Helper hook to create a mock log stream for demos
export function useMockLogStream(interval = 2000) {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    const messages = [
      { severity: 'info' as const, message: 'Connection established to primary node' },
      { severity: 'info' as const, message: 'Heartbeat received from cluster' },
      { severity: 'debug' as const, message: 'Cache hit ratio: 94.2%' },
      { severity: 'warn' as const, message: 'High memory usage detected (87%)' },
      { severity: 'info' as const, message: 'Batch job completed successfully' },
      { severity: 'error' as const, message: 'Failed to connect to secondary replica' },
      { severity: 'info' as const, message: 'Auto-scaling triggered: +2 instances' },
      { severity: 'debug' as const, message: 'Query optimization applied' },
    ]

    const timer = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)]
      const newLog: LogEntry = {
        id: generateId(),
        timestamp: new Date(),
        severity: msg.severity,
        message: msg.message,
        source: 'system',
      }
      setLogs(prev => [...prev.slice(-199), newLog])
    }, interval)

    return () => clearInterval(timer)
  }, [interval])

  return logs
}
