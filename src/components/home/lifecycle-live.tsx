'use client'

import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { LifecycleStage } from '@/lib/homepage-content'
import { useLiveStage } from './live-stage'
import styles from './calypso.module.css'

/* Lane of each stage (0 front, 1 middle, 2 back) and its y in the 234px plot. */
const LANE_Y = [39, 117, 195] as const
const LANE_OF = { 'Front office': 0, 'Middle office': 1, 'Back office': 2 } as const
export const LIFECYCLE_STEP_MS = 1700

interface LifecycleLiveProps {
  stages: readonly LifecycleStage[]
  lanes: readonly string[]
  label: string
}

/*
 * The live lifecycle: one trade walking its seven stages. Desktop draws the
 * front / middle / back plot (03-calteaser-desk), phone the dotted stepper
 * (03-calteaser-ph); one state drives both and CSS shows one.
 *
 * It advances every 1.7s. Choosing a stage stops the walk there, the LIVE
 * control pauses and resumes it, and under reduced motion it starts paused.
 * The caption is only announced once the visitor is driving it.
 */
export function LifecycleLive({ stages, lanes, label }: LifecycleLiveProps) {
  const reduced = usePrefersReducedMotion()
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState<boolean | null>(null)
  const [announce, setAnnounce] = useState(false)
  /* Until the visitor chooses, playback follows the motion preference. */
  const running = playing ?? reduced === false
  const count = stages.length
  const live = useLiveStage()
  const report = live?.setIndex

  /* Tell the band which stage is showing, so its button can carry it. */
  useEffect(() => {
    report?.(current)
  }, [current, report])

  useEffect(() => {
    if (!running) return
    const id = window.setInterval(() => {
      setCurrent((k) => (k + 1) % count)
    }, LIFECYCLE_STEP_MS)
    return () => window.clearInterval(id)
  }, [running, count])

  const choose = (index: number) => {
    setCurrent(index)
    setPlaying(false)
    setAnnounce(true)
  }

  const toggle = () => {
    setPlaying(!running)
    setAnnounce(true)
  }

  const stage = stages[current] ?? stages[0]
  const points = stages
    .map((s, i) => `${i === 0 ? 'M' : 'L'}${Math.round(((i * 2 + 1) / (count * 2)) * 1000)} ${LANE_Y[LANE_OF[s.office]]}`)
    .join(' ')
  const nodeState = (i: number) => (i === current ? 'on' : i < current ? 'done' : 'next')

  return (
    <div className={styles.live}>
      {/* Desktop and tablet: the three-lane plot. */}
      <div className={styles.dg}>
        <div className={styles.dgTop}>
          <span>{label}</span>
          <button
            type="button"
            className={styles.liveToggle}
            data-live={running ? 'true' : 'false'}
            aria-label={running ? 'Live: pause the lifecycle' : 'Paused: play the lifecycle'}
            onClick={toggle}
          >
            <span className={styles.liveDot} aria-hidden="true" />
            {running ? 'Live' : 'Paused'}
          </button>
        </div>
        <div className={styles.ln}>
          {lanes.map((lane) => (
            <div key={lane} className={styles.lane}>
              <span>{lane}</span>
            </div>
          ))}
          <svg
            className={styles.path}
            viewBox="0 0 1000 234"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d={points} fill="none" stroke="#4a5960" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
          {stages.map((s, i) => (
            <button
              key={s.name}
              type="button"
              className={styles.nd}
              data-state={nodeState(i)}
              style={{
                left: `calc(90px + (100% - 90px) * ${(i * 2 + 1) / (count * 2)})`,
                top: `${LANE_Y[LANE_OF[s.office]]}px`,
              }}
              aria-label={`${s.name}, ${s.office}`}
              aria-current={i === current ? 'step' : undefined}
              onClick={() => choose(i)}
            />
          ))}
        </div>
        <div className={styles.cur} aria-live={announce ? 'polite' : 'off'}>
          <b>{stage.name}</b>
          <span>{stage.does}</span>
        </div>
      </div>

      {/* Phone: the dotted stepper. */}
      <div className={styles.st}>
        {stages.map((s, i) => (
          <span key={s.name} className={styles.stStep}>
            {i > 0 ? <s className={styles.stSeg} aria-hidden="true" /> : null}
            <button
              type="button"
              className={styles.stDot}
              data-state={nodeState(i)}
              aria-label={`${s.name}, ${s.office}`}
              aria-current={i === current ? 'step' : undefined}
              onClick={() => choose(i)}
            />
          </span>
        ))}
      </div>
      <p className={styles.stCur} aria-live={announce ? 'polite' : 'off'}>
        <b>{stage.name}</b>
        {stage.office}
      </p>
    </div>
  )
}
