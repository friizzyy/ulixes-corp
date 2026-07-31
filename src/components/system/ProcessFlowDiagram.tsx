'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProcessStep {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  status?: 'pending' | 'active' | 'complete'
}

interface ProcessFlowDiagramProps {
  steps: ProcessStep[]
  activeStep?: number
  autoPlay?: boolean
  autoPlayInterval?: number
  orientation?: 'horizontal' | 'vertical'
  showConnectors?: boolean
  className?: string
  onStepClick?: (index: number) => void
}

export function ProcessFlowDiagram({
  steps,
  activeStep: controlledActiveStep,
  autoPlay = false,
  autoPlayInterval = 2500,
  orientation = 'horizontal',
  showConnectors = true,
  className,
  onStepClick,
}: ProcessFlowDiagramProps) {
  const [internalActiveStep, setInternalActiveStep] = useState(0)
  const activeStep = controlledActiveStep ?? internalActiveStep

  // Auto-play through steps
  useEffect(() => {
    if (!autoPlay || controlledActiveStep !== undefined) return

    const timer = setInterval(() => {
      setInternalActiveStep(prev => (prev + 1) % steps.length)
    }, autoPlayInterval)

    return () => clearInterval(timer)
  }, [autoPlay, autoPlayInterval, steps.length, controlledActiveStep])

  const getStepStatus = (index: number): 'pending' | 'active' | 'complete' => {
    if (steps[index].status) return steps[index].status!
    if (index < activeStep) return 'complete'
    if (index === activeStep) return 'active'
    return 'pending'
  }

  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      className={cn(
        'relative',
        isHorizontal ? 'flex items-start justify-between' : 'flex flex-col gap-0',
        className
      )}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index)
        const isLast = index === steps.length - 1

        return (
          <div
            key={step.id}
            className={cn(
              'relative',
              isHorizontal ? 'flex-1 flex flex-col items-center' : 'flex items-start gap-4'
            )}
          >
            {/* Connector line */}
            {showConnectors && !isLast && (
              <div
                className={cn(
                  'absolute bg-border',
                  isHorizontal
                    ? 'top-5 left-1/2 right-0 h-px -translate-x-0'
                    : 'left-5 top-10 bottom-0 w-px'
                )}
              >
                {/* Animated progress fill */}
                <motion.div
                  className={cn(
                    'absolute bg-accent',
                    isHorizontal ? 'top-0 left-0 h-full' : 'top-0 left-0 w-full'
                  )}
                  initial={isHorizontal ? { width: 0 } : { height: 0 }}
                  animate={
                    status === 'complete'
                      ? isHorizontal
                        ? { width: '100%' }
                        : { height: '100%' }
                      : isHorizontal
                      ? { width: 0 }
                      : { height: 0 }
                  }
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            )}

            {/* Step node */}
            <motion.button
              onClick={() => onStepClick?.(index)}
              className={cn(
                'relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center',
                'transition-colors duration-300',
                status === 'complete' && 'bg-accent border-accent text-bg-primary',
                status === 'active' && 'bg-accent/20 border-accent text-accent',
                status === 'pending' && 'bg-bg-secondary border-border text-text-muted',
                onStepClick && 'cursor-pointer hover:border-accent/60'
              )}
              whileHover={onStepClick ? { scale: 1.1 } : undefined}
              whileTap={onStepClick ? { scale: 0.95 } : undefined}
            >
              {status === 'complete' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-sm font-mono font-medium">{index + 1}</span>
              )}

              {/* Active pulse */}
              {status === 'active' && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-accent"
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>

            {/* Label and description */}
            <div
              className={cn(
                isHorizontal ? 'mt-4 text-center max-w-[140px]' : 'flex-1 pt-1.5'
              )}
            >
              <motion.div
                className={cn(
                  'text-sm font-medium transition-colors duration-300',
                  status === 'active' ? 'text-text-primary' : 'text-text-secondary'
                )}
              >
                {step.label}
              </motion.div>
              <AnimatePresence mode="wait">
                {step.description && status === 'active' && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-xs text-text-muted mt-1"
                  >
                    {step.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        )
      })}
    </div>
  )
}
