import { describe, expect, it } from 'vitest'
import {
  automationAreas,
  serviceCapabilities,
  servicesContent,
} from './services-content'

const EM_DASH = '—'

describe('services content', () => {
  it('carries the four capabilities from the expertise areas', () => {
    expect(serviceCapabilities.map((c) => c.id)).toEqual([
      'architecture',
      'accounting',
      'trading',
      'assurance',
    ])
    for (const capability of serviceCapabilities) {
      expect(capability.scopeTerms.length).toBeGreaterThanOrEqual(3)
      expect(capability.coversSentence.endsWith('.')).toBe(true)
      expect(capability.contactHref).toContain('/contact?program=')
    }
  })

  it('assigns every automation area to a real capability', () => {
    const ids = new Set(serviceCapabilities.map((c) => c.id))
    expect(automationAreas).toHaveLength(6)
    for (const area of automationAreas) expect(ids.has(area.capability)).toBe(true)
  })

  it('keeps engagement examples marked as drafts until Ulysses confirms them', () => {
    for (const capability of serviceCapabilities) {
      expect(capability.example.status).toBe('draft')
    }
  })

  it('contains no em dashes', () => {
    const text = JSON.stringify({ serviceCapabilities, automationAreas, servicesContent })
    expect(text.includes(EM_DASH)).toBe(false)
  })
})
