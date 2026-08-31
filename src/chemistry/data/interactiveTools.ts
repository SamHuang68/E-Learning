/**
 * 臺灣 108 課綱化學 · 實用神技能教具與參考資料庫
 * 涵蓋：
 * 1. 元素週期表數據庫 (Periodic Table Data: 1~36 號元素完整屬性與電子組態)
 * 2. VSEPR 分子空間幾何與混成軌域對照庫 (Molecular Geometries & Hybridization)
 * 3. 沉澱溶解度規則速查表 (Solubility Rules & Precipitates)
 * 4. 金屬活性與氧化還原電位表 (Metal Activity Series & Reduction Potentials)
 */

export interface PeriodicElement {
  atomicNumber: number
  symbol: string
  name: string
  nameZh: string
  atomicMass: number
  period: number
  group: number
  block: 's' | 'p' | 'd' | 'f'
  category: 'alkali' | 'alkaline_earth' | 'transition' | 'post_transition' | 'metalloid' | 'nonmetal' | 'halogen' | 'noble_gas'
  electronConfig: string
  electronegativity: number | null
}

export const PERIODIC_TABLE_ELEMENTS: PeriodicElement[] = [
  { atomicNumber: 1, symbol: 'H', name: 'Hydrogen', nameZh: '氫', atomicMass: 1.008, period: 1, group: 1, block: 's', category: 'nonmetal', electronConfig: '1s¹', electronegativity: 2.20 },
  { atomicNumber: 2, symbol: 'He', name: 'Helium', nameZh: '氦', atomicMass: 4.003, period: 1, group: 18, block: 's', category: 'noble_gas', electronConfig: '1s²', electronegativity: null },
  { atomicNumber: 3, symbol: 'Li', name: 'Lithium', nameZh: '鋰', atomicMass: 6.941, period: 2, group: 1, block: 's', category: 'alkali', electronConfig: '[He] 2s¹', electronegativity: 0.98 },
  { atomicNumber: 4, symbol: 'Be', name: 'Beryllium', nameZh: '鈹', atomicMass: 9.012, period: 2, group: 2, block: 's', category: 'alkaline_earth', electronConfig: '[He] 2s²', electronegativity: 1.57 },
  { atomicNumber: 5, symbol: 'B', name: 'Boron', nameZh: '硼', atomicMass: 10.81, period: 2, group: 13, block: 'p', category: 'metalloid', electronConfig: '[He] 2s² 2p¹', electronegativity: 2.04 },
  { atomicNumber: 6, symbol: 'C', name: 'Carbon', nameZh: '碳', atomicMass: 12.011, period: 2, group: 14, block: 'p', category: 'nonmetal', electronConfig: '[He] 2s² 2p²', electronegativity: 2.55 },
  { atomicNumber: 7, symbol: 'N', name: 'Nitrogen', nameZh: '氮', atomicMass: 14.007, period: 2, group: 15, block: 'p', category: 'nonmetal', electronConfig: '[He] 2s² 2p³', electronegativity: 3.04 },
  { atomicNumber: 8, symbol: 'O', name: 'Oxygen', nameZh: '氧', atomicMass: 15.999, period: 2, group: 16, block: 'p', category: 'nonmetal', electronConfig: '[He] 2s² 2p⁴', electronegativity: 3.44 },
  { atomicNumber: 9, symbol: 'F', name: 'Fluorine', nameZh: '氟', atomicMass: 18.998, period: 2, group: 17, block: 'p', category: 'halogen', electronConfig: '[He] 2s² 2p⁵', electronegativity: 3.98 },
  { atomicNumber: 10, symbol: 'Ne', name: 'Neon', nameZh: '氖', atomicMass: 20.180, period: 2, group: 18, block: 'p', category: 'noble_gas', electronConfig: '[He] 2s² 2p⁶', electronegativity: null },
  { atomicNumber: 11, symbol: 'Na', name: 'Sodium', nameZh: '鈉', atomicMass: 22.990, period: 3, group: 1, block: 's', category: 'alkali', electronConfig: '[Ne] 3s¹', electronegativity: 0.93 },
  { atomicNumber: 12, symbol: 'Mg', name: 'Magnesium', nameZh: '鎂', atomicMass: 24.305, period: 3, group: 2, block: 's', category: 'alkaline_earth', electronConfig: '[Ne] 3s²', electronegativity: 1.31 },
  { atomicNumber: 13, symbol: 'Al', name: 'Aluminium', nameZh: '鋁', atomicMass: 26.982, period: 3, group: 13, block: 'p', category: 'post_transition', electronConfig: '[Ne] 3s² 3p¹', electronegativity: 1.61 },
  { atomicNumber: 14, symbol: 'Si', name: 'Silicon', nameZh: '矽', atomicMass: 28.085, period: 3, group: 14, block: 'p', category: 'metalloid', electronConfig: '[Ne] 3s² 3p²', electronegativity: 1.90 },
  { atomicNumber: 15, symbol: 'P', name: 'Phosphorus', nameZh: '磷', atomicMass: 30.974, period: 3, group: 15, block: 'p', category: 'nonmetal', electronConfig: '[Ne] 3s² 3p³', electronegativity: 2.19 },
  { atomicNumber: 16, symbol: 'S', name: 'Sulfur', nameZh: '硫', atomicMass: 32.065, period: 3, group: 16, block: 'p', category: 'nonmetal', electronConfig: '[Ne] 3s² 3p⁴', electronegativity: 2.58 },
  { atomicNumber: 17, symbol: 'Cl', name: 'Chlorine', nameZh: '氯', atomicMass: 35.453, period: 3, group: 17, block: 'p', category: 'halogen', electronConfig: '[Ne] 3s² 3p⁵', electronegativity: 3.16 },
  { atomicNumber: 18, symbol: 'Ar', name: 'Argon', nameZh: '氬', atomicMass: 39.948, period: 3, group: 18, block: 'p', category: 'noble_gas', electronConfig: '[Ne] 3s² 3p⁶', electronegativity: null },
  { atomicNumber: 19, symbol: 'K', name: 'Potassium', nameZh: '鉀', atomicMass: 39.098, period: 4, group: 1, block: 's', category: 'alkali', electronConfig: '[Ar] 4s¹', electronegativity: 0.82 },
  { atomicNumber: 20, symbol: 'Ca', name: 'Calcium', nameZh: '鈣', atomicMass: 40.078, period: 4, group: 2, block: 's', category: 'alkaline_earth', electronConfig: '[Ar] 4s²', electronegativity: 1.00 },
  { atomicNumber: 21, symbol: 'Sc', name: 'Scandium', nameZh: '鈧', atomicMass: 44.956, period: 4, group: 3, block: 'd', category: 'transition', electronConfig: '[Ar] 3d¹ 4s²', electronegativity: 1.36 },
  { atomicNumber: 22, symbol: 'Ti', name: 'Titanium', nameZh: '鈦', atomicMass: 47.867, period: 4, group: 4, block: 'd', category: 'transition', electronConfig: '[Ar] 3d² 4s²', electronegativity: 1.54 },
  { atomicNumber: 23, symbol: 'V', name: 'Vanadium', nameZh: '釩', atomicMass: 50.942, period: 4, group: 5, block: 'd', category: 'transition', electronConfig: '[Ar] 3d³ 4s²', electronegativity: 1.63 },
  { atomicNumber: 24, symbol: 'Cr', name: 'Chromium', nameZh: '鉻', atomicMass: 51.996, period: 4, group: 6, block: 'd', category: 'transition', electronConfig: '[Ar] 3d⁵ 4s¹', electronegativity: 1.66 },
  { atomicNumber: 25, symbol: 'Mn', name: 'Manganese', nameZh: '錳', atomicMass: 54.938, period: 4, group: 7, block: 'd', category: 'transition', electronConfig: '[Ar] 3d⁵ 4s²', electronegativity: 1.55 },
  { atomicNumber: 26, symbol: 'Fe', name: 'Iron', nameZh: '鐵', atomicMass: 55.845, period: 4, group: 8, block: 'd', category: 'transition', electronConfig: '[Ar] 3d⁶ 4s²', electronegativity: 1.83 },
  { atomicNumber: 27, symbol: 'Co', name: 'Cobalt', nameZh: '鈷', atomicMass: 58.933, period: 4, group: 9, block: 'd', category: 'transition', electronConfig: '[Ar] 3d⁷ 4s²', electronegativity: 1.88 },
  { atomicNumber: 28, symbol: 'Ni', name: 'Nickel', nameZh: '鎳', atomicMass: 58.693, period: 4, group: 10, block: 'd', category: 'transition', electronConfig: '[Ar] 3d⁸ 4s²', electronegativity: 1.91 },
  { atomicNumber: 29, symbol: 'Cu', name: 'Copper', nameZh: '銅', atomicMass: 63.546, period: 4, group: 11, block: 'd', category: 'transition', electronConfig: '[Ar] 3d¹⁰ 4s¹', electronegativity: 1.90 },
  { atomicNumber: 30, symbol: 'Zn', name: 'Zinc', nameZh: '鋅', atomicMass: 65.38, period: 4, group: 12, block: 'd', category: 'transition', electronConfig: '[Ar] 3d¹⁰ 4s²', electronegativity: 1.65 },
  { atomicNumber: 31, symbol: 'Ga', name: 'Gallium', nameZh: '鎵', atomicMass: 69.723, period: 4, group: 13, block: 'p', category: 'post_transition', electronConfig: '[Ar] 3d¹⁰ 4s² 4p¹', electronegativity: 1.81 },
  { atomicNumber: 32, symbol: 'Ge', name: 'Germanium', nameZh: '鍺', atomicMass: 72.630, period: 4, group: 14, block: 'p', category: 'metalloid', electronConfig: '[Ar] 3d¹⁰ 4s² 4p²', electronegativity: 2.01 },
  { atomicNumber: 33, symbol: 'As', name: 'Arsenic', nameZh: '砷', atomicMass: 74.922, period: 4, group: 15, block: 'p', category: 'metalloid', electronConfig: '[Ar] 3d¹⁰ 4s² 4p³', electronegativity: 2.18 },
  { atomicNumber: 34, symbol: 'Se', name: 'Selenium', nameZh: '硒', atomicMass: 78.971, period: 4, group: 16, block: 'p', category: 'nonmetal', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁴', electronegativity: 2.55 },
  { atomicNumber: 35, symbol: 'Br', name: 'Bromine', nameZh: '溴', atomicMass: 79.904, period: 4, group: 17, block: 'p', category: 'halogen', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵', electronegativity: 2.96 },
  { atomicNumber: 36, symbol: 'Kr', name: 'Krypton', nameZh: '氪', atomicMass: 83.798, period: 4, group: 18, block: 'p', category: 'noble_gas', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁶', electronegativity: 3.00 },
]

export interface VseprShape {
  stericNumber: number
  bondingPairs: number
  lonePairs: number
  formulaType: string
  geometry: string
  geometryZh: string
  hybridization: string
  bondAngle: string
  example: string
}

export const VSEPR_SHAPES: VseprShape[] = [
  { stericNumber: 2, bondingPairs: 2, lonePairs: 0, formulaType: 'AX2', geometry: 'Linear', geometryZh: '直線型', hybridization: 'sp', bondAngle: '180°', example: 'BeCl2, CO2, HCN' },
  { stericNumber: 3, bondingPairs: 3, lonePairs: 0, formulaType: 'AX3', geometry: 'Trigonal Planar', geometryZh: '平面三角形', hybridization: 'sp²', bondAngle: '120°', example: 'BF3, SO3, CO3²⁻' },
  { stericNumber: 3, bondingPairs: 2, lonePairs: 1, formulaType: 'AX2E', geometry: 'Bent', geometryZh: '彎曲型 (角型)', hybridization: 'sp²', bondAngle: '< 120° (~118°)', example: 'SO2, O3, NO2⁻' },
  { stericNumber: 4, bondingPairs: 4, lonePairs: 0, formulaType: 'AX4', geometry: 'Tetrahedral', geometryZh: '正四面體', hybridization: 'sp³', bondAngle: '109.5°', example: 'CH4, CCl4, NH4⁺, SO4²⁻' },
  { stericNumber: 4, bondingPairs: 3, lonePairs: 1, formulaType: 'AX3E', geometry: 'Trigonal Pyramidal', geometryZh: '三角錐型', hybridization: 'sp³', bondAngle: '< 109.5° (107°)', example: 'NH3, PCl3, H3O⁺' },
  { stericNumber: 4, bondingPairs: 2, lonePairs: 2, formulaType: 'AX2E2', geometry: 'Bent', geometryZh: '彎曲型 (角型)', hybridization: 'sp³', bondAngle: '< 109.5° (104.5°)', example: 'H2O, OF2, SCl2' },
  { stericNumber: 5, bondingPairs: 5, lonePairs: 0, formulaType: 'AX5', geometry: 'Trigonal Bipyramidal', geometryZh: '雙三角錐', hybridization: 'sp³d', bondAngle: '90°, 120°', example: 'PCl5, PF5' },
  { stericNumber: 5, bondingPairs: 4, lonePairs: 1, formulaType: 'AX4E', geometry: 'Seesaw', geometryZh: '蹺蹺板型', hybridization: 'sp³d', bondAngle: '< 90°, < 120°', example: 'SF4' },
  { stericNumber: 5, bondingPairs: 3, lonePairs: 2, formulaType: 'AX3E2', geometry: 'T-shaped', geometryZh: 'T字型', hybridization: 'sp³d', bondAngle: '< 90° (~87.5°)', example: 'ClF3, BrF3' },
  { stericNumber: 5, bondingPairs: 2, lonePairs: 3, formulaType: 'AX2E3', geometry: 'Linear', geometryZh: '直線型', hybridization: 'sp³d', bondAngle: '180°', example: 'XeF2, I3⁻' },
  { stericNumber: 6, bondingPairs: 6, lonePairs: 0, formulaType: 'AX6', geometry: 'Octahedral', geometryZh: '正八面體', hybridization: 'sp³d²', bondAngle: '90°', example: 'SF6' },
  { stericNumber: 6, bondingPairs: 5, lonePairs: 1, formulaType: 'AX5E', geometry: 'Square Pyramidal', geometryZh: '四角錐型', hybridization: 'sp³d²', bondAngle: '< 90°', example: 'BrF5, IF5' },
  { stericNumber: 6, bondingPairs: 4, lonePairs: 2, formulaType: 'AX4E2', geometry: 'Square Planar', geometryZh: '平面四邊形', hybridization: 'sp³d²', bondAngle: '90°', example: 'XeF4' },
]

export interface SolubilityRule {
  ion: string
  rule: string
  exceptions: string
  commonPrecipitates: string[]
}

export const SOLUBILITY_RULES: SolubilityRule[] = [
  {
    ion: '鹼金屬離子 (Na⁺, K⁺) & 銨根 (NH₄⁺)',
    rule: '所有鹽類皆完全可溶於水',
    exceptions: '幾乎無例外',
    commonPrecipitates: [],
  },
  {
    ion: '硝酸根 (NO₃⁻) & 醋酸根 (CH₃COO⁻)',
    rule: '所有鹽類皆完全可溶於水',
    exceptions: 'CH₃COOAg 微溶',
    commonPrecipitates: [],
  },
  {
    ion: '氯離子 (Cl⁻), 溴離子 (Br⁻), 碘離子 (I⁻)',
    rule: '大部分可溶',
    exceptions: '遇 Ag⁺, Pb²⁺, Hg₂²⁺, Cu⁺ 沉澱',
    commonPrecipitates: ['AgCl (白)', 'AgBr (淡黃)', 'AgI (黃)', 'PbCl₂ (白，熱水可溶)', 'PbI₂ (亮金黃)'],
  },
  {
    ion: '硫酸根 (SO₄²⁻)',
    rule: '大部分可溶',
    exceptions: '遇 Ba²⁺, Pb²⁺, Sr²⁺, Ca²⁺, Ag⁺ 沉澱或微溶',
    commonPrecipitates: ['BaSO₄ (白，不溶於強酸)', 'PbSO₄ (白)', 'CaSO₄ (白微溶)'],
  },
  {
    ion: '氫氧根 (OH⁻) & 硫離子 (S²⁻)',
    rule: '大部分難溶沉澱',
    exceptions: '鹼金屬、Ba²⁺, Sr²⁺, Ca²⁺, NH₄⁺ 可溶',
    commonPrecipitates: ['Fe(OH)₃ (紅褐)', 'Cu(OH)₂ (藍)', 'Mg(OH)₂ (白)', 'Al(OH)₃ (白膠狀，兩性)', 'CuS (黑)', 'FeS (黑)', 'ZnS (白)'],
  },
  {
    ion: '碳酸根 (CO₃²⁻) & 磷酸根 (PO₄³⁻)',
    rule: '大部分難溶沉澱',
    exceptions: '鹼金屬與 NH₄⁺ 可溶',
    commonPrecipitates: ['CaCO₃ (白)', 'BaCO₃ (白)', 'Ag₃PO₄ (黃)'],
  },
]
