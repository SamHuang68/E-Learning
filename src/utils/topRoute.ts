import type { AppView } from './storage'

export type TopView = AppView | 'privacy'

/** Parse only the first complete hash segment; unrelated prefixes fall back. */
export function parseTopViewHash(rawHash: string): TopView {
  const segment = rawHash.replace(/^#/, '').trim().split(/[/?&]/, 1)[0].toLowerCase()
  if (segment === 'privacy') return 'privacy'
  if (segment === 'en' || segment === 'toeic') return 'en'
  if (segment === 'zh' || segment === 'chinese' || segment === 'mandarin' || segment === 'huayu') return 'zh'
  if (segment === 'calculus' || segment === 'calc') return 'calculus'
  if (segment === 'physics' || segment === 'phys') return 'physics'
  if (segment === 'chemistry' || segment === 'chem') return 'chemistry'
  if (segment === 'cs' || segment === 'compsci' || segment === 'computer') return 'cs'
  if (segment === 'math') return 'math'
  if (segment === 'ja' || segment === 'aoba' || segment === 'builder') return 'ja'
  return 'hub'
}
