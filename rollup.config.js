import fileSize from 'rollup-plugin-filesize';

import {rollupPluginFilesizeBadger} from './dist/index.esm.js';

/**
* @external RollupOptions
*/

/**
 * @param {PlainObject} cfg
 * @param {"cjs"|"umd"|"esm"|"iife"} cfg.format
 * @returns {RollupOptions}
 */
function getRollupObject ({
  format
}) {
  return {
    plugins: [
      fileSize({
        showBeforeSizes: 'release',
        reporter: ['boxen', rollupPluginFilesizeBadger()]
      })
    ],
    external: ['fs', 'util', 'path'],
    input: 'src/index.js',
    output: {
      sourcemap: true,
      file: `dist/index.${format}.js`,
      format
    }
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  getRollupObject({format: 'cjs'}),
  getRollupObject({format: 'esm'})
];
