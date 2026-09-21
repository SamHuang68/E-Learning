/**
 * 微積分概念圖譜與 2PL IRT 參數配置
 */

export interface CalculusConceptItem {
  id: string
  name: string
  category: 'limit' | 'derivative' | 'integral' | 'application' | 'series'
  difficulty: number      // IRT b
  discrimination: number  // IRT a
  prerequisites: string[]
  description: string
  distractorPrescriptions: Record<string, { reason: string; action: string }>
}

export const CALCULUS_CATALOG: CalculusConceptItem[] = [
  {
    id: 'calc-secant-limit',
    name: '割線極限與導數定義',
    category: 'derivative',
    difficulty: -0.5,
    discrimination: 1.1,
    prerequisites: [],
    description: '割線斜率在 deltaX 趨近於 0 時的極限收斂為切線斜率。',
    distractorPrescriptions: {
      secant_not_limit: {
        reason: '誤將割線的平均變化率直接當作某點的瞬時導數。',
        action: '請在畫布中拖曳滑桿將 deltaX 縮小至接近 0，觀察斜率如何平滑收斂。',
      },
    },
  },
  {
    id: 'calc-power-rule',
    name: '冪法則與多項式求導',
    category: 'derivative',
    difficulty: -1.0,
    discrimination: 1.3,
    prerequisites: ['calc-secant-limit'],
    description: '對 x^n 求導得 n * x^(n-1)，常數項求導為 0。',
    distractorPrescriptions: {
      power_index_miss: {
        reason: '指數降冪時忘記減 1，或常數項未歸零。',
        action: '使用步驟式解題器核對每一項的降冪過程。',
      },
    },
  },
  {
    id: 'calc-chain-rule',
    name: '複合函數連鎖律',
    category: 'derivative',
    difficulty: 0.6,
    discrimination: 1.5,
    prerequisites: ['calc-power-rule'],
    description: '複合函數求導需乘以內層函數導數：(f(g(x)))’ = f’(g(x)) * g’(x)。',
    distractorPrescriptions: {
      forgot_inner_derivative: {
        reason: '外層求導後忘記乘上內層 g\'(x) 之導函數。',
        action: '開啟齒輪與多軸傳導模型，理解複合函數的變化率是相乘疊加。',
      },
    },
  },
  {
    id: 'calc-riemann-sum',
    name: '黎曼和與定積分分割',
    category: 'integral',
    difficulty: 0.2,
    discrimination: 1.4,
    prerequisites: ['calc-power-rule'],
    description: '利用階梯矩形分割逼近曲線下面積，當 N 趨近無窮大時收斂至定積分。',
    distractorPrescriptions: {
      riemann_bound_err: {
        reason: '取樣端點混淆，導致過剩或不足估算出現偏差。',
        action: '開啟黎曼和誤差收斂譜，觀察左/中/右端點法在不同 N 下的夾擠趨勢。',
      },
    },
  },
  {
    id: 'calc-ftc-accumulation',
    name: '微積分基本定理 (FTC)',
    category: 'integral',
    difficulty: 0.8,
    discrimination: 1.6,
    prerequisites: ['calc-riemann-sum', 'calc-chain-rule'],
    description: '累積函數面積之瞬時變化率剛好等於被積函數的高度：d/dx [∫ f(t)dt] = f(x)。',
    distractorPrescriptions: {
      ftc_symbol_only: {
        reason: '僅將積分視為反導算則，未理解面積增量比率與高度的因果關係。',
        action: '前往 FTC 雙圖連動實驗室，觀察上方微元長條與下方切線斜率的同步跳動。',
      },
    },
  },
  {
    id: 'calc-newton-raphson',
    name: '牛頓法切線求根',
    category: 'application',
    difficulty: 1.2,
    discrimination: 1.4,
    prerequisites: ['calc-power-rule'],
    description: '利用局部切線與 x 軸交點進行快速迭代求根：x_{k+1} = x_k - f(x_k)/f’(x_k)。',
    distractorPrescriptions: {
      tangent_zero_div: {
        reason: "在水平切線處 (f'(x) ~= 0) 迭代導致數值除以零發散。",
        action: '觀察畫布上的水平切線軌跡，並重新挑選適當的初始猜測點 x0。',
      },
    },
  },
  {
    id: 'calc-product-rule',
    name: '乘積法則 (Product Rule)',
    category: 'derivative',
    difficulty: 0.3,
    discrimination: 1.4,
    prerequisites: ['calc-power-rule'],
    description: '兩函數乘積之導數：(uv)\' = u\'v + uv\'。支援中英雙語步驟說明。',
    distractorPrescriptions: {
      forgot_product: {
        reason: '僅對一項求導而忽略另一項，或誤用商法則。',
        action: '在步驟推導器中明確標註 u\'v + uv\' 兩項。',
      },
    },
  },
  {
    id: 'calc-u-substitution',
    name: 'u-替換積分法 / u-Substitution',
    category: 'integral',
    difficulty: 0.9,
    discrimination: 1.5,
    prerequisites: ['calc-ftc', 'calc-chain-rule'],
    description: '透過 u = g(x) 簡化 ∫ f(g(x)) g\'(x) dx 為 ∫ f(u) du。',
    distractorPrescriptions: {
      wrong_du: {
        reason: '忘記計算 du = g\'(x) dx 或代換後未更新積分上下限。',
        action: '在推導步驟中明確寫出 du 並檢查邊界。',
      },
    },
  },
]
