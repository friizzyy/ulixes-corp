import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/font/local', () => ({
  default: () => ({ variable: 'mock-font-variable' }),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('@/components/ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/components/ui')>()

  return {
    ...actual,
    ErrorBoundary: ({ children }: { children: React.ReactNode }) => children,
  }
})

vi.mock('agentation', () => ({ Agentation: () => null }))

describe('RootLayout ambient motion', () => {
  it('does not mount a global canvas ornament outside page content', async () => {
    const { default: RootLayout } = await import('./layout')
    const markup = renderToStaticMarkup(
      createElement(RootLayout, null, createElement('p', null, 'Page content')),
    )
    const document = new DOMParser().parseFromString(markup, 'text/html')

    expect(document.querySelector('canvas')).toBeNull()
    expect(document.querySelector('video')).toBeNull()
    expect(document.querySelector('main')?.textContent).toContain('Page content')
  })
})
