// gulpfile.js • frontend • nunjucks • tailwindcss • pasmurno by llcawc • https://github.com/llcawc

// import modules
import fs from 'node:fs'
import { env } from 'node:process'
import gulp from 'gulp'
const { src, dest, series, watch } = gulp
import { nunjucksCompile } from 'gulp-nunjucks' // About nunjucks: https://mozilla.github.io/nunjucks/
import htmlmin from 'gulp-htmlmin'
import tailwindcss from 'tailwindcss'
import tailwindNesting from 'tailwindcss/nesting/index.js'
import postcss from 'gulp-postcss'
import cssnano from 'cssnano'
import postcssImport from 'postcss-import'
import autoprefixer from 'autoprefixer'
import { rollup } from 'rollup'
import { babel } from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import replace from 'gulp-replace'
import { deleteAsync as del } from 'del'
import rename from './gulp/gulp-ren.js'
import imagemin from './gulp/gulp-img.js'

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
    src: [baseDir + '/assets/images/**/*.*'],
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
  if (env.BUILD === 'production') {
    return src(baseDir + '/*.{njk,htm,html}', { base: baseDir })
      .pipe(nunjucksCompile().on('Error', (err) => console.log(err)))
      .pipe(htmlmin({ removeComments: true, collapseWhitespace: true }))
      .pipe(dest(distDir))
  } else {
    return src(baseDir + '/*.{njk,htm,html}', { base: baseDir })
      .pipe(nunjucksCompile().on('Error', (err) => console.log(err)))
      .pipe(dest(distDir))
  }
}

// scripts task
async function scripts() {
  const bundle = await rollup({
    input: paths.scripts.src,
    plugins: [
      typescript({
        compilerOptions: {
          rootDir: './src/assets/ts',
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
      replace(/<script defer="defer" src="\/assets\/js\/main.min.js"><\/script>/, () => {
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
      .pipe(
        postcss([
          postcssImport,
          tailwindNesting,
          tailwindcss,
          autoprefixer,
          cssnano({ preset: 'default', comments: false }),
        ])
      )
      .pipe(rename({ suffix: '.min', extname: '.css' }))
      .pipe(dest(paths.styles.dest))
  } else {
    return src(paths.styles.src, env.BUILD === 'production' ? {} : { sourcemaps: true })
      .pipe(postcss([postcssImport, tailwindNesting, tailwindcss]))
      .pipe(rename({ suffix: '.min', extname: '.css' }))
      .pipe(dest(paths.styles.dest, env.BUILD === 'production' ? {} : { sourcemaps: '.' }))
  }
}

// inline styles
function inlinestyles() {
  return src(distDir + '/**/*.html', { base: distDir })
    .pipe(
      replace(/<link rel="stylesheet" href="\/assets\/css\/main.min.css">/, () => {
        const style = fs.readFileSync(distDir + '/assets/css/main.min.css', 'utf8')
        return '<style>' + style + '</style>'
      })
    )
    .pipe(dest(distDir))
}

// images task
function images() {
  return src(paths.images.src, { base: baseDir, encoding: false }).pipe(imagemin()).pipe(dest(paths.images.dest))
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
  return src(baseDir + '/libs/bootstrap-icons/font/fonts/*.woff2', { encoding: false })
    .pipe(rename({ basename: 'bi-font' }))
    .pipe(dest(baseDir + '/assets/fonts/biFont'))
}

// watch
function watcher() {
  watch(baseDir + '/**/*.{njk,htm,html}', series(assemble, styles))
  watch(baseDir + '/assets/scripts/**/*.{js,ts,mjs,cjs}', scripts)
  watch(baseDir + '/assets/styles/**/*.css', series(assemble, styles))
  watch(baseDir + '/assets/images/**/*.{jpg,png,svg,gif}', images)
}

// export
export { copy, bifont, clean, assemble, images, scripts, styles }
export let inline = series(inlinescripts, inlinestyles, postclean)
export let assets = series(copy, images, assemble, scripts, styles)
export let dev = series(clean, assets, watcher)
export let build = series(clean, assets)
