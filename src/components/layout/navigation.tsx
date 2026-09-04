'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ArrowUpRight, Menu, X } from '@/components/ui/icons'
import { HomeBrand } from '@/components/home/home-brand'
import { editorialNavigation } from '@/lib/homepage-content'

/*
 * One chrome for every route. This component used to branch on the pathname
 * between the editorial navigation and a retired interior variant: a
 * bracketed mono wordmark, a purple Get Started pill and the link order from
 * content.ts. Privacy and terms were the last routes on that theme, and with
 * them, not-found and error rebuilt on the editorial surface, nothing selects
 * it any more.
 */
export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const hasImageBackedMasthead = pathname === '/nasdaq-calypso'
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileOverlayRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const lockedScrollYRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    const query = window.matchMedia('(min-width: 896px)')
    const closeAtDesktop = () => {
      if (query.matches) setIsOpen(false)
    }
    closeAtDesktop()
    query.addEventListener('change', closeAtDesktop)
    return () => query.removeEventListener('change', closeAtDesktop)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    lockedScrollYRef.current = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.top = `-${lockedScrollYRef.current}px`
    mobileMenuRef.current?.querySelector<HTMLAnchorElement>('a[href]')?.focus()

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      /*
       * Instant, because html carries scroll-behavior: smooth and a plain
       * scrollTo(0, y) would sweep the page back to where the reader was.
       */
      window.scrollTo({ top: lockedScrollYRef.current, behavior: 'instant' })
    }
  }, [isOpen])

  const closeMenu = useCallback((restoreFocus = false) => {
    setIsOpen(false)
    if (restoreFocus) {
      menuButtonRef.current?.focus()
    }
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        event.preventDefault()
        closeMenu(true)
        return
      }

      if (event.key !== 'Tab' || !isOpen || !mobileOverlayRef.current) return

      /*
       * The toggle sits in the fixed nav, outside the overlay, but it is the
       * dialog's close control, so it leads the cycle: the scrim and the
       * links follow it in DOM order. Left out, Tab from the last link ran
       * back to the logo and Escape was the only keyboard way to close.
       */
      const focusableElements = [
        menuButtonRef.current,
        ...Array.from(
          mobileOverlayRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
          ),
        ),
      ].filter((element): element is HTMLElement => element !== null)
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    },
    [closeMenu, isOpen],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <>
      <nav
        aria-label="Primary navigation"
        data-scrolled={isScrolled ? 'true' : 'false'}
        className={cn(
          'fixed inset-x-0 top-0 text-[#10212b]',
          /*
           * viewportFit is cover, so the chrome pads by the safe-area insets:
           * the top inset is added to the height and the side insets floor
           * the gutters. The editorial page roots carry the same top inset
           * (see editorial.css) so their 64px offsets still clear the nav.
           */
          'h-[calc(var(--mobile-header-height)+var(--safe-area-top))] min-[896px]:h-[calc(76px+var(--safe-area-top))]',
          'pt-[var(--safe-area-top)]',
          'pl-[calc(var(--mobile-gutter)+var(--safe-area-left))] pr-[calc(var(--mobile-gutter)+var(--safe-area-right))]',
          'min-[896px]:pl-[max(2.5rem,var(--safe-area-left))] min-[896px]:pr-[max(2.5rem,var(--safe-area-right))]',
          isOpen ? 'z-[70]' : 'z-50',
          'border-b transition-[background-color,border-color,box-shadow] duration-200',
          isScrolled
            ? 'border-[#d7dcde] bg-[#f3f1ec]/95 shadow-[0_12px_30px_-25px_rgba(16,33,43,0.5)] backdrop-blur-xl'
            : cn(
                'border-transparent bg-transparent',
                hasImageBackedMasthead &&
                  'max-[895px]:border-[#d7dcde] max-[895px]:bg-[#f3f1ec]/95 max-[895px]:shadow-[0_12px_30px_-25px_rgba(16,33,43,0.5)] max-[895px]:backdrop-blur-xl',
              ),
        )}
      >
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center transition-opacity duration-200 hover:opacity-70 focus-visible:opacity-100"
          >
            <HomeBrand />
          </Link>

          <ul className="hidden items-center gap-8 min-[896px]:flex lg:gap-10">
            {editorialNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative inline-flex min-h-[44px] items-center text-[0.82rem] font-medium tracking-[0.01em] text-[#56666d] transition-colors hover:text-[#10212b]',
                      /* The underline reveals on transform, so it never reflows the row. */
                      'after:absolute after:bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#607985] after:transition-transform after:duration-200 hover:after:scale-x-100',
                      isActive && 'after:scale-x-100',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="hidden min-[896px]:block">
            <Link
              href="/contact"
              className="group inline-grid min-h-[46px] grid-cols-[auto_44px] overflow-hidden rounded-[4px] border border-[#10212b] bg-[#10212b] text-[0.82rem] font-semibold text-[#faf9f6] shadow-[0_16px_28px_-23px_rgba(16,33,43,0.8)] transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-[#182c37] active:translate-y-px"
            >
              <span className="flex items-center px-4">Discuss a mandate</span>
              <span
                className="grid place-items-center border-l border-white/20 transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px"
                aria-hidden="true"
              >
                <ArrowUpRight size={16} />
              </span>
            </Link>
          </div>

          <Link
            href="/contact"
            className="ml-auto mr-1 inline-flex min-h-[44px] items-center px-2.5 text-[0.72rem] font-semibold tracking-[0.04em] text-[#30434c] transition-colors hover:text-[#10212b] min-[896px]:hidden"
          >
            Mandate
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => (isOpen ? closeMenu(false) : setIsOpen(true))}
            className="relative -mr-2 flex min-h-[44px] min-w-[44px] items-center justify-center text-[#10212b] min-[896px]:hidden"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls={isOpen ? 'mobile-navigation-dialog' : undefined}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div
          ref={mobileOverlayRef}
          className="fixed inset-x-0 bottom-0 top-[calc(var(--mobile-header-height)+var(--safe-area-top))] z-[60] min-[896px]:hidden"
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Dismiss navigation"
            onClick={() => closeMenu(true)}
            className="mobile-nav-scrim absolute inset-0 h-full w-full bg-[#10212b]/15 backdrop-blur-[2px]"
          />
          <div
            ref={mobileMenuRef}
            id="mobile-navigation-dialog"
            data-presentation="sheet"
            className="mobile-nav-sheet absolute inset-0 flex flex-col bg-[#f7f6f2] text-[#10212b] shadow-[0_28px_72px_-38px_rgba(16,33,43,0.72)]"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pl-[calc(var(--mobile-gutter)+var(--safe-area-left))] pr-[calc(var(--mobile-gutter)+var(--safe-area-right))] pt-4">
              <nav aria-label="Mobile navigation" className="w-full">
                <ul className="w-full divide-y divide-current/15 border-y border-current/15">
                  {editorialNavigation.map((item, index) => {
                    const isActive = pathname === item.href
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={isActive ? 'page' : undefined}
                          data-current-route={isActive || undefined}
                          onClick={() => closeMenu(false)}
                          className={cn(
                            'flex min-h-[var(--mobile-control-height)] items-center justify-between py-2 text-[1.05rem] font-medium tracking-[-0.015em]',
                            isActive && 'bg-[#e9eff1] px-3 -mx-3',
                          )}
                        >
                          <span>{item.label}</span>
                          <span className="flex items-center gap-2">
                            {isActive && (
                              <span
                                className="text-[0.64rem] font-bold uppercase tracking-[0.12em] text-[#10212b]"
                                aria-hidden="true"
                              >
                                Current
                              </span>
                            )}
                            <span
                              className="text-[0.68rem] font-semibold tracking-[0.12em] text-[#5d6e75]"
                              aria-hidden="true"
                            >
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
            <div
              role="region"
              aria-label="Navigation action"
              className="border-t border-[#d7dcde] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[calc(var(--mobile-gutter)+var(--safe-area-left))] pr-[calc(var(--mobile-gutter)+var(--safe-area-right))] pt-4"
            >
              <Link
                href="/contact"
                onClick={() => closeMenu(false)}
                className="ed-primary w-full"
              >
                <span>Discuss a mandate</span>
                <span className="ed-chamber" aria-hidden="true">
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
