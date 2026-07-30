import { describe, expect, it } from 'vitest'
import {
  aboutContent,
  aboutPageContent,
  experienceContent,
  experiencePatterns,
} from './content'

describe('About content trust contract', () => {
  it('attributes experience to Ulysses without unsupported team or Big Four claims', () => {
    const published = JSON.stringify({ aboutContent, aboutPageContent })

    expect(published).toContain('Ulysses Williams')
    expect(published).toContain('Calypso Technology in 2004')
    expect(published).toContain('North America, Europe, APAC, and Latin America')
    expect(published).not.toMatch(/Big Four|staffed with partners|20.*Implementations/i)
  })

  it('labels experience examples as representative patterns without invented outcomes', () => {
    const published = JSON.stringify({ experienceContent, experiencePatterns })

    expect(experiencePatterns).toHaveLength(3)
    experiencePatterns.forEach((pattern) => {
      expect(pattern.context).toBe('Representative Pattern')
      expect(pattern.qualifier).toBe('Not a client case study')
    })
    expect(published).not.toMatch(
      /Selected Engagements|Zero Business Disruption|Full Compliance|AI-driven compliance tools|defended infrastructure decisions to boards/i,
    )
  })
})
