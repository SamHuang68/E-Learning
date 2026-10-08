# Revision history

## capacity-resilience.1 — 2026-10-03 — local candidate

The existing artifact version remains the content-derived precache buildId.
The npm package version 0.0.0 is not used as a published release identifier.
Exact checkpoint/final commit SHAs and the candidate buildId are mapped in
C:/Users/Sam/AI-Workspace/docs/e-learning/capacity-resilience/handoff.json.

### Checkpoint 1: cache resilience and click-time Anki export

- Preserve successful network responses when browser cache writes fail, including
  quota rejection; wait for all required offline resources before activation.
  Failed candidate installation preserves the previous cache. Bound precache
  writes to eight concurrent requests without reducing the offline content set.
- Load Anki exporter and its banks only on an export action. Prevent duplicate
  downloads and provide translated pending/success/error announcements.
  Existing CSV output, learning banks, progress IDs and storage schemas remain.
- Validation: service-worker VM tests 21/21; Anki loader/exporter tests 8/8;
  existing offline guards and bilingual contract tests 40/40. Browser acceptance,
  one production build and capacity comparison remain pending at this checkpoint.
- State: local checkpoint only; push=false, PR=false, CI=false, deploy=false.
  No publication authorization. Existing successful unrelated checks were not rerun.

Further candidate changes and their measured results will be appended below;
this checkpoint history is retained.

### Checkpoint 2: shared diagrams and measured local candidate

- Retain checkpoint 1 at efc325d25240de1470b4c7564752534628f62c99.
  Extract the exact Archify 2.16.0 renderer and stylesheet from nine HTML files.
  Hash-pinned preparation, a read-only build check and standalone reconstruction
  preserve diagram data, locale markup, script order and portable single files.
  The deployed LF-normalized source shrinks from 6,399,809 to 1,299,974 bytes,
  a 5,099,835-byte reduction. This is raw source, not compressed transfer size.
- Extend the existing exclusive 500,000-byte JavaScript limit to shared public
  runtimes and report total precache capacity without increasing the limit.
  Final buildId b14230f3c67d35be contains 299 precache files / 7,683,687 bytes.
  Entry JS is 416,194 bytes; largest JS is the unchanged 451,594-byte renderer.
  Entry headroom is 83,806 bytes. Prior main CI reported 469,593 bytes for entry
  JS with the same /E-Learning/ base; no fresh baseline build was performed.
  Further catalog, body or translation splitting is deferred because current
  measurements do not justify expanding this candidate's scope.
- Browser testing found that a failed dynamic import cannot reliably be retried
  by merely clearing a Promise. Classify import failures with ChunkLoadError and
  offer a translated, explicit user reload; ordinary download errors remain
  retryable. No automatic reload, CSV/bank change or storage migration is added.

Validation and limitations:

- 96 distinct targeted tests in eight files passed: service worker 21, Anki 8,
  Archify/integration 27, offline guards and bilingual contracts 40. Anki and
  bilingual tests were rerun after the recovery correction; repeated executions
  are not counted as additional tests. Scoped authored-source lint passed.
- Two production builds and verify:dist passed. The second build was needed to
  validate the import-failure correction found by the first browser run.
- Chromium, Firefox and Windows WebKit passed ordinary click-time Anki loading,
  duplicate-click protection, pending locale changes and all three CSV exports.
  Chromium and Firefox passed aborted-request and HTTP-503 reload recovery.
- Nine diagrams passed at both / and /E-Learning/ in all three engines: 54 page
  loads, six SVG exports with embedded styles and six portable page checks.
  Those results used the first build; the diagram and common-asset bytes remain
  identical in the final build. All nine standalone round trips match original
  HTML after LF normalization. No actual SharePoint upload was tested.
- Chromium and Firefox passed final-build real offline navigation to two diagrams
  and offline Anki export with 301 populated cache entries.
- FAILED / unresolved: Windows WebKit offline navigation reports an internal
  error with both this worker and the original worker. Windows WebKit Anki import
  failure recovery still fails after reload, including a real local HTTP 503 with
  no request interception. Bare-import and modulepreload minimal controls recover;
  the production recovery root cause is not established. Do not call this full
  cross-browser acceptance or infer actual Safari behavior.
