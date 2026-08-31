import React, { useMemo } from 'react'
import katex from 'katex'

export type MathFormulaProps = {
  /** LaTeX 數學算式或包含 $...$ / $$...$$ 的混和文字 */
  math: string
  /** 是否為區塊獨立顯示模式 (預設 false) */
  block?: boolean
  /** 是否為行內模式 (預設 true) */
  inline?: boolean
  /** 自訂 CSS 類別名稱 */
  className?: string
}

/**
 * 將含有 LaTeX 分隔符號 ($...$ 或 $$...$$) 的文字解析並渲染成 KaTeX HTML
 *
 * @param content 原始字串
 * @param isBlockDefault 是否預設為區塊顯示
 * @returns 渲染後的 HTML 字串
 */
function renderMathContent(content: string, isBlockDefault = false): string {
  if (!content) return ''

  // 如果整個字串沒有 $ 符號，且指定為 block 模式：
  // 只有當字串確實為純 LaTeX 指令公式（含 \\ 指令）時才整體交由 KaTeX 渲染；
  // 自然語言詳解文字直接回傳，保留瀏覽器原生自動換行特性。
  if (!content.includes('$') && isBlockDefault) {
    const isPureLatexFormula = /^\s*(\\[a-zA-Z]+|[0-9a-zA-Z\s+\-*/=^_()]+$)/.test(content) && content.includes('\\')
    if (isPureLatexFormula) {
      try {
        return `<div class="katex-block-wrapper">${katex.renderToString(content.trim(), {
          displayMode: true,
          throwOnError: false,
        })}</div>`
      } catch {
        return content
      }
    }
    return content
  }

  // 處理區塊公式 $$...$$ 與行內公式 $...$
  const blockRegex = /\$\$([\s\S]*?)\$\$/g
  const inlineRegex = /\$([^$\n]+?)\$/g

  let processed = content

  // 替換區塊公式
  processed = processed.replace(blockRegex, (_, tex) => {
    try {
      return `<div class="katex-block-wrapper">${katex.renderToString(tex.trim(), {
        displayMode: true,
        throwOnError: false,
      })}</div>`
    } catch {
      return `<div class="katex-error">${tex}</div>`
    }
  })

  // 替換行內公式
  processed = processed.replace(inlineRegex, (_, tex) => {
    try {
      return katex.renderToString(tex.trim(), {
        displayMode: false,
        throwOnError: false,
      })
    } catch {
      return `<span class="katex-error">${tex}</span>`
    }
  })

  return processed
}

/**
 * 數學公式渲染元件 (MathFormula)
 *
 * 提供台灣 K-12 數學教材中使用之各類符號、分數、根號、幾何符號、矩陣與微積分算式渲染。
 */
export const MathFormula: React.FC<MathFormulaProps> = ({
  math,
  block = false,
  className = '',
}) => {
  const hasBlockMath = Boolean(math && math.includes('$$'))
  const isEffectiveBlock = block || hasBlockMath
  const html = useMemo(() => renderMathContent(math, isEffectiveBlock), [math, isEffectiveBlock])

  if (isEffectiveBlock) {
    return (
      <div
        className={`math-formula block-mode ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <span
      className={`math-formula inline-mode ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
