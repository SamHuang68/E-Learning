import { describe, expect, it } from 'vitest'
import { parseTopViewHash } from './topRoute'

describe('top-level hash parser', () => {
  it.each([
    ['#hub', 'hub'],
    ['#aoba', 'ja'],
    ['#aoba/today', 'ja'],
    ['#toeic', 'en'],
    ['#math', 'math'],
    ['#calculus', 'calculus'],
    ['#physics', 'physics'],
    ['#chemistry', 'chemistry'],
    ['#privacy', 'privacy'],
  ])('maps %s to %s', (hash, expected) => {
    expect(parseTopViewHash(hash)).toBe(expected)
  })

  it.each(['#calculate', '#physical', '#chemotherapy', '#mathematics']) (
    'does not accept unrelated prefix %s',
    (hash) => expect(parseTopViewHash(hash)).toBe('hub'),
  )
})
