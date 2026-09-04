import {
  homepageContent,
  type ServiceIconName,
  type ServiceMaterial,
} from './homepage-content'

/*
 * Copy here is bound by the verified-claims guardrails in the client brief.
 * No company-wide "we", no invented metrics or outcomes, no named clients, no
 * testimonials, no em dashes. Claims describe Ulysses Williams's individual
 * experience. The previous /services copy violated the first rule throughout
 * and was not carried over.
 */

export type ChainStageId =
  | 'capture'
  | 'valuation'
  | 'risk'
  | 'collateral'
  | 'settlement'
  | 'ledger'
  | 'reporting'

export type ChainStage = {
  id: ChainStageId
  label: string
  note: string
}

export type ExpertiseArea = {
  id: 'architecture' | 'accounting' | 'trading' | 'assurance'
  /*
   * Explicit rather than reusing `id`. The two were the same union only
   * because the expertise areas and the homepage services happened to share
   * four names, and they no longer do. The glyphs were drawn for the previous
   * area names, so the mapping here is by nearest meaning; they want redrawing
   * once the positioning is signed off.
   */
  icon: ServiceIconName
  title: string
  /*
   * There is no longer a prose summary beside this. The scope line and the
   * summary said the same thing twice ("Architecture · configuration ·
   * delivery" against "Architecture, configuration, and delivery across
   * connected front-to-back workflows"), so the prose went and the compact
   * line stayed.
   */
  scope: string
  covers: readonly string[]
  risk: string
  /*
   * The stretch of the lifecycle where this area's risk concentrates, as a
   * contiguous range rather than a set of stages. A chain implies continuity,
   * so a scattered selection cannot be drawn as a path and reads as unrelated
   * dots. Expressing it as from/to makes contiguity structural, and a test
   * enforces that both ends resolve and run forward.
   *
   * This is a judgement about concentration, not a claim that the other stages
   * are untouched: every area runs front to back. Ulysses should confirm them.
   */
  span: { from: ChainStageId; to: ChainStageId }
  material: ServiceMaterial
}

export const chainStages: readonly ChainStage[] = [
  { id: 'capture', label: 'Capture', note: 'Trade and static data' },
  { id: 'valuation', label: 'Valuation', note: 'Pricing and curves' },
  { id: 'risk', label: 'Risk', note: 'Measures and limits' },
  { id: 'collateral', label: 'Collateral', note: 'Margin and exposure' },
  { id: 'settlement', label: 'Settlement', note: 'Payments and confirmations' },
  { id: 'ledger', label: 'Ledger', note: 'Accounting treatment' },
  { id: 'reporting', label: 'Regulatory reporting', note: 'Submissions' },
]

export const productDomains: readonly string[] = [
  'Interest-rate derivatives',
  'FX',
  'Fixed income',
  'Money markets',
  'Commodities',
  'Equity derivatives',
]

/*
 * The four capabilities, taken from Ulysses's own positioning note rather than
 * written here: Transformation & Solution Architecture, Accounting & Controls,
 * Trading Risk & Post-Trade, and Automation & Transformation Assurance. The
 * `covers` lines are his scope wording, kept verbatim as noun phrases so the
 * page states his capabilities rather than a rewrite of them, and so they read
 * the same under either resolution of the firm-voice question.
 *
 * These replace four Calypso-named areas (implementation, migration, testing,
 * readiness). Calypso has not left the page: it now has its own section and a
 * dedicated route, which is what lets the capabilities lead without the
 * specialization disappearing from the page that ranks for it.
 *
 * The spans and the `risk` lines are judgements about where risk concentrates,
 * not claims about work performed. Ulysses should confirm them.
 */
