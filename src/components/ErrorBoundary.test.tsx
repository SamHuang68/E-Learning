import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

describe('error recovery landmarks', () => {
  it('preserves a main landmark and an announced recovery message for a failed route', () => {
    const boundary = new ErrorBoundary({ children: null, asMain: true })
    boundary.state = { error: new Error('Failed to fetch dynamically imported module'), locale: 'en' }
    const html = renderToStaticMarkup(boundary.render())
    expect(html).toContain('<main class="error-boundary"><div role="alert">')
    expect(html).toContain('Load the latest version')
    expect(html).toContain('href="#hub"')
  })

  it('does not nest main landmarks when an inline exercise fails', () => {
    const boundary = new ErrorBoundary({ children: null })
    boundary.state = { error: new Error('Exercise unavailable'), locale: 'en' }
    const html = renderToStaticMarkup(<main>{boundary.render()}</main>)
    expect(html.match(/<main[ >]/g)).toHaveLength(1)
    expect(html).toContain('<div class="error-boundary"><div role="alert">')
  })
})
