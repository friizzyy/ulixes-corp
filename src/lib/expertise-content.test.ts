import { describe, expect, it } from 'vitest'
import {
  chainStages,
  expertiseAreas,
  expertiseContent,
  productDomains,
} from './expertise-content'

describe('expertise content contract', () => {
  it('publishes the four capabilities with their materials', () => {
    /*
     * The four Calypso-named areas (implementation, migration, testing,
     * readiness) are gone. These are the capabilities from Ulysses's
     * positioning note, and the page leads with them so the specialization
     * reads as evidence rather than as the whole offer.
     */
    expect(expertiseAreas.map((area) => area.id)).toEqual([
      'architecture',
      'accounting',
      'trading',
      'assurance',
    ])
    expect(expertiseAreas.map((area) => area.material)).toEqual([
      'steel',
      'sage',
      'clay',
      'platinum',
    ])
    for (const area of expertiseAreas) {
      expect(area.covers.length).toBeGreaterThanOrEqual(3)
      expect(area.risk.length).toBeGreaterThan(0)
    }
  })

  it('publishes the trade lifecycle in order', () => {
    expect(chainStages.map((stage) => stage.id)).toEqual([
      'capture',
      'valuation',
      'risk',
      'collateral',
      'settlement',
      'ledger',
      'reporting',
    ])
  })

  it('gives every area a contiguous span that runs forward along the chain', () => {
    /*
     * The chain is drawn as a single bracket from span.from to span.to, so a
     * span that runs backwards or names a stage that does not exist would
     * render an inverted or empty bracket rather than failing loudly.
     */
    const order = chainStages.map((stage) => stage.id)
    for (const area of expertiseAreas) {
      const from = order.indexOf(area.span.from)
      const to = order.indexOf(area.span.to)
      expect(from, `${area.id} span.from`).toBeGreaterThanOrEqual(0)
      expect(to, `${area.id} span.to`).toBeGreaterThanOrEqual(0)
      expect(to, `${area.id} span runs forward`).toBeGreaterThanOrEqual(from)
    }
  })

  it('keeps exactly one capability spanning the whole chain', () => {
    /*
     * Architecture is the one capability whose span is the entire lifecycle,
     * and that contrast is what the diagram is for. Two areas spanning
     * everything would flatten it, so the count is pinned as well as the id.
     */
    const order = chainStages.map((stage) => stage.id)
    const full = expertiseAreas.filter(
      (area) =>
        order.indexOf(area.span.from) === 0 &&
        order.indexOf(area.span.to) === order.length - 1,
    )
    expect(full.map((area) => area.id)).toEqual(['architecture'])
  })

  it('gives every capability a glyph from the icon set', () => {
    // area.icon is deliberately separate from area.id now; this guards the
    // pairing from drifting to an undrawn name.
    for (const area of expertiseAreas) {
      expect(
        ['implementation', 'migration', 'testing', 'readiness'],
        `${area.id} icon`,
      ).toContain(area.icon)
    }
  })

  it('publishes the verified product domains', () => {
    expect(productDomains).toEqual([
      'Interest-rate derivatives',
      'FX',
      'Fixed income',
      'Money markets',
      'Commodities',
      'Equity derivatives',
    ])
  })

  it('keeps published copy free of em dashes', () => {
    const published = JSON.stringify({
      expertiseContent,
      expertiseAreas,
      chainStages,
      productDomains,
    })

    expect(published).not.toContain('—')
  })

  it('never speaks as a company', () => {
    /*
     * The verified-claims guardrails require claims to describe Ulysses
     * Williams's individual experience. The previous /services copy was
     * written in company-wide "we" throughout, which is what this guards.
     */
    const published = JSON.stringify({
      expertiseContent,
      expertiseAreas,
    }).toLowerCase()

    for (const form of [' we ', ' we.', ' our ', ' us ', 'we help', 'our team']) {
      expect(published).not.toContain(form)
    }
  })

  it('excludes banned claims and retired service names', () => {
    const published = JSON.stringify({
      expertiseContent,
      expertiseAreas,
      productDomains,
    }).toLowerCase()

    for (const forbidden of [
      'ai-driven',
      '20 implementations',
      'zero disruption',
      'real-time compliance',
      'award',
      'case study',
      'testimonial',
      'trusted by',
    ]) {
      expect(published).not.toContain(forbidden)
    }
  })
})
