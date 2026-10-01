import type { UiLocale } from './locale'
import { ChunkLoadError } from '../utils/chunkLoadError'

let english: Readonly<Record<string, string>> = {}
let pending: Promise<void> | undefined

export function loadStemConceptCopy() {
  return pending ??= Promise.all([
    import('./chemistryConceptContentEn'),
    import('./physicsConceptContentEn'),
  ]).then(([chemistry, physics]) => {
    english = { ...chemistry.CHEMISTRY_CONCEPT_CONTENT_EN, ...physics.PHYSICS_CONCEPT_CONTENT_EN }
  }).catch(cause => {
    throw new ChunkLoadError('Unable to load English STEM concepts. Reload to retry.', { cause })
  })
}

export function stemConceptCopy(locale: UiLocale, source: string): string {
  if (locale !== 'en') return source
  if (!Object.hasOwn(english, source)) throw new Error('Missing English STEM concept: ' + source)
  const result = english[source]
  if (!result.trim() || /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/.test(result)) {
    throw new Error('Invalid English STEM concept: ' + source)
  }
  return result
}
