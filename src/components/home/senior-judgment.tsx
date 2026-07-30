import { homepageContent } from '@/lib/homepage-content'
import styles from './homepage.module.css'

const linkedInAccessibleName =
  'View Ulysses Williams on LinkedIn (opens in a new tab)'

export function SeniorJudgment() {
  return (
    <section
      className={styles.seniorJudgment}
      data-color-field="mineral"
      aria-labelledby="senior-judgment-title"
    >
      <div className={styles.seniorJudgmentLayout}>
        <span className={styles.seniorSignal} aria-hidden="true" />
        <h2 id="senior-judgment-title" className={styles.seniorJudgmentTitle}>
          {homepageContent.senior.headline}
        </h2>
        <div className={styles.seniorJudgmentCopy}>
          <p className={styles.seniorJudgmentBody}>
            {homepageContent.senior.body}
          </p>
          <a
            className={styles.seniorJudgmentAction}
            href={homepageContent.senior.href}
            target="_blank"
            rel="noreferrer"
            aria-label={linkedInAccessibleName}
          >
            <span>{homepageContent.senior.cta}</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
