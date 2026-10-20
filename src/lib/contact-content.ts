import { siteConfig } from './content'

/*
 * The approved copy of the redesigned contact page (docs/build-spec/contact).
 * Bound by the verified-claims guardrails: no company-wide "we", no em dashes.
 *
 * /api/contact reads name, email, company, message and recaptchaToken, and
 * uses practitioner.name in its confirmation email. The three-step form asks
 * more questions than the API has fields, so the platform answers and the
 * decision are composed into `message` (see composeInquiryMessage).
 */

export const deliveryStages = [
  'Design',
  'Build',
  'Migration',
  'Testing',
  'Go-live',
  'Post go-live',
] as const

export type DeliveryStage = (typeof deliveryStages)[number]

export const contactPageContent = {
  intro: {
    eyebrow: 'Discuss a mandate',
    headlineLead: 'Three questions.',
    headlineTurn: 'One conversation.',
    /* The phone hero shows the first sentence only. */
    ledeLead: 'For decisions where product, risk, operations and reporting meet.',
    ledeRest: 'Answer three short questions, or write directly. Either way, it reaches Ulysses.',
  },
  practitioner: {
    name: 'Ulysses Williams',
    note: 'President. Reads every inquiry and replies himself.',
    /* The phone card's addressee row. */
    toLabel: 'To',
    toNote: 'President · reads every inquiry himself',
    portrait: {
      src: '/media/experience/ulysses-williams.jpg',
      alt: 'Ulysses Williams',
    },
  },
  direct: [
    { label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    {
      label: 'Telephone',
      value: siteConfig.phone,
      href: `tel:${siteConfig.phone.replace(/[^+\d]/g, '')}`,
    },
    { label: 'Office', value: 'San Francisco, California' },
  ],
  hero: {
    src: '/media/home/ulixes-san-francisco-blue-hour.webp',
  },
  steps: [
    { short: 'You', long: 'You' },
    { short: 'Platform', long: 'The platform' },
    { short: 'Decision', long: 'The decision' },
  ],
  you: {
    title: 'Who is asking?',
    hint: 'So Ulysses knows who he is replying to.',
    nameLabel: 'Name',
    namePlaceholder: 'Full name',
    companyLabel: 'Institution',
    companyPlaceholder: 'Bank, fund or firm',
    emailLabel: 'Work email',
    emailPlaceholder: 'you@institution.com',
  },
  platform: {
    title: 'Where does it sit?',
    hint: 'The delivery stage, and the platform as it stands today.',
    stageLabel: 'Delivery stage',
    platformLabel: 'Platform today',
    platformPlaceholder: 'For example, front to back',
  },
  decision: {
    title: 'What needs deciding?',
    hint: 'One or two sentences is enough. Detail can wait for the call.',
    decisionLabel: 'The decision',
    decisionPlaceholder: 'The decision that needs senior attention.',
    whenLabel: 'By when',
    whenOptional: 'Optional',
    whenPlaceholder: 'A date, a release or a quarter',
  },
  actions: {
    continue: 'Continue',
    send: 'Send inquiry',
    sending: 'Sending',
    back: 'Back',
  },
  errors: {
    name: 'Name is required',
    company: 'Institution is required',
    email: 'Email is required',
    emailInvalid: 'Please enter a valid email',
    platform: 'Platform today is required',
    decision: 'The decision is required',
    decisionShort: 'The decision must be at least 10 characters',
  },
  sent: {
    status: 'Inquiry sent',
    title: 'Thank you.',
    titleNamed: (firstName: string) => `Thank you, ${firstName}.`,
    hint: 'It has gone to Ulysses directly.',
    next: [
      'He reads it himself, usually within one business day.',
      `He replies from ${siteConfig.email}, with a time to talk.`,
      'A first conversation about the decision, not a pitch.',
    ],
    again: 'Start a new inquiry',
  },
  failure: {
    title: 'That did not send.',
    description: `Try again, or write directly to ${siteConfig.email}.`,
  },
} as const

/* The API's own limits (src/app/api/contact/route.ts). */
export const fieldLimits = {
  name: 120,
  email: 254,
  company: 160,
  platform: 160,
  when: 120,
  decision: 3400,
} as const

export interface InquiryAnswers {
  stage: DeliveryStage
  platform: string
  decision: string
  when: string
}

/**
 * The one message /api/contact receives: the stage and platform first, so the
 * notification reads as a brief, then the decision in the visitor's words.
 */
export function composeInquiryMessage({ stage, platform, decision, when }: InquiryAnswers): string {
  const lines = [`Delivery stage: ${stage}`, `Platform today: ${platform.trim()}`]
  if (when.trim()) lines.push(`By when: ${when.trim()}`)
  return `${lines.join('\n')}\n\nThe decision:\n${decision.trim()}`
}
