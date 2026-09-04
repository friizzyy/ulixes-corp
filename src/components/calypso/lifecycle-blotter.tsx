'use client'

import {
  type CSSProperties,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { usePrefersReducedMotion } from '@/hooks'
import { calypsoContent } from '@/lib/calypso-content'
import { chainStages, type ChainStageId } from '@/lib/expertise-content'
import styles from './lifecycle-blotter.module.css'
import {
  lifecycleStageChangeEvent,
  MobileLifecyclePager,
} from './mobile-lifecycle-pager'

const lifecycleWideQuery = '(min-width: 896px)'
const { schematic } = calypsoContent

type Band = (typeof schematic.bands)[number]
type Direction = 'forward' | 'backward'

const stageOrder: readonly ChainStageId[] = chainStages.map((stage) => stage.id)

const materialOf: Record<Band['id'], 'steel' | 'sage' | 'clay'> = {
  front: 'steel',
  middle: 'sage',
  back: 'clay',
}

const pad = (value: number) => String(value).padStart(2, '0')

const bandOf = (stageId: ChainStageId): Band | undefined =>
  schematic.bands.find((band) => {
    const from = stageOrder.indexOf(band.span.from)
    const to = stageOrder.indexOf(band.span.to)
    const stage = stageOrder.indexOf(stageId)

    return stage >= from && stage <= to
  })

function useLifecycleOrientation(): 'horizontal' | 'vertical' {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal',
  )

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const media = window.matchMedia(lifecycleWideQuery)
    const sync = () => setOrientation(media.matches ? 'vertical' : 'horizontal')
    sync()
    media.addEventListener?.('change', sync)
    return () => media.removeEventListener?.('change', sync)
  }, [])

  return orientation
}

const ledeClose = 'decided.'
const ledeEnd = schematic.body.indexOf(ledeClose)
const lede =
  ledeEnd === -1
    ? schematic.body
    : schematic.body.slice(0, ledeEnd + ledeClose.length)

