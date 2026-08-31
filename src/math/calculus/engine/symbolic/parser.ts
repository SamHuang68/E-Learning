import type { ASTNode } from './ast'

/**
 * 簡易數學字串/表達式解析器 (Pratt / Recursive Descent Parser)
 * 支援多項式、有理函數、三角函數、指數與對數解析
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
    const node = this.parseExpression()
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
    let left = this.parsePower()
    while (this.peek() === '*' || this.peek() === '/') {
      const op = this.next() as '*' | '/'
      const right = this.parsePower()
      left = { type: 'binary', op, left, right }
    }
    return left
  }

  private parsePower(): ASTNode {
    let base = this.parseUnary()
    if (this.peek() === '^') {
      this.next() // consume '^'
      const exponent = this.parsePower() // 右結合
      base = { type: 'binary', op: '^', left: base, right: exponent }
    }
    return base
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
    return this.parsePrimary()
  }

  private parsePrimary(): ASTNode {
    const ch = this.peek()

    // 括號 ( ... )
    if (ch === '(') {
      this.next()
      const expr = this.parseExpression()
      if (this.peek() === ')') this.next()
      return expr
    }

    // 數字
    if (/[\d.]/.test(ch)) {
      let numStr = ''
      while (/[\d.]/.test(this.peek())) {
        numStr += this.next()
      }
      return { type: 'constant', value: parseFloat(numStr) }
    }

    // 變數或內建函數 (sin, cos, tan, exp, ln, sqrt, x)
    if (/[a-zA-Z]/.test(ch)) {
      let ident = ''
      while (/[a-zA-Z]/.test(this.peek())) {
        ident += this.next()
      }

      if (['sin', 'cos', 'tan', 'exp', 'ln', 'sqrt'].includes(ident.toLowerCase())) {
        const funcName = ident.toLowerCase() as 'sin' | 'cos' | 'tan' | 'exp' | 'ln' | 'sqrt'
        if (this.peek() === '(') {
          this.next()
          const arg = this.parseExpression()
          if (this.peek() === ')') this.next()
          return { type: 'func', name: funcName, arg }
        }
        const arg = this.parsePrimary()
        return { type: 'func', name: funcName, arg }
      }

      return { type: 'variable', name: ident }
    }

    // 預設 fallback
    this.next()
    return { type: 'constant', value: 0 }
  }
}

export function parseMathExpression(exprStr: string): ASTNode {
  try {
    const parser = new MathParser(exprStr)
    return parser.parse()
  } catch {
    // 預設二次拋物線
    return {
      type: 'binary',
      op: '+',
      left: {
        type: 'binary',
        op: '^',
        left: { type: 'variable', name: 'x' },
        right: { type: 'constant', value: 2 },
      },
      right: { type: 'constant', value: 1 },
    }
  }
}
