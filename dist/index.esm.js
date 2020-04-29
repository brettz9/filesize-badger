import { readFile as readFile$1, writeFile as writeFile$1 } from 'fs';
import { promisify } from 'util';
import { basename } from 'path';

const fileSize = require('filesize');
const gzip = require('gzip-size');
const terser = require('terser');
const brotli = require('brotli-size');
const badgeUp = require('badge-up').v2;
const template = require('es6-template-strings');

const readFile = promisify(readFile$1);
const writeFile = promisify(writeFile$1);

const sizeTypeMap = new Map([
  ['bundleSize', {text: 'Bundle size'}],
  ['brotliSize', {text: 'Brotli size', showProperty: 'showBrotliSize'}],
  ['minSize', {text: 'Min size', showProperty: 'showMinifiedSize'}],
  ['gzipSize', {text: 'Gzip size', showProperty: 'showGzippedSize'}]
]);

/**
* @external FileSizeFormat
* @see https://github.com/avoidwork/filesize.js#optional-settings
*/

/**
* @typedef {PlainObject} RollupPluginFilesizeShowOptions
* @property {boolean} showBrotliSize
* @property {boolean} showMinifiedSize
* @property {boolean} showGzippedSize
*/

/**
* @typedef {RollupPluginFilesizeShowOptions} RollupPluginFilesizeOptions
* @property {FileSizeFormat} format
*/

/**
 * Mostly a stripped down reimplementation of `rollup-plugin-filesize`'
 * `getData` method.
 * @param {string} code
 * @param {RollupPluginFilesizeOptions} opts
 * @returns {RollupPluginFilesizeInfo} Does not add `fileName` (nor
 * `*before` properties as used and built in `rollup-plugin-filesize`)
 */
function getFilesizesForCode (code, opts) {
  const info = {
    bundleSize: fileSize(Buffer.byteLength(code), opts.format),
    brotliSize: opts.showBrotliSize
      ? fileSize(brotli.sync(code), opts.format)
      : ''
  };

  if (opts.showMinifiedSize || opts.showGzippedSize) {
    const minifiedCode = terser.minify(code).code;
    info.minSize = opts.showMinifiedSize
      ? fileSize(minifiedCode.length, opts.format)
      : '';
    info.gzipSize = opts.showGzippedSize
      ? fileSize(gzip.sync(minifiedCode), opts.format)
      : '';
  }

  return info;
}

/**
 * @param {"bundleSize"|"brotliSize"|"minSize"|"gzipSize"} sizeType
 * @returns {string} Human-readable for type (e.g., "Bundle size")
 */
function getSizeText (sizeType) {
  return sizeTypeMap.get(sizeType).text;
}

/**
* @typedef {PlainObject} RollupPluginFilesizeInfo
* @property {string} fileName
* @property {string} bundleSize
* @property {string} brotliSize
* @property {string} minSize
* @property {string} gzipSize
*/

/**
* @typedef {PlainObject} RollupOutputOptions
* @property {string} file
*/

/* eslint-disable max-len */
/**
* @typedef {PlainObject} RollupPluginFilesizeBadger
* @property {string} [outputPath='filesize-badge.svg']
* @property {string} [textTemplate='File size (${filePath})']
* @property {string} [sizeTemplate='${sizeType}: ${size}']
* @property {string[]} [sizeTypes=['bundleSize', 'brotliSize', 'minSize', 'gzipSize']]
* @property {string[][]} [sizeColors=[['orange'], ['blue'], ['green'], ['indigo']]]
* @property {string[]} [textColor=['navy']]
*/
/* eslint-enable max-len */

// This should be an intersection really, not a union, but not
//  currently available in jsdoc/Closure
/**
 * @param {RollupPluginFilesizeBadger|RollupPluginFilesizeShowOptions
 * |RollupPluginFilesizeInfo|RollupOutputOptions} cfg
 * @returns {Promise<void>}
 */
