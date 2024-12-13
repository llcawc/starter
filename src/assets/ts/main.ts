// main

import data from './data'
import year from './year'
import buttons from './buttons'
import eventScrollToTop from './totop'
import colorSwitcher from './colormode'

document.addEventListener('DOMContentLoaded', () => {
  colorSwitcher()
  buttons()
  year()
  const intViewportWidth = window.innerWidth // viwport X
  if (intViewportWidth >= 760) {
    eventScrollToTop()
  }
  console.log(data)
})
