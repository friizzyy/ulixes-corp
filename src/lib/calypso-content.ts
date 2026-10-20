/*
 * The Nasdaq Calypso page (/nasdaq-calypso).
 *
 * Copy is the approved prototype's, exported to docs/build-spec/calypso. The
 * numbers in the hero bar are counts of what the page itself lists (seven
 * stages, eight programs, six instrument classes, three offices), and the
 * content test pins them to those lists so the two cannot drift apart.
 *
 * Same guardrails as every page: no named clients, no invented metrics, no
 * em dashes.
 */

export type CalypsoOffice = 'Front office' | 'Middle office' | 'Back office'

export const calypsoOffices: readonly CalypsoOffice[] = ['Front office', 'Middle office', 'Back office']

export const calypsoHero = {
  eyebrow: 'Nasdaq Calypso expertise',
  lead: 'Calypso since 2004.',
  turn: 'Every office it touches.',
  body: 'Senior-led advisory across the full trade lifecycle, from the first booking decision to the close it eventually reaches.',
  cta: 'Discuss a mandate',
  explore: 'Explore the platform',
} as const

export interface CalypsoFact {
  value: string
  unit: string
  note: string
}

export const calypsoFacts: readonly CalypsoFact[] = [
  { value: '7', unit: 'lifecycle stages', note: 'Capture to regulatory reporting' },
  { value: '8', unit: 'programs', note: 'Earnings, delivery and capital' },
  { value: '6', unit: 'instrument classes', note: 'Rates through equity derivatives' },
  { value: '3', unit: 'offices', note: 'Front, middle and back' },
]

export interface CalypsoStage {
  name: string
  office: CalypsoOffice
  /** What the stage does. */
  does: string
  /** Where it breaks. */
  breaks: string
}

export const calypsoLifecycle = {
  eyebrow: 'The platform, stage by stage',
  lead: 'One trade,',
  turn: 'seven places it goes wrong.',
  prompt: 'Click a stage to break it, and see how far the break travels.',
  promptPhone: 'Tap a stage to break it',
  cta: 'Discuss this stage',
} as const

export const calypsoStages: readonly CalypsoStage[] = [
  {
    name: 'Capture',
    office: 'Front office',
    does: 'Trade booked against product, book, counterparty, and static data.',
    breaks: 'A product modelled wrong here is inherited by every number downstream.',
  },
  {
    name: 'Valuation',
    office: 'Front office',
    does: 'Curves built, marks struck, independent price verification run.',
    breaks: 'Curve configuration that prices correctly and books incorrectly.',
  },
  {
    name: 'Risk',
    office: 'Middle office',
    does: 'Sensitivities, limits, and the market data the measures depend on.',
    breaks: 'Risk numbers that do not tie back to what the front office holds.',
  },
  {
    name: 'Collateral',
    office: 'Middle office',
    does: 'Margin called, exposure agreed, agreement terms applied.',
    breaks: 'Terms that live in the signed document but not in the platform.',
  },
  {
    name: 'Settlement',
    office: 'Back office',
    does: 'Cash and securities move, confirmations matched, breaks worked.',
    breaks: 'Exception paths with no owner, no queue, and no resolution.',
  },
  {
    name: 'Ledger',
    office: 'Back office',
    does: 'Sub-ledger posts, hedge designation and effectiveness carried through.',
    breaks: 'Designation that moves earnings into the wrong period, quietly.',
  },
  {
    name: 'Regulatory reporting',
    office: 'Back office',
    does: 'Regulatory submissions assembled and traced back to the transaction.',
    breaks: 'A submission nobody can walk back to the trade that produced it.',
  },
]

export interface CalypsoProgram {
  title: string
  body: string
}

export interface CalypsoProgramFamily {
  id: 'earnings' | 'delivery' | 'capital'
  title: string
  note: string
  programs: readonly CalypsoProgram[]
}

export const calypsoProgramsIntro = {
  eyebrow: 'What the work produces',
  lead: 'Eight programs,',
  turn: 'six instrument classes.',
  domainsLabel: 'APPLIED ACROSS SIX PRODUCT DOMAINS',
} as const

