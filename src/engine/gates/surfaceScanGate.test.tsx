import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import * as fs from 'fs'
import * as path from 'path'
import ts from 'typescript'
import { LocaleProvider } from '../../i18n/i18n'

// Guards the secondary CS Reader regression: test code must never execute in app modules.
function testRunnerCalls(source: string, file: string): string[] {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
  const found: string[] = []
  const macros = new Set(['describe', 'it', 'test', 'expect', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll'])
  const runner = /^(?:vitest|@vitest\/|@jest\/|jest(?:$|\/)|node:test)/
  const visit = (node: ts.Node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier) && runner.test(node.moduleSpecifier.text)) found.push(node.moduleSpecifier.text)
    if (ts.isCallExpression(node)) {
      let callee = node.expression
      while (ts.isPropertyAccessExpression(callee) || ts.isCallExpression(callee)) callee = callee.expression
      if (ts.isIdentifier(callee) && macros.has(callee.text)) found.push(callee.text)
      if ((callee.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(callee) && callee.text === 'require')) && node.arguments.some(a => ts.isStringLiteral(a) && runner.test(a.text))) found.push('test runner import')
    }
    ts.forEachChild(node, visit)
  }
  visit(tree)
  return found
}

describe('Surface Scan Gate: Static & Dynamic Secondary View Integrity', { timeout: 60000 }, () => {
  it('detects consecutive violations and aliased runner imports but ignores teaching text', () => {
    expect(testRunnerCalls('describe("bad", () => {});', 'a.ts')).toContain('describe')
    expect(testRunnerCalls('describe.skip("bad", () => {});', 'b.ts')).toContain('describe')
    expect(testRunnerCalls('import { it as check } from "vitest"', 'c.ts')).toContain('vitest')
    expect(testRunnerCalls('const lesson = "describe(test)"; /test/.test(lesson)', 'd.ts')).toEqual([])
  })
  describe('Gate 1: Static Code Scan - No Naked Vitest Calls in Production Code', () => {
    it('scans all production ts/tsx files to ensure no unmocked describe/it/expect calls exist', () => {
      const srcDir = path.resolve(__dirname, '../../')
      const targetExtensions = ['.ts', '.tsx']

      const violations: string[] = []

      function scanDir(dir: string) {
        const files = fs.readdirSync(dir)
        for (const file of files) {
          const fullPath = path.join(dir, file)
          const stat = fs.statSync(fullPath)
          if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '__tests__') {
              scanDir(fullPath)
            }
          } else if (targetExtensions.some((ext) => file.endsWith(ext))) {
            // 排除測試檔案與測試 setup
            if (
              file.endsWith('.test.ts') ||
              file.endsWith('.test.tsx') ||
              file.endsWith('.spec.ts') ||
              file.endsWith('.spec.tsx') ||
              file === 'setupTests.ts'
            ) {
              continue
            }

            const content = fs.readFileSync(fullPath, 'utf8')
            if (testRunnerCalls(content, file).length > 0) {
              violations.push(fullPath)
            }
          }
        }
      }

      scanDir(srcDir)
      expect(violations, `生產代碼中殘留測試巨集呼叫，會導致執行期未定義錯誤: ${violations.join(', ')}`).toEqual([])
    })
  })

  describe('Gate 2: CS Secondary Lazy Components & Labs Dynamic Import Scan', () => {
    it('successfully imports CsTextbookReader and textbookData', async () => {
      const textbookModule = await import('../../cs/data/textbookData')
      expect(textbookModule.CS_TEXTBOOK_CHAPTERS).toBeDefined()
      expect(Array.isArray(textbookModule.CS_TEXTBOOK_CHAPTERS)).toBe(true)

      const readerModule = await import('../../cs/components/CsTextbookReader')
      expect(readerModule.CsTextbookReader).toBeDefined()

      const html = renderToString(
        <LocaleProvider>
          <readerModule.CsTextbookReader onOpenArchMap={() => {}} />
        </LocaleProvider>
      )
      expect(html.length).toBeGreaterThan(0)
    })

    it('successfully imports and renders CsPractice', async () => {
      const mod = await import('../../cs/components/CsPractice')
      expect(mod.CsPractice).toBeDefined()
      const html = renderToString(
        <LocaleProvider>
          <mod.CsPractice onCompleteQuestion={() => {}} onRecordError={() => {}} />
        </LocaleProvider>
      )
      expect(html.length).toBeGreaterThan(0)
    })

    it('successfully imports and renders CsSignalsView', async () => {
      const mod = await import('../../cs/components/CsSignalsView')
      expect(mod.CsSignalsView).toBeDefined()
      const html = renderToString(
        <LocaleProvider>
          <mod.CsSignalsView />
        </LocaleProvider>
      )
      expect(html.length).toBeGreaterThan(0)
    })

    it('successfully imports and renders CsMockExam', async () => {
      const mod = await import('../../cs/components/CsMockExam')
      expect(mod.CsMockExam).toBeDefined()
      const html = renderToString(
        <LocaleProvider>
          <mod.CsMockExam onRecordExamScore={() => {}} onEarnXp={() => {}} />
        </LocaleProvider>
      )
      expect(html.length).toBeGreaterThan(0)
    })

    it('successfully imports and renders CsErrorVault', async () => {
      const mod = await import('../../cs/components/CsErrorVault')
      expect(mod.CsErrorVault).toBeDefined()
      const html = renderToString(
        <LocaleProvider>
          <mod.CsErrorVault onRemoveError={() => {}} />
        </LocaleProvider>
      )
      expect(html.length).toBeGreaterThan(0)
    })

    it('successfully imports and renders VonNeumannArchitectureLab', async () => {
      const mod = await import('../../cs/labs/VonNeumannArchitectureLab')
      expect(mod.VonNeumannArchitectureLab).toBeDefined()
      const html = renderToString(
        <LocaleProvider>
          <mod.VonNeumannArchitectureLab onEarnXp={() => {}} />
        </LocaleProvider>
      )
      expect(html.length).toBeGreaterThan(0)
    })

    it('successfully imports and renders PipelineHazardLab', async () => {
      const mod = await import('../../cs/labs/PipelineHazardLab')
      expect(mod.PipelineHazardLab).toBeDefined()
      const html = renderToString(
        <LocaleProvider>
          <mod.PipelineHazardLab onEarnXp={() => {}} />
        </LocaleProvider>
      )
      expect(html.length).toBeGreaterThan(0)
    })

    it('successfully imports and renders CacheMappingLab', async () => {
      const mod = await import('../../cs/labs/CacheMappingLab')
      expect(mod.CacheMappingLab).toBeDefined()
      const html = renderToString(
        <LocaleProvider>
          <mod.CacheMappingLab onEarnXp={() => {}} />
        </LocaleProvider>
      )
      expect(html.length).toBeGreaterThan(0)
    })

    it('successfully imports and renders AiMatrixTransformerLab', async () => {
      const mod = await import('../../cs/labs/AiMatrixTransformerLab')
      expect(mod.AiMatrixTransformerLab).toBeDefined()
      const html = renderToString(
        <LocaleProvider>
          <mod.AiMatrixTransformerLab onEarnXp={() => {}} />
        </LocaleProvider>
      )
      expect(html.length).toBeGreaterThan(0)
    })

    it('successfully imports and renders ArchifyHardwareMap', async () => {
      const mod = await import('../../cs/labs/ArchifyHardwareMap')
      expect(mod.ArchifyHardwareMap).toBeDefined()
      const html = renderToString(
        <LocaleProvider>
          <mod.ArchifyHardwareMap onEarnXp={() => {}} />
        </LocaleProvider>
      )
      expect(html.length).toBeGreaterThan(0)
    })
  })

  describe('Gate 3: All Secondary Track Views Surface Scan', () => {
    it('verifies Physics secondary views and labs load cleanly', async () => {
      const projectile = await import('../../physics/labs/ProjectileLab')
      const optics = await import('../../physics/labs/OpticsLab')
      const circuit = await import('../../physics/labs/CircuitLab')
      const buoyancy = await import('../../physics/labs/BuoyancyLab')
      const shm = await import('../../physics/labs/ShmLab')
      const today = await import('../../physics/components/PhysicsToday')

      expect(projectile.ProjectileLab).toBeDefined()
      expect(optics.OpticsLab).toBeDefined()
      expect(circuit.CircuitLab).toBeDefined()
      expect(buoyancy.BuoyancyLab).toBeDefined()
      expect(shm.ShmLab).toBeDefined()
      expect(today.PhysicsToday).toBeDefined()
    })

    it('verifies Chemistry secondary views and labs load cleanly', async () => {
      const periodic = await import('../../chemistry/labs/PeriodicTableLab')
      const titration = await import('../../chemistry/labs/TitrationLab')
      const gas = await import('../../chemistry/labs/GasLawLab')
      const vsepr = await import('../../chemistry/labs/VseprGeometryLab')
      const solubility = await import('../../chemistry/labs/SolubilityLab')
      const today = await import('../../chemistry/components/ChemistryToday')

      expect(periodic.PeriodicTableLab).toBeDefined()
      expect(titration.TitrationLab).toBeDefined()
      expect(gas.GasLawLab).toBeDefined()
      expect(vsepr.VseprGeometryLab).toBeDefined()
      expect(solubility.SolubilityLab).toBeDefined()
      expect(today.ChemistryToday).toBeDefined()
    })

    it('verifies Calculus studio & secondary components load cleanly', async () => {
      const studio = await import('../../math/calculus/CalculusStudio')
      const canvas = await import('../../math/calculus/components/CalculusCanvas/CalculusCanvas')
      const assessment = await import('../../math/calculus/components/CalculusAssessment/CalculusAssessmentWidget')
      const lab = await import('../../math/calculus/components/CalculusLab/CalculusLabPanel')
      const solver = await import('../../math/calculus/components/CalculusSolver/StepByStepSolver')

      expect(studio.CalculusStudio).toBeDefined()
      expect(canvas.CalculusCanvas).toBeDefined()
      expect(assessment.CalculusAssessmentWidget).toBeDefined()
      expect(lab.CalculusLabPanel).toBeDefined()
      expect(solver.StepByStepSolver).toBeDefined()
    })

    it('verifies Chinese secondary views and labs load cleanly', async () => {
      const pinyin = await import('../../chinese/components/PinyinLab')
      const banking = await import('../../chinese/components/BankingLab')
      const today = await import('../../chinese/components/ChineseToday')

      expect(pinyin.PinyinLab).toBeDefined()
      expect(banking.BankingLab).toBeDefined()
      expect(today.ChineseToday).toBeDefined()
    })

    it('verifies TOEIC secondary views and labs load cleanly', async () => {
      const phonics = await import('../../toeic/components/PhonicsLab')
      const email = await import('../../toeic/components/EmailMasterLab')
      const today = await import('../../toeic/components/ToeicToday')

      expect(phonics.PhonicsLab).toBeDefined()
      expect(email.EmailMasterLab).toBeDefined()
      expect(today.ToeicToday).toBeDefined()
    })
  })
})
