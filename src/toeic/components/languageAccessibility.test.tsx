import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ToeicPractice } from './ToeicPractice'
import { ToeicChunkLab } from './ToeicChunkLab'
import { PhonicsLab } from './PhonicsLab'
import { SignalDecisionView } from '../../aoba/components/SignalDecisionView'
import { PracticeView } from '../../components/PracticeView'
import { toeicCertificates } from '../data/certificates'
import { jlptLevels } from '../../data/course'

const noop = () => {}

describe('language lesson accessibility at initial render', () => {
  it('exposes the active flashcard mode, card update region and target language', () => {
    const toeic = renderToStaticMarkup(<ToeicPractice kind="vocab" certificateId={toeicCertificates[0].id} unit={toeicCertificates[0].units[0]} mode="learn" onBack={noop} onProgress={noop} />)
    const japanese = renderToStaticMarkup(<PracticeView kind="vocab" levelId={jlptLevels[0].id} unit={jlptLevels[0].units[0]} mode="learn" onBack={noop} onProgress={noop} />)
    for (const html of [toeic, japanese]) {
      expect(html).toMatch(/aria-pressed="true"[^>]*>/)
      expect(html).toContain('class="flash-face" role="status" aria-live="polite" aria-atomic="true"')
    }
    expect(toeic).toContain('<strong lang="en">')
    expect(japanese).toContain('<strong lang="ja">')
  })

  it('prevents progress credit for missing TOEIC practice cards', () => {
    const html = renderToStaticMarkup(<ToeicPractice kind="vocab" certificateId="missing" unit={toeicCertificates[0].units[0]} mode="learn" onBack={noop} onProgress={noop} />)
    expect(html).toContain('Content coming soon')
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*>Mark done \+XP<\/button>/)
  })

  it('renders all shadowing steps as keyboard-operable buttons and labels audio actions', () => {
    const html = renderToStaticMarkup(<ToeicChunkLab onBack={noop} onOpenStoryReview={noop} />)
    expect(html.match(/<button type="button" class="step-card/g)).toHaveLength(3)
    expect(html).toContain('class="step-card active" aria-pressed="true"')
    expect(html).toContain('aria-label="跟讀：')
    expect(html).toContain('此瀏覽器無法播放語音')
    expect(html).toContain('停止播放')
  })

  it('gives Japanese grammar search a persistent name and result status', () => {
    const html = renderToStaticMarkup(<SignalDecisionView onBack={noop} />)
    expect(html).toContain('aria-label="搜尋文法訊號"')
    expect(html).toContain('role="status" aria-live="polite" aria-atomic="true"')
    expect(html).toContain('class="ja-sent" lang="ja"')
  })

  it('announces the selected phonics mode separately from its visual class', () => {
    const html = renderToStaticMarkup(<PhonicsLab mastered={[]} onMaster={noop} />)
    expect(html).toContain('class="active" aria-pressed="true">字母表')
    expect(html).toContain('<b lang="en">')
  })
})
