import { readFileSync } from 'node:fs'
import path from 'node:path'
import { parse, type AtRule, type Rule } from 'postcss'
import { describe, expect, it } from 'vitest'

const MOBILE_MEDIA_QUERY = '(max-width: 767px)'
const stylesheet = parse(
  readFileSync(
    path.join(process.cwd(), 'src/components/home/homepage.module.css'),
    'utf8',
  ),
)

function declarationsFor(selector: string, media?: string) {
  const declarations: Record<string, string> = {}

  stylesheet.walkRules((rule: Rule) => {
    type CssAncestor = {
      name?: string
      params?: string
      parent?: CssAncestor
      type: string
    }
    let ancestor = rule.parent as unknown as CssAncestor | undefined
    let ruleMedia: string | undefined

    while (ancestor) {
      if (ancestor.type === 'atrule' && (ancestor as AtRule).name === 'media') {
        ruleMedia = (ancestor as AtRule).params
        break
      }
      ancestor = ancestor.parent
    }

    if (ruleMedia !== media || !rule.selectors.includes(selector)) return
    rule.walkDecls((declaration) => {
      declarations[declaration.prop] = declaration.value
    })
  })

  return declarations
}

describe('ClosingSignalCTA mobile geometry', () => {
  it('removes the artificial gap between the convergence point and CTA', () => {
    const network = declarationsFor('.closingSignalNetwork', MOBILE_MEDIA_QUERY)
    const action = declarationsFor('.closingSignalAction', MOBILE_MEDIA_QUERY)

    expect(network).toMatchObject({
      bottom: '34px',
      height: '310px',
    })
    expect(action).toMatchObject({
      'margin-top': '0',
      'min-height': '48px',
      'align-self': 'flex-end',
    })
  })
})
