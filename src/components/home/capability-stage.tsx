'use client'

import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
} from 'react'
import {
  capabilities,
  homepageContent,
  lifecycleStages,
  type Capability,
  type LifecycleStageId,
} from '@/lib/homepage-content'
import { SignalNetwork } from './signal-network'
import styles from './homepage.module.css'

const desktopMediaQuery = '(min-width: 768px)'
const reducedMotionMediaQuery = '(prefers-reduced-motion: reduce)'
const activationMargin = '-45% 0px -54% 0px'
const instantScrollFocusDelayMs = 1
const smoothScrollFocusSafetyMs = 2000

const stageLabels = new Map<LifecycleStageId, string>(
  lifecycleStages.map((stage) => [stage.id, stage.label]),
)

type CapabilityId = Capability['id']

export function CapabilityStage() {
  const instanceId = useId().replaceAll(':', '')
  const [activeCapabilityId, setActiveCapabilityId] =
    useState<CapabilityId>('implementation')
  const headingsRef = useRef(new Map<CapabilityId, HTMLHeadingElement>())
  const scrollFocusCleanupRef = useRef<null | (() => void)>(null)
  const activeCapability =
    capabilities.find((capability) => capability.id === activeCapabilityId) ??
    capabilities[0]

  useEffect(() => {
    const mediaQuery = window.matchMedia(desktopMediaQuery)
    let observer: IntersectionObserver | null = null

    const synchronizeObserver = () => {
      observer?.disconnect()
      observer = null

      if (!mediaQuery.matches) return

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue

            const capabilityId = (entry.target as HTMLElement).dataset
              .capabilityHeading as CapabilityId | undefined

            if (
              capabilityId &&
              capabilities.some((capability) => capability.id === capabilityId)
            ) {
              setActiveCapabilityId(capabilityId)
            }
          }
        },
        {
          rootMargin: activationMargin,
          threshold: 0,
        },
      )

      headingsRef.current.forEach((heading) => {
        observer?.observe(heading)
      })
    }

    synchronizeObserver()
    mediaQuery.addEventListener('change', synchronizeObserver)

    return () => {
      mediaQuery.removeEventListener('change', synchronizeObserver)
      observer?.disconnect()
    }
  }, [])

  useEffect(
    () => () => {
      scrollFocusCleanupRef.current?.()
    },
    [],
  )

  const handleHeadingClick = (
    event: MouseEvent<HTMLAnchorElement>,
    capability: Capability,
  ) => {
    const heading = document.getElementById(
      event.currentTarget.hash.slice(1),
    )
    if (!heading) return
    const targetHeading = heading

    setActiveCapabilityId(capability.id)
    scrollFocusCleanupRef.current?.()

    let settled = false
    let fallbackId: number | undefined
    let listeningForScrollEnd = false

    const removeScheduledFocus = () => {
      if (listeningForScrollEnd) {
        window.removeEventListener('scrollend', finishFocus)
      }
      if (fallbackId !== undefined) {
        window.clearTimeout(fallbackId)
      }
    }

    const cancelFocus = () => {
      if (settled) return
      settled = true
      removeScheduledFocus()
      if (scrollFocusCleanupRef.current === cancelFocus) {
        scrollFocusCleanupRef.current = null
      }
    }

    function finishFocus() {
      if (settled) return
      settled = true
      removeScheduledFocus()
      if (scrollFocusCleanupRef.current === cancelFocus) {
        scrollFocusCleanupRef.current = null
      }
      if (!targetHeading.isConnected) return

      targetHeading.focus({ preventScroll: true })
    }

    const reducedMotion = window.matchMedia(reducedMotionMediaQuery).matches
    const shouldWaitForScrollEnd =
      !reducedMotion && 'onscrollend' in window

    if (shouldWaitForScrollEnd) {
      listeningForScrollEnd = true
      window.addEventListener('scrollend', finishFocus, { once: true })
    }

    fallbackId = window.setTimeout(
      finishFocus,
      reducedMotion ? instantScrollFocusDelayMs : smoothScrollFocusSafetyMs,
    )
    scrollFocusCleanupRef.current = cancelFocus
  }

  return (
    <section
      id="capabilities"
      className={styles.capabilityStage}
      aria-labelledby={`capabilities-title-${instanceId}`}
    >
      <div className={styles.capabilityLayout}>
        <header className={styles.capabilityHeader}>
          <p className={styles.capabilityKicker}>Connected expertise</p>
          <h2
            id={`capabilities-title-${instanceId}`}
            className={styles.capabilityTitle}
            tabIndex={-1}
          >
            {homepageContent.capabilities.title}
          </h2>
          <p className={styles.capabilityIntroduction}>
            {homepageContent.capabilities.body}
          </p>
        </header>

        <div className={styles.capabilityComposition}>
          <div
            className={styles.capabilitySharedVisual}
            data-capability-shared-network
            aria-hidden="true"
          >
            <SignalNetwork
              highlightedStageIds={activeCapability.stageIds}
              renderMode={activeCapability.renderMode}
              className={styles.capabilitySharedNetwork}
            />
            <p className={styles.capabilitySharedCaption}>
              {activeCapability.title}
            </p>
          </div>

          <div className={styles.capabilityArticles}>
            {capabilities.map((capability) => {
              const isActive = capability.id === activeCapabilityId
              const headingId = `capability-${capability.id}`
              const articleId = `${headingId}-article-${instanceId}`

              return (
                <article
                  key={capability.id}
                  id={articleId}
                  className={styles.capabilityArticle}
                  data-capability-id={capability.id}
                  data-active={isActive ? 'true' : undefined}
                  aria-labelledby={headingId}
                >
                  <div className={styles.capabilityArticleCopy}>
                    <h3
                      ref={(node) => {
                        if (node) headingsRef.current.set(capability.id, node)
                        else headingsRef.current.delete(capability.id)
                      }}
                      id={headingId}
                      className={styles.capabilityArticleTitle}
                      data-capability-heading={capability.id}
                      tabIndex={-1}
                    >
                      <a
                        className={styles.capabilityArticleLink}
                        href={`#${headingId}`}
                        aria-current={isActive ? 'true' : undefined}
                        onClick={(event) =>
                          handleHeadingClick(event, capability)
                        }
                      >
                        {capability.title}
                      </a>
                    </h3>
                    <p className={styles.capabilityDescription}>
                      {capability.description}
                    </p>
                  </div>

                  <div className={styles.capabilityArticleMap}>
                    <SignalNetwork
                      highlightedStageIds={capability.stageIds}
                      renderMode={capability.renderMode}
                      orientation="vertical"
                      className={styles.capabilityArticleNetwork}
                    />
                    <ul
                      className={styles.capabilityCoverage}
                      aria-label={`${capability.title} lifecycle coverage`}
                    >
                      {capability.stageIds.map((stageId) => (
                        <li key={stageId}>{stageLabels.get(stageId)}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
