import {
  chainStages,
  expertiseAreas,
  expertiseContent,
  type ExpertiseArea,
} from './expertise-content'
import { homepageContent } from './homepage-content'

/*
 * Content for the rebuilt /services page and its three coded concepts.
 *
 * Positioning follows Ulysses Williams's note of 2 September 2026: Ulixes is a
 * capital markets transformation and architecture firm, supported by deep
 * Nasdaq Calypso expertise. The four capabilities are his, taken from
 * `expertiseAreas` unchanged. Nothing here is a new claim: scope lines, risk
 * lines and coverage were already verified. The engagement examples are
 * structural slots until Ulysses supplies the copy, and they are marked so a
 * test can refuse to ship them.
 *
 * Bound by the same guardrails as every page: no company-wide "we", no named
 * clients, no invented metrics or outcomes, no em dashes.
 */

export type CapabilityId = ExpertiseArea['id']

export type EngagementExample = {
  /* The situation the mandate arrived in. */
  situation: string
  /* What was done, as prose rather than a list. */
  work: string
  /* What changed. Supplied by Ulysses; never invented here. */
  change: string
  /* 'draft' until Ulysses supplies the example. */
  status: 'draft' | 'confirmed'
}

export type ServiceCapability = ExpertiseArea & {
  /* The scope line split for compositions that set it as a spec row. */
  scopeTerms: readonly string[]
  /* Coverage as one sentence, for compositions that avoid lists. */
  coversSentence: string
  example: EngagementExample
  contactHref: string
}

const stageLabel = (id: ExpertiseArea['span']['from']) =>
  chainStages.find((stage) => stage.id === id)?.label ?? id

/*
 * Until Ulysses supplies the examples, the situation line is drawn from the
 * capability's lifecycle span rather than repeating the risk line the plate
 * already leads with. The span is published content, flagged for his
 * confirmation in expertise-content.ts.
 */
const situationFromSpan = (area: ExpertiseArea) =>
  area.span.from === 'capture' && area.span.to === 'reporting'
    ? 'A platform change whose consequences run the whole lifecycle, from capture to regulatory reporting.'
    : `A platform change whose risk concentrates between ${stageLabel(area.span.from).toLowerCase()} and ${stageLabel(area.span.to).toLowerCase()}.`

/* Lowercase a list item's first letter unless it opens with an acronym. */
const lower = (item: string) =>
  /^[A-Z]{2,}/.test(item) ? item : item.charAt(0).toLowerCase() + item.slice(1)

const sentence = (items: readonly string[]) => {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

export const serviceCapabilities: readonly ServiceCapability[] = expertiseAreas.map(
  (area) => ({
    ...area,
    scopeTerms: area.scope.split('·').map((term) => term.trim()),
    coversSentence: `${sentence(area.covers.map((item, index) => (index === 0 ? item : lower(item))))}.`,
    example: {
      situation: situationFromSpan(area),
      work: `The work covers ${sentence(
        area.covers.map(lower),
      )}, sequenced so dependent decisions land in the order they depend on.`,
      change: 'Outcome statement to be supplied by Ulysses Williams.',
      status: 'draft',
    },
    contactHref: `/contact?program=${encodeURIComponent(area.title)}`,
  }),
)

export type AutomationArea = {
  name: string
  capability: CapabilityId
  /* Scope of application only. No claim about results. */
  note: string
}

/*
 * Ulysses named the six areas. The capability each one reports to is a first
 * cut for him to correct, so a composition can hand each area to the plate
 * above it.
 */
export const automationAreas: readonly AutomationArea[] = [
  {
    name: 'Testing',
    capability: 'assurance',
    note: 'Coverage shaped by lifecycle event and generated rather than scripted by hand.',
  },
  {
    name: 'Controls',
    capability: 'accounting',
    note: 'Control checks that run continuously instead of at period end.',
  },
  {
    name: 'Reconciliation',
    capability: 'accounting',
    note: 'Breaks classified and routed before a person has to read them.',
  },
  {
    name: 'Exception management',
    capability: 'trading',
    note: 'Exceptions grouped by cause rather than by queue.',
  },
  {
    name: 'Migration',
    capability: 'architecture',
    note: 'Mapping validated against the target model at full volume.',
  },
  {
    name: 'Operations',
    capability: 'trading',
    note: 'Lifecycle processing watched against what the desk expects to see.',
  },
]

export const servicesContent = {
  hero: {
    eyebrow: 'Capital markets transformation and architecture',
    headline: expertiseContent.hero.headline,
    headlineLines: ['Architecture.', 'Not configuration.'],
    body: expertiseContent.hero.body,
    primaryCta: 'Discuss a mandate',
    secondaryCta: 'See the four capabilities',
    secondaryHref: '#capabilities',
  },
  capabilities: {
    eyebrow: 'Four capabilities',
    headline: 'One decision, followed through the system.',
    body: 'Transformation and architecture lead. Accounting, risk, post-trade and assurance follow the same decision through the system.',
    exampleLabel: 'Engagement example',
    exampleParts: {
      situation: 'Situation',
      work: 'What was done',
      change: 'What changed',
    },
    contactCta: 'Discuss this capability',
  },
  negation: expertiseContent.negation,
  approach: expertiseContent.approach,
  automation: {
    eyebrow: 'Intelligent automation',
    headline: 'Applied where the work already is.',
    body: 'Not a practice of its own. Automation is applied to processes the firm already runs by hand: testing, controls, reconciliation, exception management, migration, and operations.',
  },
  calypso: {
    eyebrow: 'Platform depth',
    headline: 'Deep expertise in Nasdaq Calypso.',
    since: expertiseContent.calypso.since,
    sinceLabel: expertiseContent.calypso.sinceLabel,
    body: expertiseContent.calypso.body,
    cta: expertiseContent.calypso.cta,
    href: expertiseContent.calypso.href,
  },
  contact: homepageContent.contact,
} as const
