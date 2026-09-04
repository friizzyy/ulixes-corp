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
const lifecycleStylesheet = readFileSync(
  resolve(
    process.cwd(),
    'src/components/calypso/mobile-lifecycle-pager.module.css',
  ),
  'utf8',
)
const lifecycleWorkbenchStylesheet = readFileSync(
  resolve(
    process.cwd(),
    'src/components/calypso/lifecycle-blotter.module.css',
  ),
  'utf8',
)
const mandateStylesheet = readFileSync(
  resolve(
    process.cwd(),
    'src/components/calypso/mobile-mandate-selector.module.css',
  ),
  'utf8',
)
const sheetStylesheet = readFileSync(
  resolve(
    process.cwd(),
    'src/components/ui/mobile-detail-sheet.module.css',
  ),
  'utf8',
)
const heroSource = readFileSync(
  resolve(process.cwd(), 'src/components/calypso/calypso-hero.tsx'),
  'utf8',
)

const channel = (value: string) => {
  const component = Number.parseInt(value, 16) / 255
  return component <= 0.04045
    ? component / 12.92
    : ((component + 0.055) / 1.055) ** 2.4
}

const luminance = (hex: string) => {
  const match = hex.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i)
  if (!match) throw new Error(`Expected a six-digit hex color, received ${hex}`)
  return (
    0.2126 * channel(match[1]) +
    0.7152 * channel(match[2]) +
    0.0722 * channel(match[3])
  )
}

const contrast = (foreground: string, background: string) => {
  const light = Math.max(luminance(foreground), luminance(background))
  const dark = Math.min(luminance(foreground), luminance(background))
  return (light + 0.05) / (dark + 0.05)
}

const token = (rule: string, name: string) => {
  const match = rule.match(new RegExp(`--${name}:\\s*(#[\\da-f]{6})`, 'i'))
  if (!match) throw new Error(`Missing --${name} token in sheet rule`)
  return match[1]
}

