/**
 * @name eventScrollToTop()
 * @description Function to launch the button to return to the top of the page
 */
function eventScrollToTop(): void {
  let flag = false // the visibility flag of the "up" button
  const metka = 300 // the number of pixels of scrolling the page before displaying the "up" button

  const arrowUp: HTMLDivElement | null = document.createElement('div') // the "up" button
  arrowUp.classList.add('back-to-top')
  const arrowUpSvg: string =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5"/></svg>'
  arrowUp.innerHTML = arrowUpSvg
  document.body.append(arrowUp)

  if (!arrowUp) {
    console.log('The node ".back-to-top" is missing! ')
  }

  window.addEventListener('scroll', function () {
    const counter = this.scrollY
    if (counter > metka) {
      arrowUp.classList.add('up')
      arrowUp.classList.remove('down')
      flag = true
    }
    if (counter <= metka && flag == true) {
      arrowUp.classList.add('down')
      arrowUp.classList.remove('up')
      flag = false
    }
  })

  arrowUp.addEventListener('click', (e) => {
    e.preventDefault()
    window.scrollTo({
      left: window.scrollX,
      top: 0,
      behavior: 'smooth',
    })
  })
}

// Sample use of the function:
// Launching the scroll To Top button function after the DOM is fully loaded
// and for screens with a viewport of more than 640px

document.addEventListener('DOMContentLoaded', () => {
  const intViewportWidth = window.innerWidth // viwport X
  if (intViewportWidth >= 640) {
    eventScrollToTop()
  }
})

// вариант экспорт функции eventScrollToTop
// export { eventScrollToTop as default }
