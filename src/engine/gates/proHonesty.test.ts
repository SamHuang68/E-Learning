import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

describe('Pro copy honesty', () => {
  it('does not claim a paid upgrade; labels the local demo gate', () => {
    const gate = readFileSync(join(process.cwd(), 'src/components/ProGate.tsx'), 'utf8')
    expect(gate).toContain("t('pro.title')")
    expect(gate).not.toContain('此單元屬於 Pro 練習')
    expect(gate).not.toContain('解鎖 Demo')

    const aoba = readFileSync(join(process.cwd(), 'src/aoba/AobaApp.tsx'), 'utf8')
    const toeic = readFileSync(join(process.cwd(), 'src/toeic/ToeicApp.tsx'), 'utf8')
    expect(aoba).toContain("t('pro.badgeOn')")
    expect(toeic).toContain("t('pro.badgeOff')")
    expect(aoba).not.toContain("' · Pro'")
    expect(toeic).not.toContain("' · Free'")

    const messages = readFileSync(join(process.cwd(), 'src/i18n/messages.ts'), 'utf8')
    expect(messages).toContain('沒有付費升級')
    expect(messages).toContain('There is no paid upgrade')
    expect(messages).toContain("'pro.body'")

    const engine = readFileSync(join(process.cwd(), 'src/engine/entitlement.ts'), 'utf8')
    expect(engine).toMatch(/Not a paid product/)
  })
})
