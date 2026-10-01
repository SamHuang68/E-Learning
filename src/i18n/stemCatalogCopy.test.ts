import { describe, expect, it } from 'vitest'
import { PHYSICS_GRADES } from '../physics/data/curriculum'
import { CHEMISTRY_GRADES } from '../chemistry/data/curriculum'
import { stemCatalogCopy } from './stemCatalogCopy'

describe('STEM catalog locale coverage', () => {
  it('covers every science course title, summary, and lab entry without changing the Chinese source', () => {
    for (const grade of [...Object.values(PHYSICS_GRADES), ...Object.values(CHEMISTRY_GRADES)]) {
      const labels = [grade.description, ...grade.units.flatMap(unit => [unit.title, unit.subtitle]), ...grade.labs.flatMap(lab => [lab.name, lab.description])]
      for (const label of labels) {
        expect(stemCatalogCopy('en', label), label).not.toMatch(/[\u3400-\u9fff]/)
        expect(stemCatalogCopy('zh-Hant', label)).toBe(label)
      }
    }
  })
  it('rejects missing English metadata rather than silently showing Chinese', () => {
    expect(() => stemCatalogCopy('en', '未定義課名')).toThrow('Missing STEM catalog label')
    expect(stemCatalogCopy('zh-Hant', '未定義課名')).toBe('未定義課名')
  })
})
