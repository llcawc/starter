import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['src/**/*.njk', 'src/scripts/**/*.{js,mjs,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: colors.blue[500],
        light: colors.gray[400],
        dark: colors.gray[900],
      },
      backgroundImage: {
        pen: "url('/assets/images/icons/pen.svg')",
        burg: "url('/assets/images/burg.jpg')",
      },
      dropShadow: {
        hx: '0 0 5px rgba(#000,0.5)',
      },
      transitionDuration: {
        250: '250ms',
        400: '400ms',
      },
    },
  },
  plugins: [],
}
