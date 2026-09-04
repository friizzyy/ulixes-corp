import '@testing-library/jest-dom/vitest'

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = []

  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {}

  observe = () => {}
  unobserve = () => {}
  disconnect = () => {}
  takeRecords = () => []
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
})

/* Route handlers run under the node environment, where there is no window;
   the browser stubs below apply only where one exists. */
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query === '(min-width: 768px)',
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: IntersectionObserverMock,
  })

  Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: () => {},
  })

  Object.defineProperties(HTMLMediaElement.prototype, {
    play: {
      configurable: true,
      value: () => Promise.resolve(),
    },
    pause: {
      configurable: true,
      value: () => {},
    },
    load: {
      configurable: true,
      value: () => {},
    },
  })
}
