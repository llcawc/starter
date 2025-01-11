import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import { env } from 'node:process'
import postcssImport from 'postcss-import'
import tailwindcss from 'tailwindcss'

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    postcssImport(),
    tailwindcss(),
    autoprefixer(),
    env.BUILD === 'production' ? cssnano({ preset: 'default', comments: false }) : null,
  ],
}

export default config
