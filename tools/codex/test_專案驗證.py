"""只核對本次 CI 接入；不啟動產品測試、建置或瀏覽器。"""
import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
spec = importlib.util.spec_from_file_location('project_verification', HERE / '專案驗證.py')
project = importlib.util.module_from_spec(spec)
spec.loader.exec_module(project)
shared = project.shared


class 入口契約(unittest.TestCase):
    def test_工作流程不再隱式執行全套(self):
        text = (ROOT / '.github/workflows/deploy-pages.yml').read_text(encoding='utf-8')
        for broad in ('run: npm test', 'run: npm run lint', 'run: npm run verify:schema', 'run: npm run build'):
            self.assertNotIn(broad, text)
        self.assertIn('--restore-ci', text)
        self.assertIn('needs.build.outputs.release', text)
        self.assertIn('--audit prod', text)
        self.assertIn('--audit all', text)
        self.assertIn('fetch-depth: 0', text)

    def test_拒絕未指定測試的Vitest(self):
        with self.assertRaises(ValueError):
            shared.gate_module().reject_broad_targeted([str(Path(sys.executable).with_name('node.exe')), 'node_modules/vitest/vitest.mjs', 'run'])

    def test_拒絕shell包裝(self):
        with self.assertRaises(ValueError):
            shared.case_command(ROOT, {'kind':'command','targets':['x.py'],'inputs':['x.py'],'command':['bash','x.py']})

    def test_命令必須包含明列目標(self):
        with self.assertRaises(ValueError):
            shared.case_command(ROOT, {'kind':'command','targets':['a.py'],'inputs':['a.py'],'command':['python','b.py']})

    def test_CI與文件不要求發布(self):
        self.assertFalse(project.check_project({'changedFiles':['.github/workflows/deploy-pages.yml','tools/codex/專案驗證.py','REVISION_HISTORY.md'],'release':False,'cases':[]}))

    def test_測試檔不重建但公開內容仍發布(self):
        self.assertFalse(project.release_required('src/App.test.ts'))
        self.assertTrue(project.release_required('public/lesson.md'))

    def test_安全稽核經完整授權閘門且保持嚴格程度(self):
        source = {'commit':'測試候選','securityReview':{'explicit':True,'necessity':'案例資料',
                  'user_quote':'案例資料，不是實際授權','source':'隔離案例'}}
        prod = project.audit_plan(ROOT, source, 'prod', ROOT/'logs', Path(sys.executable), ROOT/'package.json')
        full = project.audit_plan(ROOT, source, 'all', ROOT/'logs', Path(sys.executable), ROOT/'package.json')
        self.assertEqual(prod['scope'],'full')
        self.assertEqual(prod['mode'],'live')
        self.assertEqual(prod['reuse_policy'],'never')
        self.assertIn('--audit-level=low', prod['command'])
        self.assertIn('--omit=dev', prod['command'])
        self.assertIn('--include=dev', full['command'])
        self.assertIn('--audit-level=info', full['command'])

    def test_產品變更不能宣稱不發布(self):
        with self.assertRaises(ValueError):
            project.check_project({'changedFiles':['src/App.tsx'],'release':False,'cases':[]})

    def test_未驗項目阻擋(self):
        with self.assertRaises(ValueError):
            project.check_project({'deferred':[{'path':'x'}]})

    def test_發布缺少安全稽核範圍阻擋(self):
        with self.assertRaisesRegex(ValueError, '授權'):
            project.check_project({'changedFiles':['src/App.tsx'],'release':True,'cases':[]})

    def test_發布缺少產物門檻阻擋(self):
        with self.assertRaisesRegex(ValueError, '產物門檻'):
            project.check_project({'changedFiles':['src/App.tsx'],'release':True,'cases':[],
                                  'securityReview':{'explicit':True,'necessity':'測試資料','user_quote':'測試資料，不是實際授權','source':'隔離案例'}})

    def test_缺少耗時預估阻擋(self):
        with self.assertRaises(ValueError):
            project.check_project({'changedFiles':['tools/codex/x.py'],'release':False,'cases':[{'timeoutSeconds':10}]})

    def test_保留全部發布門檻才可建立產物(self):
        cases = [{'command':command,'reusePolicy':'never','expectedSeconds':1,'timeoutSeconds':10}
                 for command in project.BUILD_COMMANDS]
        cases.extend({'command':command,'expectedSeconds':1,'timeoutSeconds':10} for command in
                     [['node','node_modules/vitest/vitest.mjs','run','src/App.test.ts'],
                      ['node','node_modules/oxlint/bin/oxlint','src/App.tsx']])
        plan = {'changedFiles':['src/App.tsx'],'release':True,'cases':cases,
                'securityReview':{'explicit':True,'necessity':'測試資料','user_quote':'測試資料，不是實際授權','source':'隔離案例'}}
        self.assertTrue(project.check_project(plan))
        cases[0]['reusePolicy'] = 'success'
        with self.assertRaisesRegex(ValueError, '當次證據'):
            project.check_project(plan)

    def test_收據檔名包含成功與進行中(self):
        import re
        pattern = '[0-9a-f]{64}\\.(json|active)'
        self.assertTrue(re.fullmatch(pattern, 'a'*64+'.json'))
        self.assertTrue(re.fullmatch(pattern, 'a'*64+'.active'))

    def test_從本專案工作流程匯入真實收據檔名(self):
        with tempfile.TemporaryDirectory() as folder:
            evidence = Path(folder)/'證據'
            def api(command):
                if 'workflows/deploy-pages.yml/runs' in command[-1]:
                    return json.dumps({'workflow_runs':[{'id':17,'conclusion':'success','event':'pull_request',
                                      'head_repository':{'full_name':'SamHuang68/E-Learning'}}]}).encode()
                return json.dumps({'artifacts':[{'name':'變更驗證證據','expired':False}]}).encode()
            def download(command, **kwargs):
                target = Path(command[-1])
                target.mkdir()
                (target/('a'*64+'.json')).write_text('{"status":"failed"}',encoding='utf-8')
                (target/('b'*64+'.active')).write_text('{}',encoding='utf-8')
            with patch.dict(os.environ, {'GITHUB_REPOSITORY':'SamHuang68/E-Learning','GH_TOKEN':'隔離測試假值'}), \
                 patch.object(shared.subprocess,'check_output',side_effect=api), \
                 patch.object(shared.subprocess,'run',side_effect=download):
                shared.restore_ci_receipts(evidence,'變更驗證證據','deploy-pages.yml')
            self.assertEqual(json.loads((evidence/('a'*64+'.json')).read_text())['status'],'failed')
            self.assertTrue((evidence/('b'*64+'.active')).is_file())


