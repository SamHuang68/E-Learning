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

## pr-required-checks.1 — 2026-10-09 — 發布候選

沿用 npm package `0.0.0` 與內容衍生 precache `buildId` 的版本策略。本輪基底為 `aee980faf0c0c801d48d0d6355708b6055f11fc8`，只修改 CI workflow、README 與本修訂紀錄。

### 修改原因與內容

- 原本完整品質閘門只在 `main` push 後執行，合併前唯一遠端檢查是 Cloudflare 預覽，且 `main` 沒有 required check。現在目標為 `main` 的 PR 與正式部署重用同一個「完整驗證」job，保留兩層 audit、lint、全部測試、schema、build 與 `verify:dist`，不新增平行驗證管線或降低既有門檻。
- PR 使用預設合併參照 checkout、唯讀 token 與獨立 concurrency 群組；不注入 Supabase 設定，不上傳 Pages artifact，也不進入部署 job。Pages／OIDC 寫入權限只授予 `main` 部署 job，手動執行其他分支也只作驗證。
- 預定將 GitHub Actions 來源的「完整驗證」設為 `main` required check，要求最新基底並套用管理員；先取得候選的實際 PR CI 證據，再啟用保護規則及合併。GitHub repository 設定的實際啟用結果由同版本 PR 與交付回報互相引用。

### 驗證結果

- actionlint 1.7.12 通過；29 項 workflow 政策檢查通過，包含同來源／fork PR、`main` push、`main` 手動執行及其他分支手動執行的權限、秘密、上傳、部署與 concurrency 分流。獨立唯讀審查為 Critical 0、Required 0、Advisory 0。
- 精確鎖檔 `npm ci --no-audit --no-fund` 成功，兩層 npm audit 均為 0 項弱點；本機 Pages base-path build 完成 532 個模組，`verify:dist=PASS`：buildId `9e03b661bb41c671`、298 個檔案、99 個必要 public 檔案、8 個延遲載入區塊、8,065,495 bytes precache、最大 bundled JavaScript 436,420 bytes。
- `git diff --check` 通過，實際變更僅為三個允許檔案。應用程式與依賴未變，本輪不另外重跑本機全套測試；候選的完整 lint、Vitest、schema 與遠端合併前／部署結果將由本次 PR CI 實際執行並追加記錄，尚未執行者不列為通過。

### 已知限制與發布狀態

- PR CI 的 schema 為靜態契約，build 使用本機後端；既有 hosted Supabase、真實檔案選擇器匯入與 Strict Mode 自動交卷驗收缺口維持原紀錄。
- 完整依賴 audit 仍為非阻擋報告；正式依賴 audit 與必要品質步驟的失敗會阻擋完整驗證。
- Sam 指示「照建議執行」授權本輪 PR CI、required check 與發布驗收。條目建立時 `commit=false`、`push=false`、`merge=false`、`deploy=false`；完整 SHA、PR、遠端 CI、分支保護 readback 與部署證據由同版本 PR 追加記錄，不在包含自身的提交中預寫 SHA。

## 語音教學.1 — 2026-10-09 — 未提交本機候選

### 修改原因、範圍與版本識別

- Sam 要求語言學習加入語音教學，並確認依「原文示範 → 既有解說 → 留白跟讀」實作。日語與英語學習卡、情境練習，以及臺灣華語對話、拼音與訊號卡共用同一播放核心；保留教材文字、既有語系、學習進度與本機儲存契約，不新增平行教材資料來源。
- 新增正常／慢速、播放導讀、只聽原文、重播當句及停止。測驗未選答案不朗讀；情境答錯只讀本人選答與既有回饋，不把錯誤選答當作跟讀示範。華語教材的日語或英語解說按原契約選用聲音，華語原文維持 `zh-TW`。
- 沿用系統語音與既有音檔回退；段落依真正結束事件前進，不以固定短逾時截斷長句。播放具有所屬停止權限，單句／音檔／導讀互斥，停止、換教材、換語系、隱藏頁籤與卸載會清理聲音、留白及舊回呼。
- 缺少適用聲音、瀏覽器不支援與播放錯誤均明示，不隱藏文字或自動改用其他地區華語。鍵盤、live status、深色對比、停用狀態與 390px 版面沿用既有介面風格。
- 候選分支：`codex/language-voice-teaching`；完整基準 SHA：`809ee402f7cbffeac24b28e4bf09b9dcbff3185b`。候選尚未提交，沒有可追溯的候選 commit SHA，不能視為交付完成。
- 版本策略維持內容導出的 precache buildId；`package.json` 的 `0.0.0` 並非發布版號。本機最終建置 buildId 為 `9f2f578886b1b18c`，`dist/precache-manifest.json` SHA-256 為 `3de17d5dafb4177cdbfa69075914c5bee7d932125f657d43ced0800dbf7969db`。

