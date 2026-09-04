'use client'

import { type KeyboardEvent, useId, useRef, useState } from 'react'
import type { CalypsoDeliveryArea } from '@/lib/calypso-content'
import styles from './mobile-mandate-selector.module.css'

export type MobileMandateSelectorProps = {
  mandates: readonly CalypsoDeliveryArea[]
}

const materials = ['steel', 'sage', 'clay', 'platinum'] as const
const pad = (value: number) => String(value).padStart(2, '0')

const formatScope = (scope: string) =>
  scope
    .split('·')
    .map((term) => {
      const normalized = term.trim()
      return normalized.charAt(0).toUpperCase() + normalized.slice(1)
    })
    .join(' · ')

export function MobileMandateSelector({
  mandates,
}: MobileMandateSelectorProps) {
  const instanceId = useId().replace(/:/g, '')
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const controlRefs = useRef<Array<HTMLButtonElement | null>>([])
  const activeMandate = mandates[activeIndex] ?? mandates[0]
  const lastIndex = mandates.length - 1
  const riskId = `mobile-mandate-${instanceId}-risk`

  if (!activeMandate) return null

  const select = (nextIndex: number, moveFocus = false) => {
    const boundedIndex = Math.min(Math.max(nextIndex, 0), lastIndex)
    if (boundedIndex !== activeIndex) {
      setDirection(boundedIndex < activeIndex ? 'backward' : 'forward')
      setActiveIndex(boundedIndex)
    }
    if (moveFocus) controlRefs.current[boundedIndex]?.focus()
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | undefined

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = Math.min(index + 1, lastIndex)
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = Math.max(index - 1, 0)
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = lastIndex
    }

    if (nextIndex === undefined) return
    event.preventDefault()
    select(nextIndex, true)
  }

  return (
    <section
      className={styles.selector}
      role="region"
      aria-label="Mobile Calypso mandates"
      data-visible-through="895px"
      data-material={materials[activeIndex]}
    >
      <ol className={styles.list}>
        {mandates.map((mandate, index) => {
          const isActive = index === activeIndex

          return (
            <li key={mandate.id} data-material={materials[index]}>
              <button
                ref={(node) => {
                  controlRefs.current[index] = node
                }}
                type="button"
                className={styles.control}
                aria-pressed={isActive}
                aria-controls={riskId}
                onClick={() => select(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span className={styles.index}>{pad(index + 1)}</span>
                <span className={styles.identity}>
                  <strong>{mandate.title}</strong>
                  <span>{formatScope(mandate.scope)}</span>
                </span>
                <span className={styles.mark} aria-hidden="true">
                  {isActive ? '−' : '+'}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <div
        key={activeMandate.id}
        id={riskId}
        className={styles.risk}
        role="region"
        aria-label="Selected mandate risk"
        aria-live="polite"
        data-mandate-risk
        data-direction={direction}
      >
        <p className={styles.riskLabel}>Risk concentration</p>
        <p className={styles.riskCopy}>{activeMandate.risk}</p>
      </div>
    </section>
  )
}
