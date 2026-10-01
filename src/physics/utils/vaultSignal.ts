import type { PhysicsQuestion } from '../data/curriculum'
import { PHYSICS_SOLVING_SIGNALS } from '../data/solvingSignals'

// Reviewed associations: a shared strand alone never establishes a solution method.
export const PHYSICS_VAULT_SIGNALS: Readonly<Record<string, string>> = {
  g7_u2_q1: 'sig-j-density',
  g7_u3_q1: 'sig-j-heat',
  g8_u4_q1: 'sig-j-buoyancy',
  g9_u4_q1: 'sig-j-circuits',
  g10_u6_q1: 'sig-photoelectric-cutoff',
  g11_u1_q1: 'sig-projectile-ortho',
  g11_u2_q1: 'sig-system-acc',
  g11_u4_q1: 'sig-momentum-collision',
  g11_u5_q1: 'sig-satellite-energy',
  g11_u6_q1: 'sig-shm-frequency',
  g11_u7_q1: 'sig-doppler-frequency',
  g12_u1_q1: 'sig-gas-rms-speed',
  g12_u2_q1: 'sig-double-slit-fringe',
  g12_u5_q1: 'sig-lorentz-cyclotron',
  mock_cap_q1: 'sig-j-buoyancy',
  mock_cap_q2: 'sig-j-heat',
  mock_gsat_q3: 'sig-photoelectric-cutoff',
  mock_ast_q1: 'sig-momentum-collision',
  mock_ast_q2: 'sig-lorentz-cyclotron',
  mock_ast_q3: 'sig-double-slit-fringe',
  mock_ast_q4: 'sig-shm-frequency',
}

export function findMatchingSignal(q: PhysicsQuestion) {
  const id = Object.hasOwn(PHYSICS_VAULT_SIGNALS, q.id) ? PHYSICS_VAULT_SIGNALS[q.id] : undefined
  return PHYSICS_SOLVING_SIGNALS.find(signal => signal.id === id && signal.strand === q.strand)
}
