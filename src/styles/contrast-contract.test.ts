import { afterEach, describe, expect, it } from 'vitest'
import './globals.css'

const HEX_COLOR = /^#[0-9a-f]{6}$/i
const CSS_VARIABLE = /^var\((--[^,)]+)(?:,[^)]+)?\)$/

function resolveToken(element: Element, name: string) {
  let value = getComputedStyle(element).getPropertyValue(name).trim()
  const seen = new Set<string>()

  while (CSS_VARIABLE.test(value)) {
    const referencedName = value.match(CSS_VARIABLE)?.[1]
    if (!referencedName || seen.has(referencedName)) break
    seen.add(referencedName)
    value = getComputedStyle(element).getPropertyValue(referencedName).trim()
  }

  if (!HEX_COLOR.test(value)) {
    throw new Error(`Expected ${name} to resolve to a six-digit hex color, received "${value}"`)
  }

  return value
}

function relativeLuminance(hex: string) {
  const channels = hex
    .match(/[a-f\d]{2}/gi)!
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) => (
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4
    ))

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(foreground: string, background: string) {
  const [lighter, darker] = [
    relativeLuminance(foreground),
    relativeLuminance(background),
  ].sort((left, right) => right - left)

  return (lighter + 0.05) / (darker + 0.05)
}

describe('global contrast contract', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('keeps dark-field violet text above the WCAG AA text threshold', () => {
    const root = document.documentElement
    const accentText = resolveToken(root, '--accent-text-dark')

    expect(contrastRatio(accentText, resolveToken(root, '--carbon'))).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(accentText, resolveToken(root, '--graphite'))).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps default and hover action fills legible with their action ink', () => {
    const root = document.documentElement
    const actionInk = resolveToken(root, '--action-ink')

    expect(contrastRatio(actionInk, resolveToken(root, '--action-fill'))).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(actionInk, resolveToken(root, '--action-fill-hover'))).toBeGreaterThanOrEqual(4.5)
  })

  it('uses passing focus indicators on both dark and Mineral fields', () => {
    const darkField = document.createElement('div')
    const mineralField = document.createElement('div')
    mineralField.dataset.colorField = 'mineral'
    document.body.append(darkField, mineralField)

    const darkFocus = resolveToken(darkField, '--focus-ring-color')
    const lightFocus = resolveToken(mineralField, '--focus-ring-color')

    expect(darkFocus).toBe(resolveToken(darkField, '--violet-light'))
    expect(lightFocus).toBe(resolveToken(mineralField, '--violet-ink'))
    expect(contrastRatio(darkFocus, resolveToken(darkField, '--carbon'))).toBeGreaterThanOrEqual(3)
    expect(contrastRatio(darkFocus, resolveToken(darkField, '--graphite'))).toBeGreaterThanOrEqual(3)
    expect(contrastRatio(lightFocus, resolveToken(mineralField, '--mineral'))).toBeGreaterThanOrEqual(3)
  })
})
