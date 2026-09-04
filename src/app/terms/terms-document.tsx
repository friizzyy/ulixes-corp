'use client'

import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from '@/components/ui/icons'
import {
  Cascade,
  CascadeItem,
  Curtain,
  Lift,
  Rule,
} from '@/components/motion/editorial-motion'
import type { LegalSection } from '@/components/legal'
import styles from './terms.module.css'

/*
 * The terms document.
 *
 * Desktop is the shared legal register unchanged: rule-and-caps eyebrow,
 * Archivo title on the shared rail, and the clauses as one raised numbered
 * ledger. Everything new here is composition below 896px.
 *
 * The phone version used to be the desktop ledger with its panel switched
 * off: a title, one metadata line, then four clauses separated by hairlines
 * and no way to move between them. A legal page is read in fragments, so the
 * mobile composition gives it the parts a printed instrument has. A two cell
 * masthead strip carries the facts a reader checks first. A contents register
 * in the footer's own 2x2 route grid lets a reader jump to the clause they
 * came for. Each clause hangs its number beside the title rather than above
 * it, so the ledger reads as numbered prose rather than as a stack of
 * captions. The close is a raised panel rather than a hairline and a pair of
 * links, and it ends with a way back to the top.
 *
 * This page owns its own stylesheet rather than sharing the legal module,
 * which is what keeps the desktop composition byte-identical while the
 * mobile one is rebuilt.
 */

export interface TermsCrossLink {
  label: string
  href: string
}

export interface TermsDocumentProps {
  eyebrow: string
  title: string
  updated: string
  sections: readonly LegalSection[]
  cross: TermsCrossLink
  closing: string
  email: string
}

const TITLE_ID = 'terms-title'

/* Four clauses read better spelled out than as a digit beside a caps label. */
const COUNT_WORDS = [
  'None',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
]

function countWord(total: number): string {
  return COUNT_WORDS[total] ?? String(total)
}

function ordinal(index: number): string {
  return String(index + 1).padStart(2, '0')
}

/* The one glyph the shared icon set does not carry. Inline so the set stays
   the shared one and this page does not widen it for a single arrow. */
function ArrowUp({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  )
}

export function TermsDocument({
  eyebrow,
  title,
  updated,
  sections,
  cross,
  closing,
  email,
}: TermsDocumentProps) {
  return (
    <div className={styles.page} data-surface="editorial">
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <Curtain className={`ed-curtain ${styles.titleMask}`} delay={0.05}>
            <h1 id={TITLE_ID} className={styles.title}>
              {title}
            </h1>
          </Curtain>

          <dl className={styles.meta}>
            <div className={styles.metaCell}>
              <dt className={styles.metaLabel}>Last updated</dt>
              <dd className={styles.metaValue}>{updated}</dd>
            </div>
            <div className={`${styles.metaCell} ${styles.metaCount}`}>
              <dt className={styles.metaLabel}>Clauses</dt>
              <dd className={styles.metaValue}>{countWord(sections.length)}</dd>
            </div>
          </dl>

          <Rule className={styles.headerRule} delay={0.18} />
        </header>

        {/* Mobile wayfinding. Hidden at 896px and above, where all four
            clauses are already in view inside the ledger panel. */}
        <nav className={styles.index} aria-label="Clauses">
          <p className={styles.indexLabel}>Contents</p>
          <Cascade as="ol" className={styles.indexList} amount={0.2}>
            {sections.map((section, index) => (
              <CascadeItem key={section.id} className={styles.indexItem}>
                <a href={`#${section.id}`} className={styles.indexLink}>
                  <span className={styles.indexTitle}>{section.title}</span>
                  <span className={styles.indexNumber} aria-hidden="true">
                    {ordinal(index)}
                  </span>
                </a>
              </CascadeItem>
            ))}
          </Cascade>
        </nav>

        <section className={styles.clauses} aria-labelledby={TITLE_ID}>
          <Lift className={styles.ledger} amount={0.04}>
            {sections.map((section, index) => (
              <div key={section.id} id={section.id} className={styles.clause}>
                <span className={styles.clauseIndex}>{ordinal(index)}</span>
                <h2 className={styles.clauseTitle}>{section.title}</h2>
                <p className={styles.clauseBody}>{section.body}</p>
              </div>
            ))}
          </Lift>
        </section>

        <section
          className={styles.closing}
          aria-label="Questions and related documents"
        >
          <Lift className={styles.closingPanel} amount={0.1} delay={0.05}>
            <p className={styles.closingLabel}>Contact</p>
            <p className={styles.closingNote}>{closing}</p>
            <div className={styles.closingLinks}>
              <a href={`mailto:${email}`} className={styles.textLink}>
                {email}
                <ArrowUpRight size={16} />
              </a>
              <Link
                href={cross.href}
                className={`${styles.textLink} ${styles.crossLink}`}
              >
                {cross.label}
                <ArrowRight size={16} />
              </Link>
            </div>
          </Lift>

          <a href={`#${TITLE_ID}`} className={styles.toTop}>
            <ArrowUp />
            Back to top
          </a>
        </section>
      </div>
    </div>
  )
}