### 實際驗證結果

- 11 個限定測試檔、139 個案例全部通過：語音核心、導讀佇列、共用介面、日英／華語使用端、既有無障礙、教材語系保存與媒體延遲載入契約。包含長句、真正結束後續播、解說後才留白、互斥、舊停止權限、錯誤、缺聲音與清理回歸；部分介面測試為明示 SSR／hooks 替身，不冒充真實掛載。
- 18 個修改／新增 TypeScript 檔案限定 lint 通過；TypeScript 與正式建置通過，536 個模組。`verify:dist=PASS`：299 個 precache 檔案、99 個必要 public 檔案、8 個延遲路由區塊，precache 共 8,081,083 bytes，最大 bundled JavaScript 436,459 bytes。
- 使用端、播放核心及畫面各完成限定唯讀複審；已修正音檔重疊、留白被其他朗讀中斷後恢復、深色控制對比、錯誤主狀態與教學順序等發現。相同審查者複審後均無未解決必要修正；不稱為跨供應商審查。
- 真實本機瀏覽器確認英語正常／慢速的原生開始及結束事件；整課原文、意思、情境、語體四段真正結束後才回顯原文進入跟讀。臺灣華語觀察到原生開始／結束與後續句開始；停止、換卡、換聲調、換語系及鍵盤 Escape 經實際操作確認。
- 桌面 1280px 與手機 390×780 均無文件或導讀容器水平溢位；Tab 順序、44px 控制、深色次要按鈕 8.28:1 對比與受控錯誤畫面經確認。詳細證據與截圖位於本工作樹忽略的 `logs/語音教學-畫面驗收紀錄.md`，不順手納入提交。

### 已知限制、權限與真實狀態

- 本輪沒有錄音或人工聽辨，原生事件不等於音質／可聽性驗收。內建瀏覽器缺日語聲音；Chrome 有日語聲音且取得結束事件，但未取得可信開始事件，因此日語有聲播放仍未驗收通過。可用聲音及離線能力依裝置而定，部分系統聲音需要連線。
- 受控錯誤回呼及隱藏／離頁清理測試，不代表自然硬體故障或真實作業系統視窗切換已驗收。本輪未跑全儲存庫掃描或全套測試，未重新執行遠端 CI；不把既有發布結果套用到此候選。
- 不新增麥克風權限、錄音評分、語音辨識、可對話雲端老師、外部模型服務或新的語音供應商。
- 實際狀態：`commit=false`、`push=false`、`merge=false`、`deploy=false`；本輪發布授權：無。所有程式與紀錄保留在隔離工作樹，正式網站、舊工作目錄及使用者既有進度未進版。本機提交仍需取得本輪授權，正式交付條件尚未齊備。

## 語音教學.2 — 2026-10-09 — 未提交本機優化候選

### 修改原因、根因與防再發

- Sam 指示「繼續優化」。沿用語音教學.1 的共用來源、教材、視覺風格與進度契約，不新增語音服務、麥克風或錄音評分能力。
- 實際瀏覽器重現「只聽原文」只播放一段卻顯示全課四段的分母，停止後隱藏重播目標。根因為介面混用全課索引與選取範圍，且只在 active 狀態顯示文字。現以本次完整導讀／原文示範／當句重播範圍計數，完成訊息分開；停止、完成及失敗後保留完整目標、段落種類與語言，換教材或語系仍清除舊目標。
- Chrome 日語原生邊界曾只回報 `end` 而沒有 `start`，舊核心卻宣稱完成；受控重現另證明完全無事件會停留在播放中。根因為應用程式未區分等待啟動、真正播放與失敗，不能據此推論瀏覽器未開始的底層原因。
- 現以 TTS 正常原文的 `start`、音檔的 `playing` 才進入播放中；未開始即結束、10 秒內未啟動或已開始後連續閒置卻遺失結束事件，均收束成可重試失敗並清理所屬資源，不宣稱完成或續播。啟動期限不截斷真正開始的長句；speaking／pending 期間不使用閒置判定。
- 音檔無法啟動沿用既有 TTS 回退。舊回呼、換代、互斥與停止權限維持原契約；新增有效失敗回歸後才修正，包括只有結束、完全無事件、遺失結束、同步音檔失敗、長句及範圍／重播目標狀態。

