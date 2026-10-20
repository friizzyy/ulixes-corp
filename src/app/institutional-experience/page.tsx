import Image from 'next/image'
import { CONTACT_HREF, CtaCard, Eyebrow, Section, SlabButton, TextLink } from '@/components/site'
import { InstitutionCarousel } from '@/components/experience/institution-carousel'
import { InstitutionSummary, InstitutionTile } from '@/components/experience/institution-tile'
import { PositionsAccordion } from '@/components/experience/positions-accordion'
import {
  institutionalExperienceContent,
  practitionerPortrait,
} from '@/lib/institutional-experience-content'
import styles from './institutional-experience.module.css'

/*
 * /institutional-experience, built to docs/build-spec/experience:
 * 02 hero "Portrait, Staged", 03 the seven institutions (grid on desktop,
 * swipe rail on phone), 04 the six positions (two-column register on desktop,
 * accordion on phone), 05 the closing brief card. Header, phone brand bar,
 * footer and dock come from the root layout.
 */
const { hero, institutions, positions, close } = institutionalExperienceContent

export default function InstitutionalExperiencePage() {
  const total = institutions.categories.length
  const tiles = (layout: 'grid' | 'card') => [
    ...institutions.categories.map((item, i) => (
      <InstitutionTile key={item.name} {...item} index={i} total={total} layout={layout} />
    )),
    <InstitutionSummary key="summary" {...institutions.summary} layout={layout} />,
  ]

  return (
    <div className={styles.page}>
      {/* 02: Portrait, Staged */}
      <Section space="none" wrap={false} className={styles.hero} aria-labelledby="experience-title">
        <div className={styles.bg} aria-hidden="true">
          <Image
            src="/media/experience/ulixes-institutional-hall.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 767px) 100vw, 46vw"
            className={styles.bgImg}
          />
        </div>
        <div className={`wrap ${styles.g}`}>
          <div className={styles.copy}>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
            <h1 id="experience-title" className={`d ${styles.h1}`}>
              <span className={styles.ln}>
                <span>{hero.headlineLead}</span>
              </span>{' '}
              <span className={styles.ln}>
                <span className="s">{hero.headlineTurn}</span>
              </span>
            </h1>
            <p className={styles.lede}>{hero.body}</p>
            <div className={styles.actions}>
              <SlabButton href={CONTACT_HREF} className={styles.heroBtn}>
                {hero.cta}
              </SlabButton>
              <TextLink
                href={hero.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                arrow="↗"
                className={styles.linkedin}
              >
                {hero.linkedinLabel}
                <span className="sr-only"> (opens in a new tab)</span>
              </TextLink>
            </div>
            <dl className={styles.cr}>
              {hero.credentials.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className={styles.pt}>
            <Image
              src={practitionerPortrait.src}
              alt={practitionerPortrait.alt}
              width={practitionerPortrait.width}
              height={practitionerPortrait.height}
              priority
              sizes="(max-width: 767px) 234px, 470px"
              className={styles.ptImg}
            />
            <figcaption className={styles.nc}>
              <b>{hero.name}</b>
              <span>
                <i aria-hidden="true" />
                {hero.role}
              </span>
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* 03: Where the work has happened */}
      <Section id="institutions" className={styles.inst} aria-labelledby="institutions-title">
        <Eyebrow centred>{institutions.eyebrow}</Eyebrow>
        <h2 id="institutions-title" className={`d ${styles.h2} ${styles.h2c}`}>
          {institutions.headlineLead} <span className="s">{institutions.headlineTurn}</span>
        </h2>
        <div className={styles.grid}>{tiles('grid')}</div>
        <div className={styles.rail}>
          <InstitutionCarousel
            label="Kinds of institution"
            slides={tiles('card')}
            slideLabels={[...institutions.categories.map((c) => c.name), 'the summary']}
          />
        </div>
      </Section>

      {/* 04: Working perspective */}
      <Section className={styles.pos} aria-labelledby="positions-title">
        <Eyebrow>{positions.eyebrow}</Eyebrow>
        <h2 id="positions-title" className={`d ${styles.h2}`}>
          {positions.headlineLead} <span className="s">{positions.headlineTurn}</span>
        </h2>
        <ol className={styles.register}>
          {positions.items.map((item, i) => (
            <li key={item.title}>
              <span className={styles.n} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.accordion}>
          <PositionsAccordion items={positions.items} />
        </div>
      </Section>

      {/* 05: the close */}
      <Section wrap={false}>
        <CtaCard lead={close.lead} turn={close.turn} />
      </Section>
    </div>
  )
}
