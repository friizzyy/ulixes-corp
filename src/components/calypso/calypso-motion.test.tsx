import { act, render, waitFor } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Cascade, CascadeItem, Curtain, Lift, Rule } from './calypso-motion'

function Tree() {
  return (
    <div>
      <Curtain delay={0.1}>
        <p>Headline</p>
      </Curtain>
      <Curtain as="span">
        <span>Inline</span>
      </Curtain>
      <Lift amount={0}>
        <section>Surface</section>
      </Lift>
      <Rule />
      <Cascade label="Items" amount={0}>
        <CascadeItem primary>One</CascadeItem>
        <CascadeItem>Two</CascadeItem>
      </Cascade>
    </div>
  )
}

function stubReducedMotion(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
    matches: matches && query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))
}

describe('Calypso motion vocabulary', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('hydrates the server markup without a mismatch for a reduced-motion reader', async () => {
    /*
     * The old components branched their element tree on framer-motion's
     * useReducedMotion, which is null on the server and true on the first
     * client render for a reduced-motion reader, so React hydrated a plain
     * div over motion wrappers and logged a mismatch. The tree must now be
     * the same in both places.
     */
    const markup = renderToString(<Tree />)
    stubReducedMotion(true)
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const container = document.createElement('div')
    container.innerHTML = markup
    document.body.appendChild(container)

    let root: ReturnType<typeof hydrateRoot> | undefined
    await act(async () => {
      root = hydrateRoot(container, <Tree />)
    })

    expect(errors).not.toHaveBeenCalled()

    await act(async () => {
      root?.unmount()
    })
    container.remove()
  })

  it('renders one element tree whether or not motion is reduced', () => {
    const skeleton = (html: string) => html.replace(/ style="[^"]*"/g, '')

    stubReducedMotion(false)
    const moving = render(<Tree />)
    const movingTree = skeleton(moving.container.innerHTML)
    moving.unmount()

    stubReducedMotion(true)
    const still = render(<Tree />)

    expect(skeleton(still.container.innerHTML)).toBe(movingTree)
    expect(still.getByLabelText('Items').tagName).toBe('UL')
    expect(still.getByText('One').tagName).toBe('LI')
  })

  it('lands every gesture in its visible state, with no transform, under reduced motion', async () => {
    stubReducedMotion(true)
    const { getByText } = render(<Tree />)
    const headline = getByText('Headline').parentElement as HTMLElement
    const surface = getByText('Surface').parentElement as HTMLElement
    const item = getByText('One')

    await waitFor(() => {
      expect(headline.style.transform).toBe('none')
      expect(surface.style.opacity).toBe('1')
      expect(surface.style.transform).toBe('none')
      expect(item.style.opacity).toBe('1')
      expect(item.style.transform).toBe('none')
    })
  })
})
