'use client'

import { useId, useState } from 'react'
import { Eyebrow } from '@/components/site'
import {
  calypsoProgramFamilies,
  calypsoProgramsIntro,
  pad2,
  type CalypsoProgramFamily,
} from '@/lib/calypso-content'
import { DomainStrip } from './domain-strip'
import styles from './calypso-programs.module.css'

/* Programs are numbered 01 to 08 across the three families. */
const offsets = calypsoProgramFamilies.reduce<number[]>((acc, fam, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + calypsoProgramFamilies[i - 1].programs.length)
  return acc
}, [])

type FamilyId = CalypsoProgramFamily['id']

/*
 * Eight programs in three families (04-programs-desk / 03-programs-m-ph).
 * Desktop and tablet: one raised card, three columns, each column an
 * accordion whose first program starts open. Phone: the families themselves
 * are the accordion (dark headers, the first open), and each program's note
 * is clamped to two lines with a "Read more" that opens it in place.
 */
export function CalypsoPrograms() {
  const uid = useId()
  const [deskOpen, setDeskOpen] = useState<Record<FamilyId, number | null>>({
    earnings: 0,
    delivery: 0,
    capital: 0,
  })
  const [family, setFamily] = useState<FamilyId | null>('earnings')
  const [readMore, setReadMore] = useState<ReadonlySet<number>>(new Set())

  const toggleDesk = (id: FamilyId, index: number) =>
    setDeskOpen((prev) => ({ ...prev, [id]: prev[id] === index ? null : index }))

  const toggleRead = (n: number) =>
    setReadMore((prev) => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })

  return (
    <div className={styles.cd}>
      <Eyebrow>{calypsoProgramsIntro.eyebrow}</Eyebrow>
      <h2 id="programs-title" className={`d ${styles.h2}`}>
        {calypsoProgramsIntro.lead} <span className="s">{calypsoProgramsIntro.turn}</span>
      </h2>

      {/* Desktop and tablet */}
      <div className={styles.g} data-testid="programs-desk">
        {calypsoProgramFamilies.map((fam, f) => (
          <div key={fam.id} className={styles.col}>
            <div className={styles.hd}>
              <small>{fam.programs.length} PROGRAMS</small>
              <h3>{fam.title}</h3>
              <span>{fam.note}</span>
            </div>
            <div className={styles.acc}>
              {fam.programs.map((program, i) => {
                const n = offsets[f] + i + 1
                const open = deskOpen[fam.id] === i
                const id = `${uid}-d${n}`
                return (
                  <div key={program.title} className={`${styles.it} ${open ? styles.on : ''}`}>
                    <h4 className={styles.ith}>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={id}
                        id={`${id}-b`}
                        onClick={() => toggleDesk(fam.id, i)}
                      >
                        <span className={`m ${styles.idx}`}>{pad2(n)}</span>
                        <b>{program.title}</b>
                        <span className={styles.pl} aria-hidden="true">
                          +
                        </span>
                      </button>
                    </h4>
                    <div className={styles.bd} id={id} role="region" aria-labelledby={`${id}-b`} inert={!open}>
                      <div>
                        <div className={styles.in}>
                          <p>{program.body}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Phone */}
      <div className={styles.fm} data-testid="programs-phone">
        {calypsoProgramFamilies.map((fam, f) => {
          const open = family === fam.id
          const id = `${uid}-f${fam.id}`
          return (
            <div key={fam.id} className={`${styles.fit} ${open ? styles.on : ''}`}>
              <h3 className={styles.fh}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={id}
                  id={`${id}-b`}
                  onClick={() => setFamily(open ? null : fam.id)}
                >
                  <span>
                    <small>{fam.programs.length} PROGRAMS</small>
                    <b>{fam.title}</b>
                  </span>
                  <span className={styles.fpl} aria-hidden="true">
                    +
                  </span>
                </button>
              </h3>
              <div className={styles.bdy} id={id} role="region" aria-labelledby={`${id}-b`} inert={!open}>
                <div>
                  {fam.programs.map((program, i) => {
                    const n = offsets[f] + i + 1
                    const expanded = readMore.has(n)
                    return (
                      <div
                        key={program.title}
                        className={`${styles.pg} ${expanded ? styles.x : ''}`}
                        onClick={() => toggleRead(n)}
                      >
                        <span className={`m ${styles.pidx}`}>{pad2(n)}</span>
                        <h4>{program.title}</h4>
                        <p id={`${id}-p${n}`}>{program.body}</p>
                        <button
                          type="button"
                          className={styles.more}
                          aria-expanded={expanded}
                          aria-controls={`${id}-p${n}`}
                        >
                          Read more
                          <span className={styles.sr}> about {program.title}</span>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <DomainStrip />
    </div>
  )
}
