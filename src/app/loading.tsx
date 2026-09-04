import styles from './loading.module.css'

/*
 * Root Suspense boundary for every segment that does not define its own.
 *
 * Without this, App Router has nothing to show while a route's payload is in
 * flight, so the previous page stays on screen unchanged and the navigation
 * appears not to have registered. With it, the click is acknowledged
 * immediately and the wait is legible.
 */
export default function Loading() {
  return (
    <div className={styles.loading} role="status" aria-live="polite">
      <div className={styles.shell}>
        <div className={styles.rule} />
        <p className={styles.label}>Loading</p>
      </div>
    </div>
  )
}
