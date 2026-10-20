'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CONTACT_HREF, dockRoutes, isActiveRoute } from './routes'
import styles from './phone-dock.module.css'

const icons = {
  home: <path d="M4 10.5 12 4l8 6.5V20h-5v-6h-6v6H4z" />,
  services: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  experience: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />
    </>
  ),
  calypso: <path d="M3 17h4l3-9 4 12 3-7h4" />,
} as const

/**
 * The phone navigation, <= 767px only, fixed to the bottom above the home
 * indicator. Rendered once by the root layout. The footer reserves room for
 * it; anything else pinned to the bottom of a phone page must clear
 * var(--dock-clearance).
 */
export function PhoneDock() {
  const pathname = usePathname()
  const contactActive = isActiveRoute(pathname, CONTACT_HREF)

  return (
    <div className={styles.root} data-phone-dock>
      <div className={styles.fade} aria-hidden="true" />
      <nav aria-label="Quick navigation" className={styles.dock}>
        <div className={styles.tray}>
          {dockRoutes.map((route) => {
            const active = isActiveRoute(pathname, route.href)
            return (
              <Link
                key={route.href}
                href={route.href}
                className={[styles.item, active ? styles.on : ''].filter(Boolean).join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
                  {icons[route.icon]}
                </svg>
                {route.label}
              </Link>
            )
          })}
        </div>
        <Link
          href={CONTACT_HREF}
          className={styles.go}
          aria-label="Discuss a mandate"
          aria-current={contactActive ? 'page' : undefined}
        >
          <span aria-hidden="true">↗</span>
        </Link>
      </nav>
    </div>
  )
}
