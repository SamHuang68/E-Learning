export const CALCULUS_PRESET_ZH = {
  'calculus.preset.quad': '拋物線二次函數: f(x) = x^2 - 2x + 2',
  'calculus.preset.cubic': '三次多項式極值: f(x) = x^3 - 3x',
  'calculus.preset.sin': '正弦週期函數: f(x) = sin(x)',
  'calculus.preset.exp': '自然指數函數: f(x) = e^x',
  'calculus.preset.rational': '有理函數: f(x) = 1 / (1 + x^2)',
  'calculus.preset.semi': '半拋物線定積分: f(x) = 4 - x^2',
  'calculus.preset.quartic': '高次多項式: f(x) = x^4 - 4x^2',
  'calculus.badgesHall': '微積分認知微認證成就館',
} as const

export const CALCULUS_PRESET_EN: { [K in keyof typeof CALCULUS_PRESET_ZH]: string } = {
  'calculus.preset.quad': 'Parabola: f(x) = x^2 - 2x + 2',
  'calculus.preset.cubic': 'Cubic extrema: f(x) = x^3 - 3x',
  'calculus.preset.sin': 'Sine: f(x) = sin(x)',
  'calculus.preset.exp': 'Exponential: f(x) = e^x',
  'calculus.preset.rational': 'Rational: f(x) = 1 / (1 + x^2)',
  'calculus.preset.semi': 'Semi-parabola integral: f(x) = 4 - x^2',
  'calculus.preset.quartic': 'Quartic: f(x) = x^4 - 4x^2',
  'calculus.badgesHall': 'Calculus micro-credential hall',
}
