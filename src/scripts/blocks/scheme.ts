/**
 * scheme.ts
 * • color theme switcher script
 * adds or removes 'dark' class in html element
 * or switches between 'light' and 'dark' in 'data-bs-theme' attribute of html element
 */

type ColorTheme = 'dark' | 'light' | 'system'

function schemeSwitcher() {
  // store theme in local storage
  const setStoredTheme = (theme: ColorTheme) => localStorage.setItem('color-mode', theme)
  // read theme from local storage
  const getStoredTheme = () => localStorage.getItem('color-mode') as ColorTheme | null
  // define function to remove theme key
  const removeStoredTheme = () => localStorage.removeItem('color-mode')

  // constant holds media query response for dark color scheme presence
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  // Get selected setting (including 'system')
  const getPreferredTheme = (): ColorTheme => {
    return getStoredTheme() ?? 'system'
  }

  // Set color theme in 'html' tag attribute
  const setTheme = (theme: ColorTheme) => {
    const html = document.documentElement
    const themeToApply = theme === 'system' ? (darkModeMediaQuery.matches ? 'dark' : 'light') : theme

    html.classList.toggle('dark', themeToApply === 'dark')
    html.setAttribute('data-bs-theme', themeToApply)
  }

  // get all theme switcher buttons on the page
  const switcherRadios = document.querySelectorAll<HTMLElement>('.ui-radio')

  // check if theme switcher buttons exist on the page
  if (switcherRadios.length === 0) {
    return
  }

  // Display switching on color theme control panel
  const showActiveTheme = (theme: ColorTheme) => {
    const targetRadio = document.querySelector<HTMLElement>(`.ui-radio[data-ui-value="${theme}"]`)

    if (!targetRadio) {
      console.warn(`The node ".ui-radio[data-ui-value=${theme}]" is missing!`)
      return
    }

    // reset all buttons
    switcherRadios.forEach((elem) => {
      elem.removeAttribute('data-checked')
      elem.setAttribute('aria-checked', 'false')
      elem.setAttribute('tabindex', '-1')
    })

    // set active button
    targetRadio.setAttribute('data-checked', 'true')
    targetRadio.setAttribute('aria-checked', 'true')
    targetRadio.setAttribute('tabindex', '0')
  }

  // Initialization
  const initialTheme = getPreferredTheme()
  showActiveTheme(initialTheme)
  setTheme(initialTheme)

  // set theme switcher handler
  switcherRadios.forEach((radio) => {
    radio.addEventListener('click', () => {
      const theme = (radio.getAttribute('data-ui-value') as ColorTheme) || 'system'

      if (theme === 'system') {
        removeStoredTheme()
      } else {
        setStoredTheme(theme)
      }

      showActiveTheme(theme)
      setTheme(theme)
    })
  })

  // set system theme change handler
  darkModeMediaQuery.addEventListener('change', () => {
    const storedTheme = getStoredTheme()
    if (!storedTheme || storedTheme === 'system') {
      setTheme('system')
    }
  })
}

// run here
window.addEventListener('DOMContentLoaded', schemeSwitcher)
// export { schemeSwitcher }
