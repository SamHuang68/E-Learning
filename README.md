# E-Learning Hub｜語言 × 數學 × 微積分 × 物理 × 化學 × 計算機概論八軌學習

> 🏛️ **Sam Huang 專案總入口**：[https://samhuang68.github.io/](https://samhuang68.github.io/)
> 🌐 **E-Learning 線上體驗站**：[https://samhuang68.github.io/E-Learning/](https://samhuang68.github.io/E-Learning/)

同一個 Vite / React 專案內整合 JLPT 日語、TOEIC 多益英語、台湾華語、臺灣 108 課綱數學、微積分、物理、化學與計算機概論。未登入可本機試用；登入後進度可同步至 Supabase。託管於 GitHub Pages（靜態站）。

## 功能成熟度

| 區塊 | 成熟度 | 說明 |
|------|--------|------|
| Hub／語言切換 | 可用 | Hash 路由 `#hub` / `#aoba` / `#toeic` |
| 五十音（語音／閃卡／聽辨） | 較完整 | 平／片假名導讀與練習 |
| 發音基礎（PhonicsLab） | 較完整 | Orange 級字母／高頻字點讀 |
| 練習引擎／SRS | 可用 | 多題型答題、item-level SM-2、今日複習佇列 |
| 分級／模擬考 | 可用 | Placement + 短模考；弱項寫入事件 |
| 漢字／場面／口說 | 可用 | KanjiLab、情境語域、跟讀錄音 |
| Freemium／PWA | 可用 | Pro 閘道（`AOBA-PRO`）、manifest + SW |
| JLPT／多益單元內容 | 持續加深 | 卡數已與 metadata 對齊；CMS manifest 已就緒 |
| 課程設計器 | Demo | 提示詞組裝；日語可選 BYOK 呼叫 Groq |
| 帳號與雲端進度 | 可用 | Email／密碼；同步含 `meta`（SRS／習慣） |

**不會上雲／不會匯出：** Groq API key、builder presets（含個人提示詞風險）。

## 開發

```bash
npm install
cp .env.example .env.local   # 填入 Supabase（可選；不填則純本機）
npm run dev
npm test
```

可用 hash：`#hub` / `#aoba` / `#toeic` / `#privacy`。

```bash
npm run build
npm run preview
```

## 本機（離線）帳號後端

未設定 Supabase 時，App 會自動改用**純本機後端**（`src/lib/localBackend.ts`），以 `localStorage` 實作 Email／密碼登入與 `user_progress` 進度表：

- **無需任何雲端／伺服器**：完全在瀏覽器端執行，與 GitHub Pages 靜態託管相容。
- **登入後進度會保存在該瀏覽器的本機帳號**（每個瀏覽器獨立，不跨裝置同步）。
- 一旦填入有效的 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`，會自動切回雲端，程式碼不需更動。
- 後端種類可由 `getBackendKind()`（`'cloud' | 'local'`）或 `useAuth().backendKind` 得知；UI 文案會依模式調整。

> 注意：本機後端僅為離線／示範用途，密碼以雜湊存於 `localStorage`，並非安全邊界；請勿使用真實密碼。

## Supabase 設定

### 全新專案

1. 建立專案 → Authentication → 啟用 Email/Password  
2. 在 SQL Editor 執行 fresh-install snapshot：[`supabase/schema.sql`](supabase/schema.sql)
3. Authentication → URL：Site URL / Redirect 設為 Pages 網址  
   （例如 `https://<user>.github.io/<repo>/`）  
4. 將 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY` 填入 `.env.local` 與 GitHub repo Secrets  

### 既有專案升級

不要把整份 `schema.sql` 當作 production upgrade script；該檔包含 fresh-install 的 RLS policy 建立流程。請依序：

1. 在 staging／production SQL Editor 先執行唯讀 [`preflight`](supabase/checks/20260901010000_add_stem_progress.preflight.sql)。它會在 DDL 前攔截既有 STEM 欄位的 schema／JSON-object 資料漂移；請完整保存輸出作為升級證據。
2. 於低流量時段執行不可變、單一 transaction 的 [`migration`](supabase/migrations/20260901010000_add_stem_progress_columns.sql)。
3. 執行唯讀 [`postflight`](supabase/checks/20260901010000_add_stem_progress.postflight.sql)。逐列比對 owner、`relrowsecurity`、`relforcerowsecurity`、table `relacl` 與排序後的 policy 結果；所有升級前既有欄位的 `attname`／`attacl` 必須完全相同，三個新 STEM 欄位的 `attacl` 必須為 `NULL`。
4. 先在 staging 驗證登入、讀取與 upsert，再發布依賴新欄位的 hosted-cloud 前端。

Migration 只新增欄位，不會刪除／重建 policies、修改 grants 或移除學習資料。正式套用後不提供自動 drop-column rollback；若要回退前端，保留 additive columns。
`table_privileges`／`column_privileges` 是人類可讀報告；table-level 權限會在新增欄位後自然展開成新的 column rows，因此 ACL 無漂移的判定以 `relacl`／`attacl` catalog 結果為準。

同步行為：

- **Write-through：** 先寫 localStorage，再 upsert 雲端  
- **登入時：** 雲端列不存在 → 上傳本機；已存在 → 以雲端覆蓋本機  
- **欄位：** `aoba` / `kana` / `toeic` / `math` / `physics` / `chemistry` / `meta`（jsonb）、`lang`、`updated_at`

Pro demo 解鎖碼：`AOBA-PRO`（免費可用五十音／Phonics 與 n5n4／orange 前兩單元）。

## GitHub Pages 部署

1. Push 到 `main`  
2. Repo → Settings → Secrets：`VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`  
3. Settings → Pages → Source = **GitHub Actions**  
4. Workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) 會以 `VITE_BASE_PATH=/<repo>/` 建置並部署  

Hash 路由無需 SPA fallback。

## 隱私與資料控制

- Hub 可開啟 `#privacy` 說明  
- 匯出／匯入 JSON（僅進度）、清除本機進度快取  
- 登入用戶可重設雲端進度  

詳見授權：[LICENSE](LICENSE)（MIT）。

## 日語站（あおば Aoba）

**最上層分級：JLPT 級距**

| 級距 | 定位 |
|------|------|
| N5 / N4（基礎） | 初學者至基礎對話；生活常見詞彙與短句 |
| N3（中級） | 稍複雜文章與常速對話 |
| N2 / N1（進階） | 求職／留學門檻 |

**基礎層**：五十音平／片假名語音導讀（ja-JP）、閃卡、聽音選字。

進度 key：`aoba-progress`、`aoba-kana-progress`（本機）；登入後一併進雲端。

## 多益站（TOEIC Path）

**最上層分級：證書分數級距**（非真實考試估分；可手動切換證書）

| 證書 | 分數 | 定位 |
|------|------|------|
| 金色 Gold | 860–990 | 近母語；會議主持與協商 |
| 藍色 Blue | 730–855 | 社交與例行業務；外商／外派門檻 |
| 綠色 Green | 470–725 | 大學畢業／多數本土企業門檻 |
| 橘／棕 Orange | 10–465 | 基礎字彙；長篇與複雜商業語境不足 |

每個證書底下 **6 個 Units**；技能路徑：單字 → 聽力 → 文法／商務句型。

- **發音基礎（PhonicsLab）** — Orange 級字母／高頻字 en-US 點讀  
- **今日學習** — 證書 banner、三任務、單元地圖、XP  
- **課程設計器** — 會議／郵件／談判等情境提示詞（精簡四步）  

新學員預設 **Orange（10–465）**。進度 key：`toeic-progress`。
