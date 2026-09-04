'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { X } from './icons'
import styles from './mobile-detail-sheet.module.css'

export type MobileDetailSheetProps = {
  open: boolean
  onClose: () => void
  eyebrow?: string
  title: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function MobileDetailSheet({
  open,
  onClose,
  eyebrow,
  title,
  children,
  footer,
  className,
}: MobileDetailSheetProps) {
  const [mounted, setMounted] = useState(false)
  const titleId = `mobile-detail-sheet-${useId().replace(/:/g, '')}-title`
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open || !mounted) return

    const desktopQuery = window.matchMedia('(min-width: 896px)')
    if (desktopQuery.matches) {
      onCloseRef.current()
      return
    }

    const openingElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    const lockedScrollY = window.scrollY
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    }

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${lockedScrollY}px`
    document.body.style.width = '100%'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const controls = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => element.getAttribute('aria-hidden') !== 'true')

      if (controls.length === 0) {
        event.preventDefault()
        dialogRef.current.focus()
        return
      }

      const firstControl = controls[0]
      const lastControl = controls[controls.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && (activeElement === firstControl || !dialogRef.current.contains(activeElement))) {
        event.preventDefault()
        lastControl.focus()
      } else if (!event.shiftKey && (activeElement === lastControl || !dialogRef.current.contains(activeElement))) {
        event.preventDefault()
        firstControl.focus()
      }
    }

    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) onCloseRef.current()
    }

    document.addEventListener('keydown', handleKeyDown)
    desktopQuery.addEventListener('change', closeAtDesktop)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      desktopQuery.removeEventListener('change', closeAtDesktop)
      document.body.style.overflow = previousBodyStyles.overflow
      document.body.style.position = previousBodyStyles.position
      document.body.style.top = previousBodyStyles.top
      document.body.style.width = previousBodyStyles.width
      window.scrollTo({ top: lockedScrollY, behavior: 'instant' })
      if (openingElement?.isConnected) openingElement.focus()
    }
  }, [mounted, open])

  if (!open || !mounted) return null

  return createPortal(
    <div className={styles.root}>
      <button
        type="button"
        className={styles.backdrop}
        tabIndex={-1}
        aria-label="Close detail backdrop"
        onClick={() => onCloseRef.current()}
      />
      <div
        ref={dialogRef}
        className={cn(styles.sheet, className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        {/* Plain elements: a header or footer here maps to the banner and
            contentinfo landmarks and duplicates the page's own while the sheet
            is open. Inside a dialog they are structure, not landmarks. */}
        <div className={styles.header}>
          <div className={styles.heading}>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            <h2 className={styles.title} id={titleId}>
              {title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.close}
            aria-label="Close detail"
            onClick={() => onCloseRef.current()}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
