import Link from 'next/link'
import { siteConfig } from '@/lib/content'
import styles from './site-footer.module.css'

/*
 * Signposts. There are no /accessibility or /disclosures routes, so those two
 * point at the real places that cover them: accessibility requests go to the
 * practice's inbox, and the "not investment advice" disclosure is the
 * Services clause of the terms (#services, id from toLegalSections).
 */
export const footerSignposts = [
  { label: 'Privacy Policy', sub: 'How inquiries are handled', href: '/privacy' },
  { label: 'Terms of Service', sub: 'The terms of using this site', href: '/terms' },
  {
    label: 'Accessibility',
    sub: 'Our commitment to access',
    href: `mailto:${siteConfig.email}?subject=${encodeURIComponent('Accessibility')}`,
  },
  { label: 'Disclosures', sub: 'Not investment advice', href: '/terms#services' },
] as const

const LINKEDIN_URL = 'https://www.linkedin.com/in/ulysses-williams-2379634/'
const MAP_URL = 'https://www.google.com/maps/place/San+Francisco,+CA'

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const

function Signpost({ label, sub, href }: { label: string; sub: string; href: string }) {
  const content = (
    <>
      <span className={styles.v}>{label}</span>
      <span className={styles.sub}>{sub}</span>
      <i className={styles.go} aria-hidden="true">
        <svg viewBox="0 0 14 14" fill="none">
          <path d="M4 10L10 4M5 4h5v5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </i>
    </>
  )
  if (href.startsWith('mailto:')) {
    return (
      <a href={href} className={styles.sg}>
        {content}
      </a>
    )
  }
  return (
    <Link href={href} className={styles.sg}>
      {content}
    </Link>
  )
}

/** The page close, rendered once by the root layout. Adds the rhythm above itself. */
export function SiteFooter() {
  const year = new Date().getFullYear()
  const tel = `tel:${siteConfig.phone.replace(/[^+\d]/g, '')}`

  return (
    <footer className={styles.f}>
      <div className={styles.fm}>
        <div className={styles.ld}>
          <p className={styles.q}>
            Senior-led, <span className="s">from the first decision.</span>
          </p>
          <span className={styles.reach}>San Francisco · North America, Europe, APAC, Latin America</span>
        </div>

        <nav aria-label="Legal and disclosures" className={styles.bar}>
          {footerSignposts.map((item) => (
            <Signpost key={item.label} {...item} />
          ))}
        </nav>

        <div className={styles.wm} aria-hidden="true">
          <span>ULIXES</span>
        </div>

        <div className={styles.bt}>
          <p>
            <span className={styles.cLong}>© {year} Ulixes Corporation · San Francisco</span>
            <span className={styles.cShort}>© {year} Ulixes Corporation</span>
          </p>
          <div className={styles.ic}>
            <a href={tel} aria-label={`Call ${siteConfig.phone}`} title="Call">
              <svg {...iconProps}>
                <path d="M6.5 3.5h3l1.5 4-2 1.2a11 11 0 0 0 5.3 5.3l1.2-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />
              </svg>
            </a>
            <a href={`mailto:${siteConfig.email}`} aria-label={`Email ${siteConfig.email}`} title="Email">
              <svg {...iconProps}>
                <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
                <path d="M3.5 7l8.5 6 8.5-6" />
              </svg>
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" title="LinkedIn">
              <svg {...iconProps}>
                <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
                <path d="M8 10.5V16M8 8v.01M12 16v-3.2a2.3 2.3 0 0 1 4.6 0V16M12 10.5V16" />
              </svg>
            </a>
            <a href={MAP_URL} target="_blank" rel="noopener noreferrer" aria-label="San Francisco on the map (opens in a new tab)" title="San Francisco">
              <svg {...iconProps}>
                <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
                <circle cx="12" cy="10" r="2.3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