### 版本識別與實際驗證

- 同一候選分支 `codex/language-voice-teaching`，完整基準 SHA `809ee402f7cbffeac24b28e4bf09b9dcbff3185b`；本輪仍未提交，沒有候選 commit SHA，不能視為正式交付完成。
- 11 個限定測試檔、169 個案例全部通過；18 個修改／新增 TypeScript 檔案限定 lint、TypeScript 與正式建置通過，536 個模組。部分介面狀態案例使用明示 SSR／hooks 替身，不冒充真實掛載。
- `verify:dist=PASS`：buildId `8f4a2f2244f1515d`，299 個 precache 檔案、99 個必要 public 檔案、8 個延遲路由區塊，precache 共 8,082,782 bytes，最大 bundled JavaScript 436,459 bytes；manifest SHA-256 `0f374e6635b2e2541848e9fadad119d039a651c483a6b42a545bfb5223f527ce`。版本維持內容導出的 buildId，不把 `package.json` 的 `0.0.0` 當作發布版號。
- 真實英語瀏覽器操作確認原文示範為 1/1、完成訊息符合範圍，重播等待啟動時可停止且保留目標。完整導讀四段均收到原生開始／結束，解說結束後才回顯原文進入跟讀，最後顯示完整導讀完成。
- 本次 Chrome 日語原文在音量 1 下取得真正 `start` 與 `end`，兩事件間約 2.533 秒，原文示範完成。這是本次成功觀察，不能宣稱已查明或修復 Chrome／Google 聲音先前未開始的底層原因。另以明示受控的只有結束事件驗證實際錯誤介面，未誤顯示完成；事件替身已還原。
- 桌面 1280×900、手機 390×780 與手機 200% 文字的文件／導讀容器均無水平溢位，控制高度至少 44px。Windows 150% 顯示比例造成最初預設截圖裁切，已改以 CSS visual viewport 明確擷取完整範圍；原圖保留但不作驗收通過證據。新版桌面／手機圖由同一畫面審查者確認完整且自然換行。
- 播放核心與畫面完成同一審查者的限定複審，Critical 0、Required 0、Advisory 0；無 P2 以上未決修正，不稱為跨供應商審查。觀點與裝置責任界線沿用中立教學契約。根因與修正後證據保留於忽略的 `logs/語音優化-播放根因證據.md`，不順手納入提交。

### 已知限制與實際狀態

- 未錄音或人工聽辨，原生開始／結束不等於可聽性、音質或發音評分驗收。聲音可用性與離線能力仍依裝置／瀏覽器而定；內建瀏覽器沒有日語聲音，Chrome 的日語聲音非本機服務。本輪不重新宣稱臺灣華語的可聽性驗收。
- 只有結束的錯誤畫面屬受控案例，不能當作自然硬體故障已重現或底層根因已解決。沒有跑全儲存庫掃描、全套測試或遠端 CI，也沒有把既有發布證據套用到本候選。
- 驗證使用獨立的 `127.0.0.1:5191` 來源；兩個頁籤的原始四個儲存鍵值已完整比對還原，僅移除本輪新增的介面語系暫存鍵，未改 XP 或教材完成度。事件觀察器移除、原生播放停止，頁籤與本輪擁有的開發／截圖服務已關閉，5191／3829 已無監聽者。
- 實際狀態維持 `commit=false`、`push=false`、`merge=false`、`deploy=false`，沒有新增本機提交或發布授權。候選保留於隔離工作樹，正式網站與既有使用者資料未進版。

## 語音教學.3 — 2026-10-09 — 本機交付候選

### 修改原因、根因與補完範圍

- Sam 指示「補完，繼續優化」，並明確授權完整本機品質閘門及明確檔案清單的本機提交；不推送、不合併、不部署。沿用前兩輪語音教學來源、教材、視覺風格與進度契約，不新增聲音供應商、錄音評分、麥克風或課文音檔。
- 有效重現剩餘缺口：音檔收到真正 `playing` 後，若 `currentTime` 不再前進又沒有 `ended/error`，舊播放器因已清除啟動計時器而永久保留播放中。根因是只有「開始前期限」，沒有「開始後進度」終止邊界。
- 在同一 `playClip` 每 250ms 觀察進度；真正前進重設 10 秒無進度期限，連續停滯才回報既有失敗並清理原音檔，由原 controller 回退同一原文、語言與語速。不是整段播放期限，不截斷有進度的長音檔或慢速。
- 新增 12 個有效回歸案例，涵蓋 0.25／0.8／1 倍速前進 65 秒、反覆 9 秒緩衝後恢復、最後進度起算、反覆 playing、同步停止／換播放者及終止／晚到回呼清理。原有長句、互斥與真正結束斷言保留；同一限定審查者複審為 Critical 0、Required 0、Advisory 0。
- 真實 MP3 掛載驗收另發現來源說明固定宣稱純系統合成／非真人錄音。已沿用現有 audioSrc 契約區分音檔教材與純 TTS，不新增來源欄位，也不推論音檔是真人或合成；保留離線／連線與非發音評分界線。新增繁中／英文兩項有效 red 後修正，27 個共用介面案例全數通過。

