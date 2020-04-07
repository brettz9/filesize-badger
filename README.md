# filesize-badger

Create file size badges as for `rollup-plugin-filesize` usage.

## Install

```sh
npm i -D filesize-badger
```

## Usage

```js
import filesizeBadger from 'filesize-badger/dist/index.esm.js';

export default {
	plugins: [
		filesize({
			postRender: filesizeBadger()
		})
	],
    // ...
}
```

### Options

You may also invoke with options (with defaults shown):

```js
filesizeBadger({
    outputPath: 'filesize.svg',
    // Evaluable string-as-ES6 template (see `es6-template-strings`) to
    //  run once for the whole badge (the main panel); will be passed:
    //  `fileName`, `filePath`, `bundleSize`, `brotliSize`, `minSize`,
    //  `gzipSize`
    textTemplate: 'File size (${filePath})',
    // Badge-up color array (second color for stroke color)
    textColor: ['navy']
    // Which size types (if any) to iterate within their own badge panel
    sizeTypes: ['bundleSize', 'brotliSize', 'minSize', 'gzipSize'],
    // Evaluable string-as-ES6 template (see `es6-template-strings`) to
    //  run once for each item of `sizeTypes`; will be passed:
    //  `fileName`, `filePath`, `sizeType` (human readable title for size),
    //   `size`
    sizeTemplate: '${sizeType}: ${size}',
    // Badge-up color arrays (second color for stroke color); one should
    //   exist for each item of `sizeTypes`
    sizeColors: [['orange'], ['blue'], ['green'], ['indigo']],
})
```
