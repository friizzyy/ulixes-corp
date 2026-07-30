import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import HomePage from './page'

const APPROVED_SECTION_HEADINGS = [
  'See the whole system before you change it.',
  'One change travels.',
  'Where Ulixes enters the system.',
  'Work of this kind.',
  'Experience stays close to the decision.',
  'Bring the whole mandate into view.',
] as const

const OBSOLETE_HOMEPAGE_COPY = [
  '20 successful implementations',
  'Weeks 1–2',
  'Our Philosophy',
  'Get Started',
] as const

describe('HomePage', () => {
  it('server-renders the approved six-section narrative without obsolete terminal content', () => {
    const markup = renderToStaticMarkup(createElement(HomePage))
    const document = new DOMParser().parseFromString(markup, 'text/html')
    const homepage = document.querySelector('[data-homepage]')
    const sections = Array.from(homepage?.children ?? [])

    expect(homepage).not.toBeNull()
    expect(sections).toHaveLength(APPROVED_SECTION_HEADINGS.length)
    expect(sections.every((section) => section.tagName === 'SECTION')).toBe(true)
    expect(
      sections.map(
        (section) => section.querySelector('h1, h2')?.textContent?.trim(),
      ),
    ).toEqual(APPROVED_SECTION_HEADINGS)

    OBSOLETE_HOMEPAGE_COPY.forEach((obsoleteCopy) => {
      expect(document.body.textContent).not.toContain(obsoleteCopy)
    })

    expect(document.body.textContent).toContain(
      'Representative mandate patterns, not client case studies.',
    )
  })
})