### 完整本機品質閘門與版本識別

- 按 Sam 本輪授權執行既有 `npm run verify:local`；來源文案修正後的最終全庫 lint 零警告、351 個測試檔／1,785 個案例全部通過、Supabase 靜態 schema 56／56 通過、TypeScript 與正式建置通過（536 個模組），總指令 exit 0。初次 1,783 案例通過的紀錄保留，但不套用到最後修改的來源文案。沒有執行 hosted Supabase、遠端 CI 或發布驗收。
- `verify:dist=PASS`：buildId `107a161ee5d80eb3`、299 個 precache 檔案、99 個必要 public 檔案、8 個延遲路由區塊，precache 8,083,410 bytes；最大 bundled JavaScript 436,459 bytes。Manifest SHA-256 `2dd0b30080287fb63edcae263fe6cf2aa059792edb6eb1d0600dc98a9f00e1a0`。版本策略仍為內容導出 buildId，不把 npm package `0.0.0` 當發布版號。
- 基準完整 SHA `809ee402f7cbffeac24b28e4bf09b9dcbff3185b`，分支 `codex/language-voice-teaching`。此條目建立時尚未提交；完成提交後另追加同版本的完整來源 SHA 與交付紀錄，不在自己的提交內預寫 SHA。明確清單只包含候選程式、測試、契約及 revision history，不順手納入 logs、截圖、驗收 fixture 或進度資料。

### 真正掛載與原生邊界驗收

- 真正英語練習介面以受控只有結束事件確認失敗、目標保留及原按鈕可重試，再恢復原生 TTS，取得開始／結束及原文示範完成。另在真正掛載時以明示空清單確認載入、停用與文字保留；超過就緒等待後還原原生清單並觸發 voiceschanged，不重新載入就恢復可播放。
- 明示本機 fixture 掛載正式 `AudioLesson`，使用相符且未修改的既有「あ」單音 MP3；取得原生 playing／ended 並完成示範。跟讀留白中切慢速會停止並保留目標，不自動續播。此頁位於忽略的 logs，沒有接到正式教材或發布。
- 受控暫停真正播放的 MP3，使其沒有 ended/error 且時間停止前進，確認播放器回收原音檔並回退。內建瀏覽器缺日語聲音時明示缺聲音失敗；Chrome 有日語聲音，但本次原生回退僅收到 end、沒有 start，故應用程式正確顯示未啟動失敗，不把前輪日語成功事件套用成這輪通過。
- Chrome 音檔 playing 在 16,751.1ms、受控 pause 在 16,903.4ms；回退 preparing 在 27,018.1ms，約於暫停後 10.115 秒。原音檔已 pause 且 currentTime 重設 0；原文 TTS 為「あ」、ja-JP、音量 1、速率 0.95，只有 end，最後為明示失敗。這是受控停滯與真正原生 TTS 的分開證據，不宣稱自然網路故障或音質驗收。
- 詳細掛載／原生證據與截圖保留在忽略的 `logs/語音補完-掛載與原生驗收.md`；最終完整閘門輸出在 `logs/語音補完-最終完整本機閘門.txt`，初次閘門檔保留。音檔來源複驗圖明示 supplied lesson audio 與系統語音回退，純 TTS 原文案不變。

### 已知限制及權限邊界

- Chrome 連線型日語聲音先前與本次未開始的底層原因仍未查明；應用程式已能有界失敗、清理及重試，不能把這項保護宣稱為聲音供應商或裝置故障已解決。未錄音或人工聽辨，不宣稱三語音質、可聽性或發音評分通過。
- 現存假名單音不能替代課文錄音。TOEIC 三筆課文 MP3 引用仍是既有缺檔占位，因此只可驗回退，不能報為真人／課文音檔播放成功。不新增教材來源或自動下載來源未核對的音檔。
- 本輪授權只涵蓋完整本機驗證與本機提交；`push=false`、`merge=false`、`deploy=false`，發布授權：無。正式網站、既有使用者進度、舊工作目錄及課程資料未進版；裝置實際聽辨及遠端整合／發布保持未驗證。
- 驗收後已還原本輪來源的原始瀏覽器暫存與輔助設定，重新載入清除方法替身及觀察器，確認沒有待播語音後關閉三個本輪頁籤。已停止本輪持有的服務，5201、12535、9040 監聽數為 0；驗收圖片、fixture 與 logs 保留但不提交，未終止其他程序。

