import type { MessageKey } from '../../../i18n/messages'
import { CALCULUS_CATALOG } from './calculusCatalog'

export type GradientIntuitionRow = {
  id: string
  catalogId: string
  topicKey: MessageKey
  notation: string
  catalogNeedle: string
}

/**
 * Teaching rows for gradient / directional change.
 * Needles are existing 1-var catalog text; this is not a 108 multivariable unit.
 */
export const GRADIENT_INTUITION_SHEET: GradientIntuitionRow[] = [
  {
    id: 'partial',
    catalogId: 'calc-secant-limit',
    topicKey: 'calculus.grad.partial',
    notation: 'f_x',
    catalogNeedle: '割線斜率在 deltaX 趨近於 0 時的極限收斂為切線斜率',
  },
  {
    id: 'vector',
    catalogId: 'calc-power-rule',
    topicKey: 'calculus.grad.vector',
    notation: '\\nabla f = (f_x, f_y)',
    catalogNeedle: '對 x^n 求導得 n * x^(n-1)',
  },
  {
    id: 'directional',
    catalogId: 'calc-chain-rule',
    topicKey: 'calculus.grad.directional',
    notation: 'D_{\\mathbf{u}} f = \\nabla f \\cdot \\mathbf{u}',
    catalogNeedle: '複合函數求導需乘以內層函數導數',
  },
  {
    id: 'steepest',
    catalogId: 'calc-chain-rule',
    topicKey: 'calculus.grad.steepest',
    notation: '\\max_{|u|=1} D_u f = |\\nabla f|',
    catalogNeedle: '複合函數的變化率是相乘疊加',
  },
]

export function catalogItemText(id: string): string {
  const item = CALCULUS_CATALOG.find((c) => c.id === id)
  if (!item) return ''
  return [item.name, item.description, JSON.stringify(item.distractorPrescriptions)].join('\n')
}
