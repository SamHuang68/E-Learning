# Progress event / export schema

本機 `localStorage` 與匯出 JSON 的版本紀錄。**不是**託管雲端 API 契約，也不是跨裝置備份保證。

Version history for this-browser `localStorage` and the progress export JSON. **Not** a hosted cloud API contract and **not** a cross-device backup guarantee.

## Current

- Bundle: `PROGRESS_BUNDLE_VERSION = 5`
- Learning events: `LEARNING_EVENT_SCHEMA_VERSION = 1` (`{ v, t, type, payload? }`)

## Migration notes

| Version | What changed | Honesty |
| --- | --- | --- |
| v1 | Aoba + kana + TOEIC progress | This browser only |
| v2–v3 | STEM keys added | Still local-only |
| v4 | Eight tracks + signal mastery keys | Export JSON only |
| v5 | Learning events stamp `v: 1`. Rows without `v` import as `v: 1`. | Not a cloud schema. Older v1–v4 files still import locally. |

Code: [`src/utils/progressSchema.ts`](../src/utils/progressSchema.ts), [`src/utils/storage.ts`](../src/utils/storage.ts).
