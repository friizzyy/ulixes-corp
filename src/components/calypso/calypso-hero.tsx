import Image from 'next/image'
import { Brand, CONTACT_HREF, Eyebrow, SlabButton, TextLink } from '@/components/site'
import { calypsoFacts, calypsoHero } from '@/lib/calypso-content'
import styles from './calypso-hero.module.css'

const HERO_IMAGE = '/media/calypso/ulixes-calypso-hall.jpg'

/*
 * Two compositions of one hero (02-calhero-desk / 01-calhero-ph). Desktop and
 * tablet: an inset image card with centred type and the facts bar lifted over
 * its foot. Phone: a full-bleed image that draws the brand itself (the layout
 * renders no brand bar on this route), type set low, and the facts as a
 * ticker. Only one is displayed at a time, so only one h1 is ever exposed.
 */
export function CalypsoHero() {
  return (
    <section className={styles.root} data-testid="calypso-hero">
      <div className={styles.desk} data-testid="calypso-hero-desk">
        <div className={styles.card}>
          <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className={styles.img} />
          <div className={styles.tx}>
            <Eyebrow centred tone="light" className={styles.eyebrow}>
              {calypsoHero.eyebrow}
            </Eyebrow>
            <h1 className={`d ${styles.h1}`}>
              <span className={styles.ln}>
                <span>{calypsoHero.lead}</span>
              </span>{' '}
              <span className={styles.ln}>
                <span>{calypsoHero.turn}</span>
              </span>
            </h1>
            <p className={styles.body}>{calypsoHero.body}</p>
            <div className={styles.actions}>
              <SlabButton href={CONTACT_HREF} variant="light">
                {calypsoHero.cta}
              </SlabButton>
              <TextLink href="#lifecycle" className={styles.explore}>
                {calypsoHero.explore}
              </TextLink>
            </div>
          </div>
        </div>
        <ul className={styles.facts} aria-label="The practice in numbers">
          {calypsoFacts.map((fact) => (
            <li key={fact.unit}>
              <div className={styles.f}>
                <b>{fact.value}</b>
                <em>{fact.unit}</em>
              </div>
              <span className={styles.x}>{fact.note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.phone} data-testid="calypso-hero-phone">
        <div className={styles.ph}>
          <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className={styles.img} />
          <div className={styles.top}>
            <Brand tone="light" />
          </div>
          <div className={styles.ptx}>
            <Eyebrow tone="light">{calypsoHero.eyebrow}</Eyebrow>
            <h1 className={`d ${styles.ph1}`}>
              {calypsoHero.lead} <span className="s">{calypsoHero.turn}</span>
            </h1>
            <p className={styles.pl}>{calypsoHero.body}</p>
            <SlabButton href={CONTACT_HREF} variant="light" block className={styles.pbtn}>
              {calypsoHero.cta}
            </SlabButton>
          </div>
        </div>
        <div className={styles.tk}>
          <ul className={styles.sr}>
            {calypsoFacts.map((fact) => (
              <li key={fact.unit}>
                {fact.value} {fact.unit}: {fact.note}
              </li>
            ))}
          </ul>
          <div className={styles.run} aria-hidden="true">
            {[0, 1].map((copy) =>
              calypsoFacts.map((fact) => (
                <span key={`${copy}-${fact.unit}`}>
                  <b>
                    {fact.value} {fact.unit}
                  </b>
                  {fact.note}
                  <em>•</em>
                </span>
              )),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
