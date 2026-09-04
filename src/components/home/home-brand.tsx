type HomeBrandProps = {
  compact?: boolean
  className?: string
}

export function HomeBrand({ compact = false, className }: HomeBrandProps) {
  return (
    <span className={cn(styles.brand, compact && styles.compact, className)}>
      <svg
        className={styles.monogram}
        viewBox="0 0 30 30"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M4 3h6v14c0 4.1 1.8 6.2 5 6.2s5-2.1 5-6.2V3h6v14c0 7.5-4.2 11-11 11S4 24.5 4 17V3Z"
          fill="currentColor"
        />
      </svg>
      <span className={styles.wordmark}>
        <span className={styles.name}>ULIXES</span>
        {!compact && (
          <>
            {' '}
            <span className={styles.descriptor}>CORPORATION</span>
          </>
        )}
      </span>
    </span>
  )
}
import { cn } from '@/lib/utils'
import styles from './home-brand.module.css'
