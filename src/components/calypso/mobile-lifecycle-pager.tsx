'use client'

import {
  type CSSProperties,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ArrowLeft, ArrowRight, MobileDetailSheet } from '@/components/ui'
import { usePrefersReducedMotion } from '@/hooks'
import type { ChainStage, ChainStageId } from '@/lib/expertise-content'
import styles from './mobile-lifecycle-pager.module.css'

type LifecycleSchematic = (typeof import('@/lib/calypso-content'))['calypsoContent']['schematic']
type LifecycleBand = LifecycleSchematic['bands'][number]
type Material = 'steel' | 'sage' | 'clay'

export const lifecycleStageChangeEvent = 'ulixes:lifecycle-stage-change'

export type MobileLifecyclePagerProps = {
  stages: readonly ChainStage[]
  schematic: LifecycleSchematic
}

const materialByBand: Record<LifecycleBand['id'], Material> = {
  front: 'steel',
  middle: 'sage',
  back: 'clay',
}

const pad = (value: number) => String(value).padStart(2, '0')

function findBand(
  stageId: ChainStageId,
  stages: readonly ChainStage[],
  bands: LifecycleSchematic['bands'],
) {
  const stageIndex = stages.findIndex((stage) => stage.id === stageId)

  return bands.find((band) => {
    const from = stages.findIndex((stage) => stage.id === band.span.from)
    const to = stages.findIndex((stage) => stage.id === band.span.to)
    return stageIndex >= from && stageIndex <= to
  })
}

