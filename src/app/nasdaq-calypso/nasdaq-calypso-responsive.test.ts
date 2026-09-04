import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const stylesheet = readFileSync(
  resolve(
    process.cwd(),
    'src/app/nasdaq-calypso/nasdaq-calypso.module.css',
  ),
  'utf8',
)
const heroStylesheet = readFileSync(
  resolve(
    process.cwd(),
    'src/components/calypso/calypso-hero.module.css',
  ),
  'utf8',
)
const programStylesheet = readFileSync(
  resolve(
    process.cwd(),
    'src/components/calypso/calypso-programs.module.css',
  ),
  'utf8',
)

describe('Nasdaq Calypso responsive layout', () => {
  it('collapses the chapter header before its fixed copy column can squeeze the title', () => {
    const responsiveRules = stylesheet.slice(
      stylesheet.indexOf('Every phone-width collapse'),
    )

    expect(responsiveRules).toMatch(
      /\.chapterHeader\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/,
    )
  })

  it('keeps the phone hero image short and bridges it with the authority ledger', () => {
    const phoneRules = heroStylesheet.slice(
      heroStylesheet.indexOf('@media (max-width: 767px)'),
    )

    expect(phoneRules).toMatch(
      /\.media\s*\{[\s\S]*?height:\s*(?:clamp\([^;]*190px[^;]*220px[^;]*\)|(?:190|19\d|20\d|21\d|220)px)/,
    )
    expect(phoneRules).toMatch(
      /\.authorityShell\s*\{[\s\S]*?margin-top:\s*-(?:1\.5|1\.6|1\.7|1\.75|1\.8|1\.9|2)rem/,
    )
    expect(phoneRules).toMatch(
      /\.body\s*\{[\s\S]*?font-size:\s*(?:1rem|16px)/,
    )
  })

  it('uses a fixed three-family selector and a two-column domain register until 320px', () => {
    expect(programStylesheet).toMatch(
      /\.mobileFamilySelector\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/,
    )
    expect(programStylesheet).toMatch(
      /\.domainList\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/,
    )
    const narrowPhoneRules = programStylesheet.slice(
      programStylesheet.indexOf('@media (max-width: 359px)'),
    )
    expect(narrowPhoneRules).toMatch(
      /\.domainList\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/,
    )
  })

  it('keeps program, domain, and mandate explanatory copy at least 16px on phones', () => {
    const programPhoneRules = programStylesheet.slice(
      programStylesheet.indexOf('@media (max-width: 767px)'),
    )
    const pagePhoneRules = stylesheet.slice(
      stylesheet.indexOf('@media (max-width: 767px)'),
    )

    for (const selector of ['mobileFamilyNote', 'mobileProgramNote', 'domainNote']) {
      expect(programPhoneRules).toMatch(
        new RegExp(`\\.${selector}\\s*\\{[\\s\\S]*?font-size:\\s*(?:1rem|16px)`),
      )
    }
    expect(pagePhoneRules).toMatch(
      /\.mandateRisk\s*\{[\s\S]*?font-size:\s*(?:1rem|16px)/,
    )
  })

  it('does not define a horizontal content rail for programs or mandates', () => {
    expect(programStylesheet).not.toMatch(/scroll-snap|overflow-x:\s*(?:auto|scroll)/)
    expect(stylesheet).not.toMatch(/scroll-snap|overflow-x:\s*(?:auto|scroll)/)
  })
})