class 證據流程(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / '來源'
        self.root.mkdir()
        self.evidence = Path(self.temp.name) / '證據'
        self.env = patch.dict(os.environ, {'VALIDATION_BASE':'', 'CODEX_VERIFICATION_REUSE_ONLY':'0'})
        self.env.start()
        self.addCleanup(self.env.stop)
        def git(*args):
            return subprocess.check_output(['git', *args], cwd=self.root, stderr=subprocess.DEVNULL).decode().strip()
        self.git = git
        git('init', '-q')
        git('config', 'user.email', 'fixture@example.invalid')
        git('config', 'user.name', '局部驗證案例')
        (self.root/'案例.py').write_text('print("局部案例")\n', encoding='utf-8')
        git('add', '--', '案例.py')
        git('commit', '-qm', '建立隔離基準')
        base = git('rev-parse','HEAD')
        (self.root/'案例.py').write_text('print("局部案例修改")\n', encoding='utf-8')
        self.plan = {'schemaVersion':1,'scope':'targeted','project':os.environ.get('GITHUB_REPOSITORY','SamHuang68/E-Learning'),
                     'baseCommit':base,'documentation':[], 'cases':[{'id':'隔離案例','reason':'驗證本次入口的證據重用',
                     'kind':'command','targets':['案例.py'],'command':['python','-B','案例.py'],
                     'changes':['案例.py'],'inputs':['案例.py'],'timeoutSeconds':10}]}
        self.path = self.root/'計畫.json'
        self.save()

    def save(self):
        self.path.write_text(json.dumps(self.plan, ensure_ascii=False), encoding='utf-8')

    def run_case(self):
        with contextlib.redirect_stdout(io.StringIO()):
            return shared.run_plan(self.root, self.path, self.evidence)

    def test_成功與同輸入重用(self):
        self.assertEqual(self.run_case()['cases'][0]['decision'], 'EXECUTED')
        self.assertEqual(self.run_case()['cases'][0]['decision'], 'REUSE')

    def test_提交SHA改變不重跑(self):
        first = self.run_case()
        self.git('add','--','案例.py')
        self.git('commit','-qm','保存隔離修改')
        second = self.run_case()
        self.assertNotEqual(first['commit'], second['commit'])
        self.assertEqual(second['cases'][0]['decision'], 'REUSE')

    def test_即時案例取得新證據(self):
        self.plan['cases'][0]['reusePolicy'] = 'never'
        self.save()
        self.run_case()
        self.assertEqual(self.run_case()['cases'][0]['decision'], 'EXECUTED')

    def test_即時案例拒絕只沿用(self):
        self.plan['cases'][0]['reusePolicy'] = 'never'
        self.save()
        with self.assertRaises(ValueError):
            shared.run_plan(self.root, self.path, self.evidence, reuse_only=True)

    def test_漏列變更拒絕(self):
        (self.root/'漏列.py').write_text('pass\n', encoding='utf-8')
        with self.assertRaisesRegex(ValueError,'尚未對應'):
            self.run_case()

    def test_前次失敗阻擋盲重跑(self):
        (self.root/'案例.py').write_text('raise SystemExit(1)\n', encoding='utf-8')
        with self.assertRaises(ValueError):
            self.run_case()
        with self.assertRaisesRegex(ValueError, '前次驗證失敗'):
            self.run_case()

    def test_進行中阻擋(self):
        plan = shared.read_plan(self.root, self.path)
        identity = shared.identity_for(self.root, plan['cases'][0])
        self.evidence.mkdir()
        (self.evidence/(shared.digest(identity)+'.active')).write_text('{}',encoding='utf-8')
        with self.assertRaisesRegex(ValueError,'尚未結束'):
            self.run_case()


if __name__ == '__main__':
    unittest.main()
