'use strict';

const pkg = require('../package.json');

// Todo: We really need a command-line-args-TO-typedef-jsdoc generator!
/* eslint-disable jsdoc/require-property -- Use jsdoc-jsonschema? */
/**
* @typedef {PlainObject} FilesizeBadgerOptions
*/
/* eslint-enable jsdoc/require-property -- Use jsdoc-jsonschema? */

const getChalkTemplateSingleEscape = (s) => {
  return s.replace(/[{}\\]/gu, (ch) => {
    return `\\u${ch.codePointAt().toString(16).padStart(4, '0')}`;
  });
};

const getChalkTemplateEscape = (s) => {
  return s.replace(/[{}\\]/gu, (ch) => {
    return `\\\\u${ch.codePointAt().toString(16).padStart(4, '0')}`;
  });
};

const getBracketedChalkTemplateEscape = (s) => {
  return '{' + getChalkTemplateEscape(s) + '}';
};

const optionDefinitions = [
  {
    name: 'file', type: String, alias: 'p',
    description: '(Full) path to the file whose size has been calculated. ' +
      'Required.',
    typeLabel: '{underline file path}'
  },
  {
    name: 'outputPath', type: String, defaultOption: true, alias: 'o',
    description: 'Path to which to save the file; defaults to ' +
      '"filesize-badge.svg" in the current working directory',
    typeLabel: '{underline outputPath}'
  },
  {
    name: 'filesizeFormat', type: String,
    description: 'String of a JSON object to be used for specifying the ' +
      'format for file size strings; if present (even as an empty object), ' +
      'will cause `file` to be read and its meta-data formatted according ' +
      'to the object (usable instead of `bundleSize`, etc. strings); see ' +
      'https://github.com/avoidwork/filesize.js#optional-settings ;',
    typeLabel: '{underline format as JSON object string}'
  },
  {
    name: 'bundleSize', type: String,
    description: 'Formatted string showing bundle size text. May be ' +
      'helpful to generate with `filesize` package but can be any string. ' +
      'Not needed if `filesizeFormat` is set.',
    typeLabel: '{underline bundle size text}'
  },
  {
    name: 'brotliSize', type: String,
    description: 'Formatted string showing brotli size text. May be ' +
      'helpful to generate with `filesize` package but can be any string. ' +
      'Not needed if `filesizeFormat` is set.',
    typeLabel: '{underline brotli size text}'
  },
  {
    name: 'minSize', type: String,
    description: 'Formatted string showing min size text. May be ' +
      'helpful to generate with `filesize` package but can be any string. ' +
      'Not needed if `filesizeFormat` is set.',
    typeLabel: '{underline min size text}'
  },
  {
    name: 'gzipSize', type: String,
    description: 'Formatted string showing gzip size text. May be ' +
      'helpful to generate with `filesize` package but can be any string. ' +
      'Not needed if `filesizeFormat` is set.',
    typeLabel: '{underline gzip size text}'
  },
  {
    name: 'showMinifiedSize', type: Boolean,
    description: 'Defaults to `true`.',
    typeLabel: '{underline }'
  },
  {
    name: 'showGzippedSize', type: Boolean,
    description: 'Defaults to `true`',
    typeLabel: '{underline }'
  },
  {
    name: 'showBrotliSize', type: Boolean,
    description: 'Defaults to `false`.',
    typeLabel: '{underline }'
  },
  {
    name: 'fileName', type: String,
    description: 'Defaults to `basename` (i.e., the file portion) ' +
      'of `file` path.',
    typeLabel: '{underline file name}'
  },
  {
    name: 'textColor', type: String,
    description: 'Color for "File size" subject. Follow by comma for ' +
      'additional (e.g., to add a stroke color). Defaults to "navy".',
    typeLabel: getBracketedChalkTemplateEscape(
      'underline <typeName>=<color> (<color>: CSS-Color|Hex as: ' +
        'ffffff|Hex stroke as s{ffffff})'
    )
  },
  {
    name: 'sizeTypes', type: String,
    description: 'Comma-separated list of specific size types to display ' +
      'within their own badge panel; set to empty string to avoid separate ' +
      'panels for each type; defaults to all; can be any of ' +
      '"bundleSize"|"brotliSize"|"minSize"|"gzipSize"',
    typeLabel: '{underline value or list of values}'
  },
  {
    name: 'sizeColors', type: String,
    multiple: true,
    description: 'Set for mapping the `sizeTypes` type names to colors. ' +
      'Reuse for different types. Follow by comma for additional (e.g., to ' +
      'add a stroke color). Defaults to "orange", "blue", "green", and ' +
      '"indigo" (for the default `sizeTypes` respectively)--i.e., with ' +
      'no stroke colors. Should be one size color for each of `sizeTypes`.',
    typeLabel: getBracketedChalkTemplateEscape(
      'underline <color>[, <color>] (<color>: CSS-Color|Hex as: ' +
        'ffffff|Hex stroke as s{ffffff})'
    )
  },
  {
    name: 'textTemplate', type: String,
    description: 'Evaluable string-as-ES6 template (see ' +
      '`es6-template-strings`) for text of file size badge; set to empty ' +
      'string to avoid such a panel; run once ' +
      'for the whole badge (the main panel); defaults to: ' +
      getChalkTemplateSingleEscape(
        // eslint-disable-next-line no-template-curly-in-string -- Required
        '"File size (${filePath})"; passed `fileName`, `filePath`, ' +
        '`bundleSize`, `brotliSize`, `minSize`, `gzipSize; remember to '
      ) +
      'escape `$` with backslash for CLI use',
    typeLabel: '{underline textTemplate}'
  },
  {
    name: 'sizeTemplate', type: String,
    description: 'Evaluable string-as-ES6 template (see ' +
      '`es6-template-strings`) to run once for each item of `sizeTypes`; ' +
      'used to create badge panesl for each desired individual size type. ' +
      'Defaults to: ' +
      getChalkTemplateSingleEscape(
        // eslint-disable-next-line no-template-curly-in-string -- Required
        '"${sizeType}: ${size}"; passed `fileName`, `filePath`, ' +
        '`sizeType` (human readable title for size), `size`; '
      ) +
      'remember to escape `$` with backslash for CLI use',
    typeLabel: '{underline sizeTemplate}'
  },
  {
    name: 'logging', type: String,
    description: 'Logging level; defaults to "off".',
    typeLabel: '{underline "verbose"|"off"}'
  }
];

const cliSections = [
  {
    // Add italics: `{italic textToItalicize}`
    content: pkg.description +
      '\n\n{italic filesize-badger --file="path/to/file.js" ' +
        getBracketedChalkTemplateEscape(
          '--filesizeFormat="{}" --sizeTypes="bundleSize" [outputPath]}'
        )
  },
  {
    optionList: optionDefinitions
  }
];

exports.getChalkTemplateSingleEscape = getChalkTemplateSingleEscape;
exports.getBracketedChalkTemplateEscape = getBracketedChalkTemplateEscape;
exports.definitions = optionDefinitions;
exports.sections = cliSections;
