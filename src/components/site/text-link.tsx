import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

export interface TextLinkProps extends Omit<ComponentProps<typeof Link>, 'className' | 'children'> {
  children: ReactNode
  /** Optional trailing glyph, e.g. '→'. Rendered aria-hidden. */
  arrow?: '→' | '↗' | '←' | null
  className?: string
}

/** The partial-underline text link (global .tl). Colour follows currentColor. */
export function TextLink({ children, arrow = '→', className, ...rest }: TextLinkProps) {
  return (
    <Link {...rest} className={['tl', className ?? ''].filter(Boolean).join(' ')}>
      <span>
        {children}
        {arrow ? <span className="tl-ar" aria-hidden="true">{` ${arrow}`}</span> : null}
      </span>
    </Link>
  )
}
