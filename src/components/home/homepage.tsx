import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from '@/components/ui/icons'
import {
  authorityItems,
  homepageContent,
  serviceModules,
} from '@/lib/homepage-content'
import {
  Cascade,
  CascadeItem,
  Curtain,
  Lift,
} from '@/components/motion/editorial-motion'
import { AuthorityIcon, ServiceIcon } from './home-icons'
import { HomeHeroMedia } from './home-hero-media'
import { MobileCapabilityIndex } from './mobile-capability-index'
import styles from './homepage.module.css'

export function Homepage() {
  return (
    <div className={styles.page} data-surface="editorial">
      <section
        className={styles.hero}
        aria-labelledby="home-hero-title"
        data-mobile-flow="image-led"
      >
        <div
          className={styles.heroScene}
          data-depth-composition="city-threshold"
          data-mobile-layout="image-background"
        >
          <div className={styles.heroCopy} data-depth-plane="raised-message">
            <p className={styles.eyebrow}>{homepageContent.hero.eyebrow}</p>
            <Curtain className="ed-curtain ed-curtain--line" delay={0.05}>
              <h1
                id="home-hero-title"
                className={styles.heroTitle}
                aria-label={homepageContent.hero.headline}
                data-mobile-title="two-lines"
              >
                {homepageContent.hero.headlineLines.map((line, index) => (
                  <span
                    key={line}
                    className={styles.heroTitleLine}
                    data-hero-line
                  >
                    {line}
                    {index < homepageContent.hero.headlineLines.length - 1
                      ? ' '
                      : null}
                  </span>
                ))}
              </h1>
            </Curtain>
            <p className={styles.heroBody}>{homepageContent.hero.body}</p>
            <Lift delay={0.34} amount={0}>
              <div
                className={styles.heroActions}
                data-mobile-layout="paired-actions"
              >
                <Link href="/contact" className={styles.primaryAction}>
                  <span>{homepageContent.hero.primaryCta}</span>
                  <span className={styles.actionChamber} aria-hidden="true">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>
                <Link href="#expertise" className={styles.secondaryAction}>
                  {homepageContent.hero.secondaryCta}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </Lift>
          </div>
          <HomeHeroMedia
            imageAlt={homepageContent.hero.imageAlt}
            videoSrc="/media/home/ulixes-san-francisco-loop.mp4"
          />
          <div className={styles.heroTone} aria-hidden="true" />

          <Cascade
            className={styles.authorityDock}
            label="Ulixes advisory perspective"
            amount={0}
            data-mobile-layout="two-by-two"
            data-depth-plane="raised-ledger"
          >
            {authorityItems.map((item, index) => (
              <CascadeItem
                key={item.value}
                className={styles.authorityItem}
                primary={index === 0}
              >
                <span className={styles.authoritySignal}>
                  <span className={styles.authorityIcon} aria-hidden="true">
                    <AuthorityIcon name={item.icon} size={25} />
                  </span>
                  <span className={styles.authorityContext}>{item.context}</span>
                </span>
                <span className={styles.authorityCopy}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </span>
              </CascadeItem>
            ))}
          </Cascade>
        </div>
      </section>

      <section
        id="expertise"
        className={styles.services}
        aria-labelledby="services-title"
      >
        <div className={styles.contentShell}>
          <div className={styles.sectionIntro}>
            <div
              className={styles.sectionHeading}
              data-heading-composition="centered-command"
            >
              <p className={styles.eyebrow}>{homepageContent.services.eyebrow}</p>
              <Curtain className="ed-curtain" inView>
                <h2
                  id="services-title"
                  className={styles.sectionTitle}
                  aria-label={homepageContent.services.headline}
                  data-mobile-title="two-lines"
                >
                  <span className={styles.servicesTitleLine}>
                    Four points where
                  </span>{' '}
                  <span className={styles.servicesTitleLine}>
                    delivery risk concentrates.
                  </span>
                </h2>
              </Curtain>
            </div>
            <div className={styles.sectionLead}>
              <p>{homepageContent.services.body}</p>
              <Link href="/services" className={styles.textLink}>
                {homepageContent.services.cta}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <Cascade
            as="ol"
            className={`${styles.engagementField} ${styles.serviceLedger} ${styles.desktopCapabilityLedger}`}
            label="Ulixes capabilities"
            data-layout="ledger"
            data-mobile-layout="action-list"
            data-depth-plane="recessed-decision-shelf"
          >
            {serviceModules.map((service, index) => (
              <CascadeItem key={service.id} data-material={service.material}>
                <Link href={service.href} className={styles.serviceLink}>
                  <span className={styles.serviceMarker}>
                    <span
                      className={styles.serviceGlyph}
                      data-service-icon
                      aria-hidden="true"
                    >
                      <ServiceIcon name={service.icon} size={23} />
                    </span>
                    <span className={styles.serviceIndex}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </span>
                  <span className={styles.serviceCore}>
                    <strong>{service.title}</strong>
                  </span>
                  <span className={styles.serviceDetail}>
                    <span className={styles.serviceScope}>{service.scope}</span>
                    <span className={styles.serviceDescription}>
                      {service.description}
                    </span>
                  </span>
                  <span className={styles.serviceAction} aria-hidden="true">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>
              </CascadeItem>
            ))}
          </Cascade>
          <MobileCapabilityIndex
            items={serviceModules}
            className={styles.mobileCapabilityIndex}
          />
        </div>
      </section>

      {/* One ruled statement on the rail, no panel: the platform credential
          stays visible without leading the page. */}
      <section
        id="calypso"
        className={styles.calypsoBand}
        aria-labelledby="calypso-title"
      >
        <div className={`${styles.contentShell} ${styles.calypsoRow}`}>
          <div className={styles.calypsoFigure}>
            <p className={styles.eyebrow}>{homepageContent.calypso.eyebrow}</p>
            <p className={styles.calypsoSince}>
              <span className={styles.calypsoSinceLabel}>
                {homepageContent.calypso.sinceLabel}
              </span>
              <Curtain className="ed-curtain" as="span" inView>
                <span className={styles.calypsoYear}>
                  {homepageContent.calypso.since}
                </span>
              </Curtain>
            </p>
          </div>
          <div className={styles.calypsoCopy}>
            <Curtain className="ed-curtain" inView delay={0.08}>
              <h2 id="calypso-title" className={styles.calypsoTitle}>
                {homepageContent.calypso.headline}
              </h2>
            </Curtain>
            <p className={`${styles.calypsoBody} ${styles.desktopCalypsoBody}`}>
              {homepageContent.calypso.body}
            </p>
            <p className={`${styles.calypsoBody} ${styles.mobileCalypsoBody}`}>
              One trade path, continuous across front, middle, and back office.
            </p>
          </div>
          <Link
            href={homepageContent.calypso.href}
            className={`${styles.textLink} ${styles.calypsoLink}`}
          >
            {homepageContent.calypso.cta}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section
        id="approach"
        className={styles.credibility}
        aria-labelledby="credibility-title"
      >
        <div className={`${styles.contentShell} ${styles.credibilityGrid}`}>
          <div className={styles.credibilityCopy}>
            <p className={styles.eyebrow}>
              {homepageContent.credibility.eyebrow}
            </p>
            <Curtain className="ed-curtain" inView>
              <h2 id="credibility-title" className={styles.sectionTitle}>
                {homepageContent.credibility.headline}
              </h2>
            </Curtain>
            <p className={styles.credibilityBody}>
              {homepageContent.credibility.body}
            </p>
            <Cascade className={styles.checkpoints}>
              {homepageContent.credibility.checkpoints.map((checkpoint) => (
                <CascadeItem key={checkpoint}>{checkpoint}</CascadeItem>
              ))}
            </Cascade>
            <a
              href={homepageContent.credibility.linkedinUrl}
              className={`ed-secondary ${styles.linkedinAction}`}
              target="_blank"
              rel="noreferrer"
            >
              <span>{homepageContent.credibility.cta}</span>
              <span className="ed-chamber" aria-hidden="true">
                <ArrowUpRight size={16} />
              </span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <div className={styles.credibilityMedia}>
            <Lift>
              <div className={styles.credibilityImageFrame}>
              {/* The grid goes single column at 899px, not 767px, and above
                  it the media column never exceeds 640px inside the 78rem
                  shell, so the sizes hint follows those widths. */}
                <Image
                  src="/media/home/ulixes-financial-district-day.webp"
                  alt={homepageContent.credibility.imageAlt}
                  fill
                  sizes="(max-width: 895px) 100vw, (max-width: 1120px) 44vw, 640px"
                  className={styles.credibilityImage}
                />
              </div>
            </Lift>
            <aside
              className={styles.footprintPlate}
              aria-label="Ulixes delivery footprint"
            >
              <span className={styles.footprintLabel}>
                {homepageContent.credibility.footprint.label}
              </span>
              <strong>{homepageContent.credibility.footprint.value}</strong>
            </aside>
          </div>
        </div>
      </section>

      <section
        id="contact-invitation"
        className={styles.contactSection}
        aria-labelledby="contact-title"
      >
        <Lift>
          <div className={`${styles.contentShell} ${styles.contactPanel}`}>
            <div className={styles.contactCopy}>
              <p className={styles.contactEyebrow}>
                {homepageContent.contact.eyebrow}
              </p>
              <h2 id="contact-title">{homepageContent.contact.headline}</h2>
              <p className={styles.contactBody}>
                {homepageContent.contact.body}
              </p>
              <p className={styles.contactInstruction}>
                {homepageContent.contact.instruction}
              </p>
            </div>
            <div className={styles.contactActionArea}>
              <Link href="/contact" className={styles.contactAction}>
                <span>{homepageContent.contact.cta}</span>
                <span className={styles.actionChamber} aria-hidden="true">
                  <ArrowUpRight size={17} />
                </span>
              </Link>
              <div className={styles.contactDirect}>
                <span className={styles.contactDirectLabel}>
                  Or write directly
                </span>
                <a
                  className={styles.contactEmail}
                  href={`mailto:${homepageContent.contact.email}`}
                >
                  {homepageContent.contact.email}
                </a>
              </div>
            </div>
          </div>
        </Lift>
      </section>
    </div>
  )
}
