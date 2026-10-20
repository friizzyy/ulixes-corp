import { Brand, CONTACT_HREF, Eyebrow, Section, SlabButton, TextLink } from '@/components/site'
import { homepageContent } from '@/lib/homepage-content'
import { HeroMedia } from './hero-media'
import styles from './hero.module.css'

/*
 * 01-video (desktop): the light card with the San Francisco loop masked in
 * from the right and the four-fact dock overlapping its foot.
 * 01-mhero (phone): the full-bleed image hero with the brand drawn inside it
 * (the layout hides the phone brand bar on /) and the facts as a ticker.
 */
export function HomeHero() {
  const { hero } = homepageContent
  const facts = hero.facts

  return (
    <Section space="none" wrap={false} className={styles.hero} aria-labelledby="home-hero-title">
      <div className={styles.card}>
        <HeroMedia posterSrc={hero.posterSrc} imageAlt={hero.imageAlt} videoSrc={hero.videoSrc} />
        <div className={styles.top}>
          <Brand tone="light" />
        </div>
        <div className={styles.tx}>
          <Eyebrow className={styles.eyebrow}>
            <span className={styles.desk}>{hero.eyebrow.desk}</span>
            <span className={styles.phone}>{hero.eyebrow.phone}</span>
          </Eyebrow>
          <h1 id="home-hero-title" className={`d ${styles.title}`}>
            {hero.headline}
          </h1>
          <p className={styles.lede}>
            <span className={styles.desk}>{hero.body.desk}</span>
            <span className={styles.phone}>{hero.body.phone}</span>
          </p>
          <div className={styles.acts}>
            <SlabButton href={CONTACT_HREF} className={styles.deskAction}>
              {hero.primaryCta}
            </SlabButton>
            <SlabButton href={CONTACT_HREF} variant="light" block className={styles.phoneAction}>
              {hero.primaryCta}
            </SlabButton>
            <TextLink href="/services" className={styles.deskAction}>
              {hero.secondaryCta}
            </TextLink>
          </div>
        </div>
      </div>

      <dl className={styles.dock}>
        {facts.map((fact) => (
          <div key={fact.label} className={styles.fact}>
            <dt className={styles.factLabel}>{fact.label}</dt>
            <dd className={styles.factValue}>{fact.value}</dd>
            <dd className={styles.factDetail}>{fact.detail}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.ticker}>
        <div className={styles.track}>
          {[false, true].map((duplicate) => (
            <ul
              key={String(duplicate)}
              className={styles.tickerSet}
              aria-hidden={duplicate ? true : undefined}
              aria-label={duplicate ? undefined : 'At a glance'}
            >
              {facts.map((fact) => (
                <li key={fact.label} className={styles.tickerItem}>
                  <b>{fact.value}</b> {fact.phoneDetail}
                  <span className={styles.tickerSep} aria-hidden="true">
                    •
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </Section>
  )
}
