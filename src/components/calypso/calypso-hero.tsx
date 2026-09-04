import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from '@/components/ui/icons'
import { calypsoContent } from '@/lib/calypso-content'
import { Cascade, CascadeItem, Curtain, Lift } from './calypso-motion'
import styles from './calypso-hero.module.css'

/*
 * The site's hero grammar, which this page kept failing to speak.
 *
 * Every other hero on the site is the same three moves: a pill eyebrow, copy
 * flush left, and a photograph on the right that bleeds to the viewport edge
 * under a horizontal mask. Services then closes with a ruled index beneath the
 * copy; the homepage closes with the authority dock.
 *
 * This page had a rounded card holding an aurora gradient and no photograph at
 * all. The gradient appears nowhere else on the site and the card belongs to
 * the homepage, so the result read as neither one thing nor the other.
 *
 * So: same grammar, different content. Full bleed like services and the
 * experience page rather than a card, the hall photograph on the right, and
 * the four authority values as the ruled index beneath the copy. What keeps it
 * from being services twice is the serif turn in the headline, which is the
 * voice this page and the experience page share.
 */
export function CalypsoHero() {
  const { hero, authority } = calypsoContent

  return (
    <section
      className={styles.hero}
      data-testid="calypso-hero"
      data-layout="open-masthead"
      data-mobile-flow="message-first"
      aria-labelledby="calypso-title"
    >
      <div className={`${styles.shell} ${styles.copyShell}`}>
        <div className={styles.copy} data-testid="calypso-hero-copy">
          <Curtain delay={0.05}>
            <p className={styles.eyebrow}>{hero.eyebrow}</p>
          </Curtain>

          <h1
            id="calypso-title"
            className={styles.title}
            aria-label={`${hero.headlineLead} ${hero.headlineTurn}`}
          >
            <Curtain delay={0.12}>
              <span data-line="lead">
                {hero.headlineLead}{' '}
              </span>
            </Curtain>
            <Curtain delay={0.2}>
              <span data-line="turn">{hero.headlineTurn}</span>
            </Curtain>
          </h1>

          <Curtain delay={0.3}>
            <p className={styles.body}>{hero.body}</p>
          </Curtain>

          <Lift className={styles.actions} delay={0.4} amount={0}>
            <Link href="/contact" className={styles.primaryAction}>
              <span>{hero.primaryCta}</span>
              <span className={styles.actionChamber} aria-hidden="true">
                <ArrowUpRight size={17} />
              </span>
            </Link>
            <Link href="#lifecycle" className={styles.secondaryAction}>
              {hero.secondaryCta}
              <ArrowRight size={16} />
            </Link>
          </Lift>
        </div>
      </div>

      <div className={styles.media} data-testid="calypso-hero-media" aria-hidden="true">
        <Image
          src="/media/calypso/ulixes-calypso-hall.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 100vw, (max-width: 899px) 100vw, 60vw"
          className={styles.mediaImage}
        />
      </div>

      <div
        className={`${styles.shell} ${styles.authorityShell}`}
        data-mobile-layout="two-by-two"
      >
        <Cascade
          className={styles.authorityDock}
          amount={0}
          label="Calypso authority"
        >
          {authority.map((item, index) => (
            <CascadeItem key={item.value} primary={index === 0}>
              <span className={styles.dockIndex}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <strong>{item.value}</strong>
              <small>{item.label}</small>
            </CascadeItem>
          ))}
        </Cascade>
      </div>
    </section>
  )
}
