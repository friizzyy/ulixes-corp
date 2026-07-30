import { render, screen, within } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'postcss'
import { createElement } from 'react'
import { describe, expect, it } from 'vitest'
import {
  ClosingSignalCTA,
  RepresentativeMandates,
  SeniorJudgment,
} from '@/components/home'
import {
  capabilities,
  homepageContent,
  lifecycleStages,
  representativeMandates,
} from './homepage-content'

const homepageStyles = readFileSync(
  resolve(process.cwd(), 'src/components/home/homepage.module.css'),
  'utf8',
)

function getMobileClosingGeometry() {
  let widthPercent: number | undefined
  let leftPercent: number | undefined

  parse(homepageStyles).walkAtRules('media', (mediaRule) => {
    if (!mediaRule.params.includes('max-width: 767px')) return

    mediaRule.walkRules('.closingSignalNetwork', (rule) => {
      rule.walkDecls((declaration) => {
        if (declaration.prop === 'width' && declaration.value.endsWith('%')) {
          widthPercent = Number.parseFloat(declaration.value)
        }
        if (declaration.prop === 'left' && declaration.value.endsWith('%')) {
          leftPercent = Number.parseFloat(declaration.value)
        }
      })
    })
  })

  if (widthPercent === undefined || leftPercent === undefined) {
    throw new Error('Mobile closing signal requires percentage width and left declarations')
  }

  return { widthPercent, leftPercent }
}

describe('homepage content contract', () => {
  it('keeps final copy within the approved composition limits', () => {
    expect(homepageContent.hero.headline.length).toBeLessThanOrEqual(56)
    expect(homepageContent.hero.body.replace(/\s/g, '').length).toBeLessThanOrEqual(150)
    expect(homepageContent.closing.headline.length).toBeLessThanOrEqual(44)
    expect(homepageContent.senior.body.trim().split(/\s+/).length).toBeLessThanOrEqual(52)
  })

  it('contains the approved lifecycle and complete capability mappings', () => {
    expect(lifecycleStages.map((stage) => stage.id)).toEqual([
      'capture', 'lifecycle', 'risk', 'controls', 'settlement', 'reporting',
    ])
    expect(capabilities).toHaveLength(4)
    expect(capabilities.find((item) => item.id === 'implementation')?.stageIds).toHaveLength(6)
    expect(capabilities.find((item) => item.id === 'testing')?.renderMode).toBe('checkpoints')
  })

  it('publishes exactly three representative mandates without invented results', () => {
    expect(representativeMandates).toHaveLength(3)
    const published = JSON.stringify({ homepageContent, representativeMandates }).toLowerCase()
    for (const forbidden of ['20 implementations', 'zero disruption', 'on-time', 'real-time compliance']) {
      expect(published).not.toContain(forbidden)
    }
  })

  it('renders three editorial mandate movements without case-study result labels', () => {
    render(createElement(RepresentativeMandates))

    const section = screen.getByRole('region', {
      name: homepageContent.mandates.title,
    })
    const movements = within(section).getAllByRole('article')

    expect(movements).toHaveLength(3)
    expect(
      movements.flatMap((movement) =>
        within(movement).getAllByRole('heading', { level: 3 }),
      ),
    ).toHaveLength(3)
    expect(
      movements.flatMap((movement) =>
        Array.from(movement.querySelectorAll('p')),
      ),
    ).toHaveLength(3)
    expect(section).toHaveTextContent(
      'Representative mandate patterns, not client case studies.',
    )
    for (const movement of movements) {
      expect(movement.textContent).not.toMatch(/\b(client|metric|result)\b|%/i)
    }
  })

  it('attributes senior judgment to the President and names all four regions', () => {
    render(createElement(SeniorJudgment))

    expect(screen.getByText(homepageContent.senior.body)).toBeInTheDocument()
    expect(screen.getByText(homepageContent.senior.body)).toHaveTextContent(
      'Ulysses Williams, President',
    )
    for (const region of ['North America', 'Europe', 'APAC', 'Latin America']) {
      expect(screen.getByText(homepageContent.senior.body)).toHaveTextContent(region)
    }
    expect(
      screen.queryByRole('heading', { name: /^about$/i }),
    ).not.toBeInTheDocument()
  })

  it('labels the LinkedIn action as an external new-tab destination', () => {
    render(createElement(SeniorJudgment))

    const linkedIn = screen.getByRole('link', {
      name: 'View Ulysses Williams on LinkedIn (opens in a new tab)',
    })
    expect(linkedIn).toHaveAttribute('href', homepageContent.senior.href)
    expect(linkedIn).toHaveAttribute('target', '_blank')
    expect(linkedIn).toHaveAttribute('rel', 'noreferrer')
  })

  it('converges six routes visibly toward the single approved contact action', () => {
    render(createElement(ClosingSignalCTA))

    const section = screen.getByRole('region', {
      name: homepageContent.closing.headline,
    })
    const network = section.querySelector<SVGElement>(
      '[data-render-mode="closing"]',
    )

    expect(network).toBeInTheDocument()

    const paths = Array.from(
      network?.querySelectorAll('path[data-converges="true"]') ?? [],
    )
    const terminalNodes = Array.from(
      network?.querySelectorAll('circle') ?? [],
    )
    const endpoints = new Set(
      terminalNodes.map((node) => `${node.getAttribute('cx')},${node.getAttribute('cy')}`),
    )
    const pathEndpoints = new Set(
      paths.map((path) => {
        const coordinates = path.getAttribute('d')?.match(/-?\d+(?:\.\d+)?/g) ?? []
        return coordinates.slice(-2).join(',')
      }),
    )

    expect(paths).toHaveLength(6)
    expect(terminalNodes).toHaveLength(6)
    expect(endpoints.size).toBe(1)
    expect(pathEndpoints).toEqual(endpoints)

    const links = within(section).getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/contact')
    expect(section.querySelector('video')).not.toBeInTheDocument()

    const viewBoxWidth = Number(network?.getAttribute('viewBox')?.split(/\s+/)[2])
    const endpointX = Number(terminalNodes[0]?.getAttribute('cx'))
    const { widthPercent, leftPercent } = getMobileClosingGeometry()

    for (const viewportWidth of [320, 390]) {
      const renderedEndpoint =
        (leftPercent / 100) * viewportWidth +
        (endpointX / viewBoxWidth) * (widthPercent / 100) * viewportWidth

      expect(renderedEndpoint).toBeGreaterThanOrEqual(0)
      expect(renderedEndpoint).toBeLessThanOrEqual(viewportWidth)
      expect(renderedEndpoint).toBeGreaterThan(viewportWidth * 0.7)
    }
  })
})
