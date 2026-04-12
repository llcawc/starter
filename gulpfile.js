// gulpfile.js • frontend • starter • pasmurno by llcawc • https://github.com/llcawc

// import modules
import { env } from 'node:process'

import { pscss, rename } from '@pasmurno/pscss'
import { server } from '@pasmurno/serve'
import { deleteAsync } from 'del'
import { dest, parallel, series, src, watch } from 'gulp'
import changed from 'gulp-changed'
import gulpPug from 'gulp-pug'
import { psimage } from 'psimage'
import { tscom } from 'tscom'

import data from './src/data/site.js'

// server
async function browse() {
  return await server()
}

// compile pug files
function html() {
  const options = env.BUILD === 'production' ? { data } : { pretty: true, data }
  return src('src/pages/*.pug').pipe(gulpPug(options)).pipe(dest('dist'))
}

// sass compile
function style() {
  const options =
    env.BUILD === 'production'
      ? {
          minify: true,
          loadPaths: ['src/styles', 'node_modules'],
          purgeCSSoptions: {
            content: [
              './src/{pages,includes,layouts}/*.pug',
              './src/data/*.{js,json}',
              './src/assets/scripts/**/*.ts',
              './vendor/bootstrap/js/dist/dom/*.js',
              './vendor/bootstrap/js/dist/{alert,button,dropdown}.js',
            ],
            safelist: [
              /show/,
              /fade/,
              /m-0/,
              /^alert.*/,
              /data-bs-theme/,
              /data-checked/,
              /scrolltotop$/,
              /on$/,
              /down$/,
              /overlay/,
            ],
            keyframes: true,
            variables: true,
          },
        }
      : { minify: false }
  return src('src/styles/*.sass', { sourcemaps: env.BUILD !== 'production' })
    .pipe(pscss(options))
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('dist/assets/css', { sourcemaps: '.' }))
}

// scripts task
function script() {
  return src('src/scripts/main.ts')
    .pipe(tscom())
    .pipe(rename({ basename: 'script.min.js' }))
    .pipe(dest('dist/assets/js'))
}

// images task
function images() {
  return src(['src/assets/images/**/*.*'], { base: 'src/assets/images', encoding: false })
    .pipe(changed('dist/assets/images'))
    .pipe(psimage())
    .pipe(dest('dist/assets/images'))
}

//copy fonts
function fonts() {
  return src(
    [
      'src/assets/fonts/bootstrap-icons/*.woff*',
      'src/assets/fonts/Inter/*.woff*',
      'src/assets/fonts/JetBrains/*.woff*',
    ],
    { encoding: false },
  ).pipe(dest('dist/assets/fonts'))
}

// clean task
function clean() {
  return deleteAsync(['dist/**', 'dist/assets/**', '!dist/assets', '!dist/assets/images'])
}

// watch task
function watcher() {
  watch('src/{data,includes,layouts,pages}/*.{pug,js}', html)
  watch('src/scripts/**/*.*', script)
  watch('src/styles/**/*.*', style)
  watch('src/assets/images/**/*.*', images)
  watch('src/assets/fonts/**/*.*', fonts)
}

// export
export { clean, fonts, html, images, watcher, style, script, browse }
export const assets = parallel(html, style, script, fonts, images)
export const build = series(clean, assets)
export const dev = series(build, browse, watcher)
