/**
 * @name buttons
 * @description This function added cool effect to buttons.
 */
function buttons(): void {
  const buttons = document.querySelectorAll('.mybtn')
  if (!buttons) {
    console.log('No buttons with class ".mybtn"!\n')
    return
  }

  buttons.forEach((el) => {
    el.addEventListener('click', (event) => {
      const e = <MouseEvent>event
      const but = <HTMLElement | null>event.target

      e.preventDefault() // preventing for submitting

      const overlay = document.createElement('span') // creating a element span
      overlay.classList.add('overlay') // add a class iside the span

      if (but) {
        const x = e.offsetX
        const y = e.offsetY

        overlay.style.left = x + 'px'
        overlay.style.top = y + 'px'

        but.appendChild(overlay)
      }

      setTimeout(() => {
        overlay.remove()
      }, 500) // remove span overlay after 0.5s of click
    })
  })

  // liveAlert
  const liveAlertContent = '<p class="m-0">Nice, you triggered this alert message!</p>'
  const liveAlertPlaceholder = document.getElementById('liveAlertPlaceholder')
  const alertTrigger = document.getElementById('liveAlertBtn')
  const liveAlert = document.createElement('div')

  liveAlert.classList.add('alert', 'alert-primary', 'm-0', 'fade')
  liveAlert.role = 'alert'
  liveAlert.id = 'liveAlert'
  liveAlert.innerHTML = liveAlertContent
  liveAlertPlaceholder?.append(liveAlert)

  if (alertTrigger) {
    alertTrigger.addEventListener('click', () => {
      liveAlert.classList.toggle('show')
      setTimeout(() => liveAlert.classList.remove('show'), 2400)
    })
  }
}

// установка скрипта после полной загрузки страницы
window.addEventListener('DOMContentLoaded', buttons)
// вариант экспорт функции buttons
// export { buttons as default }
