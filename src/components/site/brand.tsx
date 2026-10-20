import Link from 'next/link'
import styles from './brand.module.css'

export interface BrandProps {
  /** 'ink' on the mineral ground (default); 'light' over an image or dark ground. */
  tone?: 'ink' | 'light'
  /** Link target. Defaults to '/'. Pass null to render the lockup without a link. */
  href?: string | null
  className?: string
}

/** The U mark: the exact path from the spec files. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 30" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      <path d="M4 3h6v14c0 4.1 1.8 6.2 5 6.2s5-2.1 5-6.2V3h6v14c0 7.5-4.2 11-11 11S4 24.5 4 17V3Z" />
    </svg>
  )
}

/** The U mark with the ULIXES / CORPORATION lockup. */
export function Brand({ tone = 'ink', href = '/', className }: BrandProps) {
  const cls = [styles.brand, tone === 'light' ? styles.light : '', className ?? '']
    .filter(Boolean)
    .join(' ')

  const lockup = (
    <>
      <BrandMark className={styles.mark} />
      <span aria-hidden={href ? true : undefined}>
        <b className={styles.name}>ULIXES</b>
        <small className={styles.sub}>CORPORATION</small>
      </span>
    </>
  )

  if (href === null) {
    return (
      <span className={cls} role="img" aria-label="Ulixes Corporation">
        {lockup}
      </span>
    )
  }

  return (
    <Link href={href} className={cls} aria-label="Ulixes Corporation, home">
      {lockup}
    </Link>
  )
}
