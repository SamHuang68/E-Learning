import { describe, it, expect } from 'vitest'
import { validateCoursePack, type CoursePack } from './courseValidator'

describe('Course Pack Validator Engine', () => {
  it('validates a well-formed course pack successfully', () => {
    const validPack: CoursePack = {
      schemaVersion: '1.0',
      track: 'math',
      title: '國中幾何精選',
      description: '探索畢氏定理與幾何證明',
      language: 'zh-Hant',
      units: [
        {
          id: 'unit-pythagoras',
          title: '畢氏定理',
          questions: [
            {
              id: 'py-1',
              prompt: '直角三角形兩股為 3 和 4，求斜邊長？',
              choices: ['5', '6', '7', '8'],
              answer: '5',
              topic: '畢氏定理',
            },
          ],
        },
      ],
    }

    const result = validateCoursePack(validPack)
    expect(result.isValid).toBe(true)
    expect(result.errors.length).toBe(0)
    expect(result.stats.totalQuestions).toBe(1)
  })

  it('catches missing answers, duplicate IDs and unclosed LaTeX tags', () => {
    const invalidPack = {
      schemaVersion: '1.0',
      track: 'invalid_track',
      title: '錯誤包',
      units: [
        {
          id: 'u1',
          title: '單元一',
          questions: [
            {
              id: 'dup-id',
              prompt: '未閉合的 KaTeX $x^2 + 1',
              choices: ['A', 'B'],
              answer: 'C', // 答案不在選項中
            },
            {
              id: 'dup-id', // 重複 ID
              prompt: '正常題目',
              choices: ['A'], // 少於 2 個選項
              answer: 'A',
            },
          ],
        },
      ],
    }

    const result = validateCoursePack(invalidPack)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.includes('track'))).toBe(true)
    expect(result.errors.some((e) => e.includes('重複'))).toBe(true)
    expect(result.errors.some((e) => e.includes('不存在於 choices'))).toBe(true)
    expect(result.errors.some((e) => e.includes('KaTeX $'))).toBe(true)
  })
})
