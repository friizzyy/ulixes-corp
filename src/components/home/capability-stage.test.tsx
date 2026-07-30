import { readFileSync } from 'node:fs'
import path from 'node:path'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { parse, type AtRule, type Rule } from 'postcss'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  capabilities,
  lifecycleStages,
  type LifecycleStageId,
} from '@/lib/homepage-content'
import { CapabilityStage } from './capability-stage'

const DESKTOP_MEDIA_QUERY = '(min-width: 768px)'
const MOBILE_MEDIA_QUERY = '(max-width: 767px)'
const stylesheet = parse(
  readFileSync(
    path.join(process.cwd(), 'src/components/home/homepage.module.css'),
    'utf8',
  ),
)

type MediaListener = (event: MediaQueryListEvent) => void

class IntersectionObserverHarness implements IntersectionObserver {
  static instances: IntersectionObserverHarness[] = []

  readonly root = null
  readonly rootMargin: string
  readonly thresholds: readonly number[]
  readonly observed = new Set<Element>()
  readonly disconnect = vi.fn(() => {
    this.observed.clear()
  })
  readonly unobserve = vi.fn((target: Element) => {
    this.observed.delete(target)
  })
  readonly takeRecords = vi.fn(() => [])

  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit = {},
  ) {
    this.rootMargin = options.rootMargin ?? '0px'
    this.thresholds = Array.isArray(options.threshold)
      ? options.threshold
      : [options.threshold ?? 0]
    IntersectionObserverHarness.instances.push(this)
  }

  observe = vi.fn((target: Element) => {
    this.observed.add(target)
  })

  cross(target: Element, isIntersecting = true) {
    this.callback(
      [
        {
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRatio: isIntersecting ? 1 : 0,
          intersectionRect: target.getBoundingClientRect(),
          isIntersecting,
          rootBounds: null,
          target,
          time: 0,
        },
      ],
      this,
    )
  }
}

function createMediaEnvironment(initialDesktop: boolean) {
  let desktop = initialDesktop
  const listeners = new Map<string, Set<MediaListener>>()

  const matchMedia = vi.fn((query: string) => {
    const queryListeners = listeners.get(query) ?? new Set<MediaListener>()
    listeners.set(query, queryListeners)

    return {
      get matches() {
        if (query === DESKTOP_MEDIA_QUERY) return desktop
        if (query === MOBILE_MEDIA_QUERY) return !desktop
        if (query === '(prefers-reduced-motion: reduce)') return false
        return false
      },
      media: query,
      onchange: null,
      addEventListener: (_type: string, listener: MediaListener) => {
        queryListeners.add(listener)
      },
      removeEventListener: (_type: string, listener: MediaListener) => {
        queryListeners.delete(listener)
      },
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    } as MediaQueryList
  })

  return {
    matchMedia,
    setDesktop(nextDesktop: boolean) {
      desktop = nextDesktop
      listeners.get(DESKTOP_MEDIA_QUERY)?.forEach((listener) => {
        listener({ matches: desktop, media: DESKTOP_MEDIA_QUERY } as MediaQueryListEvent)
      })
    },
  }
}

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

function highlightedStageIds(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<SVGGElement>(
      '[data-capability-shared-network] g[data-highlighted="true"]',
    ),
  ).map((stage) => stage.dataset.stageId)
}

function sharedNetwork(container: HTMLElement) {
  return container.querySelector<SVGSVGElement>(
    '[data-capability-shared-network] svg',
  )
}

