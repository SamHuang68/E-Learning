import { createElement, type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LocaleContext } from '../../i18n/i18n'
import { translate } from '../../i18n/messages'
import type { AudioLessonSegment } from '../../utils/audioLessonTypes'
import { ChineseConversationLab } from './ChineseConversationLab'
import { PinyinLab } from './PinyinLab'
import { ChineseSignalsView } from './ChineseSignalsView'
import { CONVERSATION_SCENES, CHINESE_SUPPORT_EN as CONVERSATION_SUPPORT_EN } from '../data/conversations'
import { CHINESE_TONES, CHINESE_SUPPORT_EN as PINYIN_SUPPORT_EN } from '../data/pinyinBopomofo'
import { CHINESE_GRAMMAR_SIGNALS, CHINESE_SUPPORT_EN as SIGNAL_SUPPORT_EN } from '../data/grammarSignals'
import { localizeChineseData } from '../teachingCopy'

type CapturedLesson = { lessonId: string; segments: AudioLessonSegment[] }
const capturedLessons = vi.hoisted(() => [] as CapturedLesson[])

vi.mock('../../components/AudioLesson', () => ({
  AudioLesson: (props: CapturedLesson) => {
    capturedLessons.push(props)
    return createElement('div', { 'data-audio-lesson': props.lessonId })
  },
}))

