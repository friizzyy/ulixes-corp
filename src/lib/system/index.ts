// System utilities for operational UI components

export type SystemStatus = 'connected' | 'syncing' | 'degraded' | 'offline'

export type LogSeverity = 'info' | 'warn' | 'error' | 'debug'

export interface LogEntry {
  id: string
  timestamp: Date
  severity: LogSeverity
  message: string
  source?: string
}

export interface ExecutionResult {
  id: string
  action: string
  result: 'success' | 'failure' | 'pending'
  latencyMs: number
  timestamp: Date
  details?: string
}

// Format timestamp for system display
export function formatSystemTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// Format timestamp with milliseconds for high-precision displays
export function formatPreciseTime(date: Date): string {
  const base = formatSystemTime(date)
  const ms = date.getMilliseconds().toString().padStart(3, '0')
  return `${base}.${ms}`
}

// Format latency for display
export function formatLatency(ms: number): string {
  if (ms < 1) return '<1ms'
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

// Generate unique ID for log entries
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// Severity colors (CSS class suffixes)
export const severityColors: Record<LogSeverity, string> = {
  info: 'text-text-secondary',
  warn: 'text-yellow-400',
  error: 'text-red-400',
  debug: 'text-text-muted',
}

// Status colors
export const statusColors: Record<SystemStatus, { bg: string; text: string; dot: string }> = {
  connected: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  syncing: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    dot: 'bg-blue-400',
  },
  degraded: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    dot: 'bg-yellow-400',
  },
  offline: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
}
