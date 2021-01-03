[![npm](https://img.shields.io/npm/v/filesize-badger.svg)](https://www.npmjs.com/package/filesize-badger)
[![Dependencies](https://img.shields.io/david/brettz9/filesize-badger.svg)](https://david-dm.org/brettz9/filesize-badger)
[![devDependencies](https://img.shields.io/david/dev/brettz9/filesize-badger.svg)](https://david-dm.org/brettz9/filesize-badger?type=dev)

[![testing badge](https://raw.githubusercontent.com/brettz9/filesize-badger/master/badges/tests-badge.svg?sanitize=true)](badges/tests-badge.svg)
[![coverage badge](https://raw.githubusercontent.com/brettz9/filesize-badger/master/badges/coverage-badge.svg?sanitize=true)](badges/coverage-badge.svg)

[![Known Vulnerabilities](https://snyk.io/test/github/brettz9/filesize-badger/badge.svg)](https://snyk.io/test/github/brettz9/filesize-badger)
[![Total Alerts](https://img.shields.io/lgtm/alerts/g/brettz9/filesize-badger.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/filesize-badger/alerts)
[![Code Quality: Javascript](https://img.shields.io/lgtm/grade/javascript/g/brettz9/filesize-badger.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/brettz9/filesize-badger/context:javascript)

<!--[![License](https://img.shields.io/npm/l/filesize-badger.svg)](LICENSE-MIT.txt)-->
[![Licenses badge](https://raw.githubusercontent.com/brettz9/filesize-badger/master/badges/licenses-badge.svg?sanitize=true)](badges/licenses-badge.svg)

(see also [licenses for dev. deps.](https://raw.githubusercontent.com/brettz9/filesize-badger/master/badges/licenses-badge-dev.svg?sanitize=true))

[![issuehunt-to-marktext](https://issuehunt.io/static/embed/issuehunt-button-v1.svg)](https://issuehunt.io/r/brettz9/filesize-badger)

# filesize-badger

Create file size badges. Also works for `rollup-plugin-filesize` usage.

Here is a badge generated against the `dist` file for this project.

![filesize-badge](filesize-badge.svg)

## Install

```sh
npm i -D filesize-badger
```

## Usage (independent of `rollup-plugin-filesize`)

```js
import {filesizeBadger} from 'filesize-badger/dist/index.esm.js';

const file = 'dist/index.js';

// See also example below where these strings are obtained from
//  `getFilesizesForCode`.
const
  bundleSize = '4 Kb',
  brotliSize = '359 Kb',
  minSize = '1 Б',
  gzipSize = '500 B';

filesizeBadger({
  // REQUIRED

  // The (full) file path string of the file for which this badge is
  //  being made to indicate its size (for `rollup-plugin-filesize`, this
  //  will come from Rollup's output options)
  file,

  // These are all strings (for `rollup-plugin-filesize`, this will
  //   come from `info` gathered by it); one is required for each
  //   of `sizeTypes` (if any) unless obtained by `filesizeFormat`
  bundleSize,
  brotliSize,
  minSize,
  gzipSize,

  // This may be used in place of the above size types; will cause
  //   `file` to be retrieved, its sizes calculated, and formatting
  //   strings generated per `filesizeFormat` (see https://github.com/avoidwork/filesize.js#optional-settings )
  //   for its structure
  // filesizeFormat,

  // `fileName` is the file name portion of `file`; defaults to
  //    `basename(file)`
  // Commenting out as we can let this be auto-calculated
  // fileName,

  // OPTIONAL
  // (These are identically named to the corresponding options in
  //   `rollup-plugin-filesize`)
  showMinifiedSize: true,
  showGzippedSize: true,
  showBrotliSize: false,

  // For our own options which can also be used here, see the options for
  //  `rollupPluginFilesizeBadger` below.
  ...rollupPluginFilesizeBadgerOptions
});
```

You might find the built-in utility `getFilesizesForCode` helpful in obtaining
the formatted strings (`bundleSize`, `brotliSize`, `minSize`, `gzipSize`)
based on a string of code and desired configuration for separators, i18n, etc.

```js
import {
  filesizeBadger, getFilesizesForCode
} from 'filesize-badger/dist/index.esm.js';

const file = 'dist/index.js';

(async () => {
const fileSizes = await getFilesizesForCode(
  // Could get this by using `fs.readFile` against `file`
  'someJSCodeToMeasure();',
  {
    // See https://github.com/avoidwork/filesize.js#optional-settings
    format: {},

    // AT LEAST ONE OF THESE SHOULD BE SET TO `true`
    // Whether `brotliSize`
    showBrotliSize: false,
    // Whether `minSize`
    showMinifiedSize: false,
    // Whether `gzipSize`
    showGzippedSize: false
  }
);

await filesizeBadger({
  file,
  ...fileSizes
  // And any other options
});
})();
```

## Usage with `rollup-plugin-filesize`

You can pass in a call to `rollupPluginFilesizeBadger` for the `reporter`
option in [my `reporter` branch](https://github.com/brettz9/rollup-plugin-filesize/tree/reporter-dist)
of `rollup-plugin-filesize` (adding
`"rollup-plugin-filesize": "https://github.com/brettz9/rollup-plugin-filesize#reporter-dist"`
as a dependency).

```js
import fileSize from 'rollup-plugin-filesize';
import {rollupPluginFilesizeBadger} from 'filesize-badger/dist/index.esm.js';

export default {
  plugins: [
    fileSize({
      reporter: rollupPluginFilesizeBadger()
      // Or to also allow rollup-plugin-filesize default `boxen`
      //   console reporter
      // reporter: ['boxen', rollupPluginFilesizeBadger()]
    })
  ]
  // , ...
};
```

### Options

You may also invoke with options (with defaults shown):

```js
rollupPluginFilesizeBadger({
  outputPath: 'filesize-badge.svg',
  // Evaluable string-as-ES6 template (see `es6-template-strings`) to
  //  run once for the whole badge (the main panel); will be passed:
  //  `fileName`, `filePath`, `bundleSize`, `brotliSize`, `minSize`,
  //  `gzipSize`
  textTemplate: 'File size (${filePath})',
  // Badge-up color array (second color for stroke color)
  textColor: ['navy'],
  // Which size types (if any) to iterate within their own badge panel
  sizeTypes: ['bundleSize', 'brotliSize', 'minSize', 'gzipSize'],
  // Evaluable string-as-ES6 template (see `es6-template-strings`) to
  //  run once for each item of `sizeTypes`; will be passed:
  //  `fileName`, `filePath`, `sizeType` (human readable title for size),
  //   `size`
  sizeTemplate: '${sizeType}: ${size}',
  // Badge-up color arrays (second color for stroke color); one should
  //   exist for each item of `sizeTypes`
  sizeColors: [['orange'], ['blue'], ['green'], ['indigo']]
});
```

## CLI usage

![cli.svg](https://raw.githubusercontent.com/brettz9/filesize-badger/master/cli.svg?sanitize=true)

## See also

- [mocha-badge-generator](https://github.com/ianpogi5/mocha-badge-generator) - Locally
    created badges for Mocha test results
- [coveradge](https://github.com/brettz9/coveradge) - Locally-created badges
    for nyc/istanbul coverage
- [license-badger](https://github.com/brettz9/license-badger) - Locally-created
    badges for indicating aggregate information on license types in use

## To-dos

1. Could potentially add code to make badges for package size