- Unfiltered git diff --check flags the two unchanged vendor blocks' final blank
  lines/trailing spaces. Hash identity takes precedence over whitespace cleanup
  there; authored files pass a separately scoped check. No gate configuration was
  weakened. Original failures and controls are retained in the external handoff.
- Not run: full suite, full-site scan, new CI, actual Safari/mobile-device checks,
  raster/video export, remote hosting checks or deployment. No learning-content
  translation expansion or catalog/body migration was performed in this phase.
- State: local candidate only; push=false, PR=false, CI=false, deploy=false.
  Publication authorization: none. Browser exceptions above remain release
  blockers. Final full commit/tree SHA and evidence hashes are mapped in the
  handoff.json cited above; this revision history does not claim release status.

## capacity-resilience.2 — 2026-10-03 — WebKit follow-up local candidate

This entry supersedes the two unresolved browser classifications in checkpoint 2;
that earlier evidence and history are retained. Only vite.config.ts changes runtime
build behavior in this follow-up. The existing content-derived version strategy
continues: final buildId is 288ac4f6200a958b. The full final commit/tree mapping is
in the same external handoff.json, with the previous candidate archived separately.

### Anki recovery: scoped preload correction

- Trace confirms reload creates a new document and resets the export controls.
  The previous Vite-generated preload path still returns the failed import without
  a second request in Windows WebKit. An isolated page using the actual unchanged
  Vite helper reproduces this with only the export target in its preload list;
  the same helper with an empty list recovers after reload. A new tab also recovers.
  This establishes the affected generated loading path, not a general Safari claim.
- Disable modulepreload only for the Anki export dynamic-import boundary. Normal
  dynamic import loads its dependency graph, while other boundaries retain their
  original preload lists. Keep rejected-module state, the explicit reload action,
  bilingual real-error feedback, and the existing complete service-worker precache.
  Do not use query-string retries, suppress errors or loosen browser assertions.
- Final Windows WebKit acceptance passes both exporter HTTP 503 and dependency
  HTTP 503: no download on failure, three export buttons disabled, bilingual error
  and reload controls, a new document after user reload, a fresh successful request
  and exactly one valid CSV download. The final CSV hash matches prior successful
  outputs. The base commit used static Anki imports, so it has no equivalent lazy
  export-failure boundary; do not claim this is an unchanged-base Anki test.

### Offline navigation: separate tool emulation from origin outage

- Before disconnection, the worker is activated, controls the document under the
  correct /E-Learning/ scope, and the target is present among 301 cache entries.
- Playwright's Windows WebKit offline switch fails even with an independent worker
  that responds to every navigation entirely in memory, without fetch or caches.
  Its online control succeeds. Keep this emulation mode classified BLOCKED.
- Real localhost TCP connection termination passes the same product navigation,
  diagram/theme and Anki cases with both the candidate worker and the unchanged
  base worker (only its buildId placeholder is substituted for the same manifest).
  Server logs prove connections fail; response events prove the diagrams and
  exporter are served by the worker. The final candidate passes this path again.
  No service-worker product change is needed. This is origin-outage acceptance,
  not a claim about a physical network adapter or actual Safari.

Validation and state:

- This follow-up runs only the affected Windows WebKit cases and the two Anki
  unit files: 8/8 tests passed, Vitest 4.1.10. No other engine or full suite rerun.
  vite.config.ts lint and this follow-up's staged whitespace check pass.
- Exactly one necessary production build in this follow-up, plus verify:dist,
  passed (three builds total across both implementation rounds). Entry JS is
  416,165 bytes; largest JS remains 451,594 bytes; the unchanged exclusive limit
  is 500,000 bytes. Precache: 299 files / 7,683,658 bytes.
- The two hash-pinned upstream assets and their whitespace notices remain
  unchanged. No further content, schema, translation or catalog changes.
- Browser traces, server/console diagnostics, minimal controls and final acceptance
  are retained under the existing external evidence directory and indexed by the
  updated handoff. Product cases above pass; tool offline emulation remains blocked.
- Local candidate only: push=false, PR=false, CI=false, merge=false, deploy=false.
  No publication authorization; no actual Safari/mobile/remote deployment checks.

## capacity-resilience.3 — 2026-10-03 — production redirect correction

