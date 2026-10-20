'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brand } from './brand'
import { SlabButton } from './slab-button'
import { CONTACT_HREF, headerRoutes, heroBrandRoutes, isActiveRoute } from './routes'
import styles from './site-header.module.css'

/**
 * The page header, rendered once by the root layout.
 *
 * >= 768px: brand, the three route links (the active one carries the solid
 * underline, hover draws it at .35) and the Discuss a mandate slab.
 * <= 767px: the desktop row is hidden. The phone brand bar shows instead,
 * except on heroBrandRoutes, whose hero image draws <Brand tone="light" />.
 * Phone navigation is the fixed <PhoneDock />.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const heroBrand = heroBrandRoutes.some((route) => isActiveRoute(pathname, route))

  return (
    <header className={styles.root}>
      <div className={styles.hdr} data-site-header="desktop">
        <Brand />
        <nav aria-label="Primary" className={styles.nav}>
          {headerRoutes.map((route) => {
            const active = isActiveRoute(pathname, route.href)
            return (
              <Link
                key={route.href}
                href={route.href}
                className={[styles.link, active ? styles.on : ''].filter(Boolean).join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                {route.label}
              </Link>
            )
          })}
        </nav>
        <SlabButton href={CONTACT_HREF}>Discuss a mandate</SlabButton>
      </div>
      {heroBrand ? null : (
        <div className={styles.bar} data-site-header="phone">
          <Brand />
        </div>
      )}
    </header>
  )
}
