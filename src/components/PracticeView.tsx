import type { Unit } from '../data/course'

type Props = {
  kind: 'vocab' | 'grammar' | 'reading'
  unit: Unit
  onBack: () => void
  onProgress: () => void
}

const copy = {
  vocab: {
    eyebrow: 'VOCABULARY',
    title: '核心單字',
    action: '標記熟練 +1',
  },
  reading: {
    eyebrow: 'READING',
    title: '閱讀練習',
    action: '完成本題',
  },
  grammar: {
    eyebrow: 'GRAMMAR',
    title: '文法教室',
    action: '開始練習',
  },
}

export function PracticeView({ kind, unit, onBack, onProgress }: Props) {
  const meta = copy[kind]

  return (
    <section className="practice-view">
      <button type="button" className="ghost back" onClick={onBack}>
        ← 返回今日學習
      </button>
      <p className="eyebrow">{meta.eyebrow}</p>
      <h1>
        {meta.title}
        <span>Unit {unit.id}</span>
      </h1>
      <p className="lede">
        {kind === 'grammar'
          ? `本課重點：${unit.grammar}`
          : `圍繞「${unit.titleJa}」建立可輸出的日語基礎。`}
      </p>

      <div className="practice-card">
        <div className="flash-face">
          {kind === 'vocab' && (
            <>
              <strong>家族</strong>
              <span>かぞく · family</span>
              <p>わたしの家族は四人です。</p>
            </>
          )}
          {kind === 'reading' && (
            <>
              <strong>{unit.titleJa}</strong>
              <p>
                こんにちは。わたしはアオバです。台湾から来ました。日本の旅行が好きです。今日は家族について話します。
              </p>
              <span>問：アオバさんはどこから来ましたか？</span>
            </>
          )}
          {kind === 'grammar' && (
            <>
              <strong>{unit.grammar}</strong>
              <p>把句子改成丁寧形，並大聲跟讀兩次。</p>
              <span>例：これ／本 → これは本です。</span>
            </>
          )}
        </div>
        <button type="button" className="primary-btn" onClick={onProgress}>
          {meta.action}
        </button>
      </div>
    </section>
  )
}
