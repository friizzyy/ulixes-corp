'use client'

import { useId, useState } from 'react'
import styles from './positions-accordion.module.css'

export interface PositionsAccordionProps {
  items: ReadonlyArray<{ title: string; description: string }>
  /** Heading level of each item's trigger. Defaults to 3. */
  headingLevel?: 3 | 4
}

/**
 * The phone accordion of the six positions (04-acc-ph). One item open at a
 * time; the first is open on load; pressing the open item closes it.
 */
export function PositionsAccordion({ items, headingLevel = 3 }: PositionsAccordionProps) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()
  const Heading = headingLevel === 4 ? 'h4' : 'h3'

  return (
    <div className={styles.acc}>
      {items.map((item, i) => {
        const isOpen = open === i
        const triggerId = `${base}-t${i}`
        const panelId = `${base}-p${i}`
        return (
          <div key={item.title} className={`${styles.it} ${isOpen ? styles.on : ''}`}>
            <Heading className={styles.h}>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className={styles.trigger}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className={`m ${styles.n}`} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.pl} aria-hidden="true">
                  +
                </span>
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              inert={!isOpen}
              className={styles.bd}
            >
              <div>
                <div className={styles.in}>
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