- The approved candidate was published through PR #136 at main commit
  260c681c5619f053f53d7e08d07b834e00a848cd. Its tree exactly matches candidate
  2170c4f83c6242a2f422bb2b0f8dd17c10a3220c. Existing CI run 37157350642 passed
  1,423 tests in 319 files, schema checks, build, capacity verification and deployment.
- GitHub Pages production acceptance passed. Cloudflare production acceptance
  exposed a separate offline failure for a precached HTML page never visited online:
  Cloudflare redirects .html to an extensionless URL and the cached final response
  retains redirected=true. Navigation with redirect=manual rejects that response.
  In a fresh isolated browser, changing only the cached response's redirect metadata
  restored the same offline SRS page, with its diagram renderer intact.
- Normalize only redirected responses returned by the offline navigation fallback.
  Preserve the original body, status, status text and headers. Online handling,
  complete precaching, cache-write failure behavior, the Anki fix and size gate stay
  unchanged. No hosting configuration or learning data is changed.
- Add exact-page and app-shell regression cases: both failed against the previous
  worker and both pass with the fix; all 23 targeted worker tests pass. Two-file
  scoped lint passes. No extra local build or full local suite was run; the existing
  preview/CI builds provide the release artifact and final buildId.
- This is the minimal correction required by formal offline acceptance within the
  approved release. It is prepared on a separate repair branch/PR; final SHA,
  deployment fingerprints, checks and production readback are recorded in the same
  external handoff.json referenced above. Earlier failed evidence is retained.
- The Windows WebKit offline emulation limitation and the two unchanged upstream
  whitespace notices remain classified as before. No new feature or other-project
  change is included.

## localization-completion.1 — 2026-10-08 — 本機候選

沿用既有內容衍生 precache `buildId` 的產物版本策略；npm package 的 `0.0.0` 不作公開發布版號。

### 修改原因與內容

- 完成 PR #130 尚未覆蓋的英文模式教學支援內容，涵蓋數學、物理、化學、計算機概論、TOEIC 與臺灣華語軌。
- 保留日語、Hanzi、拼音、注音與其他目標語言教材；英文模式只轉換介面、教學說明、答案解析與輔助資訊，繁中介面則統一採用臺灣正體字形。
- 補齊 populated Error Vault 的內容、展開狀態與操作流程，並將物理及化學的實驗室建議改為精確、預設關閉的契約，避免錯接無關實驗室。
- 修正計算機概論公式的執行期 LaTeX 跳脫，加入控制字元、裸命令與 KaTeX 解析回歸檢查。
- 修正數學錯題訂正 modal 在切換語系後保留舊題目內容的衍生狀態問題，改用原生 modal、正確返回焦點，並取消可能誤關下一題的舊計時器。
- 將共用互動元件的介面語系與學習內容語系分離；Aoba 情境、模擬測驗、分級測驗與跟讀改用精確 ID 英文輔助對照，切換介面語系時保留作答狀態與日語目標內容。
- 將物理與化學課綱英文化收斂到 App 容器的 canonical localizer；同步修正舊測試繞過該資料邊界所造成的 112 項誤報。
- 修正獨立 Calculus 路由未將目前 locale 傳入動態推導引擎、非有限值在英文圖例顯示繁中、Canvas 與 Studio 繞過既有權威文案，以及勳章解鎖條件誤顯示機器鍵的四項根因。
- 拆分 Hub 與語系元件的 Fast Refresh 模組邊界，讓完整 lint 達到零警告。
- 修正共用 TOEIC 情境實驗室在 320 像素窄螢幕的水平溢位，保留 28 個實驗室原有圖示與強調色，並為英文、日語與繁中片段加入實際 payload 語言契約。

### 驗證結果

- `npm run lint`：通過，零錯誤、零警告。
- `npm test`：通過，342 個測試檔、1,609 個測試。
- `npm run verify:schema`：通過，56 項檢查。
- `npm run build`：通過，TypeScript 與 Vite 正式建置 529 個模組成功；precache build ID 為 `09945517718f7350`。
- `npm run verify:dist`：通過，298 個產物檔案、99 個必要 public 檔案、8 個延遲載入路由區塊，precache 總容量 8,055,097 bytes。
- 變更測試聚合：42 個測試檔、632 個測試全數通過；314 個已暫存 TypeScript／TSX 檔零警告，`tsc -b` 通過。
- 瀏覽器驗收：Aoba 英文輔助與切換語系後狀態保留、化學五個實驗室英文介面與代表性互動、計算機概論全主要頁面、TOEIC 混合語言與原有視覺常數、Math Error Vault modal、Calculus 英文推導步驟／徽章條件／無效算式錯誤與 `undefined` 圖例，以及 320 像素窄螢幕版面均已實際驗證；新開分頁無水平溢位，console 無 warning 或 error。

