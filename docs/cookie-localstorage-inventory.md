# Cookie / localStorage inventory

本頁列出 **App 自己寫入** 的瀏覽器儲存鍵。進度預設只留在這台瀏覽器。**沒有**第一方 Cookie。

Keys this App writes. Progress is this-browser by default. **No** first-party cookies.

## Cookies

程式碼沒有 `document.cookie`。GitHub Pages / 瀏覽器自己的 Cookie 不是本專案寫的。

The source does not call `document.cookie`. Host or browser cookies are not this App.

## Honesty

- **未登入：** 進度只在 `localStorage`。不是雲端備份，也不跨裝置。
- **本機後端 shim：** `local-backend:*` 仍在同一瀏覽器。密碼雜湊不是安全邊界；請勿用真實密碼。
- **託管 Supabase：** 僅在設定了有效 `VITE_SUPABASE_*` 且已登入、write-through 解鎖時，才可能把髒佇列刷到 `user_progress`。supabase-js 可能另寫 `sb-*-auth-token`（仍是 localStorage，不是 Cookie）。
- **離線髒旗標 `pendingDirty`：** 記憶體，不是儲存鍵。見 [`offline-progress-flush.md`](./offline-progress-flush.md)。

Signed out: local only. Local shim: still this browser. Hosted cloud: optional write-through after sign-in. Not a cookie tracker.

## localStorage — progress (export / clear)

Canonical registry: [`src/utils/progressKeys.ts`](../src/utils/progressKeys.ts) plus Aoba / TOEIC / meta in [`src/utils/storage.ts`](../src/utils/storage.ts).

| Key | What |
| --- | --- |
| `aoba-progress` | Japanese JLPT unit / XP |
| `aoba-kana-progress` | Kana rows / mastery |
| `toeic-progress` | TOEIC unit / XP |
| `math-learning-progress` | Math + calculus theta / FSRS map |
| `physics-learning-progress` | Physics progress |
| `chemistry-learning-progress` | Chemistry progress |
| `cs-learning-progress` | CS progress |
| `chinese_learning_progress_v1` | Mandarin progress |
| `math_signals_mastery_v1` | Math signal-card state |
| `physics_signals_mastery_v1` | Physics signal-card state |
| `chemistry_signals_mastery_v1` | Chemistry signal-card state |
| `cs_signals_mastery_v1` | CS signal-card state |
| `e-learning-meta` | FSRS items, streak, events, placement, `proUnlocked` |

## localStorage — preferences (not in progress JSON)

| Key | What |
| --- | --- |
| `e-learning-lang` | Last chosen track |
| `e-learning-ui-locale` | `zh-Hant` / `en` |
| `e-learning-a11y-settings` | Accessibility |
| `e-learning-a11y-light-v1` | One-time a11y migration flag |
| `learning_audio_muted_v1` | Mute |
| `e-learning-audio-lesson-v1` | 語音教學的語速、留白開關、留白長度（標準／加長 2 倍）及每組練習次數（1／2／3 次）；僅本瀏覽器保存，不隨學習進度匯出、同步或清除。舊資料缺少長度時使用標準、缺少次數時使用 1 次，各欄獨立保留，不在讀取時改寫。重新開啟課程時載入，未提供跨分頁即時同步。 |

## localStorage — builder / secret (never uploaded)

語音位置另用 `e-learning-audio-position-v1`：保存本瀏覽器最近 50 課的最後選取／練習目標，以既有課程識別及段落的識別、原文、語言、類型、音檔位置精準比對；段落改寫或匹配不唯一時不接續。不是播放完成、秒數或輪次紀錄。只保存在本瀏覽器，不依登入帳戶隔離，不隨學習進度匯出、同步或清除；沒有跨分頁即時同步。讀取不寫回，試播不覆蓋位置，儲存遭拒會顯示提示。重新開啟不自動出聲。

「清除此課練習位置」經確認後只移除目前課程；取消不寫入，其他課程及偏好／進度不變。播放準備、播放與留白期間須先停止才能清除。目前選段不受影響；下次選段或播放會重新保存。沒有該課位置時不寫入；內容不可辨識或讀寫遭拒時回報失敗並保留原資料。此操作不順便修剪、去重或整理其他項目。

| Key | What |
| --- | --- |
| `aoba-presets` | Japanese course-builder presets |
| `toeic-presets` | TOEIC course-builder presets |
| `aoba-groq-key` | Optional Groq key the learner pasted; never exported |

## localStorage — local auth shim

| Key | What |
| --- | --- |
| `local-backend:users` | Email + password hash (demo only) |
| `local-backend:session` | This-browser session |
| `local-backend:user_progress:{userId}` | Per-account progress row |

## Legacy / sessionStorage

| Key | Where | What |
| --- | --- | --- |
| `aoba-site` | localStorage | Read-once hub/site migration |
| `e-learning:chunk-retry-refreshed:{id}` | sessionStorage | One reload after a stale chunk 404 |

## Code

- Keys: [`src/utils/progressKeys.ts`](../src/utils/progressKeys.ts), [`src/utils/storage.ts`](../src/utils/storage.ts), [`src/lib/localBackend.ts`](../src/lib/localBackend.ts), [`src/i18n/locale.ts`](../src/i18n/locale.ts)
- Clear progress: `clearLocalProgressCache()` (does not wipe a11y / locale / Groq key)
- UI copy: Privacy page (`privacy.local*`)
