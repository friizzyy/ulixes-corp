'use client'

import { cn } from '@/lib/utils'

interface DisclosureProps {
  title: string
  children: React.ReactNode
  meta?: string
  defaultOpen?: boolean
  className?: string
}

export function Disclosure({ title, children, meta, defaultOpen = false, className }: DisclosureProps) {
  return (
    <details
      className={cn(
        'group rounded-md border border-border bg-bg-secondary/70 px-5 py-4',
        'transition-colors duration-200 open:border-border-accent',
        className
      )}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
        <div>
          <h3 className="text-heading-sm font-semibold text-text-primary">{title}</h3>
          {meta && (
            <p className="mt-2 text-body-sm text-text-secondary leading-relaxed">{meta}</p>
          )}
        </div>
        <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-muted transition-transform duration-200 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="mt-4 space-y-4 text-body-md text-text-secondary leading-relaxed">
        {children}
      </div>
    </details>
  )
}
