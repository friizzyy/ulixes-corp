/*
 * Content for /services, taken from the approved build spec
 * (docs/build-spec/services). The capabilities are Ulysses Williams's own
 * positioning (the same four as expertise-content.ts); the approach phases are
 * the published engagement approach. Nothing here is a new claim.
 *
 * Bound by the same guardrails as every page: no company-wide "we", no named
 * clients, no invented metrics or outcomes, no em dashes.
 */

export const lifecycleStages = [
  'Capture',
  'Valuation',
  'Risk',
  'Collateral',
  'Settlement',
  'Ledger',
  'Reporting',
] as const

export type LifecycleStage = (typeof lifecycleStages)[number]

export type CapabilityId = 'architecture' | 'accounting' | 'trading' | 'assurance'

export type ServiceCapability = {
  id: CapabilityId
  /* Full title, as the card sets it. */
  title: string
  /* The short form the hero's capability bar and the phone ticker use. */
  short: string
  description: string
  covers: readonly string[]
  /* Where the capability's delivery risk concentrates, as a contiguous range. */
  span: { from: LifecycleStage; to: LifecycleStage }
}

/*
 * The card copy keeps the spec's non-breaking hyphens (U+2011) in
 * "front‑to‑back" and "post‑trade" so those compounds never split at a line end.
 */
export const serviceCapabilities: readonly ServiceCapability[] = [
  {
    id: 'architecture',
    title: 'Transformation and solution architecture',
    short: 'Transformation & architecture',
    description:
      'Platform modernization, front‑to‑back architecture, and migration strategy decided before technology selection.',
    covers: [
      'Platform modernization',
      'Front-to-back architecture',
      'Implementation and migration strategy',
      'Integration',
      'Operating-model design',
    ],
    span: { from: 'Capture', to: 'Reporting' },
  },
  {
    id: 'accounting',
    title: 'Accounting and controls',
    short: 'Accounting & controls',
    description:
      'Capital markets and hedge accounting, reconciliation, and the control architecture that holds at the close.',
    covers: [
      'Capital markets accounting',
      'Hedge accounting',
      'Reconciliation',
      'Transaction and ledger integrity',
      'Control architecture',
    ],
    span: { from: 'Settlement', to: 'Reporting' },
  },
  {
    id: 'trading',
    title: 'Trading, risk and post‑trade',
    short: 'Trading, risk & post-trade',
    description:
      'Derivatives and securities through pricing, market data, collateral, settlement, and lifecycle processing.',
    covers: [
      'Derivatives and securities',
      'Pricing and P&L',
      'Market data',
      'Collateral',
      'Settlements',
      'Lifecycle processing',
    ],
    span: { from: 'Capture', to: 'Settlement' },
  },
  {
    id: 'assurance',
    title: 'Automation and transformation assurance',
    short: 'Automation & assurance',
    description:
      'Automated testing, migration validation, SIT and UAT, and production readiness, with intelligent automation applied to each.',
    covers: [
      'Automated testing',
      'Exception and reconciliation workflows',
      'Migration validation',
      'SIT and UAT',
      'Production readiness',
    ],
    span: { from: 'Risk', to: 'Reporting' },
  },
]

/* Stage indices a capability spans, inclusive. */
export function spanRange(capability: ServiceCapability): readonly [number, number] {
  return [lifecycleStages.indexOf(capability.span.from), lifecycleStages.indexOf(capability.span.to)]
}

export const servicesContent = {
  hero: {
    eyebrow: 'Capital markets transformation',
    lines: ['Architecture.', 'Not configuration.'],
    /* The phone hero sets only the first sentence. */
    lead: 'Four capabilities, applied to front-to-back platform change for banks and hedge funds.',
    more: 'Each one concentrates where delivery risk does.',
    primaryCta: 'Discuss a mandate',
    secondaryCta: 'View capabilities',
    secondaryHref: '#capabilities',
  },
  capabilities: {
    label: 'Four capabilities',
    spanLabel: 'Lifecycle span',
  },
  approach: {
    eyebrow: 'Engagement approach',
    lead: 'Go-live is',
    turn: 'not success.',
    body: 'Success is the first close, the first regulatory submission, and the first exception handled by the people who now own the system.',
    end: 'First close',
    phases: [
      {
        title: 'Architecture definition',
        description:
          'Accounting treatment, capital impact, and regulatory requirements are defined before vendors or platforms enter the conversation.',
      },
      {
        title: 'Lifecycle mapping',
        description:
          'Every instrument type is mapped through its full lifecycle, identifying where accounting, risk, and capital intersect.',
      },
      {
        title: 'Validation design',
        description:
          'Validation is designed against edges and stress scenarios rather than happy-path processing.',
      },
      {
        title: 'Control transfer',
        description:
          'Documentation is written for successors rather than for project sign-off, building internal capability instead of dependency.',
      },
    ],
  },
  cta: {
    lead: 'Start with',
    turn: 'the platform decision.',
  },
} as const

export const pad = (n: number) => String(n).padStart(2, '0')