### 同版本本機提交完成補記

- 2026-10-09，程式提交已完成：`4f9105b4efcb7296bfc220c2e998fad0872df529`，訊息「補齊三語語音教學與播放復原驗證」。完整 tree `53bef4625ac4b41971ea4a2c5306f89f4c4b9672`，基準仍為 `809ee402f7cbffeac24b28e4bf09b9dcbff3185b`。
- 明確清單共 21 個程式、測試與修訂檔案；暫存集合完全符合清單、`git diff --cached --check` 通過、`dataStaged=0`、`logsStaged=0`。檢查沒有啟用的 Git hooks，未推送、合併或部署。
- 同版本完整來源、buildId `107a161ee5d80eb3`、Manifest 雜湊、1,785 個案例結果、原生與受控證據、限制及清理紀錄見 [三語語音教學本機交付紀錄](docs/語音教學本機交付紀錄.md)。本補記與交付紀錄以後續純文件提交保存，不預寫自身 SHA，不改動已驗證的程式或產物。
- 狀態：本機程式已提交，`commit=true`、`push=false`、`merge=false`、`deploy=false`，發布授權：無；正式網站與舊工作目錄未更新。

## 語音教學.4 — 2026-10-09 — 本機素材與裝置補完候選

### 缺口、根因與修改內容

- Sam 再指示「補完」，並授權將 Windows 官方日語語音套件納入；沿用既有完整本機驗證及本機提交授權，不推送、不合併、不部署、不新增雲端聲音供應商。
- 先核對既有資源，確認 `orange:6` 三筆 passage 的 `audio.src` 為缺檔占位，而非遺失已交付錄音；既有假名音檔語言及內容不符，不能拿來代替英語課文。直接使用同一 canonical 原文，以已安裝 Windows `Microsoft David Desktop`／`en-US` 及既有 FFmpeg 8.0.1 補齊三段合成 MP3，不下載錄音或新增依賴。
- 三筆原文、卡片識別及音檔路徑不變；只將原占位的長度及 `studio` 聲音改為實測長度 2900／2926／2821ms 及真實聲音名稱。音檔、README、檔內 ID3 與素材測試明示系統合成、非真人錄音及來源／音檔雜湊。
- 產音腳本直接讀取原教材，限定三筆與工作樹內固定目標；產生前拒絕任何既有目標，沒有覆寫選項。完成全部轉檔及全檔解碼才複製，保留具名暫存證據。重跑拒絕測試確認沒有新增暫存或更動三個音檔。
- 真正正式聽力頁慢速驗收找出音檔來源載入會將 `playbackRate` 重設為 `defaultPlaybackRate`，而舊程式只提前設定前者；原測試替身未模擬該原生行為。先使替身重現重設並取得有效失敗，再將兩個速率同步為同一選定值，保留所有原測試。
- 日語選聲改為優先選目前原生清單中的本機日語聲音，沒有才沿用既有其他日語。四個新增回歸涵蓋順序、聲音清單更新與原英文選聲不變；不更改臺灣華語、播放期限、暖機或事件契約。

### 實際驗證與版本識別

