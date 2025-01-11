// gulpfile.js • frontend • starter • pasmurno by llcawc • https://github.com/llcawc

// import modules
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { deleteAsync as del } from 'del'
import gulp from 'gulp'
import changed from 'gulp-changed'
import htmlmin from 'gulp-hmin'
import imagemin from 'gulp-img'
import { nunjucksCompile } from 'gulp-nunjucks' // About nunjucks: https://mozilla.github.io/nunjucks/
import postcss from 'gulp-postcss'
import rename from 'gulp-ren'
import replace from 'gulp-replace'
import fs from 'node:fs'
import { env } from 'node:process'
import { rollup } from 'rollup'
import data from './src/data/site.mjs'
const { src, dest, series, watch } = gulp

// html assembly task
function assemble() {
  if (env.BUILD === 'production') {
    return src('src/*.njk', { base: 'src' })
      .pipe(nunjucksCompile(data).on('Error', (err) => console.log(err)))
      .pipe(htmlmin({ removeComments: true, collapseWhitespace: true }))
      .pipe(dest('dist'))
  } else {
    return src('src/*.njk', { base: 'src' })
      .pipe(nunjucksCompile(data).on('Error', (err) => console.log(err)))
      .pipe(dest('dist'))
  }
}

// scripts task
async function scripts() {
  const bundle = await rollup({
    input: 'src/scripts/main.ts',
    plugins: [
      typescript({
        compilerOptions: {
          rootDir: './src/scripts',
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          target: 'ES2020',
          resolveJsonModule: true,
        },
      }),
      resolve(),
      commonjs({ include: 'node_modules/**' }),
      babel({ babelHelpers: 'bundled' }),
      json(),
    ],
  })
  await bundle.write({
    file: 'dist/assets/js/main.min.js',
    format: 'iife',
    name: 'main',
    plugins: env.BUILD === 'production' ? [terser({ format: { comments: false } })] : [],
    sourcemap: env.BUILD === 'production' ? false : true,
  })
}

// inline scripts
function inlinescripts() {
  return src('dist/**/*.html', { base: 'dist' })
    .pipe(
      replace(/<script defer="defer" src="\/assets\/js\/main.min.js"><\/script>/, () => {
        const script = fs.readFileSync('dist/assets/js/main.min.js', 'utf8')
        return '<script>' + script + '</script>'
      })
    )
    .pipe(dest('dist'))
}

// styles task
function styles() {
  return src(['src/styles/main.css', 'src/styles/fonts.css'], env.BUILD === 'production' ? false : { sourcemaps: true })
    .pipe(postcss())
    .pipe(rename({ suffix: '.min', extname: '.css' }))
    .pipe(dest('dist/assets/css', env.BUILD === 'production' ? false : { sourcemaps: '.' }))
}

// inline styles
function inlinestyles() {
  return src('dist/**/*.html', { base: 'dist' })
    .pipe(
      replace(/<link rel="stylesheet" href="\/assets\/css\/main.min.css">/, () => {
        const style = fs.readFileSync('dist/assets/css/main.min.css', 'utf8')
        return '<style>' + style + '</style>'
      })
    )
    .pipe(dest('dist'))
}

// images task
function images() {
  return src('src/assets/images/**/*.*', { base: 'src', encoding: false })
    .pipe(changed('dist'))
    .pipe(imagemin())
    .pipe(dest('dist'))
}

// clean task
function clean() {
  return del(['dist/**', 'dist/assets/**', '!dist/assets', '!dist/assets/images'])
}
// post clean task
function postclean() {
  return del(['dist/assets/css/main.min.css', 'dist/assets/js'])
}

// copy task
function fontcopy() {
  return src(['src/assets/fonts/bootstrap-icons/*.*', 'src/assets/fonts/Inter/*.*', 'src/assets/fonts/JetBrains/*.*'], {
    encoding: false,
  }).pipe(dest('dist/assets/fonts'))
}
// copy task
function copy() {
  return src(['src/.htaccess', 'src/robots.txt'], { base: 'src' }).pipe(dest('dist'))
}

// watch
function watcher() {
  watch('src/data/*.*', assemble)
  watch('src/**/*.njk', series(assemble, styles))
  watch('src/scripts/**/*.{js,ts,mjs,cjs}', scripts)
  watch('src/styles/**/*.css', styles)
  watch('src/assets/images/**/*.{jpg,png,svg}', images)
}

// export
export { assemble, clean, copy, fontcopy, images, scripts, styles }
export let inline = series(inlinescripts, inlinestyles, postclean)
export let assets = series(fontcopy, copy, images, assemble, scripts, styles)
export let dev = series(clean, assets, watcher)
export let build = series(clean, assets)
