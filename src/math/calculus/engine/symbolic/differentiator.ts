import type { ASTNode } from './ast'

/**
 * 代數化簡器 (Simplifier)：消除 0、1、負號與基本恆等式
 */
export function simplifyAST(node: ASTNode): ASTNode {
  switch (node.type) {
    case 'constant':
    case 'variable':
      return node

    case 'unary': {
      const simplifiedExpr = simplifyAST(node.expr)
      if (simplifiedExpr.type === 'constant') {
        return { type: 'constant', value: -simplifiedExpr.value }
      }
      if (simplifiedExpr.type === 'unary' && simplifiedExpr.op === '-') {
        return simplifiedExpr.expr
      }
      return { type: 'unary', op: '-', expr: simplifiedExpr }
    }

    case 'binary': {
      const left = simplifyAST(node.left)
      const right = simplifyAST(node.right)
      const { op } = node

      // 常數摺疊 (Constant Folding)
      if (left.type === 'constant' && right.type === 'constant') {
        if (op === '+') return { type: 'constant', value: left.value + right.value }
        if (op === '-') return { type: 'constant', value: left.value - right.value }
        if (op === '*') return { type: 'constant', value: left.value * right.value }
        if (op === '/' && right.value !== 0) return { type: 'constant', value: left.value / right.value }
        if (op === '^') return { type: 'constant', value: Math.pow(left.value, right.value) }
      }

      // 加法化簡
      if (op === '+') {
        if (left.type === 'constant' && left.value === 0) return right
        if (right.type === 'constant' && right.value === 0) return left
      }

      // 減法化簡
      if (op === '-') {
        if (right.type === 'constant' && right.value === 0) return left
        if (left.type === 'constant' && left.value === 0) {
          return { type: 'unary', op: '-', expr: right }
        }
      }

      // 乘法化簡
      if (op === '*') {
        if ((left.type === 'constant' && left.value === 0) || (right.type === 'constant' && right.value === 0)) {
          return { type: 'constant', value: 0 }
        }
        if (left.type === 'constant' && left.value === 1) return right
        if (right.type === 'constant' && right.value === 1) return left
      }

      // 次方化簡
      if (op === '^') {
        if (right.type === 'constant' && right.value === 0) return { type: 'constant', value: 1 }
        if (right.type === 'constant' && right.value === 1) return left
        if (left.type === 'constant' && left.value === 1) return { type: 'constant', value: 1 }
      }

      return { type: 'binary', op, left, right }
    }

    case 'func':
      return { type: 'func', name: node.name, arg: simplifyAST(node.arg) }
  }
}

/**
 * 符號微分器 (Symbolic Differentiator)
 * 支援常數、冪、乘積律、商法則與連鎖律
 */
export function differentiateAST(node: ASTNode, wrt = 'x'): ASTNode {
  switch (node.type) {
    case 'constant':
      return { type: 'constant', value: 0 }

    case 'variable':
      return { type: 'constant', value: node.name === wrt ? 1 : 0 }

    case 'unary':
      return { type: 'unary', op: '-', expr: differentiateAST(node.expr, wrt) }

    case 'binary': {
      const { op, left, right } = node
      if (op === '+' || op === '-') {
        return simplifyAST({
          type: 'binary',
          op,
          left: differentiateAST(left, wrt),
          right: differentiateAST(right, wrt),
        })
      }

      if (op === '*') {
        // 乘積律: (uv)' = u'v + uv'
        const uPrime = differentiateAST(left, wrt)
        const vPrime = differentiateAST(right, wrt)
        return simplifyAST({
          type: 'binary',
          op: '+',
          left: { type: 'binary', op: '*', left: uPrime, right },
          right: { type: 'binary', op: '*', left, right: vPrime },
        })
      }

      if (op === '/') {
        // 商法則: (u/v)' = (u'v - uv') / v^2
        const uPrime = differentiateAST(left, wrt)
        const vPrime = differentiateAST(right, wrt)
        return simplifyAST({
          type: 'binary',
          op: '/',
          left: {
            type: 'binary',
            op: '-',
            left: { type: 'binary', op: '*', left: uPrime, right },
            right: { type: 'binary', op: '*', left, right: vPrime },
          },
          right: { type: 'binary', op: '^', left: right, right: { type: 'constant', value: 2 } },
        })
      }

      if (op === '^') {
        // 冪法則與連鎖律: (u^n)' = n * u^(n-1) * u'
        if (right.type === 'constant') {
          const n = right.value
          const uPrime = differentiateAST(left, wrt)
          return simplifyAST({
            type: 'binary',
            op: '*',
            left: {
              type: 'binary',
              op: '*',
              left: { type: 'constant', value: n },
              right: {
                type: 'binary',
                op: '^',
                left,
                right: { type: 'constant', value: n - 1 },
              },
            },
            right: uPrime,
          })
        }
      }
      break
    }

    case 'func': {
      // 函數連鎖律: f(g(x))' = f'(g(x)) * g'(x)
      const innerDiff = differentiateAST(node.arg, wrt)
      if (node.name === 'sin') {
        return simplifyAST({
          type: 'binary',
          op: '*',
          left: { type: 'func', name: 'cos', arg: node.arg },
          right: innerDiff,
        })
      }
      if (node.name === 'cos') {
        return simplifyAST({
          type: 'binary',
          op: '*',
          left: { type: 'unary', op: '-', expr: { type: 'func', name: 'sin', arg: node.arg } },
          right: innerDiff,
        })
      }
      if (node.name === 'exp') {
        return simplifyAST({
          type: 'binary',
          op: '*',
          left: { type: 'func', name: 'exp', arg: node.arg },
          right: innerDiff,
        })
      }
      if (node.name === 'ln') {
        return simplifyAST({
          type: 'binary',
          op: '/',
          left: innerDiff,
          right: node.arg,
        })
      }
      if (node.name === 'sqrt') {
        // (sqrt(u))' = u' / (2 * sqrt(u))
        return simplifyAST({
          type: 'binary',
          op: '/',
          left: innerDiff,
          right: {
            type: 'binary',
            op: '*',
            left: { type: 'constant', value: 2 },
            right: { type: 'func', name: 'sqrt', arg: node.arg },
          },
        })
      }
      break
    }
  }
  return { type: 'constant', value: 0 }
}
