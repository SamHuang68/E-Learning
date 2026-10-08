import React from 'react'
import { TOEIC_SOLVING_SIGNALS } from '../data/solvingSignals'
import { playCorrectSound } from '../../engine/audioSynthesizer'
import { exportErrorVaultToAnki } from '../../utils/ankiExporter'
import { useI18n } from '../../i18n/i18n'
import { localizeToeicSignal } from '../teachingCopy'

interface Props {
  errorQuestionIds: string[]
  onRemoveError: (questionId: string) => void
  onEarnXp: (amount: number) => void
  onOpenChunks?: () => void
  onOpenSignals?: () => void
  instructionLang?: 'zh' | 'ja'
}

export const ToeicErrorVault: React.FC<Props> = ({
  errorQuestionIds,
  onRemoveError,
  onEarnXp,
  onOpenChunks,
  onOpenSignals,
  instructionLang = 'zh',
}) => {
  const { locale } = useI18n()
  const isEn = locale === 'en'
  const isJa = !isEn && instructionLang === 'ja'
  const pick = (copy: { zh: string; ja: string; en: string }) =>
    isEn ? copy.en : isJa ? copy.ja : copy.zh

  // 從 3秒訊號題庫中比對錯題
  const signalErrors = TOEIC_SOLVING_SIGNALS
    .filter((s) => errorQuestionIds.includes(s.id))
    .map((signal) =>
      localizeToeicSignal(signal, locale, isEn ? 'zh' : instructionLang),
    )

  function speakEnglish(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  function handleMaster(id: string) {
    onRemoveError(id)
    onEarnXp(15)
    playCorrectSound()
  }

  function handleExportAnki() {
    exportErrorVaultToAnki(
      'TOEIC',
      signalErrors.map((s) => ({
        id: s.id,
        title: isJa ? s.titleJa : s.title,
        question: `${s.exampleQuestion.question}\nOptions: ${s.exampleQuestion.options.join(' / ')}`,
        solution: `Correct: ${s.exampleQuestion.options[s.exampleQuestion.correctIndex]}\nRule: ${isJa ? s.threeSecondRuleJa : s.threeSecondRule}\nFormula: ${s.formula}\nExplanation: ${isJa ? s.exampleQuestion.explanationJa : s.exampleQuestion.explanationZh}`,
      })),
    )
  }

  return (
    <div className="math-lab toeic-error-vault" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
      {/* 標頭 */}
      <div className="lab-header" style={{ marginBottom: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>📕</span>{' '}
            {pick({
              zh: 'TOEIC 錯題弱點筆記本 (Error Vault)',
              ja: 'TOEIC 誤答ノート・弱点分析',
              en: 'TOEIC Error Vault and Blind-Spot Review',
            })}
          </h3>
          <p className="lab-desc" style={{ margin: 0, fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.4 }}>
            {pick({
              zh: '自動彙整模擬測驗與秒殺演練答錯之試題，提供中日英雙語解析與 Anki 一鍵匯出！',
              ja: '模試や演習で間違えたPart 5/6問題を自動集約。3秒解答ルールと公式で弱点を克服！',
              en: 'Collects missed Part 5 and Part 6 practice items with three-second rules, formulas, explanations, and Anki export.',
            })}
          </p>
        </div>

        {signalErrors.length > 0 && (
          <button
            type="button"
            className="pill-btn"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}
            onClick={handleExportAnki}
          >
            📥 {pick({ zh: '一鍵匯出 Anki 閃卡', ja: 'Ankiカードへエクスポート', en: 'Export Anki cards' })}
          </button>
        )}
      </div>

      {signalErrors.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--line)' }}>
          <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🎉</span>
          <h4 style={{ margin: '0 0 0.3rem', fontSize: '1.1rem' }}>
            {pick({
              zh: '太棒了！目前沒有任何多益錯題',
              ja: '現在、誤答として登録されている問題はありません',
              en: 'No open TOEIC error items',
            })}
          </h4>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)' }}>
            {pick({
              zh: '前往「3秒秒殺訊號卡」或「模擬測驗」檢驗實力，系統會自動收錄答錯題目。',
              ja: '「3秒解答シグナル」や「模擬試験」で実力を試し、間違えた問題はここに自動保存されます。',
              en: 'Try the three-second signal cards or a mock exam. Missed items are saved here automatically.',
            })}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
            {onOpenSignals && (
              <button type="button" className="btn-primary" onClick={onOpenSignals}>
                🎯 {pick({ zh: '前往 3 秒秒殺訊號卡', ja: '3秒解答シグナルへ', en: 'Open three-second signal cards' })}
              </button>
            )}
            {onOpenChunks && (
              <button type="button" className="pill-btn" onClick={onOpenChunks}>
                ⚡ {pick({ zh: '前往商務語塊庫', ja: 'ビジネスチャンクへ', en: 'Open business chunks' })}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {signalErrors.map((sig, idx) => (
            <div
              key={sig.id}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                borderRadius: '12px',
                padding: '1rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 700 }}>
                    {pick({ zh: `錯題 #${idx + 1}`, ja: `弱点 #${idx + 1}`, en: `Item #${idx + 1}` })}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>
                    {isJa ? sig.titleJa : sig.title}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button
                    type="button"
                    className="pill-btn"
                    style={{ fontSize: '0.72rem', padding: '0.15rem 0.45rem' }}
                    onClick={() => speakEnglish(sig.exampleQuestion.question)}
                  >
                    🔊 {pick({ zh: '聽朗讀', ja: '音声を聞く', en: 'Play sentence' })}
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ fontSize: '0.72rem', padding: '0.15rem 0.55rem', background: '#10b981' }}
                    onClick={() => handleMaster(sig.id)}
                  >
                    ✓ {pick({ zh: '我已掌握 (+15 XP)', ja: 'マスター済 (+15 XP)', en: 'I know this (+15 XP)' })}
                  </button>
                </div>
              </div>

              <h4 style={{ margin: '0.3rem 0 0.4rem', fontSize: '0.92rem', lineHeight: 1.4 }}>
                {sig.exampleQuestion.question}
              </h4>

              <div style={{ background: 'var(--surface-soft)', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--line)', fontSize: '0.76rem', color: 'var(--muted)' }}>
                <div>
                  {pick({ zh: '正確答案：', ja: '正解：', en: 'Correct answer: ' })}
                  <strong style={{ color: '#10b981' }}>{sig.exampleQuestion.options[sig.exampleQuestion.correctIndex]}</strong>
                </div>
                <div style={{ marginTop: '0.25rem', color: '#38bdf8' }}>
                  ⚡ <strong>{pick({ zh: '3秒秒殺口訣：', ja: '3秒瞬殺ルール：', en: 'Three-second rule: ' })}</strong>
                  {isJa ? sig.threeSecondRuleJa : sig.threeSecondRule}
                </div>
                <div style={{ marginTop: '0.2rem', fontFamily: 'monospace', color: '#10b981' }}>
                  {pick({ zh: '公式：', ja: '公式：', en: 'Formula: ' })}{sig.formula}
                </div>
                <div style={{ marginTop: '0.25rem', color: 'var(--muted)' }}>
                  💡 {isJa ? sig.exampleQuestion.explanationJa : sig.exampleQuestion.explanationZh}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
