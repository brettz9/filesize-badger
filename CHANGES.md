# CHANGES for `filesize-badger`

## ?

- Linting (LGTM): Add `lgtm.yml`
- Testing: Switch to stable version of `mocha-multi-reporters`
- npm: Update terser dep. (patch), package-lock, and devDeps.

## 0.3.3

- Docs: Update CLI help
- Testing: Workaround istanbul issue; more type tests
- npm: Update deps (`badge-up` and `terser`) and devDeps
- npm: Use official `rollup-plugin-filesize` prerelease

## 0.3.2

- npm: Adjust to a more up-to-date `rollup-plugin-filesize` fork

## 0.3.1

- Docs: Update description
- Docs: Fix filesize badge
- npm: Adjust to a current `rollup-plugin-filesize` fork

## 0.3.0

- Breaking change: Switch from default export to `rollupPluginFilesizeBadger`
- Breaking change: Switch default `outputPath` to `filesize-badge.svg`
- Enhancement: Add binary
- Enhancement: Add generic programmatic export, `filesizeBadger`, which,
    unlike the `rollup-plugin-filesize` API, accepts arguments all at once;
    uses `rollup-plugin-filesize` defaults
- Enhancement: Allow `fileName` to be auto-calculated by default
    (for generic programmatic API)
- Enhancement: Add `filesizeFormat` argument usable in place of size
    strings (auto-calculated based on `file`)
- Enhancement: Add `logging` option
- Enhancement: Add `getFilesizesForCode` utility
- Docs: Show badges (tests, coverage, licenses, alerts, npm/dependencies)
- Docs: Show CLI usage
- Docs: See also
- Linting: Check hidden files and MD; apply ash-nazg
- Testing: Add tests/coverage

## 0.2.0

- Update per latest `rollup-plugin-filesize` fork API
- npm: Update devDeps

## 0.1.0

- Initial version
