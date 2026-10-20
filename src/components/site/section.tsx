import type { ElementType, ReactNode } from 'react'

export interface SectionProps {
  children: ReactNode
  /**
   * The gap above this section's first content:
   * 'rhythm' (default) 128 / 96 / 72px desktop / tablet / phone, between sections;
   * 'head'   44 / 36 / 24px, for the first section under a page header;
   * 'none'   for a section that sits flush (a hero card under the header).
   */
  space?: 'rhythm' | 'head' | 'none'
  /** Wrap the children in .wrap (1312 max, 64 / 40 / 20px gutters). Default true. */
  wrap?: boolean
  as?: ElementType
  id?: string
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

/**
 * Applies the page rhythm. Sections only ever add space above themselves, so
 * stacking <Section>s gives the spec's gaps exactly; the footer adds the same
 * rhythm above itself. A section with its own ground (a dark band) should put
 * its inner padding inside, and use space="rhythm" for the gap above it.
 */
export function Section({
  children,
  space = 'rhythm',
  wrap = true,
  as: Tag = 'section',
  id,
  className,
  ...aria
}: SectionProps) {
  const cls = [space === 'rhythm' ? 'sec' : space === 'head' ? 'sec-head' : '', className ?? '']
    .filter(Boolean)
    .join(' ')
  return (
    <Tag id={id} className={cls || undefined} {...aria}>
      {wrap ? <div className="wrap">{children}</div> : children}
    </Tag>
  )
}
