import type { ASTNode } from './ast'

export class MathParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MathParseError'
  }
}

/**
 * 簡易數學字串/表達式解析器 (Pratt / Recursive Descent Parser)
 * 支援多項式、有理函數、三角函數、指數與對數解析
 *
 * 優先序（由低到高）：加減 → 乘除／隱式乘法 → 單元正負號 → 右結合冪次 → 主詞
 * 因此 `-x^2` 解析為 `-(x^2)`，而非 `(-x)^2`。
 */
export class MathParser {
  private pos = 0
  private input = ''

  constructor(input: string) {
    // 預處理：去除空白、統一乘號與括號
    this.input = input.replace(/\s+/g, '').replace(/\\cdot/g, '*').replace(/\\times/g, '*')
  }

  parse(): ASTNode {
    this.pos = 0
    if (!this.input) {
      throw new MathParseError('空表達式')
    }
    const node = this.parseExpression()
    if (this.pos < this.input.length) {
      throw new MathParseError(`多餘字元「${this.input.slice(this.pos)}」`)
    }
    return node
  }

  private peek(): string {
    return this.input[this.pos] ?? ''
  }

  private next(): string {
    return this.input[this.pos++] ?? ''
  }

  private parseExpression(): ASTNode {
    return this.parseAddSub()
  }

  private parseAddSub(): ASTNode {
    let left = this.parseMulDiv()
    while (this.peek() === '+' || this.peek() === '-') {
      const op = this.next() as '+' | '-'
      const right = this.parseMulDiv()
      left = { type: 'binary', op, left, right }
    }
    return left
  }

  private parseMulDiv(): ASTNode {
    let left = this.parseUnary()
    while (true) {
      const ch = this.peek()
      if (ch === '*' || ch === '/') {
        const op = this.next() as '*' | '/'
        const right = this.parseUnary()
        left = { type: 'binary', op, left, right }
        continue
      }
      // 隱式乘法：2x、2sin(x)、(x+1)(x-1)
      if (this.canStartPrimary()) {
        const right = this.parseUnary()
        left = { type: 'binary', op: '*', left, right }
        continue
      }
      break
    }
    return left
  }

  private parseUnary(): ASTNode {
    if (this.peek() === '+') {
      this.next()
      return this.parseUnary()
    }
    if (this.peek() === '-') {
      this.next()
      return { type: 'unary', op: '-', expr: this.parseUnary() }
    }
    return this.parsePower()
  }

  private parsePower(): ASTNode {
    const base = this.parsePrimary()
    if (this.peek() === '^') {
      this.next() // consume '^'
      const exponent = this.parseUnary() // 右結合，且允許 2^-3
      return { type: 'binary', op: '^', left: base, right: exponent }
    }
    return base
  }

  private canStartPrimary(): boolean {
    const ch = this.peek()
    return ch === '(' || /[0-9.]/.test(ch) || /[a-zA-Z]/.test(ch)
  }

  private expectClosingParen(): void {
    if (this.peek() !== ')') {
      throw new MathParseError('括號未閉合')
    }
    this.next()
  }

  private parsePrimary(): ASTNode {
    const ch = this.peek()

    // 括號 ( ... )
    if (ch === '(') {
      this.next()
      const expr = this.parseExpression()
      this.expectClosingParen()
      return expr
    }

    // 數字
    if (/[\d.]/.test(ch)) {
      let numStr = ''
      let dotCount = 0
      while (/[\d.]/.test(this.peek())) {
        const digit = this.next()
        if (digit === '.') {
          dotCount += 1
          if (dotCount > 1) {
            throw new MathParseError('數字格式無效')
          }
        }
        numStr += digit
      }
      if (numStr === '.' || Number.isNaN(Number(numStr))) {
        throw new MathParseError('數字格式無效')
      }
      return { type: 'constant', value: parseFloat(numStr) }
    }

    // 變數或內建函數 (sin, cos, tan, exp, ln, sqrt, x)；e / pi 為常數名稱
    if (/[a-zA-Z]/.test(ch)) {
      let ident = ''
      while (/[a-zA-Z]/.test(this.peek())) {
        ident += this.next()
      }

      if (['sin', 'cos', 'tan', 'exp', 'ln', 'log', 'sqrt'].includes(ident.toLowerCase())) {
        const raw = ident.toLowerCase()
        const funcName = (raw === 'log' ? 'ln' : raw) as 'sin' | 'cos' | 'tan' | 'exp' | 'ln' | 'sqrt'
        if (this.peek() === '(') {
          this.next()
          const arg = this.parseExpression()
          this.expectClosingParen()
          return { type: 'func', name: funcName, arg }
        }
        if (!this.canStartPrimary()) {
          throw new MathParseError(`函數 ${funcName} 缺少引數`)
        }
        const arg = this.parseUnary()
        return { type: 'func', name: funcName, arg }
      }

      return { type: 'variable', name: ident }
    }

    if (!ch) {
      throw new MathParseError('表達式不完整')
    }
    throw new MathParseError(`無法解析「${ch}」`)
  }
}

export function parseMathExpression(exprStr: string): ASTNode {
  const parser = new MathParser(exprStr)
  return parser.parse()
}

export function tryParseMathExpression(
  exprStr: string,
): { ok: true; ast: ASTNode } | { ok: false; error: string } {
  try {
    return { ok: true, ast: parseMathExpression(exprStr) }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : '無法解析表達式',
    }
  }
}
