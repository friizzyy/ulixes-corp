/*
 * The site's routes, defined once for the header, the phone dock and the
 * tests. `isActiveRoute` treats a route as active on itself and on any path
 * below it ('/services' is active on '/services#rows'); '/' is exact.
 */

export const CONTACT_HREF = '/contact'

export interface SiteRoute {
  label: string
  href: string
}

/** Desktop and tablet top navigation (the brand is the way home). */
export const headerRoutes: readonly SiteRoute[] = [
  { label: 'Services', href: '/services' },
  { label: 'Experience', href: '/institutional-experience' },
  { label: 'Nasdaq Calypso', href: '/nasdaq-calypso' },
]

/** Phone dock items, in order; the ink contact square follows them. */
export const dockRoutes = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Services', href: '/services', icon: 'services' },
  { label: 'Experience', href: '/institutional-experience', icon: 'experience' },
  { label: 'Calypso', href: '/nasdaq-calypso', icon: 'calypso' },
] as const

/*
 * Routes whose phone hero draws the brand inside the image (the spec's
 * 01-mhero / 01-svhero / 01-calhero / 01-contact phone files). On these the
 * phone brand bar is not rendered and the page draws <Brand tone="light" />
 * itself. Every other route, the legal pages included, gets the bar.
 */
export const heroBrandRoutes: readonly string[] = [
  '/',
  '/services',
  '/nasdaq-calypso',
  '/contact',
]

function normalise(path: string): string {
  const bare = path.split(/[?#]/)[0] || '/'
  return bare.length > 1 ? bare.replace(/\/+$/, '') : bare
}

export function isActiveRoute(pathname: string | null | undefined, href: string): boolean {
  if (!pathname) return false
  const current = normalise(pathname)
  const target = normalise(href)
  if (target === '/') return current === '/'
  return current === target || current.startsWith(`${target}/`)
}