- 修正後最終 `npm run verify:local` exit 0：全庫 lint 通過、352 個測試檔／1796 個案例全部通過、靜態 schema 56／56、TypeScript 與正式建置通過（536 模組）、`verify:dist=PASS`。沒有執行 hosted Supabase、遠端 CI 或發布閘門。
- 初次完整測試因素材測試放在教材 `data/**/*.ts` 內，被既有 canonical glob 當作第 52 個教材模組而失敗；已把測試移到 `src/toeic/課文音檔素材.test.ts`，保留既有 glob 與 51 個教材模組斷言，不降低測試覆蓋。失敗紀錄保留；最後通過結果才屬本候選。
- buildId `70085cd6694db1d1`，302 個 precache 檔案、102 個必要 public 檔案、8 個延遲路由區塊，precache 8226076 bytes、最大 bundled JavaScript 436459 bytes。Manifest SHA-256 `d8e4f84954ca7d3638a3dbc1a316fc7fd0da2ac3e791b3fc36245af535878d09`；版本仍依內容導出，不把 npm package `0.0.0` 當發布版號。
- 三段 MP3 全檔解碼通過，格式及 canonical 原文／來源／音檔雜湊測試通過。正式聽力頁三段均取得真正原生 `playing`／`ended`，沒有音檔錯誤或 TTS 回退；前兩段播放發生在速率修正前，不作為正常 0.95 倍速的證據。
- 修正後同一正式第三段原文，慢速 0.7 的原生開始／結束間隔約 4.045 秒，正常 0.95 約 2.993 秒；音檔長度 2.821188 秒，兩種播放的 `playbackRate`／`defaultPlaybackRate` 均符合選項。原有 `SpeakButton` 仍是 1 倍速且取得真正結束。未點擊完成或增加 XP。
- Vitest 重寫一個既有快照的換行；確認內容與 HEAD 位元組雜湊相同後，僅機械還原工作樹 CRLF，不納入本次變更。完整品質輸出及正式頁原生證據保留於忽略的 `logs/語音素材補齊-最終完整本機閘門.txt`、`logs/語音素材補齊-原生驗收與根因.md`。
- 同供應商隔離唯讀審查完成，11 個程式與素材檔案沒有已證實的阻擋或必要修正（Critical 0、Required 0）；審查者另實跑 3 檔 92 測試、PowerShell 5.1 AST 零解析錯誤及素材位元組／格式／長度／雜湊核對。這不是跨供應商審查，也不代替原生播放或人工聽辨。

### 尚未完成與授權邊界

- Windows 官方日語套件已獲授權，但目前執行身分非管理員且原生 Windows GUI 控制不可用；已請 Sam 從官方語音設定加入日語。尚未收到安裝完成確認，系統及內建瀏覽器仍沒有本機日語聲音，因此安裝與新的本機日語原生播放保持待驗證，不宣稱整體裝置補完完成。
- 先前 Chrome 連線型日語只結束、不開始的底層原因仍未知。本機優先選聲只解決選擇順序，不代表已修復遠端聲音或保證跨瀏覽器可用。未錄音、人工聽辨或轉錄，不宣稱音質、逐字發音及可聽性通過。
- 本候選基準為 `95a3efaefa5b60c48d1f4c471801d3fe98cf0562`，分支 `codex/language-voice-teaching`。條目建立時仍未提交；之後追加同版本的真實完整來源 SHA 及交付紀錄，不預寫自身 SHA。
- `push=false`、`merge=false`、`deploy=false`，發布授權：無。正式網站、舊工作目錄及既有使用者進度未更新；驗收 logs、截圖與產音 WAV／副本保留，不納入提交。
- 驗收後將獨立來源 5211 的原始四個瀏覽器儲存鍵值逐字比對還原，只移除本輪建立的 demo 解鎖資料；XP／完成度不變。重新載入確認觀察器已移除、speaking／pending 均為 false，關閉本輪頁籤及自有服務；5211／10457 監聽數均為 0，未終止其他程序。最後唯讀核對仍為本機日語聲音 0、非管理員，安裝待完成。

### 同版本程式與素材本機提交完成補記

- 2026-10-09，真實完整來源 SHA `90338d63d6dd06e3f1e757d57637c5e237da2c83`，訊息「補齊英語課文音檔與本機日語選聲」，基準 `95a3efaefa5b60c48d1f4c471801d3fe98cf0562`；tree `fb9da71bab4c77ed4386136898f25c3c6520058d`、src tree `a014fbd2e2288344461c300af8100f3990108ad8`。
- 精確提交 13 檔，暫存清單 unexpected／missing 均為 0、差異檢查通過、dataStaged 及 logsStaged 均 0。新素材、來源、buildId `70085cd6694db1d1`、1796 測試與安裝待完成邊界見 [同版本本機交付紀錄](docs/語音教學本機交付紀錄.md) 的語音教學.4；本補記以後續純文件提交保存，不預寫自身 SHA。
- 程式與素材 `commit=true`、`push=false`、`merge=false`、`deploy=false`；正式網站未更新。官方日語安裝及安裝後實機驗收仍待完成，不將本機程式／素材提交宣稱為整體補完完成。

### 同版本日語安裝與重開機驗收補記 — 2026-10-09