### 已知限制

- 專案仍為 GitHub Pages 靜態站；未設定 Supabase 環境變數時使用瀏覽器本機後端，資料不會跨裝置同步。
- 英文模式會刻意保留日語與臺灣華語的目標語言字形，不能將這些教學內容視為未翻譯的介面洩漏。
- 本次沒有資料庫 migration；`verify:schema` 是靜態契約檢查，不代表已連線修改託管 Supabase。

### 狀態與追溯

本條目建立時的狀態為本機候選，`commit=false`、`push=false`、`deploy=false`。完成後以完整 release commit SHA、實際整合至 `main` 的 SHA、GitHub Actions Pages workflow run 與線上驗收紀錄，作為同一候選的發布憑證；PR #130 只代表本次補完工作的原始範圍，不代表這份候選已經發布。

### 發布結果（2026-10-08）

- Release commit `2f7b85a8539ea02c21ce3285be4b2a931e883b3c` 已推送，並由 PR #138 合併為 `main` commit `150c3da7cc8e4ae61e800a9041420fc7b90abd8c`；兩者 tree 均為 `15f2deda718d16610bd4908b4ad0f2bf7ea4f449`。
- GitHub Pages workflow run `37748439254` 的 build 與 deploy 均成功；線上 manifest build ID 為 `aea147c33856cf38`，共 298 個檔案。
- Cloudflare Pages check run `113215728288` 成功；綁定同一 `main` commit 的公開 preview manifest build ID 為 `9a61348b0176d9a5`，共 298 個檔案。
- 實際狀態：`commit=true`、`push=true`、`merge=true`、`deploy=true`。GitHub Pages 與 Cloudflare commit preview 的 root、manifest 與代表性互動路由均已驗收；未建立 tag 或 GitHub Release。

## cs-consumer-render-regression.1 — 2026-10-08 — 發布候選

沿用內容衍生 precache `buildId` 與 npm package `0.0.0` 的既有版本策略。本次只加強自動化回歸與修訂追溯，不修改應用程式執行碼或使用者資料。

### 修改原因與內容

- 將舊 checkout commit `101499e8bab8bb18c4830fab426222e99bc334eb` 中仍有價值的計概 consumer 渲染意圖移植到最新 `main`；不直接 cherry-pick 落後八個 commit 的舊基線。
- 擴充既有 `localeContainerLanguage` gate，實際 SSR 渲染 `CsApp`，驗證 Today 使用目前 `localizeCsUnit` 的 canonical 英文標題、HTTP/TCP 卡片使用 `csTeachingCopy`、四筆教學對照存在、英文主內容無漢字，繁中仍保留原始單元一與單元五標題。
- 在既有 fail-closed 測試補上未知單元 ID，防止新課程缺少 canonical 英文資料時靜默退回中文。
- 不帶入舊 commit 的平行 `docs/修訂紀錄.md`、過時 `EXPECTED_TITLES` 或已退出 production consumer 的 `csUnitTitle` 額外契約；修訂紀錄只沿用本檔。

### 根因與驗證結果

- 第一輪舊測試重播為 15/18 失敗，TypeScript 同時回報 TS2305；根因是 `LocaleProvider` 已依 Fast Refresh 邊界移至 `LocaleComponents.tsx`。只修正匯入後仍有 13/18 失敗，證明舊英文標題與繁中前綴已落後目前 canonical 文案，沒有把產品改回舊字串。
- 最終針對性測試：`localeContainerLanguage.test.tsx`、`csTeachingCopy.test.ts`、`cs.test.ts`、`hierarchyTree.test.ts` 共 4 個測試檔、32 個測試全數通過。
- 兩個修改測試檔的 scoped oxlint 通過；`tsc -b` 通過；Supabase schema 靜態契約 56 項通過。
- 正式建置完成 529 個模組，precache build ID 仍為 `09945517718f7350`；`verify:dist` 通過，包含 298 個檔案、99 個必要 public 檔案、8 個延遲載入路由區塊與 8,055,097 bytes precache。產物識別未變，符合本次沒有 runtime 變更的預期。

