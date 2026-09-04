import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  institutionalExperienceContent,
  practitionerPortrait,
} from '@/lib/institutional-experience-content'
import ExperiencePage from './page'

const { principles } = institutionalExperienceContent
const experienceStyles = readFileSync(
  resolve(
    process.cwd(),
    'src/app/institutional-experience/institutional-experience.module.css',
  ),
  'utf8',
)
const mobileReaderStyles = readFileSync(
  resolve(
    process.cwd(),
    'src/components/experience/mobile-institution-reader.module.css',
  ),
  'utf8',
)

describe('institutional experience route', () => {
  it('orders the phone hero as proposition, actions, then portrait', () => {
    render(<ExperiencePage />)
    const hero = screen.getByRole('region', {
      name: 'Inside the institutions. Not alongside them.',
    })
    const primaryAction = within(hero).getByRole('link', {
      name: 'Discuss a mandate',
    })
    const portrait = within(hero).getByRole('img', {
      name: practitionerPortrait.alt,
    })

    expect(hero).toHaveAttribute('data-mobile-flow', 'copy-first')
    expect(primaryAction.compareDocumentPosition(portrait)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
  })

  it('composes one institutional threshold from the hall and portrait', () => {
    const { container } = render(<ExperiencePage />)

    const compositions = container.querySelectorAll(
      '[data-depth-composition="institutional-threshold"]',
    )
    expect(compositions).toHaveLength(1)

    const threshold = compositions[0] as HTMLElement
    const portrait = within(threshold).getByRole('img', {
      name: practitionerPortrait.alt,
    })
    const primaryAction = within(threshold).getByRole('link', {
      name: 'Discuss a mandate',
    })

    expect(threshold.querySelectorAll('img')).toHaveLength(2)
    expect(primaryAction.compareDocumentPosition(portrait)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    )
    expect(
      threshold.querySelector('[data-depth-plane="recessed-architecture"]'),
    ).not.toBeNull()
    expect(
      threshold.querySelector('[data-depth-plane="raised-portrait"]'),
    ).not.toBeNull()
  })

  it('leads with the practitioner and a single first-level heading', () => {
    const { container } = render(<ExperiencePage />)

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Inside the institutions. Not alongside them.',
    })
    const introduction = screen.getByRole('region', {
      name: heading.textContent ?? '',
    })

    /*
     * The statistics row that used to sit here is gone. All four of its cells
     * previewed a section below it, so the page stated every fact twice before
     * it had said anything once.
     */
    expect(
      screen.queryByRole('list', { name: 'Institutional experience summary' }),
    ).not.toBeInTheDocument()

    expect(within(introduction).getByText('President')).toBeInTheDocument()
    expect(
      within(introduction).getByText('Calypso subject-matter expert'),
    ).toBeInTheDocument()
    expect(
      within(introduction).getByRole('link', { name: 'Discuss a mandate' }),
    ).toHaveAttribute('href', '/contact')

    // The only external verification path on the site.
    const linkedin = within(introduction).getByRole('link', { name: /LinkedIn/ })
    expect(linkedin).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/ulysses-williams-2379634/',
    )
    // Opens a new tab, and says so to a screen reader.
    expect(linkedin).toHaveAttribute('target', '_blank')
    expect(linkedin).toHaveAccessibleName(/\(opens in a new tab\)$/)

    expect(container.textContent).not.toContain('—')
  })

  it('does not restate the homepage credentials', () => {
    render(<ExperiencePage />)

    /*
     * The scope section is gone. It was eleven short labels with no room for
     * depth, and both of its facts belong to the homepage authority dock:
     * this page owns the sector taxonomy and the six positions instead.
     */
    for (const retired of [
      'Operating office perspective',
      'Regional delivery experience',
      'Institutional experience summary',
      'Programs and scope',
    ]) {
      expect(screen.queryByRole('list', { name: retired })).not.toBeInTheDocument()
    }

    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(document.querySelector('[data-mobile-layout="carousel"]')).toBeNull()
  })

  it('keeps the page concise and closes with a direct inquiry', () => {
    render(<ExperiencePage />)

    const principles = screen.getByRole('region', {
      name: 'Six positions the work is built on.',
    })
    expect(
      within(principles).getByRole('list', {
        name: 'Ulixes delivery principles',
      }),
    ).toBeInTheDocument()

    /*
     * This page has its own close. The homepage, expertise and experience
     * pages all ended on the identical shared sentence.
     */
    const contact = screen.getByRole('region', {
      name: 'Put that experience against the decision.',
    })
    expect(
      within(contact).getByRole('link', { name: 'Discuss a mandate' }),
    ).toHaveAttribute('href', '/contact')
    expect(
      within(contact).getByRole('link', { name: 'admin@ulixescorp.com' }),
    ).toHaveAttribute('href', 'mailto:admin@ulixescorp.com')

    // Guards against this page drifting back onto the shared closing line.
    expect(
      screen.queryByText('Start with the mandate.'),
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('navigation', { name: 'Experience page index' }),
    ).not.toBeInTheDocument()
  })

  it('publishes the seven institution types', () => {
    const { container } = render(<ExperiencePage />)

    /*
     * Restored from the pre-redesign site, where it was the most specific
     * material anywhere on it, and lost in the rebuild. Naming institution
     * types breaks no guardrail because no client is identified.
     */
    const sectors = screen.getByRole('list', { name: 'Institution types' })
    expect(
      container.querySelector('[data-depth-plane="recessed-institution-shelf"]'),
    ).toContainElement(sectors)
    expect(within(sectors).getAllByRole('listitem')).toHaveLength(7)
    for (const sector of [
      'Global systemically important banks',
      'Farm credit and agricultural lending',
      'Brokerage and clearing platforms',
    ]) {
      expect(within(sectors).getByText(sector)).toBeInTheDocument()
    }


    // Recovered from the retired /philosophy page.
    const principles = screen.getByRole('list', {
      name: 'Ulixes delivery principles',
    })
    expect(within(principles).getAllByRole('listitem')).toHaveLength(6)
    expect(
      within(principles).getByText('Control is the outcome'),
    ).toBeInTheDocument()
  })

  it('offers the six working positions as a one-open phone disclosure', () => {
    render(<ExperiencePage />)
    const disclosure = screen.getByRole('region', { name: 'Working positions' })
    const controls = within(disclosure).getAllByRole('button')
    const desktopPositions = screen.getByRole('list', {
      name: 'Ulixes delivery principles',
    })

    expect(desktopPositions).toHaveAttribute('data-visible-from', '896px')
    expect(disclosure.closest('[data-visible-through]')).toHaveAttribute(
      'data-visible-through',
      '895px',
    )
    expect(controls).toHaveLength(6)
    expect(controls[0]).toHaveAttribute('aria-expanded', 'true')
    expect(within(disclosure).getByText(principles.items[0].description)).toBeVisible()

    fireEvent.click(controls[1])
    expect(controls[0]).toHaveAttribute('aria-expanded', 'false')
    expect(controls[1]).toHaveAttribute('aria-expanded', 'true')
    expect(within(disclosure).getByText(principles.items[1].description)).toBeVisible()
    expect(
      within(disclosure).queryByText(principles.items[0].description),
    ).not.toBeInTheDocument()

    fireEvent.click(controls[1])
    expect(controls[1]).toHaveAttribute('aria-expanded', 'true')
    expect(within(disclosure).getByText(principles.items[1].description)).toBeVisible()
  })

  it('separates the touch reader from the desktop carousel at 895/896', () => {
    render(<ExperiencePage />)
    const reader = screen.getByRole('region', { name: 'Institution reader' })
    const carousel = screen.getByRole('list', { name: 'Institution types' })

    expect(reader).toHaveAttribute('data-visible-through', '895px')
    expect(carousel.closest('[data-visible-from]')).toHaveAttribute(
      'data-visible-from',
      '896px',
    )
  })

  it('keeps phone institution and closing prose at the 16px reading floor', () => {
    const experiencePhoneStyles = experienceStyles.slice(
      experienceStyles.lastIndexOf('@media (max-width: 895px)'),
    )

    expect(experiencePhoneStyles).toMatch(
      /\.closeBody,\s*\.closeResponse\s*\{[^}]*font-size:\s*1rem/,
    )
    expect(mobileReaderStyles).toMatch(
      /\.description\s*\{[^}]*font-size:\s*1rem/,
    )
  })

  it('carries two distinct images and no invented portrait', () => {
    const { container } = render(<ExperiencePage />)

    /*
     * The page used to assert it carried no imagery at all. It now follows a
     * reference layout that pairs copy with pictures, so the guard is that the
     * two frames are different: running one image twice is what made the
     * homepage's two skylines read as stock, and the first attempt here did
     * exactly that.
     */
    const images = Array.from(container.querySelectorAll('img'))
    expect(images).toHaveLength(2)
    const sources = new Set(
      images.map((img) => new URL(img.src, 'http://localhost').searchParams.get('url')),
    )
    expect(sources.size).toBe(2)

    /*
     * The portrait carries meaning and needs a description. The hall behind the
     * sector taxonomy is decorative, so an empty alt is correct for it rather
     * than a defect: describing it would make a screen reader read out scenery.
     */
    const described = images.filter((img) => img.alt.length > 0)
    expect(described).toHaveLength(1)
    expect(described[0].alt).toBe(practitionerPortrait.alt)

    const decorative = images.filter((img) => img.alt.length === 0)
    for (const img of decorative) {
      expect(img.closest('[aria-hidden="true"]')).not.toBeNull()
    }

    /*
     * Alt text has to match what the picture actually is. A stand-in must never
     * claim to depict him; the real headshot should name him.
     */
    if (practitionerPortrait.isPlaceholder) {
      expect(practitionerPortrait.alt.toLowerCase()).not.toContain('ulysses')
    } else {
      expect(practitionerPortrait.alt).toContain('Ulysses Williams')
    }
  })
})
