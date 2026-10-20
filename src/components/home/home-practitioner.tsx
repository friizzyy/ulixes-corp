import Image from 'next/image'
import Link from 'next/link'
import { CONTACT_HREF, Eyebrow, Section, SlabButton } from '@/components/site'
import { homepageContent } from '@/lib/homepage-content'
import styles from './practitioner.module.css'

function LinkedInGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M8 10.5V16M8 8v.01M12 16v-3.2a2.3 2.3 0 0 1 4.6 0V16M12 10.5V16" />
    </svg>
  )
}

/* 04-meet: the practitioner card, with the three things a first note covers. */
export function HomePractitioner() {
  const p = homepageContent.practitioner
  const linkedin = homepageContent.credibility.linkedinUrl

  return (
    <Section aria-labelledby="home-practitioner-title">
      <Eyebrow centred className={styles.eyebrow}>
        {p.eyebrow}
      </Eyebrow>
      <h2 id="home-practitioner-title" className={`d ${styles.title}`}>
        {p.headlineLead} <span className="s">{p.headlineTurn}</span>
      </h2>

      <article className={styles.card} aria-labelledby="home-practitioner-name">
        <Image
          src={p.imageSrc}
          alt={p.imageAlt}
          width={1024}
          height={1280}
          sizes="(max-width: 767px) 100vw, (max-width: 1099px) 100vw, 380px"
          className={styles.photo}
        />
        <div className={styles.in}>
          <div className={styles.nm}>
            <div>
              <h3 id="home-practitioner-name" className={styles.name}>
                {p.name}
              </h3>
              <p className={styles.role}>{p.role}</p>
            </div>
            <div className={styles.lk}>
              <Link href={p.experienceHref} className={styles.li}>
                {p.experienceCta.desk} <span className={styles.glyph} aria-hidden="true">→</span>
              </Link>
              <a href={linkedin} className={styles.li} target="_blank" rel="noopener noreferrer">
                <LinkedInGlyph />
                {p.linkedinCta}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>

          <ul className={styles.fs}>
            {p.facts.map((fact) => (
              <li key={fact.value}>
                <strong className={styles.figure}>
                  {fact.value}
                  {'unit' in fact ? <em className={styles.unit}> {fact.unit}</em> : null}
                </strong>
                <span className={styles.phoneLabel}>{fact.phoneLabel}</span>
                <span className={styles.detail}>
                  <span className={styles.desk}>{fact.detail}</span>
                  <span className={styles.phone}>{fact.phoneDetail}</span>
                </span>
              </li>
            ))}
          </ul>

          <h3 className={styles.brief}>
            {p.briefLead} <span className="s">{p.briefTurn}</span>
          </h3>
          <p className={styles.lede}>
            <span className={styles.desk}>{p.briefBody.desk}</span>
            <span className={styles.phone}>{p.briefBody.phone}</span>
          </p>
          <ol className={styles.row}>
            {p.briefPoints.map((point, index) => (
              <li key={point.title}>
                <span className={styles.nu} aria-hidden="true">
                  {index + 1}
                </span>
                <span className={styles.pointText}>
                  <b>{point.title}</b>
                  <span className={styles.pointBody}>{point.body}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className={styles.ft}>
            <SlabButton href={CONTACT_HREF} className={styles.deskAction}>
              {p.cta}
            </SlabButton>
            <SlabButton href={CONTACT_HREF} block className={styles.phoneAction}>
              {p.cta}
            </SlabButton>
          </div>
          <div className={styles.phoneLinks}>
            <SlabButton href={p.experienceHref} variant="ghost" arrow="→" block className={styles.phoneSecondary}>
              {p.experienceCta.phone}
            </SlabButton>
            <SlabButton href={linkedin} variant="ghost" arrow="↗" block external className={styles.phoneSecondary}>
              {p.linkedinCta}
              <span className="sr-only"> (opens in a new tab)</span>
            </SlabButton>
          </div>
        </div>
      </article>
    </Section>
  )
}
