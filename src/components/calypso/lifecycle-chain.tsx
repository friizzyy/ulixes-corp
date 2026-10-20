'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Eyebrow, GLIDE_DELAY_MS, SlabButton, glideTo } from '@/components/site'
import { calypsoLifecycle, calypsoOffices, calypsoStages, pad2 } from '@/lib/calypso-content'
import styles from './lifecycle-chain.module.css'

const LAST = calypsoStages.length - 1

/** Where the "Discuss this stage" action lands: the contact form prefills from ?program=. */
export function stageHref(index: number) {
  const name = calypsoStages[index]?.name ?? calypsoStages[0].name
  return `/contact?program=${encodeURIComponent(`Calypso ${name.toLowerCase()} stage`)}`
}

function activate(event: KeyboardEvent<HTMLElement>, run: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    run()
  }
}

/*
 * The seven-stage lifecycle (03-blotter-desk / 02-blotter-m-ph). Choosing a
 * stage "breaks" it: that stage turns ink, every later stage is marked as
 * inheriting the break, and the read-out says how many stages inherit it and
 * where the chosen stage breaks. Desktop and tablet draw the seven cards in a
 * row under the three office bands; the phone draws them as a swipe rail with
 * progress marks. Both read the same state.
 */
export function LifecycleChain() {
  const [broken, setBroken] = useState(0)
  const [visible, setVisible] = useState(0)
  const rail = useRef<HTMLDivElement>(null)
  const desk = useRef<HTMLDivElement>(null)
  const phone = useRef<HTMLDivElement>(null)
  const inherit = LAST - broken
  const stage = calypsoStages[broken]

  const onRailScroll = useCallback(() => {
    const el = rail.current
    const first = el?.firstElementChild as HTMLElement | null
    if (!el || !first) return
    const step = first.offsetWidth + 10
    const index = Math.min(LAST, Math.max(0, Math.round(el.scrollLeft / step)))
    setVisible(index)
  }, [])

  /*
   * Arriving from the home band (/nasdaq-calypso?stage=collateral)
   * opens the chain already broken at that stage, and on the phone the rail
   * starts on its card. The slug is the stage name, lower-cased and hyphened,
   * the same form the home band writes.
   */
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('stage')
    if (!wanted) return
    const index = calypsoStages.findIndex((s) => s.name.toLowerCase().replace(/\s+/g, '-') === wanted)
    if (index < 0) return
    setBroken(index)
    setVisible(index)
    const el = rail.current
    const card = el?.children[index] as HTMLElement | undefined
    if (el && card) el.scrollLeft = card.offsetLeft - (el.firstElementChild as HTMLElement).offsetLeft
    /* Then glide the chain (whichever layout is showing) to the middle of the screen. */
    const view = [desk.current, phone.current].find((v) => v && v.offsetParent)
    if (!view) return
    const timer = window.setTimeout(() => glideTo(view), GLIDE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [])

  const state = (j: number) => (j === broken ? 'broken' : j > broken ? 'inherits' : 'clear')

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <Eyebrow centred>{calypsoLifecycle.eyebrow}</Eyebrow>
        <h2 id="lifecycle-title" className={`d ${styles.h2}`}>
          {calypsoLifecycle.lead} <span className="s">{calypsoLifecycle.turn}</span>
        </h2>
        <p className={styles.l}>{calypsoLifecycle.prompt}</p>
        <p className={styles.ln} aria-live="polite">
          <span>{calypsoLifecycle.promptPhone}</span>
          <span>
            <b>{inherit}</b> later {inherit === 1 ? 'stage inherits' : 'stages inherit'} it
          </span>
        </p>
      </div>

      {/* Desktop and tablet */}
      <div ref={desk} className={styles.desk} data-testid="lifecycle-desk">
        <div className={styles.bands} aria-hidden="true">
          {calypsoOffices.map((office) => (
            <span key={office}>{office.toUpperCase()}</span>
          ))}
        </div>
        <ol className={styles.ch} aria-label="The seven lifecycle stages">
          {calypsoStages.map((s, j) => {
            const st = state(j)
            return (
              <li key={s.name} className={styles.li}>
                <div
                  role="button"
                  tabIndex={0}
                  aria-pressed={j === broken}
                  data-state={st}
                  className={`${styles.cd} ${st === 'broken' ? styles.br : ''} ${st === 'inherits' ? styles.dn : ''}`}
                  onClick={() => setBroken(j)}
                  onKeyDown={(e) => activate(e, () => setBroken(j))}
                >
                  <span className={`m ${styles.idx}`}>
                    {pad2(j + 1)}
                    <span className={styles.off}> · {s.office}</span>
                  </span>
                  <b className={styles.name}>{s.name}</b>
                  <p className={styles.does}>{s.does}</p>
                  <span className={styles.ih}>
                    {st === 'broken' ? 'The break starts here' : st === 'inherits' ? 'Inherits the break' : ''}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
        <div className={styles.rd}>
          <div className={styles.ct}>
            <span data-testid="lifecycle-count">{inherit}</span>
            <small>{inherit === 1 ? 'STAGE INHERITS IT' : 'STAGES INHERIT IT'}</small>
          </div>
          <p className={styles.wb} aria-live="polite" data-testid="lifecycle-readout">
            <small>WHERE {stage.name.toUpperCase()} BREAKS</small>
            {stage.breaks}
          </p>
          <SlabButton href={stageHref(broken)} variant="light">
            {calypsoLifecycle.cta}
          </SlabButton>
        </div>
      </div>

      {/* Phone */}
      <div ref={phone} className={styles.phone} data-testid="lifecycle-phone">
        <div
          className={styles.rl}
          ref={rail}
          onScroll={onRailScroll}
          role="group"
          aria-label="The seven lifecycle stages"
        >
          {calypsoStages.map((s, j) => {
            const st = state(j)
            return (
              <div
                key={s.name}
                role="button"
                tabIndex={0}
                aria-pressed={j === broken}
                data-state={st}
                className={`${styles.pcd} ${st === 'broken' ? styles.br : ''} ${st === 'inherits' ? styles.dn : ''}`}
                onClick={() => setBroken(j)}
                onKeyDown={(e) => activate(e, () => setBroken(j))}
              >
                <div className={styles.k}>
                  <span>
                    {pad2(j + 1)} · {s.office}
                  </span>
                  <span className={styles.tg}>{st === 'broken' ? 'Break' : st === 'inherits' ? 'Inherits' : ''}</span>
                </div>
                <b className={styles.pname}>{s.name}</b>
                <p className={styles.pdoes}>{s.does}</p>
                <div className={styles.w}>
                  <small>WHERE IT BREAKS</small>
                  {s.breaks}
                </div>
              </div>
            )
          })}
        </div>
        <div className={styles.pr} aria-hidden="true">
          {calypsoStages.map((s, j) => (
            <i key={s.name} className={j === visible ? styles.on : undefined} />
          ))}
        </div>
      </div>
    </div>
  )
}