### 已知限制與發布狀態

- 依完整測試／掃描的既有確認規則，本機未重跑全庫 Vitest；最新 `main` 的前一輪完整基線為 342 個測試檔、1,609 個測試。正式部署仍須由本候選的遠端 CI 全庫 lint、測試、schema、build 與 dist gate 通過後才能完成。
- Sam 已於 2026-10-08 明確指示 `git commit push deploy`。本條目建立時為未提交候選，`commit=false`、`push=false`、`merge=false`、`deploy=false`；最終完整 SHA、PR、CI／部署 run 與 live manifest 由同版本 PR 發布紀錄補齊，未取得成功證據前不得稱為已發布。

## cs-secondary-consumer-regression.1 — 2026-10-08 — 本機候選

沿用內容衍生 precache `buildId` 與 npm package `0.0.0` 的既有版本策略。本次只新增自動化回歸測試與修訂追溯，不修改應用程式執行碼、建置設定或使用者資料。

### 修改原因與內容

- 發布後的有界稽核確認：既有 `localeContainerLanguage` gate 只會 SSR `CsApp` 的預設 Today 頁面；`surfaceScanGate` 雖會載入次要頁面，卻使用預設繁中語系且只驗證 HTML 非空，無法防止英文 consumer 忘記接上 canonical localizer。
- 新增單一聚焦 SSR 測試，直接注入英文 `LocaleContext`，覆蓋課綱、讀本、練習、破題訊號卡、模擬評量、已填入錯題的弱點本，以及馮紐曼、處理器管線、快取映射、AI 矩陣與硬體架構圖五個實驗室。
- 每個英文畫面都以固定、獨立的使用者可見英文 sentinel 驗證實際 consumer 接線，並檢查完整初始 HTML 無漢字；預期值不由受測 `localize*` helper 動態產生。
- 另以繁中 `LocaleContext` 渲染課綱，驗證權威繁中單元標題與核心概念仍保留，避免用移除繁中內容換取英文 gate 通過。

### 紅燈、綠燈與驗證結果

- 目前 runtime 行為原本正確，因此以不保留在差異中的受控 mutation 暫時讓 `CsHierarchyTree` 略過 `localizeCsUnit`。新 gate 精確轉紅：單檔 12 個測試中只有課綱案例失敗，固定英文單元標題消失且繁中內容洩漏；這證明測試能攔截原先缺少的 consumer wiring 回歸。
- mutation 完整還原後，新增測試單檔 12/12 通過；產品檔與基線內容相同，最終候選沒有 runtime 差異。
- 相關聚合測試涵蓋新增 gate、surface scan、容器語言、CS teaching copy、課程結構、實驗室英文覆蓋與模擬評量，共 8 個測試檔、68 個測試全數通過。
- 新增測試檔的 scoped oxlint 通過；`tsc -b` 通過；差異 whitespace 檢查通過。

### 已知限制與發布狀態

- 本輪未重跑全庫 Vitest、正式 build、`verify:dist` 或瀏覽器互動；新增 gate 驗證的是 SSR 初始畫面，不代替點擊切頁、計時器、作答與延遲載入網路行為的瀏覽器 E2E。
- 現有 GitHub Pages 與 Cloudflare Pages 部署未變；本輪沒有以先前部署證據冒充新候選已發布。
- 本條目建立時為未提交候選，`commit=false`、`push=false`、`merge=false`、`deploy=false`；先前的 `git commit push deploy` 授權已由前一候選履行，未延伸到本輪新候選，因此不建立 PR、不推送、不合併、不部署。

## cs-interactive-state-hardening.1 — 2026-10-08 — 發布候選

本輪沿用既有內容衍生 precache `buildId` 與 npm package `0.0.0` 的版本策略；範圍限定於發布後實際重現的計算機概論次要畫面、互動狀態，以及共用匯入／雲端流程內的 CS 專屬資料邊界，不新增課程功能。

### 根因與修正

