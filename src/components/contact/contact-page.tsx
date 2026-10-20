import Image from 'next/image'
import { Brand, Eyebrow } from '@/components/site'
import { contactPageContent } from '@/lib/contact-content'
import { InquiryForm } from './inquiry-form'
import styles from './contact.module.css'

/*
 * /contact, the approved redesign (docs/build-spec/contact).
 *
 * Desktop: the intro (headline, lede, Ulysses, the direct lines) on the left,
 * the stepped inquiry card on the right. Phone: the intro becomes a full-bleed
 * blue-hour hero carrying the brand, and the card rises over its bottom edge
 * with an addressee row; the direct lines are not shown there (the dock and
 * the page close carry the call and email actions). One h1 serves both.
 */

const { intro, practitioner, direct, hero } = contactPageContent

export function ContactPage() {
  return (
    <section className={styles.contact} aria-labelledby="contact-title">
      <div className={`wrap ${styles.wrap}`}>
        <div className={styles.grid}>
          <div className={styles.intro}>
            <div className={styles.heroMedia} aria-hidden="true">
              <Image
                src={hero.src}
                alt=""
                fill
                preload
                sizes="(max-width: 767px) 100vw, 1px"
                className={styles.heroImage}
              />
            </div>
            <div className={styles.heroBrand}>
              <Brand tone="light" />
            </div>
            <div className={styles.introText}>
              <Eyebrow className={styles.eyebrow}>{intro.eyebrow}</Eyebrow>
              <h1 id="contact-title" className={`d ${styles.title}`}>
                {intro.headlineLead} <span className="s">{intro.headlineTurn}</span>
              </h1>
              <p className={styles.lede}>
                {intro.ledeLead}
                <span className={styles.ledeRest}> {intro.ledeRest}</span>
              </p>
            </div>

            <div className={styles.who}>
              <Image
                src={practitioner.portrait.src}
                alt={practitioner.portrait.alt}
                width={56}
                height={56}
                className={styles.portrait}
              />
              <div>
                <b>{practitioner.name}</b>
                <span>{practitioner.note}</span>
              </div>
            </div>

            <dl className={styles.direct} aria-label="Direct contact">
              {direct.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>
                    {'href' in row ? (
                      <a href={row.href}>
                        {row.value}
                        <i aria-hidden="true">↗</i>
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.card}>
            <div className={styles.to}>
              <span className={styles.toLabel}>{practitioner.toLabel}</span>
              <Image
                src={practitioner.portrait.src}
                alt=""
                width={40}
                height={40}
                className={styles.portrait}
              />
              <div>
                <b>{practitioner.name}</b>
                <span>{practitioner.toNote}</span>
              </div>
            </div>
            <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  )
}
