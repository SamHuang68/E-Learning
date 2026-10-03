import { useRef, useState } from 'react'
import { CS_TEXTBOOK_CHAPTERS, type TextbookChapter } from '../data/textbookData'
import { csStrandMessageKey } from '../data/curriculum'
import { MathFormula } from '../../math/components/MathFormula'
import { useI18n } from '../../i18n/i18n'
import './CsTextbookReader.css'

const READER_COPY = {
  'zh-Hant': {
    reader: '讀本：', chapters: '讀本章節', read: '已讀', prerequisites: '先備知識：', filter: '閱讀範圍',
    all: '全文', history: '歷史', principles: '原理', architecture: '架構', philosophy: '思辨',
    historyHeading: '一、歷史脈絡與科學思想動機', era: '關鍵年代', pioneers: '代表先驅',
    motivation: '核心科學動機', breakthrough: '突破創舉之由來',
    principlesHeading: '二、第一性原理與核心數學推導', theorem: '定理',
    architectureHeading: '三、微架構與工程實現剖析', map: '硬體架構圖',
    mapDescription: '用架構圖對照本章的區塊、時序與記憶體流。', openMap: '開啟架構圖',
    casesHeading: '四、工業界標竿工程實例', philosophyHeading: '五、批判性思維與第一性哲學思辨',
    question: '思辨題', referencesHeading: '六、經典必讀原著與論文典範', author: '作者：',
  },
  en: {
    reader: 'Reader:', chapters: 'Textbook chapters', read: 'Viewed', prerequisites: 'Prerequisites:', filter: 'Reading sections',
    all: 'Full chapter', history: 'History', principles: 'Principles', architecture: 'Architecture', philosophy: 'Reflection',
    historyHeading: '1. Historical context and scientific motivation', era: 'Key period', pioneers: 'Pioneers',
    motivation: 'Scientific motivation', breakthrough: 'The breakthrough',
    principlesHeading: '2. First principles and mathematical derivations', theorem: 'Theorem',
    architectureHeading: '3. Architecture and engineering implementation', map: 'Hardware architecture map',
    mapDescription: 'Explore the blocks, timing, and memory flow discussed in this chapter.', openMap: 'Open architecture map',
    casesHeading: '4. Engineering case studies', philosophyHeading: '5. Critical thinking and reflection',
    question: 'Reflection', referencesHeading: '6. Classic books and papers', author: 'Author:',
  },
} as const

interface Props {
  onOpenArchMap?: () => void
}

