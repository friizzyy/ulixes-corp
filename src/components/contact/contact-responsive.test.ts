import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const stylesheet = readFileSync(
  resolve(process.cwd(), 'src/components/contact/contact.module.css'),
  'utf8',
)

describe('contact mobile layout', () => {
  it('keeps the mobile visual order aligned with DOM and keyboard order', () => {
    const tabletRules = stylesheet.slice(
      stylesheet.indexOf('@media (max-width: 899px)'),
      stylesheet.indexOf('@media (max-width: 767px)'),
    )

    expect(tabletRules).toMatch(
      /grid-template-areas:\s*['"]head['"]\s*['"]details['"]\s*['"]card['"]/,
    )
  })

  it('dissolves nested surfaces and uses safe 20px gutters on narrow phones', () => {
    const narrowPhoneRules = stylesheet.slice(
      stylesheet.indexOf('@media (max-width: 599px)'),
    )

    expect(narrowPhoneRules).toMatch(
      /\.stage\s*\{[^}]*padding-inline:\s*max\(1\.25rem,\s*env\(safe-area-inset-left\)\)/,
    )
    expect(narrowPhoneRules).toMatch(
      /\.panel\s*\{[^}]*padding:\s*0[^}]*border:\s*0[^}]*background:\s*transparent[^}]*box-shadow:\s*none/,
    )
    expect(narrowPhoneRules).toMatch(
      /\.card\s*\{[^}]*padding:\s*0[^}]*border:\s*0[^}]*background:\s*transparent[^}]*box-shadow:\s*none/,
    )
  })

  it('uses phone-scale headings, readable copy, and full-size controls', () => {
    const narrowPhoneRules = stylesheet.slice(
      stylesheet.indexOf('@media (max-width: 599px)'),
    )

    expect(narrowPhoneRules).toMatch(
      /\.title\s*\{[^}]*font-size:\s*clamp\([^;]*2\.5rem[^;]*2\.625rem[^;]*\)/,
    )
    expect(narrowPhoneRules).toMatch(
      /\.field input,\s*\.field textarea\s*\{[^}]*min-height:\s*3\.25rem/,
    )
    expect(narrowPhoneRules).toMatch(
      /\.lead,\s*\.whoNote,\s*\.stateBody,\s*\.formError\s*\{[^}]*font-size:\s*(?:1rem|16px)/,
    )
    expect(narrowPhoneRules).toMatch(
      /\.stateAction\s*\{[^}]*min-height:\s*44px/,
    )
  })
})
