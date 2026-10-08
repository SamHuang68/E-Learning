import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { jlptLevels } from '../data/course'
import { getJaPractice } from '../data/practiceContent'
import { LocaleContext, type LocaleContextValue } from '../i18n/i18n'
import { localizeJaPractice } from '../i18n/jaTeachingCopy'
import { localizeJaScenarios } from '../i18n/jaInteractiveCopy'
import { translate } from '../i18n/messages'
import type { AudioLessonSegment } from '../utils/audioLessonTypes'
import { toeicCertificates } from '../toeic/data/certificates'
import { getToeicPractice } from '../toeic/data/practiceContent'
import { localizeToeicPractice } from '../toeic/teachingCopy'
import { ToeicPractice } from '../toeic/components/ToeicPractice'
import { PracticeView } from './PracticeView'
import { ScenarioPlayer } from './ScenarioPlayer'
import { enScenarios, jaScenarios } from '../data/scenarios'

type CapturedLesson = { lessonId: string; title?: string; segments: AudioLessonSegment[] }
const { lessons, selectedScenarioAnswer } = vi.hoisted(() => ({
  lessons: [] as CapturedLesson[], selectedScenarioAnswer: { text: null as string | null },
}))

// 建立作答後 SSR 狀態；不模擬選答／教材計算，也不宣稱瀏覽器點擊驗收。
vi.mock('react', async (importOriginal) => {
  const react = await importOriginal<typeof import('react')>()
  return {
    ...react,
    useState: (initial: unknown) => {
      const state = react.useState(initial)
      return initial === null && selectedScenarioAnswer.text !== null
        ? [selectedScenarioAnswer.text, state[1]]
        : state
    },
  }
})

// 驗證消費者提供的教材契約；實際播放生命週期由共用元件測試涵蓋。
vi.mock('./AudioLesson', () => ({
  AudioLesson: (props: CapturedLesson) => {
    lessons.push(props)
    return <section className="audio-lesson-consumer-test">{props.title}</section>
  },
}))

const noop = () => {}
function context(locale: 'en' | 'zh-Hant'): LocaleContextValue {
  return { locale, setLocale: noop, t: (key, vars) => translate(locale, key, vars) }
}

beforeEach(() => {
  lessons.length = 0
  selectedScenarioAnswer.text = null
})

describe('日語有聲教學教材消費契約', () => {
  it.each([
    ['vocab', 'zh-Hant'], ['reading', 'zh-Hant'], ['grammar', 'zh-Hant'],
    ['vocab', 'en'], ['reading', 'en'], ['grammar', 'en'],
  ] as const)('%s 的 %s 閃卡沿用原文及已本地化解說', (kind, locale) => {
    const level = jlptLevels[0]
    const unit = level.units[0]
    const rawPack = getJaPractice(level.id, unit.id)
    const sourceBefore = JSON.stringify(rawPack)
    const pack = localizeJaPractice(rawPack, locale)!
    const card = pack[kind === 'reading' ? 'passage' : kind][0]
    const onProgress = vi.fn()
    const html = renderToStaticMarkup(
      <LocaleContext.Provider value={context(locale)}>
        <PracticeView kind={kind} levelId={level.id} unit={unit} mode="learn" onBack={noop} onProgress={onProgress} />
      </LocaleContext.Provider>,
    )

    expect(lessons).toHaveLength(1)
    const lesson = lessons[0]
    expect(lesson.lessonId).toContain(level.id)
    expect(lesson.lessonId).toContain(String(unit.id))
    expect(lesson.lessonId).toContain(card.id)
    expect(lesson.lessonId).toContain(kind)
    expect(lesson.lessonId).toContain(locale)
    expect(lesson.segments).toContainEqual(expect.objectContaining({
      text: card.speakText ?? card.sentence, lang: 'ja-JP', kind: 'example',
    }))
    expect(lesson.segments).toContainEqual(expect.objectContaining({
      text: card.meaning, lang: locale === 'en' ? 'en-US' : 'zh-TW', kind: 'explanation',
    }))
    expect(lesson.segments).toContainEqual(expect.objectContaining({
      text: card.sentenceZh, lang: locale === 'en' ? 'en-US' : 'zh-TW', kind: 'explanation',
    }))
    expect(lesson.segments.every((segment) => Boolean(segment.id))).toBe(true)
    expect(new Set(lesson.segments.map((segment) => segment.id)).size).toBe(lesson.segments.length)
    expect(html).toContain('<strong lang="ja">')
    expect(html).toContain('class="speak-btn')
    expect(JSON.stringify(rawPack)).toBe(sourceBefore)
    expect(onProgress).not.toHaveBeenCalled()
  })
})

