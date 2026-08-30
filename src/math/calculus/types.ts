/**
 * 微積分互動專題 (Calculus Interactive Studio) 全域型別定義
 */

export interface ViewportTransform {
  minX: number
  maxX: number
  minY: number
  maxY: number
  width: number
  height: number
}

export type CalculusLabMode =
  | 'limit_epsilon'      // 極限逼近與 epsilon-delta 容忍框
  | 'tangent_secant'     // 割線極限與局部線性化放大鏡
  | 'optimization_mvt'   // 均值定理與極值最佳化
  | 'riemann_sum'        // 黎曼和定積分分割與收斂譜
  | 'ftc_accumulation'   // 微積分基本定理 (FTC) 雙圖因果連動
  | 'solids_revolution'  // 旋轉體 2.5D/3D 切片展開 (圓盤 vs 圓柱殼)
  | 'taylor_series'      // 泰勒多項式密切曲線與收斂半徑
  | 'newton_slope_field' // 牛頓切線求根與斜率場流線

export type RiemannMethod = 'left' | 'right' | 'midpoint' | 'trapezoidal' | 'simpson'

export interface CalculusProblem {
  id: string
  title: string
  tier: 'L1' | 'L2' | 'L3' | 'L4'
  tierLabel: '觀念探究' | '雙向推導' | '情境建模' | '反例思辨'
  conceptTag: string
  questionText: string
  defaultExpr: string
  defaultParams: {
    x0?: number
    deltaX?: number
    intA?: number
    intB?: number
    slicesN?: number
    taylorOrder?: number
    newtonSteps?: number
    epsilon?: number
  }
  targetMode: CalculusLabMode
  derivationSteps: DerivationStep[]
  difficulty: number
  options?: string[]
  correctIndex?: number
  explanation: string
}

export interface DerivationStep {
  id: string
  stepNumber: number
  ruleName: string
  ruleLatex: string
  beforeLatex: string
  afterLatex: string
  explanation: string
  keyInsight: string
  checkpoint?: {
    prompt: string
    options: string[]
    correctIndex: number
    hint: string
  }
}

export interface CalculusCanvasProps {
  expression: string
  mode: CalculusLabMode
  x0?: number
  deltaX?: number
  intA?: number
  intB?: number
  slicesN?: number
  riemannMethod?: RiemannMethod
  taylorOrder?: number
  newtonSteps?: number
  epsilon?: number
  solidMethod?: 'disk' | 'shell'
  rotationAngle?: number
  onParamChange?: (params: {
    x0?: number
    deltaX?: number
    intA?: number
    intB?: number
    slicesN?: number
    epsilon?: number
    taylorOrder?: number
    rotationAngle?: number
  }) => void
  onCanvasTelemetry?: (event: { action: string; value: number }) => void
  className?: string
}
