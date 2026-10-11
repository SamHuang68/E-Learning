"""E-Learning 的共用驗證入口適配；不建立另一套測試或證據格式。"""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import shutil
import sys

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('change_verification', HERE / '變更驗證.py')
shared = importlib.util.module_from_spec(spec)
spec.loader.exec_module(shared)

BUILD_COMMANDS = [
    ['node', 'scripts/prepare-archify.mjs', '--check'],
    ['node', 'node_modules/typescript/bin/tsc', '-b'],
    ['node', 'node_modules/vite/bin/vite.js', 'build'],
    ['node', 'scripts/generate-precache.mjs'],
    ['node', 'scripts/verify-dist.mjs'],
]


def release_required(name):
    if name.startswith('public/'):
        return True
    if '.test.' in name or '.spec.' in name:
        return False
    return not (name.endswith('.md') or name.startswith(('.github/', 'tools/codex/')))


def check_project(plan):
    shared.require(not plan.get('deferred'), '有未驗項目，不可通過或發布。')
    release = any(release_required(name) for name in plan['changedFiles'])
    shared.require(plan.get('release') is release, '發布選擇必須符合實際產品變更，不能省略或無故重建。')
    for case in plan['cases']:
        shared.require(type(case.get('expectedSeconds')) in (int, float)
                       and 0 < case['expectedSeconds'] <= case['timeoutSeconds'], '必須明列案例預估耗時及上限。')
    if release:
        consent = plan.get('securityReview', {})
        shared.require(consent.get('explicit') is True and all(isinstance(consent.get(k), str) and consent[k].strip()
                       for k in ('necessity', 'user_quote', 'source')), '發布前須明列完整依賴稽核的必要性、授權原文與來源。')
        commands = [case.get('command') for case in plan['cases']]
        indices = []
        for command in BUILD_COMMANDS:
            shared.require(command in commands, '產品變更缺少既有建置／產物門檻：' + ' '.join(command))
            index = commands.index(command)
            shared.require(plan['cases'][index].get('reusePolicy') == 'never', '產物建置與完整性檢查必須產生當次證據。')
            indices.append(index)
        shared.require(indices == sorted(indices), '產物建置順序不正確。')
        shared.require(any('vitest.mjs' in ' '.join(command or []) for command in commands),
                       '產品變更必須明列受影響的 Vitest 案例。')
        shared.require(any('oxlint' in ' '.join(command or []) for command in commands),
                       '產品變更必須保留受影響來源的 lint。')
        if any(name.startswith(('supabase/', 'src/lib/supabase', 'src/lib/localBackend', 'scripts/verify-supabase'))
               for name in plan['changedFiles']):
            shared.require(['node', 'scripts/verify-supabase-schema.mjs'] in commands,
                           '後端契約變更必須保留既有 schema 檢查。')
    return release


def audit_plan(root, plan, level, evidence, node, npm_cli):
    consent = plan['securityReview']
    return {'scope':'full', 'verification_id':'E-Learning-依賴稽核-' + level,
            'reason':'保留發布安全門檻；依本次明確稽核授權執行。', 'artifact':plan['commit'],
            'cwd':str(root), 'command':[str(node), str(npm_cli), 'audit', '--package-lock-only',
            '--omit=dev' if level == 'prod' else '--include=dev', '--audit-level=low' if level == 'prod' else '--audit-level=info'],
            'inputs':[str(root/'package.json'),str(root/'package-lock.json'),str(npm_cli)],
            'environment':'GitHub Ubuntu；鎖定依賴；Node 執行檔內容識別；稽核使用當次套件登錄資料。',
            'full_necessity':consent['necessity'], 'full_consent':{'explicit':consent['explicit'],
            'user_quote':consent['user_quote'],'source':consent['source']},
            'mode':'live','reuse_policy':'never','expected_seconds':60,'timeout_seconds':300,
            'evidence_dir':str(evidence/'依賴稽核')}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    parser.add_argument('--prepare', action='store_true')
    parser.add_argument('--audit', choices=['prod','all'])
    parser.add_argument('--restore-ci', action='store_true')
    parser.add_argument('--evidence-dir', required=True)
    args = parser.parse_args()
    root = Path.cwd()
    path = root / '.github/驗證計畫.json'
    if args.prepare:
        metadata = json.loads(path.read_text(encoding='utf-8'))
        needs_node = any(c.get('kind') == 'node' or c.get('command', [None])[0] == 'node'
                         for c in metadata.get('cases', []))
        if os.environ.get('GITHUB_OUTPUT'):
            with open(os.environ['GITHUB_OUTPUT'], 'a', encoding='utf-8') as output:
                output.write('node=' + str(needs_node).lower() + '\n')
        return
    plan = shared.read_plan(root, path)
    release = check_project(plan)
    if args.audit:
        shared.require(release, '沒有產品發布，不執行依賴完整稽核。')
        evidence = Path(args.evidence_dir).resolve()
        node = Path(shutil.which('node')).resolve()
        npm_cli = Path(shutil.which('npm')).resolve()
        if npm_cli.suffix != '.js':
            npm_cli = node.parent/'node_modules/npm/bin/npm-cli.js'
        shared.require(npm_cli.is_file(), '找不到既有 npm CLI，未啟動稽核。')
        evidence.mkdir(parents=True, exist_ok=True)
        audit_path = evidence/('稽核計畫-' + args.audit + '.json')
        audit_path.write_text(json.dumps(audit_plan(root, plan, args.audit, evidence, node, npm_cli),
                                         ensure_ascii=False, indent=2), encoding='utf-8')
        sys.exit(shared.gate_module().main(audit_path, workspace_root=evidence.parent))
    if args.check:
        if os.environ.get('GITHUB_OUTPUT'):
            with open(os.environ['GITHUB_OUTPUT'], 'a', encoding='utf-8') as output:
                output.write('release=' + str(release).lower() + '\n')
        print(json.dumps({'status': 'planned', 'release': release,
                          'cases': [case['id'] for case in plan['cases']]}, ensure_ascii=False))
        return
    evidence = Path(args.evidence_dir).resolve()
    if args.restore_ci:
        shared.restore_ci_receipts(evidence, '變更驗證證據', 'deploy-pages.yml')
    result = shared.run_plan(root, path, evidence)
    evidence.mkdir(parents=True, exist_ok=True)
    (evidence / '執行收據.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({'status': result['status'], 'release': release,
                      'cases': [{'id': c['id'], 'decision': c['decision']} for c in result['cases']]}, ensure_ascii=False))


if __name__ == '__main__':
    main()