export const calypsoProgramFamilies: readonly CalypsoProgramFamily[] = [
  {
    id: 'earnings',
    title: 'Earnings and audit',
    note: 'Where accounting treatment decides what the numbers say.',
    programs: [
      {
        title: 'Hedge accounting framework design',
        body: 'Designation, effectiveness testing, and the documentation that has to hold when a reviewer pulls the file. The framework decides which period a gain lands in, so a design that is merely defensible on paper still moves earnings if the system implements it differently.',
      },
      {
        title: 'Earnings volatility remediation',
        body: 'Finding where P&L timing is being set by configuration rather than by intent. Volatility that nobody chose is almost always a designation, a curve, or a booking model doing something the desk never asked it to do.',
      },
      {
        title: 'Audit defense and documentation',
        body: 'The evidence trail a reviewer asks for, assembled before they ask for it. Written so the CFO can explain the architecture to analysts and the CAO can defend the treatment without reopening the implementation.',
      },
    ],
  },
  {
    id: 'delivery',
    title: 'Delivery and migration',
    note: 'Where the platform changes hands or changes shape.',
    programs: [
      {
        title: 'Calypso front-to-back implementation',
        body: 'Product coverage, configuration, and delivery sequenced across all three offices at once. The sequencing is the work: a front-office decision taken in month one sets the accounting treatment nobody looks at until month nine.',
      },
      {
        title: 'Platform migration and data integrity',
        body: 'Position, trade, and static data mapped to the target model and reconciled against it rather than assumed. Migrations rarely fail on cutover weekend. They fail at the first month end.',
      },
      {
        title: 'Derivatives lifecycle validation',
        body: 'Coverage shaped by lifecycle event rather than by screen. Happy-path testing says nothing about maturity, early termination, counterparty default, or a market that moves.',
      },
    ],
  },
  {
    id: 'capital',
    title: 'Capital and regulatory',
    note: 'Where a booking decision becomes a reported one.',
    programs: [
      {
        title: 'Capital ratio optimization',
        body: 'How a trade is booked, netted, and classified, and what each of those choices consumes. The same economic position can carry materially different capital depending on decisions taken at configuration time.',
      },
      {
        title: 'Regulatory reporting architecture',
        body: 'Submissions that can be traced back to the transaction that produced them, field by field. The hard half is being able to answer, months later, why a specific number was what it was.',
      },
    ],
  },
]

export type CalypsoDomainIcon = 'rates' | 'fx' | 'fixed' | 'money' | 'commodities' | 'equity'

export const calypsoDomains: readonly { name: string; icon: CalypsoDomainIcon }[] = [
  { name: 'Interest-rate derivatives', icon: 'rates' },
  { name: 'FX', icon: 'fx' },
  { name: 'Fixed income', icon: 'fixed' },
  { name: 'Money markets', icon: 'money' },
  { name: 'Commodities', icon: 'commodities' },
  { name: 'Equity derivatives', icon: 'equity' },
]

export interface CalypsoMandate {
  title: string
  scope: string
  risk: string
}

export const calypsoMandatesIntro = {
  eyebrow: 'How the work is scoped',
  lead: 'Four shapes',
  turn: 'a Calypso mandate takes.',
  body: 'Most Calypso engagements arrive as one of four shapes. What separates them is where the risk concentrates, and which office ends up carrying it when a date moves.',
} as const

export const calypsoMandates: readonly CalypsoMandate[] = [
  {
    title: 'Calypso implementation',
    scope: 'Architecture · Configuration · Delivery',
    risk: 'Implementation risk concentrates where a decision taken for the front office quietly changes the ledger. The design has to hold all three offices at once.',
  },
  {
    title: 'Platform migration',
    scope: 'Mapping · Validation · Cutover',
    risk: 'Migration risk concentrates at the first close after cutover. A migration that reconciles on day one can still fail at month end.',
  },
  {
    title: 'Lifecycle-led testing',
    scope: 'SIT · UAT · Regression',
    risk: 'Testing risk concentrates in the events nobody scripted. Happy-path coverage passes, and the exception breaks the close.',
  },
  {
    title: 'Operational readiness',
    scope: 'Controls · Ownership · Support',
    risk: 'Readiness risk concentrates in the handover. A system that works is not the same as an organization ready to run it.',
  },
]

export const calypsoClose = { lead: 'Bring the', turn: 'Calypso question.' } as const

/** Two-digit index, as the spec numbers every stage, program and mandate. */
export const pad2 = (n: number) => String(n).padStart(2, '0')
