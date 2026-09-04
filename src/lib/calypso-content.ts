import { homepageContent, type ServiceMaterial } from './homepage-content'
import { productDomains } from './expertise-content'

/*
 * The Nasdaq Calypso page.
 *
 * This exists so the capabilities can lead on /services without the
 * specialization disappearing. "Nasdaq Calypso consultant" is the
 * highest-intent search the practice owns, and a dedicated page targets it far
 * better than a section can. But /services and the home page are where that
 * relevance currently sits, so both keep a Calypso section linking here rather
 * than handing the term over wholesale.
 *
 * Most of what follows is recovered rather than written. The four delivery
 * areas were the engagement areas on /services until the capabilities replaced
 * them; their scope and risk lines were already verified and are genuinely
 * about Calypso delivery, so they moved here instead of being deleted.
 *
 * Bound by the same guardrails as every other page: no company-wide "we", no
 * named clients, no invented metrics, no em dashes.
 */

/*
 * `office` places each area on the front-to-back axis, and the hero schematic
 * is drawn from it. Testing, migration and implementation are 'across' because
 * they are delivery disciplines rather than places in the trade's path: they
 * touch all three offices, and the diagram would be lying if it filed them
 * under one.
 */
export type CalypsoOffice = 'front' | 'middle' | 'back' | 'across'

export type CalypsoPractice = {
  name: string
  office: CalypsoOffice
  description: string
}

export type CalypsoDeliveryArea = {
  id: 'implementation' | 'migration' | 'testing' | 'readiness'
  title: string
  scope: string
  risk: string
}

/*
 * The eight areas Ulysses named. Descriptions state what the area covers rather
 * than asserting outcomes, which keeps them inside the guardrails and makes
 * them safe to publish before he supplies final copy.
 */
export const calypsoPractices: readonly CalypsoPractice[] = [
  {
    name: 'Front office',
    office: 'front',
    description:
      'Trade capture, product coverage, pricing and curve configuration across the instruments the desk actually books.',
  },
  {
    name: 'Risk',
    office: 'middle',
    description:
      'Measures, limits, sensitivities, and the data those calculations depend on being right about.',
  },
  {
    name: 'Accounting',
    office: 'back',
    description:
      'Booking models, hedge designation, ledger treatment, and the accounting consequences carried by configuration.',
  },
  {
    name: 'Collateral',
    office: 'middle',
    description:
      'Margin, exposure, and agreement terms as they are represented in the platform rather than in the document.',
  },
  {
    name: 'Operations',
    office: 'back',
    description:
      'Lifecycle processing, settlement, confirmations, and the exception paths that decide whether a close completes.',
  },
  {
    name: 'Testing',
    office: 'across',
    description:
      'Coverage shaped by lifecycle event rather than by screen, including the edge conditions nobody scripts.',
  },
  {
    name: 'Migration',
    office: 'across',
    description:
      'Position, trade, and static data mapped to the target model, with differences explained rather than tolerated.',
  },
  {
    name: 'Implementation',
    office: 'across',
    description:
      'Architecture, configuration, and delivery sequenced so dependent decisions land in the order they depend on.',
  },
]

/*
 * Recovered from the previous /services engagement areas. The copy is
 * unchanged: it was verified when it was written and it describes Calypso
 * delivery, which is this page's subject.
 */
export const calypsoDelivery: readonly CalypsoDeliveryArea[] = [
  {
    id: 'implementation',
    title: 'Calypso implementation',
    scope: 'Architecture · configuration · delivery',
    risk: 'Implementation risk concentrates where a decision taken for the front office quietly changes the ledger. The design has to hold all three offices at once.',
  },
  {
    id: 'migration',
    title: 'Platform migration',
    scope: 'Mapping · validation · cutover',
    risk: 'Migration risk concentrates at the first close after cutover. A migration that reconciles on day one can still fail at month end.',
  },
  {
    id: 'testing',
    title: 'Lifecycle-led testing',
    scope: 'SIT · UAT · regression',
    risk: 'Testing risk concentrates in the events nobody scripted. Happy-path coverage passes, and the exception breaks the close.',
  },
  {
    id: 'readiness',
    title: 'Operational readiness',
    scope: 'Controls · ownership · support',
    risk: 'Readiness risk concentrates in the handover. A system that works is not the same as an organization ready to run it.',
  },
]

/*
 * What actually gets built. Moved here from the experience content, where it
 * had been written, verified, and then left unrendered when the pill section
 * that carried it was cut. These are deliverables rather than a taxonomy, which
 * is what the hero window was missing: it described where the work happens
 * without ever saying what comes out of it.
 */
export type CalypsoEntry = {
  name: string
  note: string
}

