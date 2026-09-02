/**
 * Canonical browser-storage keys for learner-owned progress.
 *
 * Keep export/import/clear logic and each track store on this registry so a
 * renamed key cannot silently strand or omit a learner's data.
 */
export const PROGRESS_STORAGE_KEYS = {
  math: 'math-learning-progress',
  physics: 'physics-learning-progress',
  chemistry: 'chemistry-learning-progress',
  cs: 'cs-learning-progress',
  mathSignals: 'math_signals_mastery_v1',
  physicsSignals: 'physics_signals_mastery_v1',
  chemistrySignals: 'chemistry_signals_mastery_v1',
  csSignals: 'cs_signals_mastery_v1',
} as const

export const LOCAL_PREFERENCE_KEYS = {
  accessibility: 'e-learning-a11y-settings',
  audioMuted: 'learning_audio_muted_v1',
} as const
