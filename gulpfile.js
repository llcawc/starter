// gulpfile.js

// variables & path
const baseDir = 'src' // Base directory path without «/» at the end
const distDir = 'dist' // Distribution folder for uploading to the site
const fileswatch = 'html,htm,css,php,txt,js,cjs,mjs,webp,jpg,png,svg,json,md,woff2'
let paths = {
  scripts: {
    src: baseDir + '/assets/scripts/main.js',
    dest: distDir + '/assets/js/main.min.js',
  },
  images: {
    webp: baseDir + '/assets/images/**/*.{jpg,png,JPG,PNG}',
    svg: baseDir + '/assets/images/**/*.{svg,SVG}',
    dest: distDir,
  },
  copy: {
    src: [ baseDir + '/assets/fonts/*.*', ],
    dest: distDir,
  },
  del: {
    src: distDir,
  },
  styles: {
    src: [
      baseDir + '/assets/sass/main.*',
      // baseDir + '/assets/sass/fonts.*',
    ],
    dest: distDir + '/assets/css',
  },
  purge: {
    content: [
      `${baseDir}/**/*.html`,
      `${baseDir}/assets/scripts/**/*.js`,
      `${baseDir}/assets/sass/_reboot.scss`,
      // 'node_modules/bootstrap/scss/_reboot.scss',
      // 'node_modules/bootstrap/js/dist/dom/*.js',
      // 'node_modules/bootstrap/js/dist/{base-component,button}.js',
    ],
    safelist: {
      // standart: ["selectorname"],
      deep: [/scrolltotop$/],
      greedy: [/on$/, /down$/, /is-hidden$/],
    },
    keyframes: true,
  },
}

// import modules
import { env } from 'process'
import gulp from 'gulp'
const { src, dest, parallel, series, watch } = gulp
import browsersync from 'browser-sync'
import minify from 'gulp-htmlmin'
import sassDark from 'sass'
import sassGulp from 'gulp-sass'
const sass = sassGulp(sassDark)
import purgecss from 'gulp-purgecss'
import postCss from 'gulp-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
import { rollup } from 'rollup'
import { babel } from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import imagemin from 'gulp-imagemin'
import imageminWebp from 'imagemin-webp'
import imageminSvgo from 'imagemin-svgo'
import changed from 'gulp-changed'
import rename from 'gulp-rename'
import del from 'del'
import chalk from 'chalk'

//  server reload task
function browserSync() {
  browsersync.init({
    notify: false,
    server: { baseDir: distDir },
    online: true,
    browser: ['firefox'], // or 'chrome', 'msedge', 'opera'
    callbacks: {
      ready: function(err, bs) {
        // adding a middleware of the stack after Browsersync is running
        bs.addMiddleware("*", function (req, res) {
          res.writeHead(302, { location: "err404.html" })
          res.end("Redirecting!")
        })
      }
    },
  })
}

// html task
function html() {
  if (env.BUILD === 'production') {
    console.log(chalk.green('HTML minify running OK!'))
    return src(baseDir + '/*.html', { base: baseDir })
      .pipe(minify({ removeComments: true, collapseWhitespace: true }))
      .pipe(dest(distDir + '/'))
  } else {
    console.log(chalk.magenta('HTML file copy OK!'))
    return src(baseDir + '/*.html', { base: baseDir }).pipe(dest(distDir + '/'))
  }
}

// scripts task
async function scripts() {
  const bundle = await rollup({
    input: paths.scripts.src,
    plugins: [resolve(), commonjs({ include: 'node_modules/**' }), babel({ babelHelpers: 'bundled' }), json()],
  })

  await bundle.write({
    file: paths.scripts.dest,
    format: 'iife',
    name: 'main',
    sourcemap: env.BUILD === 'production' ? false : true,
    plugins: env.BUILD === 'production' ? [terser({compress: {passes: 2}, format: {comments: false}})] : false,
  })

  if (env.BUILD === 'production') {
    console.log(chalk.green('JS build for production is completed OK!'))
  } else {
    console.log(chalk.magenta('Script developments is running OK!'))
  }
}

// styles task
function styles() {
  if (env.BUILD === 'production') {
    console.log(chalk.green('CSS build for production is running OK!'))
    return src(paths.styles.src)
      .pipe(sass.sync())
      .pipe(purgecss(paths.purge))
      .pipe(
        postCss([
          autoprefixer(),
          cssnano({
            preset: ['default', { discardComments: { removeAll: true } }],
          }),
        ])
      )
      .pipe(rename({suffix: '.min'}))
      .pipe(dest(paths.styles.dest))
  } else {
    console.log(chalk.magenta('CSS developments is running OK!'))
    return src(paths.styles.src, { sourcemaps: true })
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(rename({suffix: '.min'}))
      .pipe(dest(paths.styles.dest, { sourcemaps: '.' }))
  }
}

// images webp task
function makewebp() {
  return src(paths.images.webp, { base: baseDir})
  .pipe(imagemin([imageminWebp({ quality: 50 })], { verbose: 'true' }))
  .pipe(rename({ extname: '.webp' }))
  .pipe(dest(paths.images.dest))
}
// images svg task
function makesvg() {
  return src(paths.images.svg, { base: baseDir})
    .pipe(changed(paths.images.dest))
    .pipe(imagemin([
        imageminSvgo({
          plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }]
        })
      ], { verbose: true }))
    .pipe(dest(paths.images.dest))
}

// copy task
function assetscopy() {
  return src(paths.copy.src, { base: baseDir }).pipe(dest(paths.copy.dest))
}
// clean task
function clean() {
  return del(paths.del.src, { force: true })
}

function watchstart() {
  watch(`./${baseDir}/**/*.html`, { usePolling: true }, html)
  watch(`./${baseDir}/assets/scripts/**/*.{js,mjs,cjs}`, { usePolling: true }, scripts)
  watch(`./${baseDir}/assets/sass/**/*.{scss,sass,css,pcss}`, { usePolling: true }, styles)
  watch(`./${baseDir}/assets/images/**/*.{webp,jpg,png,svg}`, { usePolling: true }, images)
  watch(`./${distDir}/**/*.{${fileswatch}}`, { usePolling: true }).on('change', browsersync.reload)
}

export { html, clean, assetscopy, styles, scripts }
export let images = series(makesvg, makewebp)
export let assets = series(assetscopy, html, styles, scripts)
export let serve = parallel(browserSync, watchstart)
export let dev = series(clean, images, assets, serve)
export let build = series(clean, images, assets)
