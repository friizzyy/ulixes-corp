/*
 * Home page copy, taken from the approved prototype (docs/build-spec/home).
 * Where the desktop and phone files word a line differently, both are kept:
 * `desk` for >= 768px, `phone` for <= 767px.
 *
 * Other content files read `homepageContent.contact` and
 * `homepageContent.credibility.linkedinUrl`, and the icon / material types
 * below; keep those exports stable.
 */

export type AuthorityIconName = 'history' | 'lifecycle' | 'regions' | 'access'
export type ServiceIconName =
  | 'implementation'
  | 'migration'
  | 'testing'
  | 'readiness'
export type ServiceMaterial = 'steel' | 'sage' | 'clay' | 'platinum'

export interface HeroFact {
  label: string
  value: string
  /** The dock's detail line on desktop and tablet. */
  detail: string
  /** The ticker's detail line on phone. */
  phoneDetail: string
  /** Where the dock card leads, when it leads somewhere. */
  href?: string
}

export interface HomeService {
  id: 'architecture' | 'accounting' | 'trading' | 'assurance'
  number: string
  title: string
  scope: string
  href: string
  image: { src: string; width: number; height: number }
}

export interface LifecycleStage {
  name: string
  office: 'Front office' | 'Middle office' | 'Back office'
  does: string
}

export interface PractitionerFact {
  value: string
  /** Desktop unit beside the figure ("offices"); absent for the year. */
  unit?: string
  detail: string
  /** Phone label under the figure and the shorter phone detail. */
  phoneLabel: string
  phoneDetail: string
}

export const LINKEDIN_URL = 'https://www.linkedin.com/in/ulysses-williams-2379634/'

