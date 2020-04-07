import filesize from 'rollup-plugin-filesize';

import filesizeBadger from './dist/index.esm.js';

function getRollupObject ({
  format
}) {
  return {
    plugins: [
      filesize({
        postRender: filesizeBadger()
      })
    ],
    external: ['fs', 'util'],
    input: 'src/index.js',
    output: {
      file: `dist/index.${format}.js`,
      format
    }
  };
}

export default [
  getRollupObject({format: 'cjs'}),
  getRollupObject({format: 'esm'})
];