async function filesizeBadger (cfg) {
  // For consistent behavior, we use the same defaults as
  //   `rollup-plugin-filesize`
  const rollupPluginFilesizeShowOptionsDefaults = {
    showMinifiedSize: true,
    showGzippedSize: true,
    showBrotliSize: false
  };

  // Define object before destructuring so we can get
  //  properties dynamically later
  const cfgConstObj = {
    ...rollupPluginFilesizeShowOptionsDefaults,
    ...cfg
  };

  const {
    outputPath = 'filesize-badge.svg',
    /* eslint-disable no-template-curly-in-string */
    textTemplate = 'File size (${filePath})',
    sizeTemplate = '${sizeType}: ${size}',
    /* eslint-enable no-template-curly-in-string */

    // Output options
    file: filePath,

    // Use this to determine call to `getFilesizesForCode (code, {format})`
    filesizeFormat,

    showBrotliSize,
    showMinifiedSize,
    showGzippedSize,

    logging,

    // Filesize info results
    fileName = basename(filePath)
  } = cfgConstObj;

  if (!outputPath || typeof outputPath !== 'string') {
    throw new TypeError('Bad output path provided.');
  }

  const log = (...args) => {
    if (logging && logging !== 'off') {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  };

  // Handle CLI type conversions
  // Define object before destructuring so we can get
  //  properties dynamically later
  const cfgLetObj = {
    ...(filesizeFormat
      ? getFilesizesForCode(
        await readFile(filePath, 'utf8'),
        {
          // Putting these lines together was apparently tripping up istanbul
          format:
            typeof filesizeFormat === 'string'
              ? JSON.parse(filesizeFormat)
              : filesizeFormat,
          showBrotliSize,
          showMinifiedSize,
          showGzippedSize
        }
      )
      : ''
    ),
    ...cfg
  };

  let {
    textColor = ['navy'],
    sizeTypes = ['bundleSize', 'brotliSize', 'minSize', 'gzipSize'],
    sizeColors = [['orange'], ['blue'], ['green'], ['indigo']],
    bundleSize,
    brotliSize,
    minSize,
    gzipSize
  } = cfgLetObj;

  if (typeof textColor === 'string') {
    textColor = textColor.split(',');
  }

  if (sizeTypes && typeof sizeTypes === 'string') {
    sizeTypes = sizeTypes.split(',');
  }
  if (Array.isArray(sizeColors) && !Array.isArray(sizeColors[0])) {
    sizeColors = sizeColors.map((sizeColor) => {
      return sizeColor.split(',');
    });
  }

  log({
    outputPath,
    filePath,
    fileName,
    textTemplate,
    textColor,
    bundleSize, brotliSize, minSize, gzipSize,
    sizeTypes,
    sizeColors
  });

  const sections = [
    ...(textTemplate
      ? [[template(textTemplate, {
        filePath,
        fileName, bundleSize, brotliSize, minSize, gzipSize
      }), ...textColor]]
      : []),
    ...(sizeTypes
      ? sizeTypes.map((sizeTypeCode, i) => {
        const {showProperty} = sizeTypeMap.get(sizeTypeCode);
        if (typeof showProperty === 'string' && !cfgConstObj[showProperty]) {
          return false;
        }
        const size = cfgLetObj[sizeTypeCode];
        const sizeType = getSizeText(sizeTypeCode);
        log({
          sizeTemplate,
          sizeType,
          sizeTypeCode,
          filePath,
          fileName,
          size
        });
        return [template(sizeTemplate, {
          sizeType,
          filePath,
          fileName,
          size
        }), ...sizeColors[i]];
      }).filter((tmplt) => tmplt)
      : '')
  ];

  log('Sections', sections);

  const svg = await badgeUp(sections);
  await writeFile(outputPath, svg);
  log(`Finished writing to ${outputPath}!`);
}

/**
* @callback RollupPluginFilesizeCallback
* @param {RollupPluginFilesizeOptions} opts
* @param {RollupOutputOptions} outputOptions
* @param {RollupPluginFilesizeInfo} info
* @returns {Promise<void>}
*/

/**
 * @param {RollupPluginFilesizeBadger} cfg
 * @returns {RollupPluginFilesizeCallback}
 */
function rollupPluginFilesizeBadger ({
  outputPath, textTemplate, sizeTemplate, sizeTypes,
  sizeColors, textColor
} = {}) {
  return function (opts, outputOptions, info) {
    const {
      showBrotliSize,
      showMinifiedSize,
      showGzippedSize
    } = opts;
    const {
      fileName,
      bundleSize, brotliSize, minSize, gzipSize
    } = info;
    const {file} = outputOptions;

    return filesizeBadger({
      outputPath, textTemplate, sizeTemplate, sizeTypes,
      sizeColors, textColor,

      file,
      fileName,
      bundleSize, brotliSize, minSize, gzipSize,

      showBrotliSize,
      showMinifiedSize,
      showGzippedSize
    });
  };
}

export { filesizeBadger, getFilesizesForCode, rollupPluginFilesizeBadger };
//# sourceMappingURL=index.esm.js.map
