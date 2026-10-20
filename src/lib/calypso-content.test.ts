import { describe, expect, it } from 'vitest'
import {
  calypsoDomains,
  calypsoFacts,
  calypsoMandates,
  calypsoOffices,
  calypsoProgramFamilies,
  calypsoStages,
  pad2,
} from './calypso-content'

const allCopy = JSON.stringify({
  calypsoDomains,
  calypsoFacts,
  calypsoMandates,
  calypsoProgramFamilies,
  calypsoStages,
})

describe('calypso content contract', () => {
  it('keeps the hero bar counts equal to what the page lists', () => {
    const counts = Object.fromEntries(calypsoFacts.map((f) => [f.unit, Number(f.value)]))
    expect(counts['lifecycle stages']).toBe(calypsoStages.length)
    expect(counts.programs).toBe(calypsoProgramFamilies.flatMap((f) => f.programs).length)
    expect(counts['instrument classes']).toBe(calypsoDomains.length)
    expect(counts.offices).toBe(calypsoOffices.length)
  })

  it('runs the seven stages front to back, in office order', () => {
    expect(calypsoStages.map((s) => s.name)).toEqual([
      'Capture',
      'Valuation',
      'Risk',
      'Collateral',
      'Settlement',
      'Ledger',
      'Regulatory reporting',
    ])
    const officeOrder = calypsoStages.map((s) => calypsoOffices.indexOf(s.office))
    expect(officeOrder).toEqual([...officeOrder].sort((a, b) => a - b))
    for (const s of calypsoStages) {
      expect(s.does).toMatch(/\.$/)
      expect(s.breaks).toMatch(/\.$/)
    }
  })

  it('groups eight programs into three families of 3, 3 and 2', () => {
    expect(calypsoProgramFamilies.map((f) => [f.title, f.programs.length])).toEqual([
      ['Earnings and audit', 3],
      ['Delivery and migration', 3],
      ['Capital and regulatory', 2],
    ])
  })

  it('lists four mandate shapes with a three-term scope each', () => {
    expect(calypsoMandates.map((m) => m.title)).toEqual([
      'Calypso implementation',
      'Platform migration',
      'Lifecycle-led testing',
      'Operational readiness',
    ])
    for (const m of calypsoMandates) expect(m.scope.split(' · ')).toHaveLength(3)
  })

  it('keeps the house guardrails: no em dashes', () => {
    expect(allCopy).not.toMatch(/—/)
  })

  it('pads indices to two digits', () => {
    expect(pad2(1)).toBe('01')
    expect(pad2(8)).toBe('08')
  })
})
