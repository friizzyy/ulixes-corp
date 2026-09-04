import Link from 'next/link'
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
}

const TITLE_ID = 'legal-title'

export function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
  cross,
  closing = 'Questions about this page? Write directly.',
  email = siteConfig.email,
}: LegalPageProps) {
  return (
    <div className={styles.page} data-surface="editorial">
      <div className={styles.shell}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 id={TITLE_ID} className={styles.title}>
            {title}
          </h1>
          <p className={styles.updated}>
            <span>Last updated</span>
            <span className={styles.updatedValue}>{updated}</span>
          </p>
        </header>

        <section className={styles.clauses} aria-labelledby={TITLE_ID}>
          <div className={styles.ledger}>
            {sections.map((section, index) => (
              <div key={section.id} id={section.id} className={styles.clause}>
                <span className={styles.clauseIndex}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className={styles.clauseTitle}>{section.title}</h2>
                <p className={styles.clauseBody}>{section.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className={styles.closing}
          aria-label="Questions and related documents"
        >
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
          </div>
        </section>
      </div>
    </div>
  )
}
