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
      <div className="container-main max-w-[78rem] pb-[calc(var(--safe-area-bottom)+1.5rem)] pt-6 min-[896px]:pb-[calc(var(--safe-area-bottom)+2.5rem)] min-[896px]:pt-14">
        <div className="flex flex-col gap-5 pb-6 min-[896px]:flex-row min-[896px]:items-start min-[896px]:justify-between min-[896px]:gap-8 min-[896px]:pb-10">
          <div
            role="group"
            aria-label="Footer brand and contact"
            className="flex min-h-[44px] items-center justify-between gap-4 min-[896px]:block"
          >
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center self-start"
            >
              <HomeBrand />
            </Link>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex min-h-[44px] items-center text-[0.78rem] text-[#5d6e75] transition-colors hover:text-[#10212b] min-[896px]:hidden"
            >
              {siteConfig.email}
            </a>
          </div>

          <nav
            aria-label="Footer navigation"
            data-mobile-layout="route-grid"
            className="w-full min-[896px]:w-auto"
          >
            <ul className="grid grid-cols-2 border-l border-t border-[#d7dcde] min-[896px]:flex min-[896px]:max-w-2xl min-[896px]:flex-wrap min-[896px]:justify-end min-[896px]:gap-x-7 min-[896px]:gap-y-2 min-[896px]:border-0">
              {footerLinks.map((item, index) => (
                <li key={item.href} className="border-b border-r border-[#d7dcde] min-[896px]:border-0">
                  <Link
                    href={item.href}
                    className="inline-flex min-h-[var(--mobile-control-height)] w-full items-center justify-between px-3 text-[0.82rem] tracking-[0.01em] text-[#455860] transition-colors hover:text-[#10212b] min-[896px]:min-h-[44px] min-[896px]:w-auto min-[896px]:px-0 min-[896px]:text-[#5d6e75]"
                  >
                    <span>{item.label}</span>
                    <span
                      data-footer-index
                      className="font-mono text-[0.66rem] font-semibold tracking-[0.1em] text-[#607178] min-[896px]:hidden"
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

        <div className="flex flex-col gap-1 border-t border-[#d7dcde] pt-4 text-[0.78rem] min-[896px]:flex-row min-[896px]:items-center min-[896px]:justify-between min-[896px]:gap-4 min-[896px]:pt-6">
          <p className="order-2 pt-2 text-[#5d6e75] min-[896px]:order-none min-[896px]:pt-0">
            &copy; {currentYear} {siteConfig.name}
          </p>

          <div
            role="group"
            aria-label="Footer legal"
            className="order-1 flex items-center gap-x-5 min-[896px]:order-none min-[896px]:gap-x-6 min-[896px]:gap-y-1"
          >
            <a
              href={`mailto:${siteConfig.email}`}
              className="hidden min-[896px]:inline-flex min-[896px]:min-h-[44px] min-[896px]:items-center min-[896px]:text-[#5d6e75]"
            >
              {siteConfig.email}
            </a>
            {navigation.footer.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-start text-[#5d6e75] transition-colors hover:text-[#10212b] min-[896px]:justify-center"
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
