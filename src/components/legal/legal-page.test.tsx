import { render, screen, within } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { privacyContent, siteConfig, termsContent } from '@/lib/content'
import { LegalPage } from './legal-page'
import { slugify, toLegalSections } from './legal-sections'

const EM_DASH = '\u2014'

const legalStylesheet = readFileSync(
  resolve(process.cwd(), 'src/components/legal/legal.module.css'),
  'utf8',
)

const sections = [
  { id: 'scope', title: 'Scope', body: 'Applies to every visit to the site.' },
  {
    id: 'retention',
    title: 'Retention',
    body: 'Kept only as long as an inquiry is open.',
  },
]

function renderPage() {
  return render(
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="February 2026"
      sections={sections}
      closing="Questions about this policy? Write directly."
      cross={{ label: 'View Terms of Service', href: '/terms' }}
    />,
  )
}

describe('LegalPage', () => {
  it('renders one heading, every clause on its anchor, and the cross link', () => {
    const { container } = renderPage()

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Privacy Policy',
    )
    expect(screen.getByText('February 2026')).toBeInTheDocument()

    const ledger = screen.getByRole('region', { name: 'Privacy Policy' })
    for (const section of sections) {
      expect(
        within(ledger).getByRole('heading', { level: 2, name: section.title }),
      ).toBeInTheDocument()
      expect(container.querySelector(`#${section.id}`)).toHaveTextContent(
        section.body,
      )
    }
    expect(within(ledger).getByText('01')).toBeInTheDocument()
    expect(within(ledger).getByText('02')).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: /View Terms of Service/ }),
    ).toHaveAttribute('href', '/terms')
    expect(screen.getByRole('link', { name: siteConfig.email })).toHaveAttribute(
      'href',
      `mailto:${siteConfig.email}`,
    )
  })

  it('renders clauses as rows, not list items, and stays free of em dashes', () => {
    const { container } = renderPage()

    expect(container.querySelectorAll('ul, ol')).toHaveLength(0)
    expect(container.querySelector('main')).not.toBeInTheDocument()
    expect(container.querySelector('nav')).not.toBeInTheDocument()
    expect(container.textContent).not.toContain(EM_DASH)
  })
})

describe('toLegalSections', () => {
  it('maps the content file shape onto anchored clauses', () => {
    expect(
      toLegalSections([{ title: 'Information We Collect', content: 'Only what is needed.' }]),
    ).toEqual([
      {
        id: 'information-we-collect',
        title: 'Information We Collect',
        body: 'Only what is needed.',
      },
    ])
    expect(slugify('  Limitation & Scope!  ')).toBe('limitation-scope')
  })

  it('gives every published clause a unique anchor', () => {
    for (const content of [privacyContent, termsContent]) {
      const ids = toLegalSections(content.sections).map((section) => section.id)
      expect(new Set(ids).size).toBe(content.sections.length)
      expect(ids.every((id) => /^[a-z0-9-]+$/.test(id))).toBe(true)
    }
  })
})

describe('legal mobile reading surface', () => {
  it('uses the shared safe-area-aware gutter through 895px', () => {
    const touchRules = legalStylesheet.slice(
      legalStylesheet.indexOf('@media (max-width: 895px)'),
      legalStylesheet.indexOf('@media (max-width: 767px)'),
    )

    expect(legalStylesheet).not.toContain('@media (max-width: 899px)')
    expect(touchRules).toMatch(
      /\.shell\s*\{[^}]*width:\s*auto[^}]*margin-left:\s*calc\(var\(--mobile-gutter\)\s*\+\s*var\(--safe-area-left,\s*0px\)\)[^}]*margin-right:\s*calc\(var\(--mobile-gutter\)\s*\+\s*var\(--safe-area-right,\s*0px\)\)/,
    )
    expect(touchRules).toMatch(
      /\.clause\s*\{[^}]*grid-template-columns:\s*3rem\s+minmax\(0,\s*1fr\)/,
    )
  })

  it('uses shared phone rhythm and readable text without card rows', () => {
    const phoneRules = legalStylesheet.slice(
      legalStylesheet.indexOf('@media (max-width: 599px)'),
    )

    expect(phoneRules).toMatch(
      /\.page\s*\{[^}]*padding:\s*calc\(clamp\([^;]*5\.5rem[^;]*6\.5rem[^;]*\)\s*\+\s*var\(--safe-area-top,\s*0px\)\)\s+0\s+clamp\([^;]*3\.5rem[^;]*4\.5rem[^;]*\)/,
    )
    expect(phoneRules).toMatch(
      /\.title\s*\{[^}]*font-size:\s*clamp\([^;]*2\.375rem[^;]*2\.625rem[^;]*\)/,
    )
    expect(phoneRules).toMatch(
      /\.clauseBody\s*\{[^}]*font-size:\s*(?:1rem|16px)/,
    )
    expect(phoneRules).toMatch(
      /\.closingNote\s*\{[^}]*font-size:\s*(?:1rem|16px)/,
    )
    expect(phoneRules).toMatch(
      /\.ledger\s*\{[^}]*border-radius:\s*0[^}]*box-shadow:\s*none/,
    )
  })

  it('adds the top safe-area inset to the base route offset', () => {
    const baseRules = legalStylesheet.slice(
      legalStylesheet.indexOf('.page {'),
      legalStylesheet.indexOf('.page::after'),
    )

    expect(baseRules).toMatch(
      /padding:\s*calc\(120px\s*\+\s*var\(--safe-area-top,\s*0px\)\)\s+0\s+96px/,
    )
  })
})