describe('Nasdaq Calypso responsive layout', () => {
  it('uses one intentional title rhythm across the Programs and Mandates chapters', () => {
    const touchRules = stylesheet.slice(
      stylesheet.lastIndexOf('@media (max-width: 895px)'),
    )

    for (const source of [
      stylesheet,
      heroStylesheet,
      heroSource,
      programStylesheet,
      lifecycleStylesheet,
      lifecycleWorkbenchStylesheet,
      mandateStylesheet,
    ]) {
      expect(source).not.toMatch(/(?:min|max)-width:\s*899px/)
    }
    expect(stylesheet).toMatch(
      /\.chapterHeader\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\([^,]+,\s*1\.35fr\)\s+minmax\(0,\s*1fr\)/,
    )
    expect(stylesheet).toMatch(
      /\.chapterTitleGroup\s*\{[^}]*grid-column:\s*2[^}]*text-align:\s*center/,
    )
    expect(stylesheet).toMatch(
      /\.chapterHeader\s*>\s*p\s*\{[^}]*grid-column:\s*3[^}]*text-align:\s*left/,
    )
    expect(stylesheet).toMatch(
      /\.mandateHeader\s*\{[^}]*grid-template-areas:\s*'lede title'/,
    )
    expect(stylesheet).toMatch(
      /\.mandateTitleGroup\s*\{[^}]*grid-area:\s*title[^}]*text-align:\s*right/,
    )
    expect(stylesheet).toMatch(
      /\.mandateLede\s*\{[^}]*grid-area:\s*lede[^}]*text-align:\s*left/,
    )
    expect(touchRules).toMatch(
      /\.chapterTitleGroup\s*\{[^}]*grid-column:\s*1[^}]*text-align:\s*center/,
    )
    expect(touchRules).toMatch(
      /\.mandateHeader\s*\{[^}]*grid-template-areas:\s*'title'\s*'lede'/,
    )
    expect(touchRules).toMatch(
      /\.mandateTitleGroup\s*\{[^}]*text-align:\s*left/,
    )
    expect(programStylesheet).toMatch(
      /\.mobileProgramControl\s*\{[^}]*text-align:\s*left/,
    )
    expect(programStylesheet).toMatch(
      /\.mobileFamilyControl\s*\{[^}]*text-align:\s*left/,
    )
    expect(programStylesheet).toMatch(
      /\.row\s*\{[^}]*text-align:\s*left/,
    )
  })

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
      heroStylesheet.indexOf('@media (max-width: 895px)'),
    )

    expect(phoneRules).toMatch(
      /\.media\s*\{[\s\S]*?height:\s*clamp\([^;]*168px[^;]*196px[^;]*\)/,
    )
    expect(phoneRules).toMatch(
      /\.authorityShell\s*\{[\s\S]*?margin-top:\s*-(?:1\.5|1\.6|1\.7|1\.75|1\.8|1\.9|2)rem/,
    )
    expect(phoneRules).toMatch(
      /\.body\s*\{[\s\S]*?font-size:\s*(?:1rem|16px)/,
    )
  })

  it('tightens only the touch hero, program, mandate, and closing rhythm', () => {
    const heroTouchRules = heroStylesheet.slice(
      heroStylesheet.indexOf('@media (max-width: 895px)'),
    )
    const routeTouchRules = stylesheet.slice(
      stylesheet.indexOf('Every phone-width collapse'),
    )

    expect(heroTouchRules).toMatch(
      /\.hero\s*\{[\s\S]*?padding:\s*calc\(var\(--mobile-header-height\) \+ 1\.25rem\) 0 0/,
    )
    expect(heroTouchRules).toMatch(
      /\.authorityDock li,[\s\S]*?min-height:\s*6\.25rem/,
    )
    expect(routeTouchRules).toMatch(
      /@media \(max-width:\s*895px\)[\s\S]*?\.programChapter\s*\{[\s\S]*?padding:\s*clamp\(3rem,[^;]*3\.5rem\) 0/,
    )
    expect(routeTouchRules).toMatch(
      /\.chapterMedia\s*\{[\s\S]*?height:\s*136px/,
    )
    expect(routeTouchRules).toMatch(
      /\.mandateSection\s*\{[\s\S]*?padding:\s*clamp\(3rem,[^;]*3\.5rem\) 0/,
    )
    expect(routeTouchRules).toMatch(
      /\.closeSection\s*\{[\s\S]*?padding:\s*1\.25rem 0 2\.5rem/,
    )
    expect(routeTouchRules).toMatch(
      /\.closePanel\s*\{[\s\S]*?padding:\s*1\.25rem/,
    )
  })

  it('keeps the fixed three-family selector through the 895px touch layout', () => {
    expect(programStylesheet).toMatch(
      /\.mobileFamilySelector\s*\{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/,
    )
    const touchRules = programStylesheet.slice(
      programStylesheet.indexOf('@media (max-width: 895px)'),
    )
    expect(touchRules).toMatch(
      /\.index\s*,\s*\n?\s*\.detailColumn\s*,\s*\n?\s*\.domains\s*\{[\s\S]*?display:\s*none/,
    )
  })

  it('keeps the mobile lifecycle instrument fixed and swaps at 895/896', () => {
    expect(lifecycleStylesheet).toMatch(
      /\.pager\s*\{[\s\S]*?\n\s*height:\s*(?:29rem|464px)/,
    )
    expect(lifecycleStylesheet).toMatch(
      /\.segmentViewport\s*\{[\s\S]*?overflow-x:\s*auto/,
    )
    expect(lifecycleStylesheet).toMatch(
      /\.segments\s*\{[\s\S]*?grid-template-columns:\s*repeat\(7,\s*minmax\(2\.75rem,\s*1fr\)\)[\s\S]*?min-width:\s*19\.25rem/,
    )
    expect(lifecycleStylesheet).toMatch(
      /@media \(min-width:\s*896px\)\s*\{[\s\S]*?\.pager\s*\{[\s\S]*?display:\s*none/,
    )
    expect(lifecycleWorkbenchStylesheet).toMatch(
      /@media \(max-width:\s*895px\)\s*\{[\s\S]*?\.desktopWorkbench\s*\{[\s\S]*?display:\s*none/,
    )
  })

  it('keeps program, domain, and mandate explanatory copy at least 16px on phones', () => {
    const programPhoneRules = programStylesheet.slice(
      programStylesheet.indexOf('@media (max-width: 895px)'),
    )
    const pagePhoneRules = stylesheet.slice(
      stylesheet.lastIndexOf('@media (max-width: 895px)'),
    )

    for (const selector of ['mobileFamilyNote', 'mobileProgramNote']) {
      expect(programPhoneRules).toMatch(
        new RegExp(`\\.${selector}\\s*\\{[\\s\\S]*?font-size:\\s*(?:1rem|16px)`),
      )
    }
    expect(pagePhoneRules).toMatch(
      /\.mandateRisk\s*\{[\s\S]*?font-size:\s*(?:1rem|16px)/,
    )
    expect(mandateStylesheet).toMatch(
      /\.riskCopy\s*\{[\s\S]*?font-size:\s*(?:1rem|16px)/,
    )
  })

  it('keeps portalled Calypso sheet copy opaque and on AA text tokens', () => {
    const sheetRule = sheetStylesheet.slice(
      sheetStylesheet.indexOf('.sheet {'),
      sheetStylesheet.indexOf('.sheet:focus'),
    )
    const entrance = sheetStylesheet.slice(
      sheetStylesheet.indexOf('@keyframes sheet-enter'),
      sheetStylesheet.indexOf('@media (min-width: 896px)'),
    )

    const surface = token(sheetRule, 'mineral-light')
    for (const name of ['ink', 'graphite', 'steel']) {
      expect(contrast(token(sheetRule, name), surface)).toBeGreaterThanOrEqual(4.5)
    }
    expect(entrance).toMatch(/transform:/)
    expect(entrance).not.toMatch(/opacity:/)
    expect(lifecycleStylesheet).toMatch(
      /\.sheetField h3\s*\{[^}]*color:\s*var\(--steel\)/,
    )
    expect(lifecycleStylesheet).toMatch(
      /\.sheetField li\s*\{[^}]*color:\s*var\(--graphite\)/,
    )
    expect(programStylesheet).toMatch(
      /\.mobileDomain p\s*\{[^}]*color:\s*var\(--graphite\)/,
    )
    expect(programStylesheet).toMatch(
      /\.mobileDomainIndex\s*\{[^}]*color:\s*var\(--steel\)/,
    )
    expect(programStylesheet).toMatch(
      /\.mobileDomain strong\s*\{[^}]*color:\s*var\(--ink\)/,
    )
  })

  it('does not define a horizontal content rail for programs or mandates', () => {
    expect(programStylesheet).not.toMatch(/scroll-snap|overflow-x:\s*(?:auto|scroll)/)
    expect(stylesheet).not.toMatch(/scroll-snap|overflow-x:\s*(?:auto|scroll)/)
  })

  it('limits selector motion to the directional content change', () => {
    const lifecycleKeyframes = lifecycleStylesheet.slice(
      lifecycleStylesheet.indexOf('@keyframes brief-enter-forward'),
      lifecycleStylesheet.indexOf('@media (min-width: 600px)'),
    )
    const mandateKeyframes = mandateStylesheet.slice(
      mandateStylesheet.indexOf('@keyframes risk-enter-forward'),
      mandateStylesheet.indexOf('@media (min-width: 600px)'),
    )
    const mobileFamilyControl = programStylesheet.slice(
      programStylesheet.indexOf('.mobileFamilyControl {'),
      programStylesheet.indexOf(".mobileFamilyControl[aria-pressed='true']"),
    )
    const mobileDomainTrigger = programStylesheet.slice(
      programStylesheet.indexOf('.mobileDomainsTrigger {'),
      programStylesheet.indexOf('.mobileDomainsTrigger:hover'),
    )

    expect(lifecycleStylesheet).not.toMatch(/\btransition\s*:/)
    expect(mandateStylesheet).not.toMatch(/\btransition\s*:/)
    expect(mobileFamilyControl).not.toMatch(/\btransition\s*:/)
    expect(mobileDomainTrigger).not.toMatch(/\btransition\s*:/)
    for (const keyframes of [lifecycleKeyframes, mandateKeyframes]) {
      expect(keyframes).toMatch(/opacity:/)
      expect(keyframes).toMatch(/transform:/)
      expect(keyframes).not.toMatch(
        /(?:background|border|color|height|width|top|right|bottom|left):/,
      )
    }
  })
})
