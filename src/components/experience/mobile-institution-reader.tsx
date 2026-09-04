'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from '@/components/ui'
import styles from './mobile-institution-reader.module.css'

type InstitutionCategory = {
  name: string
  description: string
}

export type MobileInstitutionReaderProps = {
  categories: readonly InstitutionCategory[]
}

export function MobileInstitutionReader({ categories }: MobileInstitutionReaderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const controlRefs = useRef<Array<HTMLButtonElement | null>>([])
  const titleId = useId()
  const lastIndex = categories.length - 1
  const activeCategory = categories[activeIndex]

  const select = (nextIndex: number) => {
    const boundedIndex = Math.min(Math.max(nextIndex, 0), lastIndex)
    if (boundedIndex === activeIndex) return boundedIndex
    setDirection(boundedIndex < activeIndex ? 'backward' : 'forward')
    setActiveIndex(boundedIndex)
    return boundedIndex
  }

  const selectAndFocus = (nextIndex: number) => {
    const boundedIndex = select(nextIndex)
    controlRefs.current[boundedIndex]?.focus()
  }

  useEffect(() => {
    controlRefs.current[activeIndex]?.scrollIntoView?.({
      behavior: 'auto',
      block: 'nearest',
      inline: 'nearest',
    })
  }, [activeIndex])

  if (!activeCategory) return null

  return (
    <section
      className={styles.reader}
      aria-label="Institution reader"
      data-visible-through="895px"
    >
      <nav className={styles.index} aria-label="Institution index">
        {categories.map((category, index) => (
          <button
            type="button"
            key={category.name}
            ref={(node) => {
              controlRefs.current[index] = node
            }}
            className={styles.indexControl}
            aria-pressed={activeIndex === index}
            onClick={() => select(index)}
            onKeyDown={(event) => {
              let nextIndex: number | undefined
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                nextIndex = Math.min(index + 1, lastIndex)
              } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                nextIndex = Math.max(index - 1, 0)
              } else if (event.key === 'Home') {
                nextIndex = 0
              } else if (event.key === 'End') {
                nextIndex = lastIndex
              }

              if (nextIndex !== undefined) {
                event.preventDefault()
                selectAndFocus(nextIndex)
              }
            }}
          >
            <span className={styles.controlIndex} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span>{category.name}</span>
          </button>
        ))}
      </nav>

      <div className={styles.activePane}>
        <div className={styles.positionRow}>
          <p className={styles.position}>
            {String(activeIndex + 1).padStart(2, '0')} /{' '}
            {String(categories.length).padStart(2, '0')}
          </p>
          <div className={styles.pager} aria-label="Browse institutions">
            <button
              type="button"
              className={styles.pagerControl}
              onClick={() => select(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous institution"
            >
              <ArrowLeft size={17} />
            </button>
            <button
              type="button"
              className={styles.pagerControl}
              onClick={() => select(activeIndex + 1)}
              disabled={activeIndex === lastIndex}
              aria-label="Next institution"
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        <article
          key={activeCategory.name}
          className={styles.brief}
          data-direction={direction}
          aria-labelledby={titleId}
          aria-live="polite"
        >
          <h3 id={titleId}>{activeCategory.name}</h3>
          <p className={styles.description} data-testid="institution-description">
            {activeCategory.description}
          </p>
        </article>
      </div>
    </section>
  )
}
