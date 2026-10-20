import type { ReactNode } from 'react'
import { calypsoDomains, calypsoProgramsIntro, type CalypsoDomainIcon } from '@/lib/calypso-content'
import styles from './domain-strip.module.css'

const icons: Record<CalypsoDomainIcon, ReactNode> = {
  rates: (
    <>
      <path d="M4 24c5 0 6-14 12-14s7 8 12 8" />
      <path d="M4 28h24" opacity=".4" />
    </>
  ),
  fx: <path d="M6 12h18l-5-5M26 20H8l5 5" />,
  fixed: (
    <>
      <rect x="7" y="5" width="18" height="22" rx="2" />
      <path d="M11 11h10M11 16h10M11 21h6" />
    </>
  ),
  money: (
    <>
      <circle cx="16" cy="16" r="10" />
      <path d="M16 10v6l4 3" />
    </>
  ),
  commodities: <path d="M16 27V12M16 17c-5 0-7-3-7-7 4 0 7 2 7 7ZM16 17c5 0 7-3 7-7-4 0-7 2-7 7Z" />,
  equity: (
    <>
      <path d="M9 6v20M23 6v20" />
      <rect x="6" y="11" width="6" height="9" rx="1" />
      <rect x="20" y="9" width="6" height="8" rx="1" />
    </>
  ),
}

/*
 * "Applied across six product domains": the instrument classes as a slow
 * running strip (04-programs-desk .rib, 03-programs-m-ph .rbm). The list is
 * given once to assistive technology; the drawn strip is two copies so the
 * loop is seamless, and it stands still under reduced motion.
 */
export function DomainStrip() {
  return (
    <div className={styles.rib}>
      <p className={styles.label} id="calypso-domains-label">
        {calypsoProgramsIntro.domainsLabel}
      </p>
      <ul className={styles.sr} aria-labelledby="calypso-domains-label">
        {calypsoDomains.map((d) => (
          <li key={d.name}>{d.name}</li>
        ))}
      </ul>
      <div className={styles.drn} aria-hidden="true">
        <div className={styles.run}>
          {[0, 1].map((copy) =>
            calypsoDomains.map((d) => (
              <span key={`${copy}-${d.name}`}>
                <i>
                  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4">
                    {icons[d.icon]}
                  </svg>
                </i>
                {d.name}
              </span>
            )),
          )}
        </div>
      </div>
    </div>
  )
}
