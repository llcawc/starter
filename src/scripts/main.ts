// main

import buttons from './blocks/buttons'
import colorSwitcher from './blocks/colormode'
import data from './blocks/data'
import eventScrollToTop from './blocks/totop'

document.addEventListener('DOMContentLoaded', () => {
  colorSwitcher()
  buttons()
  const intViewportWidth = window.innerWidth // viwport X
  if (intViewportWidth >= 640) {
    eventScrollToTop()
  }
  console.log(data)
})
