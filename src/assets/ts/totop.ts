/**
 * @name eventScrollToTop()
 * @description Function to launch the button to return to the top of the page
 */
export default function eventScrollToTop(): void {
  let flag = false // the visibility flag of the "up" button
  const metka = 300 // the number of pixels of scrolling the page before displaying the "up" button

  const arrowUp: HTMLDivElement | null = document.createElement('div') // the "up" button
  arrowUp.classList.add('back-to-top')
  const arrowUpSvg: string =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/></svg>'
  arrowUp.innerHTML = arrowUpSvg
  document.body.append(arrowUp)

  if (!arrowUp) {
    console.log('The node ".back-to-top" is missing! ')
  }

  window.addEventListener('scroll', function () {
    let counter = this.scrollY
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
// and for screens with a viewport of more than 760px
//
// document.addEventListener('DOMContentLoaded', () => {
//   let intViewportWidth = window.innerWidth // viwport X
//   if (intViewportWidth >= 760) {
//     eventScrollToTop()
//   }
// })
