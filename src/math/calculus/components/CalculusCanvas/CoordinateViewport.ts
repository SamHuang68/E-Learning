import type { ViewportTransform } from '../../types'

/**
 * 視口座標轉換矩陣與自適應格線演算法
 */
export class CoordinateViewport {
  transform: ViewportTransform

  constructor(transform: ViewportTransform) {
    this.transform = transform
  }

  toScreenX(mathX: number): number {
    const { minX, maxX, width } = this.transform
    return ((mathX - minX) / (maxX - minX)) * width
  }

  toScreenY(mathY: number): number {
    const { minY, maxY, height } = this.transform
    return height - ((mathY - minY) / (maxY - minY)) * height
  }

  toMathX(screenX: number): number {
    const { minX, maxX, width } = this.transform
    return minX + (screenX / width) * (maxX - minX)
  }

  toMathY(screenY: number): number {
    const { minY, maxY, height } = this.transform
    return maxY - (screenY / height) * (maxY - minY)
  }

  /**
   * 自適應格線刻度演算法 (依據視窗縮放比自動挑選 0.2, 0.5, 1, 2, 5...)
   */
  getAdaptiveGridSteps(): { stepX: number; stepY: number } {
    const spanX = this.transform.maxX - this.transform.minX
    const rawStepX = spanX / 10
    const powerX = Math.pow(10, Math.floor(Math.log10(rawStepX || 1)))
    let stepX = powerX
    if (rawStepX / powerX >= 5) stepX = 5 * powerX
    else if (rawStepX / powerX >= 2) stepX = 2 * powerX

    const spanY = this.transform.maxY - this.transform.minY
    const rawStepY = spanY / 8
    const powerY = Math.pow(10, Math.floor(Math.log10(rawStepY || 1)))
    let stepY = powerY
    if (rawStepY / powerY >= 5) stepY = 5 * powerY
    else if (rawStepY / powerY >= 2) stepY = 2 * powerY

    return { stepX, stepY }
  }
}