- Sam 回覆「已重開機 繼續」後，實際確認 Windows 已於 11:05:25.5 重新啟動、CBS 待重新啟動旗標解除；SAPI／OneCore 已註冊日語聲音，OneCore 包含 Ayumi、Haruka、Ichiro、Sayaka。
- 不改程式、素材、教材或版本。來源仍為 `90338d63d6dd06e3f1e757d57637c5e237da2c83`，本輪文件基準 `a8f35115a04894f59cd897d205ce652284773937`，src tree、buildId `70085cd6694db1d1` 與實際 precache manifest 雜湊均未變。
- 內嵌瀏覽器正式日語課文首次取得 Ayumi 本機聲音的原生 start／end，並顯示完成。Chrome 初次只回報 end，介面正確顯示未開始；原生單句對照、正式重試及重載後首次正式播放均取得真正 start／end。保留初次失敗，未證實其底層原因，不宣稱 Chrome 首次播放問題已根治。
- 沿用同一來源已通過的 352 檔／1796 案例及完整本機閘門；本輪只補新的聲音環境與瀏覽器觀測、文件差異及字形檢查，沒有重跑完整測試或建置。一位同供應商限定唯讀支援未確認需要修改程式的根因，沒有追加測試。
- 完整事件、版本、圖片、限制及清理狀態見 [本機交付紀錄的重開機補記](docs/語音教學本機交付紀錄.md)。未錄音、人工聽辨或驗證喇叭實際輸出；未將原生事件成功擴張成音質、完整課程或跨裝置保證。
- 驗證頁原始儲存值完全不變，XP／完成度未增加；觀測器移除、speaking／pending=false，本輪頁籤與自有程序已關閉。純文件兩檔以本機提交保存，完整 SHA 由交付訊息與 Git 追溯；不預寫自身 SHA。`push=false`、`merge=false`、`deploy=false`，遠端 CI 未執行，正式網站未更新，發布授權：無。

### 同版本 Chrome 網站靜音根因補記 — 2026-10-09

- 在 Chrome `154.0.8037.98` 以持久化原生事件重現首次 end 無 start；當下真點擊、焦點、可見性與本機 Ayumi 皆正常。Sam 查看頁籤選單確認網站／分頁正被靜音，取消後同頁、同程式、同句、同速率立即取得正常 start／end，約 3.1376 秒，正式畫面完成。
- 已對齊同版 Chromium 官方原碼：靜音頁籤可在瀏覽器端直接中止請求，Blink 通訊端斷線再以無錯誤結束收尾。這解釋本輪只 end 無 start 的觀測；保留既有開始事件守門，不改選聲、pad、取消或逾時流程，不增加自動重試。
- 程式／素材零變更，來源 `90338d63d6dd06e3f1e757d57637c5e237da2c83`；本輪文件基準 `5f843738b6106531d3d45d2aee28541999f2474b`，buildId `70085cd6694db1d1` 與實際產物雜湊不變。沿用既有 352 檔／1796 案例完整閘門，未重跑測試或建置。
- 完整來源引用、前後事件、限制與防再發見 [本機交付紀錄的靜音根因補記](docs/語音教學本機交付紀錄.md)。歷史其他失敗缺少當下靜音觀測，不回溯宣稱全部同源；未錄音或人工聽辨。
- 原始進度與儲存值不變，驗證頁、觀測器及自有程序均已清理；保留 Sam 主動取消靜音的設定。純文件兩檔本機提交，不提交診斷 logs；完整 SHA 由交付訊息及 Git 追溯。`push=false`、`merge=false`、`deploy=false`，遠端 CI 未執行，正式網站未更新，發布授權：無。

## 2026-10-09｜語音教學.5｜音訊自助檢查與實際選用音源

- 原因：先前網站靜音事件顯示，只有播放狀態不足以協助使用者判斷聲音來源或自行恢復。本輪沿用既有聲音選擇、音檔回退與播放所有權，沒有新增平行播放器。
- 正常導讀與短句試播均顯示實際選用音源：教材音檔、系統聲音名稱、本機／連線／未知服務；音檔失敗轉語音時保留原因。不把選用來源或播放結束宣稱為實際聽到聲音。
- 新增可收合的音訊檢查：取目前課文各語言第一短句，最多 160 個 Unicode 字元，沿用語速、不留白、不寫入學習進度；提供語音清單更新、靜音／裝置音量／缺少聲音的恢復說明及本次聽感回報。
- 診斷只在記憶體保留最近一次嘗試及最多 16 筆階段事件。手動匯出採明列欄位，排除教材、音檔網址、帳號與進度；不錄音、不自動上傳，剪貼簿不可用時提供手動複製。
- 有效局部證據：4 個測試檔共 136 案例、變更 TypeScript 檔 lint、型別及建置通過；本機 buildId `01ea4c689bb7ac84`。沒有執行完整測試、完整掃描或遠端 CI。
- 實際課文頁：本機 Ayumi 正常／慢速原生開始與結束、鍵盤啟動、停止、語言切換清理、390 像素版面；另以明示受控情境檢查無開始事件、缺少聲音及複製成功／拒絕。XP 維持 0，原始儲存值已還原。未人工聽辨、錄音或驗證其他裝置。
- 同供應商隔離唯讀審查找到中日文句號後無空白會多取下一句的 P2；先重現兩個失敗案例，再修正句界並驗證通過。作者自審確認處置，沒有跨供應商或人工簽核。
- 基準 `372a5af1d76fbd032c65557153e416ac0f81c879`，分支 `codex/audio-self-check`。本輪為本機交付；完整提交 SHA、產物雜湊與證據見同版本交付回執及 Git 歷史。`push=false`、`merge=false`、`deploy=false`；正式網站未更新，既有版本的發布授權未擴張至本輪。

