import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadAudioLessonPreferences, saveAudioLessonPreferences, setProgressChangeHook } from './storage'
import { LOCAL_PREFERENCE_KEYS } from './progressKeys'

const key = LOCAL_PREFERENCE_KEYS.audioLesson
let values: Map<string, string>

beforeEach(() => {
  values = new Map()
  vi.stubGlobal('localStorage', {
    getItem: (name: string) => values.get(name) ?? null,
    setItem: (name: string, value: string) => values.set(name, value),
  })
})

afterEach(() => {
  setProgressChangeHook(null)
  vi.unstubAllGlobals()
})

describe('語音教學本機偏好', () => {
  it('初次使用維持正常語速與留白，不在讀取時寫入', () => {
    expect(loadAudioLessonPreferences()).toEqual({ rate: 0.95, shadow: true })
    expect(values.size).toBe(0)
  })

  it.each([
    { rate: 0.95 as const, shadow: true }, { rate: 0.95 as const, shadow: false },
    { rate: 0.7 as const, shadow: true }, { rate: 0.7 as const, shadow: false },
  ])('只保存合法偏好，不通知學習進度同步：%j', (preferences) => {
    const notify = vi.fn()
    setProgressChangeHook(notify)
    const polluted = { ...preferences, text: '不得保存的課文' }
    expect(saveAudioLessonPreferences(polluted)).toBe(true)
    expect(loadAudioLessonPreferences()).toEqual(preferences)
    expect([...values.keys()]).toEqual([key])
    expect(JSON.parse(values.get(key)!)).toEqual(preferences)
    expect(notify).not.toHaveBeenCalled()
  })

  it.each(['{', 'null', '[]', '"慢速"', 'false', '{"rate":"0.7","shadow":"false"}', '{"rate":9,"shadow":0}'])
    ('忽略壞 JSON、錯誤型別與範圍外數值：%s', (raw) => {
      values.set(key, raw)
      expect(loadAudioLessonPreferences()).toEqual({ rate: 0.95, shadow: true })
      expect(values.get(key)).toBe(raw)
    })

  it('逐欄保留有效值，不因另一欄無效而全部遺失', () => {
    values.set(key, '{"rate":0.7,"shadow":"false"}')
    expect(loadAudioLessonPreferences()).toEqual({ rate: 0.7, shadow: true })
    values.set(key, '{"rate":-1,"shadow":false}')
    expect(loadAudioLessonPreferences()).toEqual({ rate: 0.95, shadow: false })
  })

  it('儲存不可用時回預設，寫入如實回報失敗', () => {
    vi.stubGlobal('localStorage', undefined)
    expect(loadAudioLessonPreferences()).toEqual({ rate: 0.95, shadow: true })
    expect(saveAudioLessonPreferences({ rate: 0.7, shadow: false })).toBe(false)
  })

  it('拒絕讀寫時不拋例外，寫入失敗不冒充已保存', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('受控讀取失敗') },
      setItem: () => { throw new Error('受控寫入失敗') },
    })
    expect(loadAudioLessonPreferences()).toEqual({ rate: 0.95, shadow: true })
    expect(saveAudioLessonPreferences({ rate: 0.7, shadow: false })).toBe(false)
  })
})
