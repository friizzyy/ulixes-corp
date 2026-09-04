'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import styles from './mobile-disclosure.module.css'

export type MobileDisclosureItem = {
  id: string
  index?: string
  eyebrow?: string
  title: string
  summary?: string
  panel: ReactNode
}

export type MobileDisclosureProps = {
  ariaLabel: string
  /* A short instruction above the list. A bare chevron on a flat row does not
     read as operable, so each register says what it wants you to do. */
  hint?: string
  items: MobileDisclosureItem[]
  defaultOpenId?: string
  tone?: 'light' | 'dark'
  className?: string
  syncWithLocationHash?: boolean
  allowCollapse?: boolean
}

export function MobileDisclosure({
  ariaLabel,
  hint,
  items,
  defaultOpenId,
  tone = 'light',
  className,
  syncWithLocationHash = false,
  allowCollapse = true,
}: MobileDisclosureProps) {
  const instanceId = useId().replace(/:/g, '')
  const controlRefs = useRef(new Map<string, HTMLButtonElement>())
  const scrollFrameRef = useRef<number | null>(null)
  const [openId, setOpenId] = useState<string | undefined>(() =>
    items.some((item) => item.id === defaultOpenId) ? defaultOpenId : items[0]?.id,
  )
  const [hashTargetId, setHashTargetId] = useState<string | undefined>()
  const selectedOpenId = items.some((item) => item.id === openId)
    ? openId
    : allowCollapse
      ? undefined
      : items[0]?.id

  useEffect(() => {
    if (!syncWithLocationHash || typeof window === 'undefined') return

    const openHashTarget = () => {
      let targetId: string
      try {
        targetId = decodeURIComponent(window.location.hash.replace(/^#/, ''))
      } catch {
        return
      }
      if (!items.some((item) => item.id === targetId)) return

      setHashTargetId(targetId)
      if (window.matchMedia('(max-width: 895px)').matches) {
        setOpenId(targetId)
      }
    }

    openHashTarget()
    window.addEventListener('hashchange', openHashTarget)
    return () => {
      window.removeEventListener('hashchange', openHashTarget)
    }
  }, [items, syncWithLocationHash])

  useEffect(() => {
    if (!syncWithLocationHash || !hashTargetId) return

    const phone = window.matchMedia('(max-width: 895px)').matches
    if (phone && selectedOpenId !== hashTargetId) return

    if (scrollFrameRef.current !== null) {
      window.cancelAnimationFrame(scrollFrameRef.current)
    }
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null
      const target = phone
        ? controlRefs.current.get(hashTargetId)
        : Array.from(
            document.querySelectorAll<HTMLElement>(
              '[data-disclosure-hash-target]',
            ),
          ).find(
            (element) =>
              element.dataset.disclosureHashTarget === hashTargetId,
          )
      target?.scrollIntoView({
        behavior: 'auto',
        block: 'start',
        inline: 'nearest',
      })
      setHashTargetId(undefined)
    })

    return () => {
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current)
        scrollFrameRef.current = null
      }
    }
  }, [hashTargetId, selectedOpenId, syncWithLocationHash])

  return (
    <section
      className={cn(styles.disclosure, tone === 'dark' && styles.dark, className)}
      aria-label={ariaLabel}
    >
      {hint && (
        <p className={styles.hint} aria-hidden="true">
          {hint}
        </p>
      )}
      {items.map((item) => {
        const itemId = encodeURIComponent(item.id)
        const controlId = `mobile-disclosure-${instanceId}-${itemId}-control`
        const panelId = `mobile-disclosure-${instanceId}-${itemId}-panel`
        const isOpen = selectedOpenId === item.id

        return (
          <div className={styles.item} key={item.id}>
            <button
              type="button"
              ref={(node) => {
                if (node) controlRefs.current.set(item.id, node)
                else controlRefs.current.delete(item.id)
              }}
              id={controlId}
              className={styles.control}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => {
                setOpenId((currentId) =>
                  currentId === item.id && allowCollapse ? undefined : item.id,
                )
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape' && isOpen && allowCollapse) {
                  event.preventDefault()
                  setOpenId(undefined)
                }
              }}
            >
              {item.index && <span className={styles.index}>{item.index}</span>}
              <span className={styles.copy}>
                {item.eyebrow && <span className={styles.eyebrow}>{item.eyebrow}</span>}
                <span className={styles.title}>{item.title}</span>
                {item.summary && <span className={styles.summary}>{item.summary}</span>}
              </span>
              <span className={styles.chamber} aria-hidden="true">
                <span className={styles.indicator} />
              </span>
            </button>
            <div
              id={panelId}
              className={styles.panel}
              role="region"
              aria-labelledby={controlId}
              hidden={!isOpen}
            >
              {isOpen && <div className={styles.panelInner}>{item.panel}</div>}
            </div>
          </div>
        )
      })}
    </section>
  )
}