export const homepageContent = {
  hero: {
    eyebrow: {
      desk: 'Senior-led advisory for banks and hedge funds',
      phone: 'Senior-led · Banks & hedge funds',
    },
    headline: 'Capital markets transformation & architecture.',
    body: {
      desk: 'Deep expertise in Nasdaq Calypso and complex front-to-back transformation.',
      phone: 'Deep expertise in Nasdaq Calypso and front-to-back transformation.',
    },
    primaryCta: 'Discuss a mandate',
    secondaryCta: 'Review the capabilities',
    imageAlt:
      'Blue-hour view of downtown San Francisco with Salesforce Tower and the Financial District skyline.',
    videoSrc: '/media/home/ulixes-san-francisco-loop.mp4',
    posterSrc: '/media/home/ulixes-san-francisco-blue-hour.webp',
    facts: [
      {
        label: 'Clients',
        href: '/institutional-experience#institutions',
        value: 'Banks & hedge funds',
        detail: 'Institutional scope',
        phoneDetail: 'Institutional scope',
      },
      {
        label: 'Institutions',
        href: '/institutional-experience#institutions',
        value: '7 kinds',
        detail: 'G-SIBs to clearing platforms',
        phoneDetail: 'of institution',
      },
      {
        label: 'Lifecycle',
        href: '/nasdaq-calypso?stage=capture',
        value: 'Capture to reporting',
        detail: 'Every stage of the trade',
        phoneDetail: 'Every stage of the trade',
      },
      {
        label: 'Base',
        value: 'San Francisco',
        detail: 'Advising internationally',
        phoneDetail: 'Advising internationally',
      },
    ] satisfies readonly HeroFact[],
  },
  services: {
    eyebrow: 'What the work covers',
    headlineLead: 'Four points where',
    headlineTurn: 'delivery risk concentrates.',
    body: 'Transformation and architecture lead. Accounting, risk, post-trade, and assurance follow the same decision through the system.',
    cta: 'All services',
    href: '/services',
    items: [
      {
        id: 'architecture',
        number: '01',
        title: 'Transformation & architecture',
        scope: 'Modernization · Architecture · Operating model',
        href: '/services?card=architecture',
        image: { src: '/media/services/ulixes-services-atrium.jpg', width: 1920, height: 1280 },
      },
      {
        id: 'accounting',
        number: '02',
        title: 'Accounting & controls',
        scope: 'Accounting · Reconciliation · Controls',
        href: '/services?card=accounting',
        image: { src: '/media/experience/ulixes-institutional-hall.jpg', width: 1800, height: 1350 },
      },
      {
        id: 'trading',
        number: '03',
        title: 'Trading, risk & post-trade',
        scope: 'Pricing · Collateral · Lifecycle',
        href: '/services?card=trading',
        image: { src: '/media/home/ulixes-financial-district-day.webp', width: 1672, height: 941 },
      },
      {
        id: 'assurance',
        number: '04',
        title: 'Automation & assurance',
        scope: 'Testing · Validation · Readiness',
        href: '/services?card=assurance',
        image: { src: '/media/services/ulixes-services-floor.jpg', width: 1920, height: 1280 },
      },
    ] satisfies readonly HomeService[],
  },
  calypso: {
    eyebrow: 'Nasdaq Calypso',
    headlineLead: 'Calypso since 2004.',
    headlineTurn: 'Every office it touches.',
    body: {
      desk: 'Senior-led advisory across the full trade lifecycle, from the first booking decision to the close it eventually reaches.',
      phone: 'Senior-led advisory across the full trade lifecycle.',
    },
    stats: [
      { value: '7', label: 'Lifecycle stages' },
      { value: '8', label: 'Programs' },
      { value: '6', label: 'Instrument classes' },
    ],
    diagramLabel: 'One trade · Seven stages',
    lanes: ['Front', 'Middle', 'Back'],
    cta: 'Explore Calypso expertise',
    href: '/nasdaq-calypso',
    stages: [
      {
        name: 'Capture',
        office: 'Front office',
        does: 'Trade booked against product, book, counterparty, and static data',
      },
      {
        name: 'Valuation',
        office: 'Front office',
        does: 'Curves built, marks struck, independent price verification run',
      },
      {
        name: 'Risk',
        office: 'Middle office',
        does: 'Sensitivities, limits, and the market data the measures depend on',
      },
      {
        name: 'Collateral',
        office: 'Middle office',
        does: 'Margin called, exposure agreed, agreement terms applied',
      },
      {
        name: 'Settlement',
        office: 'Back office',
        does: 'Cash and securities move, confirmations matched, breaks worked',
      },
      {
        name: 'Ledger',
        office: 'Back office',
        does: 'Sub-ledger posts, hedge designation and effectiveness carried through',
      },
      {
        name: 'Regulatory reporting',
        office: 'Back office',
        does: 'Regulatory submissions assembled and traced back to the transaction',
      },
    ] satisfies readonly LifecycleStage[],
  },
  practitioner: {
    eyebrow: 'The practitioner',
    headlineLead: 'One senior practitioner,',
    headlineTurn: 'on every mandate.',
    name: 'Ulysses Williams',
    role: 'President · Calypso subject-matter expert',
    imageSrc: '/media/experience/ulysses-williams.jpg',
    imageAlt: 'Portrait of Ulysses Williams, President of Ulixes Corporation.',
    experienceCta: { desk: 'Institutional experience', phone: 'Experience' },
    experienceHref: '/institutional-experience',
    linkedinCta: 'LinkedIn',
    facts: [
      {
        value: '2004',
        detail: 'Calypso work since',
        phoneLabel: 'Calypso',
        phoneDetail: 'Work since',
      },
      {
        value: '3',
        unit: 'offices',
        detail: 'Front, middle and back',
        phoneLabel: 'Offices',
        phoneDetail: 'Front to back',
      },
      {
        value: '4',
        unit: 'regions',
        detail: 'NA · EU · APAC · LatAm',
        phoneLabel: 'Regions',
        phoneDetail: 'Worldwide',
      },
    ] satisfies readonly PractitionerFact[],
    briefLead: 'Put that experience',
    briefTurn: 'against the decision.',
    briefBody: {
      desk: 'Describe the platform change, where it sits, and what it depends on. A useful first note covers three things.',
      phone: 'A useful first note covers three things.',
    },
    briefPoints: [
      { title: 'The platform state', body: 'What runs today and what is changing' },
      { title: 'The delivery stage', body: 'Design, build, migration, testing or go-live' },
      { title: 'The decision', body: 'What needs senior attention, and by when' },
    ],
    cta: 'Discuss a mandate',
  },
  /* Read by the experience page. */
  credibility: {
    linkedinUrl: LINKEDIN_URL,
  },
  /* Read by the services, Calypso, expertise and experience content. */
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

