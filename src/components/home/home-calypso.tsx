import { Eyebrow, Section } from '@/components/site'
import { homepageContent } from '@/lib/homepage-content'
import { LifecycleLive } from './lifecycle-live'
import { CalypsoStageLink, LiveStageProvider } from './live-stage'
import styles from './calypso.module.css'

/* 03-calteaser: the ink Calypso band with the live lifecycle. */
export function HomeCalypso() {
  const { calypso } = homepageContent

  return (
    <Section wrap={false} className={styles.section} aria-labelledby="home-calypso-title">
      <div className={styles.band}>
        <LiveStageProvider>
        <div className={`wrap ${styles.grid}`}>
          <div>
            <Eyebrow className={styles.eyebrow}>{calypso.eyebrow}</Eyebrow>
            <h2 id="home-calypso-title" className={`d ${styles.title}`}>
              {calypso.headlineLead} <span className={`s ${styles.turn}`}>{calypso.headlineTurn}</span>
            </h2>
            <p className={styles.lede}>
              <span className={styles.desk}>{calypso.body.desk}</span>
              <span className={styles.phone}>{calypso.body.phone}</span>
            </p>
            <dl className={styles.fx}>
              {calypso.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className={styles.fxLabel}>{stat.label}</dt>
                  <dd className={styles.fxValue}>{stat.value}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.deskCta}>
              <CalypsoStageLink href={calypso.href} stages={calypso.stages}>
                {calypso.cta}
              </CalypsoStageLink>
            </div>
          </div>
          <LifecycleLive stages={calypso.stages} lanes={calypso.lanes} label={calypso.diagramLabel} />
          <div className={styles.phoneCta}>
            <CalypsoStageLink href={calypso.href} stages={calypso.stages} block>
              {calypso.cta}
            </CalypsoStageLink>
          </div>
        </div>
        </LiveStageProvider>
      </div>
    </Section>
  )
}
