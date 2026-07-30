import { render, screen, within } from '@testing-library/react'
import { createElement } from 'react'
import { describe, expect, it } from 'vitest'
import {
  ClosingSignalCTA,
  RepresentativeMandates,
  SeniorJudgment,
} from '@/components/home'
import {
  capabilities,
  homepageContent,
  lifecycleStages,
  representativeMandates,
} from './homepage-content'

describe('homepage content contract', () => {
  it('keeps final copy within the approved composition limits', () => {
    expect(homepageContent.hero.headline.length).toBeLessThanOrEqual(56)
    expect(homepageContent.hero.body.replace(/\s/g, '').length).toBeLessThanOrEqual(150)
    expect(homepageContent.closing.headline.length).toBeLessThanOrEqual(44)
    expect(homepageContent.senior.body.trim().split(/\s+/).length).toBeLessThanOrEqual(52)
  })

  it('contains the approved lifecycle and complete capability mappings', () => {
    expect(lifecycleStages.map((stage) => stage.id)).toEqual([
      'capture', 'lifecycle', 'risk', 'controls', 'settlement', 'reporting',
    ])
    expect(capabilities).toHaveLength(4)
    expect(capabilities.find((item) => item.id === 'implementation')?.stageIds).toHaveLength(6)
    expect(capabilities.find((item) => item.id === 'testing')?.renderMode).toBe('checkpoints')
  })

  it('publishes exactly three representative mandates without invented results', () => {
    expect(representativeMandates).toHaveLength(3)
    const published = JSON.stringify({ homepageContent, representativeMandates }).toLowerCase()
    for (const forbidden of ['20 implementations', 'zero disruption', 'on-time', 'real-time compliance']) {
      expect(published).not.toContain(forbidden)
    }
  })

  it('renders three editorial mandate movements without case-study result labels', () => {
    render(createElement(RepresentativeMandates))

    const section = screen.getByRole('region', {
      name: homepageContent.mandates.title,
    })
    const movements = within(section).getAllByRole('article')

    expect(movements).toHaveLength(3)
    expect(
      movements.flatMap((movement) =>
        within(movement).getAllByRole('heading', { level: 3 }),
      ),
    ).toHaveLength(3)
    expect(
      movements.flatMap((movement) =>
        Array.from(movement.querySelectorAll('p')),
      ),
    ).toHaveLength(3)
    expect(section.textContent).not.toMatch(/\b(client|metric|result)\b|%/i)
  })

  it('attributes senior judgment to the President and names all four regions', () => {
    render(createElement(SeniorJudgment))

    expect(screen.getByText(homepageContent.senior.body)).toBeInTheDocument()
    expect(screen.getByText(homepageContent.senior.body)).toHaveTextContent(
      'Ulysses Williams, President',
    )
    for (const region of ['North America', 'Europe', 'APAC', 'Latin America']) {
      expect(screen.getByText(homepageContent.senior.body)).toHaveTextContent(region)
    }
    expect(
      screen.queryByRole('heading', { name: /^about$/i }),
    ).not.toBeInTheDocument()
  })

  it('labels the LinkedIn action as an external new-tab destination', () => {
    render(createElement(SeniorJudgment))

    const linkedIn = screen.getByRole('link', {
      name: 'View Ulysses Williams on LinkedIn (opens in a new tab)',
    })
    expect(linkedIn).toHaveAttribute('href', homepageContent.senior.href)
    expect(linkedIn).toHaveAttribute('target', '_blank')
    expect(linkedIn).toHaveAttribute('rel', 'noreferrer')
  })

  it('converges on the single approved contact action', () => {
    render(createElement(ClosingSignalCTA))

    expect(
      screen.getByRole('link', { name: homepageContent.closing.cta }),
    ).toHaveAttribute('href', '/contact')
  })
})
