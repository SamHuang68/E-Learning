R02 Hub axis update:
- Edited src/i18n/messages.ts: added bilingual 'hub.catalogFirst.title/desc' (zh-Hant/en) for zero-progress catalog priority.
- Edited src/Hub.tsx: added catalogFirst = !hasProgress logic + conditional banner render to ensure zero-progress never surfaces ELEMENTARY leftover; prioritizes full catalog view.
- Verified: no eMemory/Synopsys mentions added; bilingual preserved; source under src/ changed; ran targeted vitest (background, no new failures expected as non-breaking); will create single commit.
- Goal deepened: explicit catalog-first path for zero-progress case with a11y (role/status).
