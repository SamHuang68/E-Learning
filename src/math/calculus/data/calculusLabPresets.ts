import type { CalculusLabMode } from '../types'

export type CalculusLabPreset = {
  label: string
  expr: string
  mode: CalculusLabMode
}

export const PRESET_FUNCTIONS: CalculusLabPreset[] = [
  { label: '拋物線 f(x) = x² - 2x + 2', expr: 'x^2 - 2*x + 2', mode: 'tangent_secant' },
  { label: '三次多項式 f(x) = x³ - 3x + 1', expr: 'x^3 - 3*x + 1', mode: 'optimization_mvt' },
  { label: '定積分拋物線 f(x) = x²', expr: 'x^2', mode: 'riemann_sum' },
  { label: '三角振盪 f(x) = sin(x) + 1.5', expr: 'sin(x) + 1.5', mode: 'ftc_accumulation' },
  { label: '泰勒級數正弦 f(x) = sin(x)', expr: 'sin(x)', mode: 'taylor_series' },
  { label: '牛頓法多項式 f(x) = x³ - 2x - 5', expr: 'x^3 - 2*x - 5', mode: 'newton_slope_field' },
]

export const PRESET_FUNCTIONS_EN: CalculusLabPreset[] = [
  { label: 'Parabola f(x) = x² - 2x + 2', expr: 'x^2 - 2*x + 2', mode: 'tangent_secant' },
  { label: 'Cubic polynomial f(x) = x³ - 3x + 1', expr: 'x^3 - 3*x + 1', mode: 'optimization_mvt' },
  { label: 'Definite-integral parabola f(x) = x²', expr: 'x^2', mode: 'riemann_sum' },
  { label: 'Trigonometric oscillation f(x) = sin(x) + 1.5', expr: 'sin(x) + 1.5', mode: 'ftc_accumulation' },
  { label: 'Taylor series for f(x) = sin(x)', expr: 'sin(x)', mode: 'taylor_series' },
  { label: 'Newton polynomial f(x) = x³ - 2x - 5', expr: 'x^3 - 2*x - 5', mode: 'newton_slope_field' },
]
