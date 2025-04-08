// bootstrap.js
// Библиотека frameworks Bootstrap

// Import all of Bootstrap's JS
// import * as bootstrap from 'bootstrap'

// or
// Import just what we need
import Alert from 'bootstrap/js/dist/alert'
// import 'bootstrap/js/dist/button'
// import 'bootstrap/js/dist/carousel'
// import 'bootstrap/js/dist/collapse'
// import 'bootstrap/js/dist/dropdown'
// import 'bootstrap/js/dist/modal'
// import 'bootstrap/js/dist/offcanvas'
// import 'bootstrap/js/dist/popover'
// import 'bootstrap/js/dist/scrollspy'
// import 'bootstrap/js/dist/tab'
// import 'bootstrap/js/dist/toast'
// import 'bootstrap/js/dist/tooltip'

// Alert
const alertList = Array.from(document.querySelectorAll('.alert'))
const alert = () => [...alertList].map((element) => new Alert(element))
document.addEventListener('DOMContentLoaded', alert)

// Tooltip
// const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
// const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
