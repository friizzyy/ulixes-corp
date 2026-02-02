// Site-wide content configuration
// Edit this file to update copy across the entire site

export const siteConfig = {
  name: 'Ulixes Corporation',
  shortName: 'Ulixes',
  tagline: 'Capital Markets Infrastructure. Engineered for Control.',
  description: 'With 20+ years of proven Calypso delivery, Ulixes helps banks and hedge funds migrate, integrate, and innovate on vendor-hosted platforms.',
  url: 'https://ulixescorp.com',
  email: 'ulysses.williams@gmail.com',
  phone: '+1 (415) 283-9983',
}

export const navigation = {
  main: [
    { label: 'Philosophy', href: '/philosophy' },
    { label: 'Services', href: '/services' },
    { label: 'Experience', href: '/institutional-experience' },
    { label: 'Work', href: '/work' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  footer: {
    services: [
      { label: 'Calypso Implementation', href: '/services#implementation' },
      { label: 'Platform Migration', href: '/services#migration' },
      { label: 'AI-Driven Compliance', href: '/services#compliance' },
      { label: 'Intelligent Testing', href: '/services#testing' },
    ],
    company: [
      { label: 'Philosophy', href: '/philosophy' },
      { label: 'About', href: '/about' },
      { label: 'Work', href: '/work' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
}

export const homeContent = {
  hero: {
    badge: 'Calypso Platform Specialists',
    headline: 'Infrastructure Is',
    headlineAccent: 'Financial Architecture',
    description: 'With 20+ years of proven Calypso delivery and 20 successful implementations, we help banks and hedge funds migrate, integrate, and innovate on vendor-hosted platforms.',
    primaryCta: 'Explore Our Services',
    secondaryCta: 'Contact Us',
  },
  terminal: {
    lines: [
      { type: 'command' as const, text: 'ulixes validate --scope lifecycle' },
      { type: 'output' as const, text: 'Lifecycle validated.' },
      { type: 'processing' as const, text: 'Hedge effectiveness analysis' },
      { type: 'output' as const, text: 'Within policy threshold.' },
      { type: 'processing' as const, text: 'Exposure aggregation review' },
      { type: 'output' as const, text: 'Netting set reconciled.' },
      { type: 'processing' as const, text: 'Capital ratio stress assessment' },
      { type: 'output' as const, text: 'Impact contained.' },
      { type: 'processing' as const, text: 'Designation stability check' },
      { type: 'output' as const, text: 'No discontinuations detected.' },
      { type: 'success' as const, text: 'Architecture validated.' },
      { type: 'success' as const, text: 'Control established.' },
    ],
  },
  stats: [
    { value: '20+', label: 'Years Experience' },
    { value: '20', label: 'Implementations' },
  ],
  philosophy: {
    label: 'Our Philosophy',
    title: 'Where Risk Hides',
    description: 'Infrastructure failures rarely announce themselves. They surface as unexpected P&L volatility, regulatory findings, or earnings surprises that erode institutional credibility.',
    points: [
      {
        title: 'Alignment Is Architecture',
        description: 'When accounting, derivatives, and risk systems diverge, the gaps become institutional vulnerabilities. We design for alignment from day one.',
      },
      {
        title: 'Lifecycle Over Static',
        description: 'Point-in-time validation misses how instruments behave under stress. We validate across the full lifecycle, from origination through maturity.',
      },
      {
        title: 'Migration Is Financial Engineering',
        description: 'Moving books isn\'t an IT project. It\'s a balance sheet event with capital, regulatory, and earnings implications that must be engineered precisely.',
      },
      {
        title: 'Control Is The Outcome',
        description: 'Go-live is not success. Institutional control that is defensible, durable, and owned internally is the only outcome that matters.',
      },
    ],
    cta: 'Read Full Philosophy',
  },
  services: {
    label: 'What We Do',
    title: 'Architecture. Not Configuration.',
    description: 'Every engagement operates under a single premise: infrastructure decisions shape earnings behavior, capital ratios, and regulatory exposure. We design accordingly.',
  },
  expertise: {
    title: 'The Intersection',
    description: 'We operate where accounting policy, derivatives mechanics, risk methodology, and system architecture converge. Most firms silo these disciplines. We integrate them.',
    features: [
      'Hedge accounting frameworks with clear designation lineage',
      'Capital-aware booking models that protect ratios under stress',
      'Migration architectures that preserve regulatory standing',
      'Lifecycle validation that anticipates auditor scrutiny',
    ],
  },
  cta: {
    title: 'Infrastructure Decisions Have Consequences',
    description: 'If you\'re evaluating a platform migration, redesigning hedge accounting, or questioning whether your current architecture can withstand scrutiny, we should talk.',
    primaryCta: 'Start a Conversation',
    secondaryCta: 'View Case Studies',
  },
}

export type ServiceIconType = 'bolt' | 'wrench' | 'chart' | 'shield'

export const services: Array<{
  id: string
  iconType: ServiceIconType
  title: string
  shortDescription: string
  fullDescription: string
  whatYouGet: string[]
  riskPrevented: string
  controlCreated: string
}> = [
  {
    id: 'implementation',
    iconType: 'bolt',
    title: 'Calypso Implementation',
    shortDescription: 'Front-to-back office implementations for banks and hedge funds on vendor-hosted Calypso platforms.',
    fullDescription: 'We bring 20+ years of Calypso delivery experience to every implementation. From initial design through go-live and beyond, we ensure your platform is configured to support your business requirements while maintaining compliance and operational efficiency.',
    whatYouGet: [
      'Front-to-back office implementation',
      'Business process analysis and optimization',
      'System configuration and customization',
      'Integration with existing infrastructure',
      'User training and knowledge transfer',
    ],
    riskPrevented: 'Implementations that miss business requirements or create operational bottlenecks.',
    controlCreated: 'A platform configured to support your specific workflows and compliance needs.',
  },
  {
    id: 'migration',
    iconType: 'chart',
    title: 'Platform Migration',
    shortDescription: 'Seamless migration to vendor-hosted Calypso platforms with minimal business disruption.',
    fullDescription: 'Migration is where experience matters most. We architect migrations as business continuity events, ensuring data integrity, regulatory compliance, and operational readiness throughout the transition.',
    whatYouGet: [
      'Migration strategy and planning',
      'Data mapping and validation',
      'Parallel run coordination',
      'Cutover execution and support',
      'Post-migration stabilization',
    ],
    riskPrevented: 'Migrations that disrupt operations or compromise data integrity.',
    controlCreated: 'A smooth transition that maintains business continuity.',
  },
  {
    id: 'compliance',
    iconType: 'shield',
    title: 'AI-Driven Compliance',
    shortDescription: 'Real-time compliance insights powered by intelligent automation.',
    fullDescription: 'Our AI-driven compliance solutions provide real-time monitoring and insights, helping you stay ahead of regulatory requirements while reducing manual oversight burden.',
    whatYouGet: [
      'Real-time compliance monitoring',
      'Automated regulatory reporting',
      'Intelligent alert management',
      'Audit trail documentation',
      'Regulatory change tracking',
    ],
    riskPrevented: 'Compliance gaps that lead to regulatory findings or penalties.',
    controlCreated: 'Proactive compliance posture with clear audit trails.',
  },
  {
    id: 'testing',
    iconType: 'wrench',
    title: 'Intelligent Testing',
    shortDescription: 'Comprehensive quality assurance for Calypso implementations and upgrades.',
    fullDescription: 'Our intelligent testing services ensure your Calypso platform performs as expected across all scenarios. We combine automated testing with deep platform expertise to identify issues before they reach production.',
    whatYouGet: [
      'Test strategy and planning',
      'Automated test development',
      'Regression testing',
      'Performance testing',
      'User acceptance testing support',
    ],
    riskPrevented: 'Production issues that disrupt operations or require emergency fixes.',
    controlCreated: 'Confidence in platform stability and performance.',
  },
]

export const caseStudies = [
  {
    id: 'calypso-migration',
    title: 'Vendor-Hosted Platform Migration',
    client: 'Major Financial Institution',
    industry: 'Banking',
    summary: 'Complete migration to vendor-hosted Calypso platform with full business continuity maintained throughout transition.',
    challenge: 'Legacy on-premise system reaching end of support. Complex integration requirements with existing downstream systems. Tight regulatory reporting deadlines requiring zero disruption.',
    approach: 'We applied our proven migration methodology developed over 20+ implementations. Comprehensive data mapping, parallel run validation, and phased cutover ensured operational continuity.',
    outcome: {
      metrics: [
        { value: 'Zero', label: 'Business Disruption' },
        { value: 'On-time', label: 'Delivery' },
        { value: 'Full', label: 'Compliance Maintained' },
      ],
    },
    services: ['Platform Migration', 'Calypso Implementation'],
  },
  {
    id: 'front-to-back',
    title: 'Front-to-Back Implementation',
    client: 'Hedge Fund',
    industry: 'Asset Management',
    summary: 'Full Calypso implementation enabling consolidated front-to-back operations across multiple asset classes.',
    challenge: 'Fragmented systems creating operational inefficiency and reporting delays. Need for real-time position management and integrated compliance monitoring.',
    approach: 'We designed and implemented an integrated Calypso solution covering trading, risk, operations, and compliance. Our AI-driven compliance tools provided real-time regulatory insights from day one.',
    outcome: {
      metrics: [
        { value: 'Real-time', label: 'Position Visibility' },
        { value: 'Integrated', label: 'Compliance' },
        { value: 'Streamlined', label: 'Operations' },
      ],
    },
    services: ['Calypso Implementation', 'AI-Driven Compliance'],
  },
  {
    id: 'qa-transformation',
    title: 'Testing Transformation',
    client: 'Regional Bank',
    industry: 'Banking',
    summary: 'Comprehensive QA program implementation reducing release cycles while improving platform stability.',
    challenge: 'Manual testing processes creating bottlenecks in release cycles. Recurring production issues eroding confidence in platform stability.',
    approach: 'We implemented our intelligent testing framework, combining automated regression testing with scenario-based validation. Deep Calypso expertise ensured comprehensive coverage of critical business flows.',
    outcome: {
      metrics: [
        { value: 'Faster', label: 'Release Cycles' },
        { value: 'Improved', label: 'Stability' },
        { value: 'Automated', label: 'Regression Testing' },
      ],
    },
    services: ['Intelligent Testing', 'Calypso Implementation'],
  },
]

export const aboutContent = {
  hero: {
    headline: 'Founded on Misalignment',
    description: 'Ulixes exists because we watched infrastructure projects fail. Not from technical defects, but from the space between accounting, risk, and technology where no one was accountable.',
  },
  origin: {
    title: 'The Origin',
    paragraphs: [
      'We came from trading floors, treasury functions, and Big Four advisory practices. We saw the same failure pattern repeatedly: infrastructure that worked technically but created financial control problems that surfaced months or years later.',
      'A hedge accounting framework that passed UAT but failed effectiveness testing under stress. A migration that completed on time but triggered capital ratio drift that took quarters to diagnose. A booking model that processed trades correctly but created earnings volatility that surprised analysts.',
      'These failures shared a common cause. The disciplines that should have been integrated were siloed: accounting policy, derivatives mechanics, risk methodology, system architecture. Each team optimized for their domain. No one owned the intersections.',
      'Ulixes was founded to own those intersections.',
    ],
  },
  philosophy: {
    title: 'What We Believe',
    points: [
      {
        title: 'Infrastructure Is Financial Architecture',
        description: 'Capital markets infrastructure is not software configuration. It is financial architecture that directly shapes earnings behavior, capital ratios, regulatory exposure, and institutional control.',
      },
      {
        title: 'Alignment Is The Work',
        description: 'The hardest problems live where accounting, risk, and systems meet. Solving them requires practitioners who speak all three languages and refuse to optimize one at the expense of another.',
      },
      {
        title: 'Durability Over Delivery',
        description: 'We design for the environment your infrastructure will face in three years, not the requirements document written today. Go-live is a milestone. Control is the outcome.',
      },
    ],
  },
  approach: {
    title: 'How We Work',
    description: 'We are senior practitioners, not staffing leverage. Every engagement is led by partners who have designed, built, and defended these systems inside institutions.',
    steps: [
      {
        number: '01',
        title: 'Architecture First',
        description: 'We define the financial architecture first: accounting treatment, capital impact, regulatory implications. Only then do we discuss technology or vendors.',
      },
      {
        number: '02',
        title: 'Lifecycle Validation',
        description: 'We validate across the full instrument lifecycle, stress scenarios, and edge cases. Point-in-time testing misses how systems actually fail.',
      },
      {
        number: '03',
        title: 'Documentation As Deliverable',
        description: 'We produce documentation that serves auditors, regulators, and your successors. Not just project sign-off.',
      },
      {
        number: '04',
        title: 'Ownership Transfer',
        description: 'We build internal capability, not consultant dependency. You should understand and own your architecture when we leave.',
      },
    ],
  },
  team: {
    title: 'The Team',
    description: 'Senior practitioners with deep Calypso platform expertise. We bring decades of experience in capital markets infrastructure, working alongside banks and hedge funds on complex implementations.',
  },
}

export const contactContent = {
  hero: {
    headline: 'Start a Conversation',
    description: 'We\'re selective about engagements. If your challenge sits at the intersection of accounting, risk, and infrastructure, and requires practitioners who understand all three, we should talk.',
  },
  form: {
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Work Email',
    emailPlaceholder: 'you@institution.com',
    companyLabel: 'Institution',
    companyPlaceholder: 'Your institution',
    messageLabel: 'What challenge are you facing?',
    messagePlaceholder: 'Platform migration, hedge accounting framework, capital optimization, infrastructure design...',
    submitLabel: 'Send Message',
    submittingLabel: 'Sending...',
  },
  success: {
    title: 'Message Received',
    description: 'A partner will respond within one business day.',
  },
  error: {
    title: 'Something went wrong',
    description: `Please try again or email us directly at ${siteConfig.email}.`,
  },
  info: {
    title: 'Direct Contact',
    items: [
      { label: 'Email', value: siteConfig.email },
      { label: 'Phone', value: siteConfig.phone },
    ],
  },
}

export const philosophyContent = {
  hero: {
    label: 'Philosophy',
    headline: 'Elite Mastery',
    subtitle: 'Capital Markets Infrastructure as Financial Architecture',
    description: 'This is not a methodology. It is the intellectual foundation that shapes every engagement we undertake.',
  },
  intro: {
    text: 'Capital markets infrastructure is not software. It is financial architecture. The decisions made during design and implementation directly shape earnings behavior, capital ratios, regulatory exposure, valuation integrity, and institutional control. We operate where accounting, derivatives, risk, and system architecture intersect. We design across all layers simultaneously.',
  },
  sections: [
    {
      id: 'architecture',
      title: 'Infrastructure Is Financial Architecture',
      content: [
        'Most firms treat infrastructure as a technology problem with financial constraints. We treat it as a financial architecture problem that technology implements.',
        'Every booking model decision affects capital consumption. Every lifecycle event configuration shapes P&L recognition timing. Every hedge designation approach determines earnings volatility exposure. These are not implementation details. They are architectural choices with balance sheet consequences.',
        'When infrastructure is designed without this understanding, the gaps surface later: unexpected earnings volatility, capital ratio drift, regulatory findings, audit qualifications. The technology worked. The financial architecture failed.',
      ],
    },
    {
      id: 'alignment',
      title: 'Mastery Is Alignment',
      content: [
        'The hardest problems in capital markets infrastructure live in the spaces between disciplines. Accounting policy makes assumptions about system behavior. Risk methodology depends on data the system may not capture cleanly. Regulatory reporting requires lineage that crosses organizational boundaries.',
        'When these disciplines operate in silos, each optimizing for their own domain, misalignment is inevitable. Misalignment is where institutional risk hides.',
        'Mastery means refusing to solve an accounting problem without understanding its system implications, or a system problem without understanding its capital impact. It means designing for alignment, not hoping for it.',
      ],
    },
    {
      id: 'lifecycle',
      title: 'Lifecycle Is The Stress Test',
      content: [
        'Point-in-time validation answers the wrong question. It confirms that a system handles today\'s trades under today\'s conditions. It says nothing about how the system behaves when instruments mature, when hedges become ineffective, when counterparties default, when markets stress.',
        'We validate across the full lifecycle: origination through maturity, normal conditions through stress scenarios, routine processing through exception handling. This is where fragile architectures reveal themselves. This is where robust architectures prove their value.',
        'If your validation approach doesn\'t stress the edges, it\'s not validation. It\'s confirmation bias.',
      ],
    },
    {
      id: 'migration',
      title: 'Migration Is A Financial Event',
      content: [
        'Platform migration is where infrastructure failures concentrate. Every mapping decision carries accounting, capital, and regulatory implications. How a trade in the source system becomes a trade in the target system matters.',
        'A hedge relationship that designated correctly in the old system but differently in the new system may trigger discontinuation. A booking model that captured CVA one way but captures it differently now may affect capital ratios. A regulatory report that sourced from one data path but now sources from another may break audit trail continuity.',
        'We architect migrations as balance sheet events, not data moves. The technical migration is the easy part. Preserving financial control through the transition is the work.',
      ],
    },
    {
      id: 'capital',
      title: 'Capital Awareness Changes Everything',
      content: [
        'Capital is consumed by infrastructure choices, not just business decisions. The same economic trade can consume different capital depending on how it\'s booked, how it\'s netted, how collateral is reflected, how the system classifies it for regulatory purposes.',
        'Most infrastructure projects treat capital impact as a downstream concern, something to measure after design decisions are made. We embed capital awareness at design time, ensuring that architectural choices support rather than undermine capital efficiency.',
        'Under evolving regulatory frameworks, infrastructure that ignores capital implications today creates constraints that bind tomorrow.',
      ],
    },
    {
      id: 'control',
      title: 'Control Is The Outcome',
      content: [
        'Go-live is not success. Production stability is not success. The only outcome that matters is institutional control: an architecture your CFO can explain to analysts, your CAO can defend to auditors, your CRO can trust for risk decisions, and your successors can maintain without calling us.',
        'Control means clear accounting lineage from policy decision to financial statement. It means capital treatment that holds under regulatory examination. It means documentation that serves the institution, not just the project.',
        'We measure success by what happens after we leave. If you need us to explain your own architecture, we failed.',
      ],
    },
  ],
  closing: {
    title: 'The Standard',
    content: 'This philosophy is not aspirational. It is the standard we hold ourselves to on every engagement. It is why we are selective about the work we take and demanding about how we do it. It is what separates infrastructure that merely functions from infrastructure that creates lasting institutional control.',
  },
}

export const privacyContent = {
  title: 'Privacy Policy',
  lastUpdated: 'January 2025',
  sections: [
    {
      title: 'Information We Collect',
      content: 'When you contact us: name, email, institution, and message content. Standard analytics to understand site usage. We collect only what\'s necessary to respond to your inquiry.',
    },
    {
      title: 'How We Use It',
      content: 'To respond to your inquiry and improve our services. We do not sell data, share with marketing partners, or use information for purposes beyond direct business communication.',
    },
    {
      title: 'Security',
      content: 'Enterprise-grade encryption in transit and at rest. We advise financial institutions on infrastructure security. We apply the same standards to our own operations.',
    },
    {
      title: 'Questions',
      content: `Contact us at ${siteConfig.email} with any privacy concerns.`,
    },
  ],
}

export const termsContent = {
  title: 'Terms of Service',
  lastUpdated: 'January 2025',
  sections: [
    {
      title: 'Agreement',
      content: 'By using this website, you accept these terms. Engagement terms are governed by separate service agreements.',
    },
    {
      title: 'Services',
      content: 'Ulixes provides advisory services for capital markets infrastructure. Website content is general information, not advice for your specific situation.',
    },
    {
      title: 'Intellectual Property',
      content: 'All content, methodologies, and frameworks described on this site are proprietary to Ulixes Corporation.',
    },
    {
      title: 'Limitation',
      content: 'This website provides general information about our services and philosophy. Specific recommendations require engagement under separate agreement.',
    },
  ],
}

export const notFoundContent = {
  headline: '404',
  title: 'Page Not Found',
  description: 'This page doesn\'t exist.',
  cta: 'Return Home',
}

// Services page specific content
export const servicesPageContent = {
  hero: {
    label: 'Services',
    headline: 'Architecture. Not Configuration.',
    description: 'Every service operates under a single premise: infrastructure decisions shape financial outcomes. We design for alignment across accounting, capital, and regulatory requirements.',
  },
  process: {
    title: 'Engagement Approach',
    description: 'We begin with financial architecture, not technology selection. The system implements the design. Not the reverse.',
    steps: [
      {
        title: 'Architecture Definition',
        description: 'Define accounting treatment, capital impact, and regulatory requirements before discussing vendors or platforms.',
      },
      {
        title: 'Lifecycle Mapping',
        description: 'Map every instrument type through its full lifecycle, identifying where accounting, risk, and capital intersect.',
      },
      {
        title: 'Validation Design',
        description: 'Design validation that tests edges and stress scenarios, not just happy-path processing.',
      },
      {
        title: 'Control Transfer',
        description: 'Document for your successors, not for project sign-off. Build internal capability, not dependency.',
      },
    ],
  },
  cta: {
    title: 'Complex Challenge?',
    description: 'If your infrastructure problem sits at the intersection of accounting, risk, and systems, we should talk.',
    primaryCta: 'Start a Conversation',
  },
}

// Work page specific content
export const workPageContent = {
  hero: {
    label: 'Case Studies',
    headline: 'Selected Engagements',
    description: 'Patterns from our work with banks and hedge funds. Most clients require confidentiality. These represent what we can discuss.',
  },
  cta: {
    title: 'Similar Challenge?',
    description: 'Every institution\'s situation is different, but failure patterns repeat. If these resonate, let\'s talk.',
    primaryCta: 'Start a Conversation',
  },
}

// About page specific content
export const aboutPageContent = {
  values: {
    title: 'Operating Principles',
    items: [
      {
        title: 'Senior Practitioners Only',
        description: 'Every engagement is staffed with partners and senior practitioners. No junior consultants learning on your infrastructure.',
      },
      {
        title: 'Architecture Before Technology',
        description: 'We define financial architecture first. Technology selection and implementation follow the design.',
      },
      {
        title: 'Alignment Over Optimization',
        description: 'We refuse to optimize one dimension at the expense of another. Accounting, capital, and systems must align.',
      },
      {
        title: 'Control As Deliverable',
        description: 'We succeed when you own and understand your architecture. Dependency on us is failure.',
      },
    ],
  },
  numbers: {
    title: 'By The Numbers',
    stats: [
      { value: '20+', label: 'Years Experience' },
      { value: '20', label: 'Implementations' },
    ],
  },
  hiring: {
    title: 'Join Us',
    description: 'We hire senior practitioners who have designed, built, and defended capital markets infrastructure inside institutions. If you\'ve lived the intersection of accounting, risk, and systems, and want to solve these problems without organizational constraints, let\'s talk.',
    cta: 'Contact Us',
    ctaHref: 'mailto:careers@ulixescorp.com',
  },
}

// Institutional Experience page content
export const institutionalExperienceContent = {
  hero: {
    label: 'Background',
    headline: 'Institutional Experience',
    description: 'Experience built inside global capital markets institutions over two decades.',
  },
  credibilityChips: [
    '20+ years Calypso execution',
    'Multi-asset + multi-jurisdiction delivery',
    'Front-to-back lifecycle architecture',
  ],
  intro: {
    paragraphs: [
      'Before Ulixes, our work happened inside large financial institutions, not alongside them. We worked within treasury teams, derivatives operations, and core infrastructure programs where decisions were tied directly to balance sheets, controls, and regulatory outcomes.',
      'That experience shapes how we approach every engagement. We do not advise from theory. Our perspective comes from having lived with the consequences of infrastructure decisions, during earnings cycles, in audit reviews, and under regulatory examination.',
    ],
  },
  institutions: {
    title: 'Where We\'ve Worked',
    description: 'Financial institutions where we\'ve designed, implemented, or defended capital markets infrastructure.',
    items: [
      {
        name: 'Wells Fargo',
        description: 'Treasury and derivatives infrastructure supporting enterprise hedging programs.',
      },
      {
        name: 'Silicon Valley Bank',
        description: 'Pre-crisis infrastructure architecture for interest rate risk and liquidity management.',
      },
      {
        name: 'Rabobank',
        description: 'Global derivatives operations across agricultural and corporate banking divisions.',
      },
      {
        name: 'CoBank',
        description: 'Farm Credit System infrastructure for complex structured lending and hedging.',
      },
      {
        name: 'Federal Home Loan Bank of San Francisco',
        description: 'Member services infrastructure and balance sheet management systems.',
      },
      {
        name: 'U.S. Bank',
        description: 'Enterprise treasury infrastructure and regulatory capital optimization.',
      },
      {
        name: 'Bladex',
        description: 'Latin American trade finance and derivatives infrastructure.',
      },
      {
        name: 'Barclays Global Investors',
        description: 'Pre-BlackRock acquisition asset management infrastructure.',
      },
      {
        name: 'Charles Schwab',
        description: 'Retail and institutional brokerage infrastructure programs.',
      },
    ],
  },
  programs: {
    title: 'Programs & Scope',
    description: 'The types of infrastructure challenges we\'ve solved across these institutions.',
    tags: [
      'Hedge accounting framework design',
      'Calypso front-to-back implementation',
      'Platform migration and data integrity',
      'Capital ratio optimization',
      'Regulatory reporting architecture',
      'Derivatives lifecycle validation',
      'Earnings volatility remediation',
      'Audit defense and documentation',
    ],
  },
  closing: {
    quote: 'We\'ve sat where you sit. We\'ve defended infrastructure decisions to boards, auditors, and regulators. That perspective informs every recommendation we make.',
  },
  cta: {
    title: 'Ready to Talk?',
    description: 'If your challenge requires practitioners who\'ve lived inside institutional infrastructure, not just consulted on it, we should connect.',
    primaryCta: 'Start a Conversation',
  },
}

// Contact page specific content
export const contactPageContent = {
  faq: {
    title: 'Common Questions',
    items: [
      {
        question: 'What types of engagements do you take?',
        answer: 'Infrastructure design, hedge accounting frameworks, platform migrations, and capital optimization. We take on challenges that require integration across accounting, risk, and systems. We don\'t do staff augmentation or pure technology implementation.',
      },
      {
        question: 'How are engagements structured?',
        answer: 'Fixed-scope with defined deliverables. We align our incentives with yours. If we underestimate, that\'s our problem. Time-and-materials only for genuinely uncertain discovery work.',
      },
      {
        question: 'What institutions do you work with?',
        answer: 'Banks, asset managers, insurance companies, and hedge funds with complex derivatives books and sophisticated infrastructure requirements. We are selective. The challenge must warrant senior practitioners.',
      },
      {
        question: 'How quickly can you start?',
        answer: 'Depends on current commitments and engagement scope. For urgent remediation work, we can typically mobilize within two weeks. Larger architecture engagements usually begin 4-6 weeks after agreement.',
      },
    ],
  },
}
