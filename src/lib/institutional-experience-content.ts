import { homepageContent } from './homepage-content'
import type { AuthorityIconName } from './homepage-content'

/*
 * The real headshot, supplied by Ulysses. Now that the picture is genuinely of
 * him the alt text names him, which it could not do while the slot held a
 * stand-in.
 */
export const practitionerPortrait = {
  src: '/media/experience/ulysses-williams.jpg',
  alt: 'Ulysses Williams, President of Ulixes Corporation.',
  isPlaceholder: false,
} as const

/*
 * A different frame from the portrait slot. Running one image twice on a page
 * is the repetition that made the homepage's two skylines read as stock.
 */
/*
 * A colonnaded stone hall, carried by the sector taxonomy. An abstract concrete
 * study said nothing about institutions, which is the subject of this page.
 */
export const institutionsMedia = {
  src: '/media/experience/ulixes-institutional-hall.jpg',
  alt: 'A colonnaded stone hall receding along a deep central axis under overcast light.',
} as const

/*
 * Headlines are stored split rather than as one string. EB Garamond was loaded
 * in the layout and used nowhere, so the site was paying for a serif it never
 * set. The lead states the fact in the sans; the turn — the qualifying or
 * inverting clause — is set in the serif italic. Splitting in the data keeps
 * the boundary an editorial decision rather than a regex over a sentence.
 */
export const institutionalExperienceContent = {
  introduction: {
    eyebrow: 'Institutional experience',
    /*
     * Recovered from the pre-redesign hero, which read "Built inside global
     * capital markets institutions over two decades. Not alongside them." The
     * replacement stated a fact where the other pages state a position, and
     * this line is the negation-heavy house voice the site is written in.
     */
    headlineLead: 'Inside the institutions.',
    headlineTurn: 'Not alongside them.',
    body: 'Ulysses Williams has worked with Calypso since 2004, within treasury teams, derivatives operations, and core infrastructure programs where the decisions tied directly to balance sheets, controls, and regulatory outcomes.',
    cta: 'Discuss a mandate',
    /*
     * These deliberately differ from the homepage authority dock. That dock is
     * the summary of the practice; this row is what only this page can claim,
     * so it counts sectors and programs rather than restating the credentials
     * every other page already carries.
     */
    summary: [
      { label: 'Institution types', value: '7 sectors' },
      { label: 'Calypso execution', value: '20+ years' },
      { label: 'Program categories', value: '8 disciplines' },
      { label: 'North America · Europe · APAC · Latin America', value: '4 regions' },
    ],
  },
  practitioner: {
    eyebrow: 'The practitioner',
    name: 'Ulysses Williams',
    portraitCaption: 'San Francisco',
    headline: 'Led by Ulysses Williams.',
    role: 'President',
    specialism: 'Calypso subject-matter expert',
    body: 'Ulysses Williams is President of Ulixes Corporation and a Calypso subject-matter expert. Since beginning work with Calypso Technology in 2004, his perspective has connected decisions across the operating chain.',
    supporting:
      'Ulixes is senior led, keeping the practitioner close to the mandate and the dependencies that shape delivery.',
    cta: 'View Ulysses on LinkedIn',
    linkedinUrl: homepageContent.credibility.linkedinUrl,
  },
  /*
   * Operating breadth and regional reach were two thin sections: three offices
   * in one, four words in the other, with the stat row already stating the
   * region count. Together they make one section about the scope of the work,
   * which is what both were separately gesturing at.
   */
  operating: {
    eyebrow: 'Scope of the work',
    headline: 'Front to back, and across four regions.',
    body: 'Calypso decisions move across product, risk, operations, settlement, and reporting. The experience is viewed as one connected delivery context, wherever the institution sits.',
    officesLabel: 'Operating breadth',
    regionsLabel: 'Regional reach',
    regionsNote: 'San Francisco based, international in perspective.',
    offices: [
      { name: 'Front office', scope: 'Product' },
      { name: 'Middle office', scope: 'Risk' },
      { name: 'Back office', scope: 'Operations · settlement · reporting' },
    ],
  },
  institutions: {
    eyebrow: 'Where the work has happened',
    headlineLead: 'Seven kinds of institution,',
    headlineTurn: 'one set of dependencies.',
    body: 'Institution types where Calypso and adjacent capital markets infrastructure has been architected, modernized, or defended. No client is named.',
    categories: [
      {
        name: 'Global systemically important banks',
        description:
          'Enterprise treasury and derivatives architecture supporting large-scale hedging programs, capital optimization, liquidity management, and regulatory scrutiny.',
      },
      {
        name: 'U.S. super-regionals and large regionals',
        description:
          'Interest rate risk, balance sheet management, and enterprise hedge accounting frameworks across volatile rate cycles.',
      },
      {
        name: 'Farm credit and agricultural lending',
        description:
          'Structured lending and derivatives infrastructure supporting complex funding and commodity exposure strategies.',
      },
      {
        name: 'Multilateral and trade finance banks',
        description:
          'Cross-border derivatives, structured flows, and risk management platforms operating across emerging and developed markets.',
      },
      {
        name: 'Federal liquidity and housing finance',
        description:
          'Member services infrastructure and balance sheet management systems within highly regulated liquidity frameworks.',
      },
      {
        name: 'Global asset managers',
        description:
          'Pre- and post-acquisition platform integration, portfolio operations infrastructure, and institutional risk architecture.',
      },
      {
        name: 'Brokerage and clearing platforms',
        description:
          'Retail and institutional trading infrastructure programs spanning front-to-back processing, capital markets controls, and operational risk governance.',
      },
    ],
  },
  regions: {
    eyebrow: 'Regional experience',
    headline: 'San Francisco based. International in perspective.',
    body: 'Ulixes is based in San Francisco, with work across North America, Europe, APAC, and Latin America.',
    items: ['North America', 'Europe', 'APAC', 'Latin America'],
  },
  principles: {
    eyebrow: 'Working perspective',
    headlineLead: 'Six positions',
    headlineTurn: 'the work is built on.',
    body: 'Restored from the philosophy the practice was founded on, and compressed to the line that matters in each.',
    /*
     * Recovered from the retired /philosophy page, which held the strongest
     * writing on the old site and was lost when that route was retired. The
     * originals ran three paragraphs each and spoke as a firm; these are the
     * argument of each, in the practitioner voice.
     */
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
  /*
   * This page's own close. The homepage, expertise and experience pages all
   * ended on the identical shared sentence, which is the same repetition the
   * rest of the site has been cleared of. This one lands from what the page
   * argues: he has worked inside these institutions, and these are the
   * positions he works from.
   */
  contact: {
    eyebrow: 'Start a conversation',
    headlineLead: 'Put that experience',
    headlineTurn: 'against the decision.',
    body: 'Describe the platform change, where it sits, and what it depends on.',
    response: 'Ulysses reads every inquiry and replies directly.',
    cta: homepageContent.contact.cta,
    email: homepageContent.contact.email,
  },
} as const
