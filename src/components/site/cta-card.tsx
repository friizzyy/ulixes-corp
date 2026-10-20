import Image from 'next/image'
import { useId } from 'react'
import { siteConfig } from '@/lib/content'
import { Eyebrow } from './eyebrow'
import { SlabButton } from './slab-button'
import { CONTACT_HREF } from './routes'
import styles from './cta-card.module.css'

export interface CtaCardProps {
  /** First half of the headline, in ink. */
  lead: string
  /** Second half, in steel on its own line: renders <span class="s">turn</span>. */
  turn: string
  /** The sentence under the headline. Defaults to the spec's copy. */
  body?: string
  /** Heading level for the headline. Defaults to 2. */
  headingLevel?: 2 | 3
  className?: string
}

const DEFAULT_BODY = 'Describe the platform change, where it sits, and what it depends on.'

const firstNote = [
  { title: 'The platform state', detail: 'What runs today and what is changing' },
  { title: 'The delivery stage', detail: 'Design, build, migration, testing or go-live' },
  { title: 'The decision', detail: 'What needs senior attention, and by when' },
] as const

/**
 * The closing brief card. Renders its own .wrap (with the phone card's 14px
 * gutter) but no vertical space: place it in a <Section>.
 */
export function CtaCard({ lead, turn, body = DEFAULT_BODY, headingLevel = 2, className }: CtaCardProps) {
  const headingId = useId()
  const Heading = headingLevel === 3 ? 'h3' : 'h2'
  const ListHeading = headingLevel === 3 ? 'h4' : 'h3'

  return (
    <div className={['wrap', styles.wrap, className ?? ''].filter(Boolean).join(' ')} data-cta-card>
      <article className={styles.cd} aria-labelledby={headingId}>
        <div className={styles.l}>
          <Eyebrow>Start a conversation</Eyebrow>
          <Heading id={headingId} className={`d ${styles.h}`}>
            {lead} <span className="s">{turn}</span>
          </Heading>
          <p className={styles.p}>{body}</p>
          <div className={styles.who}>
            <Image
              src="/media/experience/ulysses-williams.jpg"
              alt=""
              width={88}
              height={88}
              sizes="44px"
              className={styles.portrait}
            />
            <div>
              <b className={styles.whoName}>Ulysses Williams</b>
              <span className={styles.whoRole}>President · Calypso subject-matter expert</span>
            </div>
          </div>
        </div>
        <div className={styles.r}>
          <ListHeading>A USEFUL FIRST NOTE INCLUDES</ListHeading>
          <ol className={styles.ck}>
            {firstNote.map((item, index) => (
              <li key={item.title}>
                <span className={styles.nu} aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <b>{item.title}</b>
                  <span>{item.detail}</span>
                </div>
              </li>
            ))}
          </ol>
          <SlabButton href={CONTACT_HREF} block className={styles.action}>
            Discuss a mandate
          </SlabButton>
          <p className={styles.em}>
            or write to <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>
        </div>
      </article>
    </div>
  )
}
