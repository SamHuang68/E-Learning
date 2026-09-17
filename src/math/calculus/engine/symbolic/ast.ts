/**
 * 微積分表達式抽象語法樹 (Abstract Syntax Tree, AST) 結構定義
 */

export type ASTNode =
  | { type: 'constant'; value: number }
  | { type: 'variable'; name: string }
  | { type: 'binary'; op: '+' | '-' | '*' | '/' | '^'; left: ASTNode; right: ASTNode }
  | { type: 'unary'; op: '-'; expr: ASTNode }
  | { type: 'func'; name: 'sin' | 'cos' | 'tan' | 'exp' | 'ln' | 'sqrt'; arg: ASTNode }

export function isEulerName(name: string): boolean {
  return name === 'e' || name === 'E'
}

export function isPiName(name: string): boolean {
  return name === 'pi' || name === 'PI' || name === 'Pi'
}

/** 畫布／圖例用的有限數值格式；NaN／Infinity 不偽裝成一般實數。 */
export function formatCalcNumber(n: number): string {
  if (Number.isNaN(n)) return '未定義'
  if (n === Infinity) return '∞'
  if (n === -Infinity) return '-∞'
  if (!Number.isFinite(n)) return '未定義'
  if (Number.isInteger(n)) return String(n)
  return n.toFixed(5).replace(/\.?0+$/, '')
}

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
      if (isEulerName(node.name)) return 'e'
      if (isPiName(node.name)) return '\\pi'
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
      if (isEulerName(node.name)) return () => Math.E
      if (isPiName(node.name)) return () => Math.PI
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
      // 真實除法：0 分母必須是 Infinity / NaN，不得改寫成 1e12
      if (node.op === '/') return (x: number) => fnL(x) / fnR(x)
      if (node.op === '^') return (x: number) => Math.pow(fnL(x), fnR(x))
      break
    }
    case 'func': {
      const fnArg = compileASTToFunction(node.arg)
      if (node.name === 'sin') return (x: number) => Math.sin(fnArg(x))
      if (node.name === 'cos') return (x: number) => Math.cos(fnArg(x))
      if (node.name === 'tan') return (x: number) => Math.tan(fnArg(x))
      if (node.name === 'exp') return (x: number) => Math.exp(fnArg(x))
      // 定義域錯誤傳回 NaN，不得夾成 0 或極小正數
      if (node.name === 'ln') {
        return (x: number) => {
          const arg = fnArg(x)
          return arg > 0 ? Math.log(arg) : Number.NaN
        }
      }
      if (node.name === 'sqrt') {
        return (x: number) => {
          const arg = fnArg(x)
          return arg >= 0 ? Math.sqrt(arg) : Number.NaN
        }
      }
      break
    }
  }
  return () => 0
}
