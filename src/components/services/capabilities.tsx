import { Section } from '@/components/site'
import {
  lifecycleStages,
  pad,
  serviceCapabilities,
  servicesContent,
  spanRange,
} from '@/lib/services-content'
import { CapabilityIcon, CheckIcon } from './capability-icons'
import { CapabilityRail } from './capability-rail'
import styles from './capabilities.module.css'

/*
 * The four capability cards (03-rows-desk, 02-rows-ph). One set of cards: a
 * four-up subgrid on desktop (so titles, descriptions, lists and spans align
 * across cards), two-up on tablet, a swipe carousel with progress dashes on
 * the phone.
 */
export function Capabilities() {
  return (
    <Section
      wrap={false}
      id="capabilities"
      className={styles.section}
      aria-label={servicesContent.capabilities.label}
    >
      <CapabilityRail titles={serviceCapabilities.map((c) => c.title)}>
        {serviceCapabilities.map((capability, index) => {
          const [from, to] = spanRange(capability)
          const count = to - from + 1
          const titleId = `capability-${capability.id}-title`
          return (
            <article
              key={capability.id}
              id={capability.id}
              className={styles.cd}
              aria-labelledby={titleId}
              data-capability-card
            >
              <div className={styles.tp}>
                <CapabilityIcon id={capability.id} className={styles.icon} />
                <span className="m" aria-hidden="true">
                  {pad(index + 1)}
                </span>
              </div>
              <h2 id={titleId} className={styles.title}>
                {capability.title}
              </h2>
              <p className={styles.ds}>{capability.description}</p>
              <ul className={styles.list}>
                {capability.covers.map((item) => (
                  <li key={item}>
                    <CheckIcon className={styles.check} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.sl}>
                <p className={styles.slLabel}>
                  {servicesContent.capabilities.spanLabel.toUpperCase()} · {count} OF{' '}
                  {lifecycleStages.length} STAGES
                </p>
                <div
                  className={styles.spn}
                  role="img"
                  aria-label={
                    count === lifecycleStages.length
                      ? 'Spans every stage, capture to reporting'
                      : `Spans ${capability.span.from.toLowerCase()} to ${capability.span.to.toLowerCase()}`
                  }
                >
                  {lifecycleStages.map((stage, stageIndex) => (
                    <i
                      key={stage}
                      className={stageIndex >= from && stageIndex <= to ? styles.on : undefined}
                    />
                  ))}
                </div>
              </div>
            </article>
          )
        })}
      </CapabilityRail>
    </Section>
  )
}
