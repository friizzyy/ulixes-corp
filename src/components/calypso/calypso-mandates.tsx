'use client'

import { useId, useState } from 'react'
import { Eyebrow } from '@/components/site'
import { calypsoMandates, calypsoMandatesIntro, pad2 } from '@/lib/calypso-content'
import styles from './calypso-mandates.module.css'

/*
 * The four mandate shapes (05-mandates-desk / 04-mandates-m-ph). Desktop and
 * tablet: heading and lede split over a four-card grid. Phone: one card
 * holding an accordion, the first shape open.
 */
export function CalypsoMandates() {
  const uid = useId()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <>
      <div className={styles.tp}>
        <div>
          <Eyebrow>{calypsoMandatesIntro.eyebrow}</Eyebrow>
          <h2 id="mandates-title" className={`d ${styles.h2}`}>
            {calypsoMandatesIntro.lead} <span className="s">{calypsoMandatesIntro.turn}</span>
          </h2>
        </div>
        <p className={styles.lede}>{calypsoMandatesIntro.body}</p>
      </div>

      <ol className={styles.g} data-testid="mandates-desk" aria-label="Calypso mandate shapes">
        {calypsoMandates.map((m, i) => (
          <li key={m.title}>
            <span className={styles.n} aria-hidden="true">
              {pad2(i + 1)}
            </span>
            <h3>{m.title}</h3>
            <small>{m.scope}</small>
            <p>{m.risk}</p>
          </li>
        ))}
      </ol>

      <div className={styles.cw} data-testid="mandates-phone">
        {calypsoMandates.map((m, i) => {
          const on = open === i
          const id = `${uid}-m${i}`
          return (
            <div key={m.title} className={`${styles.it} ${on ? styles.on : ''}`}>
              <h3 className={styles.ith}>
                <button
                  type="button"
                  id={`${id}-b`}
                  aria-expanded={on}
                  aria-controls={id}
                  onClick={() => setOpen(on ? null : i)}
                >
                  <span className={`m ${styles.idx}`}>{pad2(i + 1)}</span>
                  <b>
                    {m.title}
                    <small>{m.scope}</small>
                  </b>
                  <span className={styles.pl} aria-hidden="true">
                    +
                  </span>
                </button>
              </h3>
              <div className={styles.bd} id={id} role="region" aria-labelledby={`${id}-b`} inert={!on}>
                <div>
                  <div className={styles.in}>
                    <p>{m.risk}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
