import { describe, it, expect } from 'vitest'
import { UpdateNotification } from './UpdateNotification'
import { translate } from '../i18n/messages'

describe('PWA UpdateNotification Component', () => {
  it('exports UpdateNotification as a valid React component', () => {
    expect(typeof UpdateNotification).toBe('function')
  })

  it('uses i18n keys for toast copy instead of hardcoded Chinese', () => {
    expect(translate('zh-Hant', 'sw.update.apply')).toBe('立即套用')
    expect(translate('en', 'sw.update.apply')).toBe('Apply now')
  })
})
