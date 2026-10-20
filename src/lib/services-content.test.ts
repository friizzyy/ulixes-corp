import { describe, expect, it } from 'vitest'
import {
  lifecycleStages,
  serviceCapabilities,
  servicesContent,
  spanRange,
} from './services-content'

const EM_DASH = '—'

describe('services content', () => {
  it('carries the four capabilities in order', () => {
    expect(serviceCapabilities.map((c) => c.id)).toEqual([
      'architecture',
      'accounting',
      'trading',
      'assurance',
    ])
    for (const capability of serviceCapabilities) {
      expect(capability.covers.length).toBeGreaterThanOrEqual(5)
      expect(capability.description.endsWith('.')).toBe(true)
    }
  })

  it('gives every capability a forward span over real lifecycle stages', () => {
    expect(lifecycleStages).toHaveLength(7)
    const counts = serviceCapabilities.map((capability) => {
      const [from, to] = spanRange(capability)
      expect(from).toBeGreaterThanOrEqual(0)
      expect(to).toBeGreaterThanOrEqual(from)
      return to - from + 1
    })
    expect(counts).toEqual([7, 3, 5, 5])
  })

  it('holds the four approach phases and the closing headline', () => {
    expect(servicesContent.approach.phases.map((p) => p.title)).toEqual([
      'Architecture definition',
      'Lifecycle mapping',
      'Validation design',
      'Control transfer',
    ])
    expect(servicesContent.cta).toEqual({ lead: 'Start with', turn: 'the platform decision.' })
  })

  it('contains no em dashes and no company-wide "we"', () => {
    const text = JSON.stringify({ serviceCapabilities, servicesContent })
    expect(text.includes(EM_DASH)).toBe(false)
    expect(/\bwe\b/i.test(text)).toBe(false)
  })
})
