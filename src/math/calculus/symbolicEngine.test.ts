import { describe, expect, it } from 'vitest'
import {
  parseMathExpression,
  tryParseMathExpression,
  MathParseError,
  compileASTToFunction,
  differentiateAST,
  generateDerivationSteps,
  outerDifferentiationRuleIndex,
  formatCalcNumber,
  validateSymbols,
  UndefinedSymbolError,
} from './engine'

function evalAt(expr: string, x: number): number {
  return compileASTToFunction(parseMathExpression(expr))(x)
}

describe('P0-1 calculus symbolic acceptance probes', () => {
  it('-x^2 uses unary-minus below power: f(2)=-4, f(1.5)=-2.25, f\'(1.5)=-3', () => {
    const ast = parseMathExpression('-x^2')
    expect(ast.type).toBe('unary')
    const f = compileASTToFunction(ast)
    const fp = compileASTToFunction(differentiateAST(ast, 'x'))
    expect(f(2)).toBe(-4)
    expect(f(1.5)).toBeCloseTo(-2.25, 10)
    expect(fp(1.5)).toBeCloseTo(-3, 10)
    expect(f(2)).not.toBe(4)
  })

  it('implicit multiplication: 2x at x=3 is 6, not 2', () => {
    expect(evalAt('2x', 3)).toBe(6)
    expect(evalAt('2x', 3)).not.toBe(2)
    expect(evalAt('2sin(0)', 0)).toBeCloseTo(0, 10)
    expect(evalAt('2x^2', 3)).toBe(18)
  })

  it('sqrt(-1) and ln(-1) are NaN, not coerced to 0 or a bogus finite', () => {
    const sqrtNeg = evalAt('sqrt(-1)', 0)
    const lnNeg = evalAt('ln(-1)', 0)
    expect(Number.isNaN(sqrtNeg)).toBe(true)
    expect(Number.isNaN(lnNeg)).toBe(true)
    expect(Number.isFinite(sqrtNeg)).toBe(false)
    expect(Number.isFinite(lnNeg)).toBe(false)
    expect(sqrtNeg).not.toBe(0)
    expect(formatCalcNumber(sqrtNeg)).toBe('未定義')
    expect(formatCalcNumber(lnNeg)).toBe('未定義')
  })

  it('1/0 is Infinity, not ~1e12', () => {
    const value = evalAt('1/0', 0)
    expect(value).toBe(Infinity)
    expect(Math.abs(value)).not.toBeCloseTo(1e12, 0)
    expect(formatCalcNumber(value)).toBe('∞')
  })

  it('x+ is rejected as invalid input, not rewritten to x+0', () => {
    expect(() => parseMathExpression('x+')).toThrow(MathParseError)
    expect(tryParseMathExpression('x+').ok).toBe(false)
    const steps = generateDerivationSteps('x+')
    expect(steps[0]?.id).toBe('step-parse-error')
  })

  it('e^x at x=1 ≈ 2.71828 (Euler constant, not silent x^x fallback)', () => {
    expect(evalAt('e^x', 1)).toBeCloseTo(Math.E, 5)
    expect(evalAt('e^x', 1)).toBeCloseTo(2.71828, 5)
    expect(evalAt('exp(x)', 1)).toBeCloseTo(Math.E, 5)
  })

  it('sin(x^2) first derivation checkpoint is Chain Rule', () => {
    const ast = parseMathExpression('sin(x^2)')
    expect(outerDifferentiationRuleIndex(ast)).toBe(3)
    const steps = generateDerivationSteps('sin(x^2)')
    expect(steps[0]?.checkpoint?.correctIndex).toBe(3)
    expect(steps[0]?.checkpoint?.options[3]).toMatch(/Chain Rule/)
    expect(steps[0]?.checkpoint?.correctIndex).not.toBe(0)
  })

  it('still differentiates polynomials used by the studio presets', () => {
    const ast = parseMathExpression('x^2 - 2*x + 2')
    const fp = compileASTToFunction(differentiateAST(ast, 'x'))
    expect(fp(1.5)).toBeCloseTo(1, 10)
  })
})

describe('calculus engine typed reject / undefined-symbol boundaries', () => {
  it('throws UndefinedSymbolError for free variables other than x', () => {
    const ast = parseMathExpression('y^2 + 1')
    expect(() => validateSymbols(ast)).toThrow(UndefinedSymbolError)
    try {
      validateSymbols(ast)
      throw new Error('expected UndefinedSymbolError')
    } catch (err) {
      expect(err).toBeInstanceOf(UndefinedSymbolError)
      const typed = err as UndefinedSymbolError
      expect(typed.name).toBe('UndefinedSymbolError')
      expect(typed.symbol).toBe('y')
      expect(typed.allowed).toContain('x')
      expect(typed.message).toMatch(/Undefined symbol/)
      expect(typed.message).toMatch(/未定義符號/)
    }
  })

  it('maps unknown identifiers to a symbol-error step, not a fake derivative', () => {
    const steps = generateDerivationSteps('sec(x)')
    expect(steps).toHaveLength(1)
    expect(steps[0]?.id).toBe('step-symbol-error')
    expect(steps[0]?.explanation).toMatch(/Undefined symbol/)
    expect(steps[0]?.explanation).toMatch(/sec/)
    expect(steps[0]?.checkpoint).toBeUndefined()
    expect(steps[0]?.afterLatex).toBe('')
  })

  it('allows e, pi, and known funcs, and still rejects t', () => {
    expect(() => validateSymbols(parseMathExpression('e^x'))).not.toThrow()
    expect(() => validateSymbols(parseMathExpression('sin(pi*x)'))).not.toThrow()
    expect(() => validateSymbols(parseMathExpression('ln(x)+sqrt(x)'))).not.toThrow()
    expect(() => validateSymbols(parseMathExpression('t+1'))).toThrow(UndefinedSymbolError)
    const tSteps = generateDerivationSteps('t+1')
    expect(tSteps[0]?.id).toBe('step-symbol-error')
    expect(tSteps[0]?.id).not.toBe('step-1-structure')
  })

  it('keeps empty, unclosed, and argument-less calls as parse rejects', () => {
    expect(() => parseMathExpression('')).toThrow(MathParseError)
    expect(() => parseMathExpression('(x+1')).toThrow(MathParseError)
    expect(() => parseMathExpression('sin')).toThrow(MathParseError)
    expect(tryParseMathExpression('').ok).toBe(false)
    expect(generateDerivationSteps('')[0]?.id).toBe('step-parse-error')
    expect(generateDerivationSteps('(x+1')[0]?.id).toBe('step-parse-error')
  })
})
