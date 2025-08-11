// gulpfile.js • frontend • starter • pasmurno by llcawc • https://github.com/llcawc

// import modules
import { deleteAsync } from 'del'
import { dest, parallel, series, src, watch } from 'gulp'
import changed from 'gulp-changed'
import pug from 'gulp-pug'
import licss from 'licss'
import { env } from 'node:process'
import psimage from 'psimage'
import tscom from 'tscom'
import data from './src/data/site.js'

// compile pug files
function html() {
  const options = env.BUILD === 'production' ? { data } : { pretty: true, data }
  return src('src/pages/*.pug').pipe(pug(options)).pipe(dest('dist'))
}

// sass compile
function sass() {
  const options =
    env.BUILD === 'production'
      ? {
          silent: false,
          postprocess: 'full',
          loadPaths: ['src/styles', 'node_modules'],
          purgeOptions: {
            content: [
              './src/{pages,includes,layouts}/*.pug',
              './src/data/*.{js,json}',
              './src/assets/scripts/**/*.ts',
              './vendor/bootstrap/js/dist/dom/*.js',
              './vendor/bootstrap/js/dist/{alert,button,dropdown}.js',
            ],
            safelist: [/show/, /fade/, /m-0/, /^alert.*/, /data-bs-theme/, /data-checked/, /back-to-top/, /overlay/],
            keyframes: true,
          },
        }
      : { silent: false, postprocess: 'none' }
  return src('src/styles/*.sass', { sourcemaps: true })
    .pipe(licss(options))
    .pipe(dest('dist/assets/css', { sourcemaps: '.' }))
}

// scripts task
async function scripts(cb) {
  await tscom({ input: 'src/scripts/main.ts', dir: 'dist/assets/js' })
  cb()
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
      'src/assets/fonts/Inter/*.woff*',
      'src/assets/fonts/bootstrap-icons/*.woff*',
      'src/assets/fonts/JetBrains/*.woff*',
    ],
    { encoding: false }
  ).pipe(dest('dist/assets/fonts'))
}

// clean task
function clean() {
  return deleteAsync(['dist/**', 'dist/assets/**', '!dist/assets', '!dist/assets/images'])
}

// watch task
function monitor() {
  watch('src/{data,includes,layouts,pages}/*.{pug,js}', html)
  watch('src/scripts/**/*.*', scripts)
  watch('src/styles/**/*.*', sass)
  watch('src/assets/images/**/*.*', images)
  watch('src/assets/fonts/**/*.*', fonts)
}

// export
export { clean, fonts, html, images, monitor, sass, scripts }
export const assets = parallel(html, sass, scripts, fonts, images)
export const dev = series(clean, assets, monitor)
export const build = series(clean, assets)
