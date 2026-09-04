import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const stylesheet = readFileSync(
  resolve(process.cwd(), 'src/components/contact/contact.module.css'),
  'utf8',
)

describe('contact mobile layout', () => {
  it('keeps the mobile visual order aligned with DOM through 895px only', () => {
    const touchRules = stylesheet.slice(
      stylesheet.indexOf('@media (max-width: 895px)'),
      stylesheet.indexOf('@media (max-width: 767px)'),
    )

    expect(stylesheet).not.toContain('@media (max-width: 899px)')
    expect(touchRules).toMatch(
      /grid-template-areas:\s*['"]head['"]\s*['"]details['"]\s*['"]card['"]/,
    )
  })

  it('uses the shared safe-area-aware gutter through 895px', () => {
    const touchRules = stylesheet.slice(
      stylesheet.indexOf('@media (max-width: 895px)'),
      stylesheet.indexOf('@media (max-width: 767px)'),
    )

    expect(touchRules).toMatch(
      /\.stage\s*\{[^}]*padding-left:\s*calc\(var\(--mobile-gutter\)\s*\+\s*var\(--safe-area-left,\s*0px\)\)[^}]*padding-right:\s*calc\(var\(--mobile-gutter\)\s*\+\s*var\(--safe-area-right,\s*0px\)\)/,
    )
  })

  it('dissolves nested surfaces on narrow phones', () => {
    const narrowPhoneRules = stylesheet.slice(
      stylesheet.indexOf('@media (max-width: 599px)'),
    )

    expect(narrowPhoneRules).toMatch(
      /\.panel\s*\{[^}]*padding:\s*0[^}]*border:\s*0[^}]*background:\s*transparent[^}]*box-shadow:\s*none/,
    )
    expect(narrowPhoneRules).toMatch(
      /\.card\s*\{[^}]*padding:\s*0[^}]*border:\s*0[^}]*background:\s*transparent[^}]*box-shadow:\s*none/,
    )
  })

  it('uses phone-scale headings and readable copy', () => {
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
  })

  it('keeps the success reset target at least 44px at every width', () => {
    const baseActionRules = stylesheet.slice(
      stylesheet.indexOf('.stateAction {'),
      stylesheet.indexOf('/* Responsive'),
    )

    expect(baseActionRules).toMatch(
      /\.stateAction\s*\{[^}]*display:\s*inline-flex[^}]*min-height:\s*44px[^}]*align-items:\s*center/,
    )
  })
})
