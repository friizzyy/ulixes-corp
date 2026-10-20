import type { ElementType, ReactNode } from 'react'

export interface EyebrowProps {
  children: ReactNode
  /** Centre the eyebrow and add the matching trailing rule. */
  centred?: boolean
  /**
   * Text colour. 'dark' (default) is steel, for the light grounds; 'light'
   * is pale platinum (#dfe6e8), for eyebrows over an image or a dark ground.
   */
  tone?: 'dark' | 'light'
  /** Element to render. Defaults to 'p'. */
  as?: ElementType
  className?: string
  id?: string
}

/** The uppercase eyebrow with its leading rule (global .eb / .eb-c / .eb-lt). */
export function Eyebrow({ children, centred = false, tone = 'dark', as: Tag = 'p', className, id }: EyebrowProps) {
  const cls = ['eb', centred ? 'eb-c' : '', tone === 'light' ? 'eb-lt' : '', className ?? '']
    .filter(Boolean)
    .join(' ')
  return (
    <Tag className={cls} id={id}>
      {children}
    </Tag>
  )
}