/*
 * What actually gets built. The names moved here from the experience content,
 * where they had been written, verified, and then left unrendered when the pill
 * section carrying them was cut.
 *
 * The notes are new and say what each deliverable consists of. They describe
 * scope, never outcome: no metric, no claim about results, nothing that asserts
 * how well any of it went. Ulysses should confirm them, the same way he should
 * confirm the office spans.
 */
/*
 * Each note runs two or three sentences rather than one.
 *
 * The single-line version read as a caption under a title, which left eight
 * programs stated and none of them explained. The second sentence is where the
 * consequence lives, and the consequence is the reason any of these are worth
 * commissioning. Scope only: no metric, no client, no claim about outcomes
 * achieved. Ulysses should confirm the emphasis.
 */
export type CalypsoProgramFamily = 'earnings' | 'delivery' | 'capital'

export interface CalypsoProgram {
  readonly name: string
  readonly note: string
  readonly family: CalypsoProgramFamily
}

/*
 * The families are an editorial grouping, not a claim. They exist because
 * eight programs presented as one flat run gave a reader nothing to hold and
 * no entry point. Ulysses should confirm the cut.
 *
 * `material` borrows the material identities the homepage ledger gives its
 * engagement areas, so the rule that marks the open row in the programs index
 * is tinted the way the ledger's edge is. Steel for the platform work, clay
 * for the ledger, sage for the reported number.
 */
export const calypsoProgramFamilies: readonly {
  readonly id: CalypsoProgramFamily
  readonly label: string
  readonly note: string
  readonly material: ServiceMaterial
}[] = [
  {
    id: 'earnings',
    label: 'Earnings and audit',
    note: 'Where accounting treatment decides what the numbers say.',
    material: 'clay',
  },
  {
    id: 'delivery',
    label: 'Delivery and migration',
    note: 'Where the platform changes hands or changes shape.',
    material: 'steel',
  },
  {
    id: 'capital',
    label: 'Capital and regulatory',
    note: 'Where a booking decision becomes a reported one.',
    material: 'sage',
  },
]

export const calypsoPrograms: readonly CalypsoProgram[] = [
  {
    name: 'Hedge accounting framework design',
    family: 'earnings',
    note: 'Designation, effectiveness testing, and the documentation that has to hold when a reviewer pulls the file. The framework decides which period a gain lands in, so a design that is merely defensible on paper still moves earnings if the system implements it differently.',
  },
  {
    name: 'Calypso front-to-back implementation',
    family: 'delivery',
    note: 'Product coverage, configuration, and delivery sequenced across all three offices at once. The sequencing is the work: a front-office decision taken in month one sets the accounting treatment nobody looks at until month nine.',
  },
  {
    name: 'Platform migration and data integrity',
    family: 'delivery',
    note: 'Position, trade, and static data mapped to the target model and reconciled against it rather than assumed. Migrations rarely fail on cutover weekend. They fail at the first month end, when the numbers have to agree with the ones the old system produced.',
  },
  {
    name: 'Capital ratio optimization',
    family: 'capital',
    note: 'How a trade is booked, netted, and classified, and what each of those choices consumes. The same economic position can carry materially different capital depending on decisions taken at configuration time and never revisited.',
  },
  {
    name: 'Regulatory reporting architecture',
    family: 'capital',
    note: 'Submissions that can be traced back to the transaction that produced them, field by field. The reporting itself is the easy half. The hard half is being able to answer, months later, why a specific number was what it was.',
  },
  {
    name: 'Derivatives lifecycle validation',
    family: 'delivery',
    note: 'Coverage shaped by lifecycle event rather than by screen. Happy-path testing confirms the system handles today under the conditions of the day, and says nothing about maturity, early termination, counterparty default, or a market that moves.',
  },
  {
    name: 'Earnings volatility remediation',
    family: 'earnings',
    note: 'Finding where P&L timing is being set by configuration rather than by intent. Volatility that nobody chose is almost always a designation, a curve, or a booking model doing something the desk never asked it to do.',
  },
  {
    name: 'Audit defense and documentation',
    family: 'earnings',
    note: 'The evidence trail a reviewer asks for, assembled before they ask for it. Written so the CFO can explain the architecture to analysts and the CAO can defend the treatment without reopening the implementation.',
  },
]

/*
 * Instrument classes, described rather than listed. The names are the same six
 * `productDomains` carries for /services and a test pins them to it, so the two
 * pages cannot drift apart; only the notes live here.
 */
