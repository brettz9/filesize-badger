import { writeFile as writeFile$1 } from 'fs';
import { promisify } from 'util';

const badgeUp = require('badge-up').v2;
const template = require('es6-template-strings');
const writeFile = promisify(writeFile$1);

const sizeTypeMap = new Map([
    ['bundleSize', {text: 'Bundle size'}],
    ['brotliSize', {text: 'Brotli size', showProperty: 'showBrotliSize'}],
    ['minSize', {text: 'Min size', showProperty: 'showMinifiedSize'}],
    ['gzipSize', {text: 'Gzip size', showProperty: 'showGzippedSize'}]
]);
function getSizeText (sizeType) {
    return sizeTypeMap.get(sizeType).text;
}

function index ({
    outputPath = 'filesize.svg',
    textTemplate = 'File size (${filePath})',
    sizeTemplate = '${sizeType}: ${size}',
    sizeTypes = ['bundleSize', 'brotliSize', 'minSize', 'gzipSize'],
    sizeColors = [['orange'], ['blue'], ['green'], ['indigo']],
    textColor = ['navy']
} = {}) {
    return async function (opts, outputOptions, info) {
        const {
            fileName,
            bundleSize, brotliSize, minSize, gzipSize
        } = info;
        const {file: filePath} = outputOptions;
        const sections = [
          ...(textTemplate
          ? [[template(textTemplate, {
              filePath,
              fileName, bundleSize, brotliSize, minSize, gzipSize
          }), ...textColor]]
          : []),
          ...(sizeTypes
            ? sizeTypes.map((sizeType, i) => {
                const {showProperty} = sizeTypeMap.get(sizeType);
                if (typeof showProperty === 'string' && !opts[showProperty]) {
                    return false;
                }
                const size = info[sizeType];
                sizeType = getSizeText(sizeType);
                return [template(sizeTemplate, {
                    sizeType,
                    filePath,
                    fileName,
                    size
                }), ...sizeColors[i]];
            }).filter((template) => template)
            : '')
        ];

        const svg = await badgeUp(sections);
        await writeFile(outputPath, svg);
    };
}

export default index;
