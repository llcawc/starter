/** @type {import('tailwindcss').Config} */
export default {
  content: ['src/**/*.{html,htm,njk}', 'src/assets/**/*.{js,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: 'rgb(var(--accent) / <alpha-value>)',
        light: 'rgb(var(--light) / <alpha-value>)',
        dark: 'rgb(var(--dark) / <alpha-value>)',
      },
      backgroundImage: {
        pen: "url('/assets/images/icons/pen.svg')",
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
