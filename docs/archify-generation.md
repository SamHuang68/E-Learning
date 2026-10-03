# Archify generated diagrams and shared assets

Nine checked-in HTML diagrams were exported by Archify 2.16.0. Their renderer
(451,594 LF bytes) and stylesheet (186,037 LF bytes) were identical. The original
upstream generator is not installed in this project's dependencies. The shared
files in `public/archify/shared/` are the authoritative, unchanged vendored
renderer and stylesheet for these exports; do not copy them back into each page.

## Reproducible workflow

After a reviewed Archify 2.16.0 export replaces one of the listed HTML files:

```sh
node scripts/prepare-archify.mjs
node scripts/prepare-archify.mjs --check
```

Preparation extracts only the matching common style/script blocks and preserves
all other bytes: diagram SVG, metadata, embedded JSON and locale messages,
early theme bootstrap, controls and page-specific descriptions. All nine inputs
are validated before any file is written. Repeating the command makes no changes.
The check is read-only and fails on an unprepared export, invalid relative link,
missing asset or changed renderer. A different upstream renderer requires an
explicit review and version/hash update; it is never silently adopted.

The two common assets use relative URLs, including the root-level
`srs-review.html`, so they work under both `/` and `/E-Learning/`.
The renderer stays a classic script at its original end-of-body position. The
stylesheet stays in the head. Existing public/archify precache enumeration
includes both shared files; the full offline contract is unchanged.

## Portable HTML and existing exports

For portable single-file copies, write outside the deployed public tree:

```sh
node scripts/prepare-archify.mjs --standalone ../archify-portable
```

This reconstructs the original inline HTML, with its renderer and stylesheet,
under the same relative diagram paths. It does not change the website files or
create a second checked-in copy. Google Fonts remain optional as before; the
original system-font fallback remains intact. Hosting only one compact HTML file
without its shared directory is unsupported; distribute the standalone version
when only one file can be transferred.

The viewer has SVG, raster and video export paths, not an HTML download action.
Its unchanged SVG pipeline reads same-origin `document.styleSheets[].cssRules`
and inserts the styles into the SVG before serialization. Thus externalizing the
host stylesheet does not introduce external dependencies in exported SVG images.

## Authored diagram definitions

| HTML | Existing authored JSON |
| --- | --- |
| ai-pc-architecture.html | public/archify/ai-pc.architecture.json |
| ai-server-architecture.html | public/archify/ai-server.architecture.json |
| cache-coherence-sequence.html | public/archify/cache-coherence.sequence.json |
| lsm-tree-architecture.html | public/archify/lsm-tree.architecture.json; related lsm-tree.dataflow.json |
| percolator-transaction.html | public/archify/percolator-transaction.sequence.json |
| process-lifecycle.html | public/archify/process.lifecycle.json; related process.architecture.json |
| tcp-handshake-sequence.html | public/archify/tcp-handshake.sequence.json |
| transformer-attention.html | public/archify/transformer-attention.architecture.json |
| srs-review.html | scripts/srs-review.lifecycle.g4.json |

The postprocessor does not regenerate the SVG from these definitions; upstream
Archify authoring remains a separate workflow. `git-mental-model-sequence.html`
is a separate lightweight viewer, not an Archify 2.16.0 export, and is untouched.

## Capacity and validation

LF-normalized deployed source before: **6,399,809 bytes** across nine HTML files.
After: **662,343 bytes** of HTML + **637,631 bytes** of shared assets =
**1,299,974 bytes**, saving **5,099,835 raw bytes** (including new reference tags).
This is not a claim about compressed transfer or browser cache accounting.
Windows checkout line endings can change measured filesystem sizes.

Run only the affected postprocessor and integration tests:

```sh
node node_modules/vitest/vitest.mjs run scripts/prepare-archify.test.ts src/cs/archifyIntegration.test.ts
```

The tests exercise round-trip preservation, common-asset identity, runtime drift
rejection before writes, idempotence, read-only checks, both deployment bases,
classic script ordering, standalone generation and LF/CRLF preservation.
Browser validation should cover theme/locale controls and a downloaded SVG from
both a root-level and nested diagram, with online/offline shared dependencies.

The hash-pinned shared assets retain the original blocks' trailing whitespace.
Git's unfiltered whitespace check flags their final lines; authored source is
checked separately. These vendor bytes are retained for exact round-trip identity.
