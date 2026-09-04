import Image from 'next/image'
import Link from 'next/link'
import { CalypsoHero } from '@/components/calypso/calypso-hero'
import { Curtain } from '@/components/calypso/calypso-motion'
import { LifecycleBlotter } from '@/components/calypso/lifecycle-blotter'
import { MobileMandateSelector } from '@/components/calypso/mobile-mandate-selector'
import { CalypsoSectionNav } from '@/components/calypso/calypso-section-nav'
import { CalypsoPrograms } from '@/components/calypso/calypso-programs'
import { ArrowUpRight } from '@/components/ui/icons'
import {
  calypsoContent,
  calypsoDelivery,
} from '@/lib/calypso-content'
import styles from './nasdaq-calypso.module.css'

const { programs, delivery, contact } = calypsoContent
const calypsoSections = [
  { id: 'lifecycle', label: 'Lifecycle' },
  { id: 'programs', label: 'Programs' },
  { id: 'mandates', label: 'Mandates' },
] as const

export default function NasdaqCalypsoPage() {
  return (
    <div className={styles.page} data-surface="editorial">
      <CalypsoHero />
      <CalypsoSectionNav sections={calypsoSections} />

      {/*
        The lifecycle as one instrument: seven columns on one surface, every
        stage legible at rest, the two consequences drawn across the top and
        stated beneath. The stacked plates it replaces cost three thousand
        pixels for the same content.
      */}
      <div data-depth-composition="three-office-trade-spine">
        <LifecycleBlotter />
      </div>

      <section
        id="programs"
        className={styles.programChapter}
        data-section="programs"
        aria-labelledby="programs-title"
      >
        <div
          className={`${styles.shell} ${styles.programBook}`}
          data-testid="calypso-program-book"
          data-mobile-layout="program-book"
        >
          <div
            className={styles.chapterMedia}
            data-testid="calypso-program-book-media"
            aria-hidden="true"
          >
            <Image
              src="/media/calypso/ulixes-calypso-atrium-stair.jpg"
              alt=""
              fill
              sizes="(max-width: 895px) calc(100vw - 40px), 1248px"
              className={styles.chapterMediaImage}
            />
          </div>

          <div
            className={styles.programBookContent}
            data-testid="calypso-program-book-content"
          >
            <header
              className={styles.chapterHeader}
              data-testid="calypso-program-header"
            >
              <div
                className={styles.chapterTitleGroup}
                data-testid="calypso-program-title-group"
              >
                <p className={`ed-eyebrow ${styles.eyebrow}`}>{programs.eyebrow}</p>
                <Curtain>
                  <h2 id="programs-title" className={styles.chapterTitle}>
                    {programs.headlineLead}{' '}
                    <em className={styles.turn}>{programs.headlineTurn}</em>
                  </h2>
                </Curtain>
              </div>
              <p data-testid="calypso-program-lede">{programs.body}</p>
            </header>

            <CalypsoPrograms />
          </div>
        </div>
      </section>

      <section
        id="mandates"
        className={styles.mandateSection}
        data-section="mandates"
        aria-labelledby="mandates-title"
      >
          <div className={styles.shell}>
            {/*
            The title group stays one editorial unit while the lede occupies
            the opposing track. Touch layouts return them to title-first
            reading order without changing the document order.
          */}
          <header
            className={styles.mandateHeader}
            data-testid="calypso-mandate-header"
          >
            <div
              className={styles.mandateTitleGroup}
              data-testid="calypso-mandate-title-group"
            >
              <p className={`ed-eyebrow ${styles.eyebrow}`}>{delivery.eyebrow}</p>
              <Curtain>
                <h2 id="mandates-title" className={styles.sectionTitle}>
                  {delivery.headlineLead}{' '}
                  <em className={styles.turn}>{delivery.headlineTurn}</em>
                </h2>
              </Curtain>
            </div>
            <p
              className={styles.mandateLede}
              data-testid="calypso-mandate-lede"
            >
              {delivery.body}
            </p>
          </header>

          <MobileMandateSelector mandates={calypsoDelivery} />

          <ol
            className={`${styles.mandateLedger} ${styles.desktopMandateLedger}`}
            data-visible-from="896px"
            aria-label="Calypso mandate shapes"
          >
            {calypsoDelivery.map((mandate, index) => (
              <li
                key={mandate.id}
                className={styles.mandateRow}
                data-material={['steel', 'sage', 'clay', 'platinum'][index]}
              >
                <span className={styles.mandateIndex}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className={styles.mandateIdentity}>
                  <h3>{mandate.title}</h3>
                  {/* The scope line arrives as one middot-separated string.
                      Split into chips so the three terms read as a spec rather
                      than as a caption. */}
                  <span className={styles.mandateScope}>
                    {mandate.scope
                      .split('·')
                      .map((term) => term.trim().charAt(0).toUpperCase() + term.trim().slice(1))
                      .join(' · ')}
                  </span>
                </div>
                <p className={styles.mandateRisk}>{mandate.risk}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.closeSection} aria-labelledby="calypso-inquiry">
        <div className={`${styles.shell} ${styles.closePanel}`}>
          <div>
            <p className={`ed-eyebrow ${styles.eyebrow}`}>{contact.eyebrow}</p>
            <h2 id="calypso-inquiry" className={styles.closeTitle}>
              {contact.headline}
            </h2>
            <p className={styles.closeBody}>{contact.body}</p>
          </div>

          <div className={styles.closeAction}>
            <Link href="/contact" className={`ed-primary ${styles.closeCta}`}>
              <span>{contact.cta}</span>
              <span className="ed-chamber" aria-hidden="true">
                <ArrowUpRight size={17} />
              </span>
            </Link>
            <div>
              <span className="ed-close-label">Or write directly</span>
              <a className="ed-textlink" href={`mailto:${contact.email}`}>{contact.email}</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
