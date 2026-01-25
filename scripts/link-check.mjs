#!/usr/bin/env node

/**
 * Simple link and content checker for UlixesCorp site
 * Scans for:
 * - Empty hrefs
 * - Double dashes in UI copy
 * - Dead internal links
 */

import { readdir, readFile } from 'fs/promises'
import { join, extname } from 'path'

const SRC_DIR = './src'
const VALID_INTERNAL_ROUTES = [
  '/',
  '/philosophy',
  '/services',
  '/work',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
]

const issues = []

async function getFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
      files.push(...await getFiles(fullPath, extensions))
    } else if (entry.isFile() && extensions.includes(extname(entry.name))) {
      files.push(fullPath)
    }
  }

  return files
}

async function checkFile(filePath) {
  const content = await readFile(filePath, 'utf-8')
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    const lineNum = index + 1

    // Check for empty hrefs
    if (line.includes('href=""') || line.includes("href=''")) {
      issues.push({
        file: filePath,
        line: lineNum,
        issue: 'Empty href attribute',
        content: line.trim().slice(0, 80),
      })
    }

    // Check for double dashes in string literals (not CLI flags)
    const stringMatches = line.match(/['"`][^'"`]*--[^'"`]*['"`]/g)
    if (stringMatches) {
      stringMatches.forEach(match => {
        // Skip CLI flags like --scope, --portfolio
        if (!match.includes('--') || match.match(/--[a-z]/)) {
          return
        }
        // Skip CSS variables like --font
        if (match.includes('--font') || match.includes('var(--')) {
          return
        }
        // Check for actual double dash in prose
        if (match.match(/[a-zA-Z]--[a-zA-Z]/)) {
          issues.push({
            file: filePath,
            line: lineNum,
            issue: 'Double dash in text content',
            content: match.slice(0, 80),
          })
        }
      })
    }

    // Check for internal links that don't match valid routes
    const hrefMatches = line.match(/href=['"]\/[^'"#]*['"]/g)
    if (hrefMatches) {
      hrefMatches.forEach(match => {
        const href = match.replace(/href=['"]|['"]/g, '').split('#')[0]
        if (!VALID_INTERNAL_ROUTES.includes(href) && !href.startsWith('/api')) {
          issues.push({
            file: filePath,
            line: lineNum,
            issue: 'Potentially invalid internal link',
            content: `href="${href}"`,
          })
        }
      })
    }
  })
}

async function main() {
  console.log('Checking links and content...\n')

  const files = await getFiles(SRC_DIR)

  for (const file of files) {
    await checkFile(file)
  }

  if (issues.length === 0) {
    console.log('No issues found!')
    process.exit(0)
  }

  console.log(`Found ${issues.length} issue(s):\n`)
  issues.forEach(({ file, line, issue, content }) => {
    console.log(`${file}:${line}`)
    console.log(`  Issue: ${issue}`)
    console.log(`  Content: ${content}`)
    console.log('')
  })

  process.exit(1)
}

main().catch(console.error)
