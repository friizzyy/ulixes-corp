import Link from 'next/link'
import { navigation, siteConfig } from '@/lib/content'
import { editorialNavigation } from '@/lib/homepage-content'
import { HomeBrand } from '@/components/home/home-brand'

/*
 * One footer for every route: the editorial directory and the persistent
 * action. The interior variant (bracket wordmark, content.ts link order)
 * retired with the dark theme, and the pathname check went with it, so this
 * no longer needs to be a client component.
 */
const footerLinks = [
  ...editorialNavigation,
  { label: 'Discuss a mandate', href: '/contact' },
] as const

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative z-10 border-t border-[#d7dcde] bg-[#f3f1ec] text-[#10212b]">
      {/* The bottom padding floors on the home-indicator inset. */}
      <div className="container-main max-w-[78rem] pb-[calc(var(--safe-area-bottom)+1.5rem)] pt-6 sm:pb-[calc(var(--safe-area-bottom)+2.5rem)] sm:pt-12 md:pt-14">
        <div className="flex flex-col gap-5 pb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:pb-8 md:pb-10">
          <div
            role="group"
            aria-label="Footer brand and contact"
            className="flex min-h-[44px] items-center justify-between gap-4 sm:block"
          >
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center self-start"
            >
              <HomeBrand />
            </Link>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex min-h-[44px] items-center text-[0.78rem] text-[#5d6e75] transition-colors hover:text-[#10212b] sm:hidden"
            >
              {siteConfig.email}
            </a>
          </div>

          <nav
            aria-label="Footer navigation"
            data-mobile-layout="route-grid"
            className="w-full sm:w-auto"
          >
            <ul className="grid grid-cols-2 border-l border-t border-[#d7dcde] sm:flex sm:max-w-2xl sm:flex-wrap sm:justify-end sm:gap-x-7 sm:gap-y-2 sm:border-0">
              {footerLinks.map((item, index) => (
                <li key={item.href} className="border-b border-r border-[#d7dcde] sm:border-0">
                  <Link
                    href={item.href}
                    className="inline-flex min-h-[var(--mobile-control-height)] w-full items-center justify-between px-3 text-[0.82rem] tracking-[0.01em] text-[#455860] transition-colors hover:text-[#10212b] sm:min-h-[44px] sm:w-auto sm:px-0 sm:text-[#5d6e75]"
                  >
                    <span>{item.label}</span>
                    <span
                      data-footer-index
                      className="font-mono text-[0.66rem] font-semibold tracking-[0.1em] text-[#607178] sm:hidden"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-1 border-t border-[#d7dcde] pt-4 text-[0.78rem] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-6">
          <p className="order-2 pt-2 text-[#5d6e75] sm:order-none sm:pt-0">
            &copy; {currentYear} {siteConfig.name}
          </p>

          <div
            role="group"
            aria-label="Footer legal"
            className="order-1 flex items-center gap-x-5 sm:order-none sm:gap-x-6 sm:gap-y-1"
          >
            <a
              href={`mailto:${siteConfig.email}`}
              className="hidden sm:inline-flex sm:min-h-[44px] sm:items-center sm:text-[#5d6e75]"
            >
              {siteConfig.email}
            </a>
            {navigation.footer.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-start text-[#5d6e75] transition-colors hover:text-[#10212b] sm:justify-center"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
