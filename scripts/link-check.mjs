#!/usr/bin/env node

/**
 * Publication link and content checker for the Ulixes site.
 *
 * Routes are derived from the App Router tree so a newly published page does
 * not require a second hand-maintained allowlist. Redirect-only paths remain
 * explicit because they intentionally have no page.tsx of their own.
 */

import { readdir, readFile } from 'node:fs/promises'
import { extname, join, relative, sep } from 'node:path'

const SRC_DIR = './src'
const APP_DIR = join(SRC_DIR, 'app')
const SOURCE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js']
const REDIRECT_ROUTES = new Set(['/about', '/philosophy'])
const PUBLIC_ASSET_PATH = /\.(?:avif|css|gif|ico|jpe?g|js|json|mp4|pdf|png|svg|webm|webp|xml)$/i

const issues = []

async function getFiles(dir, extensions = SOURCE_EXTENSIONS) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (
      entry.isDirectory() &&
      !entry.name.startsWith('.') &&
      entry.name !== 'node_modules'
    ) {
      files.push(...(await getFiles(fullPath, extensions)))
    } else if (entry.isFile() && extensions.includes(extname(entry.name))) {
      files.push(fullPath)
    }
  }

  return files
}

function isProductionSource(filePath) {
  const normalized = filePath.split(sep).join('/')
  return (
    !normalized.includes('/__tests__/') &&
    !normalized.includes('/src/test/') &&
    !/\.(?:spec|test)\.[jt]sx?$/.test(normalized)
  )
}

function routeFromPage(filePath) {
  const normalized = relative(APP_DIR, filePath).split(sep).join('/')
  if (!/(?:^|\/)page\.[jt]sx?$/.test(normalized)) return null

  const routeSegments = normalized
    .replace(/(?:^|\/)page\.[jt]sx?$/, '')
    .split('/')
    .filter(Boolean)
    .filter((segment) => !/^\(.+\)$/.test(segment) && !segment.startsWith('@'))

  if (routeSegments.some((segment) => segment.startsWith('['))) return null
  return routeSegments.length === 0 ? '/' : `/${routeSegments.join('/')}`
}

function lineNumberAt(content, index) {
  return content.slice(0, index).split('\n').length
}

function normalizeRoute(path) {
  const withoutQuery = path.split('?')[0]
  if (!withoutQuery || withoutQuery === '/') return '/'
  return withoutQuery.replace(/\/+$/, '')
}

function record(file, content, index, issue, detail) {
  issues.push({
    file,
    line: lineNumberAt(content, index),
    issue,
    content: detail.slice(0, 100),
  })
}

function collectAnchors(filesWithContent) {
  const anchors = new Set()
  const idPattern = /\bid\s*(?:=|:)\s*(?:\{\s*)?(['"`])([^'"`]+)\1/g

  for (const { content } of filesWithContent) {
    for (const match of content.matchAll(idPattern)) {
      const id = match[2]
      if (id && !id.includes('${')) anchors.add(id)
    }
  }

  return anchors
}

function checkFile({ file, content }, validRoutes, anchors) {
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    const lineNum = index + 1

    if (/href\s*=\s*(?:\{\s*)?(['"])\1/.test(line)) {
      issues.push({
        file,
        line: lineNum,
        issue: 'Empty href attribute',
        content: line.trim().slice(0, 100),
      })
    }

    const stringMatches = line.match(/['"`][^'"`]*--[^'"`]*['"`]/g)
    if (stringMatches) {
      for (const match of stringMatches) {
        if (/--[a-z]/.test(match)) continue
        if (match.includes('--font') || match.includes('var(--')) continue
        if (/[a-zA-Z]--[a-zA-Z]/.test(match)) {
          issues.push({
            file,
            line: lineNum,
            issue: 'Double dash in text content',
            content: match.slice(0, 100),
          })
        }
      }
    }
  })

  const hrefPattern = /\bhref\s*(?:=|:)\s*(?:\{\s*)?(['"`])([^'"`]+)\1\s*\}?/g
  for (const match of content.matchAll(hrefPattern)) {
    const href = match[2]
    if (!href || href.includes('${')) continue

    if (href.startsWith('#')) {
      const fragment = href.slice(1)
      if (fragment && !anchors.has(fragment)) {
        record(file, content, match.index ?? 0, 'Missing fragment target', href)
      }
      continue
    }

    if (!href.startsWith('/') || href.startsWith('//')) continue
    const [rawPath, fragment] = href.split('#')
    if (PUBLIC_ASSET_PATH.test(rawPath)) continue

    const route = normalizeRoute(rawPath)
    if (!route.startsWith('/api') && !validRoutes.has(route)) {
      record(
        file,
        content,
        match.index ?? 0,
        'Invalid internal route',
        href,
      )
      continue
    }

    if (fragment && !anchors.has(fragment)) {
      record(
        file,
        content,
        match.index ?? 0,
        'Missing fragment target',
        href,
      )
    }
  }
}

async function main() {
  console.log('Checking links and content...\n')

  const [sourceFiles, appFiles] = await Promise.all([
    getFiles(SRC_DIR),
    getFiles(APP_DIR),
  ])
  const productionFiles = sourceFiles.filter(isProductionSource)
  const filesWithContent = await Promise.all(
    productionFiles.map(async (file) => ({
      file,
      content: await readFile(file, 'utf8'),
    })),
  )
  const validRoutes = new Set(REDIRECT_ROUTES)
  for (const file of appFiles) {
    const route = routeFromPage(file)
    if (route) validRoutes.add(route)
  }
  const anchors = collectAnchors(filesWithContent)

  for (const file of filesWithContent) {
    checkFile(file, validRoutes, anchors)
  }

  if (issues.length === 0) {
    console.log(`No issues found across ${validRoutes.size} routes.`)
    return 0
  }

  console.log(`Found ${issues.length} issue(s):\n`)
  for (const { file, line, issue, content } of issues) {
    console.log(`${file}:${line}`)
    console.log(`  Issue: ${issue}`)
    console.log(`  Content: ${content}`)
    console.log('')
  }

  return 1
}

main()
  .then((exitCode) => {
    process.exitCode = exitCode
  })
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
