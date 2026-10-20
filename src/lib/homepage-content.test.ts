import { describe, expect, it } from 'vitest'
import { homepageContent, LINKEDIN_URL } from './homepage-content'

describe('homepage content contract', () => {
  it('publishes the approved hero, services, Calypso and practitioner copy', () => {
    expect(homepageContent.hero.headline).toBe('Capital markets transformation & architecture.')
    expect(homepageContent.hero.primaryCta).toBe('Discuss a mandate')
    expect(homepageContent.hero.facts.map((fact) => fact.value)).toEqual([
      'Banks & hedge funds',
      '7 kinds',
      'Capture to reporting',
      'San Francisco',
    ])
    expect(homepageContent.services.items.map((item) => item.title)).toEqual([
      'Transformation & architecture',
      'Accounting & controls',
      'Trading, risk & post-trade',
      'Automation & assurance',
    ])
    expect(homepageContent.services.items.map((item) => item.number)).toEqual(['01', '02', '03', '04'])
    expect(homepageContent.calypso.stages).toHaveLength(7)
    expect(homepageContent.calypso.stats.map((stat) => stat.value)).toEqual(['7', '8', '6'])
    expect(homepageContent.practitioner.name).toBe('Ulysses Williams')
    expect(homepageContent.practitioner.briefPoints).toHaveLength(3)
  })

  it('names every lifecycle stage once, front office first and back office last', () => {
    const { stages } = homepageContent.calypso
    expect(new Set(stages.map((stage) => stage.name)).size).toBe(stages.length)
    expect(stages[0]?.office).toBe('Front office')
    expect(stages.at(-1)?.office).toBe('Back office')
  })

  it('keeps the fields other pages read from this file', () => {
    expect(homepageContent.credibility.linkedinUrl).toBe(LINKEDIN_URL)
    expect(homepageContent.contact.cta).toBe('Discuss a mandate')
    expect(homepageContent.contact.email).toBe('admin@ulixescorp.com')
  })

  it('keeps published copy free of em dashes and unsupported claims', () => {
    const published = JSON.stringify(homepageContent)
    expect(published).not.toContain('—')

    const lower = published.toLowerCase()
    for (const forbidden of [
      '20 implementations',
      'zero disruption',
      'real-time compliance',
      'ai-driven',
      'award',
      'microsoft',
      'amazon',
      'google',
      'oracle',
    ]) {
      expect(lower).not.toContain(forbidden)
    }
  })
})
