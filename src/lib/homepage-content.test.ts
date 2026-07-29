import { describe, expect, it } from 'vitest'
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
})
