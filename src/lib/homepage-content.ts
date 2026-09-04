export type AuthorityIconName = 'history' | 'lifecycle' | 'regions' | 'access'
export type ServiceIconName =
  | 'implementation'
  | 'migration'
  | 'testing'
  | 'readiness'
export type ServiceMaterial = 'steel' | 'sage' | 'clay' | 'platinum'
/* The four capabilities the homepage ledger sells; ids match expertiseAreas. */
export type ServiceCapabilityId =
  | 'architecture'
  | 'accounting'
  | 'trading'
  | 'assurance'

export type AuthorityItem = {
  context: 'Continuity' | 'Lifecycle' | 'Reach' | 'Access'
  value: string
  label: string
  detail?: string
  icon: AuthorityIconName
}

export type ServiceModule = {
  id: ServiceCapabilityId
  title: string
  scope: string
  description: string
  href: string
  icon: ServiceIconName
  material: ServiceMaterial
}

/*
 * Home, Expertise, Experience, Contact.
 *
 * Expertise and Services were two labels for one concept: the homepage section
 * with id="expertise" is the services section, and its CTA already links to
 * /services. The anchor is gone and the page owns the label. The Approach
 * anchor is also gone: it pointed at the practitioner bio, so it read as
 * methodology and landed on a biography.
 */
/*
 * Contact is deliberately absent: the persistent "Discuss a mandate" action in
 * the navigation and footer already points at /contact, and listing it here
 * would give one destination two labels.
 */
export const editorialNavigation = [
  { label: 'Services', href: '/services' },
  { label: 'Experience', href: '/institutional-experience' },
  /*
   * Calypso sits after Experience deliberately. The reposition exists so Ulixes
   * stops reading as a Calypso implementation shop, and second position in the
   * navigation is the first thing that would undo it. After the track record it
   * reads as the depth behind the work rather than as the whole offer, and the
   * page ranks identically either way.
   */
  { label: 'Nasdaq Calypso', href: '/nasdaq-calypso' },
] as const

/*
 * The public routes, every one of them rendered in the editorial system. The
 * list is informational now. The navigation and footer once read it to choose
 * between the editorial chrome and the retired interior theme; privacy and
 * terms were the last routes on that theme, and once they, not-found and
 * error were rebuilt on the editorial surface there was no second branch
 * left to choose.
 */
export const editorialRoutes: readonly string[] = [
  '/',
  '/services',
  '/nasdaq-calypso',
  '/institutional-experience',
  '/contact',
  '/privacy',
  '/terms',
]

/*
 * Always true: every pathname, unknown ones served by not-found included,
 * renders the editorial chrome. The signature is kept so callers compile.
 */
export function isEditorialRoute(_pathname: string | null | undefined): boolean {
  return true
}

