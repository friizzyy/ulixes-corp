'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface DataNode {
  id: string
  label: string
  type: 'source' | 'process' | 'destination' | 'storage'
  status?: 'active' | 'idle' | 'error'
}

interface DataFlow {
  from: string
  to: string
  label?: string
  throughput?: string
}

interface DataFlowVisualizerProps {
  nodes: DataNode[]
  flows: DataFlow[]
  title?: string
  animate?: boolean
  className?: string
}

const nodeTypeStyles = {
  source: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: '→',
  },
  process: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: '⚙',
  },
  destination: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: '◉',
  },
  storage: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: '▣',
  },
}

export function DataFlowVisualizer({
  nodes,
  flows,
  title,
  animate = true,
  className,
}: DataFlowVisualizerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [activeFlow, setActiveFlow] = useState<number>(0)

  // Cycle through flows for animation
  useEffect(() => {
    if (!animate || !isInView) return

    const timer = setInterval(() => {
      setActiveFlow(prev => (prev + 1) % flows.length)
    }, 2000)

    return () => clearInterval(timer)
  }, [animate, flows.length, isInView])

  return (
    <div
      ref={ref}
      className={cn(
        'relative bg-bg-secondary border border-border rounded-lg p-6 md:p-8',
        className
      )}
    >
      {title && (
        <h4 className="text-sm font-medium text-text-muted mb-6">{title}</h4>
      )}

      {/* Horizontal flow layout */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4">
        {nodes.map((node, index) => {
          const style = nodeTypeStyles[node.type]
          const isActive = flows[activeFlow]?.from === node.id || flows[activeFlow]?.to === node.id
          const hasIncoming = flows.some(f => f.to === node.id)
          const hasOutgoing = flows.some(f => f.from === node.id)

          return (
            <div key={node.id} className="flex items-center">
              {/* Node */}
              <motion.div
                className={cn(
                  'relative flex flex-col items-center gap-2 p-4 rounded-lg border-2',
                  style.bg,
                  style.border,
                  isActive && 'ring-2 ring-accent ring-offset-2 ring-offset-bg-secondary'
                )}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span className="text-2xl">{style.icon}</span>
                <span className="text-sm font-medium text-text-primary whitespace-nowrap">
                  {node.label}
                </span>
                {node.status === 'active' && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full">
                    <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />
                  </span>
                )}
              </motion.div>

              {/* Connector arrow */}
              {index < nodes.length - 1 && (
                <div className="relative mx-4 min-w-[60px]">
                  <div className="h-px bg-border w-full" />

                  {/* Animated data packet */}
                  {animate && flows[activeFlow]?.from === node.id && (
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-accent rounded-full"
                      initial={{ left: 0, opacity: 0 }}
                      animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 1, ease: 'linear' }}
                    />
                  )}

                  {/* Arrow head */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-6 border-transparent border-l-border" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Flow details */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">Active flow:</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={activeFlow}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="font-mono text-accent"
            >
              {flows[activeFlow]?.from} → {flows[activeFlow]?.to}
              {flows[activeFlow]?.throughput && (
                <span className="ml-2 text-text-muted">
                  ({flows[activeFlow].throughput})
                </span>
              )}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// Simplified pipeline visualization
interface PipelineStage {
  id: string
  name: string
  status: 'complete' | 'running' | 'pending' | 'error'
  duration?: string
}

interface PipelineVisualizerProps {
  stages: PipelineStage[]
  title?: string
  className?: string
}

export function PipelineVisualizer({ stages, title, className }: PipelineVisualizerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const statusStyles = {
    complete: { bg: 'bg-emerald-500', text: 'text-emerald-400', icon: '✓' },
    running: { bg: 'bg-blue-500', text: 'text-blue-400', icon: '◌' },
    pending: { bg: 'bg-text-muted', text: 'text-text-muted', icon: '○' },
    error: { bg: 'bg-red-500', text: 'text-red-400', icon: '✕' },
  }

  return (
    <div
      ref={ref}
      className={cn(
        'bg-bg-secondary border border-border rounded-lg p-4 md:p-6',
        className
      )}
    >
      {title && (
        <h4 className="text-sm font-medium text-text-muted mb-4">{title}</h4>
      )}

      <div className="flex items-center">
        {stages.map((stage, index) => {
          const style = statusStyles[stage.status]
          const isLast = index === stages.length - 1

          return (
            <div key={stage.id} className="flex items-center flex-1">
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {/* Stage indicator */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono',
                    stage.status === 'running' ? 'bg-blue-500/20' : 'bg-surface',
                    'border border-border'
                  )}
                >
                  {stage.status === 'running' ? (
                    <span className="animate-spin">{style.icon}</span>
                  ) : (
                    <span className={style.text}>{style.icon}</span>
                  )}
                </div>

                {/* Stage name */}
                <span className="text-xs text-text-secondary mt-2 text-center whitespace-nowrap">
                  {stage.name}
                </span>

                {/* Duration */}
                {stage.duration && stage.status === 'complete' && (
                  <span className="text-xs text-text-muted font-mono mt-0.5">
                    {stage.duration}
                  </span>
                )}
              </motion.div>

              {/* Connector */}
              {!isLast && (
                <div className="flex-1 mx-2 relative">
                  <div className="h-px bg-border" />
                  {stage.status === 'complete' && (
                    <motion.div
                      className="absolute top-0 left-0 h-px bg-accent"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: '100%' } : {}}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
