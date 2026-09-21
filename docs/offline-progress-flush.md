# Offline progress flush queue

進度永遠先寫入本機 `localStorage`。連線恢復時，只有**已登入且允許 write-through** 才會把髒佇列刷到 `user_progress`。

Progress is always written to this-browser `localStorage` first. On `window` `online`, the dirty queue drains only if a session is signed in and write-through is unlocked.

## Honesty

- **未登入 / signed out：** 狀態維持 `local-only`。重新連線不會發明雲端帳號，也不會把本機進度送出。
- **本機後端 / local shim：** `src/lib/localBackend.ts` 仍寫入此瀏覽器的 `localStorage`。這不是跨裝置雲端備份。
- **託管雲端 / hosted Supabase：** 離線寫入會留下 `pendingDirty`；`online` 時重試 drain，成功且讀回驗證後才顯示「已同步」。

## Code

- Drain: `enqueueDrain` / `flushCloudPush` in [`src/utils/cloudProgress.ts`](../src/utils/cloudProgress.ts)
- Reconnect: `handleBrowserOnline` (bound to `online`)
- Tests: `src/utils/cloudProgressHonesty.test.ts`

No separate sync server. GitHub Pages stays static.
