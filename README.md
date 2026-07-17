# E-Learning Hub｜あおば日語 × TOEIC English

同一個 Vite / React 專案內的雙產品學習站。未登入可本機試用；登入後進度同步至 Supabase。託管於 GitHub Pages（靜態站）。

## 功能成熟度

| 區塊 | 成熟度 | 說明 |
|------|--------|------|
| Hub／語言切換 | 可用 | Hash 路由 `#hub` / `#aoba` / `#toeic` |
| 五十音（語音／閃卡／聽辨） | 較完整 | 平／片假名導讀與練習 |
| 發音基礎（PhonicsLab） | 較完整 | Orange 級字母／高頻字點讀 |
| JLPT／多益單元練習 | Demo | 結構與進度有了，課綱內容仍偏示範 |
| 課程設計器 | Demo | 提示詞組裝；日語可選 BYOK 呼叫 Groq |
| 帳號與雲端進度 | 可用 | Email／密碼；僅同步學習進度 |

**不會上雲／不會匯出：** Groq API key、builder presets（含個人提示詞風險）。

## 開發

```bash
npm install
cp .env.example .env.local   # 填入 Supabase（可選；不填則純本機）
npm run dev
```

可用 hash：`#hub` / `#aoba` / `#toeic` / `#privacy`。

```bash
npm run build
npm run preview
```

## Supabase 設定（一次性）

1. 建立專案 → Authentication → 啟用 Email/Password  
2. 在 SQL Editor 執行 [`supabase/schema.sql`](supabase/schema.sql)  
3. Authentication → URL：Site URL / Redirect 設為 Pages 網址  
   （例如 `https://<user>.github.io/<repo>/`）  
4. 將 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY` 填入 `.env.local` 與 GitHub repo Secrets  

同步行為：

- **Write-through：** 先寫 localStorage，再 upsert 雲端  
- **登入時：** 雲端列不存在 → 上傳本機；已存在 → 以雲端覆蓋本機  
- **欄位：** `aoba` / `kana` / `toeic`（jsonb）、`lang`、`updated_at`

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
