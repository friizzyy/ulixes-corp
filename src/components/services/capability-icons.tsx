import type { CapabilityId } from '@/lib/services-content'

/* The four capability glyphs, drawn as in 03-rows-desk.html. */
export function CapabilityIcon({ id, className }: { id: CapabilityId; className?: string }) {
  const common = {
    viewBox: '0 0 64 64',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    'aria-hidden': true,
    focusable: false,
    className,
  } as const

  switch (id) {
    case 'architecture':
      return (
        <svg {...common}>
          <rect x="10" y="34" width="44" height="14" rx="2" />
          <rect x="14" y="22" width="36" height="14" rx="2" fill="var(--light)" />
          <rect x="18" y="10" width="28" height="14" rx="2" fill="var(--light)" />
          <path d="M32 48v8M24 56h16" />
        </svg>
      )
    case 'accounting':
      return (
        <svg {...common}>
          <rect x="12" y="8" width="40" height="48" rx="3" />
          <path d="M20 20h24M20 28h24M20 36h12" />
          <circle cx="42" cy="44" r="7" fill="var(--light)" />
          <path d="m39 44 2.2 2.2 4-4.4" />
        </svg>
      )
    case 'trading':
      return (
        <svg {...common}>
          <path d="M6 44h10l6-20 8 28 7-18 5 8h16" />
          <circle cx="22" cy="24" r="2.5" fill="currentColor" />
          <circle cx="37" cy="34" r="2.5" fill="currentColor" />
          <path d="M6 54h52" opacity=".4" />
        </svg>
      )
    case 'assurance':
      return (
        <svg {...common}>
          <path d="M32 6 52 14v16c0 13-8.5 22-20 28-11.5-6-20-15-20-28V14z" />
          <path d="m24 31 6 6 11-12" />
        </svg>
      )
  }
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  )
}