describe('英語有聲教學教材消費契約', () => {
  it.each([
    ['vocab', 'zh-Hant'], ['listening', 'zh-Hant'], ['grammar', 'zh-Hant'],
    ['vocab', 'en'], ['listening', 'en'], ['grammar', 'en'],
  ] as const)('%s 的 %s 閃卡沿用原文及已本地化解說', (kind, locale) => {
    const certificate = toeicCertificates[0]
    const unit = certificate.units[0]
    const rawPack = getToeicPractice(certificate.id, unit.id)
    const sourceBefore = JSON.stringify(rawPack)
    const pack = localizeToeicPractice(rawPack, locale)!
    const card = pack[kind === 'listening' ? 'passage' : kind][0]
    const onProgress = vi.fn()
    const html = renderToStaticMarkup(
      <LocaleContext.Provider value={context(locale)}>
        <ToeicPractice kind={kind} certificateId={certificate.id} unit={unit} mode="learn" onBack={noop} onProgress={onProgress} />
      </LocaleContext.Provider>,
    )

    expect(lessons).toHaveLength(1)
    const lesson = lessons[0]
    expect(lesson.lessonId).toContain(certificate.id)
    expect(lesson.lessonId).toContain(String(unit.id))
    expect(lesson.lessonId).toContain(card.id)
    expect(lesson.lessonId).toContain(kind)
    expect(lesson.lessonId).toContain(locale)
    expect(lesson.segments).toContainEqual(expect.objectContaining({
      text: card.speakText ?? card.sentence, lang: 'en-US', kind: 'example',
    }))
    expect(lesson.segments).toContainEqual(expect.objectContaining({
      text: card.meaning, lang: locale === 'en' ? 'en-US' : 'zh-TW', kind: 'explanation',
    }))
    if (card.sentenceZh !== card.sentence) {
      expect(lesson.segments).toContainEqual(expect.objectContaining({
        text: card.sentenceZh, lang: locale === 'en' ? 'en-US' : 'zh-TW', kind: 'explanation',
      }))
    } else {
      expect(lesson.segments.filter((segment) => segment.text === card.sentence)).toHaveLength(1)
    }
    expect(lesson.segments.every((segment) => Boolean(segment.id))).toBe(true)
    expect(new Set(lesson.segments.map((segment) => segment.id)).size).toBe(lesson.segments.length)
    expect(html).toContain('<strong lang="en">')
    expect(html).toContain('class="speak-btn')
    expect(JSON.stringify(rawPack)).toBe(sourceBefore)
    expect(onProgress).not.toHaveBeenCalled()
  })

  it('保留既有聽力片段來源，不改為另一路音檔資料', () => {
    const certificate = toeicCertificates[0]
    const unit = certificate.units[5]
    const card = getToeicPractice(certificate.id, unit.id)!.passage[0]
    renderToStaticMarkup(
      <ToeicPractice kind="listening" certificateId={certificate.id} unit={unit} mode="learn" onBack={noop} onProgress={noop} />,
    )
    expect(card.audio?.src).toBe('audio/toeic/orange-6-p1.mp3')
    expect(lessons).toHaveLength(1)
    expect(lessons[0].segments).toContainEqual(expect.objectContaining({
      text: card.speakText ?? card.sentence, audioSrc: card.audio?.src,
      lang: 'en-US', kind: 'example',
    }))
  })
})

