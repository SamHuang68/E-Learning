import { describe, expect, it } from 'vitest'

const sources = import.meta.glob([
  '../chinese/components/ChineseErrorVault.tsx',
  '../chinese/components/TransitLab.tsx',
  '../cs/components/CsErrorVault.tsx',
  '../toeic/components/ToeicBuilder.tsx',
], {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

describe('暫態公告依目前語系重新導出', () => {
  it.each([
    ['../chinese/components/ChineseErrorVault.tsx', 'copy.removed(removalRemainingCount)'],
    ['../cs/components/CsErrorVault.tsx', '${removalRemainingCount} remaining.'],
  ])('%s 只保存移除後剩餘題數', (path, formatterEvidence) => {
    const source = sources[path]
    expect(source).toContain(
      'const [removalRemainingCount, setRemovalRemainingCount] = useState<number | null>(null)',
    )
    expect(source).toContain('setRemovalRemainingCount(')
    expect(source).toContain(formatterEvidence)
    expect(source).not.toContain('setRemovalMessage(')
  })

  it('悠遊卡成功公告只保存加值金額並保留 3.5 秒計時', () => {
    const source = sources['../chinese/components/TransitLab.tsx']
    expect(source).toContain(
      'const [lastChargeAmount, setLastChargeAmount] = useState<number | null>(null)',
    )
    expect(source).toContain('setLastChargeAmount(amount)')
    expect(source).toContain('setTimeout(() => setLastChargeAmount(null), 3500)')
    expect(source).toContain("locale === 'en'")
    expect(source).not.toContain('setChargeSuccessMsg(')
  })

  it('TOEIC Builder 只保存狀態碼及必要資料，顯示時才格式化', () => {
    const source = sources['../toeic/components/ToeicBuilder.tsx']
    expect(source).toContain('useState<ToeicBuilderStatus>(null)')
    expect(source).toContain('formatToeicBuilderStatus(status, locale)')
    expect(source).toContain("setStatus({ code: 'prompt-generated' })")
    expect(source).toContain("setStatus({ code: 'prompt-updated-and-copied' })")
    expect(source).toContain("setStatus({ code: 'preset-saved', presetName: name })")
    expect(source).toContain("setStatus({ code: 'template-applied', templateId: t.id })")
    expect(source).not.toContain("setStatus(copy('")
  })
})
