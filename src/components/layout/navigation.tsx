'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from '@/components/ui'
import { navigation } from '@/lib/content'
import { cn } from '@/lib/utils'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function resolveHref(href: string, isHomepage: boolean) {
  return href.startsWith('#') && !isHomepage ? `/${href}` : href
}

export function Navigation() {
  const pathname = usePathname()
  const isHomepage = pathname === '/'
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef(0)
  const restoreFocusRef = useRef(true)

  const closeMenu = useCallback((restoreFocus = true) => {
    restoreFocusRef.current = restoreFocus
    setIsOpen(false)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY >= 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isOpen) return

    scrollPositionRef.current = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    document.body.style.top = `-${scrollPositionRef.current}px`
    const menuButton = menuButtonRef.current

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.top = ''
      window.scrollTo(0, scrollPositionRef.current)

      if (restoreFocusRef.current) {
        menuButton?.focus()
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusableElements = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      )
      if (focusableElements.length === 0) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      } else if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeMenu, isOpen])

  const hasCarbonSurface = !isHomepage || isScrolled

  return (
    <>
      <nav
        aria-label="Primary navigation"
        data-surface={hasCarbonSurface ? 'carbon' : 'transparent'}
        className={cn(
          'fixed inset-x-0 top-0 z-50 px-5 py-4 transition-[background-color,border-color,backdrop-filter] duration-200 sm:px-8 md:px-14',
          hasCarbonSurface
            ? 'border-b border-border bg-bg-primary/95 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center font-sans text-sm font-semibold tracking-[0.2em] text-text-primary"
          >
            ULIXES
          </Link>

          <div className="hidden items-center gap-8 md:flex lg:gap-10">
            <ul className="flex items-center gap-7 lg:gap-9">
              {navigation.main.map((item) => (
                <li key={item.label}>
                  <Link
                    href={resolveHref(item.href, isHomepage)}
                    className="inline-flex min-h-[44px] items-center text-body-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-action px-5 py-2.5 text-body-sm font-semibold text-action-ink transition-colors hover:bg-action-hover"
            >
              Discuss the mandate
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            tabIndex={isOpen ? -1 : 0}
            onClick={() => {
              restoreFocusRef.current = true
              setIsOpen(true)
            }}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-text-primary md:hidden"
          >
            <Menu />
          </button>
        </div>
      </nav>

      {isOpen && (
        <div
          ref={dialogRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="min-h-screen-safe fixed inset-0 z-[60] flex min-h-screen flex-col bg-bg-primary px-5 pb-[calc(var(--safe-area-bottom)+1.5rem)] pt-[calc(var(--safe-area-top)+1rem)] md:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-sm font-semibold tracking-[0.2em] text-text-primary">
              ULIXES
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close menu"
              onClick={() => closeMenu()}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-text-primary"
            >
              <X />
            </button>
          </div>

          <nav
            aria-label="Mobile navigation"
            className="flex flex-1 flex-col justify-center py-10"
          >
            <ul>
              {navigation.main.map((item) => (
                <li key={item.label}>
                  <Link
                    href={resolveHref(item.href, isHomepage)}
                    onClick={() => closeMenu(false)}
                    className="flex min-h-[52px] items-center border-b border-border py-3 text-xl font-semibold text-text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="/contact"
            onClick={() => closeMenu(false)}
            className="inline-flex min-h-[52px] items-center justify-center rounded-sm bg-action px-5 py-3 text-base font-semibold text-action-ink transition-colors hover:bg-action-hover"
          >
            Discuss the mandate
          </Link>
        </div>
      )}
    </>
  )
}
