import type { InstitutionIcon as IconName } from '@/lib/institutional-experience-content'

/* Line drawings from the approved prototype, one per kind of institution. */
const paths: Record<IconName, React.ReactNode> = {
  bank: <path d="M6 18 24 8l18 10M9 18v18M17 18v18M31 18v18M39 18v18M5 40h38" />,
  regional: <path d="M8 36V22l8-6 8 6v14M24 36V14l8-6 8 6v22M4 40h40M12 28h4M28 22h4M28 30h4" />,
  farm: (
    <path d="M24 42V14M24 22c-6 0-9-4-9-9 5 0 9 3 9 9ZM24 22c6 0 9-4 9-9-5 0-9 3-9 9ZM24 32c-6 0-9-4-9-9 5 0 9 3 9 9ZM24 32c6 0 9-4 9-9-5 0-9 3-9 9Z" />
  ),
  globe: (
    <>
      <circle cx="24" cy="24" r="17" />
      <path d="M7 24h34M24 7c5 5 7 11 7 17s-2 12-7 17M24 7c-5 5-7 11-7 17s2 12 7 17" />
    </>
  ),
  housing: <path d="M6 22 24 8l18 14M11 18v22h26V18M20 40V28h8v12" />,
  asset: (
    <>
      <circle cx="24" cy="24" r="16" />
      <path d="M24 8v16l12 10" />
      <path d="M24 24 9 29" />
    </>
  ),
  clearing: <path d="M8 17h28l-6-6M40 31H12l6 6" />,
}

export function InstitutionIcon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {paths[name]}
    </svg>
  )
}
