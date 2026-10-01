import { describe, expect, it } from 'vitest'
import { CS_CURRICULUM } from '../cs/data/curriculum'
import { csUnitTitle } from './csUnitCopy'

describe('計算機概論單元語系', () => {
  it('全部單元具有英文標題，保留繁體中文來源', () => {
    for (const [index, unit] of CS_CURRICULUM.entries()) {
      expect(csUnitTitle('en', unit)).toMatch(new RegExp(`^Unit ${index + 1}: `))
      expect(csUnitTitle('en', unit)).not.toMatch(/[\u3400-\u9fff]/)
      expect(csUnitTitle('en', unit, false)).not.toMatch(/^Unit /)
      expect(csUnitTitle('zh-Hant', unit)).toBe(unit.title)
    }
  })
})
