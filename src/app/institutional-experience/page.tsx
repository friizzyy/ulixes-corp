import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, MobileDisclosure } from '@/components/ui'
import { InstitutionCarousel } from '@/components/experience/institution-carousel'
import { MobileInstitutionReader } from '@/components/experience/mobile-institution-reader'
import {
  institutionalExperienceContent,
  institutionsMedia,
  practitionerPortrait,
} from '@/lib/institutional-experience-content'
import styles from './institutional-experience.module.css'

/*
 * Built to the consulting reference Julius picked: a contained intro panel
 * carrying a statistic row, an alternating image and copy block for the
 * practitioner, a credential checklist, and a card grid.
 *
 * The reference's statistics are invented (95%, 10+, $10m). This page carries
 * the four verified facts at that scale instead, which is the only kind of
 * claim the guardrails permit.
 */

/*
 * The scope section is gone. It was eleven short labels with no room for
 * depth, and both of its facts (front to back, four regions) belong to the
 * homepage credential dock rather than to this page.
 */
const { introduction, practitioner, institutions, principles, contact } =
  institutionalExperienceContent

export default function InstitutionalExperiencePage() {
  return (
    <div className={styles.page} data-surface="editorial">
      <section
        className={styles.hero}
        aria-labelledby="experience-title"
        data-mobile-flow="copy-first"
      >
        <div
          className={styles.heroStage}
          data-depth-composition="institutional-threshold"
        >
          {/* The institutional interior sits behind him, masked, so the portrait
              reads as being inside it rather than beside a picture of it. */}
          <div
            className={styles.heroMedia}
            aria-hidden="true"
            data-depth-plane="recessed-architecture"
          >
            <Image
              src={institutionsMedia.src}
              alt=""
              fill
              priority
              sizes="(max-width: 895px) 320px, 60vw"
              className={styles.heroMediaImage}
            />
          </div>
          <div className={styles.heroTone} aria-hidden="true" />

          <div className={`${styles.shell} ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={`ed-eyebrow ${styles.badge}`}>{introduction.eyebrow}</p>
              <h1 id="experience-title" className={styles.heroTitle}>
                {introduction.headlineLead}{' '}
                <em className={styles.turn}>{introduction.headlineTurn}</em>
              </h1>
              <p className={styles.heroBody}>{introduction.body}</p>

              <p className={styles.roleLine}>
                <span>{practitioner.name}</span>
                <span aria-hidden="true">·</span>
                <span>{practitioner.role}</span>
                <span aria-hidden="true">·</span>
                <span>{practitioner.specialism}</span>
              </p>

              <div className={styles.heroActions}>
                <Link href="/contact" className={`ed-primary ${styles.action}`}>
                  <span>{introduction.cta}</span>
                  <span className="ed-chamber" aria-hidden="true">
                    <ArrowUpRight size={17} />
                  </span>
                </Link>
                <a
                  className={`ed-textlink ${styles.textLink}`}
                  href={practitioner.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.textLinkLabel}>
                    {practitioner.cta}
                    <ArrowUpRight size={16} />
                  </span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </div>

            {/* Framed rather than masked. A portrait dissolving into the page
                would fade a face out, which a material study can take and a
                person cannot. */}
            <div
              className={styles.heroPortrait}
              data-depth-plane="raised-portrait"
            >
              <Image
                src={practitionerPortrait.src}
                alt={practitionerPortrait.alt}
                fill
                priority
                sizes="(max-width: 895px) 250px, 38vw"
                className={styles.heroPortraitImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/*
        The three sections below the hero were the same layout atom three times:
        a two-column header, then NN/Title/Description repeated. They cost 2137px
        between them to carry 13 short entries. These are registers instead:
        dense, multi-column, ruled, and set inside one raised surface each, which
        is where the homepage's depth actually comes from. No decorative imagery:
        the only photographs on this page are the two in the hero, which carry
        the subject rather than fill space.
      */}
      <section
        className={styles.institutionsSection}
        aria-labelledby="institutions-title"
      >
        {/*
          No plate around this one. The entries are raised cards now, and a
          raised card inside a raised card reads as muddle rather than as depth;
          one surface per section is the rule the homepage actually follows.
        */}
        <div
          className={`${styles.shell} ${styles.institutionShelf}`}
          data-depth-plane="recessed-institution-shelf"
        >
          <div className={styles.plateHead}>
            <div>
              <p className={`ed-eyebrow ${styles.marginLabel}`}>{institutions.eyebrow}</p>
              <h2 id="institutions-title" className={styles.plateTitle}>
                {institutions.headlineLead}{' '}
                <em className={styles.turn}>{institutions.headlineTurn}</em>
              </h2>
            </div>
            <p className={styles.plateLead}>{institutions.body}</p>
          </div>

          {/* The wide layout keeps the drifting evidence rail. Touch layouts
              use a separate reader so only the selected brief is mounted. */}
          <div className={styles.desktopInstitutions} data-visible-from="896px">
            <InstitutionCarousel />
          </div>
          <MobileInstitutionReader categories={institutions.categories} />
        </div>
      </section>

      {/*
        Kept on a dark ground: it is the one tonal break on the page, and it is
        what stops three light registers reading as one undifferentiated run.
        Neutral charcoal rather than --ink, which is a blue slate and reads
        unmistakably blue across a whole section.
      */}
      <section
        className={styles.principlesSection}
        aria-labelledby="principles-title"
      >
        <div className={styles.shell}>
          <div
            className={styles.chapterHead}
            data-heading-composition="centered"
          >
            <p className={`ed-eyebrow ${styles.marginLabel}`}>{principles.eyebrow}</p>
            <h2 id="principles-title" className={styles.chapterTitle}>
              {principles.headlineLead}{' '}
              <em className={styles.turn}>{principles.headlineTurn}</em>
            </h2>
          </div>

          <ol
            className={styles.positions}
            aria-label="Ulixes delivery principles"
            data-visible-from="896px"
          >
            {principles.items.map((item, index) => (
              <li key={item.title}>
                <span className={styles.positionIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
          <div
            className={styles.mobilePositions}
            data-visible-through="895px"
          >
            <MobileDisclosure
              ariaLabel="Working positions"
              tone="dark"
              defaultOpenId="working-position-1"
              allowCollapse={false}
              items={principles.items.map((item, index) => ({
                id: `working-position-${index + 1}`,
                index: String(index + 1).padStart(2, '0'),
                title: item.title,
                panel: <p className={styles.positionPanel}>{item.description}</p>,
              }))}
            />
          </div>
        </div>
      </section>

      {/* Continuous with the chapter above rather than a fourth full section. */}
      <section className={styles.closeSection} aria-labelledby="inquiry-title">
        <div className={`${styles.shell} ${styles.closeCard}`}>
          <div>
            <p className={`ed-eyebrow ${styles.marginLabel}`}>{contact.eyebrow}</p>
            <h2 id="inquiry-title" className={styles.closeTitle}>
              {contact.headlineLead}{' '}
              <em className={styles.turn}>{contact.headlineTurn}</em>
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
            <a className={`ed-textlink ${styles.closeEmail}`} href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <p className={styles.closeResponse}>{contact.response}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
