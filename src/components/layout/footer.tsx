'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigation, siteConfig } from '@/lib/content'

function resolveHref(href: string, isHomepage: boolean) {
  return href.startsWith('#') && !isHomepage ? `/${href}` : href
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  const isHomepage = usePathname() === '/'

  return (
    <footer className="relative z-10 border-t border-border bg-bg-primary text-text-primary">
      <div
        className="container-main py-12 sm:py-16"
        style={{ paddingBottom: 'calc(var(--safe-area-bottom) + 3rem)' }}
      >
        <div className="grid gap-10 border-b border-border pb-10 md:grid-cols-[minmax(16rem,1fr)_2fr] md:gap-16">
          <div>
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center text-sm font-semibold tracking-[0.2em]"
            >
              ULIXES
            </Link>
            <p className="mt-3 max-w-sm text-body-sm text-text-secondary">
              {siteConfig.advisoryLine}
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3"
          >
            {navigation.footer.main.map((item) => (
              <Link
                key={item.label}
                href={resolveHref(item.href, isHomepage)}
                className="inline-flex min-h-[44px] items-center text-body-sm text-text-secondary transition-colors hover:text-text-primary"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={siteConfig.linkedIn}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn (opens in a new tab)"
              className="inline-flex min-h-[44px] items-center text-body-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              LinkedIn
            </a>
          </nav>
        </div>

        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm text-text-muted">
            &copy; {currentYear} {siteConfig.name}
          </p>

          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-6">
            {navigation.footer.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-body-sm text-text-muted transition-colors hover:text-text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
