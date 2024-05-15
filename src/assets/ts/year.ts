/**
 * @name year
 * @description Set the current year to first copyright on page.
 */
export default function year(): void {
  let year: HTMLSpanElement | null = document.querySelector('.year')
  year ? (year.innerHTML = new Date().getFullYear().toString()) : console.log('Warning! Selector ".year" is out!')
}
