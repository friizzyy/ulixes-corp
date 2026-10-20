/** Copied rather than imported so this page does not depend on the homepage's content file. */
const LINKEDIN_URL = 'https://www.linkedin.com/in/ulysses-williams-2379634/'

/*
 * Copy for /institutional-experience, as approved in the redesign prototype
 * (docs/build-spec/experience). Headlines are stored as a lead (ink) and a
 * turn (steel); the turn is never italic.
 */

/** The real headshot, supplied by Ulysses. Also used by the contact page. */
export const practitionerPortrait = {
  src: '/media/experience/ulysses-williams.jpg',
  alt: 'Ulysses Williams, President of Ulixes Corporation.',
  width: 1024,
  height: 1280,
} as const

/** The colonnaded hall behind the hero portrait. Decorative. */
export const institutionsMedia = {
  src: '/media/experience/ulixes-institutional-hall.jpg',
  alt: 'A colonnaded stone hall receding along a deep central axis under overcast light.',
} as const

export type InstitutionIcon =
  | 'bank'
  | 'regional'
  | 'farm'
  | 'globe'
  | 'housing'
  | 'asset'
  | 'clearing'

export const institutionalExperienceContent = {
  hero: {
    eyebrow: 'Institutional experience',
    headlineLead: 'Inside the institutions.',
    headlineTurn: 'Not alongside them.',
    body: 'Ulysses Williams has worked with Calypso since 2004, within treasury teams, derivatives operations, and core infrastructure programs where the decisions tied directly to balance sheets, controls, and regulatory outcomes.',
    cta: 'Discuss a mandate',
    linkedinLabel: 'View on LinkedIn',
    linkedinUrl: LINKEDIN_URL,
    name: 'Ulysses Williams',
    role: 'President · Calypso subject-matter expert',
    credentials: [
      { label: 'Platform', value: 'Nasdaq Calypso, since 2004' },
      { label: 'Coverage', value: 'Front, middle and back office' },
      { label: 'Reach', value: 'Four regions' },
    ],
  },
  institutions: {
    eyebrow: 'Where the work has happened',
    headlineLead: 'Seven kinds of institution,',
    headlineTurn: 'one set of dependencies.',
    categories: [
      {
        icon: 'bank',
        name: 'Global systemically important banks',
        description:
          'Enterprise treasury and derivatives architecture supporting large-scale hedging programs, capital optimization, liquidity management, and regulatory scrutiny.',
      },
      {
        icon: 'regional',
        name: 'U.S. super-regionals and large regionals',
        description:
          'Interest rate risk, balance sheet management, and enterprise hedge accounting frameworks across volatile rate cycles.',
      },
      {
        icon: 'farm',
        name: 'Farm credit and agricultural lending',
        description:
          'Structured lending and derivatives infrastructure supporting complex funding and commodity exposure strategies.',
      },
      {
        icon: 'globe',
        name: 'Multilateral and trade finance banks',
        description:
          'Cross-border derivatives, structured flows, and risk management platforms operating across emerging and developed markets.',
      },
      {
        icon: 'housing',
        name: 'Federal liquidity and housing finance',
        description:
          'Member services infrastructure and balance sheet management systems within highly regulated liquidity frameworks.',
      },
      {
        icon: 'asset',
        name: 'Global asset managers',
        description:
          'Pre- and post-acquisition platform integration, portfolio operations infrastructure, and institutional risk architecture.',
      },
      {
        icon: 'clearing',
        name: 'Brokerage and clearing platforms',
        description:
          'Retail and institutional trading infrastructure programs spanning front-to-back processing, capital markets controls, and operational risk governance.',
      },
    ] satisfies ReadonlyArray<{ icon: InstitutionIcon; name: string; description: string }>,
    summary: {
      count: '7',
      label: 'Kinds of institution',
      body: 'Different institutions, the same trade lifecycle underneath. No client is named.',
      cta: 'Discuss a mandate',
    },
  },
  positions: {
    eyebrow: 'Working perspective',
    headlineLead: 'Six positions',
    headlineTurn: 'the work is built on.',
    items: [
      {
        title: 'Infrastructure is financial architecture',
        description:
          'Booking models shape capital consumption, lifecycle configuration shapes P&L timing, and hedge designation shapes earnings volatility. Those are architectural choices with balance sheet consequences, not implementation details.',
      },
      {
        title: 'Mastery is alignment',
        description:
          'The hardest problems live between disciplines. Accounting assumes system behaviour, risk depends on data the system may not capture cleanly, and reporting needs lineage across organizational boundaries. Misalignment is where institutional risk hides.',
      },
      {
        title: 'Lifecycle is the stress test',
        description:
          "Point-in-time validation confirms that a system handles today's trades under today's conditions. It says nothing about maturity, hedge ineffectiveness, counterparty default, or market stress.",
      },
      {
        title: 'Migration is a financial event',
        description:
          'Every mapping decision carries accounting, capital, and regulatory implications. The technical migration is the easy part. Preserving financial control through the transition is the work.',
      },
      {
        title: 'Capital awareness changes everything',
        description:
          'The same economic trade can consume different capital depending on how it is booked, how it is netted, how collateral is reflected, and how the system classifies it. Capital belongs at design time, not downstream.',
      },
      {
        title: 'Control is the outcome',
        description:
          'An architecture the CFO can explain to analysts, the CAO can defend to auditors, the CRO can trust for risk decisions, and successors can maintain without a phone call.',
      },
    ],
  },
  close: {
    lead: 'Put that experience',
    turn: 'against the decision.',
  },
} as const