- 英文單元練習膠囊原本只以全形冒號切割標題，英文半形冒號未被切開，導致七個按鈕顯示完整長標題；現在同時接受全形與半形冒號，並以七個固定短標籤回歸測試保護。
- LSM-Tree 術語提示原本完全沒有讀取目前語系，英文模式的無障礙名稱與滑入內容固定夾帶繁中；互動也只有滑鼠 hover，不可由鍵盤聚焦、Escape 關閉或取得描述關聯。現在由同一語系來源產生文案，英文只顯示英文，繁中保留原有雙語資訊，並加入 focus／blur、Escape、`tabIndex` 及 `aria-describedby`；hover 或 focus 任一仍成立時提示會保持可見，Escape 則明確抑制目前這次互動，避免兩種輸入事件互相誤關閉。
- Git 心智模型 iframe 只在首次載入時讀取本機語系，父層切換語系後不會更新；現在以圖表種類與 locale 共同決定 iframe identity，使父層語系切換時重掛並讀取同一最新語系。
- 模擬評量倒數原本在 React state updater 內直接交卷，可能在 Strict Mode 重複執行音效、經驗值與成績紀錄副作用；倒數 effect 又依賴會隨作答內容改變的提交 callback，每次作答都可能重建 interval 並延後下一個 tick。現在 tick effect 只遞減秒數，歸零交卷移到獨立 effect，並以一次性 guard 同時保護手動與自動交卷。英文成績列也改用半形括號。
- CS 進度與訊號卡還原原本直接信任 JSON payload，過期、重複、錯型別 ID 與非有限數值可造成 Today、導覽 badge、錯題本及掌握數互相矛盾；現在讀取、儲存與事件 detail 共用 canonical 正規化，課程完成、錯題、考卷、實驗室與訊號各自使用正確 allowlist，數值及日期亦採明確邊界。
- 共用匯出、匯入與雲端同步原本繞過 `csStorage` 的 canonical 邊界，以 generic JSON helper 原樣落盤、匯出及合併 CS progress／signals；因此 retired ID、非 boolean mastery 與錯型別資料即使在畫面讀取時被忽略，仍可能持續存在並重新同步。現在抽出不載入大型教材資料的輕量 `csProgressSchema`，由本機 load／save、事件 payload、export／import、cloud row normalization、merge、落盤與重新上傳共用；`null`／`undefined` 仍保留「未建立／未提供，不清除既有資料」的既有語意。測試會將輕量 ID 契約與真正的 lazy CS 教材 exports 精確比對，來源漂移時直接失敗；實驗室 ID 則改由獨立輕量 registry 同時供課綱、導覽、完成紀錄 writer 與 schema 使用，避免手寫 allowlist 靜默落後。
- 已掛載的訊號卡原本不會回應雲端還原、匯入或同頁 mastery 更新；現在同時監聽 `e-learning:progress-hydrated` 與 `cs:signals-mastery-updated`，並在卸載時移除 listener。
- `getNextCsUnit()` 在核心五單元全數完成後會刻意回傳第一個核心單元，避免自動推薦進階內容；Today 原本卻把這個 review fallback 當成仍未完成的 `Next: Unit 1`。現在 Today 另行判斷核心路徑完成狀態，顯示 80／80 計數與複習 CTA，且仍不自動推薦進階 AI 單元。
- CS signal 公式原本會把未翻譯漢字靜默改成 `term`；現在 44 筆公式皆以 ID 與原公式 exact contract 驗證，兩筆含漢字公式提供明確英文，其餘逐字保留。新增或變更公式未同步登錄時會 fail closed。

### 驗證結果

