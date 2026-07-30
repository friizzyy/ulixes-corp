import { homepageContent, representativeMandates } from '@/lib/homepage-content'
import { SignalNetwork } from './signal-network'
import styles from './homepage.module.css'

export function RepresentativeMandates() {
  return (
    <section
      id="experience"
      className={styles.mandates}
      data-color-field="mineral"
      aria-labelledby="representative-mandates-title"
    >
      <div className={styles.mandatesLayout}>
        <header className={styles.mandatesHeader}>
          <h2
            id="representative-mandates-title"
            className={styles.mandatesTitle}
          >
            {homepageContent.mandates.title}
          </h2>
          <p className={styles.mandatesDescriptor}>
            Representative mandate patterns, not client case studies.
          </p>
        </header>

        <div className={styles.mandatesSequence}>
          {representativeMandates.map((mandate, index) => (
            <article
              key={mandate.id}
              className={styles.mandateMovement}
              data-mandate-id={mandate.id}
              data-mandate-position={index + 1}
            >
              <SignalNetwork
                highlightedStageIds={mandate.stageIds}
                renderMode="path"
                className={styles.mandateRoute}
              />
              <h3 className={styles.mandateTitle}>{mandate.title}</h3>
              <p className={styles.mandateBody}>{mandate.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
