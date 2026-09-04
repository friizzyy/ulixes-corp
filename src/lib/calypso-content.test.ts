import { describe, expect, it } from 'vitest'
import { chainStages, productDomains } from './expertise-content'
import {
  calypsoContent,
  calypsoDelivery,
  calypsoDomains,
  calypsoPractices,
  calypsoProgramFamilies,
  calypsoPrograms,
} from './calypso-content'

const order = chainStages.map((stage) => stage.id)

describe('calypso content contract', () => {
  it('publishes four verified hero authority facts', () => {
    expect(calypsoContent.authority).toHaveLength(4)
    expect(calypsoContent.authority.map((item) => item.value)).toEqual([
      'Since 2004',
      'Front to back',
      'Banks and hedge funds',
      'Senior-led',
    ])
  })

  it('publishes the eight practice areas Ulysses named', () => {
    expect(calypsoPractices.map((practice) => practice.name)).toEqual([
      'Front office',
      'Risk',
      'Accounting',
      'Collateral',
      'Operations',
      'Testing',
      'Migration',
      'Implementation',
    ])
  })

  it('places every area on the front-to-back axis', () => {
    /*
     * The hero window is generated from `office`, so an unassigned area would
     * silently vanish from the sidebar dots and the coverage view rather than
     * failing.
     */
    for (const practice of calypsoPractices) {
      expect(
        ['front', 'middle', 'back', 'across'],
        `${practice.name} office`,
      ).toContain(practice.office)
    }
  })

  it('gives every office a span that resolves and runs forward', () => {
    /*
     * Spans are rendered as CSS grid columns. A reversed span or one naming a
     * stage that does not exist would draw an inverted or empty bar rather
     * than throwing, so it has to be caught here.
     */
    for (const band of calypsoContent.schematic.bands) {
      const from = order.indexOf(band.span.from)
      const to = order.indexOf(band.span.to)
      expect(from, `${band.id} span.from`).toBeGreaterThanOrEqual(0)
      expect(to, `${band.id} span.to`).toBeGreaterThanOrEqual(0)
      expect(to, `${band.id} runs forward`).toBeGreaterThanOrEqual(from)
    }
  })

  it('tiles the whole lifecycle with no gap and no overlap', () => {
    /*
     * The three offices are drawn as a handover across one continuous axis. A
     * gap would assert a stretch of the lifecycle nobody owns, and an overlap
     * would make the diagram claim two offices own the same stage.
     */
    const spans = calypsoContent.schematic.bands.map((band) => ({
      from: order.indexOf(band.span.from),
      to: order.indexOf(band.span.to),
    }))
    const sorted = [...spans].sort((a, b) => a.from - b.from)

    expect(sorted[0].from).toBe(0)
    expect(sorted[sorted.length - 1].to).toBe(order.length - 1)
    for (let i = 1; i < sorted.length; i += 1) {
      expect(sorted[i].from, 'offices hand over without a gap').toBe(
        sorted[i - 1].to + 1,
      )
    }
  })

  it('runs the across-band the full width of the lifecycle', () => {
    // Testing, migration and implementation touch all three offices, which is
    // the reason they are not filed under one.
    expect(calypsoContent.schematic.acrossSpan).toEqual({
      from: order[0],
      to: order[order.length - 1],
    })
    expect(
      calypsoPractices.filter((practice) => practice.office === 'across'),
    ).toHaveLength(3)
  })

  it('keeps the domain list in step with the one /services publishes', () => {
    /*
     * Only the notes live in the calypso content; the names are the same six
     * the expertise chain lists. Pinning them together is what stops the two
     * pages drifting into two different answers about what is covered.
     */
    expect(calypsoDomains.map((domain) => domain.name)).toEqual([
      ...productDomains,
    ])
  })

  it('files every program under a family that has a material and members', () => {
    /*
     * The programs index is grouped by family and marks the open row with a
     * rule tinted by the family's material. A program filed under an unknown
     * family would vanish from the index rather than fail, and a family with
     * no members would render a head with nothing under it.
     */
    const families = new Set(calypsoProgramFamilies.map((family) => family.id))
    for (const program of calypsoPrograms) {
      expect(families, `${program.name} family`).toContain(program.family)
    }
    for (const family of calypsoProgramFamilies) {
      expect(['steel', 'sage', 'clay', 'platinum'], `${family.id} material`).toContain(
        family.material,
      )
      expect(
        calypsoPrograms.filter((program) => program.family === family.id).length,
        `${family.label} members`,
      ).toBeGreaterThan(0)
    }
  })

  it('gives every program and domain a scope note', () => {
    // A bare name was the thinnest thing in the window; the note is what makes
    // the panel say anything.
    for (const entry of [...calypsoPrograms, ...calypsoDomains]) {
      expect(entry.note.length, `${entry.name} note`).toBeGreaterThan(20)
    }
  })

  it('keeps programs and domains free of outcome claims', () => {
    /*
     * These describe what a deliverable consists of. A percentage, a currency
     * figure or a superlative would turn scope into a claim about results,
     * which is exactly what the guardrails exist to prevent.
     */
    const published = JSON.stringify([
      ...calypsoPrograms,
      ...calypsoDomains,
    ]).toLowerCase()

    expect(published).not.toMatch(/\d+\s*%/)
    expect(published).not.toMatch(/[$£€]\s*\d/)
    for (const banned of ['best', 'fastest', 'guaranteed', 'seamless', 'zero ']) {
      expect(published).not.toContain(banned)
    }
  })

  it('never speaks as a company and carries no em dashes', () => {
    const published = JSON.stringify({
      calypsoContent,
      calypsoPractices,
      calypsoDelivery,
      calypsoPrograms,
      calypsoDomains,
    })

    expect(published).not.toContain('—')

    const lowered = published.toLowerCase()
    for (const form of [' we ', ' we.', ' our ', ' us ', 'we help', 'our team']) {
      expect(lowered).not.toContain(form)
    }
  })

  it('gives every lifecycle stage both a scope and a failure line', () => {
    /*
     * The console renders these directly, so a stage missing one would leave a
     * blank cell rather than failing. The length floor is what stops the copy
     * sliding back toward the one-word glosses this replaced ("It is priced"),
     * which said nothing to an audience that runs these desks.
     */
    for (const stage of chainStages) {
      const detail =
        calypsoContent.schematic.stageDetail[
          stage.id as keyof typeof calypsoContent.schematic.stageDetail
        ]
      expect(detail, `${stage.id} detail`).toBeDefined()
      expect(detail.does.length, `${stage.id} does`).toBeGreaterThan(30)
      expect(detail.breaks.length, `${stage.id} breaks`).toBeGreaterThan(30)
    }
  })

  it('keeps the failure lines descriptive rather than promissory', () => {
    /*
     * These describe how a stage fails, not how often it is caught or by whom.
     * A frequency, a recovery claim, or a promise would turn the most credible
     * copy on the page into the least defensible.
     */
    const published = Object.values(calypsoContent.schematic.stageDetail)
      .flatMap((detail) => [detail.does, detail.breaks])
      .join(' ')
      .toLowerCase()

    expect(published).not.toMatch(/\d/)
    for (const banned of [
      'always',
      'never fails',
      'guarantee',
      'prevent',
      'eliminat',
      'ensure',
      'we ',
    ]) {
      expect(published, banned).not.toContain(banned)
    }
  })

  it('gives every desk a description of what it covers', () => {
    // The handover view renders `covers`; a band without one would render an
    // empty column.
    for (const band of calypsoContent.schematic.bands) {
      expect(band.covers.length, `${band.id} covers`).toBeGreaterThan(40)
    }
  })

  it('publishes no figures for the hero window to render', () => {
    /*
     * The window is deliberately structural. Invented notionals, volumes or
     * P&L would be fabricated data on a site whose premise is verified claims,
     * so nothing in the schematic may carry a number.
     */
    const schematic = JSON.stringify(calypsoContent.schematic)
    expect(schematic).not.toMatch(/\d/)
  })
})
