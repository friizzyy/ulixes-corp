import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './slab-button.module.css'

export type SlabButtonVariant = 'ink' | 'light' | 'ghost'
export type SlabArrow = '↗' | '→' | '←'

interface SlabBaseProps {
  children: ReactNode
  /** 'ink' (default), 'light' (.btn.lt, over images / dark), 'ghost' (.btn.gh, outlined). */
  variant?: SlabButtonVariant
  /** The glyph in the divided arrow cell. Defaults to '↗'. */
  arrow?: SlabArrow
  /** Full width, label left and arrow cell right (as in the cards and phone heroes). */
  block?: boolean
  className?: string
}

export interface SlabLinkProps extends SlabBaseProps {
  /** Renders a next/link when set. */
  href: string
  /** Opens in a new tab with rel="noopener noreferrer". */
  external?: boolean
  'aria-label'?: string
}

export interface SlabActionProps
  extends SlabBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  /** No href: renders a <button> (type defaults to 'button'). */
  href?: undefined
}

export type SlabButtonProps = SlabLinkProps | SlabActionProps

function classes({ variant = 'ink', block, className }: SlabBaseProps) {
  return [
    styles.btn,
    variant === 'light' ? styles.light : '',
    variant === 'ghost' ? styles.ghost : '',
    block ? styles.block : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')
}

/** The Architect Slab button. A link when `href` is given, otherwise a <button>. */
export function SlabButton(props: SlabButtonProps) {
  const { children, arrow = '↗' } = props
  const inner = (
    <>
      <span className={styles.label}>{children}</span>
      <i className={styles.arrow} aria-hidden="true">
        {arrow}
      </i>
    </>
  )

  if (typeof props.href === 'string') {
    const { href, external, variant, block, className } = props
    return (
      <Link
        href={href}
        className={classes({ children, variant, block, className })}
        aria-label={props['aria-label']}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </Link>
    )
  }

  const { children: _c, arrow: _a, variant, block, className, type = 'button', ...rest } = props
  void _c
  void _a
  return (
    <button type={type} {...rest} className={classes({ children, variant, block, className })}>
      {inner}
    </button>
  )
}