export const calypsoDomains: readonly CalypsoEntry[] = [
  {
    name: 'Interest-rate derivatives',
    note: 'Swaps, caps, floors, and swaptions, and the curves behind them.',
  },
  {
    name: 'FX',
    note: 'Spot, forwards, swaps, and options across currency pairs.',
  },
  {
    name: 'Fixed income',
    note: 'Bonds and repo, with the accrual and settlement behaviour they carry.',
  },
  {
    name: 'Money markets',
    note: 'Short-dated funding, deposits, and liquidity instruments.',
  },
  {
    name: 'Commodities',
    note: 'Physical and financial exposure, and the delivery terms attached to it.',
  },
  {
    name: 'Equity derivatives',
    note: 'Options, futures, and total return structures on single names and indices.',
  },
]

export const calypsoContent = {
  hero: {
    eyebrow: 'Nasdaq Calypso expertise',
    headlineLead: 'Calypso since 2004.',
    headlineTurn: 'Every office it touches.',
    body: 'Senior-led advisory across the full trade lifecycle, from the first booking decision to the close it eventually reaches.',
    primaryCta: 'Discuss a mandate',
    secondaryCta: 'Explore the platform',
  },
  authority: [
    { value: 'Since 2004', label: 'Working in Calypso' },
    { value: 'Front to back', label: 'One connected delivery context' },
    { value: 'Banks and hedge funds', label: 'Institutional scope' },
    { value: 'Senior-led', label: 'Judgment at the point of decision' },
  ],
  /*
   * The hero schematic. Bands are labelled in the vernacular the work uses,
   * and the flow line runs the way a trade does.
   */
  schematic: {
    axis: 'Nasdaq Calypso',
    /* Label for the consequence band. The band inherited the cut section's
       eyebrow, which described a section that no longer exists. */
    consequenceLabel: 'What configuration decides',
    /*
     * The console's own introduction. It did not have one while it was the
     * hero, which meant a reader met a seven-stage selector with no statement
     * of what it was for or how to work it. The body does both.
     */
    eyebrow: 'The platform, stage by stage',
    headlineLead: 'One trade,',
    headlineTurn: 'seven places it goes wrong.',
    body: 'A Calypso configuration is not eight separate systems. It is one trade moving through seven stages, each inheriting what the stage before it decided. Select any stage to see what the platform does there, the objects it is built from, and the decision it hands to everything downstream.',
    /*
     * `span` is the stretch of the trade lifecycle each office owns, given as
     * chainStage ids so the coverage bars are drawn from the same seven stages
     * /services uses. A test pins both ends to real stages and checks they run
     * forward, because a reversed span would silently render an inverted bar
     * rather than failing.
     */
    /*
     * `note` is a plain-English gloss, not a subtitle. Front, middle and back
     * office is the industry's vocabulary and the audience's, but a diagram
     * that only labels the three and expects the reader to decode them is
     * quizzing rather than explaining. Every place a band is named, this is
     * shown with it.
     */
    bands: [
      {
        id: 'front',
        label: 'Front office',
        note: 'Where the trade is made',
        covers:
          'Product coverage, trade capture, curve construction, and pricing configuration',
        span: { from: 'capture', to: 'valuation' },
      },
      {
        id: 'middle',
        label: 'Middle office',
        note: 'Where the risk is measured',
        covers:
          'Sensitivities, limits, margin, exposure, and the market data all of it depends on',
        span: { from: 'risk', to: 'collateral' },
      },
      {
        id: 'back',
        label: 'Back office',
        note: 'Where the money moves and the books close',
        covers:
          'Settlement, confirmations, sub-ledger posting, hedge designation, and regulatory submission',
        span: { from: 'settlement', to: 'reporting' },
      },
    ],
    acrossLabel: 'Across the lifecycle',
    acrossSpan: { from: 'capture', to: 'reporting' },

    /*
     * What the platform actually does at each stage, and the failure mode that
     * concentrates there.
     *
     * The earlier version of this glossed each stage for a reader outside a
     * bank ("It is priced"). That was the wrong audience: the people who
     * commission this work run these desks, and a line that explains what
     * pricing is tells them nothing they do not know while saying nothing
     * about the work. `breaks` is the half that earns the row, because
     * knowing where a stage fails is the whole of the expertise.
     *
     * Scope and failure mode only. No claim about how often any of it is
     * caught, or by whom, which is what the guardrails are for. Keyed to
     * chainStage ids.
     */
    stageDetail: {
      capture: {
        does: 'Trade booked against product, book, counterparty, and static data',
        breaks: 'A product modelled wrong here is inherited by every number downstream',
      },
      valuation: {
        does: 'Curves built, marks struck, independent price verification run',
        breaks: 'Curve configuration that prices correctly and books incorrectly',
      },
      risk: {
        does: 'Sensitivities, limits, and the market data the measures depend on',
        breaks: 'Risk numbers that do not tie back to what the front office holds',
      },
      collateral: {
        does: 'Margin called, exposure agreed, agreement terms applied',
        breaks: 'Terms that live in the signed document but not in the platform',
      },
      settlement: {
        does: 'Cash and securities move, confirmations matched, breaks worked',
        breaks: 'Exception paths with no owner, no queue, and no resolution',
      },
      ledger: {
        does: 'Sub-ledger posts, hedge designation and effectiveness carried through',
        breaks: 'Designation that moves earnings into the wrong period, quietly',
      },
      reporting: {
        does: 'Regulatory submissions assembled and traced back to the transaction',
        breaks: 'A submission nobody can walk back to the trade that produced it',
      },
    },

    /*
     * The working detail behind each stage: the configuration objects the
     * stage is actually made of, what has to be right before it, and what it
     * decides after it.
     *
     * This exists because the console was a large surface with two short
     * paragraphs on it. The size was asserting density the content did not
     * have, which is the tell that reads as a slide rather than as a system.
     * These are the objects a Calypso configuration is genuinely composed of,
     * described as scope: no metric, no outcome, no claim about work
     * performed. Ulysses should confirm the object names against the versions
     * he works on, the same way he should confirm the office spans.
     */
    stageLedger: {
      capture: {
        objects: ['Product definition', 'Book', 'Counterparty', 'Static data'],
        depends: 'The product model, legal entity, and book hierarchy already being right',
        carries: 'Every valuation, risk, and accounting number the trade goes on to produce',
      },
      valuation: {
        objects: ['Quote sets', 'Curve definitions', 'Pricing environment', 'Mark to market'],
        depends: 'Curve construction and the quotes feeding it',
        carries: 'P&L, sensitivities, and the marks the ledger posts against',
      },
      risk: {
        objects: ['Sensitivities', 'Limits', 'Market data', 'Scenario sets'],
        depends: 'Positions and marks tying back to what the desk actually holds',
        carries: 'Limit monitoring, margin requirement, and capital measures',
      },
      collateral: {
        objects: ['Agreement terms', 'Margin calls', 'Exposure', 'Eligibility schedules'],
        depends: 'Agreement terms being represented in the platform, not only signed',
        carries: 'Funding requirement, and the disputes that follow a call',
      },
      settlement: {
        objects: ['Settlement instructions', 'Confirmations', 'Netting sets', 'Break queues'],
        depends: 'Counterparty static data and instruction routing',
        carries: 'Cash and securities movement, and the breaks somebody has to own',
      },
      ledger: {
        objects: ['Posting rules', 'Sub-ledger', 'Hedge designation', 'Effectiveness testing'],
        depends: 'The booking model and designation decided back at capture',
        carries: 'Which period earnings land in, and what an auditor is shown',
      },
      reporting: {
        objects: ['Submission sets', 'Trade repository', 'Reconciliation', 'Traceability'],
        depends: 'Every upstream identifier surviving the journey intact',
        carries: 'What the regulator receives, and what can be walked back to a trade',
      },
    },

    /*
     * The argument the page makes in prose, drawn instead of stated: a
     * decision taken early lands somewhere else entirely. Both of these are
     * restatements of positions already published on the experience page
     * ("booking models shape capital consumption ... hedge designation shapes
     * earnings volatility"), not new claims.
     */
    consequences: [
      {
        id: 'capital',
        from: 'capture',
        to: 'ledger',
        label: 'How a trade is booked decides the capital it consumes.',
      },
      {
        id: 'earnings',
        from: 'valuation',
        to: 'reporting',
        label: 'How a hedge is designated decides earnings volatility.',
      },
    ],
  },
  practices: {
    eyebrow: 'Where the platform is worked',
    headlineLead: 'Eight areas,',
    headlineTurn: 'one platform.',
    body: 'Calypso decisions rarely stay inside the module that made them. These are the areas where that experience sits.',
  },
  programs: {
    eyebrow: 'What the work produces',
    headlineLead: 'Eight programs,',
    headlineTurn: 'six instrument classes.',
    body: 'The problems these engagements address, and the products they are applied across.',
  },
  delivery: {
    eyebrow: 'How the work is scoped',
    headlineLead: 'Four shapes',
    headlineTurn: 'a Calypso mandate takes.',
    /*
     * This section shipped with no body at all, so four mandate rows arrived
     * with nothing framing them. What separates the four is where risk sits,
     * which is the sentence that was missing.
     */
    body: 'Most Calypso engagements arrive as one of four shapes. What separates them is not the technology involved but where the risk concentrates, and which office ends up carrying it when a date moves.',
  },
  domains: {
    label: 'Applied across',
    items: productDomains,
  },
  contact: homepageContent.contact,
} as const
