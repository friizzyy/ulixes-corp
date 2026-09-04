import type {
  AuthorityIconName,
  ServiceIconName,
} from '@/lib/homepage-content'

type IconProps<Name extends string> = {
  name: Name
  className?: string
  size?: number
}

function IconFrame({
  children,
  className,
  size = 24,
}: {
  children: React.ReactNode
  className?: string
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

export function AuthorityIcon({
  name,
  className,
  size,
}: IconProps<AuthorityIconName>) {
  if (name === 'history') {
    return (
      <IconFrame className={className} size={size}>
        <circle cx="12" cy="12" r="8.25" />
        <path d="M12 7.5V12l3 2" />
        <path d="M6.5 5.7 4 6.2l.5-2.5" />
      </IconFrame>
    )
  }

  if (name === 'lifecycle') {
    return (
      <IconFrame className={className} size={size}>
        <path d="M5 6.5h8.5a3 3 0 0 1 3 3v1" />
        <path d="m14.5 8.5 2-2 2 2" />
        <path d="M19 17.5h-8.5a3 3 0 0 1-3-3v-1" />
        <path d="m9.5 15.5-2 2-2-2" />
      </IconFrame>
    )
  }

  if (name === 'regions') {
    return (
      <IconFrame className={className} size={size}>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.8 12h16.4M12 3.5c2.2 2.4 3.2 5.2 3.2 8.5s-1 6.1-3.2 8.5c-2.2-2.4-3.2-5.2-3.2-8.5S9.8 5.9 12 3.5Z" />
      </IconFrame>
    )
  }

  return (
    <IconFrame className={className} size={size}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.8 19c.8-3.3 2.9-5 6.2-5s5.4 1.7 6.2 5" />
      <path d="M18.2 5.8h2.3v3" />
    </IconFrame>
  )
}

export function ServiceIcon({
  name,
  className,
  size,
}: IconProps<ServiceIconName>) {
  if (name === 'implementation') {
    return (
      <IconFrame className={className} size={size}>
        <path d="m6 15-2 5 5-2 8.5-8.5-3-3L6 15Z" />
        <path d="m12.5 8.5 3 3M15.5 5.5l1.4-1.4a1.6 1.6 0 0 1 2.2 0l.8.8a1.6 1.6 0 0 1 0 2.2l-1.4 1.4" />
      </IconFrame>
    )
  }

  if (name === 'migration') {
    return (
      <IconFrame className={className} size={size}>
        <rect x="3.5" y="5" width="6.5" height="14" rx="1.5" />
        <rect x="14" y="5" width="6.5" height="14" rx="1.5" />
        <path d="M8 9h8M13.5 6.5 16 9l-2.5 2.5M16 15H8M10.5 12.5 8 15l2.5 2.5" />
      </IconFrame>
    )
  }

  if (name === 'testing') {
    return (
      <IconFrame className={className} size={size}>
        <path d="M8 3.8h8v3H8zM7 5.5H5.5v15h13v-15H17" />
        <path d="m8 12 2 2 5-5M8 17h7" />
      </IconFrame>
    )
  }

  return (
    <IconFrame className={className} size={size}>
      <path d="M12 3.5 19 7v5c0 4.5-2.5 7.2-7 8.5-4.5-1.3-7-4-7-8.5V7l7-3.5Z" />
      <path d="m8.5 12 2.2 2.2 4.8-5" />
    </IconFrame>
  )
}
