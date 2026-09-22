import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Hub snapshot landmarks and skip-link target', () => {
  it('Hub main is the skip-link target and keeps banner/nav/contentinfo', () => {
    const hub = readFileSync(join(process.cwd(), 'src/Hub.tsx'), 'utf8')
    const app = readFileSync(join(process.cwd(), 'src/App.tsx'), 'utf8')
    const privacy = readFileSync(join(process.cwd(), 'src/components/PrivacyPage.tsx'), 'utf8')

    expect(app).toContain('className="skip-link"')
    expect(app).toContain('href="#main-content"')
    expect(hub).toContain('id="main-content"')
    expect(hub).toContain("role=\"banner\"")
    expect(hub).toContain("role=\"navigation\"")
    expect(hub).toContain("role=\"complementary\"")
    expect(hub).toContain("role=\"contentinfo\"")
    expect(hub).toContain("aria-label={t('hub.landmark.main')}")
    expect(hub).toContain('id="tracks-title"')
    expect(privacy).toContain('id="main-content"')
  })
})
