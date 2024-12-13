import { Buffer } from 'node:buffer';
import path from 'node:path';
import colors from 'colors';
import prettyBytes from 'pretty-bytes';
import plur from 'plur';
import through2 from 'through2';
import imagemin from 'imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import optipng from 'imagemin-optipng';
import svgo from 'imagemin-svgo';
const PLUGIN_NAME = 'gulp-img';
const validExtensions = new Set(['.jpg', '.jpeg', '.png', '.svg']);
let plugins = [
    mozjpeg({ quality: 75, progressive: true }),
    optipng({ optimizationLevel: 5 }),
    svgo({ plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }] }),
];
const options = {
    silent: false,
    verbose: true,
};
/**
 * Minify and clear only png, jpg and svg files - this used imagemin & plugins
 * @type { function imagemin() }
 */
export default function gulpImg() {
    let totalBytes = 0;
    let totalSavedBytes = 0;
    let totalFiles = 0;
    return through2.obj(async function (file, _, cb) {
        if (file.isBuffer()) {
            if (!validExtensions.has(path.extname(file.path).toLowerCase())) {
                if (options.verbose) {
                    console.log(colors.cyan(`${PLUGIN_NAME}: `) +
                        colors.red('✘ ') +
                        colors.magenta('Пропуск неподходящего файла ') +
                        colors.blue(file.relative));
                }
            }
            else {
                if (Array.isArray(plugins)) {
                    plugins = await Promise.all(plugins);
                }
                const localPlugins = plugins;
                const content = file.contents;
                const data = await imagemin.buffer(content, { plugins: localPlugins });
                const originalSize = content.length;
                const optimizedSize = data.length;
                const saved = originalSize - optimizedSize;
                const percent = originalSize > 0 ? (saved / originalSize) * 100 : 0;
                const savedMessage = `saved ${prettyBytes(saved)} - ${percent.toFixed(1).replace(/\.0$/, '')}%`;
                const message = saved > 0 ? savedMessage : 'already optimized';
                if (saved > 0) {
                    totalBytes += originalSize;
                    totalSavedBytes += saved;
                    totalFiles++;
                }
                if (options.verbose) {
                    console.log(colors.cyan.dim(`${PLUGIN_NAME}:`), colors.bold.green('🗸 ') + colors.grey(file.relative) + colors.dim.yellow(` (${message})`));
                }
                file.contents = Buffer.from(data);
            }
        }
        cb(null, file);
    }, function (cb) {
        if (!options.silent) {
            const percent = totalBytes > 0 ? (totalSavedBytes / totalBytes) * 100 : 0;
            let message = `Minified ${totalFiles} ${plur('image', totalFiles)}`;
            if (totalFiles > 0) {
                message += colors.yellow(` (saved ${prettyBytes(totalSavedBytes)} - ${percent.toFixed(1).replace(/\.0$/, '')}%)`);
            }
            console.log(colors.cyan(`${PLUGIN_NAME}: ${message}`));
        }
        cb();
    });
}
