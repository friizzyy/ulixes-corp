export type LifecycleStageId =
  | 'capture'
  | 'lifecycle'
  | 'risk'
  | 'controls'
  | 'settlement'
  | 'reporting'

export type LifecycleStage = {
  id: LifecycleStageId
  label: string
  narrative: string
}

export type Capability = {
  id: 'implementation' | 'migration' | 'compliance' | 'testing'
  title: string
  description: string
  stageIds: readonly LifecycleStageId[]
  renderMode: 'path' | 'checkpoints'
}

export type RepresentativeMandate = {
  id: 'implementation' | 'migration' | 'testing'
  title: string
  body: string
  stageIds: readonly LifecycleStageId[]
}

export const homepageContent = {
  hero: {
    headline: 'See the whole system before you change it.',
    body: 'Senior-led Calypso advisory for the decisions connecting front office, risk, operations, and settlement.',
    primaryCta: 'Discuss the mandate',
    secondaryCta: 'Explore capabilities',
    proof: 'Ulysses Williams · Calypso since 2004 · Front-to-back programs across four regions',
  },
  systemTrace: {
    title: 'One change travels.',
    body: 'A platform decision rarely stays where it begins. Follow its consequences through the trade lifecycle.',
  },
  capabilities: {
    title: 'Where Ulixes enters the system.',
    body: 'Each mandate acts on a different part of the same connected operating model.',
  },
  mandates: { title: 'Work of this kind.' },
  senior: {
    headline: 'Experience stays close to the decision.',
    body: 'Ulixes is led by Ulysses Williams, President and Calypso subject-matter expert. His work has spanned front-, middle-, and back-office programs across North America, Europe, APAC, and Latin America since beginning with Calypso Technology in 2004.',
    cta: 'View Ulysses on LinkedIn',
    href: 'https://www.linkedin.com/in/ulysses-williams-2379634/',
  },
  closing: {
    headline: 'Bring the whole mandate into view.',
    body: 'Start with the system, constraints, and decision in front of you.',
    cta: 'Discuss the mandate',
    href: '/contact',
  },
} as const

export const lifecycleStages: readonly LifecycleStage[] = [
  {
    id: 'capture',
    label: 'Capture and enrich',
    narrative: 'Product setup, market data, static data, and booking rules establish the record every downstream process will trust.',
  },
  {
    id: 'lifecycle',
    label: 'Process lifecycle events',
    narrative: "Amendments, resets, exercises, fees, and terminations test whether the original model survives the trade's full life.",
  },
  {
    id: 'risk',
    label: 'Value and measure risk',
    narrative: 'Curves, models, sensitivities, and exposure translate the trade into decisions for desks, risk, and finance.',
  },
  {
    id: 'controls',
    label: 'Manage collateral and controls',
    narrative: 'Eligibility, margin, limits, permissions, and exception handling determine whether exposure remains governed.',
  },
  {
    id: 'settlement',
    label: 'Confirm and settle',
    narrative: 'Messages, confirmations, cash, and securities movement turn the system record into an external obligation.',
  },
  {
    id: 'reporting',
    label: 'Account, reconcile, and report',
    narrative: 'Accounting events, breaks, and reporting reveal whether the same trade remains consistent across the institution.',
  },
]

export const capabilities: readonly Capability[] = [
  {
    id: 'implementation',
    title: 'Calypso implementation',
    description: 'Architecture, configuration, and delivery across connected front-to-back workflows.',
    stageIds: ['capture', 'lifecycle', 'risk', 'controls', 'settlement', 'reporting'],
    renderMode: 'path',
  },
  {
    id: 'migration',
    title: 'Platform migration',
    description: 'Planning and validation for platform or version transitions while preserving operational control.',
    stageIds: ['capture', 'lifecycle', 'settlement', 'reporting'],
    renderMode: 'path',
  },
  {
    id: 'compliance',
    title: 'AI-assisted compliance',
    description: 'Human-governed analysis that improves evidence, traceability, and review.',
    stageIds: ['lifecycle', 'controls', 'reporting'],
    renderMode: 'path',
  },
  {
    id: 'testing',
    title: 'Intelligent testing',
    description: 'Risk-based test design and validation across critical trade-system paths.',
    stageIds: ['capture', 'lifecycle', 'risk', 'controls', 'settlement', 'reporting'],
    renderMode: 'checkpoints',
  },
]

export const representativeMandates: readonly RepresentativeMandate[] = [
  {
    id: 'implementation',
    title: 'Front-to-back implementation',
    body: 'A bank is extending Calypso across products and operating teams whose decisions cannot be isolated. Ulixes aligns product setup, market data, lifecycle processing, risk, accounting, messaging, and settlement around one operating model. The emphasis is making downstream consequences visible before configuration is committed.',
    stageIds: ['capture', 'lifecycle', 'risk', 'controls', 'settlement', 'reporting'],
  },
  {
    id: 'migration',
    title: 'Controlled platform migration',
    body: 'A platform or portfolio transition must preserve positions, lifecycle history, accounting treatment, and operational continuity. Ulixes frames target state, data mapping, reconciliation, parallel validation, cutover, and stabilization as one control program. The emphasis is proving continuity before the transition becomes irreversible.',
    stageIds: ['capture', 'lifecycle', 'settlement', 'reporting'],
  },
  {
    id: 'testing',
    title: 'Lifecycle-led testing',
    body: 'Release confidence depends on more than screens and happy-path scenarios. Ulixes designs SIT, UAT, and regression coverage around real products, lifecycle events, controls, and production readiness. The emphasis is testing the paths where business impact compounds.',
    stageIds: ['capture', 'lifecycle', 'risk', 'controls', 'settlement', 'reporting'],
  },
]
