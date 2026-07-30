'use client'

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import {
  homepageContent,
  lifecycleStages,
  type LifecycleStage,
  type LifecycleStageId,
} from '@/lib/homepage-content'
import { SignalNetwork } from './signal-network'
import styles from './homepage.module.css'

const nextKeys = new Set(['ArrowRight', 'ArrowDown'])
const previousKeys = new Set(['ArrowLeft', 'ArrowUp'])
const mobileMediaQuery = '(max-width: 767px)'
const reducedMotionMediaQuery = '(prefers-reduced-motion: reduce)'

type HandoffState = 'static' | 'armed' | 'complete'

export function SystemTrace() {
  const instanceId = useId().replaceAll(':', '')
  const [activeStageId, setActiveStageId] =
    useState<LifecycleStageId>('capture')
  const [previewStageId, setPreviewStageId] =
    useState<LifecycleStageId | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [handoffState, setHandoffState] = useState<HandoffState>('static')
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const handoffRef = useRef<HTMLDivElement>(null)
  const activeIndex = lifecycleStages.findIndex(
    (stage) => stage.id === activeStageId,
  )
  const activeStage = lifecycleStages[activeIndex]
  const panelId = `lifecycle-panel-${instanceId}`
  const highlightedStageIds = previewStageId
    ? [activeStageId, previewStageId]
    : undefined

  useEffect(() => {
    const mediaQuery = window.matchMedia(mobileMediaQuery)
    const synchronizeOrientation = () => setIsMobile(mediaQuery.matches)

    synchronizeOrientation()
    mediaQuery.addEventListener('change', synchronizeOrientation)

    return () => {
      mediaQuery.removeEventListener('change', synchronizeOrientation)
    }
  }, [])

  useEffect(() => {
    const handoff = handoffRef.current
    if (!handoff || window.matchMedia(reducedMotionMediaQuery).matches) return

    let completed = false
    setHandoffState('armed')

    const observer = new IntersectionObserver((entries) => {
      if (completed || !entries.some((entry) => entry.isIntersecting)) return

      completed = true
      setHandoffState('complete')
      observer.disconnect()
    }, {
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.2,
    })

    observer.observe(handoff)

    return () => observer.disconnect()
  }, [])

  const commitStage = (stage: LifecycleStage, index: number, focus = false) => {
    setActiveStageId(stage.id)
    setPreviewStageId(null)
    if (focus) {
      tabsRef.current[index]?.focus()
    }
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null

    if (nextKeys.has(event.key)) {
      nextIndex = (index + 1) % lifecycleStages.length
    } else if (previousKeys.has(event.key)) {
      nextIndex =
        (index - 1 + lifecycleStages.length) % lifecycleStages.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = lifecycleStages.length - 1
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      commitStage(lifecycleStages[index], index)
      return
    }

    if (nextIndex === null) return

    event.preventDefault()
    commitStage(lifecycleStages[nextIndex], nextIndex, true)
  }

  return (
    <section
      id="system-trace"
      className={styles.systemTrace}
      data-color-field="mineral"
      aria-labelledby={`system-trace-title-${instanceId}`}
    >
      <div className={styles.traceLayout}>
        <div className={styles.tracePrelude}>
          <div
            ref={handoffRef}
            className={styles.systemHandoff}
            data-system-handoff
            data-handoff-state={handoffState}
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 1200 360"
              preserveAspectRatio="none"
              focusable="false"
            >
              <path
                className={`${styles.systemHandoffRoute} ${styles.systemHandoffRouteDesktop}`}
                d="M 920 0 C 920 72, 858 104, 780 128 C 640 172, 600 286, 420 320 C 252 350, 90 354, 0 360"
                pathLength="1"
                vectorEffect="non-scaling-stroke"
              />
              <path
                className={`${styles.systemHandoffRoute} ${styles.systemHandoffRouteMobile}`}
                d="M 920 0 C 920 90, 820 112, 730 142 C 520 212, 390 304, 12 360"
                pathLength="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <header className={styles.traceHeader}>
            <p className={styles.traceKicker}>Trade lifecycle</p>
            <h2
              id={`system-trace-title-${instanceId}`}
              className={styles.traceTitle}
            >
              {homepageContent.systemTrace.title}
            </h2>
            <p className={styles.traceIntroduction}>
              {homepageContent.systemTrace.body}
            </p>
          </header>
        </div>

        <div className={styles.traceCanvas}>
          <SignalNetwork
            activeStageId={activeStageId}
            highlightedStageIds={highlightedStageIds}
            renderMode="path"
            className={styles.traceSystemNetwork}
          />

          <div
            className={styles.traceTablist}
            role="tablist"
            aria-label="Trade lifecycle stages"
            aria-orientation={isMobile ? 'vertical' : 'horizontal'}
            onMouseLeave={() => setPreviewStageId(null)}
          >
            {lifecycleStages.map((stage, index) => {
              const isActive = stage.id === activeStageId
              const isPreview = stage.id === previewStageId
              const tabId = `lifecycle-tab-${stage.id}-${instanceId}`

              return (
                <div
                  key={stage.id}
                  className={styles.traceStage}
                  role="presentation"
                  data-trace-stage={stage.id}
                >
                  <span
                    className={styles.traceMobileRoute}
                    data-mobile-route-stage={stage.id}
                    data-stage-id={stage.id}
                    data-traced={index <= activeIndex ? 'true' : undefined}
                    aria-hidden="true"
                  >
                    <span
                      className={styles.traceMobileNode}
                      data-mobile-route-node={stage.id}
                      data-stage-id={stage.id}
                      data-active={isActive ? 'true' : undefined}
                      data-preview={isPreview ? 'true' : undefined}
                    />
                  </span>
                  <button
                    ref={(node) => {
                      tabsRef.current[index] = node
                    }}
                    id={tabId}
                    className={styles.traceStageButton}
                    type="button"
                    role="tab"
                    aria-label={stage.label}
                    aria-selected={isActive}
                    aria-controls={panelId}
                    tabIndex={isActive ? 0 : -1}
                    data-stage-id={stage.id}
                    data-preview={isPreview ? 'true' : undefined}
                    onClick={() => commitStage(stage, index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    onMouseEnter={() => setPreviewStageId(stage.id)}
                    onMouseLeave={() => setPreviewStageId(null)}
                  >
                    <span className={styles.traceStageIndex} aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={styles.traceStageLabel}>{stage.label}</span>
                  </button>

                  {isActive ? (
                    <div
                      id={panelId}
                      className={styles.traceDetail}
                      role="tabpanel"
                      aria-labelledby={tabId}
                      tabIndex={0}
                    >
                      <p className={styles.traceDetailLabel}>{activeStage.label}</p>
                      <p className={styles.traceDetailNarrative}>
                        {activeStage.narrative}
                      </p>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <noscript>
        <ol className={styles.traceFallback}>
          {lifecycleStages.map((stage) => (
            <li key={stage.id}>
              <strong>{stage.label}</strong>
              <p>{stage.narrative}</p>
            </li>
          ))}
        </ol>
      </noscript>
    </section>
  )
}
