import Link from 'next/link'
import { homepageContent } from '@/lib/homepage-content'
import { SignalNetwork } from './signal-network'
import styles from './homepage.module.css'

export function ClosingSignalCTA() {
  return (
    <section
      className={styles.closingSignal}
      aria-labelledby="closing-signal-title"
    >
      <SignalNetwork
        renderMode="closing"
        className={styles.closingSignalNetwork}
      />
      <div className={styles.closingSignalLayout}>
        <div className={styles.closingSignalCopy}>
          <h2 id="closing-signal-title" className={styles.closingSignalTitle}>
            {homepageContent.closing.headline}
          </h2>
          <p className={styles.closingSignalBody}>
            {homepageContent.closing.body}
          </p>
        </div>
        <Link
          href={homepageContent.closing.href}
          className={styles.closingSignalAction}
        >
          {homepageContent.closing.cta}
        </Link>
      </div>
    </section>
  )
}
