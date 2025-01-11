/**
 * @name buttons
 * @description This function added cool effect to buttons.
 */
export default function buttons(): void {
  const buttons = document.querySelectorAll('.mybtn')
  if (!buttons) {
    console.log('No buttons with class ".mybtn"!\n')
    return
  }

  buttons.forEach((el) => {
    el.addEventListener('click', (event) => {
      const e = <MouseEvent>event
      const but = <HTMLButtonElement | null>event.target

      e.preventDefault() // preventing for submitting

      const overlay = document.createElement('span') // creating a element span
      overlay.classList.add('overlay') // add a class iside the span

      if (but) {
        const x = e.clientX - but.offsetLeft
        const y = e.clientY - but.offsetTop

        overlay.style.left = x + 'px'
        overlay.style.top = y + 'px'

        but.appendChild(overlay)
      }

      setTimeout(() => {
        overlay.remove()
      }, 500) // remove span overlay after 0.5s of click
    })
  })
}
