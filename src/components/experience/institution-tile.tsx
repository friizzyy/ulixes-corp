import { Fragment } from 'react'
import { SlabButton } from '@/components/site/slab-button'
import { CONTACT_HREF } from '@/components/site/routes'
import type { InstitutionIcon as IconName } from '@/lib/institutional-experience-content'
import { InstitutionIcon } from './institution-icon'
import styles from './institution-tile.module.css'

type Layout = 'grid' | 'card'

/* Keeps hyphenated compounds (large-scale, front-to-back) on one line. */
function keepCompounds(text: string) {
  return text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className={styles.nw}>
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

export interface InstitutionTileProps {
  icon: IconName
  name: string
  description: string
  index: number
  total: number
  layout: Layout
}

/** One kind of institution. 'grid' is the desktop tile, 'card' the phone carousel card. */
export function InstitutionTile({ icon, name, description, index, total, layout }: InstitutionTileProps) {
  const n = String(index + 1).padStart(2, '0')
  const label = layout === 'card' ? `${n} / ${String(total).padStart(2, '0')}` : n
  return (
    <article className={`${styles.t} ${styles[layout]}`}>
      <div className={styles.hd}>
        <InstitutionIcon name={icon} className={styles.icon} />
        <span className={`m ${styles.num}`} aria-hidden="true">
          {label}
        </span>
      </div>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.desc}>{keepCompounds(description)}</p>
    </article>
  )
}

export interface InstitutionSummaryProps {
  count: string
  label: string
  body: string
  cta: string
  layout: Layout
}

/** The dark closing tile: the count, what it counts, and the brief. */
export function InstitutionSummary({ count, label, body, cta, layout }: InstitutionSummaryProps) {
  return (
    <article className={`${styles.t} ${styles[layout]} ${styles.end}`} aria-label={`${count} ${label}`}>
      <span className={styles.k} aria-hidden="true">
        {count}
      </span>
      <p className={styles.kl} aria-hidden="true">
        {label}
      </p>
      <p className={styles.desc}>{body}</p>
      <SlabButton href={CONTACT_HREF} variant="light" block={layout === 'card'} className={styles.btn}>
        {cta}
      </SlabButton>
    </article>
  )
}
