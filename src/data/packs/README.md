# Content packs

Practice content currently lives in TypeScript modules:

- Japanese: `src/data/practice/{n5n4,n3,n2n1}.ts`
- TOEIC: `src/toeic/data/practice/{orange,green,blue,gold}.ts`

Each unit pack uses `UnitPractice` (`vocab` / `passage` / `grammar`) with optional
`audio` refs for prefabricated clips (`SpeakableCard.audio`).

## Alignment policy

Unit metadata (`words` / `reading` / `listening`) must match actual card counts.
Deepening content means adding cards first, then bumping metadata.

## Wave 4 CMS path

1. Export packs to `public/content/*.json`
2. List them in `public/content/manifest.json`
3. Load via `src/cms/contentApi.ts` (`fetchContentManifest` / `loadRemotePack`)
4. Keep local TS packs as offline fallback during migration

Target depth (roadmap): ≥40 vocab, ≥8–12 passage/listening, ≥10 grammar per unit,
with keigo / diplomatic register contrasts on relevant units.
