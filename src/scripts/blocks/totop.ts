// totop.ts
// кнопка возврата на верх страницы

/** svg код стрелки вверх */
const arrow =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22V2M12 2L2 12M12 2L22 12" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'

/** Инициализирует кнопку возврата на верх страницы */
function initScrollToTop() {
  const metka = 300
  let isVisible = false

  const arrowUp = document.createElement('div')
  arrowUp.id = 'scrolltotop'
  arrowUp.innerHTML = arrow
  document.body.append(arrowUp)

  window.addEventListener(
    'scroll',
    () => {
      const counter = window.scrollY

      if (counter > metka && !isVisible) {
        arrowUp.classList.add('on')
        arrowUp.classList.remove('down')
        isVisible = true
      } else if (counter <= metka && isVisible) {
        arrowUp.classList.add('down')
        arrowUp.classList.remove('on')
        isVisible = false
      }
    },
    { passive: true },
  )

  arrowUp.addEventListener('click', (event) => {
    event.preventDefault()
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  })
}

/** Запуск кнопки после полной загрузки DOM для экранов с viewport более 340px */
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth >= 340) {
    initScrollToTop()
  }
})
