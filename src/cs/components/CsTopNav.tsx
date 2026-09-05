import React, { useState } from 'react'
import { TrackSwitcher } from '../../components/TrackSwitcher'
import type { LangId } from '../../utils/storage'

export type CsNavSection =
  | 'hierarchy'
  | 'textbook'
  | 'today'
  | 'practice'
  | 'signals'
  | 'arch-map'
  | 'von-neumann'
  | 'pipeline-hazard'
  | 'cache-mapping'
  | 'ai-transformer'
  | 'mock'
  | 'errors'

interface Props {
  activeSection: CsNavSection
  onSelectSection: (section: CsNavSection) => void
  onBackHub: () => void
  onSwitchLang: (lang: LangId) => void
  errorCount?: number
}

const PRIMARY: Array<{ id: CsNavSection; label: string }> = [
  { id: 'today', label: '今日' },
  { id: 'hierarchy', label: '課綱' },
  { id: 'textbook', label: '讀本' },
]

const LABS: Array<{ id: CsNavSection; title: string; desc: string; advanced?: boolean }> = [
  { id: 'von-neumann', title: '指令週期', desc: '取指、解碼、寫回' },
  { id: 'pipeline-hazard', title: '管線冒險', desc: 'Forwarding 與 Stall' },
  { id: 'cache-mapping', title: '快取映射', desc: 'Tag · Index · Offset' },
  { id: 'arch-map', title: '硬體架構圖', desc: '系統區塊關係' },
  { id: 'ai-transformer', title: '矩陣與注意力', desc: '進階 · GEMM 與 Attention', advanced: true },
]

const PRACTICE: Array<{ id: CsNavSection; title: string; desc: string }> = [
  { id: 'practice', title: '單元練習', desc: '依課綱作答' },
  { id: 'signals', title: '破題訊號', desc: '對照常見題型' },
]

const EXAMS: Array<{ id: CsNavSection; title: string; desc: string }> = [
  { id: 'mock', title: '模擬測驗', desc: '計時與等第' },
  { id: 'errors', title: '錯題本', desc: '重練錯過的題' },
]

const LAB_IDS: CsNavSection[] = LABS.map((item) => item.id)
const PRACTICE_IDS: CsNavSection[] = PRACTICE.map((item) => item.id)
const EXAM_IDS: CsNavSection[] = EXAMS.map((item) => item.id)

export const CsTopNav: React.FC<Props> = ({
  activeSection,
  onSelectSection,
  onBackHub,
  onSwitchLang,
  errorCount = 0,
}) => {
  const [openMenu, setOpenMenu] = useState<'labs' | 'practice' | 'exams' | null>(null)

  function go(section: CsNavSection) {
    onSelectSection(section)
    setOpenMenu(null)
  }

  function menuClass(active: boolean) {
    return `cs-nav-item${active ? ' is-active' : ''}`
  }

  return (
    <header className="cs-top-nav">
      <div className="cs-nav-brand">
        <p className="eyebrow">計算機概論</p>
        <span className="cs-nav-brand-sub">從抽象層到指令如何執行</span>
      </div>

      <nav className="cs-nav-list" aria-label="計算機概論">
        {PRIMARY.map((item) => (
          <button
            key={item.id}
            type="button"
            className={menuClass(activeSection === item.id)}
            onClick={() => go(item.id)}
          >
            {item.label}
          </button>
        ))}

        <div className="cs-nav-menu">
          <button
            type="button"
            className={menuClass(LAB_IDS.includes(activeSection))}
            aria-expanded={openMenu === 'labs'}
            onClick={() => setOpenMenu((cur) => (cur === 'labs' ? null : 'labs'))}
          >
            實驗室
          </button>
          {openMenu === 'labs' ? (
            <div className="cs-nav-dropdown" role="menu">
              {LABS.map((lab) => (
                <button key={lab.id} type="button" onClick={() => go(lab.id)}>
                  <strong>
                    {lab.title}
                    {lab.advanced ? <span className="cs-advanced-tag">進階</span> : null}
                  </strong>
                  <span>{lab.desc}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="cs-nav-menu">
          <button
            type="button"
            className={menuClass(PRACTICE_IDS.includes(activeSection))}
            aria-expanded={openMenu === 'practice'}
            onClick={() => setOpenMenu((cur) => (cur === 'practice' ? null : 'practice'))}
          >
            練習
          </button>
          {openMenu === 'practice' ? (
            <div className="cs-nav-dropdown" role="menu">
              {PRACTICE.map((item) => (
                <button key={item.id} type="button" onClick={() => go(item.id)}>
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="cs-nav-menu">
          <button
            type="button"
            className={menuClass(EXAM_IDS.includes(activeSection))}
            aria-expanded={openMenu === 'exams'}
            onClick={() => setOpenMenu((cur) => (cur === 'exams' ? null : 'exams'))}
          >
            測驗
            {errorCount > 0 ? <span className="cs-nav-badge">{errorCount}</span> : null}
          </button>
          {openMenu === 'exams' ? (
            <div className="cs-nav-dropdown" role="menu">
              {EXAMS.map((item) => (
                <button key={item.id} type="button" onClick={() => go(item.id)}>
                  <strong>
                    {item.title}
                    {item.id === 'errors' && errorCount > 0 ? `（${errorCount}）` : ''}
                  </strong>
                  <span>{item.desc}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </nav>

      <TrackSwitcher current="cs" onBackHub={onBackHub} onSwitchLang={onSwitchLang} />
    </header>
  )
}
