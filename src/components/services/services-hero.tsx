import Image from 'next/image'
import { Brand, CONTACT_HREF, Eyebrow, SlabButton, TextLink } from '@/components/site'
import { pad, serviceCapabilities, servicesContent } from '@/lib/services-content'
import styles from './services-hero.module.css'

const { hero } = servicesContent

/*
 * One hero for both compositions (02-svhero-desk, 01-svhero-ph): the same
 * image, headline and copy, set as the centred Monumental Hall card with the
 * capability bar from 768 up, and as the full-bleed phone image with the brand
 * drawn inside it and a fading ticker below.
 */
export function ServicesHero() {
  return (
    <section className={styles.hero} aria-labelledby="services-hero-title">
      <div className={styles.h}>
        <Image
          src="/media/services/ulixes-services-atrium.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.img}
        />
        <div className={styles.top}>
          <Brand tone="light" />
        </div>
        <div className={styles.tx}>
          <Eyebrow tone="light" className={styles.eb}>
            {hero.eyebrow}
          </Eyebrow>
          <h1 id="services-hero-title" className={`d ${styles.title}`}>
            <span className={styles.ln}>
              <span>{hero.lines[0]}</span>
            </span>{' '}
            <span className={`${styles.ln} ${styles.turn}`}>
              <span>{hero.lines[1]}</span>
            </span>
          </h1>
          <p className={styles.lead}>
            {hero.lead}
            <span className={styles.more}> {hero.more}</span>
          </p>
          <div className={styles.actions}>
            <SlabButton href={CONTACT_HREF} variant="light">
              {hero.primaryCta}
            </SlabButton>
            <TextLink href={hero.secondaryHref} className={styles.tl}>
              {hero.secondaryCta}
            </TextLink>
          </div>
          <div className={styles.phoneAction}>
            <SlabButton href={CONTACT_HREF} variant="light" block>
              {hero.primaryCta}
            </SlabButton>
          </div>
        </div>
      </div>

      <nav className={styles.lg} aria-label="Capabilities">
        {serviceCapabilities.map((capability, index) => (
          <a key={capability.id} href={`#${capability.id}`}>
            <div>
              <span className="m">{pad(index + 1)}</span>
              <b>{capability.short}</b>
            </div>
            <svg
              className={styles.arrow}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.3}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M1.5 6h9M7 2.5 10.5 6 7 9.5" />
            </svg>
          </a>
        ))}
      </nav>

      {/* The phone ticker repeats the capability names the carousel below lists in full. */}
      <div className={styles.tk} aria-hidden="true">
        <div>
          {[0, 1].map((round) =>
            serviceCapabilities.map((capability, index) => (
              <span key={`${round}-${capability.id}`}>
                <b>{pad(index + 1)}</b>
                {capability.short}
                <em>•</em>
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  )
}