export const expertiseAreas: readonly ExpertiseArea[] = [
  {
    id: 'architecture',
    icon: 'implementation',
    title: 'Transformation and solution architecture',
    scope: 'Modernization · Architecture · Operating model',
    covers: [
      'Platform modernization',
      'Front-to-back architecture',
      'Implementation and migration strategy',
      'Integration',
      'Operating-model design',
    ],
    risk: 'Architecture risk concentrates in the decision taken once and inherited everywhere. An operating model chosen for the front office is still the operating model at the close.',
    // The only capability that spans the whole lifecycle, which is the point
    // of the diagram rather than an oversight.
    span: { from: 'capture', to: 'reporting' },
    material: 'steel',
  },
  {
    id: 'accounting',
    icon: 'readiness',
    title: 'Accounting and controls',
    scope: 'Accounting · Reconciliation · Controls',
    covers: [
      'Capital markets accounting',
      'Hedge accounting',
      'Reconciliation',
      'Transaction and ledger integrity',
      'Control architecture',
    ],
    risk: 'Control risk concentrates between the trade and its treatment. A system can be right about the position and wrong about the ledger, and the difference surfaces at the close.',
    span: { from: 'settlement', to: 'reporting' },
    material: 'sage',
  },
  {
    id: 'trading',
    icon: 'migration',
    title: 'Trading, risk and post-trade',
    scope: 'Pricing · Collateral · Lifecycle',
    covers: [
      'Derivatives and securities',
      'Pricing and P&L',
      'Market data',
      'Collateral',
      'Settlements',
      'Lifecycle processing',
    ],
    risk: 'Post-trade risk concentrates in the lifecycle event nobody planned for. A position that behaves at inception can still break at exercise.',
    span: { from: 'capture', to: 'settlement' },
    material: 'clay',
  },
  {
    id: 'assurance',
    icon: 'testing',
    title: 'Automation and transformation assurance',
    scope: 'Testing · Validation · Readiness',
    covers: [
      'Automated testing',
      'Exception and reconciliation workflows',
      'Migration validation',
      'SIT and UAT',
      'Production readiness',
      'Intelligent automation applied to each of them',
    ],
    risk: 'Assurance risk concentrates in the exception. Happy-path coverage passes, and the break that matters arrives at month end.',
    span: { from: 'risk', to: 'reporting' },
    material: 'platinum',
  },
]

export const expertiseContent = {
  hero: {
    eyebrow: 'Capital markets transformation',
    headline: 'Architecture. Not configuration.',
    body: 'Four capabilities, applied to front-to-back platform change for banks and hedge funds. Each one concentrates where delivery risk does.',
    cta: 'Discuss a mandate',
  },
  chain: {
    eyebrow: 'Capabilities',
    headline: 'One decision moves through all of it.',
    body: 'A platform change rarely stays where it is made. Select a capability to see where its risk concentrates.',
    domainsLabel: 'Applied across',
  },
  negation: {
    statement: 'Go-live is not success.',
    body: 'Success is the first close, the first regulatory submission, and the first exception handled by the people who now own the system.',
  },
  approach: {
    eyebrow: 'Engagement approach',
    headline: 'Design first. The system implements the design.',
    body: 'Financial architecture is defined before technology selection. The platform follows the design rather than setting it.',
    steps: [
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
  /*
   * Calypso relevance currently sits on this page and the home page, which are
   * the two strongest on the site. Moving it wholesale to a new route would
   * strip both and start the new page from no authority at all, so the
   * specialization keeps a section here and links down to the depth.
   */
  calypso: {
    eyebrow: 'Platform specialization',
    headline: 'Deep expertise in Nasdaq Calypso.',
    body: 'Calypso work since 2004, across front office, risk, accounting, collateral, operations, testing, migration, and implementation.',
    /*
     * `since` and `surfaces` are the same sentence as `body`, split so the
     * section can set the figure and the coverage as separate typographic
     * registers instead of one comma list. `body` is kept because the test
     * and any non-visual consumer still read the prose form.
     */
    since: '2004',
    sinceLabel: 'Calypso work since',
    surfaces: [
      'Front office',
      'Risk',
      'Accounting',
      'Collateral',
      'Operations',
      'Testing',
      'Migration',
      'Implementation',
    ],
    cta: 'Review Calypso expertise',
    href: '/nasdaq-calypso',
  },
  contact: homepageContent.contact,
} as const
