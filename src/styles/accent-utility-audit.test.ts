import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const SOURCE_EXTENSIONS = new Set(['.css', '.ts', '.tsx'])
const ACCENT_UTILITY = /(?<![-\w])\.?(?:[a-z0-9-]+:)*[a-z][a-z0-9-]*-accent(?:\/[^\s"'`]+)?/gi
const THIS_FILE = 'styles/accent-utility-audit.test.ts'

function collectSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) return collectSourceFiles(entryPath)
    return SOURCE_EXTENSIONS.has(path.extname(entry.name)) ? [entryPath] : []
  })
}

describe('Tailwind accent utility audit', () => {
  it('keeps source utilities on role-specific color tokens', () => {
    const sourceRoot = path.join(process.cwd(), 'src')
    const violations = collectSourceFiles(sourceRoot).flatMap((filePath) => {
      const relativePath = path.relative(sourceRoot, filePath)
      if (relativePath === THIS_FILE) return []

      return readFileSync(filePath, 'utf8')
        .split('\n')
        .flatMap((line, index) => Array.from(line.matchAll(ACCENT_UTILITY), (match) => (
          `${relativePath}:${index + 1}:${match[0]}`
        )))
    })

    expect(violations, violations.join('\n')).toEqual([])
  })
})
