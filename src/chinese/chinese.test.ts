import { describe, it, expect } from 'vitest'
import { CHINESE_TONES, INITIALS_DATA, PINYIN_DRILL_WORDS } from './data/pinyinBopomofo'
import { FALSE_FRIENDS_DATA } from './data/falseFriends'
import { CHINESE_GRAMMAR_SIGNALS } from './data/grammarSignals'
import { CONVERSATION_SCENES } from './data/conversations'
import { defaultChineseProgress, loadChineseProgress, saveChineseProgress } from './utils/chineseStorage'

describe('Chinese for Japanese Speakers Track Integrity Tests', () => {
  it('should have 5 valid tones with pitch curves', () => {
    expect(CHINESE_TONES.length).toBe(5)
    CHINESE_TONES.forEach((t) => {
      expect(t.nameZh).toBeTruthy()
      expect(t.nameJa).toBeTruthy()
      expect(t.exampleChar).toBeTruthy()
    })
  })

  it('should have valid pinyin drill words', () => {
    expect(PINYIN_DRILL_WORDS.length).toBeGreaterThan(0)
    PINYIN_DRILL_WORDS.forEach((w) => {
      expect(w.zh).toBeTruthy()
      expect(w.pinyin).toBeTruthy()
      expect(w.ja).toBeTruthy()
    })
  })

  it('should have complete initials data with Katakana and Bopomofo', () => {
    expect(INITIALS_DATA.length).toBeGreaterThanOrEqual(20)
    INITIALS_DATA.forEach((i) => {
      expect(i.pinyin).toBeTruthy()
      expect(i.bopomofo).toBeTruthy()
      expect(i.katakana).toBeTruthy()
    })
  })

  it('should have high-value false friends data with pitfalls', () => {
    expect(FALSE_FRIENDS_DATA.length).toBeGreaterThanOrEqual(10)
    FALSE_FRIENDS_DATA.forEach((ff) => {
      expect(ff.wordZh).toBeTruthy()
      expect(ff.meaningZhInJa).toBeTruthy()
      expect(ff.meaningJaInJa).toBeTruthy()
      expect(ff.pitfallAlertJa).toBeTruthy()
      expect(ff.exampleSentenceZh).toBeTruthy()
    })
  })

  it('should have complete grammar signals with 3-second rules and active recall quizzes', () => {
    expect(CHINESE_GRAMMAR_SIGNALS.length).toBeGreaterThanOrEqual(5)
    CHINESE_GRAMMAR_SIGNALS.forEach((sig) => {
      expect(sig.pattern).toBeTruthy()
      expect(sig.threeSecondRuleJa).toBeTruthy()
      expect(sig.formula).toBeTruthy()
      expect(sig.quiz.options.length).toBe(4)
      expect(sig.quiz.correctIndex).toBeGreaterThanOrEqual(0)
      expect(sig.quiz.correctIndex).toBeLessThan(4)
    })
  })

  it('should have conversation scenes with valid dialogue lines', () => {
    expect(CONVERSATION_SCENES.length).toBeGreaterThanOrEqual(3)
    CONVERSATION_SCENES.forEach((scene) => {
      expect(scene.titleZh).toBeTruthy()
      expect(scene.titleJa).toBeTruthy()
      expect(scene.dialogue.length).toBeGreaterThan(0)
      scene.dialogue.forEach((line) => {
        expect(line.speaker).toBeTruthy()
        expect(line.zh).toBeTruthy()
        expect(line.pinyin).toBeTruthy()
        expect(line.ja).toBeTruthy()
      })
    })
  })

  it('should properly serialize and deserialize progress', () => {
    const p = defaultChineseProgress()
    expect(p.xp).toBe(0)
    saveChineseProgress({ ...p, xp: 50 })
    const loaded = loadChineseProgress()
    expect(loaded.xp).toBe(50)
  })
})