export function MobileLifecyclePager({
  stages,
  schematic,
}: MobileLifecyclePagerProps) {
  const instanceId = useId().replace(/:/g, '')
  const stageOrder = useMemo(() => stages.map((stage) => stage.id), [stages])
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const [sheetOpen, setSheetOpen] = useState(false)
  const segmentViewportRef = useRef<HTMLDivElement | null>(null)
  const controlRefs = useRef<Array<HTMLButtonElement | null>>([])
  const reducedMotion = usePrefersReducedMotion() === true
  const activeStage = stages[activeIndex] ?? stages[0]
  const lastIndex = stages.length - 1
  const summaryId = `mobile-lifecycle-${instanceId}-summary`

  const revealStage = useCallback(
    (index: number, requestedBehavior: ScrollBehavior = 'smooth') => {
      const viewport = segmentViewportRef.current
      const control = controlRefs.current[index]
      if (!viewport || !control) return

      const viewportRect = viewport.getBoundingClientRect()
      const controlRect = control.getBoundingClientRect()
      let delta = 0

      if (controlRect.left < viewportRect.left) {
        delta = controlRect.left - viewportRect.left
      } else if (controlRect.right > viewportRect.right) {
        delta = controlRect.right - viewportRect.right
      }

      if (Math.abs(delta) < 0.5) return

      const left = Math.max(0, viewport.scrollLeft + delta)
      const behavior = reducedMotion ? 'auto' : requestedBehavior
      if (typeof viewport.scrollTo === 'function') {
        viewport.scrollTo({ behavior, left })
      } else {
        viewport.scrollLeft = left
      }
    },
    [reducedMotion],
  )

  useEffect(() => {
    const restoreFromUrl = (
      restoreFocus = false,
      revealBehavior: ScrollBehavior = 'auto',
    ) => {
      const requestedStage = new URLSearchParams(window.location.search).get(
        'stage',
      )
      const requestedIndex = stageOrder.indexOf(
        requestedStage as ChainStageId,
      )
      const nextIndex = requestedIndex === -1 ? 0 : requestedIndex
      const focusWasInSelector = controlRefs.current.includes(
        document.activeElement as HTMLButtonElement,
      )

      setActiveIndex((previousIndex) => {
        if (previousIndex !== nextIndex) {
          setDirection(
            nextIndex < previousIndex ? 'backward' : 'forward',
          )
        }
        return nextIndex
      })
      revealStage(nextIndex, revealBehavior)

      if (restoreFocus && focusWasInSelector) {
        controlRefs.current[nextIndex]?.focus()
      }
    }

    const handlePopState = () => restoreFromUrl(true, 'auto')
    const handleStageChange = () => restoreFromUrl(true, 'smooth')
    restoreFromUrl(false, 'auto')
    window.addEventListener('popstate', handlePopState)
    window.addEventListener(lifecycleStageChangeEvent, handleStageChange)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener(lifecycleStageChangeEvent, handleStageChange)
    }
  }, [revealStage, stageOrder])

  useEffect(() => {
    const handleResize = () => revealStage(activeIndex, 'auto')
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [activeIndex, revealStage])

  if (!activeStage) return null

  const activeBand = findBand(activeStage.id, stages, schematic.bands)
  const activeMaterial = activeBand
    ? materialByBand[activeBand.id]
    : 'steel'
  const activeDetail = schematic.stageDetail[activeStage.id]
  const activeLedger = schematic.stageLedger[activeStage.id]

  const selectStage = (nextIndex: number, moveFocus = false) => {
    const boundedIndex = Math.min(Math.max(nextIndex, 0), lastIndex)

    revealStage(boundedIndex, 'smooth')

    if (boundedIndex !== activeIndex) {
      setDirection(boundedIndex < activeIndex ? 'backward' : 'forward')
      setActiveIndex(boundedIndex)

      const url = new URL(window.location.href)
      url.searchParams.set('stage', stageOrder[boundedIndex])
      window.history.pushState(
        window.history.state,
        '',
        url.pathname + url.search + url.hash,
      )
      window.dispatchEvent(new Event(lifecycleStageChangeEvent))
    }

    if (moveFocus) controlRefs.current[boundedIndex]?.focus()
  }

  const handleStageKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
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

    if (nextIndex === undefined) return
    event.preventDefault()
    selectStage(nextIndex, true)
  }

  return (
    <div
      className={styles.pager}
      data-testid="mobile-lifecycle-pager"
      data-visible-through="895px"
      data-material={activeMaterial}
      data-motion={reducedMotion ? 'reduced' : 'standard'}
      style={{ '--active-index': activeIndex } as CSSProperties}
    >
      <div ref={segmentViewportRef} className={styles.segmentViewport}>
        <div
          className={styles.segments}
          role="group"
          aria-label="Select lifecycle stage"
        >
          <span className={styles.activeTrack} aria-hidden="true" />
          {stages.map((stage, index) => {
            const band = findBand(stage.id, stages, schematic.bands)
            const material = band ? materialByBand[band.id] : 'steel'
            const isActive = index === activeIndex

            return (
              <button
                key={stage.id}
                ref={(node) => {
                  controlRefs.current[index] = node
                }}
                type="button"
                className={styles.segment}
                aria-label={`Stage ${index + 1}: ${stage.label} — ${pad(index + 1)}`}
                aria-pressed={isActive}
                aria-controls={summaryId}
                data-material={material}
                onClick={() => selectStage(index)}
                onKeyDown={(event) => handleStageKeyDown(event, index)}
              >
                {pad(index + 1)}
              </button>
            )
          })}
        </div>
      </div>

      <div
        id={summaryId}
        className={styles.summary}
        role="region"
        aria-label="Active lifecycle stage"
        aria-live="polite"
      >
        <article
          key={activeStage.id}
          className={styles.brief}
          data-direction={direction}
        >
          <header className={styles.identity}>
            <p className={styles.position}>
              {pad(activeIndex + 1)} / {pad(stages.length)}
            </p>
            <h3>{activeStage.label}</h3>
            <p className={styles.office}>{activeBand?.label}</p>
          </header>

          <div className={styles.field}>
            <p className={styles.label}>What happens here</p>
            <p className={styles.copy}>{activeDetail.does}</p>
          </div>

          <div className={`${styles.field} ${styles.breakField}`}>
            <p className={styles.label}>Where it breaks</p>
            <p className={styles.breakCopy}>{activeDetail.breaks}</p>
          </div>
        </article>

        <button
          type="button"
          className={styles.detailTrigger}
          onClick={() => setSheetOpen(true)}
        >
          <span>View control detail</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.navigation} aria-label="Browse lifecycle stages">
        <button
          type="button"
          className={styles.navigationControl}
          aria-label="Previous stage"
          onClick={() => selectStage(activeIndex - 1)}
          disabled={activeIndex === 0}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Previous</span>
        </button>
        <button
          type="button"
          className={styles.navigationControl}
          aria-label="Next stage"
          onClick={() => selectStage(activeIndex + 1)}
          disabled={activeIndex === lastIndex}
        >
          <span>Next</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      <MobileDetailSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        eyebrow={`${activeBand?.label ?? 'Lifecycle'} control evidence`}
        title={`${activeStage.label} control detail`}
      >
        <div className={styles.sheetField}>
          <h3>Built from</h3>
          <ul role="list">
            {activeLedger.objects.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className={styles.sheetField}>
          <h3>Depends on</h3>
          <p>{activeLedger.depends}</p>
        </div>
        <div className={styles.sheetField}>
          <h3>Hands on</h3>
          <p>{activeLedger.carries}</p>
        </div>
      </MobileDetailSheet>
    </div>
  )
}