- UI／互動修正皆保留具體紅燈證據：英文練習膠囊在 13 項測試中精確失敗 1 項；LSM 語系與鍵盤契約、iframe 重掛及評量提交契約合計得到 5 項預期失敗；Today 完成態與公式 fail-closed 合計得到 2 項預期失敗。storage／cloud follow-up 在未修正版本由 2 個測試檔得到 4 項預期失敗、12 項既有／保留契約通過，證明髒匯入與 local／remote 髒訊號仍會穿越邊界，而缺省欄位不清除資料的既有契約沒有被誤判為失敗。
- 最終審查追加的混合滑鼠／鍵盤 tooltip 可見性與共用實驗室 ID 契約，先在 2 個測試檔得到 2 項預期失敗、7 項既有測試通過；修正後同一組 9／9 通過。
- 最終 30 個候選路徑的有界整合測試為 18 個測試檔、154 個測試全數通過；29 個變更或新增 TypeScript／TSX 檔的 scoped oxlint 通過，`tsc -b` 通過。tracked diff 與七個新增檔的 whitespace／檔尾換行檢查均通過，只有 Git 的 LF／CRLF 提示。
- 收尾發布 gate 以目前完整候選首次執行即通過：全庫 oxlint 零警告；347 個 Vitest 測試檔、1,642 個測試全數通過；Supabase schema 契約 56／56 通過；production build 完成 532 個模組。內容衍生 precache `buildId=b159cfeff1320df3`，`verify:dist` 驗證 298 個產物檔、99 個必要 public 檔、8 個延遲載入路由區塊及 8,064,721 bytes precache 全數通過；最大 bundled JavaScript 為 436,409 bytes，低於既有 500,000 bytes 閘門。
- 輕量 schema 的來源契約、靜態 import graph，以及 112 個課程題號、8 個模擬考題號、2 個考卷 ID、5 個實驗室 ID、44 個訊號 ID 均有精確自動化比對；匯入／匯出與 localStorage-backed Supabase shim 的髒資料、缺省欄位、合併及重新回寫案例亦包含在上述聚合測試。
- 本機瀏覽器已實際驗證：英文七個單元膠囊維持短標籤且窄螢幕無溢位；Git iframe 由繁中切換英文後，父層、iframe 標題、誠實性說明與 `lang` 同步；LSM 英文鍵盤焦點提示沒有漢字且 Escape 可關閉。
- 還原邊界以暫時 QA payload 驗證：髒進度只計入有效的 1／112，訊號掌握狀態依兩種事件即時完成 0／44 → 1／44 → 0／44，核心 80／80 顯示完成狀態，英文零分報告使用半形括號。QA 使用的 `cs-learning-progress` 與 `cs_signals_mastery_v1` 均已還原原值。

### 已知限制與發布狀態

- 本輪已完成全庫 lint、Vitest、schema、正式 build 與 `verify:dist`；遠端 CI、GitHub Pages 與 Cloudflare Pages 仍須以本候選實際 commit／tree 另行驗證，不能以本機產物或前一版部署冒充。本機產物已證明八個延遲載入路由區塊及 precache 契約，正式遠端 bundle 身分仍以 CI 與 live manifest 為準。
- 雲端同步回歸使用瀏覽器 localStorage-backed Supabase shim，沒有連線 hosted Supabase，也未驗證正式資料庫欄位、RLS、實際網路、跨裝置同步或正式 readback。進度匯入回歸直接呼叫 export／import 函式，沒有經由 Data Controls 的檔案選擇器實際選檔；瀏覽器暫時 QA payload 只證明本機 storage 與事件驅動畫面更新，不是 cloud hydrate 或 import UI E2E。
- 模擬評量自動交卷目前以來源結構契約保護；瀏覽器僅驗證交卷後的英文零分報告，沒有以 fake timer、Strict Mode 或實際等待倒數歸零確認音效、經驗值及 `onRecordExamScore` 恰好執行一次。
- 本條目最初建立時為未提交候選；Sam 於 2026-10-08 指示「收尾」後，已明確進入完整 gate、精確 allowlist commit、push、PR、合併與部署流程。本檔不預寫包含自身的 commit SHA；完整 release commit、merge SHA、CI 與 live 部署證據由同版本 PR 及交付回報相互引用。建立 release commit 前的狀態仍為 `commit=false`、`push=false`、`merge=false`、`deploy=false`。

## dependency-security-patches.1 — 2026-10-09 — 發布候選

沿用 npm package `0.0.0` 與內容衍生 precache `buildId` 的既有版本策略。本輪只處理已確認的開發／建置依賴安全告警及其 CI 可見性，不修改應用程式執行碼、課程內容、資料契約或使用者資料。

### 根因與修正

