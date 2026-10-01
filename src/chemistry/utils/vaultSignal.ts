import type { ChemistryQuestion } from '../data/curriculum'
import { CHEMISTRY_SOLVING_SIGNALS } from '../data/solvingSignals'

// Reviewed associations avoid substring matches in Chinese and unrelated fallback signals.
export const CHEMISTRY_VAULT_SIGNALS: Readonly<Record<string, string>> = {
  g7_u1_q2: 'sig-solubility-cooling',
  g8_u4_q6: 'sig-mass-conservation-limiting',
  g10_u3_q3: 'sig-combustion-analysis',
  g10_u6_q1: 'sig-atom-economy',
  g11_u7_q1: 'sig-water-vapor-pressure',
  g11_u7_q2: 'sig-graham-diffusion',
  g11_u8_q1: 'sig-colligative-freezing',
  g11_u9_q2: 'sig-vsepr-hybridization',
  g11_u10_q2: 'sig-rate-law-half-life',
  g12_u12_q1: 'sig-weak-acid-ph',
  g12_u13_q1: 'sig-buffer-henderson',
  g12_u15_q1: 'sig-cell-potential',
  g12_u16_q1: 'sig-faraday-electrolysis',
  gsat_q1: 'sig-atom-economy',
  ast_q2: 'sig-buffer-henderson',
}

export function findMatchingChemistrySignal(q: ChemistryQuestion) {
  const id = Object.hasOwn(CHEMISTRY_VAULT_SIGNALS, q.id) ? CHEMISTRY_VAULT_SIGNALS[q.id] : undefined
  return CHEMISTRY_SOLVING_SIGNALS.find(signal => signal.id === id && signal.strand === q.strand)
}