## 2026-10-09｜語音教學.6｜段落導覽與本機播放偏好

- Sam 選擇 A「接續功能強化」，只授權本機實作、必要驗證與提交，暫不發布。基準 `2edeec84461162f5c28232a8cfdf145d92809b56`，沿用分支 `codex/audio-self-check`。
- 語音教學新增段落選單、上一段／下一段及完整重播預覽。選取先停止目前播放，清除舊音源／診斷，再由「重播當句」明確啟動；首尾不循環、不因鍵盤移動選項自動出聲，仍沿用同一播放器。
- 語速與留白保存於既有本機偏好類別的新鍵 `e-learning-audio-lesson-v1`，只接受 0.95／0.7 與布林值。重新開啟載入，不隨學習進度匯出、匯入、同步或清除；儲存失敗仍可使用本次選擇，並明示可能無法保留。未新增跨分頁即時同步。
- 最小驗證為 4 檔共 57 案例、變更 TypeScript 檔 lint 及既有建置（含型別）通過。新增元件行為先取得 3 個有效紅燈；建置曾發現測試額外欄位的型別轉換問題，修正測試資料宣告後通過，未改弱斷言。buildId `f36e5ae56076f096`，302 個 precache 檔案；未跑完整測試、全庫掃描或遠端 CI。
- 實際本機正式課文頁驗證偏好重載、鍵盤首尾與下一段、所選解說原生 start／end、播放中切段取消、繁中／英文與 390 像素版面；受控儲存拒絕及遲到的舊 end 事件分開記錄。一位同供應商隔離唯讀審查無阻擋發現，非跨供應商或人工簽核。
- 完整證據、限制與 SHA 對應見 [同版本本機交付紀錄](docs/語音教學本機交付紀錄.md) 及忽略的 `logs/段落偏好-本機交付回執.md`。本機完整提交 SHA 於提交後記錄，不預寫自身 SHA；`push=false`、`merge=false`、`deploy=false`，正式網站未更新。

## 2026-10-09｜語音教學.7｜從所選段落接續播放

- Sam 要求「再推進一輪」，延續本機功能強化、不發布的範圍。基準 `3d79bf3fff831ac56c83a22f1d19fb2fd17a032d`，沿用 `codex/audio-self-check`。
- 新增「從此段播放」，使用既有播放器接續目前段落到課尾；只檢查剩餘內容的聲音可用性，沿用語速與留白，不補播前方原文或其留白。原有全課、原文及單段播放保持不變。
- 完成訊息明示「剩餘段落播放完成」，進度按本次選段計算，不冒充全課完成；空教材停用新按鈕且不引用不存在的無障礙說明。
- 本輪 40 個元件案例與 1 個新增整合案例、3 檔局部 lint、型別及建置通過。5 個新增元件案例先紅後綠；空內容說明另先重現再修正。未重跑其餘 60 個核心案例或完整測試。buildId `e58cd1978142f14b`，302 檔。
- 實際課文從第 2 段播到第 4 段，三段取得原生 start／end，進度 1/3→2/3→3/3，完成範圍正確；390 像素下 Enter 啟動、Escape 停止、無溢出。另以受控聲音清單證實前段缺聲音不阻擋可播後段，未宣稱人工聽辨或跨裝置驗收。
- 完成作者差異自審；一位同供應商助手只做唯讀契約盤點，不列為隔離程式審查。原始偏好與驗收程序已還原。完整證據與 SHA 見同版本交付紀錄及 `logs/接續播放-本機交付回執.md`；`push=false`、`merge=false`、`deploy=false`，未更新正式站。
