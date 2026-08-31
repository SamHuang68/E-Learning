/**
 * 微積分表達式抽象語法樹 (Abstract Syntax Tree, AST) 結構定義
 */

export type ASTNode =
  | { type: 'constant'; value: number }
  | { type: 'variable'; name: string }
  | { type: 'binary'; op: '+' | '-' | '*' | '/' | '^'; left: ASTNode; right: ASTNode }
  | { type: 'unary'; op: '-'; expr: ASTNode }
  | { type: 'func'; name: 'sin' | 'cos' | 'tan' | 'exp' | 'ln' | 'sqrt'; arg: ASTNode }

/**
 * 將 AST 節點轉換回標準 LaTeX 算式字串
 */
export function astToLatex(node: ASTNode): string {
  switch (node.type) {
    case 'constant':
      return Number.isInteger(node.value)
        ? node.value.toString()
        : node.value.toFixed(2).replace(/\.?0+$/, '')
    case 'variable':
      return node.name
    case 'unary':
      return `-${astToLatex(node.expr)}`
    case 'binary':
      const l = astToLatex(node.left)
      const r = astToLatex(node.right)
      if (node.op === '+') return `${l} + ${r}`
      if (node.op === '-') return `${l} - ${r}`
      if (node.op === '*') {
        const leftWrap = node.left.type === 'binary' && (node.left.op === '+' || node.left.op === '-')
        const rightWrap = node.right.type === 'binary' && (node.right.op === '+' || node.right.op === '-')
        const lStr = leftWrap ? `(${l})` : l
        const rStr = rightWrap ? `(${r})` : r
        return `${lStr} \\cdot ${rStr}`
      }
      if (node.op === '/') return `\\frac{${l}}{${r}}`
      if (node.op === '^') {
        const lStr = node.left.type === 'binary' || node.left.type === 'unary' ? `(${l})` : l
        return `${lStr}^{${r}}`
      }
      break
    case 'func':
      const argStr = astToLatex(node.arg)
      if (node.name === 'sqrt') return `\\sqrt{${argStr}}`
      if (node.name === 'ln') return `\\ln(${argStr})`
      if (node.name === 'exp') return `e^{${argStr}}`
      return `\\${node.name}(${argStr})`
  }
  return ''
}

/**
 * 將 AST 轉為 JS 可執行求值函數
 */
export function compileASTToFunction(node: ASTNode): (x: number) => number {
  switch (node.type) {
    case 'constant': {
      const val = node.value
      return () => val
    }
    case 'variable':
      return (x: number) => x
    case 'unary': {
      const sub = compileASTToFunction(node.expr)
      return (x: number) => -sub(x)
    }
    case 'binary': {
      const fnL = compileASTToFunction(node.left)
      const fnR = compileASTToFunction(node.right)
      if (node.op === '+') return (x: number) => fnL(x) + fnR(x)
      if (node.op === '-') return (x: number) => fnL(x) - fnR(x)
      if (node.op === '*') return (x: number) => fnL(x) * fnR(x)
      if (node.op === '/') return (x: number) => fnL(x) / (fnR(x) || 1e-12)
      if (node.op === '^') return (x: number) => Math.pow(fnL(x), fnR(x))
      break
    }
    case 'func': {
      const fnArg = compileASTToFunction(node.arg)
      if (node.name === 'sin') return (x: number) => Math.sin(fnArg(x))
      if (node.name === 'cos') return (x: number) => Math.cos(fnArg(x))
      if (node.name === 'tan') return (x: number) => Math.tan(fnArg(x))
      if (node.name === 'exp') return (x: number) => Math.exp(fnArg(x))
      if (node.name === 'ln') return (x: number) => Math.log(Math.max(1e-12, fnArg(x)))
      if (node.name === 'sqrt') return (x: number) => Math.sqrt(Math.max(0, fnArg(x)))
      break
    }
  }
  return () => 0
}
