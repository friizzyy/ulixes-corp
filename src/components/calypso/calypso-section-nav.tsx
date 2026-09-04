'use client'

import { useEffect, useState } from 'react'
import styles from './calypso-section-nav.module.css'

export type CalypsoSection = {
  id: 'lifecycle' | 'programs' | 'mandates'
  label: string
}

type CalypsoSectionNavProps = {
  sections: readonly CalypsoSection[]
}

export function CalypsoSectionNav({ sections }: CalypsoSectionNavProps) {
  const [active, setActive] = useState<CalypsoSection['id']>(
    sections[0]?.id ?? 'lifecycle',
  )

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const sectionIds = new Set(sections.map((section) => section.id))
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((target): target is HTMLElement => target !== null)

    if (targets.length === 0) return

    const visibility = new Map<
      CalypsoSection['id'],
      { isIntersecting: boolean; ratio: number }
    >(
      sections.map((section) => [
        section.id,
        { isIntersecting: false, ratio: 0 },
      ]),
    )
    const targetById = new Map(
      targets.map((target) => [target.id as CalypsoSection['id'], target]),
    )

    const selectFrom = (candidateSections: readonly CalypsoSection[]) => {
      const geometries = candidateSections.map((section) => ({
        section,
        rect: targetById.get(section.id)?.getBoundingClientRect(),
      }))
      const hasLayout = geometries.some(
        ({ rect }) =>
          rect && (rect.height > 0 || rect.top !== 0 || rect.bottom !== 0),
      )

      let visible: CalypsoSection | null = null
      if (hasLayout) {
        const navBottom =
          document
            .querySelector<HTMLElement>('[data-calypso-sticky-nav="true"]')
            ?.getBoundingClientRect().bottom ?? 0
        /* Anchor destinations settle about 14px beneath the sticky nav.
           Probe two pixels into the chapter so subpixel rounding cannot
           leave the outgoing section owning the exact shared boundary. */
        const activationLine = Math.max(navBottom + 16, 134)
        const containing = geometries
          .filter(
            ({ rect }) =>
              rect &&
              rect.top <= activationLine &&
              rect.bottom > activationLine,
          )
          .sort(
            (left, right) =>
              (right.rect?.top ?? Number.NEGATIVE_INFINITY) -
              (left.rect?.top ?? Number.NEGATIVE_INFINITY),
          )[0]
        const approaching = geometries
          .filter(({ rect }) => rect && rect.top >= activationLine)
          .sort(
            (left, right) =>
              (left.rect?.top ?? Number.POSITIVE_INFINITY) -
              (right.rect?.top ?? Number.POSITIVE_INFINITY),
          )[0]
        visible = containing?.section ?? approaching?.section ?? null
      } else {
        visible = candidateSections.reduce<CalypsoSection | null>(
          (mostVisible, section) => {
            if (!mostVisible) return section
            return (visibility.get(section.id)?.ratio ?? 0) >
              (visibility.get(mostVisible.id)?.ratio ?? 0)
              ? section
              : mostVisible
          },
          null,
        )
      }

      if (visible) setActive(visible.id)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id as CalypsoSection['id']
          if (!sectionIds.has(id)) return
          visibility.set(id, {
            isIntersecting: entry.isIntersecting,
            ratio: entry.isIntersecting ? entry.intersectionRatio : 0,
          })
        })

        const visibleSections = sections.filter(
          (section) => visibility.get(section.id)?.isIntersecting,
        )
        selectFrom(visibleSections)
      },
      {
        rootMargin: '-112px 0px -55% 0px',
        threshold: [0, 0.01, 0.1, 0.25, 0.5, 0.75],
      },
    )

    let scrollFrame: number | null = null
    const updateFromScroll = () => {
      scrollFrame = null
      /* Geometry, rather than whole-section ratio, resolves the chapter at
         the sticky boundary even when adjacent sections differ in height. */
      selectFrom(sections)
    }
    const onScroll = () => {
      if (scrollFrame !== null) return
      if (typeof window.requestAnimationFrame !== 'function') {
        updateFromScroll()
        return
      }
      scrollFrame = window.requestAnimationFrame(updateFromScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    targets.forEach((target) => observer.observe(target))
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (
        scrollFrame !== null &&
        typeof window.cancelAnimationFrame === 'function'
      ) {
        window.cancelAnimationFrame(scrollFrame)
      }
      visibility.clear()
      targetById.clear()
      observer.disconnect()
    }
  }, [sections])

  return (
    <nav
      className={styles.nav}
      aria-label="Calypso sections"
      data-calypso-sticky-nav="true"
    >
      <div className={styles.rail}>
        {sections.map((section) => {
          const isActive = active === section.id
          return (
            <a
              key={section.id}
              className={styles.link}
              href={`#${section.id}`}
              aria-current={isActive ? 'location' : undefined}
              data-active={isActive ? 'true' : 'false'}
              onClick={() => setActive(section.id)}
            >
              {section.label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}