const componentSources = import.meta.glob('./{ChineseConversationLab,PinyinLab,ChineseSignalsView}.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

function renderConsumer(component: ComponentType<{ onEarnXp: (amount: number) => void }>, locale: 'en' | 'zh-Hant') {
  const onEarnXp = vi.fn()
  const markup = renderToStaticMarkup(createElement(
    LocaleContext.Provider,
    { value: { locale, setLocale: () => {}, t: (key, vars) => translate(locale, key, vars) } },
    createElement(component, { onEarnXp }),
  ))
  expect(onEarnXp).not.toHaveBeenCalled()
  expect(capturedLessons).toHaveLength(1)
  const lesson = capturedLessons[0]
  expect(markup).toContain(`data-audio-lesson="${lesson.lessonId}"`)
  expect(lesson.segments.every((segment) => segment.text.trim().length > 0)).toBe(true)
  expect(new Set(lesson.segments.map((segment) => segment.id)).size).toBe(lesson.segments.length)
  return { markup, lesson }
}

beforeEach(() => capturedLessons.splice(0))

describe.each(['zh-Hant', 'en'] as const)('華語有聲導讀消費端：%s', (locale) => {
  const supportLanguage = locale === 'en' ? 'en-US' : 'ja-JP'

  it('對話原文使用臺灣華語，逐句解說沿用目前語系的既有資料', () => {
    const scene = CONVERSATION_SCENES[0]
    const localizedScene = localizeChineseData(scene, locale, CONVERSATION_SUPPORT_EN)
    const { markup, lesson } = renderConsumer(ChineseConversationLab, locale)
    expect(lesson.lessonId).toBe(`chinese-conversation:${scene.id}:${locale}`)
    expect(lesson.segments).toHaveLength(scene.dialogue.length * 2 + 1)
    scene.dialogue.forEach((line, index) => {
      expect(lesson.segments[index * 2]).toMatchObject({ text: line.zh, lang: 'zh-TW', kind: 'example' })
      expect(lesson.segments[index * 2 + 1]).toMatchObject({ text: localizedScene.dialogue[index].ja, lang: supportLanguage, kind: 'explanation' })
      expect(markup).toContain(line.zh)
      expect(markup).toContain(line.pinyin)
      expect(markup).toContain(line.bopomofo)
    })
    expect(lesson.segments.at(-1)).toMatchObject({ text: localizedScene.cultureTipJa, lang: supportLanguage, kind: 'explanation' })
  })

  it('聲調導讀保留中文字與拼音，聲調技巧使用正確解說語言', () => {
    const tone = CHINESE_TONES[0]
    const localizedTone = localizeChineseData(tone, locale, PINYIN_SUPPORT_EN)
    const { markup, lesson } = renderConsumer(PinyinLab, locale)
    expect(lesson.lessonId).toBe(`chinese-pinyin:tones:${tone.tone}:${locale}`)
    expect(lesson.segments).toEqual([
      { id: 'tone-character', text: tone.exampleChar, lang: 'zh-TW', kind: 'example' },
      { id: 'tone-pitch', text: localizedTone.pitchDescriptionJa, lang: supportLanguage, kind: 'explanation' },
      { id: 'tone-word', text: tone.exampleZh, lang: 'zh-TW', kind: 'example' },
      { id: 'tone-meaning', text: localizedTone.exampleMeaningJa, lang: supportLanguage, kind: 'explanation' },
      { id: 'tone-tip', text: localizedTone.exampleJa, lang: supportLanguage, kind: 'explanation' },
    ])
    expect(markup).toContain(tone.exampleZh)
    expect(markup).toContain(tone.examplePinyin)
  })

  it('文法導讀只讀教學例句與規則，不把未作答測驗解答加入聲音', () => {
    const signal = CHINESE_GRAMMAR_SIGNALS[0]
    const localizedSignal = localizeChineseData(signal, locale, SIGNAL_SUPPORT_EN)
    const { markup, lesson } = renderConsumer(ChineseSignalsView, locale)
    expect(lesson.lessonId).toBe(`chinese-signals:${signal.id}:${locale}`)
    expect(lesson.segments).toEqual([
      { id: 'signal-example', text: signal.contrastExample.zh, lang: 'zh-TW', kind: 'example' },
      { id: 'signal-meaning', text: localizedSignal.contrastExample.ja, lang: supportLanguage, kind: 'explanation' },
      { id: 'signal-rule', text: localizedSignal.threeSecondRuleJa, lang: supportLanguage, kind: 'explanation' },
      { id: 'signal-trap', text: localizedSignal.pitfall.reasonJa, lang: supportLanguage, kind: 'explanation' },
    ])
    expect(lesson.segments.some((segment) => segment.text === localizedSignal.quiz.explanationJa)).toBe(false)
    expect(markup).toContain(signal.contrastExample.zh)
    expect(markup).toContain(signal.contrastExample.pinyin)
    expect(markup).toContain(signal.contrastExample.bopomofo)
  })
})

describe('華語有聲導讀的選材與保存契約', () => {
  it('三個入口只新增導讀，不用導讀完成更新 XP，也不另建原生朗讀引擎', () => {
    for (const source of Object.values(componentSources)) {
      expect(source).toContain('<AudioLesson')
      expect(source).not.toContain('new SpeechSynthesisUtterance')
      expect(source).not.toMatch(/<AudioLesson[^>]*onEarnXp/s)
    }
  })

  it('拼音選材涵蓋目前聲調、聲母與韻母，ID 同時含選材與介面語系', () => {
    const source = componentSources['./PinyinLab.tsx']
    expect(source).toContain('selectedInitial.exampleChar')
    expect(source).toContain('selectedFinal.exampleChar')
    expect(source).toContain('localizedInitial.tipsJa')
    expect(source).toContain('localizedFinal.tipsJa')
    expect(source).toContain('`chinese-pinyin:${activeTab}:${audioMaterialId}:${locale}`')
    expect(source).toContain("activeTab !== 'drills'")
  })

  it('目標欄位仍從原始教材渲染，拼音與注音維持原值', () => {
    const conversation = componentSources['./ChineseConversationLab.tsx']
    expect(conversation).toContain('{line.zh}')
    expect(conversation).toContain('{line.pinyin}')
    expect(conversation).toContain('{line.bopomofo}')
    const pinyin = componentSources['./PinyinLab.tsx']
    expect(pinyin).toContain('{selectedInitial.pinyin}')
    expect(pinyin).toContain('{selectedInitial.bopomofo}')
    expect(pinyin).toContain('{selectedFinal.pinyin}')
    expect(pinyin).toContain('{selectedFinal.bopomofo}')
    const signals = componentSources['./ChineseSignalsView.tsx']
    expect(signals).toContain('{activeSignal.contrastExample.zh}')
    expect(signals).toContain('{activeSignal.contrastExample.pinyin}')
    expect(signals).toContain('{activeSignal.contrastExample.bopomofo}')
  })
})
