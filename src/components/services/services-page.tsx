import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, MobileDisclosure } from '@/components/ui'
import {
  serviceCapabilities,
  servicesContent,
} from '@/lib/services-content'
import { ApproachLine } from './approach-line'
import { MobileProcessPager } from './mobile-process-pager'
import { Curtain, Lift } from '@/components/motion/editorial-motion'
import { pad } from './motion'
import styles from './services-page.module.css'

/*
 * /services. Six sections and the shared footer: the photograph hero, the
 * four capabilities as one ledger, the one dark chapter, one statement on
 * automation, the Calypso band and the shared close. One thing per section. Every word comes from
 * services-content.ts; the only strings native to this file are the two
 * register labels ("Or write directly", "Reports to").
 */

const { hero, capabilities, negation, approach, automation, calypso, contact } =
  servicesContent

export function ServicesPage() {
  return (
    <div className={styles.page} data-surface="editorial">
      {/*
        The hero is this page's own: a full-width photograph of institutional
        architecture, then the claim beneath it on the rail with the four
        capabilities as the page's contents. No other route opens this way.
      */}
      <section
        className={styles.hero}
        aria-labelledby="services-hero-title"
        data-mobile-flow="image-led"
        data-mobile-layout="image-background"
      >
        <div className={`${styles.contentShell} ${styles.heroBelow}`}>
          <div className={styles.heroCopy}>
            <p className={`ed-eyebrow ${styles.eyebrow}`}>{hero.eyebrow}</p>
            <Curtain className="ed-curtain" delay={0.05}>
              <h1
                id="services-hero-title"
                className={styles.heroTitle}
                data-mobile-title="two-lines"
              >
                {hero.headlineLines.map((line, index) => (
                  <span key={line} className={styles.heroTitleLine}>
                    {line}
                    {index < hero.headlineLines.length - 1 ? ' ' : null}
                  </span>
                ))}
              </h1>
            </Curtain>
            <p className={styles.heroBody}>{hero.body}</p>
            <Lift delay={0.34} amount={0}>
              <div
                className={styles.heroActions}
                data-mobile-layout="paired-actions"
              >
                <Link
                  href="/contact"
                  className={`ed-primary ${styles.primaryAction}`}
                >
                  <span>{hero.primaryCta}</span>
                  <span className="ed-chamber" aria-hidden="true">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>
                <a
                  href={hero.secondaryHref}
                  className={`ed-textlink ${styles.secondaryAction}`}
                >
                  {hero.secondaryCta}
                  <ArrowRight size={16} />
                </a>
              </div>
            </Lift>
          </div>
        </div>
        <div className={styles.heroBand}>
          <Image
            src="/media/services/ulixes-services-atrium.jpg"
            alt="Travertine atrium of an institutional headquarters, bronze balustrade and morning light across the stone floor"
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
        </div>
      </section>

      {/*
        The four capabilities remain one raised ledger on larger screens.
        Phones reuse the same content as a sparse disclosure reading flow.
      */}
      <section
        id="capabilities"
        className={styles.capabilities}
        aria-labelledby="services-capabilities-title"
      >
        <div className={styles.contentShell}>
          <div className={styles.sectionIntro}>
            <div className={styles.sectionHeading}>
              <p className={`ed-eyebrow ${styles.eyebrow}`}>{capabilities.eyebrow}</p>
              <Curtain className="ed-curtain" inView>
                <h2
                  id="services-capabilities-title"
                  className={styles.sectionTitle}
                >
                  {capabilities.headline}
                </h2>
              </Curtain>
            </div>
            <div className={styles.sectionLead}>
              <p>{capabilities.body}</p>
            </div>
          </div>

          <div
            id="services-capabilities-rail"
            className={styles.capabilityLedger}
            data-services-capabilities="desktop"
            data-visible-from="896px"
          >
            {serviceCapabilities.map((capability, index) => (
              <Link
                key={capability.id}
                href={capability.contactHref}
                className={styles.capabilityRow}
                data-material={capability.material}
                data-disclosure-hash-target={capability.id}
              >
                <span className={styles.rowIndex}>{pad(index)}</span>
                <span className={styles.rowCore}>
                  <strong className={styles.rowTitle}>{capability.title}</strong>
                  <span className={styles.rowScope}>{capability.scopeTerms.join(' · ')}</span>
                </span>
                <span className={styles.rowRisk}>{capability.risk}</span>
                <span className={styles.rowAction} aria-hidden="true">
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            ))}
          </div>
          <div
            className={styles.mobileCapabilities}
            data-services-capabilities="mobile"
            data-visible-through="895px"
          >
            <MobileDisclosure
              ariaLabel="Services capabilities"
              hint="Select a capability"
              items={serviceCapabilities.map((capability, index) => ({
                id: capability.id,
                index: pad(index),
                title: capability.title,
                summary: capability.scopeTerms.join(' · '),
                panel: (
                  <div className={styles.capabilityPanel}>
                    <p>{capability.risk}</p>
                    <Link href={capability.contactHref} className="ed-textlink">
                      {capabilities.contactCta}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                ),
              }))}
              defaultOpenId={serviceCapabilities[0]?.id}
              syncWithLocationHash
              allowCollapse={false}
            />
          </div>
        </div>
      </section>

      {/* One ruled statement band on the rail, by value from the homepage:
          the platform credential stays visible without leading the page. */}

      {/* The one tonal break. Neutral charcoal rather than --ink, which is a
          blue slate and reads unmistakably blue across a whole section. */}
      <section className={styles.chapter} aria-labelledby="path-negation-title">
        <div className={`${styles.contentShell} ${styles.chapterGrid}`}>
          <div
            className={styles.chapterLead}
            data-heading-composition="centered-thesis"
          >
            <Curtain className="ed-curtain" inView>
              <h2 id="path-negation-title" className={styles.chapterStatement}>
                {negation.statement}
              </h2>
            </Curtain>
            <p className={styles.chapterBody}>{negation.body}</p>
          </div>
          <div className={styles.chapterRegister}>
            <p className={`ed-eyebrow ed-eyebrow--dark ${styles.chapterLabel}`}>{approach.eyebrow}</p>
            <div
              className={styles.desktopApproach}
              data-services-process="desktop"
              data-visible-from="896px"
            >
              <ApproachLine />
            </div>
            <div
              className={styles.mobileApproach}
              data-services-process="mobile"
              data-visible-through="895px"
            >
              <MobileProcessPager steps={approach.steps} />
            </div>
          </div>
        </div>
      </section>

      {/*
        Evidence, in one composed section: the Calypso depth as a photograph
        plate with the year floating off its corner, the way the homepage sets
        the practitioner, and the automation note beneath the copy. Two flat
        statement bands used to sit here.
      */}
      <section className={styles.evidence} aria-labelledby="services-calypso-title">
        <div className={`${styles.contentShell} ${styles.evidenceGrid}`}>
          <div className={styles.evidenceMedia}>
            <Lift>
              <div className={styles.evidenceFrame}>
                <Image
                  src="/media/services/ulixes-services-floor.jpg"
                  alt="A capital markets trading floor after hours, rows of desks under linear lights."
                  fill
                  sizes="(max-width: 895px) 100vw, 46vw"
                  className={styles.evidenceImage}
                />
              </div>
            </Lift>
            <aside className={styles.evidencePlate} aria-label="Calypso work since 2004">
              <span className={styles.evidencePlateLabel}>{calypso.sinceLabel}</span>
              <strong className={styles.evidenceYear}>{calypso.since}</strong>
            </aside>
          </div>
          <div className={styles.evidenceCopy}>
            <p className={`ed-eyebrow ${styles.eyebrow}`}>{calypso.eyebrow}</p>
            <Curtain className="ed-curtain" inView>
              <h2 id="services-calypso-title" className={styles.evidenceTitle}>
                {calypso.headline}
              </h2>
            </Curtain>
            <p className={styles.evidenceBody}>{calypso.body}</p>
            <Link href={calypso.href} className={`ed-textlink ${styles.textLink}`}>
              {calypso.cta}
              <ArrowRight size={16} />
            </Link>
            <div className={styles.evidenceNote}>
              <p className={`ed-eyebrow ${styles.eyebrow}`}>{automation.eyebrow}</p>
              <p className={styles.evidenceNoteTitle}>{automation.headline}</p>
              <p className={styles.evidenceNoteBody}>{automation.body}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        className={styles.contactSection}
        aria-labelledby="path-contact-title"
      >
        <Lift>
          <div className={`${styles.contentShell} ${styles.contactPanel}`}>
            <div className={styles.contactCopy}>
              <p className={`ed-eyebrow ${styles.contactEyebrow}`}>
                {contact.eyebrow}
              </p>
              <h2 id="path-contact-title">{contact.headline}</h2>
              <p className={styles.contactBody}>{contact.body}</p>
              <p className={styles.contactInstruction}>{contact.instruction}</p>
            </div>
            <div className={styles.contactActionArea}>
              <Link href="/contact" className={`ed-primary ${styles.contactAction}`}>
                <span>{contact.cta}</span>
                <span className="ed-chamber" aria-hidden="true">
                  <ArrowUpRight size={17} />
                </span>
              </Link>
              <div className={styles.contactDirect}>
                <span className={`ed-close-label ${styles.contactDirectLabel}`}>
                  Or write directly
                </span>
                <a
                  className={`ed-textlink ${styles.contactEmail}`}
                  href={`mailto:${contact.email}`}
                >
                  {contact.email}
                </a>
              </div>
            </div>
          </div>
        </Lift>
      </section>
    </div>
  )
}
