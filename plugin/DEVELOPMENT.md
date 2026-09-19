# Codex Ascension Maintainer Guide

Run all commands in this guide from `plugin/`. Node.js 22.19 or newer is
required.

## Develop and verify

```sh
npm ci
npm run check
npm run dev:dry-run
npm run dev
```

`npm run check` type-checks the source, regenerates embedded image modules,
builds the TypeScript library and portable browser bundle, runs the focused
tests, and inspects the package archive. Also run `git diff --check` from the
repository root before committing.

The browser bundle keeps Cordis and `cordisx/contracts` as Host-provided
facades. It bundles Schemastery and plugin-owned image data so the archive does
not depend on a sibling `node_modules` directory.

## Package

`cordisx-package.json` is the install descriptor. Its version must match
`package.json`; its runtime-manifest digest must match the exact bytes of
`runtime-manifest.json`. The runtime manifest must remain identical to the
plugin's exported manifest, including the empty capability list.

Build and create the archive with:

```sh
npm run check
npm pack
```

The archive must contain both READMEs, `cordisx-package.json`,
`runtime-manifest.json`, and the entry named by the package descriptor.

## Release

Releases use a GitHub prerelease, not npm. Merge through a protected pull
request, build the exact merged `main` commit, and create the private-package
archive with `npm pack`. Publish the archive as
`cordisx-codex-ascension-<version>.tgz` together with `SHA256SUMS` under the
matching `v<version>` tag. Download both assets afterward and verify their
hashes and archive contents.

The Marketplace owner adds the artifact URL and SHA-256 digest separately.
Do not copy an older trust, Official, or Certified record.