export function LifecycleBlotter() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState<Direction>('forward')
  const railViewportRef = useRef<HTMLDivElement | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const orientation = useLifecycleOrientation()
  const reduced = usePrefersReducedMotion() === true

  const currentStage = chainStages[active]
  const currentBand = bandOf(currentStage.id)
  const activeMaterial = currentBand ? materialOf[currentBand.id] : 'steel'
  const currentDetail = schematic.stageDetail[currentStage.id]
  const currentLedger = schematic.stageLedger[currentStage.id]

  const revealStageInRail = useCallback(
    (index: number) => {
      const viewport = railViewportRef.current
      const tab = tabRefs.current[index]
      if (!viewport || !tab) return

      const viewportRect = viewport.getBoundingClientRect()
      const tabRect = tab.getBoundingClientRect()
      let delta = 0

      if (tabRect.left < viewportRect.left) {
        delta = tabRect.left - viewportRect.left
      } else if (tabRect.right > viewportRect.right) {
        delta = tabRect.right - viewportRect.right
      }

      if (Math.abs(delta) < 0.5) return

      const left = Math.max(0, viewport.scrollLeft + delta)
      if (typeof viewport.scrollTo === 'function') {
        viewport.scrollTo({
          behavior: reduced ? 'instant' : 'smooth',
          left,
        })
      } else {
        viewport.scrollLeft = left
      }
    },
    [reduced],
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    const restoreFromUrl = (restoreFocus = false) => {
      const requestedStage = new URLSearchParams(window.location.search).get(
        'stage',
      )
      const requestedIndex = stageOrder.indexOf(
        requestedStage as ChainStageId,
      )
      const index = requestedIndex === -1 ? 0 : requestedIndex
      const focusWasInRail = tabRefs.current.includes(
        document.activeElement as HTMLButtonElement,
      )

      setActive((previous) => {
        if (index === previous) return previous
        setDirection(index > previous ? 'forward' : 'backward')
        return index
      })

      if (restoreFocus && focusWasInRail) tabRefs.current[index]?.focus()
    }

    const onPopState = () => restoreFromUrl(true)
    const onStageChange = () => restoreFromUrl(true)
    restoreFromUrl()
    window.addEventListener('popstate', onPopState)
    window.addEventListener(lifecycleStageChangeEvent, onStageChange)
    return () => {
      window.removeEventListener('popstate', onPopState)
      window.removeEventListener(lifecycleStageChangeEvent, onStageChange)
    }
  }, [])

  useEffect(() => {
    if (orientation === 'horizontal') revealStageInRail(active)
  }, [active, orientation, revealStageInRail])

  const select = (requestedIndex: number, focus = false) => {
    const index = Math.min(Math.max(requestedIndex, 0), chainStages.length - 1)

    if (index !== active) {
      setDirection(index > active ? 'forward' : 'backward')
      setActive(index)

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.set('stage', stageOrder[index])
        window.history.pushState(
          window.history.state,
          '',
          url.pathname + url.search + url.hash,
        )
        window.dispatchEvent(new Event(lifecycleStageChangeEvent))
      }
    }

    const tab = tabRefs.current[index]
    if (focus) tab?.focus()
    if (index === active && orientation === 'horizontal') {
      revealStageInRail(index)
    }
  }

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const last = chainStages.length - 1
    let next: number | null = null

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      next = Math.min(index + 1, last)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      next = Math.max(index - 1, 0)
    } else if (event.key === 'Home') {
      next = 0
    } else if (event.key === 'End') {
      next = last
    }

    if (next === null) return
    event.preventDefault()
    select(next, true)
  }

  return (
    <section
      id="lifecycle"
      className={styles.section}
      aria-labelledby="lifecycle-title"
      data-testid="lifecycle-blotter"
    >
      <div className={styles.shell}>
        <header className={styles.intro}>
          <div>
            <p className={styles.eyebrow}>{schematic.eyebrow}</p>
            <h2 id="lifecycle-title" className={styles.title}>
              {schematic.headlineLead}{' '}
              <em className={styles.turn}>{schematic.headlineTurn}</em>
            </h2>
          </div>
          <p className={styles.lede}>{lede}</p>
        </header>

        <MobileLifecyclePager stages={chainStages} schematic={schematic} />

        <div
          className={`${styles.workbench} ${styles.desktopWorkbench}`}
          data-direction={direction}
          data-lifecycle-composition="desktop"
          data-visible-from="896px"
        >
          <div ref={railViewportRef} className={styles.railViewport}>
            <div
              className={styles.stageRail}
              role="tablist"
              aria-label="Trade lifecycle, stage by stage"
              aria-orientation={orientation}
              data-material={activeMaterial}
              style={{ '--active-index': active } as CSSProperties}
            >
              <span className={styles.activeBridge} aria-hidden="true" />
              {chainStages.map((stage, index) => {
                const band = bandOf(stage.id)
                const detail = schematic.stageDetail[stage.id]
                const isActive = index === active
                const office = band?.label ?? 'Front office'
                const material = band ? materialOf[band.id] : 'steel'

                return (
                  <button
                    key={stage.id}
                    ref={(node) => {
                      tabRefs.current[index] = node
                    }}
                    type="button"
                    role="tab"
                    id={'lifecycle-stage-tab-' + stage.id}
                    aria-label={
                      pad(index + 1) +
                      '. ' +
                      stage.label +
                      '. ' +
                      office +
                      '. ' +
                      detail.breaks
                    }
                    aria-selected={isActive}
                    aria-controls="lifecycle-stage-detail"
                    className={styles.stageTab}
                    data-material={material}
                    data-active={isActive ? 'true' : 'false'}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => select(index)}
                    onKeyDown={(event) => onKeyDown(event, index)}
                  >
                    <span className={styles.stageNumber}>{pad(index + 1)}</span>
                    <span className={styles.stageName}>{stage.label}</span>
                    <span className={styles.stageOffice}>{office}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div
            id="lifecycle-stage-detail"
            className={styles.detailPlane}
            role="tabpanel"
            aria-live="polite"
            aria-labelledby={'lifecycle-stage-tab-' + currentStage.id}
            data-material={activeMaterial}
          >
            <div
              key={'heading-' + currentStage.id}
              className={styles.detailHeading}
            >
              <span>{pad(active + 1)}</span>
              <span>{currentStage.label}</span>
              <span>{currentBand?.label}</span>
            </div>

            <div
              key={'evidence-' + currentStage.id}
              className={styles.evidence}
            >
              <div className={styles.evidenceField}>
                <span className={styles.evidenceLabel}>Where it breaks</span>
                <p>{currentDetail.breaks}</p>
              </div>
              <div className={styles.evidenceField}>
                <span className={styles.evidenceLabel}>What happens here</span>
                <p>{currentDetail.does}</p>
              </div>
              <div className={styles.evidenceField}>
                <span className={styles.evidenceLabel}>Built from</span>
                <ul role="list">
                  {currentLedger.objects.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.evidenceField}>
                <span className={styles.evidenceLabel}>Depends on</span>
                <p>{currentLedger.depends}</p>
              </div>
              <div className={styles.evidenceField}>
                <span className={styles.evidenceLabel}>Hands on</span>
                <p>{currentLedger.carries}</p>
              </div>
            </div>

            <div className={styles.detailControls}>
              <button
                type="button"
                className={styles.previousStage}
                onClick={() => select(active - 1)}
                disabled={active === 0}
              >
                Previous stage
              </button>
              <button
                type="button"
                className={styles.nextStage}
                onClick={() => select(active + 1)}
                disabled={active === chainStages.length - 1}
              >
                Next stage
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