export function CsTextbookReader({ onOpenArchMap }: Props = {}) {
  const { t, locale } = useI18n()
  const copy = READER_COPY[locale]
  const chapterLabel = (number: number) => locale === 'en' ? `Chapter ${number}` : `第 ${number} 章`
  const contentRef = useRef<HTMLDivElement>(null)
  const [selectedChapterId, setSelectedChapterId] = useState<string>('cs-ch-1')
  const [activeTab, setActiveTab] = useState<'all' | 'history' | 'principles' | 'architecture' | 'philosophy'>('all')
  const [readChapters, setReadChapters] = useState<Set<string>>(new Set(['cs-ch-1']))

  const currentChapter: TextbookChapter =
    CS_TEXTBOOK_CHAPTERS.find((c) => c.id === selectedChapterId) || CS_TEXTBOOK_CHAPTERS[0]

  const handleSelectChapter = (id: string) => {
    setSelectedChapterId(id)
    if (contentRef.current) contentRef.current.scrollTop = 0
    if (!readChapters.has(id)) {
      setReadChapters(new Set(readChapters).add(id))
    }
  }

  return (
    <div
      className="cs-textbook-reader"
      lang={locale}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg)',
        color: 'var(--ink)',
        overflow: 'hidden',
      }}
    >
      <div
        className="cs-reader-chapters"
        role="group"
        aria-label={copy.chapters}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1rem',
          borderBottom: '1px solid var(--line)',
          background: 'var(--surface)',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--navy)', marginRight: '0.25rem' }}>
          <span lang={locale}>{copy.reader}</span>
        </span>
        {CS_TEXTBOOK_CHAPTERS.map((ch) => {
          const isSelected = ch.id === selectedChapterId
          const isRead = readChapters.has(ch.id)
          return (
            <button
              key={ch.id}
              type="button"
              onClick={() => handleSelectChapter(ch.id)}
              aria-current={isSelected ? 'page' : undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.32rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: isSelected ? 800 : 500,
                background: isSelected ? 'var(--accent-soft)' : isRead ? 'var(--surface-soft)' : 'transparent',
                color: isSelected ? 'var(--navy)' : 'var(--muted)',
                border: isSelected ? '1px solid var(--navy)' : '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              <span>
                {chapterLabel(ch.chapterNumber)}{isRead ? ` · ${copy.read}` : ''}
              </span>
            </button>
          )
        })}
      </div>

      <div className="cs-reader-body">
        <div
          ref={contentRef}
          className="cs-reader-content"
        >
          <div
            className="cs-reader-heading"
            style={{
              borderRadius: '12px',
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow)',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: 'var(--accent-soft)',
                  color: 'var(--navy)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                }}
              >
                {chapterLabel(currentChapter.chapterNumber)}
              </span>
              <span
                style={{
                  background: 'var(--surface-soft)',
                  color: 'var(--muted)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  border: '1px solid var(--line)',
                }}
              >
                <span lang={locale}>{t(csStrandMessageKey(currentChapter.strand))}</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: 'auto' }}>
                {locale === 'en' ? `About ${currentChapter.readingTimeMinutes} minutes` : `約 ${currentChapter.readingTimeMinutes} 分鐘`}
              </span>
            </div>

            <h1 style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.6rem', fontWeight: 900, color: 'var(--ink)' }}>
              {locale === 'en' ? currentChapter.englishTitle : currentChapter.title}
            </h1>
            <div lang={locale === 'en' ? 'zh-Hant' : 'en'} style={{ fontSize: '0.88rem', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '0.75rem' }}>
              {locale === 'en' ? currentChapter.title : currentChapter.englishTitle}
            </div>

            {locale === 'en' ? <p className="cs-reader-language-note">Chapter content is currently in Traditional Chinese.</p> : null}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 600 }}><span lang={locale}>{copy.prerequisites}</span></span>
              {currentChapter.prerequisites.map((p, idx) => (
                <span
                  lang="zh-Hant"
                  key={idx}
                  style={{
                    fontSize: '0.72rem',
                    background: 'var(--surface-soft)',
                    color: 'var(--ink)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--line)',
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div
            role="group"
            aria-label={copy.filter}
            style={{
              display: 'flex',
              gap: '0.5rem',
              borderBottom: '1px solid var(--line)',
              paddingBottom: '0.5rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { id: 'all', label: copy.all },
              { id: 'history', label: copy.history },
              { id: 'principles', label: copy.principles },
              { id: 'architecture', label: copy.architecture },
              { id: 'philosophy', label: copy.philosophy },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                aria-pressed={activeTab === tab.id}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === tab.id ? 800 : 600,
                  background: activeTab === tab.id ? 'var(--surface-soft)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--navy)' : 'var(--muted)',
                  border: activeTab === tab.id ? '1px solid var(--line)' : '1px solid transparent',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(activeTab === 'all' || activeTab === 'history') && (
            <section lang="zh-Hant" style={{ marginBottom: '2rem' }}>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy)' }}>
                <span lang={locale}>{copy.historyHeading}</span>
              </h2>
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '1rem 1.25rem',
                  lineHeight: 1.7,
                  fontSize: '0.88rem',
                  color: 'var(--ink)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ background: 'var(--surface-soft)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}><span lang={locale}>{copy.era}</span></span>
                    <div style={{ fontWeight: 700, color: 'var(--ink)', marginTop: '0.15rem' }}>
                      {currentChapter.historicalContext.era}
                    </div>
                  </div>
                  <div style={{ background: 'var(--surface-soft)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}><span lang={locale}>{copy.pioneers}</span></span>
                    <div style={{ fontWeight: 700, color: 'var(--ink)', marginTop: '0.15rem' }}>
                      {currentChapter.historicalContext.keyFigures.join('、')}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ color: 'var(--ink)' }}><span lang={locale}>{copy.motivation}</span></strong>
                  <p style={{ margin: '0.25rem 0', color: 'var(--ink)' }}>
                    {currentChapter.historicalContext.coreMotivation}
                  </p>
                </div>

                <div>
                  <strong style={{ color: 'var(--ink)' }}><span lang={locale}>{copy.breakthrough}</span></strong>
                  <p style={{ margin: '0.25rem 0', color: 'var(--ink)' }}>
                    {currentChapter.historicalContext.breakthroughStory}
                  </p>
                </div>
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'principles') && (
            <section lang="zh-Hant" style={{ marginBottom: '2rem' }}>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy)' }}>
                <span lang={locale}>{copy.principlesHeading}</span>
              </h2>
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  lineHeight: 1.7,
                }}
              >
                <p style={{ margin: '0 0 1rem', fontSize: '0.92rem', color: 'var(--ink)', fontWeight: 500 }}>
                  {currentChapter.firstPrinciples.summary}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {currentChapter.firstPrinciples.mathematicalDerivations.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--surface-soft)',
                        borderLeft: '4px solid var(--navy)',
                        padding: '0.9rem 1.1rem',
                        borderRadius: '0 8px 8px 0',
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--navy)', marginBottom: '0.4rem' }}>
                        <span lang={locale}>{copy.theorem}</span> {idx + 1}: {item.topic}
                      </div>
                      <div
                        style={{
                          background: 'var(--bg)',
                          border: '1px solid var(--line)',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '6px',
                          overflowX: 'auto',
                          marginBottom: '0.4rem',
                          textAlign: 'center',
                        }}
                      >
                        <MathFormula math={item.formula} block />
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{item.explanation}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'architecture') && (
            <section lang="zh-Hant" style={{ marginBottom: '2rem' }}>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy)' }}>
                <span lang={locale}>{copy.architectureHeading}</span>
              </h2>
              <div
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '8px',
                  padding: '1.25rem',
                  lineHeight: 1.7,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '0.4rem' }}>
                  {currentChapter.architecturalDeepDive.sectionTitle}
                </div>
                <p style={{ margin: '0 0 1rem', fontSize: '0.86rem', color: 'var(--ink)' }}>
                  {currentChapter.architecturalDeepDive.content}
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
                    gap: '0.75rem',
                  }}
                >
                  {currentChapter.architecturalDeepDive.keySubsystems.map((sub, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--surface-soft)',
                        border: '1px solid var(--line)',
                        padding: '0.85rem',
                        borderRadius: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--ink)' }}>{sub.name}</span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: 'var(--navy)',
                            background: 'var(--accent-soft)',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                          }}
                        >
                          {sub.role}
                        </span>
                      </div>
                      <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                        {sub.technicalMechanism}
                      </p>
                    </div>
                  ))}
                </div>

                {onOpenArchMap ? (
                  <div
                    style={{
                      marginTop: '1.25rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      background: 'var(--surface-soft)',
                      border: '1px solid var(--line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <strong style={{ color: 'var(--navy)', fontSize: '0.85rem' }}><span lang={locale}>{copy.map}</span></strong>
                      <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>
                        <span lang={locale}>{copy.mapDescription}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onOpenArchMap}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '6px',
                        background: 'var(--navy)',
                        color: '#fff',
                        border: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <span lang={locale}>{copy.openMap}</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </section>
          )}

          {activeTab === 'all' && (
            <section lang="zh-Hant" style={{ marginBottom: '2rem' }}>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy)' }}>
                <span lang={locale}>{copy.casesHeading}</span>
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
                  gap: '0.75rem',
                }}
              >
                {currentChapter.industrialCaseStudies.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--line)',
                      borderRadius: '8px',
                      padding: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          background: 'var(--surface-soft)',
                          color: 'var(--navy)',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px',
                          fontWeight: 700,
                          border: '1px solid var(--line)',
                        }}
                      >
                        {item.companyOrProject}
                      </span>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>{item.systemName}</strong>
                    </div>
                    <p style={{ margin: '0.4rem 0 0', fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                      {item.appliedSolution}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(activeTab === 'all' || activeTab === 'philosophy') && (
            <section lang="zh-Hant" style={{ marginBottom: '2rem' }}>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy)' }}>
                <span lang={locale}>{copy.philosophyHeading}</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {currentChapter.deepThinkingQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--surface-soft)',
                      borderLeft: '4px solid var(--navy)',
                      borderRadius: '0 8px 8px 0',
                      padding: '1rem 1.25rem',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--ink)', marginBottom: '0.4rem' }}>
                      <span lang={locale}>{copy.question}</span> {idx + 1}: {q.question}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                      {q.philosophicalAnalysis}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'all' && (
            <section lang="zh-Hant" style={{ marginBottom: '1rem' }}>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--navy)' }}>
                <span lang={locale}>{copy.referencesHeading}</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {currentChapter.classicReferences.map((ref, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--surface)',
                      border: '1px solid var(--line)',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--ink)' }}>{ref.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--navy)' }}><span lang={locale}>{copy.author}</span> {ref.author}</div>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)', fontStyle: 'italic' }}>
                      {ref.significance}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
