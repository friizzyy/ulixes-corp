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
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const INSTANT_FOCUS_DELAY_MS = 1
const SMOOTH_FOCUS_SAFETY_MS = 2000
const originalScrollEndDescriptor = Object.getOwnPropertyDescriptor(
  window,
  'onscrollend',
)
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

function createMediaEnvironment(
  initialDesktop: boolean,
  initialReducedMotion = false,
) {
  let desktop = initialDesktop
  let reducedMotion = initialReducedMotion
  const listeners = new Map<string, Set<MediaListener>>()

  const matchMedia = vi.fn((query: string) => {
    const queryListeners = listeners.get(query) ?? new Set<MediaListener>()
    listeners.set(query, queryListeners)

    return {
      get matches() {
        if (query === DESKTOP_MEDIA_QUERY) return desktop
        if (query === MOBILE_MEDIA_QUERY) return !desktop
        if (query === REDUCED_MOTION_QUERY) return reducedMotion
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
    setReducedMotion(nextReducedMotion: boolean) {
      reducedMotion = nextReducedMotion
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
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  if (originalScrollEndDescriptor) {
    Object.defineProperty(window, 'onscrollend', originalScrollEndDescriptor)
  } else {
    Reflect.deleteProperty(window, 'onscrollend')
  }
  window.history.replaceState(null, '', '/')
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
    const implementationPath = container.querySelector<SVGPathElement>(
      '[data-capability-shared-network] path[data-stage-id="capture"]',
    )

    expect(implementationPath).toHaveAttribute('data-highlighted', 'true')
    expect(
      getComputedStyle(implementationPath as SVGPathElement).stroke,
    ).not.toBe('rgba(138, 141, 150, 0.42)')
    expect(
      declarationsFor(
        ".capabilityStage .signalRoute:not([data-highlighted='true'])",
      ).stroke,
    ).toBe('rgba(138, 141, 150, 0.42)')
    expect(
      declarationsFor(
        ".capabilityStage .signalRoute[data-highlighted='true']",
      ).stroke,
    ).toBe('currentColor')

    act(() => {
      observer.cross(screen.getByRole('heading', { name: 'Platform migration' }))
    })

    expect(highlightedStageIds(container)).toEqual([
      'capture',
      'lifecycle',
      'settlement',
      'reporting',
    ])
    const inactiveMigrationPath = container.querySelector<SVGPathElement>(
      '[data-capability-shared-network] path[data-stage-id="risk"]',
    )
    expect(inactiveMigrationPath).not.toHaveAttribute('data-highlighted')
    expect(getComputedStyle(inactiveMigrationPath as SVGPathElement).stroke).toBe(
      'rgba(138, 141, 150, 0.42)',
    )

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
    expect(
      getComputedStyle(
        container.querySelector(
          '[data-capability-shared-network] path[data-stage-id="capture"]',
        ) as SVGPathElement,
      ).stroke,
    ).toBe('rgba(138, 141, 150, 0.42)')

    for (const capability of capabilities) {
      expect(screen.getByText(capability.description)).toBeVisible()
    }
  })

  it('activates and aligns a focused heading link while preserving link focus', () => {
    const media = createMediaEnvironment(true)
    vi.spyOn(window, 'matchMedia').mockImplementation(media.matchMedia)
    const { container } = render(<CapabilityStage />)

    const article = screen
      .getByRole('heading', { name: 'Platform migration' })
      .closest('article')
    const heading = within(article as HTMLElement).getByRole('heading', {
      name: 'Platform migration',
    })
    const link = within(heading).getByRole('link', {
      name: 'Platform migration',
    })
    heading.scrollIntoView = vi.fn()
    expect(link).toHaveAttribute('href', `#${heading.id}`)
    expect(article).toHaveAttribute('aria-labelledby', heading.id)
    expect(heading).toHaveAttribute('data-capability-heading', 'migration')
    expect(declarationsFor('.capabilityArticleTitle')['scroll-margin-top']).toBe(
      '45vh',
    )
    expect(declarationsFor('.capabilityArticle')['scroll-margin-top']).toBeUndefined()

    act(() => {
      link.focus()
    })

    expect(link).toHaveFocus()
    expect(link).toHaveAttribute('aria-current', 'true')
    expect(highlightedStageIds(container)).toEqual(capabilities[1].stageIds)
    expect(heading.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
    expect(window.location.hash).toBe('')

    media.setReducedMotion(true)
    const complianceHeading = screen.getByRole('heading', {
      name: 'AI-assisted compliance',
    })
    const complianceLink = within(complianceHeading).getByRole('link', {
      name: 'AI-assisted compliance',
    })
    complianceHeading.scrollIntoView = vi.fn()

    act(() => {
      complianceLink.focus()
    })

    expect(complianceLink).toHaveFocus()
    expect(complianceLink).toHaveAttribute('aria-current', 'true')
    expect(highlightedStageIds(container)).toEqual(capabilities[2].stageIds)
    expect(complianceHeading.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'auto',
      block: 'start',
    })
  })

  it('deduplicates pointer focus before native click navigation', () => {
    vi.useFakeTimers()
    const media = createMediaEnvironment(true)
    vi.spyOn(window, 'matchMedia').mockImplementation(media.matchMedia)
    Object.defineProperty(window, 'onscrollend', {
      configurable: true,
      value: null,
    })
    const addEventListener = vi.spyOn(window, 'addEventListener')
    const setTimeout = vi.spyOn(window, 'setTimeout')
    render(<CapabilityStage />)
    const heading = screen.getByRole('heading', { name: 'Platform migration' })
    const link = within(heading).getByRole('link', {
      name: 'Platform migration',
    })
    heading.scrollIntoView = vi.fn()
    let defaultPrevented = true
    document.addEventListener(
      'click',
      (event) => {
        defaultPrevented = event.defaultPrevented
      },
      { once: true },
    )

    fireEvent.pointerDown(link)
    link.focus()
    fireEvent.pointerUp(link)

    expect(link).toHaveFocus()
    expect(heading.scrollIntoView).not.toHaveBeenCalled()
    expect(link).not.toHaveAttribute('aria-current')

    act(() => {
      link.click()
    })
    vi.advanceTimersByTime(0)

    expect(defaultPrevented).toBe(false)
    expect(window.location.hash).toBe(`#${heading.id}`)
    expect(link).toHaveAttribute('aria-current', 'true')
    expect(heading.scrollIntoView).not.toHaveBeenCalled()
    expect(
      addEventListener.mock.calls.filter(([type]) => type === 'scrollend'),
    ).toHaveLength(1)
    expect(
      setTimeout.mock.calls.filter(([, delay]) =>
        delay === SMOOTH_FOCUS_SAFETY_MS
      ),
    ).toHaveLength(1)

    window.dispatchEvent(new Event('scrollend'))
    expect(heading).toHaveFocus()
  })

  it('clears pointer modality after outside release and on unmount', () => {
    const media = createMediaEnvironment(true)
    vi.spyOn(window, 'matchMedia').mockImplementation(media.matchMedia)
    const addEventListener = vi.spyOn(window, 'addEventListener')
    const removeEventListener = vi.spyOn(window, 'removeEventListener')
    const { container, unmount } = render(<CapabilityStage />)
    const migrationHeading = screen.getByRole('heading', {
      name: 'Platform migration',
    })
    const migrationLink = within(migrationHeading).getByRole('link', {
      name: 'Platform migration',
    })
    const complianceHeading = screen.getByRole('heading', {
      name: 'AI-assisted compliance',
    })
    const complianceLink = within(complianceHeading).getByRole('link', {
      name: 'AI-assisted compliance',
    })
    const migrationScrollIntoView = vi.fn()
    migrationHeading.scrollIntoView = migrationScrollIntoView
    complianceHeading.scrollIntoView = vi.fn()

    act(() => {
      migrationLink.focus()
    })
    expect(migrationLink).toHaveAttribute('aria-current', 'true')

    fireEvent.pointerDown(migrationLink)

    expect(addEventListener).toHaveBeenCalledWith(
      'pointerup',
      expect.any(Function),
      { once: true },
    )
    expect(addEventListener).toHaveBeenCalledWith(
      'pointercancel',
      expect.any(Function),
      { once: true },
    )

    fireEvent.pointerUp(window)

    expect(removeEventListener).toHaveBeenCalledWith(
      'pointerup',
      expect.any(Function),
    )
    expect(removeEventListener).toHaveBeenCalledWith(
      'pointercancel',
      expect.any(Function),
    )

    act(() => {
      complianceLink.focus()
    })
    migrationScrollIntoView.mockClear()

    act(() => {
      migrationLink.focus()
    })

    expect(migrationLink).toHaveFocus()
    expect(migrationLink).toHaveAttribute('aria-current', 'true')
    expect(highlightedStageIds(container)).toEqual(capabilities[1].stageIds)
    expect(migrationHeading.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })

    fireEvent.pointerDown(migrationLink)
    unmount()

    expect(
      removeEventListener.mock.calls.filter(([type]) => type === 'pointerup'),
    ).toHaveLength(2)
    expect(
      removeEventListener.mock.calls.filter(
        ([type]) => type === 'pointercancel',
      ),
    ).toHaveLength(2)
  })

  it('retains native hash navigation and focuses after smooth scrollend', () => {
    vi.useFakeTimers()
    const media = createMediaEnvironment(true)
    vi.spyOn(window, 'matchMedia').mockImplementation(media.matchMedia)
    Object.defineProperty(window, 'onscrollend', {
      configurable: true,
      value: null,
    })
    const removeEventListener = vi.spyOn(window, 'removeEventListener')
    const clearTimeout = vi.spyOn(window, 'clearTimeout')
    const setTimeout = vi.spyOn(window, 'setTimeout')
    render(<CapabilityStage />)
    const heading = screen.getByRole('heading', { name: 'Platform migration' })
    const link = within(heading).getByRole('link', {
      name: 'Platform migration',
    })
    let defaultPrevented = true
    document.addEventListener(
      'click',
      (event) => {
        defaultPrevented = event.defaultPrevented
      },
      { once: true },
    )

    act(() => {
      link.click()
    })
    vi.advanceTimersByTime(0)

    expect(defaultPrevented).toBe(false)
    expect(window.location.hash).toBe(`#${heading.id}`)
    expect(heading).not.toHaveFocus()
    expect(link).toHaveAttribute('aria-current', 'true')
    const fallbackIndex = setTimeout.mock.calls.findIndex(
      ([, delay]) => delay === SMOOTH_FOCUS_SAFETY_MS,
    )
    const fallbackId = setTimeout.mock.results[fallbackIndex]?.value

    expect(fallbackIndex).toBeGreaterThanOrEqual(0)
    vi.advanceTimersByTime(SMOOTH_FOCUS_SAFETY_MS - 1)
    expect(heading).not.toHaveFocus()

    window.dispatchEvent(new Event('scrollend'))

    expect(heading).toHaveFocus()
    expect(clearTimeout).toHaveBeenCalledWith(fallbackId)
    expect(removeEventListener).toHaveBeenCalledWith(
      'scrollend',
      expect.any(Function),
    )
  })

  it('focuses after the instant native fragment task with reduced motion', () => {
    vi.useFakeTimers()
    const media = createMediaEnvironment(true, true)
    vi.spyOn(window, 'matchMedia').mockImplementation(media.matchMedia)
    render(<CapabilityStage />)
    const heading = screen.getByRole('heading', { name: 'Platform migration' })
    const link = within(heading).getByRole('link', {
      name: 'Platform migration',
    })

    act(() => {
      link.click()
    })
    vi.advanceTimersByTime(0)

    expect(window.location.hash).toBe(`#${heading.id}`)
    expect(heading).not.toHaveFocus()

    vi.advanceTimersByTime(INSTANT_FOCUS_DELAY_MS)

    expect(heading).toHaveFocus()
  })

  it('cleans pending heading focus work on unmount', () => {
    vi.useFakeTimers()
    const media = createMediaEnvironment(true)
    vi.spyOn(window, 'matchMedia').mockImplementation(media.matchMedia)
    Object.defineProperty(window, 'onscrollend', {
      configurable: true,
      value: null,
    })
    const removeEventListener = vi.spyOn(window, 'removeEventListener')
    const clearTimeout = vi.spyOn(window, 'clearTimeout')
    const setTimeout = vi.spyOn(window, 'setTimeout')
    const { unmount } = render(<CapabilityStage />)
    const heading = screen.getByRole('heading', { name: 'Platform migration' })
    const link = within(heading).getByRole('link', {
      name: 'Platform migration',
    })

    act(() => {
      link.click()
    })
    vi.advanceTimersByTime(0)
    const fallbackIndex = setTimeout.mock.calls.findIndex(
      ([, delay]) => delay === SMOOTH_FOCUS_SAFETY_MS,
    )
    const fallbackId = setTimeout.mock.results[fallbackIndex]?.value

    unmount()
    window.dispatchEvent(new Event('scrollend'))
    vi.advanceTimersByTime(SMOOTH_FOCUS_SAFETY_MS)

    expect(heading).not.toHaveFocus()
    expect(clearTimeout).toHaveBeenCalledWith(fallbackId)
    expect(removeEventListener).toHaveBeenCalledWith(
      'scrollend',
      expect.any(Function),
    )
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
      expect(snapshot).toHaveAttribute('data-orientation', 'vertical')
      expect(snapshot).toHaveAttribute('viewBox', '0 0 144 640')
      expect(snapshot).toHaveAttribute('preserveAspectRatio', 'xMidYMid meet')
      expect(highlighted).toEqual(capability.stageIds)

      const paths = Array.from(snapshot?.querySelectorAll('path') ?? [])
      const nodes = Array.from(snapshot?.querySelectorAll('circle') ?? [])
      expect(paths.every((route) => route.getAttribute('d')?.includes('72'))).toBe(
        true,
      )
      expect(nodes.every((node) => node.getAttribute('cx') === '72')).toBe(true)
      expect(nodes.every((node) => node.getAttribute('r') === '8')).toBe(true)
    })

    const testingArticle = articles[3]
    expect(
      testingArticle.querySelectorAll('path[data-highlighted="true"]'),
    ).toHaveLength(0)
    expect(
      testingArticle.querySelectorAll('circle[data-highlighted="true"]'),
    ).toHaveLength(6)

    const mobileNetwork = declarationsFor(
      '.capabilityArticleNetwork',
      MOBILE_MEDIA_QUERY,
    )
    const renderedNodeWidth =
      (Number(mobileNetwork.width.replace('px', '')) / 144) * 16
    const renderedNodeHeight =
      (Number(mobileNetwork.height.replace('px', '')) / 640) * 16

    expect(renderedNodeWidth).toBeGreaterThanOrEqual(5.5)
    expect(Math.abs(renderedNodeWidth - renderedNodeHeight)).toBeLessThan(0.2)

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