describe('情境有聲教學的作答邊界', () => {
  it.each([
    ['ja', 'zh-Hant', false], ['ja', 'en', false], ['en', 'zh-Hant', false], ['en', 'en', false],
    ['ja', 'zh-Hant', true], ['ja', 'en', true], ['en', 'zh-Hant', true], ['en', 'en', true],
  ] as const)('%s 在 %s 介面選答正確=%s 時只對合適答案留白跟讀，並提供相同畫面回饋', (track, locale, correct) => {
    const scenarios = track === 'ja' ? localizeJaScenarios(locale) : enScenarios
    const beat = scenarios[0].beats[0]
    const selected = beat.options.find((option) => option.correct === correct)!
    selectedScenarioAnswer.text = selected.text
    const feedback = correct
      ? locale === 'en' ? `Appropriate register: ${selected.register}` : `語體合適：${selected.register}`
      : locale === 'en'
        ? `This option is ${selected.register}. Choose a more suitable business expression.`
        : `這個語體偏 ${selected.register}，請選更合適的商務／丁寧表現。`
    const onComplete = vi.fn()
    const html = renderToStaticMarkup(
      <LocaleContext.Provider value={context(locale)}>
        <ScenarioPlayer track={track} scenarios={scenarios} onComplete={onComplete} />
      </LocaleContext.Provider>,
    )

    expect(lessons).toHaveLength(1)
    expect(lessons[0].segments).toContainEqual({
      id: 'selected-answer', text: selected.text,
      lang: track === 'ja' ? 'ja-JP' : 'en-US', kind: correct ? 'example' : 'explanation',
    })
    expect(lessons[0].segments).toContainEqual({
      id: 'feedback', text: feedback, lang: locale === 'en' ? 'en-US' : 'zh-TW', kind: 'explanation',
    })
    expect(html).toContain(feedback)
    for (const option of beat.options.filter((option) => option.text !== selected.text)) {
      expect(lessons[0].segments.some((segment) => segment.text === option.text)).toBe(false)
    }
    if (!correct) expect(lessons[0].segments.some((segment) => segment.kind === 'example')).toBe(false)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('日語情境省略資料參數時仍沿用英文支援資料，而非以英語讀繁中提示', () => {
    renderToStaticMarkup(
      <LocaleContext.Provider value={context('en')}>
        <ScenarioPlayer track="ja" onComplete={noop} />
      </LocaleContext.Provider>,
    )
    expect(lessons).toHaveLength(1)
    expect(lessons[0].segments).toEqual([{
      id: 'prompt', text: localizeJaScenarios('en')[0].beats[0].prompt,
      lang: 'en-US', kind: 'explanation',
    }])
  })

  it.each([
    ['ja', 'zh-Hant'], ['ja', 'en'], ['en', 'zh-Hant'], ['en', 'en'],
  ] as const)('%s 在 %s 介面作答前只提供提示，不朗讀任何答案', (track, locale) => {
    const sourceBefore = JSON.stringify(track === 'ja' ? jaScenarios : enScenarios)
    const scenarios = track === 'ja' ? localizeJaScenarios(locale) : enScenarios
    const scenario = scenarios[0]
    const beat = scenario.beats[0]
    const onComplete = vi.fn()
    renderToStaticMarkup(
      <LocaleContext.Provider value={context(locale)}>
        <ScenarioPlayer track={track} scenarios={scenarios} onComplete={onComplete} />
      </LocaleContext.Provider>,
    )

    expect(lessons).toHaveLength(1)
    expect(lessons[0].lessonId).toContain(track)
    expect(lessons[0].lessonId).toContain(scenario.id)
    expect(lessons[0].lessonId).toContain(locale)
    expect(lessons[0].segments).toEqual([{
      id: 'prompt', text: beat.prompt,
      lang: track === 'en' || locale === 'en' ? 'en-US' : 'zh-TW',
      kind: 'explanation',
    }])
    for (const option of beat.options) {
      expect(lessons[0].segments.some((segment) => segment.text === option.text)).toBe(false)
    }
    expect(JSON.stringify(track === 'ja' ? jaScenarios : enScenarios)).toBe(sourceBefore)
    expect(onComplete).not.toHaveBeenCalled()
  })
})

describe('有聲教學保留既有練習與缺教材行為', () => {
  it.each([
    ['ja', 'zh-Hant'], ['ja', 'en'], ['en', 'zh-Hant'], ['en', 'en'],
  ] as const)('%s 的 %s 介面仍預設答題模式，不加入可揭露教材的導讀', (track, locale) => {
    const progress = vi.fn()
    const component = track === 'ja'
      ? <PracticeView kind="vocab" levelId={jlptLevels[0].id} unit={jlptLevels[0].units[0]} onBack={noop} onProgress={progress} />
      : <ToeicPractice kind="vocab" certificateId={toeicCertificates[0].id} unit={toeicCertificates[0].units[0]} onBack={noop} onProgress={progress} />
    const html = renderToStaticMarkup(
      <LocaleContext.Provider value={context(locale)}>{component}</LocaleContext.Provider>,
    )
    expect(lessons).toHaveLength(0)
    expect(html).toContain('class="practice-view exercise-session"')
    expect(progress).not.toHaveBeenCalled()
  })

  it.each(['ja', 'en'] as const)('%s 缺教材時不顯示空的教學控制並保留標題發音', (track) => {
    const component = track === 'ja'
      ? <PracticeView kind="vocab" levelId="missing" unit={jlptLevels[0].units[0]} mode="learn" onBack={noop} onProgress={noop} />
      : <ToeicPractice kind="vocab" certificateId="missing" unit={toeicCertificates[0].units[0]} mode="learn" onBack={noop} onProgress={noop} />
    const html = renderToStaticMarkup(component)
    expect(lessons).toHaveLength(0)
    expect(html).toContain('class="practice-empty"')
    expect(html).toContain('class="speak-btn')
  })
})
