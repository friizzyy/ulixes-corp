// @vitest-environment node

import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { afterEach, describe, expect, it } from 'vitest'

const script = resolve(process.cwd(), 'scripts/link-check.mjs')
const fixtures: string[] = []

function makeFixture() {
  const root = mkdtempSync(join(tmpdir(), 'ulixes-link-check-'))
  fixtures.push(root)
  return root
}

function write(root: string, path: string, contents: string) {
  const target = join(root, path)
  mkdirSync(resolve(target, '..'), { recursive: true })
  writeFileSync(target, contents)
}

function run(root: string) {
  return spawnSync(process.execPath, [script], {
    cwd: root,
    encoding: 'utf8',
  })
}

describe('publication link checker', () => {
  afterEach(() => {
    for (const fixture of fixtures.splice(0)) {
      rmSync(fixture, { recursive: true, force: true })
    }
  })

  it('derives current app routes instead of rejecting newly published pages', () => {
    const root = makeFixture()
    write(
      root,
      'src/app/nasdaq-calypso/page.tsx',
      'export default () => <a href="/nasdaq-calypso">Calypso</a>',
    )

    expect(run(root).status).toBe(0)
  })

  it('checks content-driven href values as well as JSX attributes', () => {
    const root = makeFixture()
    write(root, 'src/app/page.tsx', 'export default () => null')
    write(
      root,
      'src/lib/navigation.ts',
      "export const navigation = [{ href: '/missing-page' }]",
    )

    const result = run(root)
    expect(result.status).toBe(1)
    expect(result.stdout).toContain('/missing-page')
  })

  it('fails closed when its source tree cannot be read', () => {
    const result = run(makeFixture())

    expect(result.status).not.toBe(0)
  })
})
