import { describe, expect, it } from 'vitest'

const componentSources = import.meta.glob('./{GhostFestivalZhLab,YuelaoLoveZhLab}.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

describe('華語實驗室回饋隨目前語系導出', () => {
  it('以供品 ID 重新導出禁忌提示，不把已本地化字串當作狀態', () => {
    const source = componentSources['./GhostFestivalZhLab.tsx']
    expect(source).toContain(
      'const [tabooOfferingId, setTabooOfferingId] = useState<string | null>(null)',
    )
    expect(source).toContain('formatGhostFestivalTabooAlert(tabooOfferingId, locale)')
    expect(source).toContain('setTabooOfferingId(item.id)')
    expect(source).not.toContain('setTabooAlert(locale')
  })

  it('以穩定擲筊結果碼重新導出目前語系文字', () => {
    const source = componentSources['./YuelaoLoveZhLab.tsx']
    expect(source).toContain(
      "const [jiaobeiResult, setJiaobeiResult] = useState<'affirmative' | null>(null)",
    )
    expect(source).toContain('formatAffirmativeJiaobeiResult(locale)')
    expect(source).toContain("setJiaobeiResult('affirmative')")
    expect(source).not.toContain('setJiaobeiResult(locale')
  })
})
