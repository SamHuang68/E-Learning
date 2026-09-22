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

## localStorage — builder / secret (never uploaded)

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