export const homepageContent = {
  hero: {
    /* Ulysses's own top-level message from his note of 2 September 2026. */
    eyebrow: 'Senior-led advisory for banks and hedge funds',
    headline: 'Capital markets transformation and architecture.',
    headlineLines: [
      'Capital markets',
      'transformation & architecture.',
    ],
    body: 'Deep expertise in Nasdaq Calypso and complex front-to-back transformation: trading platforms, accounting and controls, risk, data, and intelligent automation.',
    primaryCta: 'Discuss a mandate',
    secondaryCta: 'Review the capabilities',
    imageAlt:
      'Blue-hour view of downtown San Francisco with Salesforce Tower and the Financial District skyline.',
  },
  services: {
    eyebrow: 'Capabilities',
    headline: 'Four points where delivery risk concentrates.',
    body: 'Transformation and architecture lead. Accounting, risk, post-trade, and assurance follow the same decision through the system.',
    cta: 'Explore the capabilities',
  },
  /*
   * The platform credential gets one quiet band between the capabilities and
   * the practitioner, so the Calypso depth stays visible without leading. The
   * eight areas named in the body are the ones already published on /services.
   */
  calypso: {
    eyebrow: 'Platform depth',
    sinceLabel: 'Calypso work since',
    since: '2004',
    headline: 'Deep expertise in Nasdaq Calypso.',
    body: 'Front office, risk, accounting, collateral, operations, testing, migration, and implementation, on one platform since 2004.',
    cta: 'Review Calypso expertise',
    href: '/nasdaq-calypso',
  },
  credibility: {
    eyebrow: 'The practitioner',
    headline: 'Ulysses Williams leads the work.',
    /* A pointer, not the biography. The full account, the institution types
       and the regional depth are the experience page's to carry. */
    body: 'Ulysses Williams leads every mandate personally, bringing a front-, middle-, and back-office view of Calypso delivery to the decisions that shape it.',
    imageAlt:
      'Daylight view of the San Francisco Financial District with Salesforce Tower above the city skyline.',
    cta: 'View Ulysses on LinkedIn',
    linkedinUrl: 'https://www.linkedin.com/in/ulysses-williams-2379634/',
    /*
     * The region list is owned by the hero authority dock and the front-to-back
     * line by the checkpoints below. The footprint plate restates neither.
     */
    footprint: {
      label: 'Delivery footprint',
      value: 'San Francisco base',
    },
    checkpoints: [
      'Calypso experience since 2004',
      'Front-, middle-, and back-office perspective',
    ],
  },
  contact: {
    eyebrow: 'Start a conversation',
    headline: 'Start with the mandate.',
    body: 'Share the platform change, current constraint, and decision that needs senior attention. Ulysses will respond directly.',
    instruction:
      'A useful first note includes the current platform state, delivery stage, and the issue requiring attention.',
    cta: 'Discuss a mandate',
    email: 'admin@ulixescorp.com',
  },
} as const

export const authorityItems: readonly AuthorityItem[] = [
  {
    context: 'Continuity',
    value: 'Since 2004',
    label: 'Calypso experience',
    icon: 'history',
  },
  {
    context: 'Lifecycle',
    value: 'Front to back',
    label: 'Delivery perspective',
    icon: 'lifecycle',
  },
  {
    context: 'Reach',
    value: '4 regions',
    label: 'North America · Europe · APAC · Latin America',
    icon: 'regions',
  },
  {
    context: 'Access',
    value: 'Senior led',
    label: 'Direct practitioner access',
    icon: 'access',
  },
]

/*
 * The four capabilities from Ulysses Williams's positioning note of
 * 2 September 2026. They replaced four Calypso-named engagement areas so the
 * homepage sells the firm (capital markets transformation and architecture)
 * and lets the Calypso page carry the platform depth. Titles and scope lines
 * match `expertiseAreas` in expertise-content.ts; a test pins the two together.
 * The glyphs were drawn for the earlier names and map by nearest meaning.
 */
export const serviceModules: readonly ServiceModule[] = [
  {
    id: 'architecture',
    title: 'Transformation and solution architecture',
    scope: 'Modernization · Architecture · Operating model',
    description:
      'Platform modernization, front-to-back architecture, and migration strategy decided before technology selection.',
    href: '/services#architecture',
    icon: 'implementation',
    material: 'steel',
  },
  {
    id: 'accounting',
    title: 'Accounting and controls',
    scope: 'Accounting · Reconciliation · Controls',
    description:
      'Capital markets and hedge accounting, reconciliation, and the control architecture that holds at the close.',
    href: '/services#accounting',
    icon: 'readiness',
    material: 'sage',
  },
  {
    id: 'trading',
    title: 'Trading, risk and post-trade',
    scope: 'Pricing · Collateral · Lifecycle',
    description:
      'Derivatives and securities through pricing, market data, collateral, settlement, and lifecycle processing.',
    href: '/services#trading',
    icon: 'migration',
    material: 'clay',
  },
  {
    id: 'assurance',
    title: 'Automation and transformation assurance',
    scope: 'Testing · Validation · Readiness',
    description:
      'Automated testing, migration validation, SIT and UAT, and production readiness, with intelligent automation applied to each.',
    href: '/services#assurance',
    icon: 'testing',
    material: 'platinum',
  },
]