- 基準鎖檔的完整 `npm audit` 為 5 個套件紀錄：Vitest 與 `@vitest/mocker` 共用一項 moderate 告警，PostCSS 為一項 moderate 告警，Nanoid 與 `source-map-js` 各為一項 high 告警；排除開發依賴後為 0。這表示正式瀏覽器依賴沒有已知命中，但 CI／本機測試與建置會安裝及執行相關工具鏈，不能以部署成功取代修補。
- 將 Vitest 最低版本由 `^4.1.10` 提升至 `^4.1.11`，並把同版的七個 `@vitest/*` 套件更新至 4.1.11，修正開發伺服器 mock redirect 邊界問題。
- 在既有相容版本範圍內將 PostCSS 8.5.19 更新至 8.5.29、Nanoid 3.3.16 更新至 3.3.20、`source-map-js` 1.2.1 更新至 1.2.2；不新增永久 `overrides`、不使用 `npm audit fix` 或 `--force`。npm 解析期間順帶選到的三個非必要 minor 更新已恢復基準版本，最終沒有新增直接依賴、產品執行期套件或非必要 minor 變更。
- 新增 `audit:prod` 與 `audit:all`。GitHub Pages workflow 在安裝前先以精確鎖檔對正式依賴執行 low 以上 fail-closed 稽核，再執行含開發依賴、info 以上的非阻擋完整報告；後者即使正式閘門已轉紅仍會在未取消的情況下執行，並保留原始 outcome、Actions 摘要與 warning，不以 `|| true` 洗成成功。明確稽核後，`npm ci` 使用 `--no-audit` 避免重複隱含查詢。
- 保留 `verify:local` 與 `verify:dist` 的確定性／可離線責任；線上安全告警資料庫與套件登錄服務錯誤不混入產物完整性判決。README 已記錄兩層命令、資料傳輸邊界與 CI 行為。

### 驗證結果

- 修正前重現：完整依賴稽核 exit 1，moderate 3、high 2、critical 0；正式依賴稽核 exit 0、總數 0。修正後 `npm run audit:prod` 與 `npm run audit:all` 均 exit 0、總數 0。
- `npm ci --no-audit --no-fund` 由更新後鎖檔重新建立依賴樹成功；`npm ls` 證明 Vitest 4.1.11、`@vitest/mocker` 4.1.11、PostCSS 8.5.29、Nanoid 3.3.20 與 `source-map-js` 1.2.2 均為實際安裝版本。
- `npm run verify:local` 通過：全庫 oxlint 零警告；347 個 Vitest 測試檔、1,642 個測試全數通過；Supabase schema 靜態契約 56／56 通過；production build 完成 532 個模組。
- 內容衍生 precache `buildId=b159cfeff1320df3`，與本輪基準發布候選相同；`verify:dist` 驗證 298 個產物檔、99 個必要 public 檔、8 個延遲載入路由區塊及 8,064,721 bytes precache 全數通過，最大 bundled JavaScript 為 436,409 bytes。
- 鎖檔差異限定於直接 Vitest 範圍、四項安全告警所屬套件及其同一工具鏈相容解析；沒有 dependency／devDependency 新增、刪除或跨 major 更新。

### 已知限制與發布狀態

- `npm audit` 會查詢外部安全告警資料庫；相同 commit 與鎖檔可能因新告警或套件登錄服務故障而在未來轉紅。正式依賴步驟會阻擋 GitHub Pages 部署；完整依賴圖只作非阻擋報告，因此其失敗不能被解讀為「依賴安全檢查全綠」。
- 現有 GitHub workflow 只在 push 至 `main` 或手動 dispatch 時執行，新增閘門是部署閘門，不是 PR 合併前的 GitHub required check。PR 預覽仍以外部 Cloudflare Pages check 及本機完整 gate 為準。
- 本輪不改變既有驗收缺口：沒有連線 hosted Supabase 驗證跨裝置同步，沒有經由實際檔案選擇器執行匯入 E2E，也沒有在可掛載 React Strict Mode 與 fake timer 的瀏覽器測試環境驗證自動交卷副作用恰好一次。
- 本條目建立時為未提交候選，`commit=false`、`push=false`、`merge=false`、`deploy=false`。Sam 於 2026-10-09 指示「照建議執行」後，已授權本輪精確依賴修補、完整 gate、新分支、PR、合併與 GitHub Pages／Cloudflare Pages 部署驗收；完整 release commit、merge SHA、遠端 CI 與 live manifest 證據由同版本 PR 與交付回報相互引用，不在包含自身的提交內預寫 SHA。
