import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AudioLessonSegment } from './audioLessonTypes'
import { LOCAL_PREFERENCE_KEYS } from './progressKeys'
import { setProgressChangeHook } from './storage'
import { clearAudioLessonPosition, loadAudioLessonPosition, saveAudioLessonPosition } from './語音位置'

const key = LOCAL_PREFERENCE_KEYS.audioLessonPosition
const first: AudioLessonSegment = { id: 'first', text: 'Hello.', lang: 'en-US', kind: 'example' }
const second: AudioLessonSegment = { id: 'second', text: '你好。', lang: 'zh-TW', kind: 'explanation' }
let values: Map<string, string>
let write: ReturnType<typeof vi.fn>

beforeEach(() => {
  values = new Map()
  write = vi.fn((name: string, value: string) => values.set(name, value))
  vi.stubGlobal('localStorage', { getItem: (name: string) => values.get(name) ?? null, setItem: write })
})

afterEach(() => {
  setProgressChangeHook(null)
  vi.unstubAllGlobals()
})

describe('語音教學本瀏覽器位置', () => {
  it('缺值時沒有位置，讀取不建立資料', () => {
    expect(loadAudioLessonPosition('lesson', [first])).toBeNull()
    expect(write).not.toHaveBeenCalled()
  })

  it.each(['{', 'null', '{}', 'false', '[null,{},[]]', '[{"lessonId":1,"segmentKey":false}]'])
    ('忽略壞資料且讀取不改寫，下一次儲存可恢復：%s', (raw) => {
      values.set(key, raw)
      expect(loadAudioLessonPosition('lesson', [first])).toBeNull()
      expect(values.get(key)).toBe(raw)
      expect(write).not.toHaveBeenCalled()
      expect(saveAudioLessonPosition('lesson', first)).toBe(true)
      expect(loadAudioLessonPosition('lesson', [first])).toBe(0)
    })

  it('每課獨立保存，讀取不更新最近順序', () => {
    expect(saveAudioLessonPosition('a', second)).toBe(true)
    expect(saveAudioLessonPosition('b', first)).toBe(true)
    const previous = values.get(key)
    expect(loadAudioLessonPosition('a', [first, second])).toBe(1)
    expect(loadAudioLessonPosition('b', [first, second])).toBe(0)
    expect(loadAudioLessonPosition('c', [first, second])).toBeNull()
    expect(values.get(key)).toBe(previous)
    expect(write).toHaveBeenCalledTimes(2)
  })

  it('重排後依相同識別與內容重定位，不沿用舊索引', () => {
    saveAudioLessonPosition('lesson', second)
    expect(loadAudioLessonPosition('lesson', [second, first])).toBe(0)
    expect(loadAudioLessonPosition('lesson', [first])).toBeNull()
    expect(loadAudioLessonPosition('lesson', [])).toBeNull()
  })

  it.each([
    { id: 'changed' }, { text: 'Hello!' }, { lang: 'ja-JP' as const },
    { kind: 'explanation' as const }, { audioSrc: 'audio/new.mp3' },
  ])('段落身分、內容、語言、種類或音檔改變時不誤接：%j', (change) => {
    saveAudioLessonPosition('lesson', first)
    expect(loadAudioLessonPosition('lesson', [{ ...first, ...change }])).toBeNull()
  })

  it('已有音檔遭替換或移除時不誤接', () => {
    saveAudioLessonPosition('lesson', { ...first, audioSrc: 'audio/old.mp3' })
    expect(loadAudioLessonPosition('lesson', [{ ...first, audioSrc: 'audio/new.mp3' }])).toBeNull()
    expect(loadAudioLessonPosition('lesson', [first])).toBeNull()
  })

  it('相同鍵重複匹配時拒絕還原，不任意選第一段', () => {
    saveAudioLessonPosition('lesson', first)
    expect(loadAudioLessonPosition('lesson', [first, { ...first }])).toBeNull()
    expect(loadAudioLessonPosition('lesson', [{ ...first, text: '其他內容' }, first])).toBe(1)
  })

  it('最多保留最近寫入的五十課，更新同課不占額外名額', () => {
    for (let index = 0; index < 50; index += 1) saveAudioLessonPosition(`lesson-${index}`, first)
    saveAudioLessonPosition('lesson-0', second)
    saveAudioLessonPosition('lesson-50', first)
    expect(JSON.parse(values.get(key)!)).toHaveLength(50)
    expect(loadAudioLessonPosition('lesson-0', [first, second])).toBe(1)
    expect(loadAudioLessonPosition('lesson-1', [first])).toBeNull()
    expect(loadAudioLessonPosition('lesson-50', [first])).toBe(0)
  })

  it('拒絕讀取時不嘗試寫入，保護其他課程資料', () => {
    saveAudioLessonPosition('other', second)
    const previous = values.get(key)
    write.mockClear()
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('受控讀取拒絕') }, setItem: write })
    expect(loadAudioLessonPosition('other', [second])).toBeNull()
    expect(saveAudioLessonPosition('lesson', first)).toBe(false)
    expect(write).not.toHaveBeenCalled()
    expect(values.get(key)).toBe(previous)
  })

  it('拒絕寫入時回報失敗且保留上次位置', () => {
    saveAudioLessonPosition('lesson', first)
    write.mockImplementation(() => { throw new Error('受控寫入拒絕') })
    expect(saveAudioLessonPosition('lesson', second)).toBe(false)
    expect(loadAudioLessonPosition('lesson', [first, second])).toBe(0)
  })

  it('沒有本機儲存時不拋例外，也不宣稱儲存成功', () => {
    vi.stubGlobal('localStorage', undefined)
    expect(loadAudioLessonPosition('lesson', [first])).toBeNull()
    expect(saveAudioLessonPosition('lesson', first)).toBe(false)
  })

  it('不更新經驗值、其他進度鍵或同步通知，只保存目標契約', () => {
    const progress = '{"xp":123,"completed":[]}'
    values.set('e-learning-meta', progress)
    values.set('aoba-progress', progress)
    const notify = vi.fn()
    setProgressChangeHook(notify)
    expect(saveAudioLessonPosition('lesson', first)).toBe(true)
    expect(JSON.parse(values.get(key)!)).toEqual([
      { lessonId: 'lesson', segmentKey: JSON.stringify(['first', 'Hello.', 'en-US', 'example', null]) },
    ])
    expect([...values.keys()]).toEqual(['e-learning-meta', 'aoba-progress', key])
    expect(values.get('e-learning-meta')).toBe(progress)
    expect(values.get('aoba-progress')).toBe(progress)
    expect(notify).not.toHaveBeenCalled()
  })

  it('只清除指定課程，保留其他課程順序、經驗值、偏好及同步隔離', () => {
    saveAudioLessonPosition('a', first)
    saveAudioLessonPosition('target', second)
    saveAudioLessonPosition('b', second)
    const previous = JSON.parse(values.get(key)!)
    const progress = '{"xp":123,"completed":[]}'
    const preferences = '{"rate":0.7,"shadow":false}'
    values.set('e-learning-meta', progress)
    values.set('aoba-progress', progress)
    values.set(LOCAL_PREFERENCE_KEYS.audioLesson, preferences)
    const notify = vi.fn()
    setProgressChangeHook(notify)
    write.mockClear()

    expect(clearAudioLessonPosition('target')).toBe(true)
    expect(loadAudioLessonPosition('target', [first, second])).toBeNull()
    expect(loadAudioLessonPosition('a', [first, second])).toBe(0)
    expect(loadAudioLessonPosition('b', [first, second])).toBe(1)
    expect(JSON.parse(values.get(key)!)).toEqual([previous[0], previous[2]])
    expect(write).toHaveBeenCalledTimes(1)
    expect(write).toHaveBeenCalledWith(key, JSON.stringify([previous[0], previous[2]]))
    expect(values.get('e-learning-meta')).toBe(progress)
    expect(values.get('aoba-progress')).toBe(progress)
    expect(values.get(LOCAL_PREFERENCE_KEYS.audioLesson)).toBe(preferences)
    expect(notify).not.toHaveBeenCalled()
  })

  it('沒有指定課程或位置鍵時不寫入，重複清除也不寫入', () => {
    expect(clearAudioLessonPosition('missing')).toBe(true)
    expect(write).not.toHaveBeenCalled()
    saveAudioLessonPosition('other', first)
    const previous = values.get(key)
    write.mockClear()
    expect(clearAudioLessonPosition('missing')).toBe(true)
    expect(write).not.toHaveBeenCalled()
    expect(values.get(key)).toBe(previous)
    expect(clearAudioLessonPosition('other')).toBe(true)
    expect(values.get(key)).toBe('[]')
    write.mockClear()
    expect(clearAudioLessonPosition('other')).toBe(true)
    expect(write).not.toHaveBeenCalled()
  })

  it('清除不整理其他項目的額外欄位、重複資料或無效項目', () => {
    const untouched = [{ lessonId: 'other', segmentKey: 'a', extra: 1 }, null,
      { lessonId: 'other', segmentKey: 'b' }, { unknown: true }]
    values.set(key, JSON.stringify([...untouched, { lessonId: 'target', segmentKey: 'old' }]))
    expect(clearAudioLessonPosition('target')).toBe(true)
    expect(JSON.parse(values.get(key)!)).toEqual(untouched)
  })

  it.each(['{', 'null', '{}', 'false'])('清除遇到無法辨識的儲存內容時保留原資料並回報失敗：%s', (raw) => {
    values.set(key, raw)
    expect(clearAudioLessonPosition('target')).toBe(false)
    expect(values.get(key)).toBe(raw)
    expect(write).not.toHaveBeenCalled()
  })

  it('清除遇到讀取拒絕時不寫入且保留資料', () => {
    saveAudioLessonPosition('target', first)
    const previous = values.get(key)
    write.mockClear()
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('受控讀取拒絕') }, setItem: write })
    expect(clearAudioLessonPosition('target')).toBe(false)
    expect(write).not.toHaveBeenCalled()
    expect(values.get(key)).toBe(previous)
  })

  it('清除遇到寫入拒絕時回報失敗且保留所有課程', () => {
    saveAudioLessonPosition('target', first)
    saveAudioLessonPosition('other', second)
    const previous = values.get(key)
    write.mockImplementation(() => { throw new Error('受控寫入拒絕') })
    expect(clearAudioLessonPosition('target')).toBe(false)
    expect(values.get(key)).toBe(previous)
  })

  it('清除拒絕空課程識別，沒有本機儲存時也不宣稱成功', () => {
    expect(clearAudioLessonPosition('')).toBe(false)
    expect(write).not.toHaveBeenCalled()
    vi.stubGlobal('localStorage', undefined)
    expect(clearAudioLessonPosition('target')).toBe(false)
  })
})
