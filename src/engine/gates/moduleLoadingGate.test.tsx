import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { LocaleProvider } from '../../i18n/LocaleComponents'
import { AuthProvider } from '../../auth/AuthProvider'

describe('All Track Modules Import & SSR Gate', { timeout: 60000 }, () => {
  it('imports and renders AobaApp without error', async () => {
    const { AobaApp } = await import('../../aoba/AobaApp')
    const html = renderToString(
      <AuthProvider>
        <LocaleProvider>
          <AobaApp onBackHub={() => {}} onSwitchLang={() => {}} />
        </LocaleProvider>
      </AuthProvider>
    )
    expect(html.length).toBeGreaterThan(0)
  }, 60000)

  it('imports and renders ToeicApp without error', async () => {
    const { ToeicApp } = await import('../../toeic/ToeicApp')
    const html = renderToString(
      <AuthProvider>
        <LocaleProvider>
          <ToeicApp onBackHub={() => {}} onSwitchLang={() => {}} />
        </LocaleProvider>
      </AuthProvider>
    )
    expect(html.length).toBeGreaterThan(0)
  }, 60000)

  it('imports and renders MathApp without error', async () => {
    const { MathApp } = await import('../../math/MathApp')
    const html = renderToString(
      <LocaleProvider>
        <MathApp onBackHub={() => {}} onSwitchLang={() => {}} />
      </LocaleProvider>
    )
    expect(html.length).toBeGreaterThan(0)
  }, 60000)

  it('imports and renders CalculusApp without error', async () => {
    const { CalculusApp } = await import('../../calculus/CalculusApp')
    const html = renderToString(
      <LocaleProvider>
        <CalculusApp onBackHub={() => {}} onSwitchLang={() => {}} />
      </LocaleProvider>
    )
    expect(html.length).toBeGreaterThan(0)
  }, 60000)

  it('imports and renders PhysicsApp without error', async () => {
    const { PhysicsApp } = await import('../../physics/PhysicsApp')
    const html = renderToString(
      <LocaleProvider>
        <PhysicsApp onBackHub={() => {}} onSwitchLang={() => {}} />
      </LocaleProvider>
    )
    expect(html.length).toBeGreaterThan(0)
  }, 60000)

  it('imports and renders ChemistryApp without error', async () => {
    const { ChemistryApp } = await import('../../chemistry/ChemistryApp')
    const html = renderToString(
      <LocaleProvider>
        <ChemistryApp onBackHub={() => {}} onSwitchLang={() => {}} />
      </LocaleProvider>
    )
    expect(html.length).toBeGreaterThan(0)
  }, 60000)

  it('imports and renders CsApp without error', async () => {
    const { CsApp } = await import('../../cs/CsApp')
    const html = renderToString(
      <LocaleProvider>
        <CsApp onBackHub={() => {}} onSwitchLang={() => {}} />
      </LocaleProvider>
    )
    expect(html.length).toBeGreaterThan(0)
  }, 60000)

  it('imports and renders ChineseApp without error', async () => {
    const { ChineseApp } = await import('../../chinese/ChineseApp')
    const html = renderToString(
      <LocaleProvider>
        <ChineseApp onBackHub={() => {}} onSwitchLang={() => {}} />
      </LocaleProvider>
    )
    expect(html.length).toBeGreaterThan(0)
  }, 60000)
})
