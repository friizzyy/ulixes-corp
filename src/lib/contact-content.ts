import { siteConfig } from './content'

/*
 * Copy is bound by the verified-claims guardrails. No company-wide "we", no
 * em dashes. Field names are untouched: /api/contact reads name, email,
 * company, message, recaptchaToken and must keep matching.
 */

export const contactPageContent = {
  header: {
    eyebrow: 'Capital markets transformation and architecture',
    /* Split so the first phrase can carry more weight than the rest, the way
       the reference sets its headline. */
    headlineLead: 'Discuss',
    headlineRest: 'the mandate.',
    body: 'If a decision sits where product, risk, operations, settlement, and reporting meet, and it needs senior attention, it is worth a conversation.',
  },
  practitioner: {
    label: 'Who reads this',
    name: 'Ulysses Williams',
    /* The biography belongs to the experience page. This page needs only to
       say who reads the message and how quickly he replies. */
    note: 'Every inquiry is read by the practitioner who would run the work, not by an account team.',
  },
  direct: {
    emailLabel: 'E-mail',
    email: siteConfig.email,
    phoneLabel: 'Phone number',
    phone: siteConfig.phone,
  },
  form: {
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Work email',
    emailPlaceholder: 'you@institution.com',
    companyLabel: 'Institution',
    companyPlaceholder: 'Your institution',
    companyOptional: 'Optional',
    messageLabel: 'Message',
    messagePlaceholder:
      'Platform change, delivery stage, and the decision that needs attention.',
    submitLabel: 'Send inquiry',
    submittingLabel: 'Sending',
  },
  success: {
    title: 'Inquiry received.',
    description: 'Ulysses will respond directly, usually within one business day.',
    resetLabel: 'Send another',
  },
  error: {
    title: 'That did not send.',
    description: `Try again, or write directly to ${siteConfig.email}.`,
  },
} as const
