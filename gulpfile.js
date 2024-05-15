// gulpfile.js • frontend • nunjucks • tailwindcss • pasmurno by llcawc • https://github.com/llcawc

// import modules
import fs from 'node:fs'
import { env } from 'node:process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import { nunjucksCompile } from 'gulp-nunjucks' // About nunjucks: https://mozilla.github.io/nunjucks/
import htmlmin from 'gulp-htmlmin'
import prettier from 'gulp-prettier'
import tailwindcss from 'tailwindcss'
import tailwindNesting from 'tailwindcss/nesting/index.js'
import postcss from 'gulp-postcss'
import postcssImport from 'postcss-import'
import autoprefixer from 'autoprefixer'
import csso from 'postcss-csso'
import { rollup } from 'rollup'
import { babel } from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin'
import changed from 'gulp-changed'
import replace from 'gulp-replace'
import rename from 'gulp-rename'
import { deleteAsync as del } from 'del'

// variables & path
const baseDir = 'src'
const distDir = 'dist'
let paths = {
  scripts: {
    src: baseDir + '/assets/ts/main.ts',
    min: distDir + '/assets/js/main.min.js',
  },
  styles: {
    src: baseDir + '/assets/styles/*.css',
    min: distDir + '/assets/css/main.min.css',
    dest: distDir + '/assets/css',
  },
  images: {
    src: baseDir + '/assets/images/**/*.{gif,jpg,png,svg}',
    dest: distDir,
  },
  // prettier-ignore
  clean: [
    distDir + '/**',
    distDir + '/assets/**',
    '!' + distDir + '/assets',
    '!' + distDir + '/assets/images'
  ],
  // prettier-ignore
  copy: {
    src: [
      baseDir + '/assets/fonts/**/*.*',
      baseDir + '/assets/images/favicon.ico',
      baseDir + '/.htaccess',
      baseDir + '/robots.txt'
    ],
  },
}

// html assembly task
function assemble() {
  const plagin = env.BUILD === 'production'
    ? htmlmin({ removeComments: true, collapseWhitespace: true })
    : prettier({ parser: 'html' })
    return src(baseDir + '/*.{njk,htm,html}', { base: baseDir })
      .pipe(nunjucksCompile().on('Error', (err) => console.log(err)))
      .pipe(plagin)
      .pipe(dest(distDir))
}

// scripts task
async function scripts() {
  const bundle = await rollup({
    input: paths.scripts.src,
    plugins: [
      typescript({ compilerOptions: { lib: ['ES2020', 'DOM', 'DOM.Iterable'], target: 'ES2020', resolveJsonModule: true } }),
      resolve(),
      commonjs({ include: 'node_modules/**' }),
      babel({ babelHelpers: 'bundled' }),
      json(),
    ],
  })
  await bundle.write({
    file: paths.scripts.min,
    format: 'iife',
    name: 'main',
    plugins: env.BUILD === 'production' ? [terser({ format: { comments: false } })] : [],
    sourcemap: env.BUILD === 'production' ? false : true,
  })
}

// inline scripts
function inlinescripts() {
  return src(distDir + '/**/*.html', { base: distDir })
    .pipe(
      replace(/<script src="assets\/js\/main.min.js"><\/script>/, () => {
        const script = fs.readFileSync(distDir + '/assets/js/main.min.js', 'utf8')
        return '<script>' + script + '</script>'
      })
    )
    .pipe(dest(distDir))
}

// styles task
function styles() {
  if (env.BUILD === 'production') {
    return src(paths.styles.src)
      .pipe(postcss([postcssImport, tailwindNesting, tailwindcss, autoprefixer, csso({ comments: false })]))
      .pipe(rename({ suffix: '.min', extname: '.css' }))
      .pipe(dest(paths.styles.dest))
  } else {
    return src(paths.styles.src, { sourcemaps: true })
      .pipe(postcss([postcssImport, tailwindNesting, tailwindcss]))
      .pipe(rename({ suffix: '.min', extname: '.css' }))
      .pipe(dest(paths.styles.dest, { sourcemaps: '.' }))
  }
}

// inline styles
function inlinestyles() {
  return src(distDir + '/**/*.html', { base: distDir })
    .pipe(
      replace(/<link rel="stylesheet" href="assets\/css\/main.min.css">/, () => {
        const style = fs.readFileSync(distDir + '/assets/css/main.min.css', 'utf8')
        return '<style>' + style + '</style>'
      })
    )
    .pipe(dest(distDir))
}

// images task
function images() {
  return src(paths.images.src, { base: baseDir, encoding: false })
    .pipe(changed(paths.images.dest))
    .pipe(
      imagemin(
        [
          gifsicle({ interlaced: true }),
          mozjpeg({ quality: 75, progressive: true }),
          optipng({ optimizationLevel: 5 }),
          svgo({ plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }] }),
        ],
        { verbose: true }
      )
    )
    .pipe(dest(paths.images.dest))
}

// clean task
function clean() {
  return del(paths.clean)
}
// post clean task
function postclean() {
  return del([distDir + '/assets/css/main.min.css', distDir + '/assets/js'])
}

// copy task
function copy() {
  return src(paths.copy.src, { base: baseDir, encoding: false }).pipe(dest(distDir))
}

// bootstrap icons font copy task
function bifont() {
  return src(baseDir + '/libs/bootstrap-icons/font/fonts/*.woff2', { encoding: false }).pipe(rename({ basename: 'bi-font' })).pipe(dest(baseDir + '/assets/fonts/biFont'))
}

// watch
function watcher() {
  watch(baseDir + '/**/*.{njk,htm,html}', { usePolling: true }, parallel(assemble, styles))
  watch(baseDir + '/assets/scripts/**/*.{js,mjs,cjs}', { usePolling: true }, parallel(scripts))
  watch(baseDir + '/assets/styles/**/*.{css,scss}', { usePolling: true }, parallel(assemble, styles))
  watch(baseDir + '/assets/images/**/*.{jpg,png,svg,gif}', { usePolling: true }, parallel(images))
}

// export
export { copy, bifont, clean, images, scripts, styles }
export let inline = series(inlinescripts, inlinestyles, postclean)
export let assets = series(copy, images, assemble, scripts, styles)
export let dev = series(clean, assets, watcher)
export let build = series(clean, assets)
