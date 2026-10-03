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
