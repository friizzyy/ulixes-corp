'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight } from '@/components/ui'
import { pad } from './motion'
import styles from './mobile-process-pager.module.css'

type ProcessStep = {
  title: string
  description: string
}

type MobileProcessPagerProps = {
  steps: readonly ProcessStep[]
}

export function MobileProcessPager({ steps }: MobileProcessPagerProps) {
  const instanceId = useId().replace(/:/g, '')
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<'previous' | 'next'>('next')
  const controlRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeStep = steps[activeIndex] ?? steps[0]
  const detailId = `services-mobile-process-${instanceId}-detail`

  if (!activeStep) return null

  const selectPhase = (nextIndex: number) => {
    if (nextIndex === activeIndex) return
    setDirection(nextIndex < activeIndex ? 'previous' : 'next')
    setActiveIndex(nextIndex)
  }

  const selectAdjacentPhase = (offset: -1 | 1) => {
    const nextIndex = (activeIndex + offset + steps.length) % steps.length
    setDirection(offset < 0 ? 'previous' : 'next')
    setActiveIndex(nextIndex)
  }

  const handleControlKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const offset = event.key === 'ArrowLeft' ? -1 : 1
    const nextIndex = (index + offset + steps.length) % steps.length
    setDirection(offset < 0 ? 'previous' : 'next')
    setActiveIndex(nextIndex)
    controlRefs.current[nextIndex]?.focus()
  }

  return (
    <section className={styles.pager} aria-label="Engagement approach phases">
      <div
        className={styles.phaseControls}
        role="group"
        aria-label="Select a process phase"
      >
        {steps.map((step, index) => {
          const isActive = index === activeIndex
          const controlId = `services-mobile-process-${instanceId}-phase-${index + 1}`

          return (
            <button
              key={step.title}
              ref={(node) => {
                controlRefs.current[index] = node
              }}
              type="button"
              id={controlId}
              className={styles.phaseControl}
              aria-label={`Phase ${index + 1}: ${step.title}, ${pad(index)}`}
              aria-expanded={isActive}
              aria-controls={detailId}
              onClick={() => selectPhase(index)}
              onKeyDown={(event) => handleControlKeyDown(event, index)}
            >
              {pad(index)}
            </button>
          )
        })}
      </div>

      <div
        key={`${activeIndex}-${direction}`}
        id={detailId}
        className={styles.phaseDetail}
        data-direction={direction}
        role="region"
        aria-live="polite"
        aria-labelledby={`services-mobile-process-${instanceId}-phase-${activeIndex + 1}`}
      >
        <p className={styles.position}>Phase {activeIndex + 1} of {steps.length}</p>
        <h3 className={styles.title}>{activeStep.title}</h3>
        <p className={styles.description}>{activeStep.description}</p>
      </div>

      <div className={styles.navigation}>
        <button
          type="button"
          className={styles.navigationControl}
          aria-label="Previous phase"
          onClick={() => selectAdjacentPhase(-1)}
        >
          <ArrowLeft size={16} />
          <span>Previous</span>
        </button>
        <button
          type="button"
          className={styles.navigationControl}
          aria-label="Next phase"
          onClick={() => selectAdjacentPhase(1)}
        >
          <span>Next</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}
