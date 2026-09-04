import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from '@/components/ui/icons'
import styles from './legal.module.css'

/*
 * Not-found and error, on the same surface as the legal pages: left-set on
 * the rail under the fixed navigation, one dominant action and one ghost
 * link. No numeral, no icon badge, no centring.
 *
 * Shared by a server component (not-found) and a client component (error),
 * so it carries no server-only imports and takes the primary action either
 * as a destination or as a handler.
 */

export type StatusPrimaryAction =
  | { label: string; href: string }
  | { label: string; onClick: () => void }

export interface StatusPageProps {
  eyebrow: string
  title: string
  body: string
  primary: StatusPrimaryAction
  secondary: { label: string; href: string }
}

const TITLE_ID = 'status-title'

export function StatusPage({
  eyebrow,
  title,
  body,
  primary,
  secondary,
}: StatusPageProps) {
  const chamber = (
    <span className={styles.actionChamber} aria-hidden="true">
      <ArrowUpRight size={17} />
    </span>
  )

  return (
    <div
      className={`${styles.page} ${styles.statusPage}`}
      data-surface="editorial"
    >
      <section className={styles.shell} aria-labelledby={TITLE_ID}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1 id={TITLE_ID} className={styles.title}>
          {title}
        </h1>
        <p className={styles.body}>{body}</p>
        <div className={styles.actions}>
          {'href' in primary ? (
            <Link href={primary.href} className={styles.primaryAction}>
              <span>{primary.label}</span>
              {chamber}
            </Link>
          ) : (
            <button
              type="button"
              onClick={primary.onClick}
              className={styles.primaryAction}
            >
              <span>{primary.label}</span>
              {chamber}
            </button>
          )}
          <Link href={secondary.href} className={styles.textLink}>
            {secondary.label}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
