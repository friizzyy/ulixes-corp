import Link from 'next/link'
import {
  Cascade,
  CascadeItem,
  Curtain,
  Lift,
  Rule,
} from '@/components/motion/editorial-motion'
import { ArrowRight, ArrowUpRight } from '@/components/ui/icons'
import { siteConfig } from '@/lib/content'
import type { LegalSection } from './legal-sections'
import styles from './legal.module.css'

/*
 * Privacy and terms, built on the editorial system.
 *
 * The register is the homepage's: rule-and-caps eyebrow, Archivo title on the
 * shared rail, and the clauses as one raised numbered ledger rather than a
 * column of headings beside a glass table of contents. Four clauses do not
 * need a table of contents; every clause keeps its id so a link can still
 * land on it.
 *
 * `reader` is the phone and tablet composition, opted into per route rather
 * than applied to both. At 896px and up the ledger is a scan: three columns,
 * every clause legible at a glance. Below that it is a read, and a read wants
 * what a scan does not, so the reader adds a contents register above the
 * clauses, a clause head that carries its own hairline instead of leaning on
 * a shared divider, and a close that is a panel with a way back to the top.
 * Each of those elements is hidden again at 896px, and nothing the reader
 * changes about the clauses themselves survives past 895px, so the desktop
 * composition is the one it replaced.
 *
 * The motion is the shared editorial vocabulary, one gesture per job: Curtain
 * uncovers the title, Rule draws the line that closes the masthead, Cascade
 * deals the contents rows in reading order, and Lift settles the two
 * surfaces. All four resolve to the resting layout, so a reader who prefers
 * reduced motion, and a route that never opts in, see the same page.
 */

export interface LegalCrossLink {
  label: string
  href: string
}

export interface LegalPageProps {
  eyebrow: string
  title: string
  updated: string
  sections: readonly LegalSection[]
  cross: LegalCrossLink
  /** The line above the contact links. */
  closing?: string
  /** Address for the mailto link. Defaults to the site address. */
  email?: string
  /** Opt into the mobile reading composition and the editorial motion. */
  reader?: boolean
}

const TITLE_ID = 'legal-title'
const TOP_ID = 'legal-top'

function ordinal(index: number): string {
  return String(index + 1).padStart(2, '0')
}

export function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
  cross,
  closing = 'Questions about this page? Write directly.',
  email = siteConfig.email,
  reader = false,
}: LegalPageProps) {
  const heading = (
    <h1 id={TITLE_ID} className={styles.title}>
      {title}
    </h1>
  )

  const clauses = sections.map((section, index) => (
    <div key={section.id} id={section.id} className={styles.clause}>
      <span className={styles.clauseIndex}>{ordinal(index)}</span>
      <h2 className={styles.clauseTitle}>{section.title}</h2>
      <p className={styles.clauseBody}>{section.body}</p>
    </div>
  ))

  const close = (
    <section
      className={styles.closing}
      aria-label="Questions and related documents"
    >
      {reader ? <p className={styles.closeLabel}>Contact</p> : null}
      <p className={styles.closingNote}>{closing}</p>
      <div className={styles.closingLinks}>
        <a href={`mailto:${email}`} className={styles.textLink}>
          {email}
          <ArrowUpRight size={16} />
        </a>
        <Link href={cross.href} className={styles.textLink}>
          {cross.label}
          <ArrowRight size={16} />
        </Link>
        {reader ? (
          <a
            href={`#${TOP_ID}`}
            className={`${styles.textLink} ${styles.topLink}`}
          >
            Back to top
            <ArrowRight size={16} className={styles.topArrow} />
          </a>
        ) : null}
      </div>
    </section>
  )

  return (
    <div
      id={reader ? TOP_ID : undefined}
      className={styles.page}
      data-surface="editorial"
      data-reader={reader ? 'true' : undefined}
    >
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          {reader ? (
            <Curtain className="ed-curtain">{heading}</Curtain>
          ) : (
            heading
          )}
          <p className={styles.updated}>
            <span>Last updated</span>
            <span className={styles.updatedValue}>{updated}</span>
          </p>
          {reader ? <Rule className={styles.headerRule} /> : null}
        </header>

        {reader ? (
          <nav className={styles.contents} aria-label="Policy contents">
            <p className={styles.contentsLabel}>Contents</p>
            <Cascade as="ol" className={styles.contentsList} amount={0.1}>
              {sections.map((section, index) => (
                <CascadeItem key={section.id} className={styles.contentsItem}>
                  <a className={styles.contentsLink} href={`#${section.id}`}>
                    <span className={styles.contentsNumber}>
                      {ordinal(index)}
                    </span>
                    <span className={styles.contentsTitle}>
                      {section.title}
                    </span>
                    <ArrowRight size={14} className={styles.contentsArrow} />
                  </a>
                </CascadeItem>
              ))}
            </Cascade>
          </nav>
        ) : null}

        <section className={styles.clauses} aria-labelledby={TITLE_ID}>
          {reader ? (
            <Lift className={styles.ledger} amount={0.04}>
              {clauses}
            </Lift>
          ) : (
            <div className={styles.ledger}>{clauses}</div>
          )}
        </section>

        {reader ? (
          <Lift className={styles.closingLift} amount={0.12}>
            {close}
          </Lift>
        ) : (
          close
        )}
      </div>
    </div>
  )
}
