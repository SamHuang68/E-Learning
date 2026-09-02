import { describe, it, expect } from 'vitest'

/**
 * 編譯器運算式解析：Dijkstra 的 Shunting-Yard (調度場演算法)
 * 將中序表示法 (Infix) 轉換為後序逆波蘭表示法 (Reverse Polish Notation, RPN)
 */
export function infixToRpn(expression: string): string[] {
  const outputQueue: string[] = []
  const operatorStack: string[] = []

  const precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3,
  }

  const isRightAssociative = (op: string) => op === '^'

  const tokens = expression.match(/\d+|[+\-*/^()]/g) || []

  for (const token of tokens) {
    if (/^\d+$/.test(token)) {
      outputQueue.push(token)
    } else if (token in precedence) {
      const op1 = token
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== '('
      ) {
        const op2 = operatorStack[operatorStack.length - 1]
        if (
          (isRightAssociative(op1) && precedence[op1] < precedence[op2]) ||
          (!isRightAssociative(op1) && precedence[op1] <= precedence[op2])
        ) {
          outputQueue.push(operatorStack.pop()!)
        } else {
          break
        }
      }
      operatorStack.push(op1)
    } else if (token === '(') {
      operatorStack.push(token)
    } else if (token === ')') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop()!)
      }
      operatorStack.pop() // 彈出 '('
    }
  }

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop()!)
  }

  return outputQueue
}

/**
 * 逆波蘭表示法 (RPN) 堆疊求值引擎
 */
export function evaluateRpn(rpnTokens: string[]): number {
  const stack: number[] = []

  for (const token of rpnTokens) {
    if (/^\d+$/.test(token)) {
      stack.push(Number(token))
    } else {
      const b = stack.pop()!
      const a = stack.pop()!
      switch (token) {
        case '+':
          stack.push(a + b)
          break
        case '-':
          stack.push(a - b)
          break
        case '*':
          stack.push(a * b)
          break
        case '/':
          stack.push(a / b)
          break
        case '^':
          stack.push(Math.pow(a, b))
          break
      }
    }
  }

  return stack[0]
}

describe('編譯器演算法：Shunting-Yard 運算式解析與 RPN 求值單元測試', () => {
  it('中序運算式 3 + 4 * 2 / ( 1 - 5 ) ^ 2 正確轉換為後序 RPN 序列', () => {
    // 運算順序：括號優先 (1 - 5 = -4) -> 冪次 (-4)^2 = 16 -> 乘除 4 * 2 = 8, 8 / 16 = 0.5 -> 加法 3 + 0.5 = 3.5
    const expr = '3 + 4 * 2 / ( 1 - 5 ) ^ 2'
    const rpn = infixToRpn(expr)

    expect(rpn).toEqual(['3', '4', '2', '*', '1', '5', '-', '2', '^', '/', '+'])
  })

  it('RPN 堆疊求值引擎正確計算出運算式數值結果為 3.5', () => {
    const expr = '3 + 4 * 2 / ( 1 - 5 ) ^ 2'
    const rpn = infixToRpn(expr)
    const result = evaluateRpn(rpn)

    // 3 + (8 / 16) = 3.5
    expect(result).toBe(3.5)
  })
})
