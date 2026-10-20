import { Eyebrow, Section } from '@/components/site'
import { pad, servicesContent } from '@/lib/services-content'
import { ApproachReveal } from './approach-reveal'
import styles from './approach.module.css'

const { approach } = servicesContent

/*
 * "Go-live is not success." (04-approach-desk, 03-approach-ph). A centred
 * heading over the four phases: a line card ending on FIRST CLOSE from 768
 * up, one paper card with a vertical rail ending at a hollow ring on phones.
 */
export function Approach() {
  return (
    <Section aria-labelledby="services-approach-title">
      <div className={styles.tp}>
        <div>
          <Eyebrow centred className={styles.eyebrow}>{approach.eyebrow}</Eyebrow>
          <h2 id="services-approach-title" className={`d ${styles.h}`}>
            {approach.lead} <span className="s">{approach.turn}</span>
          </h2>
        </div>
        <p className={styles.lede}>{approach.body}</p>
      </div>

      <ApproachReveal className={styles.cd}>
        <div
          className={styles.rl}
          role="img"
          aria-label={`Four phases, ending at the ${approach.end.toLowerCase()}`}
        >
          <i />
          <i />
          <i />
          <i />
          <span className={styles.end}>
            <b />
            {approach.end.toUpperCase()}
          </span>
        </div>
        <ol className={styles.g}>
          {approach.phases.map((phase, index) => (
            <li key={phase.title} className={styles.ph}>
              <span className={styles.n} aria-hidden="true">
                {pad(index + 1)}
              </span>
              <h3 className={styles.phTitle}>{phase.title}</h3>
              <p>{phase.description}</p>
            </li>
          ))}
        </ol>
      </ApproachReveal>

      <ol className={styles.pl} data-phone-phases>
        {approach.phases.map((phase, index) => (
          <li key={phase.title}>
            <div>
              <span className={styles.n} aria-hidden="true">
                {pad(index + 1)}
              </span>
              <h3 className={styles.phTitle}>{phase.title}</h3>
              <p>{phase.description}</p>
            </div>
          </li>
        ))}
        <li className={styles.plEnd}>
          <div>{approach.end.toUpperCase()}</div>
        </li>
      </ol>
    </Section>
  )
}
