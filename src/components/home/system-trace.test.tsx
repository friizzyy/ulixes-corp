import { readFileSync } from 'node:fs'
import path from 'node:path'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { parse, type AtRule, type Rule } from 'postcss'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { lifecycleStages } from '@/lib/homepage-content'
import { SignalNetwork } from './signal-network'
import { SystemTrace } from './system-trace'

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

afterEach(() => {
  vi.restoreAllMocks()
})

function renderTrace() {
  return render(createElement(SystemTrace))
}

function tabs() {
  return screen.getAllByRole('tab')
}

describe('SystemTrace', () => {
  it('starts with Capture and enrich as the one committed lifecycle stage', () => {
    renderTrace()

    const firstTab = screen.getByRole('tab', { name: 'Capture and enrich' })
    const panel = () => screen.getByRole('tabpanel')

    expect(firstTab).toHaveAttribute('aria-selected', 'true')
    expect(firstTab).toHaveAttribute('tabindex', '0')
    expect(panel()).toHaveAttribute('aria-labelledby', firstTab.id)
    expect(panel()).toHaveTextContent(lifecycleStages[0].label)
    expect(panel()).toHaveTextContent(lifecycleStages[0].narrative)
    expect(tabs().filter((tab) => tab.getAttribute('aria-selected') === 'true')).toHaveLength(1)
  })

  it('commits pointer selection while hover remains a noncommitting preview', async () => {
    const user = userEvent.setup()
    const { container } = renderTrace()
    const capture = screen.getByRole('tab', { name: 'Capture and enrich' })
    const risk = screen.getByRole('tab', { name: 'Value and measure risk' })
    const panel = () => screen.getByRole('tabpanel')

    await user.hover(risk)

    expect(risk).toHaveAttribute('data-preview', 'true')
    expect(container.querySelector('[data-stage-id="risk"][data-highlighted="true"]')).toBeInTheDocument()
    expect(container.querySelector('circle[data-stage-id="risk"]')).toHaveAttribute(
      'data-highlighted',
      'true',
    )
    expect(
      container.querySelector('path[data-stage-id="risk"]'),
    ).not.toHaveAttribute('data-highlighted')
    expect(container.querySelector('path[data-stage-id="capture"]')).toHaveAttribute(
      'data-highlighted',
      'true',
    )
    expect(panel()).toHaveTextContent(lifecycleStages[0].narrative)

    await user.unhover(risk)

    expect(risk).not.toHaveAttribute('data-preview')
    expect(capture).toHaveAttribute('aria-selected', 'true')
    expect(panel()).toHaveTextContent(lifecycleStages[0].narrative)

    await user.click(risk)
    await user.unhover(risk)

    expect(risk).toHaveAttribute('aria-selected', 'true')
    expect(risk).toHaveAttribute('tabindex', '0')
    expect(capture).toHaveAttribute('aria-selected', 'false')
    expect(capture).toHaveAttribute('tabindex', '-1')
    expect(panel()).toHaveTextContent(lifecycleStages[2].narrative)
  })

  it('commits focused stages with Enter and Space', () => {
    renderTrace()
    const stageTabs = tabs()
    const panel = () => screen.getByRole('tabpanel')

    stageTabs[1].focus()
    fireEvent.keyDown(stageTabs[1], { key: 'Enter' })

    expect(stageTabs[1]).toHaveAttribute('aria-selected', 'true')
    expect(panel()).toHaveTextContent(lifecycleStages[1].narrative)

    stageTabs[4].focus()
    fireEvent.keyDown(stageTabs[4], { key: ' ' })

    expect(stageTabs[4]).toHaveAttribute('aria-selected', 'true')
    expect(panel()).toHaveTextContent(lifecycleStages[4].narrative)
  })

  it('moves and commits with horizontal or vertical arrows and wraps at both ends', () => {
    renderTrace()
    const stageTabs = tabs()

    fireEvent.keyDown(stageTabs[0], { key: 'ArrowRight' })
    expect(stageTabs[1]).toHaveFocus()
    expect(stageTabs[1]).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(stageTabs[1], { key: 'ArrowDown' })
    expect(stageTabs[2]).toHaveFocus()
    expect(stageTabs[2]).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(stageTabs[2], { key: 'ArrowLeft' })
    expect(stageTabs[1]).toHaveFocus()
    expect(stageTabs[1]).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(stageTabs[1], { key: 'ArrowUp' })
    expect(stageTabs[0]).toHaveFocus()
    expect(stageTabs[0]).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(stageTabs[0], { key: 'ArrowLeft' })
    expect(stageTabs[5]).toHaveFocus()
    expect(stageTabs[5]).toHaveAttribute('aria-selected', 'true')

    fireEvent.keyDown(stageTabs[5], { key: 'ArrowRight' })
    expect(stageTabs[0]).toHaveFocus()
    expect(stageTabs[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('does not commit on focus alone and maintains a roving tab stop', () => {
    renderTrace()
    const stageTabs = tabs()

    stageTabs[3].focus()

    expect(stageTabs[3]).toHaveFocus()
    expect(stageTabs[3]).toHaveAttribute('aria-selected', 'false')
    expect(stageTabs[3]).toHaveAttribute('tabindex', '-1')
    expect(stageTabs[0]).toHaveAttribute('aria-selected', 'true')
    expect(stageTabs[0]).toHaveAttribute('tabindex', '0')
    expect(stageTabs.filter((tab) => tab.getAttribute('tabindex') === '0')).toHaveLength(1)
  })

  it('publishes all six controls in lifecycle order with one correctly linked panel', () => {
    const { container } = renderTrace()
    const stageTabs = tabs()
    const panel = screen.getByRole('tabpanel')

    expect(
      stageTabs.map((tab) => tab.getAttribute('aria-label') ?? tab.textContent?.trim()),
    ).toEqual(lifecycleStages.map((stage) => stage.label))
    expect(new Set(stageTabs.map((tab) => tab.id)).size).toBe(lifecycleStages.length)
    expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(1)

    for (const tab of stageTabs) {
      expect(tab).toHaveAttribute('aria-controls', panel.id)
    }

    expect(screen.getByRole('tablist')).toHaveAttribute(
      'aria-orientation',
      'horizontal',
    )
  })

  it('announces the vertical mobile orientation and cleans up its media listener', () => {
    expect(renderToStaticMarkup(createElement(SystemTrace))).toContain(
      'aria-orientation="horizontal"',
    )

    let matches = true
    let changeListener: ((event: MediaQueryListEvent) => void) | undefined
    const addEventListener = vi.fn(
      (_type: string, listener: EventListenerOrEventListenerObject) => {
        if (typeof listener === 'function') {
          changeListener = listener as (event: MediaQueryListEvent) => void
        }
      },
    )
    const removeEventListener = vi.fn()

    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      get matches() {
        return query === MOBILE_MEDIA_QUERY && matches
      },
      media: query,
      onchange: null,
      addEventListener,
      removeEventListener,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    }) as MediaQueryList)

    const { unmount } = renderTrace()

    expect(screen.getByRole('tablist')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    )

    matches = false
    act(() => {
      changeListener?.({ matches: false } as MediaQueryListEvent)
    })

    expect(screen.getByRole('tablist')).toHaveAttribute(
      'aria-orientation',
      'horizontal',
    )

    unmount()

    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    expect(removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    )
  })

  it('keeps each mobile route and selected detail in the same expanding stage flow', async () => {
    const user = userEvent.setup()
    const { container } = renderTrace()
    const stageTabs = tabs()
    const mobileRoutes = Array.from(
      container.querySelectorAll('[data-mobile-route-stage]'),
    )
    const mobileNodes = Array.from(
      container.querySelectorAll('[data-mobile-route-node]'),
    )

    expect(mobileRoutes.map((route) => route.getAttribute('data-stage-id'))).toEqual(
      lifecycleStages.map((stage) => stage.id),
    )
    expect(mobileNodes.map((node) => node.getAttribute('data-stage-id'))).toEqual(
      lifecycleStages.map((stage) => stage.id),
    )

    for (let index = 0; index < stageTabs.length; index += 1) {
      const tab = stageTabs[index]
      await user.click(tab)
      const stage = tab.closest('[data-trace-stage]')

      expect(stage).toHaveAttribute('data-trace-stage', lifecycleStages[index].id)
      expect(stage?.querySelector('[data-mobile-route-stage]')).toHaveAttribute(
        'data-stage-id',
        lifecycleStages[index].id,
      )
      expect(stage?.querySelector('[role="tabpanel"]')).toHaveTextContent(
        lifecycleStages[index].narrative,
      )
    }
  })

  it('assigns one desktop lifecycle column per stage and contains mobile expansion width', () => {
    lifecycleStages.forEach((_stage, index) => {
      const selector = `.traceStage:nth-child(${index + 1}) .traceStageButton`
      const declarations = declarationsFor(selector)

      expect(declarations['grid-column']).toBe(String(index + 1))
      expect(declarations['grid-row']).toBe(index % 2 === 0 ? '1' : '2')
    })

    expect(declarationsFor('.traceSystemNetwork', MOBILE_MEDIA_QUERY)).toMatchObject({
      display: 'none',
    })
    expect(declarationsFor('.traceMobileRoute', MOBILE_MEDIA_QUERY)).toMatchObject({
      display: 'block',
      top: '0',
      bottom: '0',
    })
    expect(declarationsFor('.traceTablist', MOBILE_MEDIA_QUERY)).toMatchObject({
      width: '100%',
      'min-width': '0',
    })
    expect(declarationsFor('.traceStage', MOBILE_MEDIA_QUERY)).toMatchObject({
      'min-width': '0',
    })
    expect(declarationsFor('.traceDetail', MOBILE_MEDIA_QUERY)).toMatchObject({
      'max-width': '100%',
      'min-width': '0',
    })
  })

  it('includes every lifecycle narrative in an ordered noscript fallback', () => {
    const markup = renderToStaticMarkup(createElement(SystemTrace))

    expect(markup).toContain('<noscript><ol')
    expect(markup.match(/<li>/g)).toHaveLength(lifecycleStages.length)

    for (const stage of lifecycleStages) {
      expect(markup).toContain(stage.label)
      expect(markup).toContain(stage.narrative.replaceAll("'", '&#x27;'))
    }
  })
})

describe('SignalNetwork', () => {
  it('keeps every visible route segment owned by one named lifecycle stage', () => {
    const { container } = render(
      createElement(SignalNetwork, {
        activeStageId: 'controls',
        renderMode: 'path',
      }),
    )
    const network = container.querySelector('svg')
    const routeSegments = Array.from(network?.querySelectorAll('path') ?? [])
    const namedStages = Array.from(
      network?.querySelectorAll('g[data-stage-name]') ?? [],
    )

    expect(network).toHaveAttribute('aria-hidden', 'true')
    expect(network).toHaveAttribute('focusable', 'false')
    expect(namedStages.map((stage) => stage.getAttribute('data-stage-name'))).toEqual(
      lifecycleStages.map((stage) => stage.label),
    )
    expect(routeSegments).toHaveLength(lifecycleStages.length)
    expect(routeSegments.map((route) => route.getAttribute('data-stage-id'))).toEqual(
      lifecycleStages.map((stage) => stage.id),
    )
  })

  it('separates continuous path, checkpoint, and closing render modes', () => {
    const { container, rerender } = render(
      createElement(SignalNetwork, {
        highlightedStageIds: ['lifecycle', 'controls', 'reporting'],
        renderMode: 'checkpoints',
      }),
    )

    expect(container.querySelector('svg')).toHaveAttribute('data-render-mode', 'checkpoints')
    expect(container.querySelectorAll('path[data-highlighted="true"]')).toHaveLength(0)
    expect(container.querySelectorAll('circle[data-highlighted="true"]')).toHaveLength(3)

    rerender(
      createElement(SignalNetwork, {
        highlightedStageIds: ['lifecycle', 'controls', 'reporting'],
        renderMode: 'path',
      }),
    )

    expect(container.querySelector('svg')).toHaveAttribute('data-render-mode', 'path')
    expect(container.querySelectorAll('path[data-highlighted="true"]')).toHaveLength(3)

    rerender(createElement(SignalNetwork, { renderMode: 'closing' }))

    expect(container.querySelector('svg')).toHaveAttribute('data-render-mode', 'closing')
    expect(container.querySelectorAll('path[data-converges="true"]')).toHaveLength(
      lifecycleStages.length,
    )
  })

  it('scopes mobile vertical geometry away from closing convergence', () => {
    for (const stage of lifecycleStages) {
      const routeSelector = `.signalNetwork:not([data-render-mode='closing']) .signalRoute_${stage.id}`
      const nodeSelector = `.signalNetwork:not([data-render-mode='closing']) .signalNode_${stage.id}`

      expect(declarationsFor(routeSelector, MOBILE_MEDIA_QUERY).d).toMatch(/^path\(/)
      expect(declarationsFor(nodeSelector, MOBILE_MEDIA_QUERY).cx).toBe('72px')
      expect(
        declarationsFor(`.signalRoute_${stage.id}`, MOBILE_MEDIA_QUERY).d,
      ).toBeUndefined()
      expect(
        declarationsFor(`.signalNode_${stage.id}`, MOBILE_MEDIA_QUERY).cx,
      ).toBeUndefined()
    }
  })
})
