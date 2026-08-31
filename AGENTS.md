# AGENTS.md

## Cursor Cloud specific instructions

This is a single Vite + React 19 + TypeScript static app (npm). Standard commands live in `package.json` and `README.md`; use those. Key notes for running/testing here:

- Dependencies are refreshed automatically on startup via the update script (`npm install`). No extra system dependencies are needed.
- Run the app in dev mode with `npm run dev` (Vite, serves on `http://localhost:5173/`). Use this, not `npm run build`/`preview`, for development.
- The app runs fully offline/local without Supabase: `.env.local` (`VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`) is optional.
- Backend selection lives in `src/lib/supabase.ts`. When valid hosted Supabase env vars are present, `getSupabase()` returns the real cloud client. Otherwise it returns a fully local, offline shim (`src/lib/localBackend.ts`) that implements the small slice of the supabase-js API this app uses (email/password auth + the `user_progress` table) on top of `localStorage`. So login and progress "sync" work with no cloud project — data is per-browser. `getBackendKind()` reports `'cloud' | 'local'`; UI copy adapts via `useAuth().backendKind`. The local shim is client-only, so it is fully compatible with static GitHub Pages hosting.
- Navigation uses hash routes: `#hub`, `#aoba` (Japanese), `#toeic` (English), `#privacy`.
- Pro-gated content demo unlock code: `AOBA-PRO`.
- Lint: `npm run lint` (oxlint). Tests: `npm test` (vitest, unit tests under `src/engine/*.test.ts`).

## Execution & Agent Orchestration Doctrine
- **Loop Engineering & Hive Agent Standard**: 所有任務執行一律採用 **Loop Engineering（循環工程：Plan ➜ Execute ➜ Observe ➜ Refine）** 搭配 **Hive Agent（蜂群代理架構：任務形狀分析、能力圖譜路由、單一寫入者整合、驗證閘門與證據鏈驗證）** 作為標準作業準則。
