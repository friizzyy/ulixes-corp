import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  institutionalExperienceContent,
  practitionerPortrait,
} from '@/lib/institutional-experience-content'
import ExperiencePage from './page'

const { hero, institutions, positions } = institutionalExperienceContent
const css = readFileSync(
  resolve(process.cwd(), 'src/app/institutional-experience/institutional-experience.module.css'),
  'utf8',
)

describe('institutional experience page', () => {
  it('renders the staged portrait hero with the two-line headline and credentials', () => {
    render(<ExperiencePage />)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent('Inside the institutions. Not alongside them.')
    expect(h1.querySelector('.s')).toHaveTextContent('Not alongside them.')

    const heroSection = screen.getByRole('region', { name: /Inside the institutions/ })
    expect(within(heroSection).getByRole('img', { name: practitionerPortrait.alt })).toBeInTheDocument()
    expect(within(heroSection).getByRole('link', { name: /Discuss a mandate/ })).toHaveAttribute(
      'href',
      '/contact',
    )
    const linkedin = within(heroSection).getByRole('link', { name: /View on LinkedIn/ })
    expect(linkedin).toHaveAttribute('href', hero.linkedinUrl)
    expect(linkedin).toHaveAttribute('target', '_blank')

    for (const item of hero.credentials) {
      expect(within(heroSection).getByText(item.label)).toBeInTheDocument()
      expect(within(heroSection).getByText(item.value)).toBeInTheDocument()
    }
    expect(within(heroSection).getByText(hero.role)).toBeInTheDocument()
  })

  it('lists the seven institutions on desktop, ending on the dark summary tile', () => {
    render(<ExperiencePage />)
    const section = screen.getByRole('region', { name: /Seven kinds of institution/ })
    const eyebrow = within(section).getByText(institutions.eyebrow)
    expect(eyebrow).toHaveClass('eb', 'eb-c')

    const names = within(section)
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent)
    expect(names).toEqual(institutions.categories.map((c) => c.name))
    expect(within(section).getByRole('article', { name: '7 Kinds of institution' })).toBeInTheDocument()
  })

  it('carries a phone swipe rail with one progress dash per card', () => {
    render(<ExperiencePage />)
    const rail = screen.getByRole('region', { name: 'Kinds of institution', hidden: true })
    const dashes = within(rail).getAllByRole('button', { hidden: true })
    expect(dashes).toHaveLength(institutions.categories.length + 1)
    expect(dashes[0]).toHaveAttribute('aria-current', 'true')
  })

  it('sets the six positions as a register and as a phone accordion', () => {
    render(<ExperiencePage />)
    const section = screen.getByRole('region', { name: /Six positions/ })
    const items = within(section).getAllByRole('listitem')
    expect(items).toHaveLength(6)
    expect(items[0]).toHaveTextContent(positions.items[0].title)

    const triggers = within(section).getAllByRole('button', { hidden: true })
    expect(triggers).toHaveLength(6)
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true')
    expect(triggers[1]).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes on the brief card with this page’s headline', () => {
    render(<ExperiencePage />)
    const h2 = screen.getByRole('heading', { level: 2, name: /Put that experience/ })
    expect(h2.querySelector('.s')).toHaveTextContent('against the decision.')
  })

  it('uses no serif or italic', () => {
    expect(css).not.toMatch(/font-serif|italic/)
    render(<ExperiencePage />)
    expect(document.querySelector('em, i.turn')).toBeNull()
  })
})
