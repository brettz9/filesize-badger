import {readFile as origReadFile, unlink as origUnlink} from 'fs';
import {promisify} from 'util';
import {join} from 'path';

import {rollup} from 'rollup';
import fileSize from 'rollup-plugin-filesize';
import {rollupPluginFilesizeBadger} from '../src/index.js';

const readFile = promisify(origReadFile);
const unlink = promisify(origUnlink);

/**
* @external RollupInputOptions
* @see https://rollupjs.org/guide/en/#inputoptions-object
*/

/**
* @external RollupOutputOptions
* @see https://rollupjs.org/guide/en/#outputoptions-object
*/

/**
 * @param {RollupInputOptions} inputOptions
 * @param {RollupOutputOptions} outputOptions
 * @returns {Promise<void>}
 */
async function build (inputOptions, outputOptions) {
  // create a bundle
  const bundle = await rollup(inputOptions);

  // eslint-disable-next-line no-console
  console.log(bundle);

  // generate output specific code in-memory
  // you can call this function multiple times on the same bundle object
  const {output} = await bundle.generate(outputOptions);

  // eslint-disable-next-line no-console
  console.log('output', output);

  await bundle.write(outputOptions);
}

const getFixturePath = (path) => {
  return join(__dirname, `fixtures/${path}`);
};
const getResultsPath = (path) => {
  return join(__dirname, `results/${path}`);
};

const defaultOutputPath = join(__dirname, '../filesize-badge.svg');
const outputPath = getResultsPath('rollup-plugin-filesize-output.svg');
const bundlePath = getResultsPath('bundle.js');
const rollupPluginFilesizeFixturePath = getFixturePath(
  'rollupPluginFilesizeFixturePath.svg'
);
const rollupPluginFilesizeFixtureNoArgsPath = getFixturePath(
  'rollupPluginFilesizeFixtureNoArgsPath.svg'
);

describe('`rollupPluginFilesizeBadger`', function () {
  const unlinker = async () => {
    try {
      return await unlink(outputPath);
    } catch (err) {}
    return undefined;
  };
  before(unlinker);
  after(unlinker);

  it('Makes a badge through `postRender` (no arguments)', async function () {
    await build({
      input: getFixturePath('sample.js'),
      plugins: [
        fileSize({
          postRender: rollupPluginFilesizeBadger()
        })
      ]
      // , ...
    }, {
      file: bundlePath
    });
    const contents = await readFile(defaultOutputPath, 'utf8');
    const expected = await readFile(
      rollupPluginFilesizeFixtureNoArgsPath, 'utf8'
    );
    expect(contents).to.equal(expected);
  });

  it('Makes a badge through `postRender`', async function () {
    await build({
      input: getFixturePath('sample.js'),
      plugins: [
        fileSize({
          postRender: rollupPluginFilesizeBadger({
            outputPath,
            // eslint-disable-next-line no-template-curly-in-string
            textTemplate: 'Rollup Plugin Filesize (${filePath})'
          })
        })
      ]
      // , ...
    }, {
      file: bundlePath
    });
    const contents = await readFile(outputPath, 'utf8');
    const expected = await readFile(rollupPluginFilesizeFixturePath, 'utf8');
    expect(contents).to.equal(expected);
  });
});
