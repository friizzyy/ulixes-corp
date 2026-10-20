import { Eyebrow, Section, SlabButton, TextLink } from '@/components/site'
import { homepageContent } from '@/lib/homepage-content'
import { ServicesIndex } from './services-index'
import styles from './services.module.css'

/* 02-svteaser: the centred heading over the four-row services index. */
export function HomeServices() {
  const { services } = homepageContent

  return (
    <Section aria-labelledby="home-services-title">
      <div className={styles.head}>
        <Eyebrow centred>{services.eyebrow}</Eyebrow>
        <h2 id="home-services-title" className={`d ${styles.title}`}>
          {services.headlineLead} <span className="s">{services.headlineTurn}</span>
        </h2>
        <div className={styles.intro}>
          <p>{services.body}</p>
          <TextLink href={services.href}>{services.cta}</TextLink>
        </div>
      </div>
      <ServicesIndex items={services.items} />
      <div className={styles.phoneCta}>
        <SlabButton href={services.href} variant="ghost" arrow="→" block>
          {services.cta}
        </SlabButton>
      </div>
    </Section>
  )
}