beforeEach(() => {
  IntersectionObserverHarness.instances = []
  window.IntersectionObserver =
    IntersectionObserverHarness as unknown as typeof IntersectionObserver
  globalThis.IntersectionObserver =
    IntersectionObserverHarness as unknown as typeof IntersectionObserver
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('CapabilityStage', () => {
  it('keeps four semantic capability articles and all approved copy in document order', () => {
    const media = createMediaEnvironment(true)
    vi.spyOn(window, 'matchMedia').mockImplementation(media.matchMedia)

    render(<CapabilityStage />)

    const articles = screen.getAllByRole('article')
    expect(articles).toHaveLength(4)
    expect(
      articles.map((article) => within(article).getByRole('heading', { level: 3 }).textContent),
    ).toEqual(capabilities.map((capability) => capability.title))

    for (const capability of capabilities) {
      expect(screen.getByText(capability.description)).toBeVisible()
    }

    expect(screen.queryByText(/^(tab|card|risk prevented|outcome)$/i)).not.toBeInTheDocument()
  })

  it('uses the exact desktop activation line and updates mappings without hiding article copy', () => {
    const media = createMediaEnvironment(true)
    vi.spyOn(window, 'matchMedia').mockImplementation(media.matchMedia)
    const { container } = render(<CapabilityStage />)
    const observer = IntersectionObserverHarness.instances[0]

    expect(IntersectionObserverHarness.instances).toHaveLength(1)
    expect(observer.options).toMatchObject({
      rootMargin: '-45% 0px -54% 0px',
      threshold: 0,
    })
    expect(Array.from(observer.observed)).toEqual(
      capabilities.map((capability) =>
        screen.getByRole('heading', { name: capability.title }),
      ),
    )

    expect(sharedNetwork(container)).toHaveAttribute('data-render-mode', 'path')
    expect(highlightedStageIds(container)).toEqual(capabilities[0].stageIds)

    act(() => {
      observer.cross(screen.getByRole('heading', { name: 'Platform migration' }))
    })

    expect(highlightedStageIds(container)).toEqual([
      'capture',
      'lifecycle',
      'settlement',
      'reporting',
    ])

    act(() => {
      observer.cross(screen.getByRole('heading', { name: 'AI-assisted compliance' }))
    })

    expect(highlightedStageIds(container)).toEqual([
      'lifecycle',
      'controls',
      'reporting',
    ])

    act(() => {
      observer.cross(screen.getByRole('heading', { name: 'Intelligent testing' }))
    })

    expect(sharedNetwork(container)).toHaveAttribute(
      'data-render-mode',
      'checkpoints',
    )
    expect(highlightedStageIds(container)).toEqual(
      lifecycleStages.map((stage) => stage.id),
    )
    expect(
      container.querySelectorAll(
        '[data-capability-shared-network] path[data-highlighted="true"]',
      ),
    ).toHaveLength(0)

    for (const capability of capabilities) {
      expect(screen.getByText(capability.description)).toBeVisible()
    }
  })

  it('provides native heading links that align and focus their article target', () => {
    const media = createMediaEnvironment(true)
    vi.spyOn(window, 'matchMedia').mockImplementation(media.matchMedia)
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.stubGlobal(
      'requestAnimationFrame',
      (callback: FrameRequestCallback) => {
        callback(0)
        return 1
      },
    )
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      value: 100,
    })
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 1000,
    })
    render(<CapabilityStage />)

    const article = screen
      .getByRole('heading', { name: 'Platform migration' })
      .closest('article')
    const heading = within(article as HTMLElement).getByRole('heading', {
      name: 'Platform migration',
    })
    const link = within(heading).getByRole('link', {
      name: 'Platform migration',
    })
    vi.spyOn(article as HTMLElement, 'getBoundingClientRect').mockReturnValue({
      bottom: 1200,
      height: 600,
      left: 0,
      right: 600,
      top: 600,
      width: 600,
      x: 0,
      y: 600,
      toJSON: () => ({}),
    })

    expect(article).toHaveAttribute('id', 'capability-migration')
    expect(link).toHaveAttribute('href', '#capability-migration')

    fireEvent.click(link)

    expect(scrollTo).toHaveBeenLastCalledWith({
      behavior: 'smooth',
      top: 250,
    })
    expect(heading).toHaveFocus()
    expect(link).toHaveAttribute('aria-current', 'true')
  })

  it('disables and cleans up observation below 768px while keeping one static map per article', () => {
    const media = createMediaEnvironment(false)
    vi.spyOn(window, 'matchMedia').mockImplementation(media.matchMedia)
    const { container, unmount } = render(<CapabilityStage />)
    const articles = screen.getAllByRole('article')

    expect(IntersectionObserverHarness.instances).toHaveLength(0)

    articles.forEach((article, index) => {
      const capability = capabilities[index]
      const snapshot = article.querySelector('svg')
      const highlighted = Array.from(
        article.querySelectorAll<SVGGElement>('g[data-highlighted="true"]'),
      ).map((stage) => stage.dataset.stageId as LifecycleStageId)

      expect(snapshot).toHaveAttribute('data-render-mode', capability.renderMode)
      expect(highlighted).toEqual(capability.stageIds)
    })

    expect(declarationsFor('.capabilitySharedVisual')).toMatchObject({
      position: 'sticky',
    })
    expect(
      declarationsFor('.capabilitySharedVisual', MOBILE_MEDIA_QUERY),
    ).toMatchObject({
      display: 'none',
      position: 'static',
    })
    expect(
      declarationsFor('.capabilityArticleNetwork', MOBILE_MEDIA_QUERY),
    ).toMatchObject({
      display: 'block',
      position: 'relative',
    })

    act(() => {
      media.setDesktop(true)
    })
    const observer = IntersectionObserverHarness.instances[0]
    expect(observer).toBeDefined()

    act(() => {
      media.setDesktop(false)
    })
    expect(observer.disconnect).toHaveBeenCalledTimes(1)

    unmount()
    expect(observer.disconnect).toHaveBeenCalled()
    expect(container.querySelectorAll('article')).toHaveLength(0)
  })
})
